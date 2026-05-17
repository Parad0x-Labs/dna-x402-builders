import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const socialRoot = path.resolve("templates", "agents", "social-x");

type SocialTemplate = {
  name: string;
  pack: string;
  safety: {
    noFakeEngagement: boolean;
    noBotSwarms: boolean;
    noAutoSpam: boolean;
    humanApprovalRequired: boolean;
    platformRulesRequired: boolean;
    proofReviewRequired: boolean;
  };
  notInBetaScope: string[];
};

function templates(): SocialTemplate[] {
  return fs.readdirSync(socialRoot)
    .filter((name) => name.endsWith(".json"))
    .map((name) => JSON.parse(fs.readFileSync(path.join(socialRoot, name), "utf8")) as SocialTemplate);
}

describe("social x templates", () => {
  it("ships compliant social templates with human review and anti-spam safety", () => {
    for (const template of templates()) {
      expect(template.pack).toBe("social-x");
      expect(template.name.toLowerCase()).not.toContain("ra" + "id");
      expect(template.safety.noFakeEngagement).toBe(true);
      expect(template.safety.noBotSwarms).toBe(true);
      expect(template.safety.noAutoSpam).toBe(true);
      expect(template.safety.humanApprovalRequired).toBe(true);
      expect(template.safety.platformRulesRequired).toBe(true);
      expect(template.safety.proofReviewRequired).toBe(true);
      expect(template.notInBetaScope.join(" ").toLowerCase()).toContain("fake accounts");
    }
  });
});
