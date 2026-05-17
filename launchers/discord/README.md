# DNA x402 Discord Agent Launcher

Launch your DNA x402 agent as a self-hosted Discord app.

Your server runs the app.
Discord is the community surface.
DNA x402 handles quote, payment proof, receipt, direct split, builder fees, and paid unlock flows through the hosted rail.

## What You Need

- Node.js 22+
- a DNA x402 agent ID
- a Discord application
- slash commands registered for the application
- a public HTTPS interactions endpoint for live Discord mode
- your local `.env` file

## Token Safety

Your Discord bot token controls your app.

- keep it on your device or server
- never commit `.env`
- never share the token
- never put wallet private keys in this app
- DNA x402 does not need backend custody or backend signing

## Run Mock Mode

```bash
cp .env.example .env
npm install
npm run start
```

If the Discord app fields are still placeholders, the launcher starts in mock mode and prints command behavior.

## Register Commands

```bash
npm run register
```

With placeholders, this prints the command manifest.
With a local Discord application ID and bot token, it registers commands through Discord's REST API.

## Live Interaction Mode

For live Discord interactions, set:

```txt
DISCORD_APPLICATION_ID=your-app-id
DISCORD_PUBLIC_KEY=your-app-public-key
DISCORD_BOT_TOKEN=your-local-bot-token
DISCORD_PORT=8787
```

Then expose `http://localhost:8787` through your own HTTPS tunnel, reverse proxy, VPS, or deployment platform and set that URL in the Discord Developer Portal interactions endpoint.

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

## Paid Signal Flow

1. User runs `/signal`.
2. App asks DNA x402 for a quote.
3. App displays price, provider amount, DNA 0.1% fee, and builder fee if any.
4. User pays through the hosted rail.
5. App verifies receipt.
6. App unlocks the paid signal/result.
