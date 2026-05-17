# Optional Live Solana Devnet Smoke

The normal public repo checks are mock/devnet simulations so CI stays green without secrets or live infrastructure.

For extra credibility, builders can run one opt-in live Solana devnet smoke path:

```bash
npm run acceptance:live:solana-devnet
```

By default this exits successfully as skipped.

## Enable It

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

## What It Checks

- live Solana devnet RPC is reachable
- live devnet blockhash loads
- paid API quote shape is created
- commit shape is created
- provider proof shape exists
- DNA treasury proof shape exists
- receipt verifies
- paid unlock works
- replay is rejected
- wrong recipient is rejected
- underpaid DNA fee is rejected

## What It Does Not Do

- no mainnet funds
- no private keys
- no wallet signing
- no backend custody
- no backend signing
- no token transfer drill
- no private server internals

This is a public builder-kit smoke path. The deeper production rail and mainnet drills live outside this public repo.
