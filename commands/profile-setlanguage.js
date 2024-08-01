const fs = require("fs/promises");
const path = require("path");

module.exports = {
    name: "setlanguage",
    aliases: ["setlang"],
    description: "Set language",
    category: "profile",
    permissions: ["private"],
    action: "typing",
    async execute(bot, ctx, input, tools) {
        const [userLanguage] = await Promise.all([
            bot.config.db.get(`user.${ctx.from.id}.language`)
        ]);

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
            bot.config.db.set(`user.${ctx.from.id}.language`, text);

            return ctx.reply(`✅ ${await tools.msg.translate("Language changed successfully.", userLanguage)}`);
        } catch (error) {
            console.error("Error:", error);
            return ctx.reply(`⚠ ${await tools.msg.translate("Error", userLanguage)}: ${error.message}`);
        }
    }
};