module.exports = {
    name: "dalle",
    aliases: ["aiimg"],
    description: "Chat with AI",
    category: "ai",
    permissions: [],
    action: "typing",
    async execute(bot, ctx, input, tools) {
        const [userLanguage] = await Promise.all([
            bot.config.db.get(`user.${ctx.from.id}.language`)
        ]);
        const {
            text
        } = input;

        if (!text) {
            return ctx.reply(`⚠ ${await tools.msg.translate("Give an argument!", userLanguage)}`);
        }

        try {
            const apiUrl = tools.api.createUrl("widipe", `/dalle`, {
                text
            });

            const caption =
                "🖼 DALL·E\n" +
                `- Prompt: ${input}`;
            return await ctx.replyWithPhoto(apiUrl, {
                caption
            });
        } catch (error) {
            console.error("Error:", error);
            return ctx.reply(`${bold("[ ! ]")} Terjadi kesalahan: ${error.message}`);
        }
    }
};