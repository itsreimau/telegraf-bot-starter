const {
    _ai
} = require("lowline.ai");

module.exports = {
    name: "ai",
    aliases: ["chatgpt", "lowline"],
    description: "Chat with AI",
    category: "tools",
    permissions: [],
    async execute(bot, ctx, input) {
        const {
            text
        } = input;
        if (!text) return ctx.reply("Give an argument!");

        try {
            const res = await _ai.generatePlaintext({
                prompt: text
            });

            return ctx.reply(res.result);
        } catch (error) {
            console.error("Error:", error);
            return ctx.reply(`[ ! ] Error: ${error.message}`);
        }
    }
};