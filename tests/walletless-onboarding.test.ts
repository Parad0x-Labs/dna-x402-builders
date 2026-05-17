import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  assertNoBackendKeyFields,
  assertWalletlessStartAllowed,
  DnaX402Client,
  DnaX402PolicyError,
  requireAgentWalletForLiveTrading,
  requireWalletForPayment,
} from "../sdk/typescript/src/index.js";
import { loadConfig as loadDiscordConfig, renderStartupSummary as renderDiscordStartup } from "../launchers/discord/src/index.js";
import { loadConfig as loadTelegramConfig, renderStartupSummary as renderTelegramStartup } from "../launchers/telegram/src/index.js";

const root = path.resolve(".");
const telegramTokenEnv = "TELEGRAM" + "_BOT" + "_TOKEN";
const discordApplicationIdEnv = "DISCORD" + "_APPLICATION" + "_ID";
const discordPublicKeyEnv = "DISCORD" + "_PUBLIC" + "_KEY";
const discordTokenEnv = "DISCORD" + "_BOT" + "_TOKEN";

describe("walletless agent onboarding", () => {
  it("boots the Telegram launcher in walletless mock mode", () => {
    const config = loadTelegramConfig({
      DNA_AGENT_ID: "walletless-telegram",
      DNA_AGENT_NAME: "Walletless Signal Bot",
      [telegramTokenEnv]: "put-your-botfather-token-here",
    });
    const summary = renderTelegramStartup(config);

    expect(config.mode).toBe("mock");
    expect(summary).toContain("Wallet: not required");
    expect(summary).toContain("Backend custody: never");
    expect(summary).toContain("Backend signing: never");
  });

  it("boots the Discord launcher in walletless mock mode", () => {
    const config = loadDiscordConfig({
      DNA_AGENT_ID: "walletless-discord",
      DNA_AGENT_NAME: "Walletless Research Bot",
      [discordApplicationIdEnv]: "put-your-discord-application-id-here",
      [discordPublicKeyEnv]: "put-your-discord-public-key-here",
      [discordTokenEnv]: "put-your-discord-bot-token-here",
    });
    const summary = renderDiscordStartup(config);

    expect(config.mode).toBe("mock");
    expect(summary).toContain("Wallet: not required");
    expect(summary).toContain("Backend custody: never");
    expect(summary).toContain("Backend signing: never");
  });

  it("creates a paper agent without a wallet field", async () => {
    const requests: Array<{ url: string; body: string | undefined }> = [];
    const dna = new DnaX402Client({
      baseUrl: "https://parad0xlabs.com/x402",
      fetch: async (url, init) => {
        requests.push({ url, body: typeof init?.body === "string" ? init.body : undefined });
        return new Response(JSON.stringify({
          agentId: "paper-walletless",
          startingBalanceAtomic: "10000000000",
          badge: "PAPER",
        }), { status: 200 });
      },
    });

    await expect(dna.createPaperAgent("paper-walletless")).resolves.toMatchObject({
      agentId: "paper-walletless",
      badge: "PAPER",
    });
    expect(requests[0]?.url).toContain("/paper-account");
    expect(requests[0]?.body).toBe("{}");
  });

  it("allows signal, alert, and research templates without a wallet", () => {
    for (const templateFile of [
      path.join(root, "templates", "agents", "meme-casino", "telegram-signal-tollbooth.json"),
      path.join(root, "templates", "agents", "alerts", "alert-agent.json"),
      path.join(root, "templates", "agents", "research", "research-agent.json"),
    ]) {
      const template = JSON.parse(fs.readFileSync(templateFile, "utf8")) as {
        walletModel: string;
        category: string;
      };
      expect(template.walletModel).toBe("NONE_REQUIRED");
    }

    expect(assertWalletlessStartAllowed("signal_agent")).toBe(true);
    expect(assertWalletlessStartAllowed("alert_agent")).toBe(true);
    expect(assertWalletlessStartAllowed("research_agent")).toBe(true);
  });

  it("fails real payment setup with WALLET_REQUIRED_FOR_PAYMENT", () => {
    expect(() => requireWalletForPayment({})).toThrow(DnaX402PolicyError);
    try {
      requireWalletForPayment({});
      throw new Error("expected wallet requirement to fail");
    } catch (error) {
      expect(error).toBeInstanceOf(DnaX402PolicyError);
      expect((error as DnaX402PolicyError).code).toBe("WALLET_REQUIRED_FOR_PAYMENT");
    }

    expect(() => requireWalletForPayment({ walletAddress: "So1anaWalletDemo111111111111111111111111111" })).not.toThrow();
  });

  it("fails live trading setup with AGENT_WALLET_REQUIRED", () => {
    expect(() => requireAgentWalletForLiveTrading({})).toThrow(DnaX402PolicyError);
    try {
      requireAgentWalletForLiveTrading({});
      throw new Error("expected agent wallet requirement to fail");
    } catch (error) {
      expect(error).toBeInstanceOf(DnaX402PolicyError);
      expect((error as DnaX402PolicyError).code).toBe("AGENT_WALLET_REQUIRED");
    }

    expect(() => requireAgentWalletForLiveTrading({ agentWalletPublicKey: "AgentWalletDemo11111111111111111111111111111" })).not.toThrow();
  });

  it("still rejects backend private key material", () => {
    expect(() => assertNoBackendKeyFields({ private_key: "never" })).toThrow(/Forbidden backend key field/);
    expect(() => assertNoBackendKeyFields({ seedPhrase: "never" })).toThrow(/Forbidden backend key field/);
    expect(() => assertNoBackendKeyFields({ publicKey: "ok" })).not.toThrow();
  });
});
