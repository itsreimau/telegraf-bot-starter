require("dotenv").config();
const {
    Telegraf
} = require("telegraf");
const SimplDB = require("simpl.db");
const { Collection } = require("@discordjs/collection");
const fs = require("fs/promises");
const path = require("path");
const tools = require("./tools/exports.js")
const {
    inspect
} = require("util");
const {
    exec
} = require("child_process");

// Validate environment variables
const requiredEnvVars = ["BOT_TOKEN", "DEVELOPER_ID"];
requiredEnvVars.forEach((envVar) => {
    if (!process.env[envVar]) throw new Error(`'${envVar}' env var is required!`);
});

const {
    BOT_TOKEN,
    DEVELOPER_ID
} = process.env;

// Initialize bot
const bot = new Telegraf(BOT_TOKEN);

// Initialize command config using Collection from discord.js
const commandConfig = new Collection();

// Initialize database config using Simpl.DB
const databaseConfig = new SimplDB();

// Config
bot.config = {
    cmd: commandConfig,
    db: databaseConfig
};

// Load commands dynamically from the "commands" directory
const currentDir = path.dirname(require.main.filename);
fs.readdir(path.join(currentDir, "commands")).then((commandFiles) => {
    commandFiles.forEach(async (file) => {
        const commandModule = require(`./commands/${file}`);
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

            // Check chat type permissions
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
                await execute(bot, ctx, input, tools);
            } catch (error) {
                console.error("Error:", error);
                await ctx.telegram.sendMessage(parseInt(DEVELOPER_ID), `Error: ${error.message}`);
                return ctx.reply(`${tools.format.bold("[ ! ]")} ${tools.msg.translate("Error", userLanguage)}: ${error.message}`);
            }
        };

        // Register command and its aliases
        bot.command(name, commandHandler);
        aliases.forEach((alias) => {
            bot.command(alias, commandHandler);
        });

        // Store command metadata in the commandConfig Collection
        commandConfig.set(name, {
            name,
            aliases,
            description,
            category,
            permissions,
            execute
        });
    });
}).catch((error) => console.error("Failed to load commands:", error));

// Handle eval code
bot.hears(/^([>|>>])\s+(.+)/, async (ctx) => {
    if (parseInt(ctx.message.from.id) !== parseInt(DEVELOPER_ID)) return;

    try {
        const code = ctx.match[2];
        const result = await eval(ctx.match[1] === ">>" ? `(async () => { ${code} })()` : code);

        return ctx.reply(inspect(result));
    } catch (error) {
        console.error("Error:", error);
        return ctx.reply(`${tools.format.bold("[ ! ]")} ${tools.msg.translate("Error", userLanguage)}: ${error.message}`);
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
        return ctx.reply(`${tools.format.bold("[ ! ]")} ${tools.msg.translate("Error", userLanguage)}: ${error.message}`);
    }
});

// Start polling
bot.launch().then(() => console.log("Bot is running..."));

module.exports = bot;