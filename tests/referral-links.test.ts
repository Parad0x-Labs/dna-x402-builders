import { describe, expect, it } from "vitest";
import {
  createAgentReferralLink,
  DnaX402PolicyError,
} from "../sdk/typescript/src/index.js";

describe("agent referral links", () => {
  it("creates fee-share referral links for copy agents, rooms, signals, APIs, and profiles", () => {
    const link = createAgentReferralLink({
      agentId: "agent_alpha_room",
      ownerWallet: "owner_wallet",
      referralCode: "CHAD42",
      target: "JOIN_ROOM",
      rewardMode: "BUILDER_FEE_SHARE",
      rewardBps: 1000,
    });

    expect(link.referralId).toBe("ref_agent_alpha_room_chad42");
    expect(link.rewardMode).toBe("BUILDER_FEE_SHARE");
    expect(link.rewardBps).toBe(1000);
  });

  it("does not default to referral rake on follower losses", () => {
    expect(() => createAgentReferralLink({
      agentId: "agent_bad",
      ownerWallet: "owner_wallet",
      referralCode: "LOSS",
      target: "COPY_AGENT",
      rewardMode: "FEE_SHARE",
      rewardBps: 1000,
      lossRakeDefault: true,
    })).toThrow(DnaX402PolicyError);
  });
});
