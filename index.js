import express from "express";
import {
    Telegraf
} from "telegraf";

// Initialize Telegram bot
const bot = new Telegraf(process.env.BOT_TOKEN);

// Initialize the Express application
const app = express();
const port = process.env.PORT || 3000;

// Use middleware to parse incoming JSON requests
app.use(express.json());

// Set the bot API endpoint
app.use(
    await bot.createWebhook({
        domain: process.env.WEBHOOK_DOMAIN,
    })
);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Something went wrong!");
});

// Handle text messages from users
bot.on("text", (ctx) => ctx.reply("Active!"));

// Runs an Express server on a specified port
app.listen(port, () => console.log("Listening on port", port));
