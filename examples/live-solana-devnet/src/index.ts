import path from "node:path";
import { pathToFileURL } from "node:url";
import { DnaX402Client, type FetchLike, type FeeLine, makeCommitment, type SplitPaymentProof } from "../../../sdk/typescript/src/index.js";

export type LiveDevnetSmokeResult = {
  status: "skipped" | "passed";
  reason?: string;
  checks: Record<string, boolean>;
  devnet?: {
    rpcUrl: string;
    health: string;
    blockhash: string;
  };
  quoteId?: string;
  commitId?: string;
  receiptId?: string;
};

type JsonRpcResponse = {
  result?: unknown;
  error?: { message?: string };
};

type SmokeRailState = {
  usedProofs: Set<string>;
  receipt?: {
    receiptId: string;
    quoteId: string;
    commitId: string;
    feeWaterfallHash: string;
    paidUnlock: boolean;
  };
};

const enableEnv = "DNA_X402_LIVE_DEVNET_SMOKE";
const rpcEnv = "SOLANA_DEVNET_RPC_URL";

export async function runLiveSolanaDevnetSmoke(options: {
  env?: NodeJS.ProcessEnv;
  fetchImpl?: FetchLike;
  now?: () => number;
} = {}): Promise<LiveDevnetSmokeResult> {
  const env = options.env ?? process.env;
  const fetchImpl = options.fetchImpl ?? fetch;
  const now = options.now ?? Date.now;
  const skipReason = skipReasonForEnv(env);
  if (skipReason) {
    return {
      status: "skipped",
      reason: skipReason,
      checks: {
        optInPresent: false,
        liveDevnetRpcReachable: false,
        quoteCommitReceiptFlow: false,
      },
    };
  }

  const rpcUrl = env[rpcEnv] as string;
  const health = String(await rpcRequest(rpcUrl, "getHealth", [], fetchImpl));
  const blockhash = await getLatestBlockhash(rpcUrl, fetchImpl);
  const dna = new DnaX402Client({
    baseUrl: env.DNA_X402_API_URL ?? "https://parad0xlabs.com/x402",
    fetch: createDevnetSmokeRailFetch({ blockhash }),
  });

  const quote = await dna.quote({ resource: "/paid/devnet-smoke-api", amountAtomic: "1000000" });
  const split = dna.inspectFeeWaterfall(quote);
  assertLine(split.provider, "PROVIDER_AMOUNT");
  assertLine(split.dnaPlatformFee, "DNA_PLATFORM_FEE");
  const commit = await dna.commit(quote.quoteId, makeCommitment(`devnet-${blockhash}`));
  const proofs = buildSplitProofs(split.requiredProofs, blockhash, now());
  const finalized = await dna.finalizeDirectSplit(commit.commitId, proofs);
  const receipt = await dna.receipt(finalized.receiptId) as { paidUnlock?: boolean };

  const replayRejected = await requestFails(() => dna.finalizeDirectSplit(commit.commitId, proofs), 409);
  const wrongRecipientRejected = await requestFails(() => dna.finalizeDirectSplit(commit.commitId, mutateDnaProof(proofs, {
    recipient: "wrong_devnet_treasury",
    suffix: "wrong-recipient",
  })), 400);
  const underpayRejected = await requestFails(() => dna.finalizeDirectSplit(commit.commitId, mutateDnaProof(proofs, {
    amountAtomic: "999",
    suffix: "underpay",
  })), 400);

  const checks = {
    liveDevnetRpcReachable: health === "ok",
    liveDevnetBlockhashLoaded: blockhash.length > 20,
    quoteCreated: Boolean(quote.quoteId),
    commitCreated: Boolean(commit.commitId),
    providerProofShape: proofs.some((proof) => proof.feeLineId === split.provider?.id),
    dnaTreasuryProofShape: proofs.some((proof) => proof.feeLineId === split.dnaPlatformFee?.id),
    receiptVerifies: Boolean(finalized.receiptId),
    paidUnlock: receipt.paidUnlock === true,
    replayRejected,
    wrongRecipientRejected,
    underpayRejected,
  };

  if (Object.values(checks).some((value) => !value)) {
    throw new Error(`Live devnet smoke failed: ${JSON.stringify(checks)}`);
  }

  return {
    status: "passed",
    checks,
    devnet: { rpcUrl, health, blockhash },
    quoteId: quote.quoteId,
    commitId: commit.commitId,
    receiptId: finalized.receiptId,
  };
}

export function skipReasonForEnv(env: NodeJS.ProcessEnv): string | null {
  if (env[enableEnv] !== "1") return `set ${enableEnv}=1 to run optional live devnet smoke`;
  if (!env[rpcEnv]) return `set ${rpcEnv} to a Solana devnet RPC URL`;
  return null;
}

export async function rpcRequest(rpcUrl: string, method: string, params: unknown[], fetchImpl: FetchLike = fetch): Promise<unknown> {
  const response = await fetchImpl(rpcUrl, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
  });
  const text = await response.text();
  const json = JSON.parse(text) as JsonRpcResponse;
  if (!response.ok || json.error) {
    throw new Error(`Solana devnet RPC failed: ${response.status} ${json.error?.message ?? text}`);
  }
  return json.result;
}

export async function getLatestBlockhash(rpcUrl: string, fetchImpl: FetchLike = fetch): Promise<string> {
  const result = await rpcRequest(rpcUrl, "getLatestBlockhash", [], fetchImpl) as {
    value?: { blockhash?: string };
  };
  const blockhash = result.value?.blockhash;
  if (!blockhash) throw new Error("Solana devnet RPC did not return a blockhash.");
  return blockhash;
}

export function createDevnetSmokeRailFetch(input: { blockhash: string }): FetchLike {
  const state: SmokeRailState = { usedProofs: new Set() };
  const quoteId = `quote_devnet_${input.blockhash.slice(0, 8)}`;
  const commitId = `commit_devnet_${input.blockhash.slice(0, 8)}`;
  const feeWaterfallHash = `devnet_fee_waterfall_${input.blockhash}`;
  const providerLine: FeeLine = {
    id: "provider_devnet",
    kind: "PROVIDER_AMOUNT",
    label: "Provider amount",
    amount: "999000",
    token: "USDC_DEVNET",
    recipient: "provider_devnet_recipient",
    requiredForFinalize: true,
  };
  const dnaLine: FeeLine = {
    id: "dna_devnet",
    kind: "DNA_PLATFORM_FEE",
    label: "DNA 0.1% fee",
    amount: "1000",
    token: "USDC_DEVNET",
    recipient: "dna_devnet_treasury",
    requiredForFinalize: true,
  };

  return async (url, init) => {
    const parsed = new URL(url);
    if (parsed.pathname.endsWith("/health")) return jsonResponse({ ok: true });
    if (parsed.pathname.endsWith("/quote")) {
      return jsonResponse({
        quoteId,
        feeWaterfallV2: {
          version: "fee_waterfall_v2",
          feeWaterfallHash,
          grossAmount: "1000000",
          providerAmount: providerLine.amount,
          totalFees: dnaLine.amount,
          totalBuyerCost: "1000000",
          lines: [providerLine, dnaLine],
        },
      });
    }
    if (parsed.pathname.endsWith("/commit")) {
      const body = readJson(init);
      if (body.quoteId !== quoteId) return jsonResponse({ error: "wrong_quote" }, 400);
      return jsonResponse({ commitId }, 201);
    }
    if (parsed.pathname.endsWith("/finalize")) {
      const body = readJson(init);
      if (body.commitId !== commitId) return jsonResponse({ error: "wrong_commit" }, 400);
      const validation = validateSplitProofs(body.splitPaymentProofs, [providerLine, dnaLine], state);
      if (!validation.ok) return jsonResponse({ error: validation.code }, validation.status);
      state.receipt = {
        receiptId: "receipt_devnet_smoke",
        quoteId,
        commitId,
        feeWaterfallHash,
        paidUnlock: true,
      };
      return jsonResponse({ receiptId: state.receipt.receiptId, receipt: state.receipt });
    }
    if (parsed.pathname.includes("/receipt/")) {
      if (!state.receipt) return jsonResponse({ error: "receipt_missing" }, 404);
      return jsonResponse(state.receipt);
    }
    return jsonResponse({ error: "not_found" }, 404);
  };
}

export function buildSplitProofs(lines: FeeLine[], blockhash: string, nonce: number): SplitPaymentProof[] {
  return lines.map((line) => ({
    feeLineId: line.id,
    paymentProof: {
      settlement: "transfer",
      txSignature: `devnet-${line.id}-${blockhash}-${nonce}`,
      amountAtomic: line.amount,
      network: "solana-devnet",
      payload: {
        chain: "solana-devnet",
        token: line.token,
        recipient: line.recipient,
        blockhash,
      },
    },
  }));
}

function mutateDnaProof(proofs: SplitPaymentProof[], patch: {
  recipient?: string;
  amountAtomic?: string;
  suffix: string;
}): SplitPaymentProof[] {
  return proofs.map((proof) => {
    if (!proof.feeLineId.includes("dna")) {
      return {
        ...proof,
        paymentProof: {
          ...proof.paymentProof,
          txSignature: `${proof.paymentProof.txSignature}-${patch.suffix}`,
        },
      };
    }
    const payload = typeof proof.paymentProof.payload === "object" && proof.paymentProof.payload !== null
      ? { ...proof.paymentProof.payload as Record<string, unknown> }
      : {};
    if (patch.recipient) payload.recipient = patch.recipient;
    return {
      ...proof,
      paymentProof: {
        ...proof.paymentProof,
        txSignature: `${proof.paymentProof.txSignature}-${patch.suffix}`,
        amountAtomic: patch.amountAtomic ?? proof.paymentProof.amountAtomic,
        payload,
      },
    };
  });
}

function validateSplitProofs(proofs: unknown, requiredLines: FeeLine[], state: SmokeRailState): {
  ok: boolean;
  status: number;
  code: string;
} {
  if (!Array.isArray(proofs)) return { ok: false, status: 400, code: "SPLIT_PROOFS_REQUIRED" };
  for (const line of requiredLines) {
    const proof = proofs.find((item) => item?.feeLineId === line.id) as SplitPaymentProof | undefined;
    if (!proof) return { ok: false, status: 400, code: `MISSING_${line.kind}` };
    if (!proof.paymentProof.txSignature) return { ok: false, status: 400, code: "PROOF_SIGNATURE_REQUIRED" };
    if (state.usedProofs.has(proof.paymentProof.txSignature)) return { ok: false, status: 409, code: "REPLAY_REJECTED" };
    if (BigInt(proof.paymentProof.amountAtomic ?? "0") < BigInt(line.amount)) return { ok: false, status: 400, code: "UNDERPAY_REJECTED" };
    const payload = proof.paymentProof.payload as { recipient?: string; token?: string; chain?: string } | undefined;
    if (payload?.recipient !== line.recipient) return { ok: false, status: 400, code: "WRONG_RECIPIENT_REJECTED" };
    if (payload?.token !== line.token) return { ok: false, status: 400, code: "WRONG_TOKEN_REJECTED" };
    if (payload?.chain !== "solana-devnet") return { ok: false, status: 400, code: "WRONG_CHAIN_REJECTED" };
  }
  for (const proof of proofs as SplitPaymentProof[]) {
    if (proof.paymentProof.txSignature) state.usedProofs.add(proof.paymentProof.txSignature);
  }
  return { ok: true, status: 200, code: "OK" };
}

async function requestFails(fn: () => Promise<unknown>, status: number): Promise<boolean> {
  try {
    await fn();
    return false;
  } catch (error) {
    return typeof error === "object" && error !== null && "status" in error && error.status === status;
  }
}

function assertLine(line: FeeLine | undefined, kind: FeeLine["kind"]): asserts line is FeeLine {
  if (!line || line.kind !== kind || !line.requiredForFinalize) {
    throw new Error(`Required ${kind} split line is missing.`);
  }
}

function readJson(init?: RequestInit): Record<string, unknown> {
  if (!init?.body || typeof init.body !== "string") return {};
  return JSON.parse(init.body) as Record<string, unknown>;
}

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

async function main(): Promise<void> {
  const result = await runLiveSolanaDevnetSmoke();
  console.log(JSON.stringify(result, null, 2));
}

const entry = process.argv[1] ? pathToFileURL(path.resolve(process.argv[1])).href : "";
if (import.meta.url === entry) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
}
