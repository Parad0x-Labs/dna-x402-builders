# DNA x402 Builders

Public Beta integration kit for builders who want to monetize APIs, agents, tools, data feeds, and digital workflows through the DNA x402 payment rail.

This repo is for **using DNA x402**, not cloning the rail.

## What You Can Build

- Paid APIs and data feeds
- Paid MCP tools and agent services
- Buyer agents that quote, pay, retry, and verify receipts
- Seller endpoints protected by x402-style payment requirements
- Builder-monetized agent services with visible fee lines
- Webhook receivers for payment, receipt, listing, and policy events
- Receipt verification flows for auditability
- Agent-builder flows that create safe agent drafts from prompts/templates
- Paper/signal/copy-agent workflows inside Public Beta scope

## What This Repo Does Not Include

- DNA x402 backend source
- payment verifier internals
- replay store internals
- production database schemas or migrations
- treasury operations
- monitoring and incident tooling
- internal abuse/security test harnesses
- production deployment scripts

Those are private rail infrastructure. Public builders get the SDK contracts, API examples, and docs needed to plug into hosted DNA x402.

## Public Beta Scope

Open in Public Beta:

- agent creation
- paper agents
- public/private profiles
- copy settings
- builder/API integrations
- low-risk capped Solana USDC payments
- visible receipt-bound fee waterfalls
- DNA 10 bps direct split for live paid beta flows

Not in beta scope yet:

- backend custody
- backend signing
- hidden fees
- auto-sweep
- unrestricted autonomous live trading
- public netting
- physical goods
- high-risk categories
- broad multi-chain production settlement

## Quick Start

```bash
npm install
npm run acceptance
```

Create a client:

```ts
import { DnaX402Client } from "./sdk/typescript/src/index.js";

const dna = new DnaX402Client({
  baseUrl: "https://parad0xlabs.com/x402",
});

const quote = await dna.quote({
  resource: "/weather",
  amountAtomic: "100000",
});
```

## Docs

- [Getting Started](./docs/GETTING_STARTED.md)
- [API Reference](./docs/API_REFERENCE.md)
- [Scenario Matrix](./docs/SCENARIOS.md)
- [x402 Compatibility](./docs/X402_COMPATIBILITY.md)
- [Fees and Direct Split](./docs/FEES_AND_DIRECT_SPLIT.md)
- [Receipts](./docs/RECEIPTS.md)
- [Webhooks](./docs/WEBHOOKS.md)
- [Agent Builder](./docs/AGENT_BUILDER.md)
- [Public Beta Scope](./docs/PUBLIC_BETA_SCOPE.md)
- [Error Codes](./docs/ERROR_CODES.md)
- [Internal Review Packet](./docs/INTERNAL_REVIEW_PACKET.md)

## Examples

- [Buyer Agent](./examples/buyer-agent-ts)
- [Seller Paid API](./examples/seller-paid-api-ts)
- [Builder Monetized Agent](./examples/builder-monetized-agent-ts)
- [Webhook Receiver](./examples/webhook-receiver-ts)
- [Receipt Verifier](./examples/receipt-verifier-ts)
- [Agent Builder](./examples/agent-builder-ts)

## Positioning

DNA x402 is a payment gateway for programmatic commerce. Bring your own app, agent, API, bot, MCP server, data feed, scanner, workflow, or vertical UX. DNA x402 handles the payment loop, receipt trail, fee waterfall, and integration contracts.
