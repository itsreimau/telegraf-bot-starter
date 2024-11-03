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
        const {
            text
        } = input;

        if (!text) return ctx.reply(`📨 Send a text!`);

        try {
            const res = await _ai.generatePlaintext({
                prompt: text
            });

            return ctx.reply(res.result);
        } catch (error) {
            console.error("Error:", error);
            return ctx.reply(`❎ Error: ${error.message}`);
        }
    }
};