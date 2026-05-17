import { DnaX402Client } from "../../../sdk/typescript/src/index.js";

const dna = new DnaX402Client({
  baseUrl: "https://parad0xlabs.com/x402",
  fetch: async () => new Response(JSON.stringify({
    settings: {
      copySettingsId: "copy-settings-demo",
      minEntryPriceBps: 4000,
      maxEntryPriceBps: 6000,
    },
  }), { status: 201 }),
});

console.log(JSON.stringify(await dna.setCopySettings({
  followerAgentId: "follower-agent",
  sourceAgentId: "source-agent",
  enabled: true,
  mode: "PAPER_COPY",
  copyBuys: true,
  copySells: false,
  copyExits: false,
  minEntryPriceBps: 4000,
  maxEntryPriceBps: 6000,
  maxBetSizeAtomic: "5000000",
  maxDailySpendAtomic: "25000000",
  maxOpenExposureAtomic: "10000000",
  customTakeProfitBps: 2000,
  customStopLossBps: 1000,
}), null, 2));

