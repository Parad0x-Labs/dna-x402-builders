const summary = [
  { label: "SDK build", value: "TypeScript strict" },
  { label: "Regression", value: "77 tests" },
  { label: "$NULL mint", value: "8EeDdvCRmFAzVD4takkBrNNwkeUTUQh4MscRK5Fzpump" },
  { label: "Flywheel", value: "5 bps to RewardsVault" },
];

const rails = [
  {
    title: "Normal DNA x402",
    status: "PASS",
    body: "Quote, payment proof, signed receipt, direct split fee lines, webhooks, and paid unlock.",
  },
  {
    title: "Dark Null Path",
    status: "PASS",
    body: "Optional private receipt summary for paid alpha reveals, signal rooms, wallet reports, and API access receipts.",
  },
  {
    title: "$NULL Flywheel",
    status: "PASS",
    body: "Premium fee events can attach receipt metadata for capped 5 bps allocation into RewardsVault.",
  },
  {
    title: "Builder SDK",
    status: "PASS",
    body: "Public TypeScript helpers for quotes, receipts, fees, Dark Null receipts, and flywheel metadata.",
  },
];

const checks = [
  {
    status: "PASS",
    area: "Secrets",
    evidence: "No private keys, seed phrases, real bot tokens, or local env files in public builder source.",
    action: "Keep placeholders generic.",
  },
  {
    status: "PASS",
    area: "Local paths",
    evidence: "No personal names, drive paths, home folders, or machine hostnames in public builder files.",
    action: "Block machine-specific paths in tests.",
  },
  {
    status: "PASS",
    area: "SDK",
    evidence: "npm run build and npm test cover TypeScript, SDK helpers, templates, and docs gates.",
    action: "Use npm run acceptance before push.",
  },
  {
    status: "PASS",
    area: "Dark Null",
    evidence: "privacyPath=dark-null is explicit and separate from the normal x402 path.",
    action: "Store hashes and summaries only.",
  },
  {
    status: "WATCH",
    area: "Mainnet switching",
    evidence: "Builder docs expose network parameters and payment boundaries without backend internals.",
    action: "Promote only through hosted account enablement.",
  },
];

function renderSummary() {
  const root = document.querySelector("#overview");
  root.innerHTML = summary.map((item) => `
    <article class="metric">
      <span>${item.label}</span>
      <strong>${item.value}</strong>
    </article>
  `).join("");
}

function renderRails() {
  const root = document.querySelector("#rail-grid");
  root.innerHTML = rails.map((rail) => `
    <article class="rail">
      <span class="tag status-${rail.status.toLowerCase()}">${rail.status}</span>
      <h3>${rail.title}</h3>
      <p>${rail.body}</p>
    </article>
  `).join("");
}

function renderChecks(filter = "ALL") {
  const visible = filter === "ALL" ? checks : checks.filter((check) => check.status === filter);
  document.querySelector("#checks-body").innerHTML = visible.map((check) => `
    <tr>
      <td><span class="tag status-${check.status.toLowerCase()}">${check.status}</span></td>
      <td>${check.area}</td>
      <td>${check.evidence}</td>
      <td>${check.action}</td>
    </tr>
  `).join("");
}

function bindFilters() {
  document.querySelectorAll("[data-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll("[data-filter]").forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      renderChecks(button.dataset.filter);
    });
  });
}

function bindCopyButtons() {
  document.querySelectorAll("[data-copy]").forEach((button) => {
    button.addEventListener("click", async () => {
      const value = button.dataset.copy;
      if (navigator.clipboard && value) await navigator.clipboard.writeText(value);
      button.textContent = "Copied";
      setTimeout(() => {
        button.textContent = "Copy";
      }, 1200);
    });
  });
}

renderSummary();
renderRails();
renderChecks();
bindFilters();
bindCopyButtons();
document.querySelector("#overall-status").textContent = "Public builder surface: PASS";
document.querySelector("#overall-status").classList.add("status-pass");
