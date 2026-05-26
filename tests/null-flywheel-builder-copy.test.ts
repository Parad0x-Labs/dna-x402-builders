import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  NULL_FLYWHEEL_ALLOCATION_BPS,
  NULL_MINT,
  buildNullFlywheelReceiptMetadata,
} from "../sdk/typescript/src/index.js";

describe("NULL flywheel builder surface", () => {
  it("exports the public mint, allocation, and receipt metadata helper", () => {
    const metadata = buildNullFlywheelReceiptMetadata({
      feeSource: "SIGNAL_REVEAL_FEE",
      receiptId: "receipt_1",
      feeEventId: "fee_event_1",
      feeWaterfallHash: "waterfall_1",
      commitmentHash: "commit_1",
      executionReceiptHash: "exec_1",
      epochAggregateHash: "epoch_1",
    });

    expect(NULL_MINT).toBe("8EeDdvCRmFAzVD4takkBrNNwkeUTUQh4MscRK5Fzpump");
    expect(NULL_FLYWHEEL_ALLOCATION_BPS).toBe(5);
    expect(metadata).toMatchObject({
      schema: "dna-x402-null-flywheel-receipt-metadata-v1",
      mint: NULL_MINT,
      destination: "RewardsVault",
      allocationBps: 5,
      feeSource: "SIGNAL_REVEAL_FEE",
    });
  });

  it("keeps builder-facing flywheel copy strong and evidence-focused", () => {
    const text = [
      fs.readFileSync(path.resolve("README.md"), "utf8"),
      fs.readFileSync(path.resolve("docs", "NULL_FLYWHEEL.md"), "utf8"),
      fs.readFileSync(path.resolve("docs", "FEES_AND_DIRECT_SPLIT.md"), "utf8"),
      fs.readFileSync(path.resolve("docs", "MEMECOIN_PAYMENTS.md"), "utf8"),
    ].join("\n");

    expect(text).toContain(NULL_MINT);
    expect(text).toContain("RewardsVault");
    expect(text).toContain("25 Rust tests");
    expect(text).toContain("commit-reveal");
    expect(text).toContain("public receipt");
    const weakBrandingTerms = ["hon" + "est", "hon" + "esty", "hon" + "estly", "tr" + "uth"];
    const weakStatusTerms = ["no " + "audit", "not_" + "production", "not " + "production", "mainnet_" + "ready", "only " + "mainnet"];
    for (const term of [...weakBrandingTerms, ...weakStatusTerms]) {
      expect(text.toLowerCase()).not.toContain(term);
    }
  });

  it("rejects incomplete flywheel receipt metadata", () => {
    expect(() => buildNullFlywheelReceiptMetadata({
      feeSource: "RISK_CHECK_FEE",
      receiptId: "",
      feeEventId: "fee_event_1",
      feeWaterfallHash: "waterfall_1",
    })).toThrow(/requires/);
  });
});
