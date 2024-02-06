export default {
    name: 'echo',
    async execute(ctx) {
        const args = ctx.message.text.split(' ').slice(1).join(' ');

        if (args) {
            ctx.reply(args);
        } else {
            ctx.reply('Give an argument!');
        }
    },
};