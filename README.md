# Telegraf Bot Starter

This starter template provides a foundation for building a Telegram bot using Telegraf, designed to run in any environment that supports Node.js.

## Features

- **[Telegraf](https://telegraf.js.org/)**: Utilizes the Telegraf library for easy interaction with the Telegram Bot API.

## Getting Started

1. [Fork](https://github.com/itsreimau/telegraf-bot-starter/fork) this repository.

2. Clone the repository to your local machine:
   ```bash
   git clone https://github.com/your-username/telegraf-bot-starter.git
   cd telegraf-bot-starter
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Set up environment variables:

   Create a `.env` file in the root directory of your project and add the following environment variables:
   ```env
   BOT_TOKEN=your-telegram-bot-token
   DEVELOPER_ID=your-telegram-id
   ```

5. Start the bot:

   You can run the bot locally using PM2 for process management. First, install PM2 globally:
   ```bash
   npm install pm2 -g
   ```

   Then, check the `ecosystem.config.js` file (optional) if you need to make any modifications. Start the bot using PM2 with:
   ```bash
   pm2 start
   ```

6. Your Telegram bot should now be running and ready to use!

## Contributing

Feel free to contribute by opening issues or pull requests. Your feedback and contributions are highly appreciated.

## License

This project is licensed under the [MIT License](LICENSE).