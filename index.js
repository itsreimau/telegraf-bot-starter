const express = require('express');
const {
    Telegraf
} = require('telegraf');

// Inisialisasi bot Telegram
const bot = new Telegraf(process.env.BOT_TOKEN);

// Inisialisasi aplikasi Express
const app = express();
const port = process.env.PORT || 3000; // Port untuk server, dapat diatur melalui environment variable atau default ke 3000

// Mengatur endpoint API bot
app.use(await bot.createWebhook({
    domain: process.env.WEBHOOK_DOMAIN
}));

// Menangani perintah
const CommandHandler = new TelegrafCommandHandler({
    path: path.resolve() + "/commands",
});
bot.use(CommandHandler.load());

// Menangani pesan teks dari pengguna
bot.on('text', (ctx) => ctx.reply('Apa?'));

// Menjalankan server Express pada port yang telah ditentukan
app.listen(port, () => console.log('Listening on port', port));
