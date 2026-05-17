import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  assertNoFakePnlOrProfitClaims,
  DnaX402PolicyError,
} from "../sdk/typescript/src/index.js";

const root = path.resolve("templates", "agents", "degen-live");

function readTemplate(name: string) {
  return JSON.parse(fs.readFileSync(path.join(root, name), "utf8"));
}

describe("demo and Degen template claims", () => {
  it("marks demo proven-edge agents as simulated", () => {
    const demo = readTemplate("demo-proven-edge-agent.json");
    expect(demo.demoData.label).toContain("SIMULATED");
    expect(demo.demoData.caveat).toMatch(/not live performance/i);
    expect(demo.notInBetaScope.join(" ")).toMatch(/Unmarked demo PnL/);
  });

  it("rejects fake PnL and guaranteed-profit claims while allowing safety disclaimers", () => {
    expect(() => assertNoFakePnlOrProfitClaims("guaranteed profit with fake PnL")).toThrow(DnaX402PolicyError);
    expect(assertNoFakePnlOrProfitClaims("No guaranteed profit claims. Demo data is SIMULATED.")).toBe(true);
  });

  it("keeps Degen templates free from unsafe live execution flags", () => {
    const files = fs.readdirSync(root).filter((file) => file.endsWith(".json"));
    expect(files.length).toBeGreaterThanOrEqual(20);
    for (const file of files) {
      const text = fs.readFileSync(path.join(root, file), "utf8");
      const template = JSON.parse(text);
      expect(template.backendCustody).toBe(false);
      expect(template.backendSigning).toBe(false);
      expect(text).not.toMatch(/"hiddenFee"\s*:\s*true/);
      expect(text).not.toMatch(/backend private key/i);
      expect(text).not.toMatch(/guaranteed\s+(win|profit)(?! claims)/i);
    }
  });
});
