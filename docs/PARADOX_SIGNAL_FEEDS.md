# Parad0x Signal Feeds

Parad0x signals can be used as a paid source layer for builder agents, bots, dashboards, feeds, and community rooms.

Builders own the audience and UX. Parad0x owns the source signal. DNA x402 owns the quote, receipt, fee, and unlock rail.

```txt
end user pays
+-- builder / agent owner fee
+-- Parad0x signal source fee
+-- DNA x402 0.1% rail fee
```

## Signal Sources

Supported source labels:

- `PARADOX_SPORTS_BETS_FEED`
- `PARADOX_POLYMARKET_FEED`
- `PARADOX_CRYPTO_SIGNAL_FEED`
- `BUILDER_EXTERNAL_FEED`
- `MANUAL_USER_SIGNAL`

Parad0x sources require a builder signal license before resale or paid delivery.

No active license means no resale of Parad0x source alpha.

## Metered Usage Types

Every Parad0x-powered builder use should create a usage event:

- `SIGNAL_PING`
- `SIGNAL_WITH_REASONING`
- `RESULT_UPDATE`
- `SETTLEMENT_UPDATE`
- `COPY_INTENT`
- `DASHBOARD_VIEW`
- `WEBHOOK_DELIVERY`
- `TELEGRAM_DELIVERY`
- `DISCORD_DELIVERY`

## Suggested Defaults

Use config defaults in your app instead of hardcoding business logic:

```txt
PARADOX_SIGNAL_PING_FEE_ATOMIC=10000
PARADOX_SIGNAL_REASONING_FEE_ATOMIC=100000
PARADOX_SIGNAL_RESULT_UPDATE_FEE_ATOMIC=10000
PARADOX_SIGNAL_RESALE_SHARE_BPS=2000
```

Typical public framing:

- signal ping: `$0.01`
- signal plus reasoning: `$0.10`
- result or settlement update: `$0.01`
- builder resale share: `10%` to `30%`
- copy-profit alpha fee: `0.5%` to `3%` of positive finalized copied-lot profit
- DNA rail fee: `0.1%`

## Receipt Metadata

Parad0x signal receipts should bind:

- `signalId`
- `signalSource`
- `builderId`
- `agentId`
- `usageType`
- source attribution: `Parad0x Labs`
- `signalDigest`
- optional `resultDigest`
- `feeWaterfallHash`

The receipt should also bind `resultDigest` when a result or settlement update is present.

## Builder UX

For a prediction market or sports agent setup, show:

```txt
Choose signal source:
- My own signals
- External API
- Parad0x Sports Bets Feed
- Parad0x Crypto / Polymarket Feed
```

If a Parad0x source is selected:

```txt
Parad0x signal source fees apply.
Every signal use is receipt-bound.
You can customize presentation, alerts, bot UX, and pricing.
You cannot remove source attribution, remove source fees, or hide fees.
```

## Rules

Builders can customize presentation, alerts, bot commands, dashboards, pricing, and routing.

They cannot:

- remove Parad0x source attribution
- remove the Parad0x source fee
- remove the DNA 0.1% rail fee
- free-resell Parad0x source alpha
- hide fee lines
- claim guaranteed profit
- fake results or PnL
- scrape unlimited signals
- enable unsupported live auto-bet paths

## Public Wording

Builders can plug Parad0x live signals into their own bots, dashboards, feeds, and agents. Customize the UX, sell alerts, gate dashboards, or deliver signals through Telegram/Discord. Every signal use is metered, visible, receipt-bound, and attribution-preserving.
