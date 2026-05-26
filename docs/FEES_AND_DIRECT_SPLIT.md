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

## Parad0x Signal Source Fees

Builders can use Parad0x signal feeds inside their own agents, bots, rooms, and dashboards.

If a paid product uses a Parad0x signal source, the fee waterfall should include:

- builder fee, if the builder charges one
- Parad0x signal source fee
- DNA 0.1% rail fee
- optional alpha/success fee where copy-profit rules apply

Parad0x source fees cannot be removed when the source is:

- `PARADOX_SPORTS_BETS_FEED`
- `PARADOX_POLYMARKET_FEED`
- `PARADOX_CRYPTO_SIGNAL_FEED`

Receipts should bind `signalId`, `signalSource`, `usageType`, `sourceAttribution`, `signalDigest`, and `feeWaterfallHash`.

## NULL Flywheel Allocation

Qualifying premium fee events can attach `$NULL` flywheel metadata.

`$NULL` mint: `8EeDdvCRmFAzVD4takkBrNNwkeUTUQh4MscRK5Fzpump`

The builder-facing shape is:

- premium action emits a fee event
- SDK tags the event with `feeSource`, `receiptId`, `feeEventId`, and `feeWaterfallHash`
- `5` bps allocation is routed to the flywheel metadata path
- randomized execution writes public receipt metadata
- destination is `RewardsVault`

This is not an extra hidden buyer fee line. The buyer-facing quote and fee waterfall stay visible before payment.

## Forbidden

- hidden fee
- removing Parad0x signal source fee
- removing Parad0x source attribution
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
    },
    {
      "kind": "PARADOX_SIGNAL_SOURCE_FEE",
      "amount": "10000",
      "collectionStatus": "COLLECTED_DIRECT_SPLIT"
    }
  ]
}
```
