const {
    Telegraf
} = require("telegraf");
const express = require("express");
const path = require("path");
const {
    exec
} = require("child_process");
const {
    glob
} = require("glob");
const {
    inspect,
    promisify
} = require("util");

const globPromise = promisify(glob);

// Validate environment variables
const requiredEnvVars = ["BOT_TOKEN", "DEVELOPER_ID", "WEBHOOK_DOMAIN"];
requiredEnvVars.forEach((envVar) => {
    if (!process.env[envVar]) throw new Error(`'${envVar}' env var is required!`);
});

const {
    BOT_TOKEN,
    DEVELOPER_ID,
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
(async () => {
    const webhook = await bot.createWebhook({
        domain: WEBHOOK_DOMAIN
    });
    app.use(webhook);
})();

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Something went wrong!");
});

// Initialize command config
const commandConfig = {};
bot.config = {
    cmd: commandConfig
};

// Load commands dynamically from the "commands" directory
const currentDir = path.dirname(require.main.filename);
globPromise(`${currentDir}/commands/**/*.js`).then(async (files) => {
    for (const file of files) {
        try {
            const commandModule = require(path.resolve(file));
            const {
                name,
                aliases = [],
                description = "",
                category = "",
                permissions = [],
                execute
            } = commandModule;

            const commandHandler = async (ctx) => {
                // Input
                const input = {
                    text: ctx.message.text.split(" ").slice(1).join(" "),
                    param: ctx.message.text.split(" ").slice(1)
                };

                // Check permissions
                if (permissions.includes("group") && ctx.chat.type === "private") {
                    return ctx.reply("[ ! ] This command can only be used in group chats.");
                }

                if (permissions.includes("private") && ctx.chat.type !== "private") {
                    return ctx.reply("[ ! ] This command can only be used in private chats.");
                }

                // Check user permissions
                if (permissions.includes("developer") && parseInt(ctx.message.from.id) !== parseInt(DEVELOPER_ID)) {
                    return ctx.reply("[ ! ] You do not have permission to use this command.");
                }

                try {
                    await execute(bot, ctx, input);
                } catch (error) {
                    console.error("Error:", error);
                    await ctx.telegram.sendMessage(parseInt(DEVELOPER_ID), `Error: ${error.message}`);
                    return ctx.reply(`[ ! ] Error: ${error.message}`);
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
                description,
                category,
                permissions,
                execute
            };
        } catch (error) {
            console.error(`Failed to load command from file ${file}:`, error);
        }
    }
});

// Handle eval code
bot.hears(/^([>|>>])\s+(.+)/, async (ctx) => {
    if (parseInt(ctx.message.from.id) !== parseInt(DEVELOPER_ID)) return;

    try {
        const code = ctx.match[2];
        const result = await eval(ctx.match[1] === ">>" ? `(async () => { ${code} })()` : code);

        return ctx.reply(inspect(result));
    } catch (error) {
        console.error("Error:", error);
        return ctx.reply(`[ ! ] Error: ${error.message}`);
    }
});

// Handle shell command
bot.hears(/^\$\s+(.+)/, async (ctx) => {
    if (parseInt(ctx.message.from.id) !== parseInt(DEVELOPER_ID)) return;

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
        return ctx.reply(`[ ! ] Error: ${error.message}`);
    }
});

// Start the Express server
app.listen(port, () => console.log(`Listening on port ${port}`));

module.exports = bot;