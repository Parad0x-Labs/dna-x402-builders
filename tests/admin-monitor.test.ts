import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const monitorFiles = [
  path.resolve("admin-monitor", "index.html"),
  path.resolve("admin-monitor", "styles.css"),
  path.resolve("admin-monitor", "app.js"),
  path.resolve("admin-monitor", "assets", "nulla-logo.png"),
  path.resolve("docs", "BUILDER_ADMIN_MONITOR.md"),
];

describe("builder admin monitor", () => {
  it("ships a plain local admin monitor with no external runtime assets", () => {
    const html = fs.readFileSync(path.resolve("admin-monitor", "index.html"), "utf8");
    expect(html).toContain("DNA x402 Builder Admin Monitor");
    expect(html).toContain("./styles.css");
    expect(html).toContain("./app.js");
    expect(html).toContain("./assets/nulla-logo.png");
    expect(html).not.toMatch(/https?:\/\//i);
    expect(html).not.toMatch(/cdn|analytics|pixel/i);
  });

  it("keeps the monitor focused on builder operations", () => {
    const text = monitorFiles
      .filter((file) => !file.endsWith(".png"))
      .map((file) => fs.readFileSync(file, "utf8"))
      .join("\n");
    expect(text).toContain("Public builder monitor");
    expect(text).toContain("Dark Null");
    expect(text).toContain("RewardsVault");
    expect(text).toContain("8EeDdvCRmFAzVD4takkBrNNwkeUTUQh4MscRK5Fzpump");
    expect(text).toContain("git pull --ff-only && npm ci && npm run acceptance");
  });

  it("uses dark admin styling and wraps long values inside cards", () => {
    const css = fs.readFileSync(path.resolve("admin-monitor", "styles.css"), "utf8");
    expect(css).toContain("--bg: #05080e");
    expect(css).toContain("repeat(auto-fit, minmax(230px, 1fr))");
    expect(css).toContain("overflow-wrap: anywhere");
    expect(css).toContain("word-break: break-word");
  });

  it("ships the cropped NULLA logo as a local PNG asset", () => {
    const logo = fs.readFileSync(path.resolve("admin-monitor", "assets", "nulla-logo.png"));
    expect(logo.subarray(0, 8).toString("hex")).toBe("89504e470d0a1a0a");
    expect(logo.length).toBeGreaterThan(10000);
  });
});
