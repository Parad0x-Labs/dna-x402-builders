import { DnaX402Client } from "../../../sdk/typescript/src/index.js";

const dna = new DnaX402Client({
  baseUrl: "https://parad0xlabs.com/x402",
  fetch: async () => new Response(JSON.stringify({
    status: "DRAFT_CREATED",
    draftId: "draft_demo",
    reasonCodes: [],
    explanation: ["Safe draft created. User confirmation required before activation."],
    riskSummary: {
      riskLevel: "MEDIUM",
      realFundsAtRisk: false,
      requiresClientSignature: true,
      backendCustody: false,
      backendSigning: false,
      warnings: ["Autonomous public live trading is not in beta scope."],
      requiredConfirmations: ["I understand backend custody and backend signing are never used."],
    },
  }), { status: 200 }),
});

const draft = await dna.createAgentDraft({
  inputMode: "PROMPT",
  ownerWallet: "owner-public-wallet",
  prompt: "Create a BTC 40c-60c copy agent with max $5 per bet and 2% alpha fee on positive finalized copied-lot profit.",
});

console.log(JSON.stringify(draft, null, 2));

