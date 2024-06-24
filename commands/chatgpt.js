import _ai from "lowline.ai";

export default {
    name: "chatgpt",
    aliases: ["ai", "lowline"],
    description: "Generate a response using AI",
    category: "tools",
    permissions: [],
    async execute(bot, ctx, input) {
        const {
            text
        } = input;
        if (!text) return ctx.reply("Give an argument!");

        try {
            const response = await _ai.generatePlaintext({
                prompt: text
            });
            const markdownResponse = await _ai.plaintextToMarkdown({
                text: response.result
            });

            return ctx.replyWithMarkdown(markdownResponse.result);
        } catch (error) {
            console.error("Error:", error);
            return ctx.reply(`[ ! ] Error: ${error.message}`);
        }
    },
};