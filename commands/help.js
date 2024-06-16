export default {
    name: "help",
    aliases: ["menu", "?"],
    category: "main",
    async execute(bot, ctx, input, param) {
        try {
            const {
                cmd
            } = bot.config;
            const tags = {
                "ai": "AI",
                "info": "Info",
                "general": "General"
            };

            if (!cmd || Object.keys(cmd).length === 0) {
                return ctx.replyWithMarkdown("**[ ! ]** Error: No commands found.");
            }

            let text = "> COMMAND LIST\n\n";

            for (const category in tags) {
                const commands = Object.values(cmd).filter(command => command.category === category);
                if (commands.length > 0) {
                    text += `[${tags[category]}]----\n`;
                    commands.forEach(command => {
                        text += `/${command.name} - ${command.description || "No description"}\n`;
                        text += "------------\n";
                    });
                }
            }

            text += "\n_Created by: @itsreimau_";

            return ctx.replyWithMarkdown(text);
        } catch (error) {
            console.error("Error:", error);
            return ctx.reply(`Error: ${error.text}`);
        }
    }
};