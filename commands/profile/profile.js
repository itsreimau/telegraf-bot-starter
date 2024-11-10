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
        const [userPremium] = await Promise.all([
            bot.config.db.get(`user.${ctx.from.id}.premium`)
        ]);

        try {
            let userProfilePhotos;
            try {
                const getuserProfilePhotos = await ctx.telegram.getuserProfilePhotos(ctx.from.id);
                userProfilePhotos = getuserProfilePhotos.photos[0][0].file_id;
            } catch (error) {
                userProfilePhotos = "https://i.ibb.co/3Fh9V6p/avatar-contact.png";
            }

            const caption =
                "👤 Profile\n" +
                `- ID: ${ctx.from.id}\n` +
                `- Name: ${ctx.from.first_name} ${ctx.from.last_name || ""}\n` +
                `- Username: ${ctx.from.username}\n` +
                `- Premium: ${userPremium ? "Yes" : "No"}`;
            return ctx.replyWithPhoto(userProfilePhotos, {
                caption
            });
        } catch (error) {
            console.error("Error:", error);
            return ctx.reply(`⚠ An error occurred: ${error.message}`);
        }
    }
};