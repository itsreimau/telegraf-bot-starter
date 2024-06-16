export default {
    name: "help",
    aliases: ["menu", "?"],
    category: "main",
    async execute(bot, ctx, input, param) {
        const {
            cmd
        } = ctx.config;
        const tags = {
            "ai": "AI",
            "info": "Info",
            "": "No Category"
        };

        if (!cmd || Object.keys(cmd).length === 0) {
            return ctx.replyWithMarkdown("**[ ! ]** Error: No commands found.");
        }

        let message = "> COMMAND LIST\n\n";

        const commands = Object.values(cmd).filter(command => command.category === ctx.config.category);

        if (commands.length > 0) {
            message += `[${tags[commands.category]}]----\n`;
            commands.forEach(command => {
                message += `/${command.name} - ${command.description}\n`;
                message += "------------\n";
            });
        } else {
            message += "No commands found in this category.\n";
        }

        message += "\n_Created by: @itsreimau_";

        try {
            return ctx.replyWithMarkdown(message);
        } catch (error) {
            console.error("Error:", error);
            return ctx.reply(`Error: ${error.message}`);
        }
    }
};