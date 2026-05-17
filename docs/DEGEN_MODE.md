# Degen Mode

Connect wallet. Pick agent. Set max pain. Let it cook.

Degen Mode is a public builder architecture for Solana-native agent casino flows:

- fresh pair goblins
- wallet stalkers
- copy-the-chad agents
- risk radar
- momentum radar
- alpha rooms
- live PnL leaderboards
- referral links
- positive-PnL alpha fees

It is not a backend-custody or backend-signing system. Builders create agent configs, risk profiles, trade intents, paid unlocks, receipts, and templates. Users keep wallet control.

## The Loop

```txt
Connect wallet
Pick agent
Set max pain
Launch
Watch / signal / approve / copy with caps
Verify receipts
Pause when needed
```

## Max Pain Rules

Every live or capped-live agent needs:

- max trade
- daily spend
- daily loss
- open exposure
- max slippage
- pause / kill switch

Use product language like ape budget, bankroll rules, max pain, risk profile, and kill switch. The SDK still exposes precise fields for builders.

## Modes

| Mode | Wallet Needed | What It Does |
| --- | --- | --- |
| `WATCH_ONLY` | No | Watch feeds, wallets, rooms, leaderboards, and receipts. |
| `SIGNAL_ONLY` | No | Emit alerts, research, paid signals, and previews. |
| `PAPER_SIM` | No | Run simulated strategies and demo agents. |
| `USER_CONFIRMED_LIVE` | Yes | Create live intents that users review and sign client-side. |
| `CAPPED_AUTO_LIVE` | Yes | Public Beta architecture for capped copy/live flows with explicit risk config and gates. |

## Trust Rules

- no backend private keys
- no backend custody
- no backend signing
- no hidden fees
- no fake PnL
- no guaranteed-profit claims
- no loss-rake referral default
- user-owned wallet
- user-set risk caps
- receipt-bound paid actions
- pause / kill switch

## Templates

Start from [`templates/agents/degen-live`](../templates/agents/degen-live).

Good first picks:

- One-Click Degen Mode
- Fresh Pair Goblin Live
- Copy The Chad Live
- Wallet Stalker Live
- Degen Alpha Room
- Live PnL Leaderboard Room
- Telegram Ape Button Agent
- Discord Ape Room Agent
