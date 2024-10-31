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
        const {
            cmd
        } = bot.config;
        const tags = {
            ai: "🤖 AI",
            profile: "👤 Profile",
            tools: "🛠️ Tools",
            information: "ℹ️ Information",
            misc: "❓ Miscellaneous"
        };

        if (!cmd || cmd.size === 0) {
            return ctx.reply(`❎ No commands found.`);
        }

        try {
            let caption = `👋 Hey ${ctx.from.first_name}! This is a list of available commands:\n`
            for (const [category, categoryName] of Object.entries(tags)) {
                const commands = cmd.filter(command => command.category === category);

                if (commands.size > 0) {
                    caption +=
                        "\n" +
                        `${categoryName}\n`;
                    for (const command of commands.values()) {
                        const description = command.description || "No description.";
                        caption += `> /${command.name} - ${description}\n`;
                    }
                }
            }
            caption +=
                "\n" +
                `👨‍💻 Developed by ItsReimau`;
            const button = Markup.inlineKeyboard([
                Markup.button.url("👨‍💻 Developer", "https://t.me/itsreimau")
            ]);

            return ctx.reply(caption, button);
        } catch (error) {
            console.error("Error:", error);
            return ctx.reply(`❎ Error: ${error.message}`);
        }
    }
};