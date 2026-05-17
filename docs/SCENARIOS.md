# Scenario Matrix

DNA x402 is a payment gateway for programmable commerce. Builders bring the product surface; DNA x402 handles the paid access loop.

| Scenario | Public Beta Path | Notes |
|---|---|---|
| Paid REST API | Quote, commit, proof, receipt | Best first integration. |
| Paid GraphQL/API route | Wrap resolver behind a paid quote | Keep response digest receipt-bound. |
| Paid MCP tool | Charge per tool call | Works well for agents and coding tools. |
| Data feed | Pay per snapshot, stream, or bundle | Market, weather, sports, social, research. |
| Memecoin scanner / Memescope-style feed | Paid signal/data endpoint | Signal/feed only unless separate live-trading gate approves execution. |
| Parad0x sports signal bot | Metered Parad0x signal source plus builder Telegram/Discord UX | Source attribution, source fee, builder fee, and DNA rail fee stay receipt-bound. |
| Parad0x prediction dashboard | Paid dashboard view or signal reasoning unlock | Receipt binds signal ID, source, usage type, digest, and fee waterfall. |
| Parad0x result update webhook | Meter result/settlement updates | Good for sports, prediction, and copied-lot updates. |
| Meme Casino agents | Wallet stalkers, fresh pair scouts, rug radar, paid signal tollbooths | Signal, paper, receipt-gated alert, and user-confirmed intent flows. |
| Copy-the-Chad agents | Follower-controlled copy settings | Caps, entry filters, TP/SL, copied lots, alpha fees only on positive finalized copied-lot PnL. |
| Social/X campaign room | Human-reviewed proof workflows | Briefs, proof URLs/hashes, receipts, and rewards without fake engagement or auto-spam. |
| X proof-of-engagement | Proof-reviewed receipts | Requires URL/hash, timestamp, and human review before receipt. |
| Coinbase/CDP x402 client | Compatibility path through HTTP 402 concepts | DNA x402 adds Solana USDC direct split and receipts. |
| Cloudflare Agent | Buyer agent can call paid DNA x402 endpoints | Use hosted API and receipt verification. |
| Stripe x402-style machine payment app | Pattern-compatible paid endpoint thinking | Use DNA x402 APIs when you want DNA receipts and direct split. |
| Browser/session automation | Pay per job or session | Require clear policy scope and result receipt. |
| File/content access | Pay to unlock a file or report | Include content hash in receipt. |
| AI inference | Pay per call, token range, or job | Good for hosted tools and model APIs. |
| Compute/render jobs | Quote by job size or metered units | Use receipt plus webhook completion. |
| Telegram/Discord bot service | Bot calls DNA x402 quote/finalize behind commands | Bot never holds private keys. |
| Telegram Agent Launcher | Run an agent bot on a phone, PC, Mac, Linux, Docker, or VPS | Self-hosted token, hosted DNA x402 rail. |
| Discord Agent Launcher | Run paid agent slash commands inside a Discord server | Self-hosted app token, local interactions endpoint, hosted DNA x402 rail. |
| Discord alpha room | Receipt-gated signals, research drops, bounties, and copy alerts | Community-native monetization without backend custody or backend signing. |
| Degen Mode agent | Connect wallet, pick agent, set max pain, launch | Watch, signal, paper sim, user-confirmed intent, and capped-live architecture. |
| Fresh Pair Goblin Live | Fresh Solana pair signals | Liquidity, age, volume, holder, creator-wallet, and token-risk filters. |
| Wallet Stalker Live | Wallet-flow alerts and optional copy intents | Wallet allow/block lists and user-owned wallet signing. |
| Telegram Ape Button | Telegram paid signals plus user-confirmed intent preview | Bot never holds wallet keys or signs trades. |
| Discord Ape Room | Discord paid signals, copy links, PnL panels, and receipts | Room-native Degen Mode with visible fee waterfalls. |
| Live PnL Leaderboard | PnL, ROI, average entry, drawdown, and proof count | Prevents 99c win-rate flex with sample-size warnings. |
| Referral links | Share fee revenue from rooms, signals, APIs, or profiles | No default rake on follower losses. |
| Jupiter swap intent | Quote and user-signed swap intent | Backend does not sign or submit without live gate and client signature. |
| Raydium/Pump.fun watchers | Watch, signal, and mock/gated intent previews | Live execution remains gated until adapter tests exist. |
| Memecoin-native payments | Allowlisted token payment config | USDC default; meme/high-risk tokens require allowlist. |
| Community paid room | Telegram or Discord room access after receipt verification | Walletless mock start, wallet only for real settlement. |
| Signal role gate | Discord role or Telegram signal lane after payment | Receipt-bound access and no hidden fees. |
| Bounty board | Proof-reviewed tasks, notes, memes, research, and bug reports | Human review before receipt/reward flow. |
| Paid watchlist room | Daily or intraday watchlists behind receipts | Preview first, paid full list after receipt. |
| Agent builder | Prompt/guided/template to safe agent draft | Backend rejects private keys and unsafe live autonomy. |
| Paper trading agent | Open beta | No real money movement. |
| Polymarket signal/copy research | Paper/signal/user-confirmed design | Unattended public live betting is not in beta scope. |
| Solana token signal agent | Paper/signal/user-confirmed design | Unrestricted autonomous token trading is not in beta scope. |
| Builder monetized API | Builder fee display/accrual | Visible builder fees are receipt-bound. |
| Direct split paid API | Provider + DNA treasury proof | Live paid beta flow for Solana USDC. |
| Optional live devnet smoke | Live Solana devnet RPC plus direct split proof-shape flow | Opt-in only; no mainnet funds or private keys. |
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

## Agent Template Packs

- [Agent Templates](./AGENT_TEMPLATES.md)
- [Community Agents](./COMMUNITY_AGENTS.md)
- [Parad0x Signal Feeds](./PARADOX_SIGNAL_FEEDS.md)
- [Signal Resale And Licensing](./SIGNAL_RESALE_AND_LICENSING.md)
- [Meme Casino Agents](./MEME_CASINO_AGENTS.md)
- [Social / X Agents](./SOCIAL_X_AGENTS.md)
- [Degen Mode](./DEGEN_MODE.md)
- [Live Execution Adapters](./LIVE_EXECUTION_ADAPTERS.md)
- [Telegram Agent Launcher](./TELEGRAM_AGENT_LAUNCHER.md)
- [Discord Agent Launcher](./DISCORD_AGENT_LAUNCHER.md)

## Hard Boundaries

Public Beta does not mean every vertical is live. Backend custody, backend signing, hidden fees, auto-sweep, physical goods, public netting, and high-risk categories are outside Public Beta scope.
