import { describe, expect, it } from "vitest";
import {
  createDegenExecutionAdapter,
  type DegenRiskConfig,
  type ExecutionVenue,
} from "../sdk/typescript/src/index.js";

const riskConfig: DegenRiskConfig = {
  maxTradeUsd: 25,
  maxDailySpendUsd: 100,
  maxDailyLossUsd: 25,
  maxOpenExposureUsd: 50,
  maxSlippageBps: 100,
};

function draft(venue: ExecutionVenue) {
  return {
    agentId: `agent_${venue.toLowerCase()}`,
    ownerWallet: "owner_wallet",
    venue,
    side: "BUY" as const,
    maxInputAmountAtomic: "10000000",
    slippageBps: 50,
    mode: "USER_CONFIRMED_LIVE" as const,
    riskConfig,
  };
}

describe("Degen execution adapters", () => {
  it("quotes Jupiter, Raydium, Pump.fun, Polymarket, custom webhook, and none without live submit by default", () => {
    for (const venue of ["JUPITER", "RAYDIUM", "PUMPFUN", "POLYMARKET", "CUSTOM_WEBHOOK", "NONE"] as const) {
      const adapter = createDegenExecutionAdapter(venue);
      const quote = adapter.quote(draft(venue));
      const submit = adapter.submit(quote.intent);

      expect(quote.venue).toBe(venue);
      expect(quote.quoted).toBe(true);
      expect(quote.liveSubmitAvailable).toBe(false);
      expect(quote.receiptMetadata.riskConfigHash).toMatch(/^risk_/);
      expect(submit.status).toBe("SUBMIT_SKIPPED");
    }
  });

  it("requires explicit live gate and client signature before submit shape", () => {
    const adapter = createDegenExecutionAdapter("JUPITER", "USER_CONFIRMED_LIVE_GATED");
    const quote = adapter.quote(draft("JUPITER"));

    expect(adapter.submit(quote.intent)).toEqual({
      status: "SUBMIT_SKIPPED",
      reason: "LIVE_GATE_REQUIRED",
      intent: { ...quote.intent, status: "REJECTED" },
    });

    expect(adapter.submit(quote.intent, { liveGateRef: "PUBLIC_BETA_DEGEN_GATE", clientSigned: true })).toEqual({
      status: "SUBMITTED",
      intent: { ...quote.intent, status: "SUBMITTED" },
      proofRequired: true,
    });
  });
});
