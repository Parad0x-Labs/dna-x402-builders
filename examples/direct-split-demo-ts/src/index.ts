import { DnaX402Client } from "../../../sdk/typescript/src/index.js";

const dna = new DnaX402Client({
  baseUrl: "https://parad0xlabs.com/x402",
  fetch: async (url) => {
    if (url.includes("/quote")) {
      return new Response(JSON.stringify({
        quoteId: "quote_direct_split",
        feeWaterfallV2: {
          lines: [
            { id: "provider", kind: "PROVIDER_AMOUNT", amount: "999000", requiredForFinalize: true },
            { id: "dna", kind: "DNA_PLATFORM_FEE", amount: "1000", requiredForFinalize: true },
          ],
        },
      }), { status: 200 });
    }
    if (url.endsWith("/commit")) return new Response(JSON.stringify({ commitId: "commit_direct_split" }), { status: 201 });
    return new Response(JSON.stringify({ receiptId: "receipt_direct_split" }), { status: 200 });
  },
});

const quote = await dna.quote({ resource: "/paid/direct-split-demo", amountAtomic: "1000000" });
const split = dna.inspectFeeWaterfall(quote);
const result = await dna.finalizeDirectSplit("commit_direct_split", split.requiredProofs.map((line) => ({
  feeLineId: line.id,
  paymentProof: {
    settlement: "transfer",
    txSignature: `mock-${line.id}-transfer`,
    amountAtomic: line.amount,
  },
})));

console.log(JSON.stringify({ split, result }, null, 2));

