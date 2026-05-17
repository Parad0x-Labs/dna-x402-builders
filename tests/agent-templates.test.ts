import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const root = path.resolve(".");
const templateRoot = path.join(root, "templates", "agents");

type AgentTemplate = {
  name: string;
  slug: string;
  category: string;
  description: string;
  whatItDoes: string[];
  publicBetaMode: string;
  riskLimits: Record<string, number>;
  monetization?: Record<string, unknown>;
  receiptProofBehavior: string[];
  suggestedPrompt: string;
  exampleApiFlow: string[];
  notInBetaScope: string[];
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

describe("agent template gallery", () => {
  it("ships the required Agent Hub templates", () => {
    const slugs = new Set(readTemplates().map((template) => template.slug));
    expect(slugs).toEqual(new Set([
      "prediction-market-agent",
      "solana-trading-agent",
      "copy-follow-agent",
      "paid-api-agent",
      "data-feed-agent",
      "tool-agent",
      "compute-agent",
      "alert-agent",
      "automation-agent",
      "research-agent",
      "custom-agent",
    ]));
  });

  it("keeps every template complete and builder-usable", () => {
    for (const template of readTemplates()) {
      expect(template.name).toBeTruthy();
      expect(template.slug).toMatch(/^[a-z0-9-]+$/);
      expect(template.category).toBeTruthy();
      expect(template.description.length).toBeGreaterThan(40);
      expect(template.whatItDoes.length).toBeGreaterThanOrEqual(2);
      expect(template.publicBetaMode).toBeTruthy();
      expect(Object.keys(template.riskLimits).length).toBeGreaterThan(0);
      expect(template.receiptProofBehavior.length).toBeGreaterThanOrEqual(2);
      expect(template.suggestedPrompt).toContain("DNA x402");
      expect(template.exampleApiFlow.length).toBeGreaterThan(0);
      expect(template.notInBetaScope.length).toBeGreaterThan(0);
    }
  });

  it("does not publish secrets or backend custody/signing examples", () => {
    const text = listJsonFiles(templateRoot)
      .map((file) => fs.readFileSync(file, "utf8"))
      .join("\n");

    expect(text).not.toMatch(/BEGIN (OPENSSH |RSA |EC )?PRIVATE KEY/);
    expect(text).not.toMatch(/HELIUS_API_KEY\s*=/);
    expect(text).not.toMatch(/TELEGRAM_BOT_TOKEN\s*=/);
    expect(text).not.toMatch(/DATABASE_URL=.*:\/\//);
    expect(text).not.toMatch(/"backendSigning"\s*:\s*true/);
    expect(text).not.toMatch(/"backendCustody"\s*:\s*true/);
    expect(text).not.toMatch(/"hiddenFee"\s*:\s*true/);
  });
});
