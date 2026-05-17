# Memecoin-Native Payments

DNA x402 Public Beta defaults to USDC.

Memecoin-native payments are modelled as configuration first:

- USDC
- SOL later
- allowlisted tokens only

Rules:

- meme token payments require allowlist
- high-risk token payments require allowlist
- conversion mode must be visible
- fee waterfall must be visible
- no hidden spreads
- no backend custody

Good template:

[`meme-token-payment-agent.json`](../templates/agents/degen-live/meme-token-payment-agent.json)
