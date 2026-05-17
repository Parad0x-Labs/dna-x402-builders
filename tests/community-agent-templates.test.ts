import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const communityRoot = path.resolve("templates", "agents", "community");

type CommunityTemplate = {
  name: string;
  slug: string;
  pack: string;
  category: string;
  description: string;
  degenPitch: string;
  telegramSupport: boolean;
  discordSupport: boolean;
  walletModel: string;
  backendCustody: boolean;
  backendSigning: boolean;
  feeBehavior: string;
  mockDevnetTestPath: string;
  cursorPrompt: string;
  receiptBehavior: {
    receiptRequired: boolean;
    bindsProof: boolean;
    bindsFeeWaterfall: boolean;
  };
  monetization: {
    enabled: boolean;
    builderFeeBps: number | null;
    alphaFeeBps: number | null;
    appliesTo: string;
  };
  notInBetaScope: string[];
  exampleFlow: string[];
};

function templates(): CommunityTemplate[] {
  return fs.readdirSync(communityRoot)
    .filter((name) => name.endsWith(".json"))
    .map((name) => JSON.parse(fs.readFileSync(path.join(communityRoot, name), "utf8")) as CommunityTemplate);
}

describe("community agent templates", () => {
  it("ships the full community monetization pack", () => {
    const pack = templates();
    const slugs = new Set(pack.map((template) => template.slug));

    expect(pack.length).toBeGreaterThanOrEqual(15);
    for (const slug of [
      "paid-alpha-room-agent",
      "signal-role-gate-agent",
      "research-drop-agent",
      "copy-alert-room-agent",
      "bounty-board-agent",
      "paid-watchlist-room-agent",
      "token-launch-monitor-room-agent",
      "whale-alert-room-agent",
      "community-task-agent",
      "receipt-gated-access-agent",
      "daily-market-brief-agent",
      "holder-only-alpha-room-agent",
      "paid-discord-command-agent",
      "paid-telegram-command-agent",
      "agent-leaderboard-bot",
    ]) {
      expect(slugs.has(slug)).toBe(true);
    }
  });

  it("keeps every community template walletless, receipt-bound, and no-custody", () => {
    for (const template of templates()) {
      expect(template.pack).toBe("community");
      expect(template.category).toBe("community");
      expect(template.description.length).toBeGreaterThan(50);
      expect(template.degenPitch.length).toBeGreaterThan(20);
      expect(template.telegramSupport || template.discordSupport).toBe(true);
      expect(template.walletModel).toBe("NONE_REQUIRED");
      expect(template.backendCustody).toBe(false);
      expect(template.backendSigning).toBe(false);
      expect(template.receiptBehavior.receiptRequired).toBe(true);
      expect(template.receiptBehavior.bindsProof).toBe(true);
      expect(template.receiptBehavior.bindsFeeWaterfall).toBe(true);
      expect(template.feeBehavior).toMatch(/fee|receipt/i);
      expect(template.mockDevnetTestPath).toBe("npm run acceptance:community-agents");
      expect(template.cursorPrompt).toContain("DNA x402");
      expect(template.exampleFlow.length).toBeGreaterThanOrEqual(3);
      expect(template.notInBetaScope.join(" ").toLowerCase()).not.toContain("hidden fees allowed");
    }
  });

  it("keeps monetization bounded and alpha fee basis safe", () => {
    for (const template of templates()) {
      if (template.monetization.builderFeeBps !== null) {
        expect(template.monetization.builderFeeBps).toBeGreaterThanOrEqual(0);
        expect(template.monetization.builderFeeBps).toBeLessThanOrEqual(500);
      }
      if (template.monetization.alphaFeeBps !== null) {
        expect([50, 100, 150, 200, 250, 300]).toContain(template.monetization.alphaFeeBps);
        expect(template.monetization.appliesTo).toBe("POSITIVE_FINALIZED_COPIED_LOT_PNL");
      }
    }
  });
});
