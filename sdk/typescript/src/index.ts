export type FetchLike = (input: string, init?: RequestInit) => Promise<Response>;

export type DnaX402ClientOptions = {
  baseUrl: string;
  fetch?: FetchLike;
  defaultHeaders?: Record<string, string>;
};

export type QuoteRequest = {
  resource: string;
  amountAtomic: string;
  privacyPath?: PrivacySettlementPath;
  builderId?: string;
  builderFeeBps?: number;
  builderRecipient?: string;
  builderFeeMode?: "display_only" | "builder_accrual";
};

export type QuoteResponse = {
  quoteId: string;
  paymentRequirements?: unknown;
  feeWaterfallV2?: FeeWaterfallV2;
};

export type FeeLine = {
  id: string;
  kind:
    | "PROVIDER_AMOUNT"
    | "DNA_PLATFORM_FEE"
    | "BUILDER_FEE"
    | "AFFILIATE_FEE"
    | "ALPHA_SUCCESS_FEE"
    | "PARADOX_SIGNAL_SOURCE_FEE"
    | "RESULT_UPDATE_FEE";
  label?: string;
  amount: string;
  token?: string;
  recipient?: string;
  recipientType?: string;
  requiredForFinalize?: boolean;
  collectionStatus?: string;
  metadata?: Record<string, unknown>;
};

export type FeeWaterfallV2 = {
  version?: string;
  grossAmount?: string;
  providerAmount?: string;
  totalFees?: string;
  totalBuyerCost?: string;
  feeWaterfallHash?: string;
  lines: FeeLine[];
};

export type CommitResponse = {
  commitId: string;
};

export type PaymentProof = {
  settlement: "transfer" | "x402" | "facilitator";
  txSignature?: string;
  amountAtomic?: string;
  network?: string;
  payload?: unknown;
};

export type SplitPaymentProof = {
  feeLineId: string;
  paymentProof: PaymentProof;
};

export type FinalizeResponse = {
  receiptId: string;
  receipt?: unknown;
  splitPaymentResults?: unknown[];
  darkNullReceipt?: DarkNullReceiptSummary;
};

export type PrivacySettlementPath = "normal" | "dark-null";

export type DarkNullNetwork = "devnet" | "mainnet-beta";

export type DarkNullReceiptRequest = {
  receiptId: string;
  receipt?: unknown;
  network?: DarkNullNetwork;
  mode?: "private_receipt_only" | "proof_bound";
  settlementSignature?: string;
  settlementSlot?: number;
  previousReceiptHash?: string | null;
};

export type DarkNullReceiptSummary = {
  schema: "dna-x402-dark-null-privacy-response-v1";
  status: "created" | "pending" | "rejected";
  network: DarkNullNetwork;
  normalPath: "dna-x402";
  privacyPath: "dark-null";
  receiptId: string;
  dnaReceiptHash: string;
  darkNullReceiptHash?: string;
  manifestLabel?: string;
  replayKey?: string;
  receiptSchema?: string;
  reason?: string;
};

export type AgentBuilderDraftRequest = {
  inputMode: "PROMPT" | "GUIDED" | "TEMPLATE" | "CLONE";
  ownerWallet: string;
  prompt?: string;
  templateId?: string;
  cloneFromAgentId?: string;
  guidedAnswers?: Record<string, unknown>;
};

export type AgentBuilderDraft = {
  status: "DRAFT_CREATED" | "REJECTED" | "REVIEW_REQUIRED";
  draftId?: string;
  reasonCodes: string[];
  explanation: string[];
  riskSummary?: {
    riskLevel: "LOW" | "MEDIUM" | "HIGH" | "OUT_OF_SCOPE";
    realFundsAtRisk: boolean;
    requiresClientSignature: boolean;
    backendCustody: false;
    backendSigning: false;
    warnings: string[];
    requiredConfirmations: string[];
  };
  agentConfig?: unknown;
};

export type AgentWalletRegistration = {
  ownerWallet: string;
  publicKey: string;
  chain: "SOLANA" | "POLYMARKET_POLYGON" | "EVM" | "OTHER";
  keyStorage?: "LOCAL_ENCRYPTED" | "USER_EXPORTED" | "SESSION_ONLY" | "EXTERNAL_WALLET";
  metadata?: Record<string, unknown>;
};

export type CopySettingsInput = {
  followerAgentId: string;
  sourceAgentId: string;
  enabled: boolean;
  mode: "WATCH_ONLY" | "PAPER_COPY" | "USER_CONFIRMED_COPY" | "AUTO_COPY_PUBLIC_BETA";
  copyBuys: boolean;
  copySells: boolean;
  copyExits: boolean;
  minEntryPriceBps?: number;
  maxEntryPriceBps?: number;
  maxBetSizeAtomic: string;
  maxDailySpendAtomic: string;
  maxOpenExposureAtomic: string;
  maxDailyLossAtomic?: string;
  useSourceExitRules?: boolean;
  customTakeProfitBps?: number;
  customStopLossBps?: number;
  requireApprovalAlways?: boolean;
  requireApprovalAboveAtomic?: string;
};

export type AlphaFeeInput = {
  enabled: boolean;
  successFeeBps: 50 | 100 | 150 | 200 | 250 | 300;
  mode: "DISPLAY_ONLY" | "ACCRUAL";
};

export type DegenAgentMode =
  | "WATCH_ONLY"
  | "SIGNAL_ONLY"
  | "USER_CONFIRMED_LIVE"
  | "CAPPED_AUTO_LIVE"
  | "PAPER_SIM";

export type DegenRiskConfig = {
  maxTradeUsd: number;
  maxDailySpendUsd: number;
  maxDailyLossUsd: number;
  maxOpenExposureUsd: number;
  maxSlippageBps: number;
  takeProfitBps?: number;
  stopLossBps?: number;
  maxTradesPerHour?: number;
  allowedTokens?: string[];
  blockedTokens?: string[];
  allowedWalletsToCopy?: string[];
  blockedWalletsToCopy?: string[];
  requireUserConfirmAboveUsd?: number;
  pauseOnDrawdownBps?: number;
};

export type ExecutionVenue =
  | "JUPITER"
  | "RAYDIUM"
  | "PUMPFUN"
  | "CUSTOM_WEBHOOK"
  | "POLYMARKET"
  | "NONE";

export type TradeIntent = {
  intentId: string;
  agentId: string;
  ownerWallet: string;
  venue: ExecutionVenue;
  inputMint?: string;
  outputMint?: string;
  marketId?: string;
  side: "BUY" | "SELL" | "YES" | "NO";
  maxInputAmountAtomic: string;
  minOutputAmountAtomic?: string;
  slippageBps: number;
  mode: DegenAgentMode;
  riskConfigHash: string;
  requiresClientSignature: boolean;
  status:
    | "PROPOSED"
    | "APPROVED"
    | "SIGNED_CLIENT_SIDE"
    | "SUBMITTED"
    | "CONFIRMED"
    | "FAILED"
    | "REJECTED"
    | "CANCELLED";
  createdAt: string;
};

export type DegenSpendState = {
  spentTodayUsd: number;
  lossTodayUsd: number;
  openExposureUsd: number;
  tradesThisHour?: number;
};

export type TradeIntentDraft = Omit<TradeIntent, "intentId" | "riskConfigHash" | "requiresClientSignature" | "status" | "createdAt"> & {
  intentId?: string;
  riskConfig: DegenRiskConfig;
  createdAt?: string;
};

export type DegenExecutionQuote = {
  venue: ExecutionVenue;
  mode: DegenAgentMode;
  intent: TradeIntent;
  quoted: boolean;
  liveSubmitAvailable: boolean;
  riskConfigHash: string;
  receiptMetadata: {
    agentId: string;
    intentId: string;
    venue: ExecutionVenue;
    riskConfigHash: string;
  };
};

export type DegenExecutionSubmitResult =
  | { status: "SUBMIT_SKIPPED"; reason: "MOCK_OR_SIGNAL_ONLY" | "LIVE_GATE_REQUIRED"; intent: TradeIntent }
  | { status: "SUBMITTED"; intent: TradeIntent; proofRequired: true };

export type DegenExecutionAdapter = {
  venue: ExecutionVenue;
  mode: "MOCK" | "QUOTE_ONLY" | "USER_CONFIRMED_LIVE_GATED";
  quote: (draft: TradeIntentDraft) => DegenExecutionQuote;
  submit: (intent: TradeIntent, options?: { liveGateRef?: string; clientSigned?: boolean }) => DegenExecutionSubmitResult;
};

export type AlphaFeeTier =
  | "STANDARD"
  | "DEGEN_ALPHA_ROOM";

export type AlphaFeeConfig = {
  tier: AlphaFeeTier;
  feeBps: 50 | 100 | 150 | 200 | 250 | 300 | 500 | 1000 | 1500 | 2000;
  appliesTo: "POSITIVE_FINALIZED_COPIED_LOT_PNL";
  explicitFollowerConsent: true;
};

export type AgentReferralLink = {
  referralId: string;
  agentId: string;
  ownerWallet: string;
  referralCode: string;
  target:
    | "COPY_AGENT"
    | "JOIN_ROOM"
    | "BUY_SIGNAL"
    | "USE_API"
    | "FOLLOW_PROFILE";
  rewardMode:
    | "FEE_SHARE"
    | "BUILDER_FEE_SHARE"
    | "SOURCE_FEE_SHARE"
    | "NONE";
  rewardBps: number;
  createdAt: string;
};

export type AgentPnlStats = {
  agentId: string;
  mode: "PAPER" | "LIVE" | "MIXED";
  realizedPnlAtomic: string;
  unrealizedPnlAtomic: string;
  roiBps: number;
  winRateBps: number;
  avgEntryPriceBps?: number;
  avgExitPriceBps?: number;
  tradeCount: number;
  copiedFollowerPnlAtomic: string;
  maxDrawdownBps: number;
  sampleSizeBadge: "LOW_SAMPLE" | "MEDIUM_SAMPLE" | "HIGH_SAMPLE";
  proofCount: number;
};

export type AcceptedPaymentAsset =
  | "USDC"
  | "SOL"
  | "TOKEN_ALLOWLISTED";

export type TokenPaymentConfig = {
  mint: string;
  symbol: string;
  riskTier: "BLUE_CHIP" | "NORMAL" | "MEME" | "HIGH_RISK";
  acceptedFor:
    | "SIGNALS"
    | "ROOM_ACCESS"
    | "API_ACCESS"
    | "COPY_FEES";
  conversionMode: "FIXED_PRICE" | "ORACLE" | "MANUAL";
};

export type SignalSource =
  | "PARADOX_SPORTS_BETS_FEED"
  | "PARADOX_POLYMARKET_FEED"
  | "PARADOX_CRYPTO_SIGNAL_FEED"
  | "BUILDER_EXTERNAL_FEED"
  | "MANUAL_USER_SIGNAL";

export type ParadoxSignalSource = Extract<SignalSource,
  | "PARADOX_SPORTS_BETS_FEED"
  | "PARADOX_POLYMARKET_FEED"
  | "PARADOX_CRYPTO_SIGNAL_FEED"
>;

export type SignalUsageType =
  | "SIGNAL_PING"
  | "SIGNAL_WITH_REASONING"
  | "RESULT_UPDATE"
  | "SETTLEMENT_UPDATE"
  | "COPY_INTENT"
  | "DASHBOARD_VIEW"
  | "WEBHOOK_DELIVERY"
  | "TELEGRAM_DELIVERY"
  | "DISCORD_DELIVERY";

export type SignalUsageEvent = {
  usageId: string;
  signalId: string;
  source: ParadoxSignalSource;
  builderId: string;
  agentId: string;
  userId?: string;
  usageType: SignalUsageType;
  createdAt: string;
  receiptId?: string;
};

export type SignalReceiptMetadata = {
  signalId: string;
  signalSource: SignalSource;
  builderId: string;
  agentId: string;
  usageType: SignalUsageType;
  sourceAttribution: "Parad0x Labs";
  signalDigest: string;
  resultDigest?: string;
  feeWaterfallHash: string;
};

export type BuilderSignalLicense = {
  builderId: string;
  allowedSources: SignalSource[];
  allowedUsageTypes: SignalUsageType[];
  resaleAllowed: boolean;
  attributionRequired: boolean;
  maxDailySignals?: number;
  status: "ACTIVE" | "REVIEW_REQUIRED" | "SUSPENDED";
};

export type SignalLicenseCheck = {
  license: BuilderSignalLicense | null;
  source: SignalSource;
  usageType: SignalUsageType;
  attribution: string;
  includesParadoxFee: boolean;
  visibleFees: boolean;
  claimText?: string;
  usageToday?: number;
};

export type ParadoxSignalFeeWaterfallInput = {
  signalId: string;
  source: ParadoxSignalSource;
  usageType: SignalUsageType;
  builderId: string;
  agentId: string;
  buyerTotalAtomic: string;
  builderFeeAtomic?: string;
  dnaFeeAtomic?: string;
  signalSourceFeeAtomic?: string;
  token?: string;
};

export const defaultParadoxSignalPricing = {
  signalPingFeeAtomic: "10000",
  signalReasoningFeeAtomic: "100000",
  signalResultUpdateFeeAtomic: "10000",
  resaleShareBps: 2000,
} as const;

export type WalletlessStartFeature =
  | "paper_agent"
  | "signal_agent"
  | "alert_agent"
  | "research_agent"
  | "data_preview_agent"
  | "telegram_launcher"
  | "discord_launcher"
  | "mock_receipt"
  | "local_dev_example";

export type PaymentWalletContext = {
  walletAddress?: string | null;
  recipientWallet?: string | null;
};

export type AgentTradingWalletContext = {
  agentWalletPublicKey?: string | null;
};

export class DnaX402PolicyError extends Error {
  readonly code:
    | "WALLET_REQUIRED_FOR_PAYMENT"
    | "AGENT_WALLET_REQUIRED"
    | "FEATURE_REQUIRES_REVIEW"
    | "SIGNAL_LICENSE_REQUIRED"
    | "SIGNAL_ATTRIBUTION_REQUIRED"
    | "PARADOX_SIGNAL_FEE_REQUIRED"
    | "HIDDEN_FEE_REJECTED"
    | "GUARANTEED_PROFIT_CLAIM_REJECTED"
    | "SIGNAL_USAGE_CAP_EXCEEDED"
    | "DEGEN_WALLET_REQUIRED"
    | "DEGEN_RISK_CONFIG_REQUIRED"
    | "DEGEN_MAX_TRADE_EXCEEDED"
    | "DEGEN_DAILY_SPEND_EXCEEDED"
    | "DEGEN_DAILY_LOSS_EXCEEDED"
    | "DEGEN_OPEN_EXPOSURE_EXCEEDED"
    | "DEGEN_SLIPPAGE_EXCEEDED"
    | "DEGEN_BACKEND_SIGNING_FORBIDDEN"
    | "DEGEN_BACKEND_CUSTODY_FORBIDDEN"
    | "ALPHA_FOLLOWER_CONSENT_REQUIRED"
    | "ALPHA_FEE_TIER_INVALID"
    | "REFERRAL_LOSS_RAKE_FORBIDDEN"
    | "TOKEN_PAYMENT_ALLOWLIST_REQUIRED"
    | "FAKE_PNL_REJECTED";

  constructor(code: DnaX402PolicyError["code"], message: string) {
    super(message);
    this.name = "DnaX402PolicyError";
    this.code = code;
  }
}

export function assertWalletlessStartAllowed(feature: WalletlessStartFeature): true {
  const allowed: WalletlessStartFeature[] = [
    "paper_agent",
    "signal_agent",
    "alert_agent",
    "research_agent",
    "data_preview_agent",
    "telegram_launcher",
    "discord_launcher",
    "mock_receipt",
    "local_dev_example",
  ];
  if (!allowed.includes(feature)) {
    throw new DnaX402PolicyError("FEATURE_REQUIRES_REVIEW", `${feature} is not available in walletless start.`);
  }
  return true;
}

export function requireWalletForPayment(context: PaymentWalletContext): void {
  if (!context.walletAddress && !context.recipientWallet) {
    throw new DnaX402PolicyError(
      "WALLET_REQUIRED_FOR_PAYMENT",
      "This agent is ready, but payments need a wallet. Connect a wallet to charge users or unlock paid flows.",
    );
  }
}

export function requireAgentWalletForLiveTrading(context: AgentTradingWalletContext): void {
  if (!context.agentWalletPublicKey) {
    throw new DnaX402PolicyError(
      "AGENT_WALLET_REQUIRED",
      "This agent can run signals and alerts without a wallet. Live trading needs a user-owned agent wallet.",
    );
  }
}

export function isParadoxSignalSource(source: SignalSource): source is ParadoxSignalSource {
  return source === "PARADOX_SPORTS_BETS_FEED"
    || source === "PARADOX_POLYMARKET_FEED"
    || source === "PARADOX_CRYPTO_SIGNAL_FEED";
}

export function createSignalUsageEvent(input: Omit<SignalUsageEvent, "usageId" | "createdAt"> & {
  usageId?: string;
  createdAt?: string;
}): SignalUsageEvent {
  return {
    usageId: input.usageId ?? `usage_${input.signalId}_${input.usageType}`.toLowerCase().replace(/[^a-z0-9_]+/g, "_"),
    signalId: input.signalId,
    source: input.source,
    builderId: input.builderId,
    agentId: input.agentId,
    userId: input.userId,
    usageType: input.usageType,
    createdAt: input.createdAt ?? new Date(0).toISOString(),
    receiptId: input.receiptId,
  };
}

export function requireBuilderSignalLicense(check: SignalLicenseCheck): true {
  if (!isParadoxSignalSource(check.source)) return true;
  if (!check.license || check.license.status !== "ACTIVE") {
    throw new DnaX402PolicyError("SIGNAL_LICENSE_REQUIRED", "Parad0x signal sources require an active builder signal license.");
  }
  if (!check.license.allowedSources.includes(check.source) || !check.license.allowedUsageTypes.includes(check.usageType)) {
    throw new DnaX402PolicyError("SIGNAL_LICENSE_REQUIRED", "This builder license does not allow the requested Parad0x signal source or usage type.");
  }
  if (check.license.maxDailySignals !== undefined && (check.usageToday ?? 0) >= check.license.maxDailySignals) {
    throw new DnaX402PolicyError("SIGNAL_USAGE_CAP_EXCEEDED", "Builder signal usage cap reached for this license.");
  }
  if (check.license.attributionRequired && check.attribution !== "Parad0x Labs") {
    throw new DnaX402PolicyError("SIGNAL_ATTRIBUTION_REQUIRED", "Parad0x signal attribution must stay visible.");
  }
  if (!check.includesParadoxFee) {
    throw new DnaX402PolicyError("PARADOX_SIGNAL_FEE_REQUIRED", "Parad0x signal source fee cannot be removed.");
  }
  if (!check.visibleFees) {
    throw new DnaX402PolicyError("HIDDEN_FEE_REJECTED", "Signal resale fees must be visible before payment.");
  }
  if (hasGuaranteedProfitClaim(check.claimText ?? "")) {
    throw new DnaX402PolicyError("GUARANTEED_PROFIT_CLAIM_REJECTED", "Signal resale cannot claim guaranteed profit.");
  }
  return true;
}

export function hasGuaranteedProfitClaim(text: string): boolean {
  const normalized = text.toLowerCase();
  const hasBadClaim = /\b(guaranteed|guarantee|sure[- ]?win|risk[- ]?free profit|100%\s*win)\b/i.test(normalized);
  const isDisclaimer = /\b(no|not|never|without)\s+(guaranteed|guarantee|sure[- ]?win|risk[- ]?free profit|100%\s*win)\b/i.test(normalized)
    || /\b(does not|do not|cannot|can't)\s+(guarantee|promise)\b/i.test(normalized);
  return hasBadClaim && !isDisclaimer;
}

export function buildParadoxSignalFeeWaterfall(input: ParadoxSignalFeeWaterfallInput): FeeWaterfallV2 {
  const token = input.token ?? "USDC";
  const signalSourceFee = input.signalSourceFeeAtomic ?? feeForSignalUsage(input.usageType);
  const dnaFee = input.dnaFeeAtomic ?? "1000";
  const builderFee = input.builderFeeAtomic ?? "0";
  const lines: FeeLine[] = [
    {
      id: "builder_fee",
      kind: "BUILDER_FEE",
      label: "Builder fee",
      amount: builderFee,
      token,
      recipientType: "BUILDER_TREASURY",
      collectionStatus: "ACCRUED_NOT_COLLECTED",
      metadata: { builderId: input.builderId, signalId: input.signalId },
    },
    {
      id: "paradox_signal_source_fee",
      kind: "PARADOX_SIGNAL_SOURCE_FEE",
      label: "Parad0x signal source fee",
      amount: signalSourceFee,
      token,
      recipientType: "PARADOX_SIGNAL_TREASURY",
      requiredForFinalize: true,
      collectionStatus: "COLLECTED_DIRECT_SPLIT",
      metadata: { source: input.source, signalId: input.signalId, usageType: input.usageType },
    },
    {
      id: "dna_platform_fee",
      kind: "DNA_PLATFORM_FEE",
      label: "DNA 0.1% rail fee",
      amount: dnaFee,
      token,
      recipientType: "DNA_TREASURY",
      requiredForFinalize: true,
      collectionStatus: "COLLECTED_DIRECT_SPLIT",
      metadata: { signalId: input.signalId },
    },
  ];
  return {
    version: "fee_waterfall_v2",
    grossAmount: input.buyerTotalAtomic,
    providerAmount: builderFee,
    totalFees: (BigInt(signalSourceFee) + BigInt(dnaFee) + BigInt(builderFee)).toString(),
    totalBuyerCost: input.buyerTotalAtomic,
    feeWaterfallHash: `signal_${input.signalId}_${input.usageType}_${input.source}`,
    lines,
  };
}

export function feeForSignalUsage(usageType: SignalUsageType): string {
  if (usageType === "SIGNAL_WITH_REASONING") return defaultParadoxSignalPricing.signalReasoningFeeAtomic;
  if (usageType === "RESULT_UPDATE" || usageType === "SETTLEMENT_UPDATE") return defaultParadoxSignalPricing.signalResultUpdateFeeAtomic;
  return defaultParadoxSignalPricing.signalPingFeeAtomic;
}

export function buildSignalReceiptMetadata(input: SignalReceiptMetadata): SignalReceiptMetadata {
  if (input.sourceAttribution !== "Parad0x Labs") {
    throw new DnaX402PolicyError("SIGNAL_ATTRIBUTION_REQUIRED", "Parad0x signal receipts must preserve source attribution.");
  }
  if (!input.signalDigest || !input.feeWaterfallHash) {
    throw new Error("Signal receipts require signalDigest and feeWaterfallHash.");
  }
  return input;
}

export function isLiveDegenMode(mode: DegenAgentMode): boolean {
  return mode === "USER_CONFIRMED_LIVE" || mode === "CAPPED_AUTO_LIVE";
}

export function assertDegenRiskConfig(mode: DegenAgentMode, riskConfig?: Partial<DegenRiskConfig>): DegenRiskConfig {
  if (!isLiveDegenMode(mode)) {
    return {
      maxTradeUsd: riskConfig?.maxTradeUsd ?? 0,
      maxDailySpendUsd: riskConfig?.maxDailySpendUsd ?? 0,
      maxDailyLossUsd: riskConfig?.maxDailyLossUsd ?? 0,
      maxOpenExposureUsd: riskConfig?.maxOpenExposureUsd ?? 0,
      maxSlippageBps: riskConfig?.maxSlippageBps ?? 0,
      ...riskConfig,
    };
  }

  const missing = [
    "maxTradeUsd",
    "maxDailySpendUsd",
    "maxDailyLossUsd",
    "maxOpenExposureUsd",
    "maxSlippageBps",
  ].filter((key) => typeof riskConfig?.[key as keyof DegenRiskConfig] !== "number");

  if (missing.length > 0) {
    throw new DnaX402PolicyError(
      "DEGEN_RISK_CONFIG_REQUIRED",
      `Live Degen Mode needs bankroll rules before launch: ${missing.join(", ")}.`,
    );
  }

  return riskConfig as DegenRiskConfig;
}

export function requireWalletForDegenLive(mode: DegenAgentMode, ownerWallet?: string | null): void {
  if (isLiveDegenMode(mode) && !ownerWallet) {
    throw new DnaX402PolicyError(
      "DEGEN_WALLET_REQUIRED",
      "Connect wallet before live Degen Mode. Watch-only, signal, and paper sim can run walletless.",
    );
  }
}

export function assertNoDegenBackendCustodyOrSigning(input: unknown): void {
  assertNoBackendKeyFields(input);
  const text = JSON.stringify(input).toLowerCase();
  if (text.includes('"backendsigning":true')) {
    throw new DnaX402PolicyError("DEGEN_BACKEND_SIGNING_FORBIDDEN", "Degen Mode never allows backend signing.");
  }
  if (text.includes('"backendcustody":true')) {
    throw new DnaX402PolicyError("DEGEN_BACKEND_CUSTODY_FORBIDDEN", "Degen Mode never allows backend custody.");
  }
}

export function hashDegenRiskConfig(config: DegenRiskConfig): string {
  const stable = stableStringify(config);
  let hash = 5381;
  for (let i = 0; i < stable.length; i += 1) {
    hash = ((hash << 5) + hash) ^ stable.charCodeAt(i);
  }
  return `risk_${(hash >>> 0).toString(16).padStart(8, "0")}`;
}

export function createTradeIntent(input: TradeIntentDraft): TradeIntent {
  assertNoDegenBackendCustodyOrSigning(input);
  requireWalletForDegenLive(input.mode, input.ownerWallet);
  const riskConfig = assertDegenRiskConfig(input.mode, input.riskConfig);
  return {
    intentId: input.intentId ?? `intent_${input.agentId}_${input.venue}`.toLowerCase().replace(/[^a-z0-9_]+/g, "_"),
    agentId: input.agentId,
    ownerWallet: input.ownerWallet,
    venue: input.venue,
    inputMint: input.inputMint,
    outputMint: input.outputMint,
    marketId: input.marketId,
    side: input.side,
    maxInputAmountAtomic: input.maxInputAmountAtomic,
    minOutputAmountAtomic: input.minOutputAmountAtomic,
    slippageBps: input.slippageBps,
    mode: input.mode,
    riskConfigHash: hashDegenRiskConfig(riskConfig),
    requiresClientSignature: isLiveDegenMode(input.mode),
    status: "PROPOSED",
    createdAt: input.createdAt ?? new Date(0).toISOString(),
  };
}

export function validateTradeIntentAgainstRisk(
  intent: TradeIntent,
  riskConfig: DegenRiskConfig,
  state: DegenSpendState = { spentTodayUsd: 0, lossTodayUsd: 0, openExposureUsd: 0 },
): true {
  const amountUsd = Number(BigInt(intent.maxInputAmountAtomic)) / 1_000_000;
  if (amountUsd > riskConfig.maxTradeUsd) {
    throw new DnaX402PolicyError("DEGEN_MAX_TRADE_EXCEEDED", "Trade exceeds ape budget per intent.");
  }
  if (state.spentTodayUsd + amountUsd > riskConfig.maxDailySpendUsd) {
    throw new DnaX402PolicyError("DEGEN_DAILY_SPEND_EXCEEDED", "Trade exceeds daily bankroll rule.");
  }
  if (state.lossTodayUsd > riskConfig.maxDailyLossUsd) {
    throw new DnaX402PolicyError("DEGEN_DAILY_LOSS_EXCEEDED", "Kill switch is active after daily max pain.");
  }
  if (state.openExposureUsd + amountUsd > riskConfig.maxOpenExposureUsd) {
    throw new DnaX402PolicyError("DEGEN_OPEN_EXPOSURE_EXCEEDED", "Trade exceeds open exposure max pain.");
  }
  if (intent.slippageBps > riskConfig.maxSlippageBps) {
    throw new DnaX402PolicyError("DEGEN_SLIPPAGE_EXCEEDED", "Trade exceeds slippage bankroll rule.");
  }
  if (riskConfig.maxTradesPerHour !== undefined && (state.tradesThisHour ?? 0) >= riskConfig.maxTradesPerHour) {
    throw new DnaX402PolicyError("DEGEN_RISK_CONFIG_REQUIRED", "Trade count kill switch is active for this hour.");
  }
  return true;
}

export function createDegenExecutionAdapter(venue: ExecutionVenue, mode: DegenExecutionAdapter["mode"] = "MOCK"): DegenExecutionAdapter {
  return {
    venue,
    mode,
    quote: (draft) => {
      const intent = createTradeIntent({ ...draft, venue });
      return {
        venue,
        mode: intent.mode,
        intent,
        quoted: true,
        liveSubmitAvailable: mode === "USER_CONFIRMED_LIVE_GATED",
        riskConfigHash: intent.riskConfigHash,
        receiptMetadata: {
          agentId: intent.agentId,
          intentId: intent.intentId,
          venue,
          riskConfigHash: intent.riskConfigHash,
        },
      };
    },
    submit: (intent, options) => {
      if (mode !== "USER_CONFIRMED_LIVE_GATED" || !options?.liveGateRef || !options.clientSigned) {
        return {
          status: "SUBMIT_SKIPPED",
          reason: mode === "MOCK" ? "MOCK_OR_SIGNAL_ONLY" : "LIVE_GATE_REQUIRED",
          intent: { ...intent, status: "REJECTED" },
        };
      }
      return {
        status: "SUBMITTED",
        intent: { ...intent, status: "SUBMITTED" },
        proofRequired: true,
      };
    },
  };
}

export function validateAlphaFeeConfig(config: AlphaFeeConfig): true {
  if (config.appliesTo !== "POSITIVE_FINALIZED_COPIED_LOT_PNL") {
    throw new DnaX402PolicyError("ALPHA_FEE_TIER_INVALID", "Alpha fees apply only to positive finalized copied-lot PnL.");
  }
  if (config.explicitFollowerConsent !== true) {
    throw new DnaX402PolicyError("ALPHA_FOLLOWER_CONSENT_REQUIRED", "Degen alpha fees require explicit follower consent.");
  }
  const standard = [50, 100, 150, 200, 250, 300];
  const degen = [500, 1000, 1500, 2000];
  if (config.tier === "STANDARD" && !standard.includes(config.feeBps)) {
    throw new DnaX402PolicyError("ALPHA_FEE_TIER_INVALID", "STANDARD alpha fee tier is 0.5% to 3%.");
  }
  if (config.tier === "DEGEN_ALPHA_ROOM" && !degen.includes(config.feeBps)) {
    throw new DnaX402PolicyError("ALPHA_FEE_TIER_INVALID", "DEGEN_ALPHA_ROOM fee tier is 5% to 20% with consent.");
  }
  return true;
}

export function calculateAlphaFeeAtomic(config: AlphaFeeConfig, finalizedCopiedLotPnlAtomic: string): string {
  validateAlphaFeeConfig(config);
  const pnl = BigInt(finalizedCopiedLotPnlAtomic);
  if (pnl <= 0n) return "0";
  return (pnl * BigInt(config.feeBps) / 10000n).toString();
}

export function createAgentReferralLink(input: Omit<AgentReferralLink, "referralId" | "createdAt"> & {
  referralId?: string;
  createdAt?: string;
  lossRakeDefault?: boolean;
}): AgentReferralLink {
  if (input.lossRakeDefault) {
    throw new DnaX402PolicyError("REFERRAL_LOSS_RAKE_FORBIDDEN", "Referral rewards cannot default to rake on follower losses.");
  }
  return {
    referralId: input.referralId ?? `ref_${input.agentId}_${input.referralCode}`.toLowerCase().replace(/[^a-z0-9_]+/g, "_"),
    agentId: input.agentId,
    ownerWallet: input.ownerWallet,
    referralCode: input.referralCode,
    target: input.target,
    rewardMode: input.rewardMode,
    rewardBps: input.rewardBps,
    createdAt: input.createdAt ?? new Date(0).toISOString(),
  };
}

export function classifySampleSize(tradeCount: number): AgentPnlStats["sampleSizeBadge"] {
  if (tradeCount < 20) return "LOW_SAMPLE";
  if (tradeCount < 100) return "MEDIUM_SAMPLE";
  return "HIGH_SAMPLE";
}

export function leaderboardWarnings(stats: AgentPnlStats): string[] {
  const warnings: string[] = [];
  if (stats.mode === "PAPER") warnings.push("PAPER_ONLY");
  if (stats.sampleSizeBadge === "LOW_SAMPLE") warnings.push("LOW_SAMPLE_SIZE");
  if ((stats.avgEntryPriceBps ?? 0) >= 9000) warnings.push("HIGH_AVG_ENTRY");
  if (stats.maxDrawdownBps >= 2500) warnings.push("HIGH_DRAWDOWN");
  return warnings;
}

export function validateTokenPaymentConfig(config: TokenPaymentConfig, allowlistedMints: string[] = []): true {
  if (config.riskTier === "HIGH_RISK" || config.riskTier === "MEME") {
    if (!allowlistedMints.includes(config.mint)) {
      throw new DnaX402PolicyError("TOKEN_PAYMENT_ALLOWLIST_REQUIRED", "Meme and high-risk token payments require an explicit allowlist.");
    }
  }
  return true;
}

export function assertNoFakePnlOrProfitClaims(text: string): true {
  if (hasGuaranteedProfitClaim(text) || /\bfake\s+pnl\b/i.test(text)) {
    throw new DnaX402PolicyError("FAKE_PNL_REJECTED", "Degen Mode cannot publish guaranteed-profit or fake-PnL claims.");
  }
  return true;
}

function stableStringify(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
  if (value && typeof value === "object") {
    return `{${Object.keys(value as Record<string, unknown>).sort().map((key) => `${JSON.stringify(key)}:${stableStringify((value as Record<string, unknown>)[key])}`).join(",")}}`;
  }
  return JSON.stringify(value);
}

export class DnaX402Client {
  private readonly baseUrl: string;
  private readonly fetchImpl: FetchLike;
  private readonly defaultHeaders: Record<string, string>;

  constructor(options: DnaX402ClientOptions) {
    this.baseUrl = options.baseUrl.replace(/\/+$/, "");
    this.fetchImpl = options.fetch ?? fetch;
    this.defaultHeaders = options.defaultHeaders ?? {};
  }

  async health(): Promise<unknown> {
    return this.getJson("/health");
  }

  async searchListings(params: Record<string, string | number | boolean>): Promise<unknown> {
    const query = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) query.set(key, String(value));
    return this.getJson(`/market/search?${query.toString()}`);
  }

  async quote(input: QuoteRequest): Promise<QuoteResponse> {
    const query = new URLSearchParams();
    query.set("resource", input.resource);
    query.set("amountAtomic", input.amountAtomic);
    if (input.privacyPath) query.set("privacyPath", input.privacyPath);
    if (input.builderId) query.set("builderId", input.builderId);
    if (input.builderFeeBps !== undefined) query.set("builderFeeBps", String(input.builderFeeBps));
    if (input.builderRecipient) query.set("builderRecipient", input.builderRecipient);
    if (input.builderFeeMode) query.set("builderFeeMode", input.builderFeeMode);
    return this.getJson(`/quote?${query.toString()}`) as Promise<QuoteResponse>;
  }

  async commit(quoteId: string, payerCommitment32B: string): Promise<CommitResponse> {
    return this.postJson("/commit", { quoteId, payerCommitment32B }) as Promise<CommitResponse>;
  }

  async finalize(commitId: string, paymentProof: PaymentProof): Promise<FinalizeResponse> {
    return this.postJson("/finalize", { commitId, paymentProof }) as Promise<FinalizeResponse>;
  }

  async finalizeDirectSplit(commitId: string, splitPaymentProofs: SplitPaymentProof[]): Promise<FinalizeResponse> {
    return this.postJson("/finalize", { commitId, splitPaymentProofs }) as Promise<FinalizeResponse>;
  }

  async receipt(receiptId: string): Promise<unknown> {
    return this.getJson(`/receipt/${encodeURIComponent(receiptId)}`);
  }

  async requestDarkNullReceipt(input: DarkNullReceiptRequest): Promise<DarkNullReceiptSummary> {
    return this.postJson("/v1/privacy/dark-null/receipts", input) as Promise<DarkNullReceiptSummary>;
  }

  async darkNullReceipt(receiptHash: string): Promise<DarkNullReceiptSummary> {
    return this.getJson(`/v1/privacy/dark-null/receipts/${encodeURIComponent(receiptHash)}`) as Promise<DarkNullReceiptSummary>;
  }

  async createAgentDraft(input: AgentBuilderDraftRequest): Promise<AgentBuilderDraft> {
    return this.postJson("/v1/agent-builder/draft", input) as Promise<AgentBuilderDraft>;
  }

  async confirmAgentDraft(draftId: string, confirmations: string[]): Promise<unknown> {
    return this.postJson(`/v1/agent-builder/drafts/${encodeURIComponent(draftId)}/confirm`, { confirmations });
  }

  async registerAgentWalletPublicKey(agentId: string, input: AgentWalletRegistration): Promise<unknown> {
    assertNoBackendKeyFields(input);
    return this.postJson(`/v1/agents/${encodeURIComponent(agentId)}/wallets/register`, input);
  }

  async createPaperAgent(agentId: string): Promise<unknown> {
    return this.postJson(`/v1/agents/${encodeURIComponent(agentId)}/paper-account`, {});
  }

  async setCopySettings(input: CopySettingsInput): Promise<unknown> {
    return this.postJson("/v1/copy/settings", input);
  }

  async setAlphaFee(agentId: string, input: AlphaFeeInput): Promise<unknown> {
    return this.postJson(`/v1/agents/${encodeURIComponent(agentId)}/monetization`, {
      ...input,
      appliesTo: "POSITIVE_FINALIZED_COPIED_LOT_PNL",
    });
  }

  async finalizeCopiedLot(copiedLotId: string, realizedPnlAtomic: string): Promise<unknown> {
    return this.postJson(`/v1/copy/lots/${encodeURIComponent(copiedLotId)}/finalize`, { realizedPnlAtomic });
  }

  inspectFeeWaterfall(quote: QuoteResponse): {
    provider?: FeeLine;
    dnaPlatformFee?: FeeLine;
    builderFee?: FeeLine;
    paradoxSignalSourceFee?: FeeLine;
    requiredProofs: FeeLine[];
  } {
    const lines = quote.feeWaterfallV2?.lines ?? [];
    return {
      provider: lines.find((line) => line.kind === "PROVIDER_AMOUNT"),
      dnaPlatformFee: lines.find((line) => line.kind === "DNA_PLATFORM_FEE"),
      builderFee: lines.find((line) => line.kind === "BUILDER_FEE"),
      paradoxSignalSourceFee: lines.find((line) => line.kind === "PARADOX_SIGNAL_SOURCE_FEE"),
      requiredProofs: lines.filter((line) => line.requiredForFinalize),
    };
  }

  requiredSplitLines(quote: QuoteResponse): FeeLine[] {
    return quote.feeWaterfallV2?.lines.filter((line) => line.requiredForFinalize) ?? [];
  }

  private async getJson(path: string): Promise<unknown> {
    const response = await this.fetchImpl(`${this.baseUrl}${path}`, {
      headers: this.defaultHeaders,
    });
    return parseJsonResponse(response);
  }

  private async postJson(path: string, body: unknown): Promise<unknown> {
    const response = await this.fetchImpl(`${this.baseUrl}${path}`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        ...this.defaultHeaders,
      },
      body: JSON.stringify(body),
    });
    return parseJsonResponse(response);
  }
}

export async function parseJsonResponse(response: Response): Promise<unknown> {
  const text = await response.text();
  const json = text ? JSON.parse(text) : {};
  if (!response.ok) {
    const error = new Error(`DNA x402 request failed: ${response.status}`);
    Object.assign(error, { status: response.status, body: json });
    throw error;
  }
  return json;
}

export function makeCommitment(seed = cryptoRandom()): string {
  const clean = Buffer.from(seed).toString("hex").slice(0, 64).padEnd(64, "0");
  return `0x${clean}`;
}

function cryptoRandom(): string {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function assertNoBackendKeyFields(input: unknown): void {
  const text = JSON.stringify(input).toLowerCase();
  for (const marker of ["privatekey", "private_key", "seedphrase", "seed_phrase", "mnemonic", "secretkey", "secret_key"]) {
    if (text.includes(marker)) {
      throw new Error(`Forbidden backend key field detected: ${marker}`);
    }
  }
}
