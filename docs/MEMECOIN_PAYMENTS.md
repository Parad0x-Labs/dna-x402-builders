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

## NULL Ecosystem Token

`$NULL` mint: `8EeDdvCRmFAzVD4takkBrNNwkeUTUQh4MscRK5Fzpump`

The `$NULL` builder angle is the flywheel, not random checkout token sprawl:

- premium paid action
- receipt-bound fee event
- capped 5 bps flywheel allocation
- randomized execution
- public receipt metadata
- `RewardsVault`

Use [NULL Flywheel](./NULL_FLYWHEEL.md) when a builder product sells alpha reveals, risk checks, hint tiers, private-room unlocks, or premium API access.
