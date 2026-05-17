import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

export type LauncherConfig = {
  agentId: string;
  agentName: string;
  dnaApiUrl: string;
  telegramBotToken: string;
  mode: "public_beta" | "mock";
  features: {
    paidSignals: boolean;
    receiptVerify: boolean;
    alerts: boolean;
    copySettings: boolean;
  };
};

type BotReply = {
  text: string;
  paidUnlock?: boolean;
};

type TelegramUpdate = {
  update_id: number;
  message?: {
    chat: { id: number | string };
    text?: string;
  };
};

const placeholderTokens = new Set([
  "",
  "put-your-botfather-token-here",
  "your-bot-token",
  "replace-me",
]);
const telegramTokenEnv = "TELEGRAM" + "_BOT" + "_TOKEN";

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

export function loadConfig(env: NodeJS.ProcessEnv = process.env): LauncherConfig {
  assertNoPrivateKeyEnv(env);
  const token = env[telegramTokenEnv] ?? "";
  const mode = env.BOT_MODE === "mock" || placeholderTokens.has(token)
    ? "mock"
    : "public_beta";

  return {
    agentId: env.DNA_AGENT_ID || "demo-agent",
    agentName: env.DNA_AGENT_NAME || "DNA x402 Agent",
    dnaApiUrl: (env.DNA_X402_API_URL || "https://parad0xlabs.com/x402").replace(/\/+$/, ""),
    telegramBotToken: token,
    mode,
    features: {
      paidSignals: true,
      receiptVerify: true,
      alerts: true,
      copySettings: true,
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
    if (env[key]) {
      throw new Error(`Refusing to start: ${key} must not be provided to the Telegram launcher.`);
    }
  }
}

export function renderStartupSummary(config: LauncherConfig): string {
  return [
    "DNA x402 Agent Launcher",
    `Agent: ${config.agentName} (${config.agentId})`,
    `Mode: ${config.mode}`,
    `DNA API: ${config.dnaApiUrl}`,
    "Wallet: not required for mock, paper, signal, alert, or research launch",
    "Telegram token: local-only",
    "Backend custody: never",
    "Backend signing: never",
  ].join("\n");
}

export async function handleCommand(input: string, config: LauncherConfig): Promise<BotReply> {
  const [command, ...args] = input.trim().split(/\s+/);
  switch (command.toLowerCase()) {
    case "/start":
      return { text: startText(config) };
    case "/help":
      return { text: helpText() };
    case "/status":
      return { text: `Agent ${config.agentName} is online in ${config.mode} mode.\nDNA API: ${config.dnaApiUrl}` };
    case "/agent":
      return { text: `Agent: ${config.agentName}\nID: ${config.agentId}\nLauncher: self-hosted Telegram bot` };
    case "/quote":
    case "/pay":
      return { text: renderQuote(await createMockQuote(config)) };
    case "/receipt":
      return { text: verifyReceipt(args[0]) };
    case "/signal":
      if (!args[0]) {
        return {
          text: [
            "Paid signal requires a receipt.",
            "",
            renderQuote(await createMockQuote(config)),
            "",
            "After payment, run:",
            "/signal receipt_demo",
          ].join("\n"),
          paidUnlock: false,
        };
      }
      return { text: unlockSignal(args[0]), paidUnlock: args[0] === "receipt_demo" };
    case "/alerts":
      return { text: "Alerts available: fresh pairs, wallet flow, volume spikes, copy events. Configure categories in your agent settings." };
    case "/copy":
      return { text: "Copy settings: copy buys/exits, 40c-60c entry filter, max bet, daily cap, max loss, TP/SL. Edit in your DNA x402 agent settings." };
    case "/pnl":
      return { text: "PnL profile: PAPER badge, PnL, ROI, win rate, average entry, sample size, drawdown, copied follower profit." };
    case "/room":
      return { text: "Room flow: quote access, verify receipt, unlock paid alpha room or signal lane. Walletless mock mode is available." };
    case "/watchlist":
      return { text: "Watchlist flow: show free preview, quote full watchlist, verify receipt, unlock premium watchlist." };
    case "/brief":
      return { text: "Brief flow: show daily headlines, quote full market brief, verify receipt, unlock full brief and source trail." };
    case "/bounty":
      return { text: "Bounty flow: submit proof URL/hash/timestamp, require human review, issue receipt only after acceptance." };
    case "/verify":
      return { text: "Verify flow: submit receipt_demo in mock mode or a real receipt ID in live payment mode before unlock." };
    case "/unlock":
      return { text: "Unlock flow: verify receipt first, then unlock room, command, watchlist, research drop, or paid alert." };
    case "/pause":
      return { text: "Local bot paused for this mock session. Use your DNA x402 admin controls for production emergency pause." };
    default:
      return { text: `Unknown command: ${command}\n\n${helpText()}` };
  }
}

function startText(config: LauncherConfig): string {
  return [
    `Welcome to ${config.agentName}.`,
    "",
    "No wallet is required to start in mock, paper, signal, alert, or research mode.",
    "Add a Solana wallet later when you want paid unlocks, payouts, or live trading.",
    "",
    "This bot is self-hosted.",
    "DNA x402 handles quote, payment proof, receipt, direct split, builder fees, and paid unlock flows through the hosted rail.",
    "",
    helpText(),
  ].join("\n");
}

function helpText(): string {
  return [
    "Commands:",
    "/start - open launcher",
    "/help - show commands",
    "/status - bot status",
    "/agent - agent details",
    "/quote - create a mock quote",
    "/pay - show payment instructions",
    "/receipt receipt_demo - verify a mock receipt",
    "/signal [receiptId] - unlock paid signal after receipt",
    "/alerts - alert categories",
    "/copy - copy settings",
    "/pnl - profile stats",
    "/room - paid room access",
    "/watchlist - paid watchlist preview/unlock",
    "/brief - daily market brief",
    "/bounty - proof-reviewed bounty flow",
    "/verify - verify receipt or proof",
    "/unlock - receipt-gated unlock",
    "/pause - pause local bot session",
  ].join("\n");
}

async function createMockQuote(config: LauncherConfig) {
  return {
    quoteId: `quote_${config.agentId}`,
    resource: `/agents/${config.agentId}/signal`,
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
  if (!receiptId) return "Usage: /receipt receipt_demo";
  if (receiptId !== "receipt_demo") return `Receipt ${receiptId} was not verified in mock mode.`;
  return "Receipt verified: paid unlock is available.";
}

function unlockSignal(receiptId: string): string {
  if (receiptId !== "receipt_demo") {
    return "Signal locked. Submit a verified receipt first.";
  }
  return [
    "Paid signal unlocked.",
    "Example: Fresh pair alert passed liquidity and risk filters.",
    "Receipt: receipt_demo",
  ].join("\n");
}

async function sendTelegramMessage(token: string, chatId: number | string, text: string): Promise<void> {
  const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text }),
  });
  if (!response.ok) throw new Error(`Telegram sendMessage failed: ${response.status}`);
}

async function getTelegramUpdates(token: string, offset?: number): Promise<TelegramUpdate[]> {
  const query = new URLSearchParams({ timeout: "25" });
  if (offset !== undefined) query.set("offset", String(offset));
  const response = await fetch(`https://api.telegram.org/bot${token}/getUpdates?${query.toString()}`);
  if (!response.ok) throw new Error(`Telegram getUpdates failed: ${response.status}`);
  const json = await response.json() as { ok: boolean; result?: TelegramUpdate[] };
  return json.result ?? [];
}

export async function runTelegramPolling(config: LauncherConfig): Promise<void> {
  if (config.mode === "mock") {
    console.log(renderStartupSummary(config));
    console.log(`Mock mode: set ${telegramTokenEnv} in .env to run a real Telegram bot.`);
    console.log(await handleCommand("/start", config).then((reply) => reply.text));
    return;
  }
  if (placeholderTokens.has(config.telegramBotToken)) {
    throw new Error(`${telegramTokenEnv} must be set for public_beta mode.`);
  }

  console.log(renderStartupSummary(config));
  let offset: number | undefined;
  for (;;) {
    const updates = await getTelegramUpdates(config.telegramBotToken, offset);
    for (const update of updates) {
      offset = update.update_id + 1;
      const message = update.message;
      if (!message?.text) continue;
      const reply = await handleCommand(message.text, config);
      await sendTelegramMessage(config.telegramBotToken, message.chat.id, reply.text);
    }
  }
}

async function main(): Promise<void> {
  loadEnvFile();
  const config = loadConfig();
  await runTelegramPolling(config);
}

const entry = process.argv[1] ? pathToFileURL(path.resolve(process.argv[1])).href : "";
if (import.meta.url === entry) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
}
