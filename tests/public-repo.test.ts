import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const root = path.resolve(".");

function files(dir: string): string[] {
  const out: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name === ".git") continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...files(full));
    else out.push(full);
  }
  return out;
}

describe("public builder repo boundary", () => {
  it("does not publish private rail implementation artifacts", () => {
    const relativeFiles = files(root).map((file) => path.relative(root, file).replace(/\\/g, "/"));
    for (const forbidden of [
      "src/server",
      "src/db",
      "migrations",
      "backup-postgres",
      "telegramAlert",
    ]) {
      expect(relativeFiles.some((file) => file.includes(forbidden))).toBe(false);
    }
  });

  it("does not contain obvious secret material or backend key examples", () => {
    const text = files(root)
      .filter((file) => !file.endsWith("package-lock.json"))
      .map((file) => fs.readFileSync(file, "utf8"))
      .join("\n")
      .toLowerCase();
    expect(text).not.toMatch(/helius_api_key\s*=\s*["'][^"']+/);
    expect(text).not.toMatch(/telegram_bot_token\s*=\s*["'][^"']+/);
    expect(text).not.toMatch(/-----begin (rsa|ec|openssh) private key-----/);
  });

  it("contains the one-stop review packet and public scenario docs", () => {
    expect(fs.existsSync(path.join(root, "docs", "INTERNAL_REVIEW_PACKET.md"))).toBe(true);
    expect(fs.existsSync(path.join(root, "docs", "SCENARIOS.md"))).toBe(true);
    expect(fs.existsSync(path.join(root, "docs", "X402_COMPATIBILITY.md"))).toBe(true);
  });
});
