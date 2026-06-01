# DNA x402 Builder Kit

Build paid APIs, agents, tools, and data feeds on the DNA x402 hosted rail.

**Quote. Pay. Verify. Receipt. Unlock.**

**Status: Public Beta**

DNA x402 gives builders hosted payment proof, signed receipts, direct split fees, webhooks, builder fees, agent launch primitives, copy settings, and alpha monetization through simple API calls.

Use it to add `quote -> payment proof -> signed receipt -> paid unlock` flows to APIs, agents, tools, and data feeds.

No backend custody. No backend signing. No hidden fees. Every paid action is receipt-bound.

## 💸 Why people use it

Turn something you already have into income — no company, no Stripe, no monthly fees:

- 🎰 **Run a paid alpha room** — charge per signal in your Telegram/Discord; the bot collects, you keep it.
- 📈 **Sell a trading or data bot** — a buyer's agent pays yours per call, automatically.
- 🔌 **Monetize any API** — quote → pay → unlock, in a few lines.
- 📱 **Start with no wallet** — run a signal bot off an old phone; add a wallet when it's time to charge.

You hold your keys; buyers keep theirs. *(No guaranteed profit — what you build and charge is up to you.)*

### How this fits the Parad0x stack

Parad0x Labs builds Web0 on Solana — money and agents that settle themselves. **You are here: 🛠️ Build.**

| Layer | Repo | Does |
|---|---|---|
| 💸 Payments | [dna-x402](https://github.com/Parad0x-Labs/dna-x402) | x402 rail: quote → pay → verify → receipt → anchor |
| 🛠️ Build | **dna-x402-builders** (this repo) | Hosted kit: turn any API/bot into a paid agent |
| 🕶️ Privacy | [Dark-Null-Protocol](https://github.com/Parad0x-Labs/Dark-Null-Protocol) | Groth16 privacy settlement, published proofs |
| 🗜️ Data | [liquefy](https://github.com/Parad0x-Labs/liquefy) | Columnar compression that beats Zstd + audit trails |
| 🎬 Media | [nebula-media](https://github.com/Parad0x-Labs/nebula-media) | Proof-carrying media compression — scene-aware + on-chain receipts |
| 🧠 Local AI | [nulla-local](https://github.com/Parad0x-Labs/nulla-local) | Local-first agent runtime — your machine, your memory |

**See it live** (a consumer app running on these rails): **[parad0xlabs.com](https://parad0xlabs.com)**

## Clean Pull And Verify

From an existing clone:

```bash
git pull --ff-only && npm ci && npm run acceptance
```

To open the local admin monitor:

```bash
npm run admin:monitor
```

The monitor opens at `http://127.0.0.1:4177`.

- [Builder Admin Monitor](./docs/BUILDER_ADMIN_MONITOR.md)

## Optional Dark Null Privacy Path

Builders can run the standard DNA x402 path or explicitly request the Dark Null privacy path.

```txt
normal:    quote -> payment proof -> signed receipt -> paid unlock
dark-null: normal path + private receipt summary for privacy-sensitive unlocks
```

Use `normal` by default. Use `dark-null` for paid alpha reveals, private signal rooms, wallet-stalker reports, and API access receipts where raw resource paths should not become public receipt metadata.

Devnet Dark Null receipt evidence is the first integration lane. Mainnet-beta Dark Null private receipts require promoted Dark Null deployment evidence and hosted account enablement. The standard DNA x402 Public Beta rail remains the live capped Solana USDC path.

- [Dark Null Privacy Path](./docs/DARK_NULL_PRIVACY_PATH.md)

## Degen Mode

Connect wallet. Pick agent. Set max pain. Launch.

Fresh pair goblins. Wallet stalkers. Copy-the-Chad agents. Rug radar. Pump radar. Alpha rooms. Live PnL leaderboards. Referral links. Profit-share fees.

Your agent watches the chaos. You set the max pain. DNA x402 handles the receipt trail.

Use Degen Mode to build agents around:

- fresh Solana pair signals
- wallet and whale tracking
- copy/follow flows with bankroll rules
- Telegram and Discord alpha rooms
- live/paper PnL leaderboards
- referral links
- positive-PnL alpha fees
- user-confirmed swap intents

Trust rules stay hard: no backend custody, no backend signing, no hidden fees, no fake PnL, no guaranteed-profit claims. Live movement uses user-owned wallets, max pain rules, client-side signing, and pause/kill-switch controls.

- [Degen Mode](./docs/DEGEN_MODE.md)
- [Live Execution Adapters](./docs/LIVE_EXECUTION_ADAPTERS.md)
- [Alpha Profit Share](./docs/ALPHA_PROFIT_SHARE.md)
- [Degen templates](./templates/agents/degen-live)

## NULL Flywheel

`$NULL` mint: `8EeDdvCRmFAzVD4takkBrNNwkeUTUQh4MscRK5Fzpump`

Premium paid actions can feed the `$NULL` RewardsVault through a capped 5 bps flywheel allocation.

```txt
signal reveal / risk check / hint tier / sniper tax
-> DNA x402 receipt
-> randomized flywheel execution
-> public receipt metadata
-> RewardsVault
```

Current evidence includes 25 Rust tests across accumulator logic, commit-reveal schedule randomization, public receipts, epoch aggregation, and an end-to-end simulation with `all_steps_proven=true`.

Use it for paid alpha reveals, risk bots, hint ladders, private rooms, and premium APIs where every monetized action should leave a receipt-bound rewards trail.

- [NULL Flywheel](./docs/NULL_FLYWHEEL.md)

## Build On Parad0x Signals

Want to build a paid signal bot, dashboard, alpha room, copy alert feed, or research product?

Use Parad0x signal feeds as the source layer.

You bring the audience and UX.
Parad0x brings the source alpha.
DNA x402 handles quote, payment proof, receipt, fees, and unlock.

```txt
Source fee + builder fee + rail fee.
Visible. Receipt-bound. Programmable.
```

Builders can customize the experience and add their own builder fee. Parad0x signal source fees and the DNA 0.1% rail fee stay protected in the same visible fee waterfall. Receipts bind `signalId`, `signalSource`, `usageType`, the fee waterfall, and result digest when present.

No free resale of Parad0x source alpha. No hidden fees. No guaranteed-profit claims.

- [Parad0x Signal Feeds](./docs/PARADOX_SIGNAL_FEEDS.md)
- [Signal Resale And Licensing](./docs/SIGNAL_RESALE_AND_LICENSING.md)
- [Parad0x signal reseller example](./examples/paradox-signal-reseller-ts)

## No Wallet? Launch Anyway.

You do not need a wallet to start building.

Launch a signal bot, alert bot, research bot, data bot, community bot, or agent prototype first.

Run it from:

- old Android phone
- laptop
- desktop
- VPS
- Docker
- Telegram
- Discord

When the agent needs to charge users, receive payouts, or trade with real funds, add a wallet.

Build first. Plug in payments later.

- [Walletless Start](./docs/WALLETLESS_START.md)

## Community Agent Pack

Turn Telegram groups and Discord servers into paid agent rooms.

Paid alpha rooms. Signal role gates. Research drops. Watchlists. Copy alerts. Bounty boards. Agent leaderboards. Receipt-gated unlocks.

Your community brings the chaos. DNA x402 brings the rail.

- [Community Agents](./docs/COMMUNITY_AGENTS.md)
- [Community templates](./templates/agents/community)
- [Community mock/devnet example](./examples/community-agents)

## Meme Casino + Social Agent Packs

Solana builders asked for the fun stuff.

Now included:

- Meme Casino Agents: wallet stalkers, fresh pair goblins, rug radar, volume scouts, copy agents, paper ape labs, signal tollbooths, alpha fee agents, and custom degen machines.
- Social/X Agents: campaign rooms, proof-of-engagement flows, reply draft agents, bounty tollbooths, Spaces notes, ambassador tasks, and receipt-gated rewards.

Pick it. Fork it. Prompt it. Ship it. Get paid.

- [Meme Casino Agents](./docs/MEME_CASINO_AGENTS.md)
- [Social / X Agents](./docs/SOCIAL_X_AGENTS.md)
- [Agent Templates](./docs/AGENT_TEMPLATES.md)
- [Meme Casino templates](./templates/agents/meme-casino)
- [Social/X templates](./templates/agents/social-x)

## What Is DNA x402?

DNA x402 is a hosted payment gateway for machine-speed commerce.

Your app keeps the product experience. DNA x402 gives you the payment loop:

```txt
Quote. Pay. Verify. Receipt. Unlock.
```

Builders use the hosted API, SDK helpers, OpenAPI spec, and examples in this repo. The backend rail is hosted by DNA x402; this repo does not include private server implementation.

## What Can You Build?

- Paid APIs
- Paid MCP tools
- Buyer agents
- Seller paid APIs
- Data feeds
- Memecoin scanner feeds
- Parad0x-powered signal bots
- Sports and prediction signal resale
- AI inference and compute jobs
- Telegram and Discord bot services
- Community paid rooms
- Signal role gates
- Receipt-gated watchlists
- Degen Mode agents
- Fresh pair and wallet stalker agents
- Live PnL leaderboards
- NULL flywheel reward metadata
- Referral links
- Builder-monetized APIs
- Receipt-gated content
- Agent builder drafts
- Paper agents
- Copy settings
- Alpha monetization accounting

## Start From An Agent Template

Pick a recipe, hand it to Cursor or another coding agent, and ship faster.

- [Prediction Market Agent](./templates/agents/prediction-market/prediction-market-agent.json)
- [Solana Trading Agent](./templates/agents/solana-trading/solana-trading-agent.json)
- [Copy / Follow Agent](./templates/agents/copy-follow/copy-follow-agent.json)
- [Paid API Agent](./templates/agents/paid-api/paid-api-agent.json)
- [Data Feed Agent](./templates/agents/data-feed/data-feed-agent.json)
- [Tool Agent](./templates/agents/tool/tool-agent.json)
- [Compute Agent](./templates/agents/compute/compute-agent.json)
- [Alert Agent](./templates/agents/alerts/alert-agent.json)
- [Automation Agent](./templates/agents/automation/automation-agent.json)
- [Research Agent](./templates/agents/research/research-agent.json)
- [Custom Agent / Make Your Own](./templates/agents/custom/custom-agent.json)
- [One-Click Degen Mode](./templates/agents/degen-live/one-click-degen-mode.json)
- [Fresh Pair Goblin Live](./templates/agents/degen-live/fresh-pair-goblin-live.json)
- [Copy The Chad Live](./templates/agents/degen-live/copy-the-chad-live.json)
- [Degen Alpha Room](./templates/agents/degen-live/degen-alpha-room.json)
- [Live PnL Leaderboard Room](./templates/agents/degen-live/live-pnl-leaderboard-room.json)

Full gallery: [Agent Templates](./docs/AGENT_TEMPLATES.md)

## Meme Casino Agent Pack

Solana builders asked for the fun stuff.

Use the Meme Casino Agent Pack to build wallet stalkers, fresh pair scouts, rug radar, copy agents, paper ape labs, paid signal bots, alpha fee agents, and custom degen machines.

Pick it. Fork it. Prompt it. Ship it. Get paid.

- [Meme Casino Agents](./docs/MEME_CASINO_AGENTS.md)
- [Template folder](./templates/agents/meme-casino)
- [Mock/devnet example](./examples/meme-casino-agents)

## Social / X Agent Pack

Build campaign rooms, proof-of-engagement flows, reply draft agents, bounty tollbooths, Space notes agents, and ambassador task workflows.

Human-approved. Receipt-gated. No fake engagement. No backend custody.

- [Social / X Agents](./docs/SOCIAL_X_AGENTS.md)
- [Template folder](./templates/agents/social-x)
- [Mock proof-review example](./examples/social-x-agents)

## Launch Your Agent As A Telegram Bot

Have an old phone, laptop, VPS, or desktop?

Turn it into an agent server.

Create an agent, make a Telegram bot with BotFather, paste the token into your local launcher, and your agent can start serving signals, alerts, paid results, receipts, and copy settings through Telegram.

Your device runs the bot. DNA x402 handles quote, payment proof, receipt, direct split, builder fees, and unlock flows.

- [Telegram Agent Launcher](./docs/TELEGRAM_AGENT_LAUNCHER.md)
- [BotFather Guide](./docs/BOTFATHER_GUIDE.md)
- [Launcher package](./launchers/telegram)

## Launch Your Agent As A Discord App

Run paid agent commands directly inside a Discord server.

Create a Discord application, add slash commands, keep the bot token on your own device or server, and let your community request paid signals, research drops, alerts, bounty reviews, copy settings, and receipt-gated unlocks.

Your host runs the Discord app. DNA x402 handles quote, payment proof, receipt, direct split, builder fees, and unlock flows.

- [Discord Agent Launcher](./docs/DISCORD_AGENT_LAUNCHER.md)
- [Discord App Guide](./docs/DISCORD_APP_GUIDE.md)
- [Launcher package](./launchers/discord)

## 5-Minute Quickstart

```bash
npm install
npm run acceptance
npm run examples:buyer
```

Create a hosted API client:

```ts
import { DnaX402Client } from "./sdk/typescript/src/index.js";

const dna = new DnaX402Client({
  baseUrl: process.env.DNA_X402_API_URL ?? "https://parad0xlabs.com/x402",
});

const quote = await dna.quote({
  resource: "/signals/btc",
  amountAtomic: "1000000",
  privacyPath: "normal",
});
```

## Optional Live Devnet Smoke

The normal repo checks are mock/devnet simulations so they run without secrets.

For a live Solana devnet RPC smoke:

```bash
DNA_X402_LIVE_DEVNET_SMOKE=1 SOLANA_DEVNET_RPC_URL=https://api.devnet.solana.com npm run acceptance:live:solana-devnet
```

This checks live devnet RPC reachability plus quote, commit, provider proof shape, DNA treasury proof shape, receipt verify, paid unlock, replay rejection, wrong-recipient rejection, and underpay rejection.

- [Live Devnet Smoke](./docs/LIVE_DEVNET_SMOKE.md)

## Use With Cursor Or Coding Agents

Point your coding agent at this repo and say:

```txt
Build a paid API endpoint using DNA x402.
Use the hosted DNA x402 API and the TypeScript SDK in this repo.
Implement quote request, commit, payment proof submit, receipt verification,
fee waterfall display, and paid response unlock.
Do not implement backend custody or backend signing.
```

More copy-paste prompts:

- [AI IDE Quickstart](./docs/AI_IDE_QUICKSTART.md)
- [Cursor Prompts](./docs/CURSOR_PROMPTS.md)
- [Coding Agent Prompts](./docs/AGENT_PROMPTS.md)

## Hosted API URL

```txt
https://parad0xlabs.com/x402
```

Use Public Beta URLs provided by Parad0x Labs for development and beta onboarding.

## Example Flows

- Buyer agent: quote, commit, pay, receipt, paid retry
- Seller API: publish a paid endpoint and unlock results after receipt
- Builder fee: add visible receipt-bound builder fee lines
- Parad0x signal resale: meter signal usage, preserve source attribution, and bind source fees to receipts
- Direct split: submit provider and DNA treasury payment proofs
- Webhook receiver: verify events and idempotency
- Receipt verifier: verify the paid action before unlock
- Agent builder: create safe paper/signal/copy-agent drafts

## Builder Fees

Builders can add visible, receipt-bound builder fees.

DNA's platform fee remains first-class in the same fee waterfall. Every fee line is shown before payment and bound to the receipt.

## Direct Split

Direct split lets a buyer pay the provider and DNA treasury as separate proof-bound transfers.

Finalize requires the required proofs before a receipt is issued:

- provider proof
- DNA treasury proof
- correct mint
- correct recipient
- replay-safe proof
- receipt-bound fee waterfall

## Docs

- [Getting Started](./docs/GETTING_STARTED.md)
- [API Reference](./docs/API_REFERENCE.md)
- [Scenario Matrix](./docs/SCENARIOS.md)
- [x402 Compatibility](./docs/X402_COMPATIBILITY.md)
- [Dark Null Privacy Path](./docs/DARK_NULL_PRIVACY_PATH.md)
- [Fees and Direct Split](./docs/FEES_AND_DIRECT_SPLIT.md)
- [Parad0x Signal Feeds](./docs/PARADOX_SIGNAL_FEEDS.md)
- [Signal Resale And Licensing](./docs/SIGNAL_RESALE_AND_LICENSING.md)
- [Receipts](./docs/RECEIPTS.md)
- [Webhooks](./docs/WEBHOOKS.md)
- [Agent Builder](./docs/AGENT_BUILDER.md)
- [Agent Templates](./docs/AGENT_TEMPLATES.md)
- [Community Agents](./docs/COMMUNITY_AGENTS.md)
- [Meme Casino Agents](./docs/MEME_CASINO_AGENTS.md)
- [Social / X Agents](./docs/SOCIAL_X_AGENTS.md)
- [Telegram Agent Launcher](./docs/TELEGRAM_AGENT_LAUNCHER.md)
- [Discord Agent Launcher](./docs/DISCORD_AGENT_LAUNCHER.md)
- [Live Devnet Smoke](./docs/LIVE_DEVNET_SMOKE.md)
- [Walletless Start](./docs/WALLETLESS_START.md)
- [Public Beta Scope](./docs/PUBLIC_BETA_SCOPE.md)
- [Error Codes](./docs/ERROR_CODES.md)

## Examples

- [Buyer Agent](./examples/buyer-agent-ts)
- [Seller Paid API](./examples/seller-paid-api-ts)
- [Builder Monetized Agent](./examples/builder-monetized-agent-ts)
- [Webhook Receiver](./examples/webhook-receiver-ts)
- [Receipt Verifier](./examples/receipt-verifier-ts)
- [Agent Builder](./examples/agent-builder-ts)
- [Paper Agent](./examples/paper-agent-ts)
- [Copy Settings](./examples/copy-settings-ts)
- [Alpha Monetization](./examples/alpha-monetization-ts)
- [Direct Split Demo](./examples/direct-split-demo-ts)
- [Parad0x Signal Reseller](./examples/paradox-signal-reseller-ts)
- [Parad0x Sports Feed Telegram](./examples/paradox-sports-feed-telegram-ts)
- [Parad0x Signal Dashboard](./examples/paradox-signal-dashboard-ts)
- [Parad0x Result Update Webhook](./examples/paradox-result-update-webhook-ts)
- [Agent Templates](./examples/agent-templates)
- [Community Agents](./examples/community-agents)
- [Meme Casino Agents](./examples/meme-casino-agents)
- [Social / X Agents](./examples/social-x-agents)
- [Telegram Agent Launcher](./launchers/telegram)
- [Discord Agent Launcher](./launchers/discord)

## Public Beta Scope

Public Beta supports builder APIs, paid tools, data feeds, agent creation, paper agents, public profiles, copy settings, alpha monetization accounting, visible fee waterfalls, receipt verification, and low-risk capped live payments.

Current hosted Public Beta live payment caps are `$200` per transaction, `$1,500` daily spend, `$300` daily loss, and `$500` open exposure.

Backend custody, backend signing, hidden fees, auto-sweep, physical goods, high-risk categories, public netting, and unrestricted autonomous live trading are outside Public Beta scope.

## Ship

Build on the money rail for agents.

Plug in with a few API calls. Show the fee waterfall. Verify the receipt. Unlock the result.
