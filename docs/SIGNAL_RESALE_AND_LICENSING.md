# Signal Resale And Licensing

DNA x402 supports signal resale as a visible, receipt-bound business model.

Fair split:

```txt
Parad0x owns signal source
Builder owns audience / UX
DNA x402 owns rail / receipt / fee flow
Everyone gets paid
```

## Builder Signal License

Builder agents that use Parad0x sources should model license state like this:

```ts
type BuilderSignalLicense = {
  builderId: string;
  allowedSources: string[];
  allowedUsageTypes: string[];
  resaleAllowed: boolean;
  attributionRequired: boolean;
  maxDailySignals?: number;
  status: "ACTIVE" | "REVIEW_REQUIRED" | "SUSPENDED";
};
```

## Required Checks

Reject the flow if:

- the builder has no active license for the Parad0x source
- the usage type is not allowed
- source attribution is removed
- the Parad0x source fee is removed
- fee lines are hidden
- the builder claims guaranteed profit
- the builder fakes result or PnL data
- usage caps are exceeded
- an unsupported live auto-bet path is requested

## Fee Waterfall

When a builder sells a Parad0x-powered signal:

```txt
buyer total
├─ builder fee
├─ Parad0x signal source fee
├─ DNA platform fee
└─ optional alpha/success fee
```

Every fee line should be visible before payment and bound into the receipt.

## Good Builder Products

- paid Telegram signal bot
- paid Discord signal room
- paid prediction dashboard
- result update webhook
- sports alert feed
- crypto signal dashboard
- paid research drop
- copy-alert room with source attribution

## Bad Builder Products

- hidden source fee removal
- fake PnL page
- guaranteed win signal room
- unlimited scraping bot
- live auto-bet bot outside a separate safety gate
- backend custody or backend signing

## SDK Helpers

The TypeScript SDK includes public helper types and checks:

- `SignalUsageEvent`
- `BuilderSignalLicense`
- `SignalReceiptMetadata`
- `createSignalUsageEvent`
- `requireBuilderSignalLicense`
- `buildParadoxSignalFeeWaterfall`
- `buildSignalReceiptMetadata`

These helpers are public integration helpers. They are not the private signal feed backend.
