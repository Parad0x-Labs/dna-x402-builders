import { DnaX402Client } from "../../../sdk/typescript/src/index.js";

const dna = new DnaX402Client({
  baseUrl: "https://parad0xlabs.com/x402",
  fetch: async () => new Response(JSON.stringify({
    receiptId: "receipt_demo",
    payload: {
      feeWaterfallHash: "hash_demo",
      feeCollectionSummary: { dnaPlatformFeeStatus: "COLLECTED_DIRECT_SPLIT" },
    },
  }), { status: 200 }),
});

const receipt = await dna.receipt("receipt_demo");
console.log(JSON.stringify({ verifiedShape: Boolean(receipt), receipt }, null, 2));

