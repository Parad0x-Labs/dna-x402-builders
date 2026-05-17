# Error Codes

Common integration errors:

| Code | Meaning |
|---|---|
| `X402_UNDERPAY` | Payment amount is below quote requirement. |
| `X402_WRONG_RECIPIENT` | Payment went to the wrong recipient. |
| `X402_WRONG_MINT` | Payment used the wrong token mint. |
| `X402_REPLAY` | Proof or idempotency key was already used. |
| `X402_EXPIRED_QUOTE` | Quote expired before commit/finalize. |
| `FEE_WATERFALL_TAMPERED` | Fee waterfall hash does not match quote. |
| `BUILDER_FEE_EXCEEDS_CAP` | Builder fee is above the allowed percentage cap. |
| `BUILDER_FEE_HIDDEN` | Builder fee is not buyer-visible. |
| `PUBLIC_BETA_CAP_EXCEEDED` | Transaction/daily/loss/exposure cap exceeded. |
| `BACKEND_CUSTODY_FORBIDDEN` | Private keys or custody flow attempted. |
| `BACKEND_SIGNING_FORBIDDEN` | Backend signing attempted. |
| `OUT_OF_BETA_SCOPE` | Requested vertical/action is outside Public Beta. |
| `SIGNAL_LICENSE_REQUIRED` | Parad0x signal source use requires an active builder signal license. |
| `SIGNAL_ATTRIBUTION_REQUIRED` | Parad0x signal attribution was removed or changed. |
| `PARADOX_SIGNAL_FEE_REQUIRED` | Parad0x signal source fee was removed from a Parad0x-powered paid flow. |
| `HIDDEN_FEE_REJECTED` | Signal resale or builder fee lines were hidden from the buyer. |
| `GUARANTEED_PROFIT_CLAIM_REJECTED` | Signal resale tried to market guaranteed profit or similar claims. |
| `SIGNAL_USAGE_CAP_EXCEEDED` | Builder signal usage exceeded the license cap. |
