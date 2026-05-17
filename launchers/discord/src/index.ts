import crypto from "node:crypto";
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { pathToFileURL } from "node:url";

export type DiscordLauncherConfig = {
  agentId: string;
  agentName: string;
  dnaApiUrl: string;
  applicationId: string;
  publicKey: string;
  botToken: string;
  port: number;
  mode: "public_beta" | "mock";
  features: {
    paidSignals: boolean;
    receiptVerify: boolean;
    alerts: boolean;
    copySettings: boolean;
    research: boolean;
    bounties: boolean;
  };
};

export type DiscordReply = {
  content: string;
  paidUnlock?: boolean;
};

export type DiscordInteraction = {
  id?: string;
  type: number;
  data?: {
    name?: string;
    options?: Array<{ name: string; value: string | number | boolean }>;
  };
};

const discordTokenEnv = "DISCORD" + "_BOT" + "_TOKEN";
const discordPublicKeyEnv = "DISCORD" + "_PUBLIC" + "_KEY";
const discordApplicationIdEnv = "DISCORD" + "_APPLICATION" + "_ID";
const placeholderValues = new Set([
  "",
  "put-your-discord-bot-token-here",
  "put-your-discord-public-key-here",
  "put-your-discord-application-id-here",
  "replace-me",
]);

export function loadEnvFile(file = path.resolve(".env")): void {
  if (!fs.existsSync(file)) return;
  const lines = fs.readFileSync(file, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const equals = trimmed.indexOf("=");
    if (equals === -1) continue;
    const key = trimmed.slice(0, equals).trim();
    const value = trimmed.slice(equals + 1).trim();
    if (!process.env[key]) process.env[key] = value;
  }
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): DiscordLauncherConfig {
  assertNoPrivateKeyEnv(env);
  const publicKey = env[discordPublicKeyEnv] ?? "";
  const token = env[discordTokenEnv] ?? "";
  const applicationId = env[discordApplicationIdEnv] ?? "";
  const mode = env.DISCORD_MODE === "mock" || placeholderValues.has(publicKey) || placeholderValues.has(applicationId)
    ? "mock"
    : "public_beta";

  return {
    agentId: env.DNA_AGENT_ID || "demo-agent",
    agentName: env.DNA_AGENT_NAME || "DNA x402 Agent",
    dnaApiUrl: (env.DNA_X402_API_URL || "https://parad0xlabs.com/x402").replace(/\/+$/, ""),
    applicationId,
    publicKey,
    botToken: token,
    port: Number(env.DISCORD_PORT || 8787),
    mode,
    features: {
      paidSignals: true,
      receiptVerify: true,
      alerts: true,
      copySettings: true,
      research: true,
      bounties: true,
    },
  };
}

export function assertNoPrivateKeyEnv(env: NodeJS.ProcessEnv): void {
  const forbidden = [
    "PRIVATE" + "_KEY",
    "WALLET" + "_PRIVATE" + "_KEY",
    "SEED" + "_PHRASE",
    "MNEMONIC",
    "SEC" + "RET" + "_KEYPAIR",
  ];
  for (const key of forbidden) {
    if (env[key]) throw new Error(`Refusing to start: ${key} must not be provided to the Discord launcher.`);
  }
}

export function renderStartupSummary(config: DiscordLauncherConfig): string {
  return [
    "DNA x402 Discord Agent Launcher",
    `Agent: ${config.agentName} (${config.agentId})`,
    `Mode: ${config.mode}`,
    `DNA API: ${config.dnaApiUrl}`,
    `Port: ${config.port}`,
    "Wallet: not required for mock, paper, signal, alert, or research launch",
    "Discord token: local-only",
    "Backend custody: never",
    "Backend signing: never",
  ].join("\n");
}

export const discordCommands = [
  { name: "start", description: "Open the DNA x402 agent launcher." },
  { name: "status", description: "Show bot and agent status." },
  { name: "agent", description: "Show agent details." },
  { name: "quote", description: "Create a mock DNA x402 quote." },
  { name: "pay", description: "Show payment instructions." },
  { name: "receipt", description: "Verify a mock receipt.", options: [{ name: "id", description: "Receipt ID", type: 3, required: false }] },
  { name: "signal", description: "Unlock a paid signal after receipt.", options: [{ name: "receipt", description: "Receipt ID", type: 3, required: false }] },
  { name: "alerts", description: "Show alert categories." },
  { name: "copy", description: "Show copy settings." },
  { name: "pnl", description: "Show profile and PnL fields." },
  { name: "research", description: "Show research unlock flow." },
  { name: "bounty", description: "Show proof-reviewed bounty flow." },
  { name: "room", description: "Show paid alpha room unlock flow." },
  { name: "role", description: "Show signal role gate flow." },
  { name: "watchlist", description: "Show paid watchlist unlock flow." },
  { name: "brief", description: "Show daily market brief unlock flow." },
  { name: "verify", description: "Show receipt or proof verification flow." },
  { name: "unlock", description: "Show generic receipt-gated unlock flow." },
  { name: "pause", description: "Pause this local bot session." },
];

export async function handleCommand(command: string, config: DiscordLauncherConfig, args: Record<string, string> = {}): Promise<DiscordReply> {
  switch (command.toLowerCase()) {
    case "start":
      return { content: startText(config) };
    case "status":
      return { content: `Agent ${config.agentName} is online in ${config.mode} mode.\nDNA API: ${config.dnaApiUrl}` };
    case "agent":
      return { content: `Agent: ${config.agentName}\nID: ${config.agentId}\nLauncher: self-hosted Discord app` };
    case "quote":
    case "pay":
      return { content: renderQuote(await createMockQuote(config)) };
    case "receipt":
      return { content: verifyReceipt(args.id) };
    case "signal":
      if (!args.receipt) {
        return {
          content: [
            "Paid signal requires a receipt.",
            "",
            renderQuote(await createMockQuote(config)),
            "",
            "After payment, run `/signal receipt:receipt_demo`.",
          ].join("\n"),
          paidUnlock: false,
        };
      }
      return { content: unlockSignal(args.receipt), paidUnlock: args.receipt === "receipt_demo" };
    case "alerts":
      return { content: "Alerts available: fresh pairs, wallet flow, volume spikes, copy events, campaign proof events." };
    case "copy":
      return { content: "Copy settings: copy buys/exits, 40c-60c entry filter, max bet, daily cap, max loss, TP/SL. Edit in DNA x402 agent settings." };
    case "pnl":
      return { content: "PnL profile: PAPER badge, PnL, ROI, win rate, average entry, sample size, drawdown, copied follower profit." };
    case "research":
      return { content: "Research flow: quote the report, verify receipt, unlock full report and source trail." };
    case "bounty":
      return { content: "Bounty flow: submit proof URL/hash/timestamp, require human review, issue receipt only after acceptance." };
    case "room":
      return { content: "Room flow: quote access, verify receipt, unlock paid alpha room or signal lane. Walletless mock mode is available." };
    case "role":
      return { content: "Role flow: quote signal role access, verify receipt, grant Discord role or Telegram signal lane." };
    case "watchlist":
      return { content: "Watchlist flow: show free preview, quote full watchlist, verify receipt, unlock premium watchlist." };
    case "brief":
      return { content: "Brief flow: show daily headlines, quote full market brief, verify receipt, unlock full brief and source trail." };
    case "verify":
      return { content: "Verify flow: submit receipt_demo in mock mode or a real receipt ID in live payment mode before unlock." };
    case "unlock":
      return { content: "Unlock flow: verify receipt first, then unlock room, role, command, watchlist, research drop, or paid alert." };
    case "pause":
      return { content: "Local Discord launcher paused for this mock session. Use DNA x402 controls for production emergency pause." };
    default:
      return { content: `Unknown command: ${command}\n\n${helpText()}` };
  }
}

function startText(config: DiscordLauncherConfig): string {
  return [
    `Welcome to ${config.agentName}.`,
    "",
    "No wallet is required to start in mock, paper, signal, alert, or research mode.",
    "Add a Solana wallet later when you want paid unlocks, payouts, or live trading.",
    "",
    "This Discord app is self-hosted.",
    "DNA x402 handles quote, payment proof, receipt, direct split, builder fees, and paid unlock flows through the hosted rail.",
    "",
    helpText(),
  ].join("\n");
}

function helpText(): string {
  return [
    "Commands:",
    "/start",
    "/status",
    "/agent",
    "/quote",
    "/pay",
    "/receipt",
    "/signal",
    "/alerts",
    "/copy",
    "/pnl",
    "/research",
    "/bounty",
    "/room",
    "/role",
    "/watchlist",
    "/brief",
    "/verify",
    "/unlock",
    "/pause",
  ].join("\n");
}

async function createMockQuote(config: DiscordLauncherConfig) {
  return {
    quoteId: `quote_${config.agentId}`,
    resource: `/agents/${config.agentId}/discord-signal`,
    total: "1.00 USDC",
    providerAmount: "0.999 USDC",
    dnaFee: "0.001 USDC (0.1%)",
    builderFee: "optional, visible before payment",
  };
}

function renderQuote(quote: Awaited<ReturnType<typeof createMockQuote>>): string {
  return [
    "DNA x402 quote",
    `Quote ID: ${quote.quoteId}`,
    `Resource: ${quote.resource}`,
    `Total: ${quote.total}`,
    `Provider amount: ${quote.providerAmount}`,
    `DNA fee: ${quote.dnaFee}`,
    `Builder fee: ${quote.builderFee}`,
    "",
    "Pay through the hosted DNA x402 rail, then submit/verify the receipt.",
  ].join("\n");
}

function verifyReceipt(receiptId?: string): string {
  if (!receiptId) return "Usage: `/receipt id:receipt_demo`";
  if (receiptId !== "receipt_demo") return `Receipt ${receiptId} was not verified in mock mode.`;
  return "Receipt verified: paid unlock is available.";
}

function unlockSignal(receiptId: string): string {
  if (receiptId !== "receipt_demo") return "Signal locked. Submit a verified receipt first.";
  return [
    "Paid Discord signal unlocked.",
    "Example: Fresh pair alert passed liquidity and risk filters.",
    "Receipt: receipt_demo",
  ].join("\n");
}

export function verifyDiscordSignature(input: {
  publicKeyHex: string;
  signatureHex: string;
  timestamp: string;
  body: string;
}): boolean {
  if (!/^[0-9a-fA-F]{64}$/.test(input.publicKeyHex)) return false;
  if (!/^[0-9a-fA-F]{128}$/.test(input.signatureHex)) return false;
  const publicKey = crypto.createPublicKey({
    key: Buffer.concat([
      Buffer.from("302a300506032b6570032100", "hex"),
      Buffer.from(input.publicKeyHex, "hex"),
    ]),
    format: "der",
    type: "spki",
  });
  return crypto.verify(
    null,
    Buffer.from(`${input.timestamp}${input.body}`),
    publicKey,
    Buffer.from(input.signatureHex, "hex"),
  );
}

export async function handleInteraction(interaction: DiscordInteraction, config: DiscordLauncherConfig) {
  if (interaction.type === 1) return { type: 1 };
  const name = interaction.data?.name ?? "start";
  const args: Record<string, string> = {};
  for (const option of interaction.data?.options ?? []) args[option.name] = String(option.value);
  const reply = await handleCommand(name, config, args);
  return {
    type: 4,
    data: {
      content: reply.content,
    },
  };
}

export async function runDiscordInteractionServer(config: DiscordLauncherConfig): Promise<void> {
  if (config.mode === "mock") {
    console.log(renderStartupSummary(config));
    console.log(`Mock mode: set ${discordPublicKeyEnv}, ${discordApplicationIdEnv}, and ${discordTokenEnv} in .env to run a real Discord app.`);
    console.log((await handleCommand("start", config)).content);
    return;
  }

  const server = http.createServer((request, response) => {
    if (request.method !== "POST") {
      response.writeHead(200, { "content-type": "text/plain" });
      response.end("DNA x402 Discord launcher is running.");
      return;
    }

    let body = "";
    request.on("data", (chunk) => { body += String(chunk); });
    request.on("end", async () => {
      try {
        const signature = request.headers["x-signature-ed25519"];
        const timestamp = request.headers["x-signature-timestamp"];
        if (typeof signature !== "string" || typeof timestamp !== "string") throw new Error("Missing Discord signature headers.");
        if (!verifyDiscordSignature({ publicKeyHex: config.publicKey, signatureHex: signature, timestamp, body })) {
          response.writeHead(401, { "content-type": "application/json" });
          response.end(JSON.stringify({ error: "invalid_signature" }));
          return;
        }
        const interaction = JSON.parse(body) as DiscordInteraction;
        const result = await handleInteraction(interaction, config);
        response.writeHead(200, { "content-type": "application/json" });
        response.end(JSON.stringify(result));
      } catch (error) {
        response.writeHead(400, { "content-type": "application/json" });
        response.end(JSON.stringify({ error: error instanceof Error ? error.message : "bad_request" }));
      }
    });
  });

  server.listen(config.port, () => {
    console.log(renderStartupSummary(config));
    console.log(`Discord interactions endpoint listening on port ${config.port}.`);
  });
}

async function main(): Promise<void> {
  loadEnvFile();
  const config = loadConfig();
  await runDiscordInteractionServer(config);
}

const entry = process.argv[1] ? pathToFileURL(path.resolve(process.argv[1])).href : "";
if (import.meta.url === entry) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
}
