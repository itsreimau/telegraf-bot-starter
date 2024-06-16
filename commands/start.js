export default {
    name: "start",
    async execute(bot, ctx, input, param) {
        return ctx.reply("WELCOME! Use /help to see available commands.");
    }
};