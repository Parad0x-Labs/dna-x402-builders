import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  assertDegenRiskConfig,
  assertNoBackendKeyFields,
  assertNoDegenBackendCustodyOrSigning,
  createTradeIntent,
  DnaX402PolicyError,
  requireWalletForDegenLive,
  validateTradeIntentAgainstRisk,
  type DegenRiskConfig,
} from "../sdk/typescript/src/index.js";

const riskConfig: DegenRiskConfig = {
  maxTradeUsd: 50,
  maxDailySpendUsd: 300,
  maxDailyLossUsd: 75,
  maxOpenExposureUsd: 150,
  maxSlippageBps: 125,
};

describe("Degen Mode public builder primitives", () => {
  it("requires a wallet and complete bankroll rules for live modes", () => {
    expect(() => requireWalletForDegenLive("WATCH_ONLY", null)).not.toThrow();
    expect(() => requireWalletForDegenLive("SIGNAL_ONLY", null)).not.toThrow();
    expect(() => requireWalletForDegenLive("PAPER_SIM", null)).not.toThrow();
    expect(() => requireWalletForDegenLive("USER_CONFIRMED_LIVE", null)).toThrow(DnaX402PolicyError);
    expect(() => assertDegenRiskConfig("CAPPED_AUTO_LIVE", { maxTradeUsd: 10 })).toThrow(/bankroll rules/);
    expect(assertDegenRiskConfig("CAPPED_AUTO_LIVE", riskConfig)).toEqual(riskConfig);
  });

  it("rejects backend key material, custody, and signing", () => {
    expect(() => assertNoBackendKeyFields({ privateKey: "nope" })).toThrow(/privatekey/);
    expect(() => assertNoDegenBackendCustodyOrSigning({ backendSigning: true })).toThrow(/backend signing/);
    expect(() => assertNoDegenBackendCustodyOrSigning({ backendCustody: true })).toThrow(/backend custody/);
  });

  it("creates client-signed trade intents with a risk hash", () => {
    const intent = createTradeIntent({
      agentId: "agent_copy_chad",
      ownerWallet: "owner_wallet",
      venue: "JUPITER",
      side: "BUY",
      maxInputAmountAtomic: "25000000",
      slippageBps: 100,
      mode: "USER_CONFIRMED_LIVE",
      riskConfig,
    });

    expect(intent.status).toBe("PROPOSED");
    expect(intent.requiresClientSignature).toBe(true);
    expect(intent.riskConfigHash).toMatch(/^risk_/);
  });

  it("enforces max trade, daily spend, daily loss, open exposure, and slippage", () => {
    const intent = createTradeIntent({
      agentId: "agent_risk",
      ownerWallet: "owner_wallet",
      venue: "JUPITER",
      side: "BUY",
      maxInputAmountAtomic: "50000000",
      slippageBps: 100,
      mode: "CAPPED_AUTO_LIVE",
      riskConfig,
    });

    expect(validateTradeIntentAgainstRisk(intent, riskConfig)).toBe(true);
    expect(() => validateTradeIntentAgainstRisk({ ...intent, maxInputAmountAtomic: "51000000" }, riskConfig)).toThrow(/ape budget/);
    expect(() => validateTradeIntentAgainstRisk(intent, riskConfig, { spentTodayUsd: 275, lossTodayUsd: 0, openExposureUsd: 0 })).toThrow(/daily bankroll/);
    expect(() => validateTradeIntentAgainstRisk(intent, riskConfig, { spentTodayUsd: 0, lossTodayUsd: 76, openExposureUsd: 0 })).toThrow(/Kill switch/);
    expect(() => validateTradeIntentAgainstRisk(intent, riskConfig, { spentTodayUsd: 0, lossTodayUsd: 0, openExposureUsd: 125 })).toThrow(/open exposure/);
    expect(() => validateTradeIntentAgainstRisk({ ...intent, slippageBps: 126 }, riskConfig)).toThrow(/slippage/);
  });

  it("keeps Fresh Pair Goblin signal-first and Copy The Chad capped", () => {
    const freshPair = JSON.parse(fs.readFileSync(path.resolve("templates", "agents", "degen-live", "fresh-pair-goblin-live.json"), "utf8"));
    const copyChad = JSON.parse(fs.readFileSync(path.resolve("templates", "agents", "degen-live", "copy-the-chad-live.json"), "utf8"));

    expect(freshPair.defaultMode).toBe("SIGNAL_ONLY");
    expect(freshPair.freshPairFilters.minLiquidityUsd).toBeGreaterThan(0);
    expect(copyChad.copyRules.minEntryPriceBps).toBe(4000);
    expect(copyChad.copyRules.maxEntryPriceBps).toBe(6000);
    expect(copyChad.riskConfig.requireUserConfirmAboveUsd).toBeLessThanOrEqual(copyChad.riskConfig.maxTradeUsd);
  });
});
