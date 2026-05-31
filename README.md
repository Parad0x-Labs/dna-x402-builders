# DNA x402 Builder Kit

Hosted payment rail for paid APIs, agents, tools, and data feeds on Solana.

**Quote. Pay. Verify. Receipt. Anchor.**

**Status: Public Beta**

DNA x402 gives builders hosted payment proof, signed receipts, split fees, webhooks, and agent launch primitives. Add a `quote → payment proof → signed receipt → paid unlock` flow to any API, agent, or data feed with a few API calls.

No backend custody. No backend signing. No hidden fees. Every paid action is receipt-bound.

### How this fits the Parad0x stack

Parad0x Labs builds Web0 on Solana — money and agents that settle themselves. **You are here: Build.**

| Layer | Repo | Does |
|---|---|---|
| Payments | [dna-x402](https://github.com/Parad0x-Labs/dna-x402) | x402 rail: quote → pay → verify → receipt → anchor |
| Build | [dna-x402-builders](https://github.com/Parad0x-Labs/dna-x402-builders) (this repo) | Hosted kit: turn any API/bot into a paid agent |
| Privacy | [Dark-Null-Protocol](https://github.com/Parad0x-Labs/Dark-Null-Protocol) | Groth16 privacy settlement, published proofs |
| Data | [liquefy](https://github.com/Parad0x-Labs/liquefy) | Columnar compression that beats Zstd + audit trails |
| Media | [nebula-media](https://github.com/Parad0x-Labs/nebula-media) | Perceptual video re-encoding, VMAF quality proofs |
| Local AI | [nulla-local](https://github.com/Parad0x-Labs/nulla-local) | Local-first agent runtime — your machine, your memory |

**See it live**: parad0xlabs.com

## Pull and verify

```bash
git pull --ff-only && npm ci && npm run acceptance
npm run admin:monitor   # opens http://127.0.0.1:4177
```

## Dark Null Privacy Path

Standard: `quote → payment proof → signed receipt → paid unlock`

Dark Null: standard + private receipt summary for privacy-sensitive unlocks

Use `normal` by default. Use `dark-null` for paid alpha reveals, private signal rooms, and API access receipts where raw resource paths should not appear in public receipt metadata.

See: [DARK_NULL_PRIVACY_PATH.md](./docs/DARK_NULL_PRIVACY_PATH.md)

## Agent use cases

Pair signal feeds. Wallet trackers. Copy-follow flows with bankroll rules. Alpha rooms. PnL leaderboards. Referral links. Profit-share fees.

Trust rules: no backend custody, no backend signing, no hidden fees, no fake PnL, no guaranteed-profit claims. Client-side signing. User-controlled max-loss rules. Pause and kill-switch controls.

MIT License — © 2026 Parad0x Labs
