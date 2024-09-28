require("./config.js");
const pkg = require("./package.json");
const CFonts = require("cfonts");

// Defines global
global.config.pkg = pkg;

// Checking
if (global.config.bot.token === "") {
    console.error(`[${pkg.name}] Please set 'global.config.bot' correctly in config.js!`);
    process.exit(1);
}
if (global.config.developer.id === "") {
    console.error(`[${pkg.name}] Please set 'global.config.developer' correctly in config.js!`);
    process.exit(1);
}

// Starting
console.log(`[${pkg.name}] Starting...`);

// Display title using CFonts
CFonts.say(pkg.name, {
    font: "chrome",
    align: "center",
    gradient: ["red", "magenta"]
});

// Displays package information
const authorName = pkg.author.name || pkg.author;
CFonts.say(
    `'${pkg.description}'\n` +
    `Oleh ${authorName}`, {
        font: "console",
        align: "center",
        gradient: ["red", "magenta"]
    }
);

// Import and run the main module
require("./main.js");