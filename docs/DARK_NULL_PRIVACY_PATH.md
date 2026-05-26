# Dark Null Privacy Path

DNA x402 has two receipt paths:

| Path | Use when | Network posture |
|---|---|---|
| `normal` | You want the standard DNA x402 quote, payment proof, signed receipt, and paid unlock flow. | Public Beta hosted rail. Live Solana USDC is capped and direct-split gated. |
| `dark-null` | You want an additional private receipt summary backed by the Dark Null private receipt contract. | Devnet evidence lane first. Mainnet-beta requires a promoted Dark Null manifest and deployment evidence. |

The default is `normal`. Builders must opt into `dark-null`.

## What Builders Get

The optional Dark Null path returns a private receipt summary:

```json
{
  "schema": "dna-x402-dark-null-privacy-response-v1",
  "status": "created",
  "network": "devnet",
  "normalPath": "dna-x402",
  "privacyPath": "dark-null",
  "receiptId": "receipt_123",
  "dnaReceiptHash": "64-hex",
  "darkNullReceiptHash": "64-hex",
  "manifestLabel": "canonical-devnet-root-2",
  "replayKey": "64-hex"
}
```

The builder contract exposes hashes and receipt IDs. It does not expose backend verifier code or private rail internals in this public repo.

## Quick Install

```bash
git clone https://github.com/Parad0x-Labs/dna-x402-builders
cd dna-x402-builders
npm install
npm run acceptance
```

## Request A Quote With The Dark Null Option

```ts
import { DnaX402Client } from "../sdk/typescript/src/index.js";

const dna = new DnaX402Client({
  baseUrl: process.env.DNA_X402_API_URL ?? "https://parad0xlabs.com/x402",
});

const quote = await dna.quote({
  resource: "/signals/private-alpha",
  amountAtomic: "1000000",
  privacyPath: "dark-null",
});
```

`privacyPath: "dark-null"` asks the hosted API for the optional private receipt lane. If the account, network, or receipt is not eligible, the normal DNA path can still be used.

## Create The Private Receipt Summary

```ts
const privateReceipt = await dna.requestDarkNullReceipt({
  receiptId: "receipt_123",
  network: "devnet",
  mode: "proof_bound",
  settlementSignature: "solana-signature",
  settlementSlot: 434395918,
});
```

Fetch it later:

```ts
const fetched = await dna.darkNullReceipt(privateReceipt.darkNullReceiptHash!);
```

## Devnet vs Mainnet

Devnet:

- Dark Null private receipt evidence is available as a devnet lane.
- Use `network: "devnet"`.
- Use this for integration testing, receipt verification, SDK flows, and builder demos.

Mainnet-beta:

- The standard DNA x402 Public Beta rail supports capped live Solana USDC flows.
- Dark Null mainnet-beta private receipts require a promoted Dark Null mainnet manifest, deployment evidence, and account enablement.
- Do not assume `devnet` hashes are mainnet launch evidence.

## Error Cases

| Code | Meaning |
|---|---|
| `DARK_NULL_PATH_NOT_ENABLED` | Builder account is not enabled for the optional path. |
| `DARK_NULL_RECEIPT_NOT_ELIGIBLE` | Receipt lacks required settlement evidence. |
| `DARK_NULL_NETWORK_MISMATCH` | Requested network does not match the receipt or enabled target. |
| `DARK_NULL_RECEIPT_REPLAY` | Private receipt hash or replay key already exists. |
| `DARK_NULL_MAINNET_EVIDENCE_REQUIRED` | Mainnet-beta private receipt request lacks promoted Dark Null evidence. |

## Builder Rule

Use `normal` for the default payment rail. Add `dark-null` only when the product benefits from private receipt summaries: paid alpha reveals, private signal rooms, wallet-stalker reports, API access receipts, or receipt chains where raw resource paths should stay out of public logs.
