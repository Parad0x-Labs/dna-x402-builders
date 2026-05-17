# Getting Started

DNA x402 lets a builder connect a paid resource to a machine-readable payment loop:

```txt
request -> quote -> commit -> payment proof -> receipt -> paid retry
```

Use this repo when you want to build on the hosted DNA x402 rail.

## 1. Pick Your Integration

- Buyer agent: pays for other services.
- Seller API: protects your endpoint with a paid quote.
- Builder app: adds your own visible builder fee while DNA keeps the platform fee.
- Agent builder: lets users create safe paper/signal/copy-agent drafts.
- Webhook receiver: listens for payment and receipt events.
- Receipt verifier: proves what was paid for and fulfilled.

## 2. Configure Environment

```bash
DNA_X402_API_URL=https://parad0xlabs.com/x402
DNA_X402_ENV=public_beta
```

Never put private keys in backend env. Client-side/user-owned signing is the only accepted wallet model for Public Beta live flows.

## 3. Run A Mocked Example

```bash
npm install
npm run examples:buyer
```

The examples default to mock mode so you can learn the flow without spending funds.

## 4. Move To Hosted Public Beta

When you move to live low-risk beta payments:

- use Solana USDC
- keep the hosted Public Beta caps: `$200` per transaction, `$1,500` daily spend, `$300` daily loss, and `$500` open exposure
- sign client-side
- submit provider and DNA treasury proofs for direct split quotes
- verify the receipt before unlocking results

## 5. Optional Live Devnet Smoke

The default examples are mock mode. To check live Solana devnet RPC plumbing without mainnet funds:

```bash
DNA_X402_LIVE_DEVNET_SMOKE=1 SOLANA_DEVNET_RPC_URL=https://api.devnet.solana.com npm run acceptance:live:solana-devnet
```

The smoke verifies live devnet RPC reachability, quote/commit shapes, provider and DNA proof shapes, receipt verify, paid unlock, replay rejection, wrong-recipient rejection, and underpay rejection.

See [Live Devnet Smoke](./LIVE_DEVNET_SMOKE.md).
