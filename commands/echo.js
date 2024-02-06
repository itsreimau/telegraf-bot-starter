module.exports = {
    name: 'echo',
    aliases: ['say'],
    async execute(ctx, args) {
        ctx.reply(args.join(' '))
    }
}
