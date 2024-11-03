module.exports = {
    name: "echo",
    aliases: ["say"],
    description: "Repeat message",
    category: "tools",
    permissions: [],
    action: "typing",
    async execute(bot, ctx, input, tools) {
        const {
            text
        } = input;

        if (!text) return ctx.reply(`📨 Send a text!`);

        try {
            return ctx.reply(text);
        } catch (error) {
            console.error("Error:", error);
            return ctx.reply(`❎ Error: ${error.message}`);
        }
    }
};