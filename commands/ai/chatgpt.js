const axios = require("axios");

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

        if (!text) return ctx.reply(`📌 Send a text!`);

        try {
            const apiUrl = tools.api.createUrl("btch", "/openai", {
                text
            });
            const {
                data
            } = await axios.get(apiUrl);

            return ctx.reply(data.result);
        } catch (error) {
            console.error("Error:", error);
            return ctx.reply(`⚠ An error occurred: ${error.message}`);
        }
    }
};