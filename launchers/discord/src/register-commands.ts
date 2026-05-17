import { discordCommands, loadConfig, loadEnvFile } from "./index.js";

const discordTokenEnv = "DISCORD" + "_BOT" + "_TOKEN";

async function main(): Promise<void> {
  loadEnvFile();
  const config = loadConfig();
  if (config.mode === "mock" || !config.botToken || !config.applicationId) {
    console.log("Mock command registration.");
    console.log("Set Discord application ID and bot token locally to register slash commands.");
    console.log(JSON.stringify(discordCommands, null, 2));
    return;
  }

  const response = await fetch(`https://discord.com/api/v10/applications/${config.applicationId}/commands`, {
    method: "PUT",
    headers: {
      authorization: `Bot ${config.botToken}`,
      "content-type": "application/json",
    },
    body: JSON.stringify(discordCommands),
  });
  if (!response.ok) throw new Error(`Discord command registration failed: ${response.status}`);
  console.log(`Registered ${discordCommands.length} commands for application ${config.applicationId}.`);
  console.log(`${discordTokenEnv}: local-only`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
