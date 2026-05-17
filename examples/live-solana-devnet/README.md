# Live Solana Devnet Smoke

This is an optional proof path for builders who want one live network check beyond the mock/devnet template simulator.

It does not move mainnet funds.
It does not require private keys.
It is skipped unless explicitly enabled.

## What It Proves

When enabled, the smoke test:

- reaches live Solana devnet RPC
- fetches a live devnet blockhash
- creates a paid API quote shape
- commits the quote
- builds provider and DNA treasury proof shapes
- finalizes a direct split receipt in the local smoke rail
- verifies the receipt
- unlocks the paid result
- rejects replay
- rejects wrong DNA recipient
- rejects underpaid DNA fee

This is not a private backend rail test and not a token-transfer drill.
It is a public builder-kit smoke that binds the SDK flow to live devnet RPC plumbing.

## Run

```bash
DNA_X402_LIVE_DEVNET_SMOKE=1 \
SOLANA_DEVNET_RPC_URL=https://api.devnet.solana.com \
npm run acceptance:live:solana-devnet
```

PowerShell:

```powershell
$env:DNA_X402_LIVE_DEVNET_SMOKE="1"
$env:SOLANA_DEVNET_RPC_URL="https://api.devnet.solana.com"
npm run acceptance:live:solana-devnet
```

Without those env vars, the command exits successfully with a skipped report so CI stays green.
