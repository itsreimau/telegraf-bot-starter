module.exports = {
    name: "start",
    aliases: [],
    description: "Starting bot",
    category: "main",
    permissions: [],
    action: "typing",
    execute: async (bot, ctx, input, tools) => {
        const [userLanguage] = await Promise.all([
            bot.config.db.get(`user.${ctx.from.id}.language`)
        ]);

        if (!userDb) {
            await bot.config.db.set(`user.${ctx.from.id}`, {
                language: ctx.from.language_code,
                premium: false
            });
        }

        return ctx.reply(await tools.msg.translate("WELCOME! Use /help to see available commands.", userLanguage || ctx.from.language_code));
    }
};