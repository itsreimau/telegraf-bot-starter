module.exports = {
    name: "start",
    aliases: [],
    description: "Starting bot",
    category: "main",
    permissions: [],
    execute: async (bot, ctx) => {
        return ctx.reply("WELCOME! Use /help to see available commands.");
    }
};