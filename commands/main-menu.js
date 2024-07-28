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
                tools: "Tools",
                info: "Info",
                "": "No Category"
            };

            if (!cmd || cmd.size === 0) {
                return ctx.replyWithMarkdown(`${tools.format.markdown.bold("[ ! ]")} ${tools.msg.translate("Error: No commands found.", userLanguage)}`);
            }

            let text =
                `==== ${tools.format.markdown.bold("telegraf-bot-starter"} ====\n` +
                "\n" +
                `Hello, ${ctx.from.first_name}!\n`;

            for (const [category, categoryName] of Object.entries(tags)) {
                const commands = cmd.filter(command => command.category === category);

                if (commands.size > 0) {
                    text += `\n--[ ${categoryName} ]--\n`;
                    commands.forEach(command => {
                        text += `/${command.name} - ${command.description || "No description"}\n`;
                    });
                }
            }

            text +=
                "\n" +
                `- ${tools.msg.translate("Created by", userLanguage)}: ItsReimau -`;

            return ctx.replyWithMarkdown(text);
        } catch (error) {
            console.error("Error:", error);
            return ctx.replyWithMarkdown(`${tools.format.markdown.bold("[ ! ]")} ${tools.msg.translate("Error", userLanguage)}: ${error.message}`);
        }
    }
};