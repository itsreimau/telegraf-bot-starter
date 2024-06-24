export default {
    name: "echo",
    aliases: ["say"],
    description: "Repeat message",
    category: "tools",
    permissions: [],
    async execute(bot, ctx, input) {
        const {
            text
        } = input;
        if (!text) return ctx.reply("Give an argument!");

        try {
            return ctx.reply(text);
        } catch (error) {
            console.error("Error:", error);
            return ctx.reply(`[ ! ] Error: ${error.message}`);
        }
    }
};