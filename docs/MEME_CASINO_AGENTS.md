# Meme Casino Agents

For Solana trenches, signal sellers, copy traders, meme researchers, and weird paid-agent experiments.

Pick it.
Fork it.
Prompt it.
Ship it.
Get paid.

## What Is In The Pack

The Meme Casino Agent Pack gives builders ready-made JSON recipes for:

- wallet stalkers
- fresh pair scouts
- rug radar
- exit warnings
- volume and whale flow alerts
- copy/follow agents
- paper ape labs
- PnL flex profiles
- paid Telegram and Discord signal tollbooths
- degen research reports
- creator wallet trackers
- liquidity warnings
- custom hybrid degen machines

Every template is hosted-rail friendly:

- no backend custody
- no backend signing
- no hidden fees
- no auto-buy by default
- receipt-gated paid actions
- visible fee waterfall
- client-side wallet ownership where live intent exists

## Templates

| Template | What It Does | Recipe |
| --- | --- | --- |
| Trench Goblin Agent | Tracks fresh meme activity, new socials, wallet clusters, and abnormal volume. | [JSON](../templates/agents/meme-casino/trench-goblin-agent.json) |
| Smart Wallet Stalker | Watches selected public wallets and emits buy/sell/rotation alerts. | [JSON](../templates/agents/meme-casino/smart-wallet-stalker.json) |
| Fresh Pair Goblin | Watches new token pairs with liquidity, age, volume, holder, creator, and risk filters. | [JSON](../templates/agents/meme-casino/fresh-pair-goblin.json) |
| Rug Smell Agent | Flags liquidity, creator, holder, and suspicious-volume risk signals. | [JSON](../templates/agents/meme-casino/rug-smell-agent.json) |
| Exit Liquidity Siren | Alerts on liquidity drops, sell pressure, whale exits, volume collapse, and drawdown triggers. | [JSON](../templates/agents/meme-casino/exit-liquidity-siren.json) |
| Pump Radar | Detects volume/social/price acceleration without coordination behavior. | [JSON](../templates/agents/meme-casino/pump-radar.json) |
| Volume Goblin | Tracks volume spikes and abnormal pair flow. | [JSON](../templates/agents/meme-casino/volume-goblin.json) |
| Whale Tail Agent | Tracks whale wallet movements and rotations. | [JSON](../templates/agents/meme-casino/whale-tail-agent.json) |
| Copy The Chad | Copy/follow flow with buys, sells, exits, caps, TP/SL, and alpha fees. | [JSON](../templates/agents/meme-casino/copy-the-chad.json) |
| 40c-60c Edge Copy Agent | Copies only entries between 40c and 60c. | [JSON](../templates/agents/meme-casino/forty-sixty-edge-copy-agent.json) |
| Paper Ape Lab | Paper trading simulator with 10,000 paper USDC and profile stats. | [JSON](../templates/agents/meme-casino/paper-ape-lab.json) |
| PnL Flex Machine | Public profile and leaderboard template with proof receipts. | [JSON](../templates/agents/meme-casino/pnl-flex-machine.json) |
| Alpha Tollbooth | Alpha fee accounting from 0.5% to 3% on positive finalized copied-lot PnL. | [JSON](../templates/agents/meme-casino/alpha-tollbooth.json) |
| Telegram Signal Tollbooth | Receipt-gated Telegram signal unlocks. | [JSON](../templates/agents/meme-casino/telegram-signal-tollbooth.json) |
| Discord Signal Tollbooth | Receipt-gated Discord signal unlocks. | [JSON](../templates/agents/meme-casino/discord-signal-tollbooth.json) |
| Degen Research Goblin | Token/project/social research reports with source trails and risk notes. | [JSON](../templates/agents/meme-casino/degen-research-goblin.json) |
| Creator Wallet Tracker | Tracks deployer/creator wallet launches, sells, transfers, liquidity actions, and clusters. | [JSON](../templates/agents/meme-casino/creator-wallet-tracker.json) |
| Liquidity Pull Warning Agent | Monitors liquidity pool changes and dangerous movement. | [JSON](../templates/agents/meme-casino/liquidity-pull-warning-agent.json) |
| Dead Coin Revival Watcher | Tracks dead or quiet tokens showing unusual activity. | [JSON](../templates/agents/meme-casino/dead-coin-revival-watcher.json) |
| Meme Casino Dealer | Hybrid alerts, wallet tracking, paid signals, copy rules, profile, and alpha fee config. | [JSON](../templates/agents/meme-casino/meme-casino-dealer.json) |

## Prompt

```txt
Use the DNA x402 Meme Casino Agent templates.

Build a Fresh Pair Goblin agent that:
- watches new Solana token pairs
- filters by liquidity, volume, holder concentration, creator warning, and risk tier
- runs in signal mode by default
- can produce receipt-gated paid alerts
- never stores private keys
- never signs in the backend
- never auto-buys by default
```

## Mock/Devnet Acceptance

```bash
npm run examples:meme-casino
npm run acceptance:templates:devnet
```

The checks prove:

- templates parse
- safe drafts can be generated
- receipt behavior is defined
- mock/devnet quote and commit work
- mock/devnet finalize or proof-review works
- underpay, wrong recipient, and replay cases reject
- unsafe live movement is not triggered by default
