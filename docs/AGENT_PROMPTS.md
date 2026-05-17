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
- builderFeeBps
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

