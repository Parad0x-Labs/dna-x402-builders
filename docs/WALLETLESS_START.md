# Launch Agents Without A Wallet

Start walletless. Add money when money moves.

You can create and run useful agents before connecting a wallet.

No wallet is needed for:

- signal bots
- alert bots
- research bots
- data preview bots
- Telegram and Discord launchers
- community agents
- agent prototypes
- local examples

Paper mode still exists for strategy testing, but it is not the whole story. The main flow is launch first, then add a wallet when the agent needs payments or live execution.

## Launch First

Good first flow:

1. pick an agent template
2. run it locally
3. launch it as a Telegram bot or Discord app
4. test signals, alerts, research, previews, rooms, or commands
5. add a wallet later when you want real payments or execution

## Add Wallet When Money Moves

Add a Solana wallet when you want:

- the agent to charge users
- the agent to receive builder or seller payouts
- direct split fee recipient setup
- paid API, data, command, room, or signal unlocks
- real USDC settlement

If a payment flow is started without a wallet, integrations should fail clearly with:

```txt
WALLET_REQUIRED_FOR_PAYMENT
```

Message:

```txt
This agent is ready, but payments need a wallet. Connect a wallet to charge users or unlock paid flows.
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

Message:

```txt
This agent can run signals and alerts without a wallet. Live trading needs a user-owned agent wallet.
```

## Launcher Rule

Telegram and Discord launchers can start walletless.

Your bot token stays local.
Your wallet can be added later.
Your private key never goes into the launcher.
