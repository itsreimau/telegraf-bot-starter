module.exports = {
    name: "ping",
    aliases: [],
    description: "Check ping",
    category: "info",
    permissions: [],
    action: "typing",
    execute: async (bot, ctx, input, tools) => {
        return ctx.reply("Pong!");
    }
};