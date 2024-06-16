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
import dotenv from "dotenv";

dotenv.config();

// Validate environment variables
const {
    BOT_TOKEN,
    OWNER_ID,
    WEBHOOK_DOMAIN,
    PORT = 3000
} = process.env;
if (!BOT_TOKEN || !OWNER_ID || !WEBHOOK_DOMAIN) {
    throw new Error("Required environment variables are not provided!");
}

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

// Initialize command config
const commandConfig = {};

// Load commands dynamically from the "commands" directory
const __dirname = path.dirname(new URL(import.meta.url).pathname);
fs.readdir(path.join(__dirname, "commands")).then((commandFiles) => {
    commandFiles.forEach(async (file) => {
        const commandModule = await import(`./commands/${file}`);
        const {
            name,
            aliases = [],
            category = "general",
            permissions = [],
            execute
        } = commandModule.default;

        const commandHandler = async (ctx) => {
            const input = ctx.message.text.split(" ").slice(1).join(" ");
            const param = ctx.message.text.split(" ").slice(1);
            ctx.config = {
                cmd: commandConfig
            };

            // Check permissions
            if (permissions.includes("group") && ctx.chat.type === "private") {
                return ctx.reply("This command can only be used in group chats.");
            }

            if (permissions.includes("private") && ctx.chat.type !== "private") {
                return ctx.reply("This command can only be used in private chats.");
            }

            // Check user permissions
            if (permissions.includes("developer") && parseInt(ctx.message.from.id) !== parseInt(OWNER_ID)) {
                return ctx.reply("You do not have permission to use this command.");
            }

            try {
                await execute(bot, ctx, input, param);
            } catch (error) {
                console.error("Error:", error);
                await ctx.telegram.sendMessage(parseInt(OWNER_ID), `Error: ${error.message}`);
                return ctx.reply(`Error: ${error.message}`);
            }
        };

        // Register command and its aliases
        bot.command(name, commandHandler);
        aliases.forEach((alias) => {
            bot.command(alias, commandHandler);
        });

        // Store command metadata in the commandConfig object
        commandConfig[name] = {
            name,
            aliases,
            category,
            permissions,
            execute
        };
    });
}).catch((error) => console.error("Failed to load commands:", error));

// Handle eval code
bot.hears(/^([x>])\s+(.+)/, async (ctx) => {
    if (parseInt(ctx.message.from.id) !== parseInt(OWNER_ID)) return;

    try {
        const code = ctx.match[2];
        const result = await eval(ctx.match[1] === "x" ? `(async () => { ${code} })()` : code);

        return ctx.reply(inspect(result));
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

        return ctx.reply(output);
    } catch (error) {
        console.error("Error:", error);
        return ctx.reply(`[ ! ] Error occurred: ${error.message}`);
    }
});

// Start the Express server
app.listen(port, () => console.log(`Listening on port ${port}`));

export default bot;