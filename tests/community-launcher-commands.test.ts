import { describe, expect, it } from "vitest";
import { handleCommand as handleDiscordCommand, loadConfig as loadDiscordConfig } from "../launchers/discord/src/index.js";
import { handleCommand as handleTelegramCommand, loadConfig as loadTelegramConfig } from "../launchers/telegram/src/index.js";

const telegramTokenEnv = "TELEGRAM" + "_BOT" + "_TOKEN";
const discordApplicationIdEnv = "DISCORD" + "_APPLICATION" + "_ID";
const discordPublicKeyEnv = "DISCORD" + "_PUBLIC" + "_KEY";
const discordTokenEnv = "DISCORD" + "_BOT" + "_TOKEN";

describe("community launcher commands", () => {
  it("adds walletless community commands to Telegram launcher", async () => {
    const config = loadTelegramConfig({
      DNA_AGENT_ID: "community-telegram",
      [telegramTokenEnv]: "put-your-botfather-token-here",
    });

    for (const command of ["/room", "/watchlist", "/brief", "/bounty", "/verify", "/unlock"]) {
      const reply = await handleTelegramCommand(command, config);
      expect(reply.text.length).toBeGreaterThan(20);
      expect(reply.text.toLowerCase()).not.toContain("unknown command");
    }

    expect((await handleTelegramCommand("/room", config)).text).toContain("receipt");
    expect((await handleTelegramCommand("/unlock", config)).text).toContain("unlock");
  });

  it("adds walletless community commands to Discord launcher", async () => {
    const config = loadDiscordConfig({
      DNA_AGENT_ID: "community-discord",
      [discordApplicationIdEnv]: "put-your-discord-application-id-here",
      [discordPublicKeyEnv]: "put-your-discord-public-key-here",
      [discordTokenEnv]: "put-your-discord-bot-token-here",
    });

    for (const command of ["room", "role", "watchlist", "brief", "bounty", "verify", "unlock"]) {
      const reply = await handleDiscordCommand(command, config);
      expect(reply.content.length).toBeGreaterThan(20);
      expect(reply.content.toLowerCase()).not.toContain("unknown command");
    }

    expect((await handleDiscordCommand("role", config)).content).toContain("role");
    expect((await handleDiscordCommand("unlock", config)).content).toContain("unlock");
  });
});
