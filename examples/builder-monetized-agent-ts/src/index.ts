import { DnaX402Client } from "../../../sdk/typescript/src/index.js";

const dna = new DnaX402Client({
  baseUrl: "https://parad0xlabs.com/x402",
  fetch: async () => new Response(JSON.stringify({
    quoteId: "quote_builder_fee",
    feeWaterfallV2: {
      lines: [
        { id: "provider", kind: "PROVIDER_AMOUNT", amount: "99400000", requiredForFinalize: true },
        { id: "dna", kind: "DNA_PLATFORM_FEE", amount: "100000", requiredForFinalize: true },
        { id: "builder", kind: "BUILDER_FEE", amount: "500000", collectionStatus: "ACCRUED_NOT_COLLECTED" },
      ],
    },
  }), { status: 200 }),
});

const quote = await dna.quote({
  resource: "/agent/research",
  amountAtomic: "100000000",
  builderId: "research_builder",
  builderFeeBps: 50,
  builderRecipient: "builder-public-wallet",
  builderFeeMode: "builder_accrual",
});

console.log(JSON.stringify(quote.feeWaterfallV2, null, 2));

