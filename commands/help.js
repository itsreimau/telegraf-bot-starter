export default {
    name: "help",
    category: "main",
    description: "Shows help",
    async execute(bot, ctx, input, param) {
        try {
            const {
                cmd
            } = bot.config;
            const tags = {
                "ai": "AI",
                "tools": "Tools",
                "info": "Info",
                "": "No Category"
            };

            if (!cmd || Object.keys(cmd).length === 0) {
                return ctx.replyWithMarkdown("**[ ! ]** Error: No commands found.");
            }

            let text = `==== telegraf-express-bot-starter ====\n\nHello, ${ctx.from.first_name}!\n`;

            for (const category in tags) {
                const commands = Object.values(cmd).filter(command => command.category === category);
                if (commands.length > 0) {
                    text += `--[ ${tags[category]} ]--\n`;
                    commands.forEach(command => {
                        text += `/${command.name} - ${command.description || "No description"}\n`;
                        text += "\n";
                    });
                }
            }

            text += "\n- Created by: ItsReimau -";

            return ctx.replyWithMarkdown(text);
        } catch (error) {
            console.error("Error:", error);
            return ctx.reply(`Error: ${error.text}`);
        }
    }
};