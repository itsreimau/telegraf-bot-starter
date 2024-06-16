export default {
    name: "echo",
    aliases: ["say"],
    category: "tools",
    description: "Repeat message",
    async execute(bot, ctx, input, param) {
        if (!input) return ctx.reply("Give an argument!");

        try {
            return ctx.reply(input);
        } catch (error) {
            console.error("Error:", error);
            return ctx.reply(`Error: ${error.message}`);
        }
    }
};