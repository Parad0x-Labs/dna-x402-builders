# Live Execution Adapters

Degen Mode exposes execution adapter shapes, not backend custody.

Supported public builder venues:

- Jupiter
- Raydium
- Pump.fun / PumpSwap-style watcher
- Polymarket
- custom webhook
- none

Public Beta defaults:

- quote and intent shape
- mock or signal-first adapters
- user-confirmed live intent design
- live submit path gated
- client-side wallet signature required
- backend never signs

## Adapter Behavior

Adapters should provide:

- quote intent shape
- trade intent shape
- risk config hash
- receipt metadata
- rejection reason when unsafe

They must reject:

- missing wallet for live mode
- missing max pain rules
- backend signing
- backend custody
- unlimited auto-live
- hidden fees

The public builder kit includes SDK helpers for adapter mocks and gated submit shapes.
