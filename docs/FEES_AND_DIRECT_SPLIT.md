# Fees And Direct Split

DNA x402 uses visible fee lines. Every fee is shown before payment and bound to the receipt.

## Public Beta Live Paid Flow

For live paid Solana USDC Public Beta flows:

- buyer pays provider/seller
- buyer pays DNA treasury 0.1%
- finalize requires both payment proofs
- receipt binds both proofs
- replay/underpay/wrong recipient/wrong mint are rejected

## Builder Fees

Builders can add visible builder fees in beta:

- `display_only`
- `builder_accrual`

Builder direct collection is a separate approval path.

## Forbidden

- hidden fee
- backend custody
- backend signing
- backend auto-sweep
- fee replacement attack
- builder fee replacing DNA fee

## Example Waterfall

```json
{
  "grossAmount": "1000000",
  "lines": [
    {
      "kind": "PROVIDER_AMOUNT",
      "amount": "999000",
      "requiredForFinalize": true
    },
    {
      "kind": "DNA_PLATFORM_FEE",
      "amount": "1000",
      "requiredForFinalize": true
    },
    {
      "kind": "BUILDER_FEE",
      "amount": "5000",
      "collectionStatus": "ACCRUED_NOT_COLLECTED"
    }
  ]
}
```
