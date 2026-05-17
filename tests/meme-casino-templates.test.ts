import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const memeRoot = path.resolve("templates", "agents", "meme-casino");

type MemeTemplate = {
  name: string;
  slug: string;
  pack: string;
  cursorPrompt: string;
  backendCustody: boolean;
  backendSigning: boolean;
  copyRules: {
    copyBuys: boolean;
    copySells: boolean;
    copyExits: boolean;
    minEntryPriceBps: number | null;
    maxEntryPriceBps: number | null;
  };
  monetization: {
    enabled: boolean;
    alphaFeeBps: number | null;
    appliesTo: string;
  };
};

function templates(): MemeTemplate[] {
  return fs.readdirSync(memeRoot)
    .filter((name) => name.endsWith(".json"))
    .map((name) => JSON.parse(fs.readFileSync(path.join(memeRoot, name), "utf8")) as MemeTemplate);
}

describe("meme casino templates", () => {
  it("ships at least 20 degen-native recipes without custody or signing", () => {
    const pack = templates();
    expect(pack.length).toBeGreaterThanOrEqual(20);
    for (const template of pack) {
      expect(template.pack).toBe("meme-casino");
      expect(template.cursorPrompt).toContain("DNA x402");
      expect(template.backendCustody).toBe(false);
      expect(template.backendSigning).toBe(false);
    }
  });

  it("keeps copy and alpha recipes constrained", () => {
    const copyTemplates = templates().filter((template) => template.copyRules.copyBuys);
    expect(copyTemplates.length).toBeGreaterThanOrEqual(4);
    for (const template of copyTemplates) {
      expect(template.copyRules.maxEntryPriceBps ?? 6000).toBeLessThanOrEqual(6000);
      if (template.monetization.alphaFeeBps !== null) {
        expect(template.monetization.appliesTo).toBe("POSITIVE_FINALIZED_COPIED_LOT_PNL");
      }
    }
  });
});

