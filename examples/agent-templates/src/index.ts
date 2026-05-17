import fs from "node:fs";
import path from "node:path";

type AgentTemplate = {
  name: string;
  slug: string;
  category: string;
  description: string;
  whatItDoes: string[];
  publicBetaMode: string;
  riskLimits: Record<string, number>;
  receiptProofBehavior: string[];
  suggestedPrompt: string;
  exampleApiFlow: string[];
  notInBetaScope: string[];
};

const root = path.resolve(".");
const templateRoot = path.join(root, "templates", "agents");

function listJsonFiles(dir: string): string[] {
  const out: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...listJsonFiles(full));
    if (entry.isFile() && entry.name.endsWith(".json")) out.push(full);
  }
  return out.sort();
}

function assertTemplate(value: unknown, file: string): asserts value is AgentTemplate {
  if (!value || typeof value !== "object") throw new Error(`Invalid template object: ${file}`);
  const template = value as Partial<AgentTemplate>;
  for (const field of [
    "name",
    "slug",
    "category",
    "description",
    "publicBetaMode",
    "suggestedPrompt",
  ] as const) {
    if (typeof template[field] !== "string" || template[field].length === 0) {
      throw new Error(`Template ${file} is missing ${field}`);
    }
  }
  for (const field of ["whatItDoes", "receiptProofBehavior", "exampleApiFlow", "notInBetaScope"] as const) {
    if (!Array.isArray(template[field]) || template[field].length === 0) {
      throw new Error(`Template ${file} is missing ${field}`);
    }
  }
}

const templates = listJsonFiles(templateRoot).map((file) => {
  const parsed = JSON.parse(fs.readFileSync(file, "utf8")) as unknown;
  assertTemplate(parsed, file);
  return parsed;
});

console.log(`Loaded ${templates.length} DNA x402 agent templates`);
for (const template of templates) {
  console.log(`- ${template.slug} [${template.category}] ${template.name}`);
}

