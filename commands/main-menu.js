const {
    Markup
} = require("telegraf");

module.exports = {
    name: "menu",
    aliases: ["help", "?"],
    description: "Shows help",
    category: "main",
    permissions: [],
    action: "typing",
    execute: async (bot, ctx, input, tools) => {
        const [userLanguage] = await Promise.all([
            bot.config.db.get(`user.${ctx.from.id}.language`)
        ]);

        try {
            const {
                cmd
            } = bot.config;
            const tags = {
                ai: "🤖 AI"
                profile: "👤 Profile",
                tools: "🛠️ Tools",
                info: "ℹ️ Info",
                "": "❓ No Category"
            };

            if (!cmd || cmd.size === 0) {
                return ctx.reply(`⚠ ${await tools.msg.translate("No commands found.", userLanguage)}`);
            }

            let caption = `👋 ${await tools.msg.translate(`Hey ${ctx.from.first_name}! This is a list of available commands`, userLanguage)}:\n`

            for (const [category, categoryName] of Object.entries(tags)) {
                const commands = cmd.filter(command => command.category === category);

                if (commands.size > 0) {
                    caption +=
                        "\n" +
                        `${categoryName}\n`;
                    for (const command of commands.values()) {
                        const description = await tools.msg.translate(command.description || "No description.", userLanguage);
                        caption += `> /${command.name} - ${description}\n`;
                    }
                }
            }

            caption +=
                "\n" +
                `👨‍💻 ${await tools.msg.translate("Developed by", userLanguage)} ItsReimau`;

            const button = Markup.inlineKeyboard([
                Markup.button.url("👨‍💻 Developer", "https://t.me/itsreimau")
            ]);

            return ctx.reply(caption, button);
        } catch (error) {
            console.error("Error:", error);
            return ctx.reply(`⚠ ${await tools.msg.translate("Error", userLanguage)}: ${error.message}`);
        }
    }
};