# Webhooks

Use webhooks for asynchronous status:

- quote created
- payment finalized
- receipt issued
- fulfillment completed
- webhook replay rejected
- policy review required

Headers:

- `x-dna-signature`
- `x-dna-event`
- `x-dna-timestamp`
- `x-dna-idempotency-key`

Rules:

- verify signature
- reject old timestamps
- store idempotency keys
- never write raw PII into immutable logs
- make handlers idempotent

