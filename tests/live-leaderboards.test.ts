import { describe, expect, it } from "vitest";
import {
  classifySampleSize,
  leaderboardWarnings,
  type AgentPnlStats,
} from "../sdk/typescript/src/index.js";

describe("live PnL leaderboards", () => {
  it("shows average entry, sample-size badge, drawdown, and paper warnings", () => {
    const stats: AgentPnlStats = {
      agentId: "agent_demo",
      mode: "PAPER",
      realizedPnlAtomic: "1000000",
      unrealizedPnlAtomic: "0",
      roiBps: 1200,
      winRateBps: 9500,
      avgEntryPriceBps: 9600,
      avgExitPriceBps: 9900,
      tradeCount: 5,
      copiedFollowerPnlAtomic: "500000",
      maxDrawdownBps: 3000,
      sampleSizeBadge: classifySampleSize(5),
      proofCount: 0,
    };

    expect(stats.sampleSizeBadge).toBe("LOW_SAMPLE");
    expect(leaderboardWarnings(stats)).toEqual(["PAPER_ONLY", "LOW_SAMPLE_SIZE", "HIGH_AVG_ENTRY", "HIGH_DRAWDOWN"]);
    expect(classifySampleSize(50)).toBe("MEDIUM_SAMPLE");
    expect(classifySampleSize(150)).toBe("HIGH_SAMPLE");
  });
});
