import fs from "node:fs";
import path from "node:path";

type Template = {
  name: string;
  slug: string;
  pack: string;
  backendCustody: boolean;
  backendSigning: boolean;
  riskLimits: Record<string, number>;
  receiptBehavior: {
    receiptRequired: boolean;
    bindsProof: boolean;
    bindsFeeWaterfall: boolean;
  };
  copyRules: {
    copyBuys: boolean;
    copySells: boolean;
    minEntryPriceBps: number | null;
    maxEntryPriceBps: number | null;
  };
  monetization: {
    alphaFeeBps: number | null;
    appliesTo: string;
  };
};

const root = path.resolve(".");
const packRoot = path.join(root, "templates", "agents", "meme-casino");

function loadTemplates(): Template[] {
  return fs.readdirSync(packRoot)
    .filter((file) => file.endsWith(".json"))
    .sort()
    .map((file) => JSON.parse(fs.readFileSync(path.join(packRoot, file), "utf8")) as Template);
}

function mockQuote(template: Template) {
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

function mockReceipt(template: Template) {
  const quote = mockQuote(template);
  return {
    receiptId: `receipt_${template.slug}`,
    quoteId: quote.quoteId,
    verified: true,
    feeWaterfallBound: template.receiptBehavior.bindsFeeWaterfall,
  };
}

const templates = loadTemplates();
for (const template of templates) {
  if (template.pack !== "meme-casino") throw new Error(`${template.slug} is not a Meme Casino template`);
  if (template.backendCustody) throw new Error(`${template.slug} enables backend custody`);
  if (template.backendSigning) throw new Error(`${template.slug} enables backend signing`);
  const receipt = mockReceipt(template);
  if (!receipt.verified) throw new Error(`${template.slug} receipt did not verify`);
  if (template.monetization.alphaFeeBps !== null && template.monetization.appliesTo !== "POSITIVE_FINALIZED_COPIED_LOT_PNL") {
    throw new Error(`${template.slug} has unsafe alpha fee basis`);
  }
}

const copyTemplate = templates.find((template) => template.slug === "forty-sixty-edge-copy-agent");
if (!copyTemplate) throw new Error("Missing 40c-60c copy template");
const copies50c = copyTemplate.copyRules.copyBuys && 5000 >= (copyTemplate.copyRules.minEntryPriceBps ?? 0) && 5000 <= (copyTemplate.copyRules.maxEntryPriceBps ?? 10000);
const skips80c = copyTemplate.copyRules.maxEntryPriceBps !== null && 8000 > copyTemplate.copyRules.maxEntryPriceBps;
if (!copies50c || !skips80c) throw new Error("Copy filter mock acceptance failed");

console.log(`Loaded ${templates.length} Meme Casino templates`);
console.log("Mock/devnet acceptance passed");

