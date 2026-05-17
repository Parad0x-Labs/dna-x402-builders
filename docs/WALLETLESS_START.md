# Walletless Start

No wallet? No problem.

You can start with a paper agent, signal bot, alert bot, research bot, data preview agent, Telegram launcher, Discord launcher, mock receipts, and local/dev examples.

Wallets enter later, only when money or live execution starts.

## Walletless Start

Allowed without a wallet:

- paper agents
- signal agents
- alert agents
- research agents
- data preview agents
- Telegram bot launcher
- Discord bot launcher
- mock receipts
- local/dev examples

Good first flow:

1. pick an agent template
2. run it locally in mock mode
3. launch it as a Telegram bot or Discord app
4. test paper/signals/alerts/research
5. add a wallet later when you want real payments or execution

## Add Wallet To Earn

Add a Solana wallet when you want:

- receiving builder or seller payments
- direct split fee recipient setup
- paid API/data/signal unlocks
- real USDC settlement

If a payment flow is started without a wallet, integrations should fail clearly with:

```txt
WALLET_REQUIRED_FOR_PAYMENT
```

## Agent Trading Wallet

Create a user-owned agent wallet only when you want:

- real trading
- copy/live execution
- user-owned wallet flows

The wallet must be client-side generated or externally connected.

DNA x402 must never receive private keys, seed phrases, mnemonics, or backend signing material.

If live trading starts without an agent wallet, integrations should fail clearly with:

```txt
AGENT_WALLET_REQUIRED
```

## Launcher Rule

Telegram and Discord launchers can start walletless in mock mode.

Your bot token stays local.
Your wallet can be added later.
Your private key never goes into the launcher.
