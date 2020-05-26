const { MessageEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");

module.exports = {
    name: "help",
    aliases: ["도움", "ㅗ디ㅔ", "ehdna", "도움말"],
    category: "command",
    usage: "디토야 도움 | 디토야 도움 [명령어 이름]",
    description: 'help command',
    run: async (client, message, args, ops) => {
        if (args.join(' ')) {
            const embed = new MessageEmbed();
        
            const cmd = client.commands.get(args.join(" ").toLowerCase()) || client.commands.get(client.aliases.get(args.join(" ").toLowerCase()));
        
            let info = '';
        
            if (!cmd) return message.channel.send(embed.setColor(0xff0000).setTitle(`**${args.join(" ").toLowerCase()}**에 대한 명령어를 찾을 수 없습니다.`));
        
            if (cmd.name) embed.setTitle(`${cmd.name} 명령어 정보`);
            if (cmd.aliases) info = `\n**별칭**\n${cmd.aliases.map(a => `${a}`).join(", ")}\n`;
            if (cmd.description) info += `\n**설명**\n${cmd.description}\n`;
            if (cmd.usage) {
                info += `\n**사용 방법**\n${cmd.usage}\n`;
                embed.setFooter(`<> = 필수, [] = 선택, | = 또는`)
            }
            if (cmd.category) info += `\n**카테고리**\n${category[cmd.category]}`;
        
            message.channel.send(embed.setDescription(info).setColor(0x00ff00))
        } else {
            const commandEmbed = new MessageEmbed().setColor(0x00ff00).setTitle(`${client.user.username} 도움말`).setFooter(`${ops.prefix} 도움 <명령어 이름> 으로 더 자세히 아실 수 있습니다.`);
        
            const commands = category => client.commands.filter(cmd => cmd.category === category).map(cmd => `\`${commandName[cmd.name]}\``).join(", ");
        
            const info = client.categories.filter(n => n !== "owner").map(a => stripIndents`**${category[a[0].toLowerCase() + a.slice(1)]}**\n${commands(a)}`).reduce((s, c) => `${s}\n\n${c}`)

            message.channel.send(commandEmbed.setDescription(info))
        }
    }
}

const category = {
    'botinfo': '봇정보',
    'command': '커맨드',
    'crawling': '크롤링',
    'information': '정보',
    'moderation': '관리',
    'money': '돈',
    'music': '음악',
    'naver': '네이버'
}

const commandName = {
    'botinfo': '봇정보',
    'ping': '핑',
    'system': '시스템',
    'email': '이메일',
    'help': '도움',
    'invite': '초대링크',
    'lyrics': '가사',
    'profile': '프사',
    'rps': '가위바위보',
    'say': '말해',
    'serverlist': '서버목록',
    'suggestion': '건의',
    'tag': '태그',
    'urlshorten': '단축',
    'covid-19': '코로나19',
    'disaster': '재난문자',
    'docs': 'docs',
    'entry': '엔트리',
    'github': '깃허브',
    'hangang': '한강',
    'instar': '인스타',
    'melonchart': '멜론차트',
    'namuwiki': '나무위키',
    'repository': '레포지토리',
    'channelinfo': '채널정보',
    'serverinfo': '서버정보',
    'userinfo': '유저정보',
    'ban': '차단',
    'clear': '삭제',
    'kick': '추방',
    'unban': '언밴',
    'loop': '반복',
    'loopqueue': '대기열반복',
    'nowplaying': '현재곡',
    'pause': '일시정지',
    'play': '재생',
    'queue': '대기열',
    'remove': '제거',
    'resume': '다시재생',
    'scplay': '사운드클라우드',
    'seek': 'seek',
    'shuffle': 'shuffle',
    'skip': '스킵',
    'skipto': '이동',
    'stop': '정지',
    'volume': '볼륨',
    '네이버실검': '네이버실검',
    'papago': '파파고',
    'papagolang': '언어감지',
    'weather': '날씨'
}