# AI IDE Quickstart

Point Cursor or another coding agent at this repo and use these prompts.

## Paid API Prompt

```txt
I want to integrate DNA x402 into my app.

Use the docs and TypeScript SDK in this repo.
Create a paid API endpoint that:
1. requests a DNA x402 quote
2. commits the quote
3. accepts payment proof
4. verifies the signed receipt
5. unlocks the paid response
6. shows the fee waterfall
7. logs the receipt ID

Use the hosted API URL from .env.
Do not implement backend custody.
Do not implement backend signing.
Do not store private keys.
```

## Buyer Agent Prompt

```txt
Build a buyer agent that calls a paid DNA x402 endpoint.

Flow:
- search/list paid resources
- request quote
- show fee waterfall
- commit quote
- submit payment proof or direct split proofs
- fetch receipt
- retry paid endpoint
- print receipt ID and paid result

Use mock mode by default.
```

## Seller API Prompt

```txt
Build a seller paid API using DNA x402.

The endpoint should:
- describe the paid resource
- request a quote from hosted DNA x402
- require receipt verification before unlock
- return JSON after payment
- never store user private keys
```

## Data Feed Prompt

```txt
Build a paid data feed endpoint with DNA x402.

Requirements:
- quote per data snapshot
- receipt-bound response digest
- webhook event on fulfillment
- cache-free paid unlock path
- no backend signing
```

## Builder Fee Prompt

```txt
Add a visible builder fee to a DNA x402 quote.

Use:
- builderId
- builderFeeBps (50 = 0.5%)
- builderRecipient
- builderFeeMode=builder_accrual

Show the provider amount, DNA platform fee, builder fee, and total before payment.
```

## Receipt Verifier Prompt

```txt
Build a receipt verifier for DNA x402.

It should fetch a receipt, verify required fields, show fee lines, display direct split proof summaries, and refuse to unlock if the receipt is missing or invalid.
```

## Webhook Receiver Prompt

```txt
Build a DNA x402 webhook receiver.

It should:
- verify signature header
- reject old timestamps
- store idempotency keys
- reject duplicate idempotency keys
- avoid writing raw PII into logs
- handle receipt.issued and fulfillment.completed events
```

## Paper Agent Prompt

```txt
Build a paper agent using DNA x402 Public Beta APIs.

Create a paper account, show 10,000 paper USDC, record paper trades, show PnL, ROI, win rate, average entry price, and a PAPER badge.
```

## Copy Settings Prompt

```txt
Build copy settings UI/API integration for DNA x402.

Support:
- copy buys
- copy sells
- copy exits
- min/max entry price
- max bet size
- daily spend cap
- open exposure cap
- daily loss cap
- custom take profit
- custom stop loss
- approval threshold
```

## Alpha Monetization Prompt

```txt
Build alpha monetization settings for DNA x402.

Allow success fees of 0.5%, 1%, 1.5%, 2%, 2.5%, or 3%.
Apply fees only to positive finalized copied-lot profit.
No fees on losses, break-even, unrealized PnL, or non-copied trades.
```
