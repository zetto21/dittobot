const fetch = require("node-fetch")

module.exports = {
    name: "diro",
    aliases: ["디로", "야개", "elfh"],
    category: "command",
    run: async (client, message, args) => {
        if (!args[0]) return message.channel.send("단축할 URL을 입력해 주세요!")

        const res = await fetch("https://diro.ml/api/create", {
            method: "POST",
            body: JSON.stringify({
                url: args[0],
                custom: args[1] ? args[1] : null
            }),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(e => e.json())

        message.channel.send(res.error ? res.result : `https://diro.ml/${res.result}`)
    }
}