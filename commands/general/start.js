module.exports = {
    name: "start",
    aliases: [],
    description: "Starting bot",
    category: "main",
    permissions: [],
    action: "typing",
    execute: async (bot, ctx, input, tools) => {
        return ctx.reply("WELCOME! Use /help to see available commands.");
    }
};