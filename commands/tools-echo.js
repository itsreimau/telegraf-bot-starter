module.exports = {
    name: "echo",
    aliases: ["say"],
    description: "Repeat message",
    category: "tools",
    permissions: [],
    async execute(bot, ctx, input, tools) {
        const [userLanguage] = await Promise.all([
            bot.config.db.get(`user.${ctx.message.from.id}.language`)
        ]);

        const {
            text
        } = input;
        if (!text) return ctx.reply(`⚠ ${await tools.msg.translate("Give an argument!", userLanguage)}`);
\
        try {
            return ctx.reply(text);
        } catch (error) {
            console.error("Error:", error);
            return ctx.reply(`⚠ ${await tools.msg.translate("Error", userLanguage)}: ${error.message}`);
        }
    }
};