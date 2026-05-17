import {
  buildParadoxSignalFeeWaterfall,
  createSignalUsageEvent,
  requireBuilderSignalLicense,
  type BuilderSignalLicense,
} from "../../../sdk/typescript/src/index.js";

const license: BuilderSignalLicense = {
  builderId: "builder_dashboard",
  allowedSources: ["PARADOX_CRYPTO_SIGNAL_FEED"],
  allowedUsageTypes: ["DASHBOARD_VIEW", "SIGNAL_PING", "SIGNAL_WITH_REASONING"],
  resaleAllowed: true,
  attributionRequired: true,
  status: "ACTIVE",
};

requireBuilderSignalLicense({
  license,
  source: "PARADOX_CRYPTO_SIGNAL_FEED",
  usageType: "DASHBOARD_VIEW",
  attribution: "Parad0x Labs",
  includesParadoxFee: true,
  visibleFees: true,
});

const usage = createSignalUsageEvent({
  signalId: "px_crypto_sol_001",
  source: "PARADOX_CRYPTO_SIGNAL_FEED",
  builderId: license.builderId,
  agentId: "crypto_signal_dashboard",
  usageType: "DASHBOARD_VIEW",
  receiptId: "receipt_dashboard_demo",
});

const feeWaterfall = buildParadoxSignalFeeWaterfall({
  signalId: usage.signalId,
  source: usage.source,
  usageType: usage.usageType,
  builderId: usage.builderId,
  agentId: usage.agentId,
  buyerTotalAtomic: "31000",
  builderFeeAtomic: "20000",
});

console.log(JSON.stringify({
  dashboardUnlock: true,
  attribution: "Parad0x Labs",
  usageType: usage.usageType,
  feeWaterfallHash: feeWaterfall.feeWaterfallHash,
}, null, 2));
