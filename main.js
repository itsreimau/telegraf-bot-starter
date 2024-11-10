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
        // Configuration and validation
        const BOT_TOKEN = config?.bot?.token;
        const DEVELOPER_ID = config?.developer?.id;

        if (!BOT_TOKEN || !DEVELOPER_ID) {
            throw new Error("Bot token or developer ID not found in the configuration.");
        }

        // Initialize bot and core components
        const bot = new Telegraf(BOT_TOKEN);
        const commandConfig = new Collection();
        const databaseConfig = new SimplDB();

        bot.config = {
            cmd: commandConfig,
            db: databaseConfig
        };

        // Function to recursively read command files from subdirectories
        async function loadCommands(directoryPath) {
            const files = await fs.readdir(directoryPath, {
                withFileTypes: true
            });

            for (const file of files) {
                const fullPath = path.join(directoryPath, file.name);
                if (file.isDirectory()) {
                    // Recursive call to handle subdirectories
                    await loadCommands(fullPath);
                } else if (file.isFile() && file.name.endsWith(".js")) {
                    try {
                        const commandModule = require(fullPath);
                        const {
                            name,
                            aliases = [],
                            description = "",
                            category,
                            permissions = [],
                            action = "typing",
                            execute
                        } = commandModule;
                        console.log(`Loaded command: ${name} (Category: ${category})`);

                        if (!name || typeof execute !== "function") {
                            console.warn(`Invalid command structure in: ${name} (Category: ${category})`);
                            continue;
                        }

                        // Register command and aliases
                        const commandInfo = {
                            name,
                            aliases,
                            description,
                            category,
                            permissions,
                            action,
                            execute
                        };
                        bot.command(name, async (ctx) => handleCommand(ctx, commandInfo));
                        aliases.forEach((alias) => bot.command(alias, async (ctx) => handleCommand(ctx, commandInfo)));

                        // Add command to configuration
                        bot.config.cmd.set(name, commandInfo);
                    } catch (error) {
                        console.error(`Failed to load command file ${file.name}:`, error);
                    }
                }
            }
        }

        // Load all commands starting from the 'commands' directory
        const commandsPath = path.join(__dirname, "commands");
        await loadCommands(commandsPath);

        // Function to handle command execution
        async function handleCommand(ctx, commandInfo) {
            const {
                permissions,
                action,
                execute
            } = commandInfo;
            try {
                await ctx.sendChatAction(action);
                const userDb = await bot.config.db.get(`user.${ctx.from.id}`) || {
                    premium: false
                };
                if (!userDb && commandInfo.name !== "start") {
                    return ctx.reply("❎ You are not registered in our database yet! Type /start to register.");
                }

                // Check permissions
                if (permissions.includes("group") && ctx.chat.type === "private") {
                    return ctx.reply("❎ This command can only be used in group chats.");
                }
                if (permissions.includes("private") && ctx.chat.type !== "private") {
                    return ctx.reply("❎ This command can only be used in private chats.");
                }
                if (permissions.includes("developer") && parseInt(ctx.from.id) !== parseInt(DEVELOPER_ID)) {
                    return ctx.reply("❎ You do not have permission to use this command.");
                }

                const input = {
                    text: ctx.message.text.split(" ").slice(1).join(" "),
                    param: ctx.message.text.split(" ").slice(1)
                };
                await execute(bot, ctx, input, tools);
            } catch (error) {
                console.error("Error:", error);
                await ctx.telegram.sendMessage(DEVELOPER_ID, `⚠ Error in command: ${error.message}`);
                return ctx.reply(`⚠ An error occurred: ${error.message}`);
            }
        }

        // Restricted evaluation for developers
        bot.hears(/^(\=>|==>)\s+(.+)/, async (ctx) => {
            if (parseInt(ctx.from.id) !== parseInt(DEVELOPER_ID)) return;
            try {
                const code = ctx.match[2];
                const result = await eval(ctx.match[1] === "==>" ? `(async () => { ${code} })()` : code);
                return ctx.reply(util.inspect(result));
            } catch (error) {
                console.error("Error:", error);
                return ctx.reply(`⚠ An error occurred: ${error.message}`);
            }
        });

        // Restricted shell execution for developers
        bot.hears(/^\$\s+(.+)/, async (ctx) => {
            if (parseInt(ctx.from.id) !== parseInt(DEVELOPER_ID)) return;
            try {
                const command = ctx.match[1];
                const {
                    stdout,
                    stderr
                } = await util.promisify(exec)(command);
                return ctx.reply(stdout || stderr);
            } catch (error) {
                console.error("Error:", error);
                return ctx.reply(`⚠ An error occurred: ${error.message}`);
            }
        });

        // Start bot
        bot.launch({
            allowedUpdates: ["message", "edited_message", "callback_query"]
        });
        console.log("Bot is running...");

        // Enable graceful stop
        process.once("SIGINT", () => bot.stop("SIGINT"));
        process.once("SIGTERM", () => bot.stop("SIGTERM"));
    } catch (error) {
        console.error("Initialization error:", error);
    }
}

// Call the initialization function
initializeBot();