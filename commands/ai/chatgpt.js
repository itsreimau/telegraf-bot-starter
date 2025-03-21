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
            const apiUrl = tools.api.createUrl("fast", "/aillm/gpt-4", {
                ask: text
            });
            const result = (await axios.get(apiUrl)).data.result;

            return ctx.reply(result);
        } catch (error) {
            console.error("Error:", error);
            return ctx.reply(`⚠ An error occurred: ${error.message}`);
        }
    }
};