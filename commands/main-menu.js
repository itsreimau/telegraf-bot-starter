export default {
    name: "menu",
    aliases: ["help", "?"],
    description: "Shows help",
    category: "main",
    permissions: [],
    async execute(bot, ctx) {
        try {
            const {
                cmd
            } = bot.config;
            const tags = {
                tools: "Tools",
                info: "Info",
                "": "No Category"
            };

            if (!cmd || Object.keys(cmd).length === 0) {
                return ctx.replyWithMarkdown("**[ ! ]** Error: No commands found.");
            }

            let text = `==== **telegraf-express-bot-starter** ====\n\nHello, ${ctx.from.first_name}!\n`;

            Object.keys(tags).forEach((category) => {
                const commands = Object.values(cmd).filter((command) => command.category === category);
                if (commands.length > 0) {
                    text += `\n--[ ${tags[category]} ]--\n`;
                    commands.forEach((command) => {
                        text += `/${command.name} - ${command.description || "No description"}\n`;
                    });
                }
            });

            text += `\n- Created by: ItsReimau -`;

            return ctx.replyWithMarkdown(text);
        } catch (error) {
            console.error("Error:", error);
            return ctx.reply(`[ ! ] Error: ${error.message}`);
        }
    }
};