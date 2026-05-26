import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const monitorFiles = [
  path.resolve("admin-monitor", "index.html"),
  path.resolve("admin-monitor", "styles.css"),
  path.resolve("admin-monitor", "app.js"),
  path.resolve("docs", "BUILDER_ADMIN_MONITOR.md"),
];

describe("builder admin monitor", () => {
  it("ships a plain local admin monitor with no external runtime assets", () => {
    const html = fs.readFileSync(path.resolve("admin-monitor", "index.html"), "utf8");
    expect(html).toContain("DNA x402 Builder Admin Monitor");
    expect(html).toContain("./styles.css");
    expect(html).toContain("./app.js");
    expect(html).not.toMatch(/https?:\/\//i);
    expect(html).not.toMatch(/cdn|analytics|pixel/i);
  });

  it("keeps the monitor focused on builder operations", () => {
    const text = monitorFiles.map((file) => fs.readFileSync(file, "utf8")).join("\n");
    expect(text).toContain("Public builder monitor");
    expect(text).toContain("Dark Null");
    expect(text).toContain("RewardsVault");
    expect(text).toContain("8EeDdvCRmFAzVD4takkBrNNwkeUTUQh4MscRK5Fzpump");
    expect(text).toContain("git pull --ff-only && npm ci && npm run acceptance");
  });
});
