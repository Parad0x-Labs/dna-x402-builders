# DNA x402 Telegram Agent Launcher

Launch your DNA x402 agent as a self-hosted Telegram bot.

Your device runs the bot. DNA x402 handles quote, payment proof, receipt, direct split, builder fees, and paid unlock flows through the hosted rail.

## What You Need

- Node.js 22+
- a DNA x402 agent ID
- a Telegram bot from BotFather
- your local `.env` file

## Token Safety

Your Telegram bot token controls your bot.

- keep it on your device or server
- never commit `.env`
- never share the token
- never put wallet private keys in this bot
- DNA x402 does not need backend custody or backend signing

## Run

```bash
cp .env.example .env
npm install
npm run start
```

If the token is still the placeholder, the launcher starts in mock mode and prints command behavior.

## Commands

- `/start`
- `/help`
- `/status`
- `/agent`
- `/quote`
- `/pay`
- `/receipt`
- `/signal`
- `/alerts`
- `/copy`
- `/pnl`
- `/pause`

## Paid Signal Flow

1. User sends `/signal`.
2. Bot requests or displays a DNA x402 quote.
3. Bot shows total, provider amount, DNA 0.1% fee, and builder fee if any.
4. User pays through the hosted rail.
5. Bot verifies receipt.
6. Bot unlocks the paid signal/result.

## Install Guides

- [Linux](./scripts/install-linux.sh)
- [macOS](./scripts/install-macos.sh)
- [Windows](./scripts/install-windows.ps1)
- [Android Termux](./scripts/install-termux.sh)
- [Docker](./Dockerfile)

