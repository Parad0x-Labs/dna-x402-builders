# Telegram Agent Launcher

Launch your agent as a Telegram bot in minutes.

Turn any spare phone, laptop, desktop, VPS, or Docker host into an agent server. Telegram is the UI. DNA x402 is the money rail.

No wallet? Launch anyway.

Launch a signal bot, alert bot, research bot, data bot, community bot, or agent prototype first. Add a Solana wallet later when you want paid unlocks, payouts, or live trading.

## Flow

1. Create or select a DNA x402 agent.
2. Create a Telegram bot with BotFather.
3. Copy the bot token into your local `.env`.
4. Pick a runtime:
   - Android phone with Termux
   - Windows PC
   - Mac
   - Linux
   - Docker
   - VPS
5. Run the launcher.
6. Your bot can serve signals, alerts, receipts, copy settings, PnL, and paid unlocks.

## Safety Model

Default V1 is self-hosted:

- token stays on your device or server
- DNA x402 does not store your Telegram bot token
- DNA x402 does not store private keys
- DNA x402 does not sign trades
- bot uses the hosted DNA x402 API for quote, payment proof, receipt, direct split, builder fees, and paid unlocks

Your Telegram bot token is a password. Keep it local.

## Quickstart

```bash
git clone https://github.com/Parad0x-Labs/dna-x402-builders
cd dna-x402-builders/launchers/telegram
cp .env.example .env
npm install
npm run start
```

Edit `.env`:

```txt
DNA_X402_API_URL=https://parad0xlabs.com/x402
DNA_AGENT_ID=your-agent-id
DNA_AGENT_NAME=Your DNA x402 Agent
TELEGRAM_BOT_TOKEN=put-your-botfather-token-here
BOT_MODE=public_beta
```

If the token is still the placeholder, the launcher starts in local preview mode.

Walletless launch should boot before any wallet is connected. Real paid unlocks should fail clearly with `WALLET_REQUIRED_FOR_PAYMENT` until a wallet is added.

## Bot Commands

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
- `/room`
- `/watchlist`
- `/brief`
- `/bounty`
- `/verify`
- `/unlock`
- `/pause`

## Paid Signal Flow

1. User sends `/signal`.
2. Bot asks DNA x402 for a quote.
3. Bot displays price, provider amount, DNA 0.1% fee, and builder fee if any.
4. User pays through the hosted rail.
5. Bot verifies receipt.
6. Bot sends the paid signal/result.

For real USDC settlement, the user needs a wallet. For real trading or copy/live execution, the agent needs a client-side user-owned wallet or external wallet. Backend private keys are never accepted.

## Runtime Guides

- [BotFather Guide](./BOTFATHER_GUIDE.md)
- [Run Agent On Android Phone](./RUN_AGENT_ON_ANDROID_PHONE.md)
- [Run Agent On Windows](./RUN_AGENT_ON_WINDOWS.md)
- [Run Agent On Mac](./RUN_AGENT_ON_MAC.md)
- [Run Agent On Linux](./RUN_AGENT_ON_LINUX.md)
- [Run Agent With Docker](./RUN_AGENT_WITH_DOCKER.md)
