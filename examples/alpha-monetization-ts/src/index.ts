import { DnaX402Client } from "../../../sdk/typescript/src/index.js";

const dna = new DnaX402Client({
  baseUrl: "https://parad0xlabs.com/x402",
  fetch: async () => new Response(JSON.stringify({
    monetization: {
      enabled: true,
      successFeeBps: 200,
      appliesTo: "POSITIVE_FINALIZED_COPIED_LOT_PNL",
      mode: "ACCRUAL",
    },
  }), { status: 200 }),
});

console.log(JSON.stringify(await dna.setAlphaFee("alpha-agent-demo", {
  enabled: true,
  successFeeBps: 200,
  mode: "ACCRUAL",
}), null, 2));

