const {
    _ai
} = require("lowline.ai");
const fs = require("fs/promises");
const path = require("path");

module.exports = {
    name: "setlanguage",
    aliases: ["setlang"],
    description: "Set language.",
    category: "profile",
    permissions: ["private"],
    action: "typing",
    async execute(bot, ctx, input, tools) {
        const userDb = await bot.config.db.get(`user.${ctx.message.from.id}`);
        const [userLanguage] = await Promise.all([
            bot.config.db.get(`user.${ctx.message.from.id}.language`)
        ]);

        if (!userDb) {
            bot.config.db.set(`user.${ctx.message.from.id}`, {
                coin: 10,
                language: "en",
                premium: false
            });
        }

        const {
            text
        } = input;
        if (!text) return ctx.reply(`⚠ ${await tools.msg.translate("Give an argument! Use 'list' in the argument to see the list of available languages.", userLanguage)}`);

        let lang;
        try {
            const list = await fs.readFile(path.join(__dirname, '../assets/lang.json'), 'utf8');
            lang = JSON.parse(list);
        } catch (error) {
            console.error("Error:", error);
            return ctx.reply(`⚠ ${await tools.msg.translate("Error reading language data.", userLanguage)}: ${error.message}`);
        }

        if (text === "list") {
            const format = Object.entries(lang).map(([code, name]) => `- ${code}: ${name}`).join('\n');

            return ctx.reply(format);
        }

        if (!Object.keys(lang).includes(text)) {
            return ctx.reply(`⚠ ${await tools.msg.translate("Invalid language code. Use 'list' to see available languages.", userLanguage)}`);
        }

        try {
            bot.config.db.set(`user.${ctx.message.from.id}.language`, text);

            return ctx.reply(`✅ ${await tools.msg.translate("Language changed successfully.", userLanguage)}`);
        } catch (error) {
            console.error("Error:", error);
            return ctx.reply(`⚠ ${await tools.msg.translate("Error", userLanguage)}: ${error.message}`);
        }
    }
};