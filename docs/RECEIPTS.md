# Receipts

Receipts are the buyer and seller verification trail.

A receipt can prove:

- quote ID
- commit ID
- payment proof
- provider payment
- DNA treasury fee proof where direct split is required
- fee waterfall hash
- request digest
- response digest
- policy decision
- receipt timestamp

## Builder Rule

Do not unlock paid results until receipt verification passes.

## Verification Pattern

```ts
const receipt = await dna.receipt(receiptId);
// verify shape/signature through hosted verifier or approved SDK helper
```

Public examples do not include server-side signing implementation.
