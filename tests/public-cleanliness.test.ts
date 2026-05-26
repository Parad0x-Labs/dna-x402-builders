import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const root = path.resolve(".");
const ignoredDirs = new Set([".git", "node_modules"]);
const ignoredFiles = new Set(["package-lock.json"]);
const binaryExtensions = new Set([".png", ".jpg", ".jpeg", ".gif", ".webp", ".ico"]);

function collectFiles(dir: string): string[] {
  const out: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ignoredDirs.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...collectFiles(full));
    else if (binaryExtensions.has(path.extname(entry.name).toLowerCase())) continue;
    else if (!ignoredFiles.has(entry.name)) out.push(full);
  }
  return out;
}

describe("public repo cleanliness", () => {
  it("does not contain machine-specific paths, hostnames, or contributor residue", () => {
    const text = collectFiles(root).map((file) => fs.readFileSync(file, "utf8")).join("\n");
    const bannedTerms = [
      ["sau", "lius"].join(""),
      ["nord", "bitio"].join(""),
      ["must", "work", "harder"].join(""),
      ["i", "mac"].join(""),
      ["mac", "book"].join(""),
    ];
    for (const term of bannedTerms) {
      expect(text).not.toMatch(new RegExp(`\\b${term}\\b`, "i"));
    }
    const desktopPrefix = ["desk", "top"].join("");
    const laptopPrefix = ["lap", "top"].join("");
    expect(text).not.toMatch(new RegExp(`\\b${desktopPrefix}-[a-z0-9-]+\\b`, "i"));
    expect(text).not.toMatch(new RegExp(`\\b${laptopPrefix}-[a-z0-9-]+\\b`, "i"));
    expect(text).not.toMatch(/[A-Z]:[\\/]/);
    expect(text).not.toMatch(new RegExp("/" + "Users" + "/"));
    expect(text).not.toMatch(new RegExp("C:" + "\\\\Users\\\\", "i"));
  });

  it("does not publish real secret-looking values", () => {
    const text = collectFiles(root).map((file) => fs.readFileSync(file, "utf8")).join("\n");
    expect(text).not.toMatch(/-----BEGIN (RSA|EC|OPENSSH) PRIVATE KEY-----/);
    const helius = ["HELIUS", "API", "KEY"].join("_");
    const telegram = ["TELEGRAM", "BOT", "TOKEN"].join("_");
    const secretKeys = ["PRIVATE_KEY", "SECRET_KEY", "MNEMONIC", "SEED_PHRASE"];
    expect(text).not.toMatch(new RegExp(`${helius}=(?!put-|your-|example|$)\\S+`, "i"));
    expect(text).not.toMatch(new RegExp(`${telegram}=(?!put-your-botfather-token-here|$)\\S+`, "i"));
    expect(text).not.toMatch(new RegExp(`(?:${secretKeys.join("|")})=(?!put-|your-|example|$)\\S+`, "i"));
  });
});
