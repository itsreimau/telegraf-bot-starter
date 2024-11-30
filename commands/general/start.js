module.exports = {
    name: "start",
    aliases: [],
    description: "Starting bot",
    category: "main",
    permissions: [],
    action: "typing",
    execute: async (bot, ctx, input, tools) => {
        const userDb = await bot.config.db.get(`user.${ctx.from.id}`);
        if (!userDb) {
            await bot.config.db.set(`user.${ctx.from.id}`, {
                premium: false
            });
        }

        return ctx.reply("WELCOME! Use /help to see available commands.");
    }
};