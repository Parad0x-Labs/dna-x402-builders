import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  buildParadoxSignalFeeWaterfall,
  buildSignalReceiptMetadata,
  createSignalUsageEvent,
  DnaX402PolicyError,
  hasGuaranteedProfitClaim,
  requireBuilderSignalLicense,
  type BuilderSignalLicense,
} from "../sdk/typescript/src/index.js";

const activeLicense: BuilderSignalLicense = {
  builderId: "builder_demo",
  allowedSources: ["PARADOX_SPORTS_BETS_FEED", "PARADOX_POLYMARKET_FEED", "PARADOX_CRYPTO_SIGNAL_FEED"],
  allowedUsageTypes: ["SIGNAL_PING", "SIGNAL_WITH_REASONING", "RESULT_UPDATE", "TELEGRAM_DELIVERY", "DISCORD_DELIVERY"],
  resaleAllowed: true,
  attributionRequired: true,
  maxDailySignals: 100,
  status: "ACTIVE",
};

const templateRoot = path.resolve("templates", "agents");

type SignalLicensedTemplate = {
  slug: string;
  signalLicensing?: {
    signalSourceOptions: string[];
    paradoxUsageTypes: string[];
    resaleAllowedWithLicense: boolean;
    sourceAttributionRequired: boolean;
    paradoxSourceFeeRequired: boolean;
    receiptBindsSignalId: boolean;
    forbiddenClaims: string[];
  };
};

function readTemplate(relativePath: string): SignalLicensedTemplate {
  return JSON.parse(fs.readFileSync(path.join(templateRoot, relativePath), "utf8")) as SignalLicensedTemplate;
}

describe("Parad0x signal licensing and metered resale", () => {
  it("creates usage events for Parad0x signal delivery", () => {
    const event = createSignalUsageEvent({
      signalId: "signal_btc_001",
      source: "PARADOX_SPORTS_BETS_FEED",
      builderId: "builder_demo",
      agentId: "agent_telegram",
      usageType: "TELEGRAM_DELIVERY",
      receiptId: "receipt_signal_001",
      createdAt: "2026-05-17T00:00:00.000Z",
    });

    expect(event.usageId).toBe("usage_signal_btc_001_telegram_delivery");
    expect(event.source).toBe("PARADOX_SPORTS_BETS_FEED");
    expect(event.receiptId).toBe("receipt_signal_001");
  });

  it("builds visible builder, Parad0x source, and DNA fee lines", () => {
    const waterfall = buildParadoxSignalFeeWaterfall({
      signalId: "signal_poly_001",
      source: "PARADOX_POLYMARKET_FEED",
      usageType: "SIGNAL_WITH_REASONING",
      builderId: "builder_demo",
      agentId: "agent_dashboard",
      buyerTotalAtomic: "150000",
      builderFeeAtomic: "40000",
    });

    expect(waterfall.lines.some((line) => line.kind === "BUILDER_FEE" && line.amount === "40000")).toBe(true);
    expect(waterfall.lines.some((line) => line.kind === "PARADOX_SIGNAL_SOURCE_FEE" && line.amount === "100000")).toBe(true);
    expect(waterfall.lines.some((line) => line.kind === "DNA_PLATFORM_FEE" && line.amount === "1000")).toBe(true);
    expect(waterfall.feeWaterfallHash).toContain("signal_poly_001");
  });

  it("rejects unlicensed or suspended Parad0x signal resale", () => {
    expect(() => requireBuilderSignalLicense({
      license: null,
      source: "PARADOX_CRYPTO_SIGNAL_FEED",
      usageType: "SIGNAL_PING",
      attribution: "Parad0x Labs",
      includesParadoxFee: true,
      visibleFees: true,
    })).toThrow(DnaX402PolicyError);

    expect(() => requireBuilderSignalLicense({
      license: { ...activeLicense, status: "SUSPENDED" },
      source: "PARADOX_CRYPTO_SIGNAL_FEED",
      usageType: "SIGNAL_PING",
      attribution: "Parad0x Labs",
      includesParadoxFee: true,
      visibleFees: true,
    })).toThrow(/active builder signal license/);
  });

  it("rejects removed source fee, removed attribution, hidden fees, bad claims, and usage cap abuse", () => {
    const base = {
      license: activeLicense,
      source: "PARADOX_POLYMARKET_FEED" as const,
      usageType: "SIGNAL_PING" as const,
      attribution: "Parad0x Labs",
      includesParadoxFee: true,
      visibleFees: true,
      usageToday: 0,
    };

    expect(requireBuilderSignalLicense(base)).toBe(true);
    expect(() => requireBuilderSignalLicense({ ...base, includesParadoxFee: false })).toThrow(/source fee cannot be removed/);
    expect(() => requireBuilderSignalLicense({ ...base, attribution: "Builder Only" })).toThrow(/attribution/);
    expect(() => requireBuilderSignalLicense({ ...base, visibleFees: false })).toThrow(/visible/);
    expect(() => requireBuilderSignalLicense({ ...base, claimText: "guaranteed win signal" })).toThrow(/guaranteed profit/);
    expect(hasGuaranteedProfitClaim("Signal quality is not guaranteed.")).toBe(false);
    expect(hasGuaranteedProfitClaim("100% win signal room")).toBe(true);
    expect(() => requireBuilderSignalLicense({ ...base, usageToday: 100 })).toThrow(/usage cap/);
  });

  it("binds signal receipts to source, usage type, attribution, and fee waterfall hash", () => {
    const metadata = buildSignalReceiptMetadata({
      signalId: "signal_result_001",
      signalSource: "PARADOX_SPORTS_BETS_FEED",
      builderId: "builder_demo",
      agentId: "agent_result_webhook",
      usageType: "RESULT_UPDATE",
      sourceAttribution: "Parad0x Labs",
      signalDigest: "signal_digest_demo",
      resultDigest: "result_digest_demo",
      feeWaterfallHash: "fee_waterfall_hash_demo",
    });

    expect(metadata.signalId).toBe("signal_result_001");
    expect(metadata.sourceAttribution).toBe("Parad0x Labs");
    expect(metadata.resultDigest).toBe("result_digest_demo");
    expect(() => buildSignalReceiptMetadata({ ...metadata, sourceAttribution: "Parad0x Labs" })).not.toThrow();
  });

  it("marks relevant public templates as Parad0x signal-source aware", () => {
    for (const template of [
      readTemplate("prediction-market/prediction-market-agent.json"),
      readTemplate("meme-casino/telegram-signal-tollbooth.json"),
      readTemplate("meme-casino/discord-signal-tollbooth.json"),
      readTemplate("community/paid-alpha-room-agent.json"),
      readTemplate("community/copy-alert-room-agent.json"),
      readTemplate("community/research-drop-agent.json"),
    ]) {
      expect(template.signalLicensing?.signalSourceOptions.some((source) => source.startsWith("PARADOX_"))).toBe(true);
      expect(template.signalLicensing?.paradoxUsageTypes.length).toBeGreaterThan(0);
      expect(template.signalLicensing?.resaleAllowedWithLicense).toBe(true);
      expect(template.signalLicensing?.sourceAttributionRequired).toBe(true);
      expect(template.signalLicensing?.paradoxSourceFeeRequired).toBe(true);
      expect(template.signalLicensing?.receiptBindsSignalId).toBe(true);
      expect(template.signalLicensing?.forbiddenClaims.join(" ")).toMatch(/Guaranteed profit|Fake PnL|Fake result|Success fee on losses/);
    }
  });
});
