module.exports = {
    name: "about",
    aliases: ["info"],
    description: "About bot",
    category: "info",
    permissions: [],
    execute: async (bot, ctx) => {
        return ctx.reply("This starter template provides a foundation for building a Telegram bot using Telegraf and Express, designed for hosting on Adaptable.io.");
    }
};