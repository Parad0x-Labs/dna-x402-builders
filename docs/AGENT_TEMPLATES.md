# Agent Templates

Start with a working recipe instead of a blank page.

Pick it. Fork it. Prompt it. Ship it. Get paid.

These templates are public JSON recipes for builders using the hosted DNA x402 rail. They are designed for Cursor, coding agents, and humans who want a fast starting point for paid APIs, agents, data feeds, tools, alerts, compute jobs, paper agents, copy settings, and alpha monetization.

## Template Gallery

### Agent Hub

| Template | Use It For | Recipe |
| --- | --- | --- |
| Prediction Market Agent | Paper or signal market agents with receipt-gated premium output | [JSON](../templates/agents/prediction-market/prediction-market-agent.json) |
| Solana Trading Agent | Token scanner and signal agents with user-confirmed live intent design | [JSON](../templates/agents/solana-trading/solana-trading-agent.json) |
| Copy / Follow Agent | 40c-60c copy rules, risk caps, copied-lot accounting, alpha fees | [JSON](../templates/agents/copy-follow/copy-follow-agent.json) |
| Paid API Agent | Turn an API endpoint into a receipt-gated paid product | [JSON](../templates/agents/paid-api/paid-api-agent.json) |
| Data Feed Agent | Paid crypto, on-chain, sports, weather, or market data feeds | [JSON](../templates/agents/data-feed/data-feed-agent.json) |
| Tool Agent | Paid MCP tools, bot commands, and tool executions | [JSON](../templates/agents/tool/tool-agent.json) |
| Compute Agent | Paid inference, analysis, scraping, simulation, or compute jobs | [JSON](../templates/agents/compute/compute-agent.json) |
| Alert Agent | Paid Telegram, Discord, webhook, email, or dashboard alerts | [JSON](../templates/agents/alerts/alert-agent.json) |
| Automation Agent | Paid workflow runs, monitor jobs, reports, and agent tasks | [JSON](../templates/agents/automation/automation-agent.json) |
| Research Agent | Receipt-gated reports, watchlists, digests, and research feeds | [JSON](../templates/agents/research/research-agent.json) |
| Custom Agent / Make Your Own | Safe blank skeleton for hybrid paid flows | [JSON](../templates/agents/custom/custom-agent.json) |

### Meme Casino Pack

For Solana trenches, signal sellers, copy traders, meme researchers, and paid-agent experiments.

- [Trench Goblin Agent](../templates/agents/meme-casino/trench-goblin-agent.json)
- [Smart Wallet Stalker](../templates/agents/meme-casino/smart-wallet-stalker.json)
- [Fresh Pair Goblin](../templates/agents/meme-casino/fresh-pair-goblin.json)
- [Rug Smell Agent](../templates/agents/meme-casino/rug-smell-agent.json)
- [Exit Liquidity Siren](../templates/agents/meme-casino/exit-liquidity-siren.json)
- [Pump Radar](../templates/agents/meme-casino/pump-radar.json)
- [Volume Goblin](../templates/agents/meme-casino/volume-goblin.json)
- [Whale Tail Agent](../templates/agents/meme-casino/whale-tail-agent.json)
- [Copy The Chad](../templates/agents/meme-casino/copy-the-chad.json)
- [40c-60c Edge Copy Agent](../templates/agents/meme-casino/forty-sixty-edge-copy-agent.json)
- [Paper Ape Lab](../templates/agents/meme-casino/paper-ape-lab.json)
- [PnL Flex Machine](../templates/agents/meme-casino/pnl-flex-machine.json)
- [Alpha Tollbooth](../templates/agents/meme-casino/alpha-tollbooth.json)
- [Telegram Signal Tollbooth](../templates/agents/meme-casino/telegram-signal-tollbooth.json)
- [Discord Signal Tollbooth](../templates/agents/meme-casino/discord-signal-tollbooth.json)
- [Degen Research Goblin](../templates/agents/meme-casino/degen-research-goblin.json)
- [Creator Wallet Tracker](../templates/agents/meme-casino/creator-wallet-tracker.json)
- [Liquidity Pull Warning Agent](../templates/agents/meme-casino/liquidity-pull-warning-agent.json)
- [Dead Coin Revival Watcher](../templates/agents/meme-casino/dead-coin-revival-watcher.json)
- [Meme Casino Dealer](../templates/agents/meme-casino/meme-casino-dealer.json)

### Social / X Pack

For campaign rooms, proof-of-engagement, human-reviewed bounties, reply drafts, Space notes, and ambassador tasks.

- [X Campaign Brief Agent](../templates/agents/social-x/x-campaign-brief-agent.json)
- [X Reply Draft Agent](../templates/agents/social-x/x-reply-draft-agent.json)
- [X Proof Of Engagement Agent](../templates/agents/social-x/x-proof-of-engagement-agent.json)
- [X Bounty Tollbooth](../templates/agents/social-x/x-bounty-tollbooth.json)
- [X Comment Quality Reviewer](../templates/agents/social-x/x-comment-quality-reviewer.json)
- [X Campaign Room](../templates/agents/social-x/x-campaign-room.json)
- [X Thread Builder Agent](../templates/agents/social-x/x-thread-builder-agent.json)
- [X Spaces Notes Agent](../templates/agents/social-x/x-spaces-notes-agent.json)
- [X Ambassador Task Agent](../templates/agents/social-x/x-ambassador-task-agent.json)
- [X Engagement Receipt Agent](../templates/agents/social-x/x-engagement-receipt-agent.json)

## How To Use A Template

1. Pick a template JSON.
2. Copy its `suggestedPrompt` into Cursor or another coding agent.
3. Ask it to build against `DNA_X402_API_URL`.
4. Keep examples mock by default.
5. Move to live Public Beta payments only when your flow shows the fee waterfall, verifies receipts, and avoids backend custody and backend signing.

## Copy-Paste Prompt

```txt
Use the DNA x402 Builder Kit and the agent template JSON I provide.

Build this agent against the hosted DNA x402 API.
Use DNA_X402_API_URL from .env.
Implement quote, commit, finalize, receipt verification, paid retry, and fee waterfall display where the template needs paid access.
If the template uses copy settings, keep follower risk controls first-class.
If the template uses alpha monetization, charge only on positive finalized copied-lot profit.
Keep the example mock by default.
Do not implement backend custody.
Do not implement backend signing.
Do not store private keys.
```

## Template Shape

Each template includes:

- `name`
- `slug`
- `category`
- `description`
- `degenPitch`
- `whatItDoes`
- `defaultMode`
- `walletModel`
- `publicBetaMode`
- `riskLimits`
- `copyRules`
- `monetization`
- `receiptBehavior`
- `cursorPrompt`
- `exampleFlow`
- `notInBetaScope`

## Public Beta Scope

Public Beta supports paid APIs, agents, tools, data feeds, paper agents, public profiles, copy settings, alpha monetization accounting, visible fee waterfalls, receipt verification, and low-risk capped live payments.

Outside Public Beta scope:

- backend custody
- backend signing
- hidden fees
- auto-sweep
- physical goods
- high-risk categories
- public netting
- unrestricted autonomous live trading

## Good Defaults

Use small risk caps first. Show the fee waterfall before payment. Verify receipts before unlock. Keep private keys in the user's wallet or client. Bind paid output to a receipt ID.
