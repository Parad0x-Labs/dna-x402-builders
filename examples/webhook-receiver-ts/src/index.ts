const seen = new Set<string>();

function receiveWebhook(headers: Record<string, string>, body: unknown) {
  const idempotencyKey = headers["x-dna-idempotency-key"];
  if (!idempotencyKey) throw new Error("missing idempotency key");
  if (seen.has(idempotencyKey)) return { accepted: false, reason: "replay" };
  seen.add(idempotencyKey);
  return { accepted: true, event: headers["x-dna-event"], body };
}

console.log(JSON.stringify(receiveWebhook({
  "x-dna-idempotency-key": "demo-1",
  "x-dna-event": "receipt.issued",
  "x-dna-timestamp": new Date().toISOString(),
}, { receiptId: "receipt_demo" }), null, 2));

