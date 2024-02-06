const express = require('express');
const {
    Telegraf
} = require('telegraf');
/* const {
    TelegrafCommandHandler
} = require('telegraf-command-handler-upgraded'); */
const path = require('path');

// Inisialisasi bot Telegram
const bot = new Telegraf(process.env.BOT_TOKEN);

// Inisialisasi aplikasi Express
const app = express();
const port = process.env.PORT || 3000;

// Tentukan fungsi async untuk menyiapkan webhook
const setupWebhook = async () => {
    await bot.createWebhook({
        domain: process.env.WEBHOOK_DOMAIN,
    });
};

// Gunakan fungsi async untuk menyiapkan webhook
app.use(async (req, res, next) => {
    await setupWebhook();
    next();
});

// Menangani perintah
/*
const CommandHandler = new TelegrafCommandHandler({
    path: path.resolve() + "/commands",
});
bot.use(CommandHandler.load());
*/

// Menangani pesan teks dari pengguna
bot.on('text', (ctx) => ctx.reply('Apa?'));

// Menjalankan server Express pada port yang telah ditentukan
app.listen(port, () => console.log('Listening on port', port));
