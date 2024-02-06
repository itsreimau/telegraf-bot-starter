# Telegraf Express Bot Starter

This starter template provides a foundation for building a Telegram bot using Telegraf and Express, designed for hosting on Adaptable.io.

## Features

- **[Telegraf](https://telegraf.js.org/)**: Utilizes the Telegraf library for easy interaction with the Telegram Bot API.
- **[Express](https://expressjs.com/)**: Integrates Express to create a flexible web server for handling incoming updates.
- **[Adaptable.io](https://adaptable.io/)**: Seamlessly deploy and host your bot with Adaptable.io.

## Getting Started

1. [Fork](https://github.com/itsreimau/telegraf-express-bot-starter/fork) this repository.

3. Deploy to Adaptable.io:

   - In Adaptable.io, navigate to the dashboard.
   - Click "New App", "Connect an Existing Repository", and select your forked repository.
   - Follow the deployment prompts to deploy your bot on Adaptable.io.

4. Set up the environment in Adaptable.io:

   - In Adaptable.io, navigate to `Settings > Environment`.
   - Add the following environment variables:
     - `BOT_TOKEN`: Your Telegram bot token.
     - `OWNER_USERNAME`: Your username (for reference or additional functionality).
     - `PORT` (Optional, default: 3000): The port on which the bot server will run.
     - `WEBHOOK_URL`: Set this to 'https://your-project-name.adaptable.app/' if your project doesn't use a custom domain.

5. Your Telegram bot is now deployed and ready to use!

## Contributing

Feel free to contribute by opening issues or pull requests. Your feedback and contributions are highly appreciated.

## License

This project is licensed under the [MIT License](LICENSE).
