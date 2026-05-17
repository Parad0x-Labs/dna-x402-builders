import { DnaX402Client } from "../../../sdk/typescript/src/index.js";

const dna = new DnaX402Client({
  baseUrl: "https://parad0xlabs.com/x402",
  fetch: async () => new Response(JSON.stringify({
    account: {
      agentId: "paper-agent-demo",
      startingBalanceAtomic: "10000000000",
      currentBalanceAtomic: "10000000000",
    },
    badge: "PAPER",
  }), { status: 201 }),
});

console.log(JSON.stringify(await dna.createPaperAgent("paper-agent-demo"), null, 2));

