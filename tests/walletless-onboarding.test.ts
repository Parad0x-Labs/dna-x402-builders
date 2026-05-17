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
import { handleCommand as handleDiscordCommand, loadConfig as loadDiscordConfig, renderStartupSummary as renderDiscordStartup } from "../launchers/discord/src/index.js";
import { handleCommand as handleTelegramCommand, loadConfig as loadTelegramConfig, renderStartupSummary as renderTelegramStartup } from "../launchers/telegram/src/index.js";

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
    expect(summary).toContain("Walletless mode is ready");
    expect(summary).toContain("signals, alerts, research");
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
    expect(summary).toContain("Walletless mode is ready");
    expect(summary).toContain("signals, alerts, research");
    expect(summary).toContain("Backend custody: never");
    expect(summary).toContain("Backend signing: never");
  });

  it("launcher start copy says launch first, wallet later", async () => {
    const telegramConfig = loadTelegramConfig({
      DNA_AGENT_ID: "walletless-telegram",
      DNA_AGENT_NAME: "Walletless Signal Bot",
      [telegramTokenEnv]: "put-your-botfather-token-here",
    });
    const discordConfig = loadDiscordConfig({
      DNA_AGENT_ID: "walletless-discord",
      DNA_AGENT_NAME: "Walletless Research Bot",
      [discordApplicationIdEnv]: "put-your-discord-application-id-here",
      [discordPublicKeyEnv]: "put-your-discord-public-key-here",
      [discordTokenEnv]: "put-your-discord-bot-token-here",
    });

    await expect(handleTelegramCommand("/start", telegramConfig)).resolves.toMatchObject({
      text: expect.stringContaining("Walletless mode is ready"),
    });
    await expect(handleDiscordCommand("start", discordConfig)).resolves.toMatchObject({
      content: expect.stringContaining("signals, alerts, research"),
    });
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
      expect((error as DnaX402PolicyError).message).toBe("This agent is ready, but payments need a wallet. Connect a wallet to charge users or unlock paid flows.");
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
      expect((error as DnaX402PolicyError).message).toBe("This agent can run signals and alerts without a wallet. Live trading needs a user-owned agent wallet.");
    }

    expect(() => requireAgentWalletForLiveTrading({ agentWalletPublicKey: "AgentWalletDemo11111111111111111111111111111" })).not.toThrow();
  });

  it("still rejects backend private key material", () => {
    expect(() => assertNoBackendKeyFields({ private_key: "never" })).toThrow(/Forbidden backend key field/);
    expect(() => assertNoBackendKeyFields({ seedPhrase: "never" })).toThrow(/Forbidden backend key field/);
    expect(() => assertNoBackendKeyFields({ publicKey: "ok" })).not.toThrow();
  });

  it("keeps public walletless docs launch-first instead of paper-first", () => {
    const readme = fs.readFileSync(path.join(root, "README.md"), "utf8");
    const walletlessDoc = fs.readFileSync(path.join(root, "docs", "WALLETLESS_START.md"), "utf8");

    expect(readme).toContain("## No Wallet? Launch Anyway.");
    expect(readme).toContain("Build first. Plug in payments later.");
    expect(walletlessDoc.startsWith("# Launch Agents Without A Wallet")).toBe(true);
    expect(walletlessDoc.slice(0, 500).toLowerCase()).not.toContain("paper agent");
  });
});
