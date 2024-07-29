require("dotenv").config();
const {
    Telegraf
} = require("telegraf");
const SimplDB = require("simpl.db");
const {
    Collection
} = require("@discordjs/collection");
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
fs.readdir(path.join(__dirname, "commands")).then((commandFiles) => {
    commandFiles.forEach(async (file) => {
        const commandModule = require(`./commands/${file}`);
        const {
            name,
            aliases = [],
            description = "",
            category = "",
            permissions = [],
            action = "",
            execute
        } = commandModule;

        const commandHandler = async (ctx) => {
            await ctx.sendChatAction(action);

            const userDb = await bot.config.db.get(`user.${ctx.from.id}`);
            const [userLanguage] = await Promise.all([
                bot.config.db.get(`user.${ctx.from.id}.language`)
            ]);

            // Input
            const input = {
                text: ctx.message.text.split(" ").slice(1).join(" "),
                param: ctx.message.text.split(" ").slice(1)
            };

            // Check chat type permissions
            if (permissions.includes("group") && ctx.chat.type === "private") {
                return ctx.reply(`⚠ ${await tools.msg.translate("This command can only be used in group chats.", userLanguage)}`);
            }

            if (permissions.includes("private") && ctx.chat.type !== "private") {
                return ctx.reply(`⚠ ${await tools.msg.translate("This command can only be used in private chats.", userLanguage)}`);
            }

            // Check user permissions
            if (permissions.includes("developer") && parseInt(ctx.from.id) !== parseInt(DEVELOPER_ID)) {
                return ctx.reply(`⚠ ${await tools.msg.translate("You do not have permission to use this command.", userLanguage)}`);
            }

            // Check user database
            if (name !== "start" && !userDb) {
                return ctx.reply(`⚠ ${await tools.msg.translate("You are not registered in our database yet! Type /start to register.", userLanguage)}`);
            }

            try {
                await execute(bot, ctx, input, tools);
            } catch (error) {
                console.error("Error:", error);
                await ctx.telegram.sendMessage(parseInt(DEVELOPER_ID), `Error: ${error.message}`);
                return ctx.reply(`⚠ ${await tools.msg.translate("Error", userLanguage)}: ${error.message}`);
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
    const [userLanguage] = await Promise.all([
        bot.config.db.get(`user.${ctx.from.id}.language`)
    ]);

    if (parseInt(ctx.from.id) !== parseInt(DEVELOPER_ID)) return;

    try {
        const code = ctx.match[2];
        const result = await eval(ctx.match[1] === ">>" ? `(async () => { ${code} })()` : code);

        return ctx.reply(inspect(result));
    } catch (error) {
        console.error("Error:", error);
        return ctx.reply(`⚠ ${await tools.msg.translate("Error", userLanguage)}: ${error.message}`);
    }
});

// Handle shell command
bot.hears(/^\$\s+(.+)/, async (ctx) => {
    const [userLanguage] = await Promise.all([
        bot.config.db.get(`user.${ctx.from.id}.language`)
    ]);

    if (parseInt(ctx.from.id) !== parseInt(DEVELOPER_ID)) return;

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
        return ctx.reply(`⚠ ${await tools.msg.translate("Error", userLanguage)}: ${error.message}`);
    }
});

// Start polling
bot.launch().then(() => console.log("Bot is running..."));

module.exports = bot;