export default {
    name: "echo",
    aliases: ["say"],
    async execute(ctx, args) {
        if (!args) return ctx.reply("Give an argument!");

        try {
            return ctx.reply(args);
        } catch (error) {
            console.error("Error:", error);
            return ctx.reply(`Error: ${error.message}`);
        }
    }
};