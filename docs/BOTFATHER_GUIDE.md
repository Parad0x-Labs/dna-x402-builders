# BotFather Guide

BotFather creates Telegram bots and gives you the bot token.

## Steps

1. Open Telegram.
2. Search for `@BotFather`.
3. Send `/newbot`.
4. Pick a bot name.
5. Pick a bot username ending in `bot`.
6. Copy the token BotFather gives you.
7. Paste it into your local launcher `.env`.

```txt
TELEGRAM_BOT_TOKEN=put-your-botfather-token-here
```

## Token Safety

Your bot token controls your Telegram bot.

- keep it on your device/server
- never commit `.env`
- never paste it into public chats
- rotate it in BotFather if leaked
- do not put wallet private keys in this bot

DNA x402 only needs the hosted API URL and agent ID. The self-hosted launcher does not require DNA to store your Telegram bot token.

