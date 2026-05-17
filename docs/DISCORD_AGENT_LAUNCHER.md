# Discord Agent Launcher

Launch your agent as a self-hosted Discord app.

Discord is the community surface.
DNA x402 is the money rail.

No wallet is required to start.

Use walletless mode for paper agents, signal bots, alert bots, research bots, mock receipts, and local/dev examples. Add a Solana wallet later when you want paid unlocks, payouts, or live trading.

## Flow

1. Create or select a DNA x402 agent.
2. Create a Discord application.
3. Add a bot to the application.
4. Copy the application ID, public key, and bot token into your local `.env`.
5. Register slash commands.
6. Expose your interactions endpoint over HTTPS.
7. Install the app into your server.
8. Users can run `/quote`, `/signal`, `/receipt`, `/alerts`, `/copy`, `/research`, and `/bounty`.

## Safety Model

Default V1 is self-hosted:

- token stays on your device or server
- DNA x402 does not store your Discord bot token
- DNA x402 does not store private keys
- DNA x402 does not sign trades
- app uses the hosted DNA x402 API for quote, payment proof, receipt, direct split, builder fees, and paid unlocks

Your Discord bot token is a password.
Keep it local.

## Quickstart

```bash
git clone https://github.com/Parad0x-Labs/dna-x402-builders
cd dna-x402-builders/launchers/discord
cp .env.example .env
npm install
npm run start
```

With placeholder values, the launcher runs in mock mode.

## Register Slash Commands

```bash
npm run register
```

With placeholders, this prints the command manifest.
With real local credentials, it registers slash commands for your Discord application.

Walletless mock mode should boot before any wallet is connected. Real paid unlocks should fail clearly with `WALLET_REQUIRED_FOR_PAYMENT` until a wallet is added.

## Commands

- `/start`
- `/status`
- `/agent`
- `/quote`
- `/pay`
- `/receipt`
- `/signal`
- `/alerts`
- `/copy`
- `/pnl`
- `/research`
- `/bounty`
- `/pause`

## Good Use Cases

- paid alpha rooms
- signal role gates
- paid research drops
- bounty boards
- Space/voice notes summaries
- copy alert rooms
- paid watchlist rooms
- proof-reviewed community tasks

For real USDC settlement, the user needs a wallet. For real trading or copy/live execution, the agent needs a client-side user-owned wallet or external wallet. Backend private keys are never accepted.
