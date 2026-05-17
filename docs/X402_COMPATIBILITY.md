# x402 Compatibility

DNA x402 is designed around the same core idea as the x402 ecosystem: a client requests a resource, receives payment requirements, pays, retries, and receives the resource.

Useful ecosystem references:

- x402 protocol site: https://www.x402.org/
- x402 foundation repository: https://github.com/x402-foundation/x402
- Coinbase x402 docs: https://docs.cdp.coinbase.com/x402/welcome
- Cloudflare Agents x402 docs: https://developers.cloudflare.com/agents/agentic-payments/x402/
- Stripe machine payments x402 docs: https://docs.stripe.com/payments/machine/x402

## DNA x402 Additions

DNA x402 adds hosted rail behavior for Public Beta builders:

- Solana USDC live beta path
- provider + DNA treasury direct split for live paid beta flows
- signed receipts
- receipt-bound fee waterfall
- builder fee display/accrual model
- webhook events
- policy and beta-scope checks
- agent-builder draft safety checks

## Compatibility Position

Use standard x402 concepts when integrating:

- HTTP payment-required response
- quote/payment requirements
- client-side payment proof
- paid retry
- receipt/settlement response

Use DNA x402 APIs when you want the hosted DNA rail, fee waterfall, receipts, builder monetization, and Public Beta agent/payment controls.

## Network Notes

Public Beta live payments currently focus on Solana USDC with caps and direct split. EVM/Base/Polygon/Arbitrum/Coinbase facilitator paths are integration concepts, not unlimited live support unless enabled by DNA x402 for your builder account.

