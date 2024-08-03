const fs = require("fs/promises");
const path = require("path");

module.exports = {
    name: "profile",
    aliases: ["prof", "profil"],
    description: "Get profile information",
    category: "profile",
    permissions: [],
    action: "upload_photo",
    async execute(bot, ctx, input, tools) {
        const [userLanguage, userPremium] = await Promise.all([
            bot.config.db.get(`user.${ctx.from.id}.language`),
            bot.config.db.get(`user.${ctx.from.id}.premium`)
        ]);

        let lang;
        try {
            const list = await fs.readFile(path.join(__dirname, '../assets/lang.json'), 'utf8');
            lang = JSON.parse(list);
        } catch (error) {
            console.error("Error:", error);
            return ctx.reply(`⚠ ${await tools.msg.translate("Error reading language data.", userLanguage)}: ${error.message}`);
        }

        try {
            let profile;
            try {
                const profilePhotos = await ctx.telegram.getUserProfilePhotos(ctx.from.id);
                profile = profilePhotos.photos[0][0].file_id;
            } catch {
                profile = "https://i.ibb.co/3Fh9V6p/avatar-contact.png";
            }

            const caption =
                "👤 Profile\n" +
                `- ID: ${ctx.from.id}\n` +
                `- ${await tools.msg.translate("Name", userLanguage)}: ${ctx.from.first_name} ${ctx.from.last_name || ''}\n` +
                `- ${await tools.msg.translate("Username", userLanguage)}: ${ctx.from.username}\n` +
                `- ${await tools.msg.translate("Language", userLanguage)}: ${lang[userLanguage] || userLanguage}\n` +
                `- Premium: ${await userPremium ? await tools.msg.translate("Yes", userLanguage) : await tools.msg.translate("No", userLanguage)}`;
            return await ctx.replyWithPhoto(profile, {
                caption
            });
        } catch (error) {
            console.error("Error:", error);
            return ctx.reply(`⚠ ${await tools.msg.translate("Error", userLanguage)}: ${error.message}`);
        }
    }
};