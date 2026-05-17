import { describe, expect, it } from "vitest";
import {
  calculateAlphaFeeAtomic,
  DnaX402PolicyError,
  validateAlphaFeeConfig,
  type AlphaFeeConfig,
} from "../sdk/typescript/src/index.js";

describe("Degen alpha profit-share fees", () => {
  it("keeps STANDARD alpha fees at 0.5% to 3%", () => {
    const config: AlphaFeeConfig = {
      tier: "STANDARD",
      feeBps: 300,
      appliesTo: "POSITIVE_FINALIZED_COPIED_LOT_PNL",
      explicitFollowerConsent: true,
    };
    expect(validateAlphaFeeConfig(config)).toBe(true);
    expect(calculateAlphaFeeAtomic(config, "1000000")).toBe("30000");
  });

  it("allows 10% and 20% only in Degen Alpha Room with explicit consent", () => {
    for (const feeBps of [1000, 2000] as const) {
      const config: AlphaFeeConfig = {
        tier: "DEGEN_ALPHA_ROOM",
        feeBps,
        appliesTo: "POSITIVE_FINALIZED_COPIED_LOT_PNL",
        explicitFollowerConsent: true,
      };
      expect(validateAlphaFeeConfig(config)).toBe(true);
      expect(calculateAlphaFeeAtomic(config, "1000000")).toBe(String(1000000n * BigInt(feeBps) / 10000n));
    }
  });

  it("does not charge alpha fee on loss, break-even, unrealized, or without consent", () => {
    const config: AlphaFeeConfig = {
      tier: "DEGEN_ALPHA_ROOM",
      feeBps: 2000,
      appliesTo: "POSITIVE_FINALIZED_COPIED_LOT_PNL",
      explicitFollowerConsent: true,
    };
    expect(calculateAlphaFeeAtomic(config, "0")).toBe("0");
    expect(calculateAlphaFeeAtomic(config, "-1")).toBe("0");
    expect(() => validateAlphaFeeConfig({ ...config, explicitFollowerConsent: false as true })).toThrow(DnaX402PolicyError);
    expect(() => validateAlphaFeeConfig({ ...config, tier: "STANDARD" })).toThrow(/STANDARD/);
  });
});
