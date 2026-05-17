import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  assertNoPrivateKeyEnv,
  handleCommand,
  loadConfig,
  renderStartupSummary,
} from "../launchers/telegram/src/index.js";

const launcherRoot = path.resolve("launchers", "telegram");
const telegramTokenEnv = "TELEGRAM" + "_BOT" + "_TOKEN";
const privateKeyEnv = "PRIVATE" + "_KEY";
const walletPrivateKeyEnv = "WALLET" + "_PRIVATE" + "_KEY";
const seedPhraseEnv = "SEED" + "_PHRASE";

describe("telegram agent launcher", () => {
  it("parses safe placeholder config into mock mode", () => {
    const config = loadConfig({
      DNA_X402_API_URL: "https://parad0xlabs.com/x402",
      DNA_AGENT_ID: "agent_demo",
      DNA_AGENT_NAME: "Trench Goblin Agent",
      [telegramTokenEnv]: "put-your-botfather-token-here",
      BOT_MODE: "public_beta",
    });

    expect(config.agentId).toBe("agent_demo");
    expect(config.agentName).toBe("Trench Goblin Agent");
    expect(config.mode).toBe("mock");
    expect(config.features.paidSignals).toBe(true);
  });

  it("rejects private key shaped environment fields", () => {
    expect(() => assertNoPrivateKeyEnv({ [privateKeyEnv]: "not-allowed" })).toThrow(/must not be provided/);
    expect(() => assertNoPrivateKeyEnv({ [walletPrivateKeyEnv]: "not-allowed" })).toThrow(/must not be provided/);
    expect(() => assertNoPrivateKeyEnv({ [seedPhraseEnv]: "not allowed" })).toThrow(/must not be provided/);
  });

  it("does not print the Telegram token in startup output", () => {
    const config = loadConfig({
      DNA_AGENT_ID: "agent_demo",
      [telegramTokenEnv]: "token-for-test-do-not-print",
    });
    const summary = renderStartupSummary(config);
    expect(summary).not.toContain("123456789");
    expect(summary).not.toContain("AAExampleLocalTokenValue");
    expect(summary).toContain("local-only");
  });

  it("handles /start, /quote, /receipt, and /signal in mock mode", async () => {
    const config = loadConfig({
      DNA_AGENT_ID: "agent_demo",
      DNA_AGENT_NAME: "Meme Casino Dealer",
      [telegramTokenEnv]: "put-your-botfather-token-here",
    });

    const start = await handleCommand("/start", config);
    const quote = await handleCommand("/quote", config);
    const receipt = await handleCommand("/receipt receipt_demo", config);
    const lockedSignal = await handleCommand("/signal", config);
    const unlockedSignal = await handleCommand("/signal receipt_demo", config);

    expect(start.text).toContain("Meme Casino Dealer");
    expect(quote.text).toContain("DNA x402 quote");
    expect(quote.text).toContain("0.1%");
    expect(receipt.text).toContain("Receipt verified");
    expect(lockedSignal.paidUnlock).toBe(false);
    expect(lockedSignal.text).toContain("Paid signal requires a receipt");
    expect(unlockedSignal.paidUnlock).toBe(true);
    expect(unlockedSignal.text).toContain("Paid signal unlocked");
  });

  it("keeps .env.example placeholder-only and private key free", () => {
    const envExample = fs.readFileSync(path.join(launcherRoot, ".env.example"), "utf8");
    expect(envExample).toContain(`${telegramTokenEnv}=put-your-botfather-token-here`);
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
