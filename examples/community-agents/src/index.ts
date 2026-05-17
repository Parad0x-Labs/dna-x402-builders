import fs from "node:fs";
import path from "node:path";

type CommunityTemplate = {
  name: string;
  slug: string;
  pack: string;
  telegramSupport: boolean;
  discordSupport: boolean;
  backendCustody: boolean;
  backendSigning: boolean;
  walletModel: string;
  monetization: {
    enabled: boolean;
    builderFeeBps: number | null;
    alphaFeeBps: number | null;
    appliesTo: string;
  };
  receiptBehavior: {
    receiptRequired: boolean;
    bindsProof: boolean;
    bindsFeeWaterfall: boolean;
  };
  exampleFlow: string[];
  mockDevnetTestPath: string;
};

const root = path.resolve(".");
const packRoot = path.join(root, "templates", "agents", "community");

function loadTemplates(): CommunityTemplate[] {
  return fs.readdirSync(packRoot)
    .filter((file) => file.endsWith(".json"))
    .sort()
    .map((file) => JSON.parse(fs.readFileSync(path.join(packRoot, file), "utf8")) as CommunityTemplate);
}

function mockQuote(template: CommunityTemplate) {
  return {
    quoteId: `quote_${template.slug}`,
    feeWaterfall: {
      lines: [
        { kind: "PROVIDER_AMOUNT", amountAtomic: "999000", requiredForFinalize: true },
        { kind: "DNA_PLATFORM_FEE", amountAtomic: "1000", bps: 10, requiredForFinalize: true },
      ],
    },
  };
}

function mockReceipt(template: CommunityTemplate) {
  const quote = mockQuote(template);
  return {
    receiptId: `receipt_${template.slug}`,
    quoteId: quote.quoteId,
    unlock: true,
    proofBound: template.receiptBehavior.bindsProof,
    feeWaterfallBound: template.receiptBehavior.bindsFeeWaterfall,
  };
}

const templates = loadTemplates();
for (const template of templates) {
  if (template.pack !== "community") throw new Error(`${template.slug} is not a community template`);
  if (!template.telegramSupport && !template.discordSupport) throw new Error(`${template.slug} has no launch channel`);
  if (template.backendCustody) throw new Error(`${template.slug} enables backend custody`);
  if (template.backendSigning) throw new Error(`${template.slug} enables backend signing`);
  if (template.walletModel !== "NONE_REQUIRED") throw new Error(`${template.slug} should start walletless`);
  if (!template.receiptBehavior.receiptRequired || !template.receiptBehavior.bindsFeeWaterfall) {
    throw new Error(`${template.slug} is not receipt and fee bound`);
  }
  if (template.monetization.alphaFeeBps !== null && template.monetization.appliesTo !== "POSITIVE_FINALIZED_COPIED_LOT_PNL") {
    throw new Error(`${template.slug} has unsafe alpha fee basis`);
  }
  if (template.exampleFlow.length < 3) throw new Error(`${template.slug} needs a concrete example flow`);
  const receipt = mockReceipt(template);
  if (!receipt.unlock || !receipt.feeWaterfallBound) throw new Error(`${template.slug} mock unlock failed`);
}

console.log(`Loaded ${templates.length} Community templates`);
console.log("Community mock/devnet acceptance passed");
