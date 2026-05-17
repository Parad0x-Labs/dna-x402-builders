# Cursor Prompts

## First Paid Endpoint

```txt
Use this repo as the integration reference.
Build a minimal Express API with one paid route using DNA x402.
Use sdk/typescript/src/index.ts for hosted API calls.
Show quote, commit, direct split finalize, receipt verify, and paid unlock.
Use mock payment proofs in local dev.
Do not implement backend custody, backend signing, or private key storage.
```

## Next.js Data Feed

```txt
Create a Next.js route handler for a paid data feed using DNA x402.
Before returning data, require a DNA x402 receipt.
Expose a helper that requests quote and displays feeWaterfallV2.
Use env DNA_X402_API_URL.
```

## Telegram Bot Service

```txt
Build a Telegram bot command /signal that uses DNA x402.
The bot should request a quote, show payment instructions, verify receipt, then send the paid signal.
The bot must not hold private keys.
```

## Agent Builder

```txt
Build a page that sends a prompt to /v1/agent-builder/draft.
Show the returned config preview and risk summary.
Require user confirmation before calling /confirm.
```

