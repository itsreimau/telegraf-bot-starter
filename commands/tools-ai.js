import {
    _ai
} from "lowline.ai";

export default {
    name: "ai",
    aliases: ["chatgpt", "lowline"],
    description: "Repeat message",
    category: "tools",
    permissions: [],
    async execute(bot, ctx, input) {
        const {
            text
        } = input;
        if (!text) return ctx.reply("Give an argument!");

        try {
            const res = await _ai.generatePlaintext({
                prompt: input
            });

            return ctx.reply(res.result);
        } catch (error) {
            console.error("Error:", error);
            return ctx.reply(`[ ! ] Error: ${error.message}`);
        }
    }
};