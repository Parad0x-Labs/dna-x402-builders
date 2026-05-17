# API Reference

Base URL:

```txt
https://parad0xlabs.com/x402
```

Use staging URLs provided by Parad0x Labs for development.

## Health

`GET /health`

Returns API health.

## Listing Search

`GET /market/search?capability=data_feed&maxPriceAtomic=100000`

Finds builder APIs, data feeds, tools, and agent services listed on DNA x402.

## Quote

`GET /quote?resource=/resource&amountAtomic=100000`

Builder fee quote:

```txt
GET /quote?resource=/signals/btc&amountAtomic=1000000&builderId=btc_builder&builderFeeBps=50&builderRecipient=<builder-wallet>&builderFeeMode=builder_accrual
```

The response can include `feeWaterfallV2`. For live paid Public Beta Solana USDC flows, required fee lines must be paid separately:

- provider/seller transfer
- DNA treasury 10 bps transfer

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

## Agent Builder

`POST /v1/agent-builder/draft`

Creates a safe structured draft from a prompt, guided answers, template, or clone request.

`POST /v1/agent-builder/drafts/:draftId/confirm`

Confirms the draft after risk summary acknowledgements.

Unsafe prompts are rejected. Backend custody and backend signing are never accepted.

