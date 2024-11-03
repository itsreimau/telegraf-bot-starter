module.exports = {
    name: "about",
    aliases: ["information"],
    description: "About bot",
    category: "information",
    permissions: [],
    action: "typing",
    execute: async (bot, ctx, input, tools) => {
        return ctx.reply("This starter template provides a foundation for building a Telegram bot using Telegraf and Express.");
    }
};