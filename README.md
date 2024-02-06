# Telegraf Express Bot Starter

This starter template provides a foundation for building a Telegram bot using Telegraf and Express, designed for hosting on Adaptable.io.

## Features

- **Telegraf**: Utilizes the Telegraf library for easy interaction with the Telegram Bot API.
- **Express**: Integrates Express to create a flexible web server for handling incoming updates.
- **Adaptable.io**: Seamlessly deploy and host your bot with Adaptable.io.

## Getting Started

1. Fork this repository by clicking the "Fork" button in the top right corner of this GitHub page.

2. Deploy to Adaptable.io:

   - In Adaptable.io, navigate to the dashboard.
   - Click on "Import from GitHub" and select your forked repository.
   - Follow the deployment prompts to deploy your bot on Adaptable.io.

3. Set the Webhook URL in Adaptable.io:

   - In Adaptable.io, navigate to `Settings > Environment`.
   - Add the following environment variables:
     - `BOT_TOKEN`: Your Telegram bot token.
     - `OWNER_USERNAME`: Your username (for reference or additional functionality).
     - `PORT` (Optional, default: 3000): The port on which the bot server will run.
     - `WEBHOOK_URL`: Set this to 'https://your-project-name.adaptable.app/' if your project doesn't use a custom domain.

4. Your Telegram bot is now deployed and ready to use!

## Contributing

Feel free to contribute by opening issues or pull requests. Your feedback and contributions are highly appreciated.

## License

This project is licensed under the [MIT License](LICENSE).
