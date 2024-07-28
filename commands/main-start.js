module.exports = {
    name: "start",
    aliases: [],
    description: "Starting bot",
    category: "main",
    permissions: [],
    execute: async (bot, ctx, input, tools) => {
        const userDb = await bot.config.db.get(`user.${ctx.message.from.id}`);
        const [userLanguage] = await Promise.all([
            bot.config.db.get(`user.${ctx.message.from.id}.language`)
        ]);

        if (!userDb) {
            bot.config.db.set(`user.${ctx.message.from.id}`, {
                coin: 10,
                language: "en",
                premium: false
            });
        }

        return ctx.reply(tools.msg.translate("WELCOME! Use /help to see available commands.", userLanguage || "en"));
    }
};