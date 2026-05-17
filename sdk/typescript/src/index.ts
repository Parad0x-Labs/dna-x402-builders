export type FetchLike = (input: string, init?: RequestInit) => Promise<Response>;

export type DnaX402ClientOptions = {
  baseUrl: string;
  fetch?: FetchLike;
  defaultHeaders?: Record<string, string>;
};

export type QuoteRequest = {
  resource: string;
  amountAtomic: string;
  builderId?: string;
  builderFeeBps?: number;
  builderRecipient?: string;
  builderFeeMode?: "display_only" | "builder_accrual";
};

export type QuoteResponse = {
  quoteId: string;
  paymentRequirements?: unknown;
  feeWaterfallV2?: FeeWaterfallV2;
};

export type FeeLine = {
  id: string;
  kind: "PROVIDER_AMOUNT" | "DNA_PLATFORM_FEE" | "BUILDER_FEE" | "AFFILIATE_FEE" | "ALPHA_SUCCESS_FEE";
  label?: string;
  amount: string;
  token?: string;
  recipient?: string;
  requiredForFinalize?: boolean;
  collectionStatus?: string;
};

export type FeeWaterfallV2 = {
  version?: string;
  grossAmount?: string;
  providerAmount?: string;
  totalFees?: string;
  totalBuyerCost?: string;
  feeWaterfallHash?: string;
  lines: FeeLine[];
};

export type CommitResponse = {
  commitId: string;
};

export type PaymentProof = {
  settlement: "transfer" | "x402" | "facilitator";
  txSignature?: string;
  amountAtomic?: string;
  network?: string;
  payload?: unknown;
};

export type SplitPaymentProof = {
  feeLineId: string;
  paymentProof: PaymentProof;
};

export type FinalizeResponse = {
  receiptId: string;
  receipt?: unknown;
  splitPaymentResults?: unknown[];
};

export type AgentBuilderDraftRequest = {
  inputMode: "PROMPT" | "GUIDED" | "TEMPLATE" | "CLONE";
  ownerWallet: string;
  prompt?: string;
  templateId?: string;
  cloneFromAgentId?: string;
  guidedAnswers?: Record<string, unknown>;
};

export type AgentBuilderDraft = {
  status: "DRAFT_CREATED" | "REJECTED" | "REVIEW_REQUIRED";
  draftId?: string;
  reasonCodes: string[];
  explanation: string[];
  riskSummary?: {
    riskLevel: "LOW" | "MEDIUM" | "HIGH" | "OUT_OF_SCOPE";
    realFundsAtRisk: boolean;
    requiresClientSignature: boolean;
    backendCustody: false;
    backendSigning: false;
    warnings: string[];
    requiredConfirmations: string[];
  };
  agentConfig?: unknown;
};

export class DnaX402Client {
  private readonly baseUrl: string;
  private readonly fetchImpl: FetchLike;
  private readonly defaultHeaders: Record<string, string>;

  constructor(options: DnaX402ClientOptions) {
    this.baseUrl = options.baseUrl.replace(/\/+$/, "");
    this.fetchImpl = options.fetch ?? fetch;
    this.defaultHeaders = options.defaultHeaders ?? {};
  }

  async health(): Promise<unknown> {
    return this.getJson("/health");
  }

  async searchListings(params: Record<string, string | number | boolean>): Promise<unknown> {
    const query = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) query.set(key, String(value));
    return this.getJson(`/market/search?${query.toString()}`);
  }

  async quote(input: QuoteRequest): Promise<QuoteResponse> {
    const query = new URLSearchParams();
    query.set("resource", input.resource);
    query.set("amountAtomic", input.amountAtomic);
    if (input.builderId) query.set("builderId", input.builderId);
    if (input.builderFeeBps !== undefined) query.set("builderFeeBps", String(input.builderFeeBps));
    if (input.builderRecipient) query.set("builderRecipient", input.builderRecipient);
    if (input.builderFeeMode) query.set("builderFeeMode", input.builderFeeMode);
    return this.getJson(`/quote?${query.toString()}`) as Promise<QuoteResponse>;
  }

  async commit(quoteId: string, payerCommitment32B: string): Promise<CommitResponse> {
    return this.postJson("/commit", { quoteId, payerCommitment32B }) as Promise<CommitResponse>;
  }

  async finalize(commitId: string, paymentProof: PaymentProof): Promise<FinalizeResponse> {
    return this.postJson("/finalize", { commitId, paymentProof }) as Promise<FinalizeResponse>;
  }

  async finalizeDirectSplit(commitId: string, splitPaymentProofs: SplitPaymentProof[]): Promise<FinalizeResponse> {
    return this.postJson("/finalize", { commitId, splitPaymentProofs }) as Promise<FinalizeResponse>;
  }

  async receipt(receiptId: string): Promise<unknown> {
    return this.getJson(`/receipt/${encodeURIComponent(receiptId)}`);
  }

  async createAgentDraft(input: AgentBuilderDraftRequest): Promise<AgentBuilderDraft> {
    return this.postJson("/v1/agent-builder/draft", input) as Promise<AgentBuilderDraft>;
  }

  async confirmAgentDraft(draftId: string, confirmations: string[]): Promise<unknown> {
    return this.postJson(`/v1/agent-builder/drafts/${encodeURIComponent(draftId)}/confirm`, { confirmations });
  }

  requiredSplitLines(quote: QuoteResponse): FeeLine[] {
    return quote.feeWaterfallV2?.lines.filter((line) => line.requiredForFinalize) ?? [];
  }

  private async getJson(path: string): Promise<unknown> {
    const response = await this.fetchImpl(`${this.baseUrl}${path}`, {
      headers: this.defaultHeaders,
    });
    return parseJsonResponse(response);
  }

  private async postJson(path: string, body: unknown): Promise<unknown> {
    const response = await this.fetchImpl(`${this.baseUrl}${path}`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        ...this.defaultHeaders,
      },
      body: JSON.stringify(body),
    });
    return parseJsonResponse(response);
  }
}

export async function parseJsonResponse(response: Response): Promise<unknown> {
  const text = await response.text();
  const json = text ? JSON.parse(text) : {};
  if (!response.ok) {
    const error = new Error(`DNA x402 request failed: ${response.status}`);
    Object.assign(error, { status: response.status, body: json });
    throw error;
  }
  return json;
}

export function makeCommitment(seed = cryptoRandom()): string {
  const clean = Buffer.from(seed).toString("hex").slice(0, 64).padEnd(64, "0");
  return `0x${clean}`;
}

function cryptoRandom(): string {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function assertNoBackendKeyFields(input: unknown): void {
  const text = JSON.stringify(input).toLowerCase();
  for (const marker of ["privatekey", "private_key", "seedphrase", "seed_phrase", "mnemonic", "secretkey", "secret_key"]) {
    if (text.includes(marker)) {
      throw new Error(`Forbidden backend key field detected: ${marker}`);
    }
  }
}

