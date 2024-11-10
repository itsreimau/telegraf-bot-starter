module.exports = {
    name: "dalle",
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
            const apiUrl = tools.api.createUrl("widipe", "/dalle", {
                text: input
            });

            return ctx.replyWithPhoto(apiUrl);
        } catch (error) {
            console.error("Error:", error);
            return ctx.reply(`⚠ An error occurred: ${error.message}`);
        }
    }
};