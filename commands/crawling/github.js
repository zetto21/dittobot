const fetch = require("node-fetch");
const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "github",
    aliases: ["깃허브", "깃헙", "햐소ㅕㅠ", "rltgjqm", "rltgjq"],
    usage: "디토야 깃허브 <유저이름>",
    category: "crawling",
    run: async (client, message, args, ops) => {
        if (!args.join(" ")) return;

        const { login, avatar_url, location, created_at, followers, following, email, blog, html_url, bio, public_repos, public_gists, type } = await fetch(`https://api.github.com/users/${encodeURI(args.join(" "))}`).then(e => e.json());

        if (!login) return message.channel.send(`\`${args.join(" ")}\` (이)라는 유저를 찾을 수 없습니다...`);

        message.channel.send(new MessageEmbed().setTitle(`${login}님의 정보`).setColor(0x000000).setAuthor("Github", "https://github.githubassets.com/favicons/favicon.png", "https://github.com/").setFooter(login, avatar_url).setDescription(`[들어가기](${html_url})`).setThumbnail(avatar_url)
        .addFields([
            {name: "이름", value: `**${login}**`, inline: true},
            {name: "상태 메세지", value: `**${bio ? bio : "없음"}**`},
            {name: "지역", value: `**${location ? location : "없음"}**`, inline: true},
            {name: "계정", value: `**${accountType[type]}**`},
            {name: "레포지토리", value: `**${public_repos ? `${public_repos}개` : "없음"}**`, inline: true},
            {name: "Gist", value: `**${public_gists ? `${public_gists}개` : "없음"}**`, inline: true},
            {name: "블로그", value: `**${blog ? blog : "없음"}**`, inline: true},
            {name: "이메일", value: `**${email ? email : "없음"}**`, inline: true},
            {name: "팔로워", value: `**${followers ? `${followers}명` : "없음"}**`, inline: true},
            {name: "팔로잉", value: `**${following ? `${following}명` : "없음"}**`, inline: true},
            {name: "가입 날짜", value: `**${ops.formatTime(created_at)}**`}
        ]))
    }
}

const accountType = {
    User: "유저",
    Organization: "공식"
}