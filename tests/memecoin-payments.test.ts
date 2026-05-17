import { describe, expect, it } from "vitest";
import {
  DnaX402PolicyError,
  validateTokenPaymentConfig,
  type TokenPaymentConfig,
} from "../sdk/typescript/src/index.js";

describe("memecoin-native payment config", () => {
  it("keeps USDC and blue-chip configs simple", () => {
    const config: TokenPaymentConfig = {
      mint: "usdc_mint",
      symbol: "USDC",
      riskTier: "BLUE_CHIP",
      acceptedFor: "API_ACCESS",
      conversionMode: "FIXED_PRICE",
    };
    expect(validateTokenPaymentConfig(config)).toBe(true);
  });

  it("requires allowlist for meme and high-risk token payment configs", () => {
    const meme: TokenPaymentConfig = {
      mint: "meme_mint",
      symbol: "MEME",
      riskTier: "MEME",
      acceptedFor: "SIGNALS",
      conversionMode: "MANUAL",
    };
    expect(() => validateTokenPaymentConfig(meme)).toThrow(DnaX402PolicyError);
    expect(validateTokenPaymentConfig(meme, ["meme_mint"])).toBe(true);
    expect(() => validateTokenPaymentConfig({ ...meme, riskTier: "HIGH_RISK" }, [])).toThrow(/allowlist/);
  });
});
