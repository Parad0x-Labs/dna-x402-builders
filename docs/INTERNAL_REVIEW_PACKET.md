# DNA x402 Builders Public Repo Review Packet

Status: pre-public review snapshot.

Purpose: public integration kit for builders. This repo teaches builders how to use hosted DNA x402. It does not teach builders how to recreate the private rail.

## Public Repo Contents

| Path | Purpose | Safe To Publish |
|---|---|---|
| `README.md` | Overview and quick links | Yes |
| `docs/GETTING_STARTED.md` | Builder onboarding | Yes |
| `docs/API_REFERENCE.md` | Hosted API contract | Yes |
| `docs/SCENARIOS.md` | Integration scenario matrix | Yes |
| `docs/X402_COMPATIBILITY.md` | Ecosystem compatibility notes | Yes |
| `docs/FEES_AND_DIRECT_SPLIT.md` | Public fee behavior | Yes |
| `docs/RECEIPTS.md` | Receipt usage | Yes |
| `docs/WEBHOOKS.md` | Webhook contract | Yes |
| `docs/AGENT_BUILDER.md` | Prompt/guided draft flow | Yes |
| `docs/PUBLIC_BETA_SCOPE.md` | Beta boundaries | Yes |
| `docs/ERROR_CODES.md` | Integration errors | Yes |
| `sdk/typescript` | Thin hosted API client | Yes |
| `examples/*` | Mocked integration examples | Yes |
| `openapi/dna-x402-public-beta.openapi.json` | Public API shape | Yes |

## Explicitly Not Included

- backend server source
- payment verifier implementation
- replay store implementation
- database schemas or migrations
- production env files
- treasury secrets
- monitoring secrets
- internal abuse/security test harnesses
- deployment scripts
- production evidence packets
- private audit artifacts

## Scenario Coverage

This public repo covers:

- paid APIs
- paid MCP tools
- buyer agents
- seller paid APIs
- data feeds
- Memescope-style/memecoin scanner feeds
- browser/session jobs
- file/content access
- AI inference and compute jobs
- Telegram/Discord bot services
- builder monetized APIs
- agent builder drafts
- paper/signal/copy-agent flows
- Polymarket paper/signal/user-confirmed designs
- Solana token paper/signal/user-confirmed designs
- Coinbase/CDP x402 conceptual compatibility
- Cloudflare Agents x402 conceptual compatibility
- Stripe x402-style machine payment conceptual compatibility

## Public Language Guardrails

Allowed:

- Public Beta
- hosted DNA x402 payment rail
- payment gateway for APIs, agents, tools, and data feeds
- visible fee waterfall
- receipt-bound fees
- DNA 10 bps direct split for live paid beta flows

Not allowed:

- unlimited permissionless production
- all categories open
- backend custody
- backend signing
- hidden fees
- autonomous public Polymarket live betting
- autonomous public Solana token trading
- guaranteed compliance

## Security Review Checklist

- No `.env` committed.
- No private keys or tokens.
- No backend internals.
- No database migrations.
- No deployment scripts.
- No private audit packets.
- Examples default to mock mode.
- Live payment docs require caps and client-side signing.
- Direct split docs require provider and DNA treasury proofs.
