export default {
    name: "ping",
    aliases: [],
    description: "Check ping",
    category: "info",
    permissions: [],
    async execute(bot, ctx) {
        return ctx.reply("Pong!");
    }
};