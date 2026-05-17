import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  assertNoPrivateKeyEnv,
  handleCommand,
  handleInteraction,
  loadConfig,
  renderStartupSummary,
} from "../launchers/discord/src/index.js";

const launcherRoot = path.resolve("launchers", "discord");
const discordTokenEnv = "DISCORD" + "_BOT" + "_TOKEN";
const discordPublicKeyEnv = "DISCORD" + "_PUBLIC" + "_KEY";
const discordApplicationIdEnv = "DISCORD" + "_APPLICATION" + "_ID";
const privateKeyEnv = "PRIVATE" + "_KEY";
const walletPrivateKeyEnv = "WALLET" + "_PRIVATE" + "_KEY";
const seedPhraseEnv = "SEED" + "_PHRASE";

describe("discord agent launcher", () => {
  it("parses placeholder config into mock mode", () => {
    const config = loadConfig({
      DNA_X402_API_URL: "https://parad0xlabs.com/x402",
      DNA_AGENT_ID: "agent_demo",
      DNA_AGENT_NAME: "Paid Alpha Room",
      [discordApplicationIdEnv]: "put-your-discord-application-id-here",
      [discordPublicKeyEnv]: "put-your-discord-public-key-here",
      [discordTokenEnv]: "put-your-discord-bot-token-here",
      DISCORD_MODE: "public_beta",
    });

    expect(config.agentId).toBe("agent_demo");
    expect(config.agentName).toBe("Paid Alpha Room");
    expect(config.mode).toBe("mock");
    expect(config.features.paidSignals).toBe(true);
    expect(config.features.bounties).toBe(true);
  });

  it("rejects private key shaped environment fields", () => {
    expect(() => assertNoPrivateKeyEnv({ [privateKeyEnv]: "not-allowed" })).toThrow(/must not be provided/);
    expect(() => assertNoPrivateKeyEnv({ [walletPrivateKeyEnv]: "not-allowed" })).toThrow(/must not be provided/);
    expect(() => assertNoPrivateKeyEnv({ [seedPhraseEnv]: "not allowed" })).toThrow(/must not be provided/);
  });

  it("does not print the Discord bot token in startup output", () => {
    const config = loadConfig({
      DNA_AGENT_ID: "agent_demo",
      [discordTokenEnv]: "discord-token-for-test-do-not-print",
    });
    const summary = renderStartupSummary(config);

    expect(summary).not.toContain("discord-token-for-test-do-not-print");
    expect(summary).toContain("local-only");
    expect(summary).toContain("Backend custody: never");
    expect(summary).toContain("Backend signing: never");
  });

  it("handles core slash commands in mock mode", async () => {
    const config = loadConfig({
      DNA_AGENT_ID: "agent_demo",
      DNA_AGENT_NAME: "Discord Alpha Room",
      [discordTokenEnv]: "put-your-discord-bot-token-here",
    });

    const start = await handleCommand("start", config);
    const quote = await handleCommand("quote", config);
    const receipt = await handleCommand("receipt", config, { id: "receipt_demo" });
    const lockedSignal = await handleCommand("signal", config);
    const unlockedSignal = await handleCommand("signal", config, { receipt: "receipt_demo" });
    const research = await handleCommand("research", config);
    const bounty = await handleCommand("bounty", config);

    expect(start.content).toContain("Discord Alpha Room");
    expect(quote.content).toContain("DNA x402 quote");
    expect(quote.content).toContain("0.1%");
    expect(receipt.content).toContain("Receipt verified");
    expect(lockedSignal.paidUnlock).toBe(false);
    expect(lockedSignal.content).toContain("Paid signal requires a receipt");
    expect(unlockedSignal.paidUnlock).toBe(true);
    expect(unlockedSignal.content).toContain("Paid Discord signal unlocked");
    expect(research.content).toContain("verify receipt");
    expect(bounty.content).toContain("human review");
  });

  it("handles Discord interactions without requiring live credentials in mock mode", async () => {
    const config = loadConfig({ DNA_AGENT_ID: "agent_demo" });

    await expect(handleInteraction({ type: 1 }, config)).resolves.toEqual({ type: 1 });

    const response = await handleInteraction({
      type: 2,
      data: { name: "signal", options: [{ name: "receipt", value: "receipt_demo" }] },
    }, config);

    expect(response.type).toBe(4);
    expect(response.data?.content).toContain("Paid Discord signal unlocked");
  });

  it("keeps .env.example placeholder-only and private key free", () => {
    const envExample = fs.readFileSync(path.join(launcherRoot, ".env.example"), "utf8");

    expect(envExample).toContain(`${discordTokenEnv}=put-your-discord-bot-token-here`);
    expect(envExample).not.toMatch(/-----BEGIN/);
    expect(envExample).not.toContain(`${privateKeyEnv}=`);
    expect(envExample).not.toContain(`${seedPhraseEnv}=`);
  });

  it("does not add backend custody or backend signing behavior", () => {
    const source = fs.readFileSync(path.join(launcherRoot, "src", "index.ts"), "utf8");

    expect(source).not.toMatch(/sign(Transaction|Message|AndSend)/);
    expect(source).not.toMatch(/storePrivateKey/);
    expect(source).not.toMatch(/custodyWallet/);
  });
});
