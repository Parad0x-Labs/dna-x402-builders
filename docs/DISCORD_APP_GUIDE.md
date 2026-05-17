# Discord App Guide

Use the Discord Developer Portal to create an app and connect it to the DNA x402 Discord launcher.

## Steps

1. Open the Discord Developer Portal.
2. Create an application.
3. Add a bot.
4. Copy the application ID.
5. Copy the public key.
6. Reset/copy the bot token.
7. Paste values into `launchers/discord/.env`.
8. Run `npm run register` to register slash commands.
9. Expose the launcher through HTTPS.
10. Set the interactions endpoint URL in the Developer Portal.
11. Install the app into your server.

## Token Safety

Your Discord bot token controls your app.

- keep it local
- never commit `.env`
- rotate it if leaked
- never put wallet private keys in this launcher
