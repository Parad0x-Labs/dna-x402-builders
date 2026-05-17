# Agent Builder

Agent Builder turns prompt/guided/template/clone input into safe structured drafts.

Supported inputs:

- prompt
- guided wizard answers
- template ID
- cloneable public recipe

The compiler outputs a draft. It does not directly execute trades.

## Example Prompt

```txt
Create a Polymarket copy agent that watches BTC 5m markets, copies only 40c-60c entries, max $5 per bet, stops after $25 daily loss, and charges followers 2% of positive finalized copied-lot profit.
```

Expected safe config:

- paper/signal/user-confirmed or gated beta copy mode
- client-side wallet model
- no backend custody
- no backend signing
- risk caps
- copy filters
- alpha fee only on positive finalized copied-lot PnL

## Rejections

The builder rejects prompts asking for:

- server-stored private keys
- backend signing
- hidden fees
- unlimited auto-copy
- public unattended live betting
- high-risk categories
- alpha fees on losses or unrealized PnL

