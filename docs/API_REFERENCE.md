# API Reference

Base URL:

```txt
https://parad0xlabs.com/x402
```

Use Public Beta URLs provided by Parad0x Labs for development.

## Health

`GET /health`

Returns API health.

## Listing Search

`GET /market/search?capability=data_feed&maxPriceAtomic=100000`

Finds builder APIs, data feeds, tools, and agent services listed on DNA x402.

## Quote

`GET /quote?resource=/resource&amountAtomic=100000`

Optional privacy path:

```txt
GET /quote?resource=/signals/private-alpha&amountAtomic=1000000&privacyPath=dark-null
```

`privacyPath=normal` is the default. `privacyPath=dark-null` requests the optional Dark Null private receipt lane when the builder account and receipt are eligible.

Builder fee quote:

```txt
GET /quote?resource=/signals/btc&amountAtomic=1000000&builderId=btc_builder&builderFeeBps=50&builderRecipient=<builder-wallet>&builderFeeMode=builder_accrual
```

The response can include `feeWaterfallV2`. For live paid Public Beta Solana USDC flows, required fee lines must be paid separately:

- provider/seller transfer
- DNA treasury 0.1% transfer

## Commit

`POST /commit`

```json
{
  "quoteId": "quote-id",
  "payerCommitment32B": "0x..."
}
```

## Finalize

Single-proof finalize is for non-direct-split or non-live flows:

```json
{
  "commitId": "commit-id",
  "paymentProof": {
    "settlement": "transfer",
    "txSignature": "solana-signature"
  }
}
```

Direct-split finalize is required for live paid Public Beta Solana USDC flows:

```json
{
  "commitId": "commit-id",
  "splitPaymentProofs": [
    {
      "feeLineId": "provider-line-id",
      "paymentProof": {
        "settlement": "transfer",
        "txSignature": "provider-transfer",
        "amountAtomic": "999000"
      }
    },
    {
      "feeLineId": "dna-platform-line-id",
      "paymentProof": {
        "settlement": "transfer",
        "txSignature": "dna-treasury-transfer",
        "amountAtomic": "1000"
      }
    }
  ]
}
```

Finalize rejects missing DNA proof, wrong treasury recipient, wrong mint, underpay, replay, proof reuse, and fee waterfall tampering.

## Receipt

`GET /receipt/:receiptId`

Fetches receipt payload and signature. Use receipts to verify quote, commit, payment proof, fee waterfall, request digest, response digest, and policy state.

## Optional Dark Null Private Receipt

`POST /v1/privacy/dark-null/receipts`

```json
{
  "receiptId": "receipt-id",
  "network": "devnet",
  "mode": "proof_bound",
  "settlementSignature": "solana-signature",
  "settlementSlot": 434395918,
  "previousReceiptHash": null
}
```

Response:

```json
{
  "schema": "dna-x402-dark-null-privacy-response-v1",
  "status": "created",
  "network": "devnet",
  "normalPath": "dna-x402",
  "privacyPath": "dark-null",
  "receiptId": "receipt-id",
  "dnaReceiptHash": "64-hex",
  "darkNullReceiptHash": "64-hex",
  "manifestLabel": "canonical-devnet-root-2"
}
```

Fetch a private receipt summary:

```txt
GET /v1/privacy/dark-null/receipts/:receiptHash
```

The public builder contract exposes receipt summaries and hashes only. Backend verifier internals are not included in this repo.

## Paid Retry

Retry the paid endpoint after receipt verification. Your app should unlock results only after the receipt is present and valid.

Common app-level header:

```txt
X-DNA-Receipt: <receipt-token-or-id>
```

## Webhooks

Common public events:

- `quote.created`
- `payment.finalized`
- `receipt.issued`
- `fulfillment.completed`
- `policy.review_required`

Webhook handlers should verify signatures, reject stale timestamps, store idempotency keys, and avoid raw PII in logs.

## Builder Fees

Builder fee quote parameters:

- `builderId`
- `builderFeeBps` (`50` = `0.5%`, `200` = `2%`)
- `builderRecipient`
- `builderFeeMode=display_only|builder_accrual`

Builder fees are visible and receipt-bound. DNA's platform fee remains first-class in the same fee waterfall.

## Parad0x Signal Usage

Parad0x-powered builder agents should treat every signal delivery or unlock as a usage event:

```json
{
  "usageId": "usage_signal_001",
  "signalId": "px_poly_btc_5m_001",
  "source": "PARADOX_POLYMARKET_FEED",
  "builderId": "builder-id",
  "agentId": "agent-id",
  "usageType": "SIGNAL_WITH_REASONING",
  "receiptId": "receipt-id"
}
```

Supported usage types include:

- `SIGNAL_PING`
- `SIGNAL_WITH_REASONING`
- `RESULT_UPDATE`
- `SETTLEMENT_UPDATE`
- `COPY_INTENT`
- `DASHBOARD_VIEW`
- `WEBHOOK_DELIVERY`
- `TELEGRAM_DELIVERY`
- `DISCORD_DELIVERY`

Parad0x signal receipts should include:

```json
{
  "signalId": "px_poly_btc_5m_001",
  "signalSource": "PARADOX_POLYMARKET_FEED",
  "builderId": "builder-id",
  "agentId": "agent-id",
  "usageType": "SIGNAL_WITH_REASONING",
  "sourceAttribution": "Parad0x Labs",
  "signalDigest": "sha256:...",
  "feeWaterfallHash": "..."
}
```

Rules:

- active builder signal license required for Parad0x sources
- source attribution must remain visible
- Parad0x signal source fee cannot be removed
- DNA platform fee cannot be removed
- fee lines must be visible before payment
- no guaranteed-profit or fake-PnL claims

## Agent Wallet Public-Key Registration

`POST /v1/agents/:agentId/wallets/register`

Registers public wallet metadata only:

```json
{
  "ownerWallet": "owner-public-wallet",
  "publicKey": "agent-wallet-public-key",
  "chain": "SOLANA",
  "keyStorage": "LOCAL_ENCRYPTED"
}
```

Do not send private keys, seed phrases, mnemonics, or backend signing material.

## Paper Agent Creation

`POST /v1/agents/:agentId/paper-account`

Creates a paper account for strategy testing.

## Copy Settings

`POST /v1/copy/settings`

```json
{
  "followerAgentId": "follower",
  "sourceAgentId": "source",
  "enabled": true,
  "mode": "PAPER_COPY",
  "copyBuys": true,
  "copySells": false,
  "copyExits": false,
  "minEntryPriceBps": 4000,
  "maxEntryPriceBps": 6000,
  "maxBetSizeAtomic": "5000000",
  "maxDailySpendAtomic": "25000000",
  "maxOpenExposureAtomic": "10000000"
}
```

## Alpha Monetization

`POST /v1/agents/:agentId/monetization`

Alpha fees apply only to positive finalized copied-lot profit.

Allowed alpha fee percentages:

- `50` = `0.5%`
- `100` = `1%`
- `150` = `1.5%`
- `200` = `2%`
- `250` = `2.5%`
- `300` = `3%`

## Copied Lot Finalization

`POST /v1/copy/lots/:copiedLotId/finalize`

Finalizes copied-lot PnL. Winning copied lots can create alpha fee accruals. Losing, break-even, unrealized, and non-copied trades do not create success fees.

## Agent Builder

`POST /v1/agent-builder/draft`

Creates a safe structured draft from a prompt, guided answers, template, or clone request.

`POST /v1/agent-builder/drafts/:draftId/confirm`

Confirms the draft after risk summary acknowledgements.

Unsafe prompts are rejected. Backend custody and backend signing are never accepted.
