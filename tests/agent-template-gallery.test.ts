import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const templateRoot = path.resolve("templates", "agents");

type AgentTemplate = {
  name: string;
  slug: string;
  pack: string;
  category: string;
  backendCustody: boolean;
  backendSigning: boolean;
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

describe("expanded template gallery", () => {
  it("ships core, meme casino, and social packs", () => {
    const templates = readTemplates();
    const packs = new Set(templates.map((template) => template.pack));
    expect(templates.length).toBeGreaterThanOrEqual(41);
    expect(packs.has("core")).toBe(true);
    expect(packs.has("meme-casino")).toBe(true);
    expect(packs.has("social-x")).toBe(true);
  });

  it("keeps monetized templates receipt-aware and fee-safe", () => {
    for (const template of readTemplates()) {
      expect(template.backendCustody).toBe(false);
      expect(template.backendSigning).toBe(false);
      if (template.monetization.enabled) {
        expect(template.receiptBehavior.receiptRequired).toBe(true);
        expect(template.receiptBehavior.bindsFeeWaterfall).toBe(true);
        if (template.monetization.builderFeeBps !== null) {
          expect(template.monetization.builderFeeBps).toBeGreaterThanOrEqual(0);
          expect(template.monetization.builderFeeBps).toBeLessThanOrEqual(500);
        }
        if (template.monetization.alphaFeeBps !== null) {
          expect([50, 100, 150, 200, 250, 300]).toContain(template.monetization.alphaFeeBps);
          expect(template.monetization.appliesTo).toBe("POSITIVE_FINALIZED_COPIED_LOT_PNL");
        }
      }
    }
  });
});

