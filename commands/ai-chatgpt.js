const {
    _ai
} = require("lowline.ai");

module.exports = {
    name: "chatgpt",
    aliases: ["lowline"],
    description: "Chat with AI",
    category: "ai",
    permissions: [],
    action: "typing",
    async execute(bot, ctx, input, tools) {
        const [userLanguage] = await Promise.all([
            bot.config.db.get(`user.${ctx.from.id}.language`)
        ]);
        const {
            text
        } = input;

        if (!text) {
            return ctx.reply(`⚠ ${await tools.msg.translate("Give an argument!", userLanguage)}`);
        }

        try {
            const res = await _ai.generatePlaintext({
                prompt: text
            });

            return ctx.reply(res.result);
        } catch (error) {
            console.error("Error:", error);
            return ctx.reply(`⚠ ${await tools.msg.translate("Error", userLanguage)}: ${error.message}`);
        }
    }
};