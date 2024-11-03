// Required modules and dependencies
const tools = require("./tools/exports.js");
const {
    Collection
} = require("@discordjs/collection");
const {
    exec
} = require("child_process");
const fs = require("fs/promises");
const path = require("path");
const SimplDB = require("simpl.db");
const {
    Telegraf
} = require("telegraf");
const util = require("util");

// Function to initialize the bot
async function initializeBot() {
    try {
        // Retrieve important configurations
        const [BOT_TOKEN, DEVELOPER_ID] = await Promise.all([
            config.bot.token,
            config.developer.id
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

        // Get all files from the 'commands' directory
        const commandsPath = path.join(__dirname, "commands");
        const commandFiles = await fs.readdir(commandsPath, {
            withFileTypes: true
        });

        // Function to handle command execution with permission checks
        async function handleCommand(ctx, commandInfo, input) {
            const {
                permissions,
                action,
                execute
            } = commandInfo;
            await ctx.sendChatAction(action);

            const userDb = await bot.config.db.get(`user.${ctx.from.id}`);
            if (!userDb) {
                await bot.config.db.set(`user.${ctx.from.id}`, {
                    premium: false
                });
            }

            // Permission checks
            if (permissions.includes("group") && ctx.chat.type === "private") return ctx.reply(`❎ This command can only be used in group chats.`);

            if (permissions.includes("private") && ctx.chat.type !== "private") return ctx.reply(`❎ This command can only be used in private chats.`);

            if (permissions.includes("developer") && parseInt(ctx.from.id) !== parseInt(DEVELOPER_ID)) return ctx.reply(`❎ You do not have permission to use this command.`);

            if (commandInfo.name !== "start" && !userDb) return ctx.reply(`❎ You are not registered in our database yet! Type /start to register.`);

            try {
                await execute(bot, ctx, input, tools);
            } catch (error) {
                console.error("Error:", error);
                await ctx.telegram.sendMessage(DEVELOPER_ID, `Error: ${error.message}`);
                return ctx.reply(`❎ Error: ${error.message}`);
            }
        }

        // Loop over all files and register them with the bot
        for (const file of commandFiles) {
            const fullPath = path.join(commandsPath, file.name);

            if (file.isFile() && file.name.endsWith(".js")) {
                const commandModule = require(fullPath);
                const {
                    name,
                    aliases = [],
                    description = "",
                    category = "",
                    permissions = [],
                    action = "",
                    execute
                } = commandModule;

                const commandInfo = {
                    name,
                    aliases,
                    description,
                    category,
                    permissions,
                    action,
                    execute
                };

                // Register main command with handler
                bot.command(name, async (ctx) => {
                    const input = {
                        text: ctx.message.text.split(" ").slice(1).join(" "),
                        param: ctx.message.text.split(" ").slice(1)
                    };
                    await handleCommand(ctx, commandInfo, input);
                });

                // Register aliases with the same handler and permissions
                aliases.forEach((alias) => {
                    bot.command(alias, async (ctx) => {
                        const input = {
                            text: ctx.message.text.split(" ").slice(1).join(" "),
                            param: ctx.message.text.split(" ").slice(1)
                        };
                        await handleCommand(ctx, commandInfo, input);
                    });
                });

                bot.config.cmd.set(name, commandInfo);
            }
        }

        // Handle inline eval code using Telegraf hears method
        bot.hears(/^(\=>|==>)\s+(.+)/, async (ctx) => {
            if (parseInt(ctx.from.id) !== parseInt(DEVELOPER_ID)) return; // Restrict eval to developer only

            try {
                const code = ctx.match[2];
                const result = await eval(ctx.match[1] === "==>" ? `(async () => { ${code} })()` : code);

                return ctx.reply(util.inspect(result));
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
                const output = await util.promisify(exec)(command);

                return ctx.reply(output.stdout || output.stderr);
            } catch (error) {
                console.error("Error:", error);
                return ctx.reply(`❎ Error: ${error.message}`);
            }
        });

        // Start the bot and enable polling to receive updates
        await bot.launch();
        console.log("Bot is running...");
    } catch (error) {
        console.error("Error during bot initialization:", error);
    }
}

// Call the initialization function
initializeBot();