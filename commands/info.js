export default {
    name: "about",
    aliases: ["info"],
    category: "info",
    description: "About bot",
    async execute(bot, ctx, input, param) {
        return ctx.reply("This starter template provides a foundation for building a Telegram bot using Telegraf and Express, designed for hosting on Adaptable.io.");
    }
};