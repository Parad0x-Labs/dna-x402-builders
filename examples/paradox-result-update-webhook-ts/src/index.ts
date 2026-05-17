import {
  buildParadoxSignalFeeWaterfall,
  buildSignalReceiptMetadata,
  createSignalUsageEvent,
  requireBuilderSignalLicense,
  type BuilderSignalLicense,
} from "../../../sdk/typescript/src/index.js";

const license: BuilderSignalLicense = {
  builderId: "builder_result_webhook",
  allowedSources: ["PARADOX_SPORTS_BETS_FEED"],
  allowedUsageTypes: ["RESULT_UPDATE", "SETTLEMENT_UPDATE", "WEBHOOK_DELIVERY"],
  resaleAllowed: true,
  attributionRequired: true,
  status: "ACTIVE",
};

requireBuilderSignalLicense({
  license,
  source: "PARADOX_SPORTS_BETS_FEED",
  usageType: "RESULT_UPDATE",
  attribution: "Parad0x Labs",
  includesParadoxFee: true,
  visibleFees: true,
});

const usage = createSignalUsageEvent({
  signalId: "px_sports_result_001",
  source: "PARADOX_SPORTS_BETS_FEED",
  builderId: license.builderId,
  agentId: "result_update_webhook",
  usageType: "RESULT_UPDATE",
  receiptId: "receipt_result_update_demo",
});

const feeWaterfall = buildParadoxSignalFeeWaterfall({
  signalId: usage.signalId,
  source: usage.source,
  usageType: usage.usageType,
  builderId: usage.builderId,
  agentId: usage.agentId,
  buyerTotalAtomic: "21000",
  builderFeeAtomic: "10000",
});

const receiptMetadata = buildSignalReceiptMetadata({
  signalId: usage.signalId,
  signalSource: usage.source,
  builderId: usage.builderId,
  agentId: usage.agentId,
  usageType: usage.usageType,
  sourceAttribution: "Parad0x Labs",
  signalDigest: "sha256:px_sports_result_001",
  resultDigest: "sha256:result_final_demo",
  feeWaterfallHash: feeWaterfall.feeWaterfallHash ?? "missing",
});

console.log(JSON.stringify({
  webhookEvent: "paradox_signal.result_update",
  usage,
  receiptMetadata,
  accepted: true,
}, null, 2));
