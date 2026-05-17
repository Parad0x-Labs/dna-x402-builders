import {
  buildParadoxSignalFeeWaterfall,
  buildSignalReceiptMetadata,
  createSignalUsageEvent,
  requireBuilderSignalLicense,
  type BuilderSignalLicense,
} from "../../../sdk/typescript/src/index.js";

const license: BuilderSignalLicense = {
  builderId: "builder_alpha_bot",
  allowedSources: ["PARADOX_POLYMARKET_FEED"],
  allowedUsageTypes: ["SIGNAL_WITH_REASONING", "DASHBOARD_VIEW", "TELEGRAM_DELIVERY"],
  resaleAllowed: true,
  attributionRequired: true,
  maxDailySignals: 100,
  status: "ACTIVE",
};

requireBuilderSignalLicense({
  license,
  source: "PARADOX_POLYMARKET_FEED",
  usageType: "SIGNAL_WITH_REASONING",
  attribution: "Parad0x Labs",
  includesParadoxFee: true,
  visibleFees: true,
  claimText: "Paid signal with visible source attribution.",
  usageToday: 3,
});

const usage = createSignalUsageEvent({
  signalId: "px_poly_btc_5m_001",
  source: "PARADOX_POLYMARKET_FEED",
  builderId: license.builderId,
  agentId: "btc_5m_reasoning_bot",
  usageType: "SIGNAL_WITH_REASONING",
  receiptId: "receipt_signal_resale_demo",
  createdAt: "2026-05-17T00:00:00.000Z",
});

const feeWaterfall = buildParadoxSignalFeeWaterfall({
  signalId: usage.signalId,
  source: usage.source,
  usageType: usage.usageType,
  builderId: usage.builderId,
  agentId: usage.agentId,
  buyerTotalAtomic: "151000",
  builderFeeAtomic: "50000",
});

const receiptMetadata = buildSignalReceiptMetadata({
  signalId: usage.signalId,
  signalSource: usage.source,
  builderId: usage.builderId,
  agentId: usage.agentId,
  usageType: usage.usageType,
  sourceAttribution: "Parad0x Labs",
  signalDigest: "sha256:px_poly_btc_5m_001",
  feeWaterfallHash: feeWaterfall.feeWaterfallHash ?? "missing",
});

console.log(JSON.stringify({
  usage,
  feeLines: feeWaterfall.lines.map((line) => ({ kind: line.kind, amount: line.amount, label: line.label })),
  receiptMetadata,
}, null, 2));
