export default {
    name: "start",
    category: "main",
    description: "Starting bot",
    async execute(bot, ctx, input, param) {
        return ctx.reply("WELCOME! Use /help to see available commands.");
    }
};