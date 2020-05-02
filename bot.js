require("dotenv").config();

const { Client, Collection } = require("discord.js");
const { readdirSync } = require("fs");
const chalk = require("chalk");

const { VultrexDB } = require('vultrex.db');

const db = new VultrexDB({
	provider: "sqlite",
	table: "db/main",
	fileName: "db/main"
});

const tagDb = new VultrexDB({
	provider: "sqlite",
	table: "db/tag",
	fileName: "db/tag"
});

const client = new Client();

client.commands = new Collection();
client.aliases = new Collection();
client.cooldowns = new Collection();
client.categories = readdirSync("./commands/");
client.musicManager = null;
client.db = null;
client.tagDb = null;
client.inspect = !1;

const table = (new(require('ascii-table'))).setHeading("Command", "Status")

readdirSync("./commands/").forEach(dir => {
	for (let file of readdirSync(`./commands/${dir}`).filter(f => f.endsWith(".js"))) {
		let pull = require(`./commands/${dir}/${file}`);

		if (pull.name) {
			client.commands.set(pull.name, pull);
			table.addRow(file, '✅');
		} else {
			table.addRow(file, '❌');
		};

		if (pull.aliases && Array.isArray(pull.aliases)) pull.aliases.forEach(a => client.aliases.set(a, pull.name));
	};
});

process.on('unhandledRejection', console.error)
	.on("uncaughtException", console.error)
	.on('warning', console.warn)
	.on('exit', console.log);

client.login();

db.connect().then(() => console.log('db is connected'));
tagDb.connect().then(() => console.log('tag DB is connected'))

client.on("ready", () => {
	console.log(`${table.toString()}\nLogin ${client.user.username}\n----------------------------`);

	const activity = [`${client.guilds.cache.size}개의 서버`, `${client.users.cache.filter(e => !e.bot).size}명의 유저`, `${client.guilds.cache.size} guilds`, `${client.users.cache.filter(e => !e.bot).size} users`, `https://is.gd/dittoBot`];

	if (!client.inspect) {
		setInterval(() => {
			client.user.setActivity(activity[Math.floor(Math.random() * activity.length)]);
		}, 10000)
	} else {
		client.user.setActivity('점검중');
		client.user.setStatus('dnd')
	};

	const MusicManager = require('./structures/MusicManager');
	client.musicManager = new MusicManager(client);
	client.db = db;
	client.tagDb = tagDb
})
.on("message", async message => {
	if (message.system || !message.content.startsWith(process.env.PREFIX) || (client.inspect && (message.author.id !== process.env.OWNER_ID))) return;
	if (message.author.bot && !(message.author.id === '685095151991128070')) return;

	if (message.channel.type === 'dm' && (message.author.id !== process.env.OWNER_ID)) {
		message.channel.send(`DM에서는 ${client.user.username}을(를) 사용하실 수 없습니다.\n${client.user.username}이(가) 있는 서버에서 사용해 주세요.`);
		return console.log(`${chalk.green('DM Message')} ${message.author.username} (${message.author.id}): ${message.content}`)
	}

	if (message.channel.type === 'text' && (message.author.id !== process.env.OWNER_ID)) console.log(`${chalk.yellow('Message')} ${message.author.username} (${message.author.id}): ${message.content} | GUILD: ${message.guild.name} (${message.guild.id}) | CHANNEL: ${message.channel.name} (${message.channel.id})`);

	if (!message.guild.me.hasPermission('EMBED_LINKS')) return message.channel.send(`${client.user.username}을(를) 원활하게 이용하실려면 **EMBED_LINKS**(링크 보내기) 권한이 필요합니다!`)

	const args = message.content.slice(process.env.PREFIX.length).trim().split(/ +/g)
	const cmd = args.shift().toLowerCase();
	const command = client.commands.get(cmd) || client.commands.get(client.aliases.get(cmd));

	try {
		const ops = {
			ownerID: process.env.OWNER_ID,
			prefix: process.env.PREFIX,
			season: 2
		};

		if (command) {
			// Pod 오픈소스
			
			if (!client.cooldowns.has(command.name)) {
				client.cooldowns.set(command.name, new Collection());
			}
		
			const now = Date.now();
			const timestamps = client.cooldowns.get(command.name);
			const cooldownAmount = (command.cooldowns) * 1000;
		
			if (timestamps.has(message.author.id) && (message.author.id !== process.env.OWNER_ID)) {
				const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
		
				if (now < expirationTime) {
					const timeLeft = (expirationTime - now) / 1000;
					return message.channel.send(`\`${timeLeft.toFixed(1)}\`초 후에 \`${command.name}\` 명령어를 다시 사용하실 수 있습니다.`)
				}
			};
		
			timestamps.set(message.author.id, now);
			setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

			if (command.developer && (message.author.id !== process.env.OWNER_ID)) return message.channel.send(`\`${client.user.username} 개발자\`만 가능합니다.`);
			command.run(client, message, args, ops)
		} else {
			require("node-fetch")(`https://builder.pingpong.us/api/builder/${process.env.pingpong}/integration/v0.2/custom/${message.author.id}`, {
				method: 'POST',
				headers: {
					'Authorization': `Basic ${process.env.Authorization}`,
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					request: {
						query: cmd
					}
				})
			}).then(r => r.json()).then(({ response: { replies: [{ text }] } }) => {
				message.channel.send(text)
			})
		}
	} catch {
		console.error
	}
})
.on('guildCreate', guild => {
	console.log(`${chalk.blue('Guild Create')} name: ${guild.name} (${guild.id}), owner: ${guild.owner.user.tag} (${guild.ownerID})`)
})
.on('guildDelete', guild => {
	console.log(`${chalk.red('Guild Delete')} name: ${guild.name} (${guild.id}), onwer: ${guild.owner.user.tag} (${guild.ownerID})`)
})
.on('rateLimit', rateLimit => {
	console.log(`${chalk.blueBright('RateLimit')} limit: ${rateLimit.limit}, timeout: ${rateLimit.timeout}, method: ${rateLimit.method}, route: ${rateLimit.route}`)
})
.on('error', console.error)
.on('warn', console.warn);