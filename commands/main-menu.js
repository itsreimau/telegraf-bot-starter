module.exports = {
    name: "menu",
    aliases: ["help", "?"],
    description: "Shows help",
    category: "main",
    permissions: [],
    execute: async (bot, ctx, input, tools) => {
        const [userLanguage] = await Promise.all([
            bot.config.db.get(`user.${ctx.message.from.id}.language`)
        ]);

        try {
            const {
                cmd
            } = bot.config;
            const tags = {
                tools: "🛠️ Tools",
                info: "ℹ️ Info",
                "": "❓ No Category"
            };

            if (!cmd || cmd.size === 0) {
                return ctx.reply(`⚠ ${await tools.msg.translate("Error: No commands found.", userLanguage)}`);
            }

            let text =
                `==== "telegraf-bot-starter ====\n` +
                "\n" +
                `👋 Hello, ${ctx.from.first_name}!\n`;

            for (const [category, categoryName] of Object.entries(tags)) {
                const commands = cmd.filter(command => command.category === category);

                if (commands.size > 0) {
                    text += `\n--[ ${categoryName} ]--\n`;
                    for (const command of commands.values()) {
                        const description = await tools.msg.translate(command.description || "No description", userLanguage);
                        text += `/${command.name} - ${description}\n`;
                    }
                }
            }

            text +=
                "\n" +
                `- 🛠️ ${await tools.msg.translate("Created by", userLanguage)}: ItsReimau -`;

            return ctx.reply(text);
        } catch (error) {
            console.error("Error:", error);
            return ctx.reply(`⚠ ${await tools.msg.translate("Error", userLanguage)}: ${error.message}`);
        }
    }
};