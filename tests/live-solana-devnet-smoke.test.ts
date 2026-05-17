import { describe, expect, it } from "vitest";
import {
  buildSplitProofs,
  createDevnetSmokeRailFetch,
  runLiveSolanaDevnetSmoke,
  skipReasonForEnv,
} from "../examples/live-solana-devnet/src/index.js";
import { DnaX402Client } from "../sdk/typescript/src/index.js";

const enableEnv = "DNA_X402_LIVE_DEVNET_SMOKE";
const rpcEnv = "SOLANA_DEVNET_RPC_URL";

describe("optional live Solana devnet smoke", () => {
  it("skips cleanly when opt-in env is missing", async () => {
    expect(skipReasonForEnv({})).toContain(enableEnv);

    const result = await runLiveSolanaDevnetSmoke({ env: {} });

    expect(result.status).toBe("skipped");
    expect(result.reason).toContain(enableEnv);
  });

  it("skips cleanly when RPC URL is missing", () => {
    expect(skipReasonForEnv({ [enableEnv]: "1" })).toContain(rpcEnv);
  });

  it("runs the full smoke flow with injected devnet RPC", async () => {
    const result = await runLiveSolanaDevnetSmoke({
      env: {
        [enableEnv]: "1",
        [rpcEnv]: "https://devnet.example.invalid",
        DNA_X402_API_URL: "https://parad0xlabs.com/x402",
      },
      now: () => 1770000000000,
      fetchImpl: async (_url, init) => {
        const body = typeof init?.body === "string" ? JSON.parse(init.body) as { method?: string } : {};
        if (body.method === "getHealth") return jsonResponse({ result: "ok" });
        if (body.method === "getLatestBlockhash") {
          return jsonResponse({
            result: {
              value: {
                blockhash: "DevnetSmokeBlockhash111111111111111111111111111",
              },
            },
          });
        }
        return jsonResponse({ error: { message: "unexpected method" } }, 400);
      },
    });

    expect(result.status).toBe("passed");
    expect(result.checks.liveDevnetRpcReachable).toBe(true);
    expect(result.checks.providerProofShape).toBe(true);
    expect(result.checks.dnaTreasuryProofShape).toBe(true);
    expect(result.checks.replayRejected).toBe(true);
    expect(result.checks.wrongRecipientRejected).toBe(true);
    expect(result.checks.underpayRejected).toBe(true);
  });

  it("rejects replay, wrong recipient, and underpay in the direct split smoke rail", async () => {
    const blockhash = "DevnetSmokeBlockhash222222222222222222222222222";
    const dna = new DnaX402Client({
      baseUrl: "https://parad0xlabs.com/x402",
      fetch: createDevnetSmokeRailFetch({ blockhash }),
    });

    const quote = await dna.quote({ resource: "/paid/devnet-smoke-api", amountAtomic: "1000000" });
    const split = dna.inspectFeeWaterfall(quote);
    const commit = await dna.commit(quote.quoteId, "0xabc");
    const proofs = buildSplitProofs(split.requiredProofs, blockhash, 1);

    await expect(dna.finalizeDirectSplit(commit.commitId, proofs)).resolves.toMatchObject({
      receiptId: "receipt_devnet_smoke",
    });
    await expect(dna.finalizeDirectSplit(commit.commitId, proofs)).rejects.toMatchObject({ status: 409 });

    const wrongRecipient = proofs.map((proof) => ({
      ...proof,
      paymentProof: {
        ...proof.paymentProof,
        txSignature: `${proof.paymentProof.txSignature}-wrong`,
        payload: proof.feeLineId.includes("dna")
          ? {
              ...(proof.paymentProof.payload as Record<string, unknown>),
              recipient: "wrong_devnet_treasury",
            }
          : proof.paymentProof.payload,
      },
    }));
    await expect(dna.finalizeDirectSplit(commit.commitId, wrongRecipient)).rejects.toMatchObject({ status: 400 });

    const underpaid = proofs.map((proof) => ({
      ...proof,
      paymentProof: {
        ...proof.paymentProof,
        txSignature: `${proof.paymentProof.txSignature}-underpay`,
        amountAtomic: proof.feeLineId.includes("dna") ? "999" : proof.paymentProof.amountAtomic,
      },
    }));
    await expect(dna.finalizeDirectSplit(commit.commitId, underpaid)).rejects.toMatchObject({ status: 400 });
  });
});

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}
