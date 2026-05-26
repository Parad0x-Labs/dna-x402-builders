# NULL Flywheel

`$NULL` mint: `8EeDdvCRmFAzVD4takkBrNNwkeUTUQh4MscRK5Fzpump`

The flywheel turns paid agent usage into a visible community rewards loop.

```txt
paid unlock -> premium fee event -> 5 bps flywheel allocation -> randomized execution -> RewardsVault receipt
```

## Builder Pitch

Builders can charge for high-signal actions and keep the payment flow simple:

- signal reveal
- risk check
- hint tier
- sniper tax
- ritual gate
- private room unlock
- premium API access

DNA x402 handles quote, payment proof, signed receipt, fee waterfall, and unlock. The `$NULL` flywheel metadata binds qualifying premium fee events to the RewardsVault path without adding a hidden buyer fee line.

## What Is Proven

The DNA x402 flywheel implementation adds:

- 25 Rust tests across accumulator logic, schedule randomization, public receipts, epoch aggregation, and end-to-end simulation
- fixed `5` bps allocation from qualifying premium fee events
- `RewardsVault` as the active destination
- commit-reveal schedule randomization so execution timing is not predictable from the accumulator alone
- public execution receipt metadata with commitment hash, seed hash, execution slot, destination tag, and epoch aggregate
- simulation covering 1000 signal events, 250 risk-check events, and 100 hint-tier events with `all_steps_proven=true`

## Builder Surface

Use the SDK constants and helper when your app needs to tag paid unlocks with flywheel metadata:

```ts
import {
  NULL_FLYWHEEL_ALLOCATION_BPS,
  NULL_MINT,
  buildNullFlywheelReceiptMetadata,
} from "dna-x402-builders";

const flywheel = buildNullFlywheelReceiptMetadata({
  feeSource: "SIGNAL_REVEAL_FEE",
  receiptId: "receipt_123",
  feeEventId: "fee_event_123",
  feeWaterfallHash: "fee_waterfall_hash",
  commitmentHash: "commitment_hash_when_available",
  executionReceiptHash: "execution_receipt_hash_when_available",
});

console.log(NULL_MINT, NULL_FLYWHEEL_ALLOCATION_BPS, flywheel.destination);
```

## Product Loops

| Loop | Paid Action | Flywheel Hook |
| --- | --- | --- |
| Alpha room | reveal a premium call | `SIGNAL_REVEAL_FEE` |
| Risk bot | score a wallet, pool, or token | `RISK_CHECK_FEE` |
| Hint ladder | unlock tiered signal context | `HINT_TIER_FEE` |
| Fast-entry agent | pay high-velocity execution tax | `SNIPER_TAX_FEE` |
| Gated compute | access ritual-bound compute or API work | `RITUAL_GATE_FEE` |

## Copy For Builder Frontends

Short:

```txt
Every qualifying premium unlock can feed the $NULL RewardsVault through a capped 5 bps flywheel allocation, with randomized execution timing and public receipt metadata.
```

Punchier:

```txt
Paid alpha does not just unlock content. It can feed the $NULL RewardsVault. Signal reveals, risk checks, hint tiers, and sniper-tax flows produce receipt-bound flywheel metadata.
```

## Rules For Builders

- Show the user-facing quote and fee waterfall before payment.
- Keep wallet signing client-side or user-owned.
- Use `$NULL` flywheel metadata only for qualifying premium fee events.
- Do not present flywheel allocation as a guaranteed return, yield product, buyback, or price promise.
- Keep the token mint exact: `8EeDdvCRmFAzVD4takkBrNNwkeUTUQh4MscRK5Fzpump`.
