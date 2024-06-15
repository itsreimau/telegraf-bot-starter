import express from "express";
import {
    Telegraf
} from "telegraf";
import fs from "fs/promises";
import path from "path";
import {
    exec
} from "child_process";
import {
    inspect
} from "util";

// Validate environment variables
const requiredEnvVars = ["BOT_TOKEN", "OWNER_ID", "WEBHOOK_DOMAIN"];
requiredEnvVars.forEach((envVar) => {
    if (!process.env[envVar]) throw new Error(`'${envVar}' env var is required!`);
});

const {
    BOT_TOKEN,
    OWNER_ID,
    WEBHOOK_DOMAIN,
    PORT = 3000
} = process.env;

// Initialize bot
const bot = new Telegraf(BOT_TOKEN);

// Initialize the Express application
const app = express();
const port = Number(PORT);

// Use middleware to parse incoming JSON requests
app.use(express.json());

// Set the bot API endpoint
const webhook = await bot.createWebhook({
    domain: WEBHOOK_DOMAIN
});
app.use(webhook);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Something went wrong!");
});

// Handle commands dynamically from the "commands" directory
const __dirname = path.dirname(new URL(import.meta.url).pathname);
fs.readdir(path.join(__dirname, "commands")).then((commandFiles) => {
    commandFiles.forEach(async (file) => {
        const commandModule = await import(`./commands/${file}`);
        const {
            name,
            aliases = [],
            execute
        } = commandModule.default;
        bot.command(name, (ctx) => execute(ctx, ctx.message.text.split(" ").slice(1).join(" ")));
        aliases.forEach((alias) => {
            bot.command(alias, (ctx) => execute(ctx, ctx.message.text.split(" ").slice(1).join(" ")));
        });
    });
}).catch((error) => console.error("Failed to load commands:", error));

// Handle eval code
bot.hears(/^([x>])\s+(.+)/, async (ctx) => {
    if (parseInt(ctx.message.from.id) !== parseInt(OWNER_ID)) return;

    try {
        const code = ctx.match[2];
        const result = await eval(ctx.match[1] === "x" ? `(async () => { ${code} })()` : code);

        return await ctx.reply(inspect(result));
    } catch (error) {
        console.error("Error:", error);
        return ctx.reply(`[ ! ] Error occurred: ${error.message}`);
    }
});

// Handle shell command
bot.hears(/^\$\s+(.+)/, async (ctx) => {
    if (parseInt(ctx.message.from.id) !== parseInt(OWNER_ID)) return;

    try {
        const command = ctx.match[1];

        const output = await new Promise((resolve, reject) => {
            exec(command, (error, stdout, stderr) => {
                if (error) {
                    reject(new Error(`Error: ${error.message}`));
                } else if (stderr) {
                    reject(new Error(stderr));
                } else {
                    resolve(stdout);
                }
            });
        });

        return await ctx.reply(output);
    } catch (error) {
        console.error("Error:", error);
        return ctx.reply(`[ ! ] Error occurred: ${error.message}`);
    }
});

// Start the Express server
app.listen(port, () => console.log(`Listening on port ${port}`));