import fs from "node:fs";
import path from "node:path";

type Template = {
  name: string;
  slug: string;
  pack: string;
  safety: {
    noFakeEngagement: boolean;
    noBotSwarms: boolean;
    noAutoSpam: boolean;
    humanApprovalRequired: boolean;
    platformRulesRequired: boolean;
    proofReviewRequired: boolean;
  };
  receiptBehavior: {
    receiptRequired: boolean;
    bindsProof: boolean;
  };
};

const root = path.resolve(".");
const packRoot = path.join(root, "templates", "agents", "social-x");

function loadTemplates(): Template[] {
  return fs.readdirSync(packRoot)
    .filter((file) => file.endsWith(".json"))
    .sort()
    .map((file) => JSON.parse(fs.readFileSync(path.join(packRoot, file), "utf8")) as Template);
}

function reviewProof(proof: { url?: string; hash?: string; timestamp?: string; reviewed?: boolean }, seen: Set<string>) {
  const key = proof.url ?? proof.hash;
  if (!key || !proof.timestamp) return { ok: false, code: "PROOF_INCOMPLETE" };
  if (seen.has(key)) return { ok: false, code: "DUPLICATE_PROOF" };
  if (!proof.reviewed) return { ok: false, code: "HUMAN_REVIEW_REQUIRED" };
  seen.add(key);
  return { ok: true, receiptId: "receipt_social_demo" };
}

const templates = loadTemplates();
for (const template of templates) {
  if (template.pack !== "social-x") throw new Error(`${template.slug} is not a Social/X template`);
  if (!template.safety.noFakeEngagement || !template.safety.noBotSwarms || !template.safety.noAutoSpam) {
    throw new Error(`${template.slug} has unsafe engagement settings`);
  }
  if (!template.safety.humanApprovalRequired || !template.safety.platformRulesRequired || !template.safety.proofReviewRequired) {
    throw new Error(`${template.slug} is missing human proof-review safety`);
  }
  if (!template.receiptBehavior.receiptRequired || !template.receiptBehavior.bindsProof) {
    throw new Error(`${template.slug} is not receipt/proof bound`);
  }
}

const seen = new Set<string>();
const accepted = reviewProof({
  url: "https://x.com/demo/status/123",
  timestamp: "2026-05-17T00:00:00Z",
  reviewed: true,
}, seen);
const duplicate = reviewProof({
  url: "https://x.com/demo/status/123",
  timestamp: "2026-05-17T00:00:00Z",
  reviewed: true,
}, seen);
if (!accepted.ok || duplicate.code !== "DUPLICATE_PROOF") throw new Error("Proof-review acceptance failed");

console.log(`Loaded ${templates.length} Social/X templates`);
console.log("Proof-review acceptance passed");

