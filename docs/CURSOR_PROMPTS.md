# Cursor Prompts

## First Paid Endpoint

```txt
Use this repo as the integration reference.
Build a minimal Express API with one paid route using DNA x402.
Use sdk/typescript/src/index.ts for hosted API calls.
Show quote, commit, direct split finalize, receipt verify, and paid unlock.
Use mock payment proofs in local dev.
Do not implement backend custody, backend signing, or private key storage.
```

## Next.js Data Feed

```txt
Create a Next.js route handler for a paid data feed using DNA x402.
Before returning data, require a DNA x402 receipt.
Expose a helper that requests quote and displays feeWaterfallV2.
Use env DNA_X402_API_URL.
```

## Telegram Bot Service

```txt
Build a Telegram bot command /signal that uses DNA x402.
The bot should request a quote, show payment instructions, verify receipt, then send the paid signal.
The bot must not hold private keys.
```

## Agent Builder

```txt
Build a page that sends a prompt to /v1/agent-builder/draft.
Show the returned config preview and risk summary.
Require user confirmation before calling /confirm.
```

## Meme Casino Agent

```txt
Use the DNA x402 Meme Casino Agent templates.
Build a Fresh Pair Goblin agent that watches new Solana token pairs, filters by liquidity and risk tier, gates paid alerts with receipts, and never auto-buys or signs in the backend.
```

## Social / X Campaign Room

```txt
Use the DNA x402 Social/X templates.
Build an X Campaign Room agent that creates campaign briefs, accepts proof URLs or hashes, requires human review, issues receipts only after proof acceptance, and never auto-posts or spams.
```

## Telegram Agent Launcher

```txt
Use launchers/telegram as the starting point.
Create a self-hosted Telegram bot for my DNA x402 agent.
The bot should support /start, /quote, /receipt, /signal, /alerts, /copy, and /pnl.
Keep TELEGRAM_BOT_TOKEN in local .env only.
Do not store wallet private keys.
Do not implement backend signing.
```

## Discord Agent Launcher

```txt
Use launchers/discord as the starting point.
Create a self-hosted Discord app for my DNA x402 agent.
The app should support /start, /quote, /receipt, /signal, /alerts, /copy, /pnl, /research, and /bounty.
Keep DISCORD_BOT_TOKEN in local .env only.
Register slash commands from launchers/discord/src/register-commands.ts.
Do not store wallet private keys.
Do not implement backend signing.
Unlock paid signals and research only after receipt verification.
```

## Community Agent Pack

```txt
Use templates/agents/community as the starting point.
Build a paid community agent for Telegram and Discord.
It should support paid alpha rooms, signal role gates, research drops, watchlists, copy alerts, bounty boards, and receipt-gated unlocks.
Start walletless in mock mode.
Show the fee waterfall before payment.
Verify receipts before unlock.
Keep bot tokens local.
Do not store wallet private keys.
Do not implement backend signing.
```

## Degen Mode

```txt
Use templates/agents/degen-live as the starting point.
Build a Degen Mode agent with DNA x402.
The flow is: connect wallet, pick agent, set max pain, launch.
Create trade intents with riskConfigHash.
Require client-side signing for live movement.
Show PnL, average entry, sample-size badge, receipts, copy links, referral stats, and pause control.
Do not implement backend custody.
Do not implement backend signing.
Do not show fake PnL or guaranteed-profit claims.
```
