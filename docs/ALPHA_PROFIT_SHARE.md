# Alpha Profit Share

Degen Mode supports alpha fees for followers who opt in.

Public copy:

```txt
No win, no alpha fee.
```

## Tiers

| Tier | Fee Range | Requirement |
| --- | --- | --- |
| `STANDARD` | 0.5% to 3% | normal copy/alpha accounting |
| `DEGEN_ALPHA_ROOM` | 5% to 20% | explicit follower consent |

Rules:

- fee is shown before copying
- follower explicitly opts in
- fee locks at copied-lot entry
- fee applies only to positive finalized copied-lot PnL
- no fee on losses
- no fee on break-even
- no fee on unrealized PnL
- no retroactive fee changes

Good templates:

- [`copy-the-chad-live.json`](../templates/agents/degen-live/copy-the-chad-live.json)
- [`degen-alpha-room.json`](../templates/agents/degen-live/degen-alpha-room.json)
- [`paid-copy-room.json`](../templates/agents/degen-live/paid-copy-room.json)
