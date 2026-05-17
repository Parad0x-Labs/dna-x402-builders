# Agent Templates

Start with a working recipe instead of a blank page.

Pick it. Fork it. Prompt it. Ship it. Get paid.

These templates are public JSON recipes for builders using the hosted DNA x402 rail. They are designed for Cursor, coding agents, and humans who want a fast starting point for paid APIs, agents, data feeds, tools, alerts, compute jobs, paper agents, copy settings, and alpha monetization.

## Template Gallery

| Template | Use It For | Recipe |
| --- | --- | --- |
| Prediction Market Agent | Paper or signal market agents with receipt-gated premium output | [JSON](../templates/agents/prediction-market/prediction-market-agent.json) |
| Solana Trading Agent | Token scanner and signal agents with user-confirmed live intent design | [JSON](../templates/agents/solana-trading/solana-trading-agent.json) |
| Copy / Follow Agent | 40c-60c copy rules, risk caps, copied-lot accounting, alpha fees | [JSON](../templates/agents/copy-follow/copy-follow-agent.json) |
| Paid API Agent | Turn an API endpoint into a receipt-gated paid product | [JSON](../templates/agents/paid-api/paid-api-agent.json) |
| Data Feed Agent | Paid crypto, on-chain, sports, weather, or market data feeds | [JSON](../templates/agents/data-feed/data-feed-agent.json) |
| Tool Agent | Paid MCP tools, bot commands, and tool executions | [JSON](../templates/agents/tool/tool-agent.json) |
| Compute Agent | Paid inference, analysis, scraping, simulation, or compute jobs | [JSON](../templates/agents/compute/compute-agent.json) |
| Alert Agent | Paid Telegram, Discord, webhook, email, or dashboard alerts | [JSON](../templates/agents/alerts/alert-agent.json) |
| Automation Agent | Paid workflow runs, monitor jobs, reports, and agent tasks | [JSON](../templates/agents/automation/automation-agent.json) |
| Research Agent | Receipt-gated reports, watchlists, digests, and research feeds | [JSON](../templates/agents/research/research-agent.json) |
| Custom Agent / Make Your Own | Safe blank skeleton for hybrid paid flows | [JSON](../templates/agents/custom/custom-agent.json) |

## How To Use A Template

1. Pick a template JSON.
2. Copy its `suggestedPrompt` into Cursor or another coding agent.
3. Ask it to build against `DNA_X402_API_URL`.
4. Keep examples mock by default.
5. Move to live Public Beta payments only when your flow shows the fee waterfall, verifies receipts, and avoids backend custody and backend signing.

## Copy-Paste Prompt

```txt
Use the DNA x402 Builder Kit and the agent template JSON I provide.

Build this agent against the hosted DNA x402 API.
Use DNA_X402_API_URL from .env.
Implement quote, commit, finalize, receipt verification, paid retry, and fee waterfall display where the template needs paid access.
If the template uses copy settings, keep follower risk controls first-class.
If the template uses alpha monetization, charge only on positive finalized copied-lot profit.
Keep the example mock by default.
Do not implement backend custody.
Do not implement backend signing.
Do not store private keys.
```

## Template Shape

Each template includes:

- `name`
- `slug`
- `category`
- `description`
- `whatItDoes`
- `publicBetaMode`
- `riskLimits`
- `monetization`
- `receiptProofBehavior`
- `suggestedPrompt`
- `exampleApiFlow`
- `notInBetaScope`

## Public Beta Scope

Public Beta supports paid APIs, agents, tools, data feeds, paper agents, public profiles, copy settings, alpha monetization accounting, visible fee waterfalls, receipt verification, and low-risk capped live payments.

Outside Public Beta scope:

- backend custody
- backend signing
- hidden fees
- auto-sweep
- physical goods
- high-risk categories
- public netting
- unrestricted autonomous live trading

## Good Defaults

Use small risk caps first. Show the fee waterfall before payment. Verify receipts before unlock. Keep private keys in the user's wallet or client. Bind paid output to a receipt ID.

