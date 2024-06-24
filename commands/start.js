export default {
    name: "start",
    aliases: [],
    description: "Starting bot",
    category: "main",
    permissions: [],
    async execute(bot, ctx) {
        return ctx.reply("WELCOME! Use /help to see available commands.");
    }
};