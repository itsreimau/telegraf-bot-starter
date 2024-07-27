const {
    _ai
} = require("lowline.ai");

module.exports = {
    name: "ai",
    aliases: ["chatgpt", "lowline"],
    description: "Chat with AI",
    category: "tools",
    permissions: [],
    async execute(bot, ctx, input, tools) {
        const {
            text
        } = input;
        if (!text) return ctx.reply(`${tools.format.bold("[ ! ]")} ${tools.msg.translate("Give an argument!", userLanguage)}`);

        try {
            const res = await _ai.generatePlaintext({
                prompt: text
            });

            return ctx.reply(res.result);
        } catch (error) {
            console.error("Error:", error);
            return ctx.reply(`${tools.format.bold("[ ! ]")} ${tools.msg.translate("Error", userLanguage)}: ${error.message}`);
        }
    }
};