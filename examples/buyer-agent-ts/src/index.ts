import { DnaX402Client, makeCommitment } from "../../../sdk/typescript/src/index.js";

function response(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });
}

const dna = new DnaX402Client({
  baseUrl: process.env.DNA_X402_API_URL ?? "https://parad0xlabs.com/x402",
  fetch: async (url) => {
    if (url.includes("/quote")) {
      return response({
        quoteId: "quote_demo",
        feeWaterfallV2: {
          lines: [
            { id: "provider", kind: "PROVIDER_AMOUNT", amount: "999000", requiredForFinalize: true },
            { id: "dna", kind: "DNA_PLATFORM_FEE", amount: "1000", requiredForFinalize: true },
          ],
        },
      });
    }
    if (url.endsWith("/commit")) return response({ commitId: "commit_demo" }, 201);
    if (url.endsWith("/finalize")) return response({ receiptId: "receipt_demo" });
    return response({ ok: true });
  },
});

const quote = await dna.quote({ resource: "/paid/demo", amountAtomic: "1000000" });
const commit = await dna.commit(quote.quoteId, makeCommitment("buyer-demo"));
const receipt = await dna.finalizeDirectSplit(commit.commitId, dna.requiredSplitLines(quote).map((line) => ({
  feeLineId: line.id,
  paymentProof: { settlement: "transfer", txSignature: `mock-${line.id}`, amountAtomic: line.amount },
})));

console.log(JSON.stringify({ quoteId: quote.quoteId, commitId: commit.commitId, receiptId: receipt.receiptId }, null, 2));

