import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const templateRoot = path.resolve("templates", "agents");

type AgentTemplate = {
  slug: string;
  pack: string;
  defaultMode: string;
  backendCustody: boolean;
  backendSigning: boolean;
  riskLimits: Record<string, number>;
  copyRules: {
    copyBuys: boolean;
    copySells: boolean;
    copyExits: boolean;
    minEntryPriceBps: number | null;
    maxEntryPriceBps: number | null;
  };
  monetization: {
    enabled: boolean;
    builderFeeBps: number | null;
    alphaFeeBps: number | null;
    appliesTo: string;
  };
  receiptBehavior: {
    receiptRequired: boolean;
    bindsProof: boolean;
    bindsFeeWaterfall: boolean;
  };
};

function listJsonFiles(dir: string): string[] {
  const out: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...listJsonFiles(full));
    else if (entry.isFile() && entry.name.endsWith(".json")) out.push(full);
  }
  return out.sort();
}

function readTemplates(): AgentTemplate[] {
  return listJsonFiles(templateRoot).map((file) => JSON.parse(fs.readFileSync(file, "utf8")) as AgentTemplate);
}

function mockQuote(template: AgentTemplate) {
  const dnaFeeBps = 10;
  return {
    quoteId: `quote_${template.slug}`,
    lines: [
      { kind: "PROVIDER_AMOUNT", amountAtomic: "999000", requiredForFinalize: true },
      { kind: "DNA_PLATFORM_FEE", amountAtomic: "1000", bps: dnaFeeBps, requiredForFinalize: true },
    ],
  };
}

function mockFinalize(proof: { amountAtomic: string; recipient: string; replay?: boolean }) {
  if (proof.replay) return { ok: false, code: "REPLAY_REJECTED" };
  if (proof.recipient !== "dna_treasury_demo") return { ok: false, code: "WRONG_RECIPIENT" };
  if (BigInt(proof.amountAtomic) < 1000n) return { ok: false, code: "UNDERPAY" };
  return { ok: true, receiptId: "receipt_demo" };
}

function copyDecision(template: AgentTemplate, action: { kind: "BUY" | "SELL"; entryPriceBps: number; amountUsd: number; spentTodayUsd: number }) {
  if (action.kind === "BUY" && !template.copyRules.copyBuys) return "SKIP";
  if (action.kind === "SELL" && !template.copyRules.copySells) return "SKIP";
  if (template.copyRules.minEntryPriceBps !== null && action.entryPriceBps < template.copyRules.minEntryPriceBps) return "SKIP";
  if (template.copyRules.maxEntryPriceBps !== null && action.entryPriceBps > template.copyRules.maxEntryPriceBps) return "SKIP";
  if (action.amountUsd > template.riskLimits.maxBetUsd) return "SKIP";
  if (action.spentTodayUsd + action.amountUsd > template.riskLimits.maxDailySpendUsd) return "SKIP";
  return "COPY";
}

function finalizeCopiedLot(template: AgentTemplate, pnlAtomic: bigint, alreadyFinalized = false) {
  if (alreadyFinalized) return { ok: false, code: "ALREADY_FINALIZED" };
  if (pnlAtomic <= 0n) return { ok: true, alphaFeeAtomic: 0n };
  const feeBps = BigInt(template.monetization.alphaFeeBps ?? 0);
  return { ok: true, alphaFeeAtomic: pnlAtomic * feeBps / 10000n };
}

describe("template mock/devnet acceptance", () => {
  it("can create a safe draft, quote, commit, finalize, and receipt shape for every template", () => {
    for (const template of readTemplates()) {
      expect(template.backendCustody).toBe(false);
      expect(template.backendSigning).toBe(false);
      const draft = {
        status: "DRAFT_CREATED",
        slug: template.slug,
        riskSummary: {
          backendCustody: template.backendCustody,
          backendSigning: template.backendSigning,
          defaultMode: template.defaultMode,
        },
      };
      const quote = mockQuote(template);
      const commit = { commitId: `commit_${template.slug}`, quoteId: quote.quoteId };
      const finalized = mockFinalize({ amountAtomic: "1000", recipient: "dna_treasury_demo" });
      expect(draft.status).toBe("DRAFT_CREATED");
      expect(quote.lines.some((line) => line.kind === "PROVIDER_AMOUNT")).toBe(true);
      expect(quote.lines.some((line) => line.kind === "DNA_PLATFORM_FEE" && line.bps === 10)).toBe(true);
      expect(commit.quoteId).toBe(quote.quoteId);
      expect(finalized.ok).toBe(true);
      expect(template.receiptBehavior).toBeTruthy();
    }
  });

  it("rejects underpay, wrong recipient, and replay in mock direct split", () => {
    expect(mockFinalize({ amountAtomic: "999", recipient: "dna_treasury_demo" })).toEqual({ ok: false, code: "UNDERPAY" });
    expect(mockFinalize({ amountAtomic: "1000", recipient: "wrong_treasury" })).toEqual({ ok: false, code: "WRONG_RECIPIENT" });
    expect(mockFinalize({ amountAtomic: "1000", recipient: "dna_treasury_demo", replay: true })).toEqual({ ok: false, code: "REPLAY_REJECTED" });
  });

  it("proves copy filters and alpha accrual behavior in mock/devnet mode", () => {
    const copyTemplate = readTemplates().find((template) => template.slug === "forty-sixty-edge-copy-agent");
    expect(copyTemplate).toBeTruthy();
    if (!copyTemplate) return;
    expect(copyDecision(copyTemplate, { kind: "BUY", entryPriceBps: 5000, amountUsd: 5, spentTodayUsd: 0 })).toBe("COPY");
    expect(copyDecision(copyTemplate, { kind: "BUY", entryPriceBps: 8000, amountUsd: 5, spentTodayUsd: 0 })).toBe("SKIP");
    expect(copyDecision(copyTemplate, { kind: "SELL", entryPriceBps: 5000, amountUsd: 5, spentTodayUsd: 0 })).toBe("SKIP");
    expect(copyDecision(copyTemplate, { kind: "BUY", entryPriceBps: 5000, amountUsd: 6, spentTodayUsd: 0 })).toBe("SKIP");
    expect(copyDecision(copyTemplate, { kind: "BUY", entryPriceBps: 5000, amountUsd: 5, spentTodayUsd: 48 })).toBe("SKIP");
    expect(finalizeCopiedLot(copyTemplate, 1000000n)).toEqual({ ok: true, alphaFeeAtomic: 20000n });
    expect(finalizeCopiedLot(copyTemplate, -1000000n)).toEqual({ ok: true, alphaFeeAtomic: 0n });
    expect(finalizeCopiedLot(copyTemplate, 1000000n, true)).toEqual({ ok: false, code: "ALREADY_FINALIZED" });
  });

  it("requires social proof URL or hash, timestamp, and human review before receipt", () => {
    const socialTemplate = readTemplates().find((template) => template.slug === "x-proof-of-engagement-agent");
    expect(socialTemplate).toBeTruthy();
    const seen = new Set<string>();
    function submitProof(proof: { url?: string; hash?: string; timestamp?: string; reviewed?: boolean }) {
      const key = proof.url ?? proof.hash;
      if (!key || !proof.timestamp) return { ok: false, code: "PROOF_INCOMPLETE" };
      if (seen.has(key)) return { ok: false, code: "DUPLICATE_PROOF" };
      seen.add(key);
      if (!proof.reviewed) return { ok: false, code: "HUMAN_REVIEW_REQUIRED" };
      return { ok: true, receiptId: "receipt_proof_demo" };
    }
    expect(submitProof({ url: "https://x.com/demo/status/1" })).toEqual({ ok: false, code: "PROOF_INCOMPLETE" });
    expect(submitProof({ url: "https://x.com/demo/status/1", timestamp: "2026-05-17T00:00:00Z" })).toEqual({ ok: false, code: "HUMAN_REVIEW_REQUIRED" });
    expect(submitProof({ url: "https://x.com/demo/status/1", timestamp: "2026-05-17T00:00:00Z", reviewed: true })).toEqual({ ok: false, code: "DUPLICATE_PROOF" });
    expect(submitProof({ hash: "proof_hash_2", timestamp: "2026-05-17T00:00:00Z", reviewed: true })).toEqual({ ok: true, receiptId: "receipt_proof_demo" });
  });
});

