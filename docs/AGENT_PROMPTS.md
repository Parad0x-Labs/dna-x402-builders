# Coding Agent Prompts

## Repository Task Prompt

```txt
Use the DNA x402 Builder Kit in this repo.

Implement a paid API integration in my app:
- use the hosted DNA x402 API
- request quote
- commit quote
- show fee waterfall
- submit payment proof or direct split proofs
- verify receipt
- unlock paid response
- add webhook receiver
- add tests

Hard rules:
- no backend custody
- no backend signing
- no private keys in server env
- examples must run in mock mode by default
```

## Builder Monetization Prompt

```txt
Add builder monetization to my paid API.

Use DNA x402 builder fee parameters:
- builderId
- builderFeeBps (50 = 0.5%)
- builderRecipient
- builderFeeMode=builder_accrual

Show the builder fee in the UI before payment and persist receipt ID after unlock.
```

## Direct Split Prompt

```txt
Add DNA x402 direct split finalize support.

Read feeWaterfallV2.lines.
Find requiredForFinalize lines.
Submit splitPaymentProofs for provider and DNA platform fee.
Reject unlock if any required proof is missing or receipt verification fails.
```

## Optional Dark Null Privacy Path Prompt

```txt
Add the optional Dark Null privacy receipt path to my DNA x402 integration.

Use normal DNA x402 as the default path.
Only request privacyPath=dark-null for privacy-sensitive paid unlocks.
After finalize returns a DNA receipt, call requestDarkNullReceipt with receiptId,
network=devnet for integration testing, settlementSignature, and settlementSlot.
Store only receipt hashes and summaries in my app.
Do not store raw payment headers, raw buyer metadata, or private keys.
```

## Meme Casino Pack Prompt

```txt
Use the DNA x402 Meme Casino Agent templates.
Create a paid signal agent for Solana trenches.
It should run in signal or paper mode by default, use receipt-gated alerts, show the fee waterfall, and never store private keys or sign in the backend.
```

## Social Proof Pack Prompt

```txt
Use the DNA x402 Social/X Agent templates.
Create a proof-reviewed campaign workflow.
It should collect proof URLs or hashes, require timestamps, require human review, issue receipts only after proof acceptance, and reject fake engagement or auto-spam behavior.
```

## Telegram Launcher Prompt

```txt
Use the DNA x402 Telegram Agent Launcher.
Launch my agent as a self-hosted Telegram bot.
The bot should use the hosted DNA x402 API for quote, payment proof, receipt verification, direct split, builder fees, and paid unlocks.
The bot token stays local.
No backend custody.
No backend signing.
```

## Discord Launcher Prompt

```txt
Use the DNA x402 Discord Agent Launcher.
Launch my agent as a self-hosted Discord app with slash commands.
The app should use the hosted DNA x402 API for quote, payment proof, receipt verification, direct split, builder fees, and paid unlocks.
The Discord token stays local.
No backend custody.
No backend signing.
Paid signals, research drops, bounties, and copy alerts should require receipts or proof review before unlock.
```

## Community Agent Prompt

```txt
Use the DNA x402 Community Agent Pack.
Create a Telegram/Discord community monetization agent.
It should support paid rooms, signal role gates, research drops, watchlists, copy alerts, bounty boards, daily briefs, and receipt-gated unlocks.
Start walletless in mock mode.
Require receipts before paid unlocks.
Require human review for proof or bounty workflows.
No backend custody.
No backend signing.
No hidden fees.
```
