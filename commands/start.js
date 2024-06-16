export default {
    name: "start",
    async execute(bot, ctx, input, param) {
        const welcomeMessage = `Welcome to the bot! Use /help to see available commands.`;
        return ctx.reply(welcomeMessage);
    }
};