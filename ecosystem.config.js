module.exports = {
    apps: [{
        // General
        name: "ckptw-wabot",
        script: "./index.js",

        // Advanced features
        watch: true,
        ignore_watch: ["database.json", "node_modules", "state"],

        // Control flow
        cron_restart: "*/30 * * * *"
    }]
};