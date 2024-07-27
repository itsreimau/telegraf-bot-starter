module.exports = {
    name: "echo",
    aliases: ["say"],
    description: "Repeat message",
    category: "tools",
    permissions: [],
    async execute(bot, ctx, input, tools) {
        const {
            text
        } = input;
        if (!text) return ctx.reply(`${tools.format.bold("[ ! ]"} ${tools.msg.translate("Give an argument!", userLanguage)}`);

        try {
            return ctx.reply(text);
        } catch (error) {
            console.error("Error:", error);
            return ctx.reply(`${tools.format.bold("[ ! ]"} ${tools.msg.translate("Error", userLanguage)}: ${error.message}`);
        }
    }
};