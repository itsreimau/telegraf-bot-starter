module.exports = {
    name: "about",
    aliases: ["info"],
    description: "About bot",
    category: "info",
    permissions: [],
    action: "typing",
    execute: async (bot, ctx, input, tools) => {
        const [userLanguage] = await Promise.all([
            bot.config.db.get(`user.${ctx.message.from.id}.language`)
        ]);

        return ctx.reply(await tools.msg.translate("This starter template provides a foundation for building a Telegram bot using Telegraf and Express.", userLanguage));
    }
};