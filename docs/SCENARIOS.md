# Scenario Matrix

DNA x402 is a payment gateway for programmable commerce. Builders bring the product surface; DNA x402 handles the paid access loop.

| Scenario | Public Beta Path | Notes |
|---|---|---|
| Paid REST API | Quote, commit, proof, receipt | Best first integration. |
| Paid GraphQL/API route | Wrap resolver behind a paid quote | Keep response digest receipt-bound. |
| Paid MCP tool | Charge per tool call | Works well for agents and coding tools. |
| Data feed | Pay per snapshot, stream, or bundle | Market, weather, sports, social, research. |
| Memecoin scanner / Memescope-style feed | Paid signal/data endpoint | Signal/feed only unless separate live-trading gate approves execution. |
| Coinbase/CDP x402 client | Compatibility path through HTTP 402 concepts | DNA x402 adds Solana USDC direct split and receipts. |
| Cloudflare Agent | Buyer agent can call paid DNA x402 endpoints | Use hosted API and receipt verification. |
| Stripe x402-style machine payment app | Pattern-compatible paid endpoint thinking | Use DNA x402 APIs when you want DNA receipts and direct split. |
| Browser/session automation | Pay per job or session | Require clear policy scope and result receipt. |
| File/content access | Pay to unlock a file or report | Include content hash in receipt. |
| AI inference | Pay per call, token range, or job | Good for hosted tools and model APIs. |
| Compute/render jobs | Quote by job size or metered units | Use receipt plus webhook completion. |
| Telegram/Discord bot service | Bot calls DNA x402 quote/finalize behind commands | Bot never holds private keys. |
| Agent builder | Prompt/guided/template to safe agent draft | Backend rejects private keys and unsafe live autonomy. |
| Paper trading agent | Open beta | No real money movement. |
| Polymarket signal/copy research | Paper/signal/user-confirmed design | Unattended public live betting is not in beta scope. |
| Solana token signal agent | Paper/signal/user-confirmed design | Unrestricted autonomous token trading is not in beta scope. |
| Builder monetized API | Builder fee display/accrual | Visible builder fees are receipt-bound. |
| Direct split paid API | Provider + DNA treasury proof | Live paid beta flow for Solana USDC. |
| Affiliate/referrer fee | Architecture path | Ask for approval before live direct collection. |
| Private enterprise marketplace | Approved seller network | Use custom review and policy scope. |

## Bring Any Frontend

DNA x402 can sit behind:

- website
- mobile app
- Telegram bot
- Discord bot
- MCP server
- Cloudflare Worker
- SaaS backend
- CLI
- browser extension
- trading/research dashboard
- custom agent framework

## Hard Boundaries

Public Beta does not mean every vertical is live. Backend custody, backend signing, hidden fees, auto-sweep, physical goods, public netting, and high-risk categories are outside Public Beta scope.
