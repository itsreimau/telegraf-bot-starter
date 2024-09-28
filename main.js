// Required modules and dependencies
const {
    Telegraf
} = require("telegraf");
const SimplDB = require("simpl.db");
const {
    Collection
} = require("@discordjs/collection");
const fs = require("fs/promises");
const path = require("path");
const tools = require("./tools/exports.js");
const {
    inspect
} = require("util");
const {
    exec
} = require("child_process");

// Retrieve important configurations
const [BOT_TOKEN, DEVELOPER_ID] = Promise.all([
    global.config.bot.token,
    global.config.developer.id
]);

// Initialize bot with Telegraf
const bot = new Telegraf(BOT_TOKEN);

// Initialize command configuration using Collection from discord.js
const commandConfig = new Collection();

// Initialize database using SimplDB
const databaseConfig = new SimplDB();

// Attach configurations to the bot object for easy access
bot.config = {
    cmd: commandConfig,
    db: databaseConfig
};

// Dynamically load command files from the "commands" directory
fs.readdir(path.join(__dirname, "commands"))
    .then(async (commandFiles) => {
        for (const file of commandFiles) {
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

            // Define command handler logic
            const commandHandler = async (ctx) => {
                // Send action feedback (e.g., typing, uploading)
                await ctx.sendChatAction(action);

                // Retrieve user data from the database or initialize it if not found
                const userDb = await bot.config.db.get(`user.${ctx.from.id}`);
                if (!userDb) {
                    await bot.config.db.set(`user.${ctx.from.id}`, {
                        premium: false
                    });
                }

                // Process command input and parameters
                const input = {
                    text: ctx.message.text.split(" ").slice(1).join(" "),
                    param: ctx.message.text.split(" ").slice(1)
                };

                // Check if the command is allowed in the current chat type
                if (permissions.includes("group") && ctx.chat.type === "private") {
                    return ctx.reply(`❎ This command can only be used in group chats.`);
                }

                if (permissions.includes("private") && ctx.chat.type !== "private") {
                    return ctx.reply(`❎ This command can only be used in private chats.`);
                }

                // Verify if the user has the required permission (e.g., developer-only commands)
                if (permissions.includes("developer") && parseInt(ctx.from.id) !== parseInt(DEVELOPER_ID)) {
                    return ctx.reply(`❎ You do not have permission to use this command.`);
                }

                // Ensure the user is registered in the database
                if (name !== "start" && !userDb) {
                    return ctx.reply(`❎ You are not registered in our database yet! Type /start to register.`);
                }

                // Attempt to execute the command and handle errors
                try {
                    await execute(bot, ctx, input, tools);
                } catch (error) {
                    console.error("Error:", error);
                    await ctx.telegram.sendMessage(DEVELOPER_ID, `Error: ${error.message}`);
                    return ctx.reply(`❎ Error: ${error.message}`);
                }
            };

            // Register command and its aliases with the bot
            bot.command(name, commandHandler);
            aliases.forEach((alias) => {
                bot.command(alias, commandHandler);
            });

            // Store command metadata in the Collection for future reference
            bot.config.cmd.set(name, {
                name,
                aliases,
                description,
                category,
                permissions,
                execute
            });
        }
    })
    .catch((error) => console.error("Failed to load commands:", error));

// Handle inline eval code using Telegraf hears method
bot.hears(/^(\=>|==>)\s+(.+)/, async (ctx) => {
    if (parseInt(ctx.from.id) !== parseInt(DEVELOPER_ID)) return; // Restrict eval to developer only

    try {
        const code = ctx.match[2];
        const result = await eval(ctx.match[1] === "==>" ? `(async () => { ${code} })()` : code);

        return ctx.reply(inspect(result, {
            depth: 1
        }));
    } catch (error) {
        console.error("Error:", error);
        return ctx.reply(`❎ Error: ${error.message}`);
    }
});

// Handle shell command execution with Telegraf hears method
bot.hears(/^\$\s+(.+)/, async (ctx) => {
    if (parseInt(ctx.from.id) !== parseInt(DEVELOPER_ID)) return; // Restrict shell execution to developer only

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
        return ctx.reply(`❎ Error: ${error.message}`);
    }
});

// Start the bot and enable polling to receive updates
bot.launch().then(() => console.log("Bot is running...")).catch((error) => console.error("Failed to launch the bot:", error));