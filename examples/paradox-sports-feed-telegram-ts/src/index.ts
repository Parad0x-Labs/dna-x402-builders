import {
  buildParadoxSignalFeeWaterfall,
  createSignalUsageEvent,
  requireBuilderSignalLicense,
  type BuilderSignalLicense,
} from "../../../sdk/typescript/src/index.js";

const license: BuilderSignalLicense = {
  builderId: "builder_sports_room",
  allowedSources: ["PARADOX_SPORTS_BETS_FEED"],
  allowedUsageTypes: ["SIGNAL_PING", "TELEGRAM_DELIVERY", "RESULT_UPDATE"],
  resaleAllowed: true,
  attributionRequired: true,
  status: "ACTIVE",
};

requireBuilderSignalLicense({
  license,
  source: "PARADOX_SPORTS_BETS_FEED",
  usageType: "TELEGRAM_DELIVERY",
  attribution: "Parad0x Labs",
  includesParadoxFee: true,
  visibleFees: true,
  claimText: "Sports signal delivery with transparent source attribution.",
});

const usage = createSignalUsageEvent({
  signalId: "px_sports_nba_001",
  source: "PARADOX_SPORTS_BETS_FEED",
  builderId: license.builderId,
  agentId: "telegram_sports_tollbooth",
  usageType: "TELEGRAM_DELIVERY",
  receiptId: "receipt_sports_telegram_demo",
});

const feeWaterfall = buildParadoxSignalFeeWaterfall({
  signalId: usage.signalId,
  source: usage.source,
  usageType: usage.usageType,
  builderId: usage.builderId,
  agentId: usage.agentId,
  buyerTotalAtomic: "61000",
  builderFeeAtomic: "50000",
});

console.log(JSON.stringify({
  telegramCommand: "/signal",
  attribution: "Parad0x Labs",
  usage,
  feeKinds: feeWaterfall.lines.map((line) => line.kind),
  unlock: "Verify receipt before sending the sports signal.",
}, null, 2));
