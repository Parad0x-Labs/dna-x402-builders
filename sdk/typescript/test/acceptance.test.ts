import { describe, expect, it } from "vitest";
import { assertNoBackendKeyFields, DnaX402Client, makeCommitment } from "../src/index.js";

function response(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

describe("DNA x402 public builder SDK", () => {
  it("runs quote -> commit -> direct split finalize with a mocked hosted API", async () => {
    const calls: Array<{ url: string; init?: RequestInit }> = [];
    const client = new DnaX402Client({
      baseUrl: "https://parad0xlabs.com/x402",
      fetch: async (url, init) => {
        calls.push({ url, init });
        if (url.includes("/quote")) {
          return response({
            quoteId: "quote_1",
            feeWaterfallV2: {
              lines: [
                { id: "provider", kind: "PROVIDER_AMOUNT", amount: "999000", requiredForFinalize: true },
                { id: "dna", kind: "DNA_PLATFORM_FEE", amount: "1000", requiredForFinalize: true },
              ],
            },
          });
        }
        if (url.endsWith("/commit")) return response({ commitId: "commit_1" }, 201);
        if (url.endsWith("/finalize")) return response({ receiptId: "receipt_1", splitPaymentResults: [{ ok: true }, { ok: true }] });
        throw new Error(`unexpected url ${url}`);
      },
    });

    const quote = await client.quote({ resource: "/paid/weather", amountAtomic: "1000000" });
    const splitLines = client.requiredSplitLines(quote);
    expect(splitLines.map((line) => line.kind)).toEqual(["PROVIDER_AMOUNT", "DNA_PLATFORM_FEE"]);
    const commit = await client.commit(quote.quoteId, makeCommitment("buyer"));
    const finalized = await client.finalizeDirectSplit(commit.commitId, splitLines.map((line) => ({
      feeLineId: line.id,
      paymentProof: { settlement: "transfer", txSignature: `tx-${line.id}`, amountAtomic: line.amount },
    })));
    expect(finalized.receiptId).toBe("receipt_1");
    expect(calls).toHaveLength(3);
  });

  it("rejects private-key-shaped fields before sending agent wallet metadata", () => {
    expect(() => assertNoBackendKeyFields({ publicKey: "safe" })).not.toThrow();
    expect(() => assertNoBackendKeyFields({ privateKey: "never" })).toThrow(/Forbidden/);
  });

  it("exposes hosted API helpers without backend rail internals", async () => {
    const requested: string[] = [];
    const client = new DnaX402Client({
      baseUrl: "https://parad0xlabs.com/x402",
      fetch: async (url) => {
        requested.push(url);
        return response({ ok: true, id: "demo" });
      },
    });

    await client.registerAgentWalletPublicKey("agent-1", {
      ownerWallet: "owner",
      publicKey: "agent-public-key",
      chain: "SOLANA",
    });
    await client.createPaperAgent("agent-1");
    await client.setCopySettings({
      followerAgentId: "follower",
      sourceAgentId: "source",
      enabled: true,
      mode: "PAPER_COPY",
      copyBuys: true,
      copySells: false,
      copyExits: false,
      maxBetSizeAtomic: "5000000",
      maxDailySpendAtomic: "25000000",
      maxOpenExposureAtomic: "10000000",
    });
    await client.setAlphaFee("agent-1", { enabled: true, successFeeBps: 200, mode: "ACCRUAL" });

    expect(requested.some((url) => url.includes("/wallets/register"))).toBe(true);
    expect(requested.some((url) => url.includes("/paper-account"))).toBe(true);
    expect(requested.some((url) => url.includes("/v1/copy/settings"))).toBe(true);
    expect(requested.some((url) => url.includes("/monetization"))).toBe(true);
  });
});
