export default {
    name: 'echo',
    async execute(ctx) {
        const args = ctx.message.text.split(' ').slice(1).join(' ');

        if (!args) return ctx.reply('Give an argument!');

        try {
            ctx.reply(args);
        } catch (error) {
            console.error('Error:', error);
            return ctx.reply(`Error: ${error.message}`);
        }
    }
};