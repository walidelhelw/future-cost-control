import "server-only";

import {
  GoogleGenAI,
  type FunctionCall,
  type GenerateContentConfig,
  type GenerateContentResponseUsageMetadata,
} from "@google/genai";

import { createV2ServiceClient } from "./supabase/service";

export const GEMINI_MODELS = {
  flash: "gemini-3-flash-preview",
  pro: "gemini-3.1-pro-preview",
  embedding: "gemini-embedding-2",
} as const;

export type GeminiJob =
  | "assistant_route"
  | "assistant_answer"
  | "semantic_embedding"
  | "tender_extract"
  | "daily_report_extract"
  | "change_order_draft";

export type GeminiComplexity = "simple" | "complex";

type GeminiModelId = (typeof GEMINI_MODELS)[keyof typeof GEMINI_MODELS];

type GeminiTextRequest = {
  job: GeminiJob;
  contents: string;
  orgId?: string | null;
  userId?: string;
  model?: GeminiModelId;
  complexity?: GeminiComplexity;
  config?: GenerateContentConfig;
};

type GeminiTextResponse = {
  text: string;
  model: GeminiModelId;
  functionCalls: FunctionCall[];
};

type UsageSnapshot = {
  inputTokens: number;
  outputTokens: number;
};

let cachedClient: GoogleGenAI | null = null;

export function routeGeminiModel(
  job: GeminiJob,
  complexity: GeminiComplexity = "simple",
): GeminiModelId {
  if (job === "semantic_embedding") {
    return GEMINI_MODELS.embedding;
  }

  if (job === "change_order_draft" || complexity === "complex") {
    return GEMINI_MODELS.pro;
  }

  return GEMINI_MODELS.flash;
}

export async function generateGeminiText(
  request: GeminiTextRequest,
): Promise<GeminiTextResponse> {
  const model = request.model ?? routeGeminiModel(request.job, request.complexity);
  const startedAt = Date.now();

  try {
    const response = await getGeminiClient().models.generateContent({
      model,
      contents: request.contents,
      config: request.config,
    });
    const usage = usageFromMetadata(response.usageMetadata);

    await logAiCall({
      userId: request.userId,
      orgId: request.orgId,
      job: request.job,
      model,
      usage,
      latencyMs: Date.now() - startedAt,
      status: "success",
      error: null,
    });

    return {
      text: response.text ?? "",
      model,
      functionCalls: response.functionCalls ?? [],
    };
  } catch (error) {
    await logAiCall({
      userId: request.userId,
      orgId: request.orgId,
      job: request.job,
      model,
      usage: { inputTokens: 0, outputTokens: 0 },
      latencyMs: Date.now() - startedAt,
      status: "error",
      error: errorMessage(error),
    });
    throw error;
  }
}

export async function* streamGeminiText(
  request: GeminiTextRequest,
): AsyncGenerator<string> {
  const model = request.model ?? routeGeminiModel(request.job, request.complexity);
  const startedAt = Date.now();
  const usage: UsageSnapshot = { inputTokens: 0, outputTokens: 0 };

  try {
    const stream = await getGeminiClient().models.generateContentStream({
      model,
      contents: request.contents,
      config: request.config,
    });

    for await (const chunk of stream) {
      mergeUsage(usage, usageFromMetadata(chunk.usageMetadata));
      const text = chunk.text ?? "";
      if (text) {
        yield text;
      }
    }

    await logAiCall({
      userId: request.userId,
      orgId: request.orgId,
      job: request.job,
      model,
      usage,
      latencyMs: Date.now() - startedAt,
      status: "success",
      error: null,
    });
  } catch (error) {
    await logAiCall({
      userId: request.userId,
      orgId: request.orgId,
      job: request.job,
      model,
      usage,
      latencyMs: Date.now() - startedAt,
      status: "error",
      error: errorMessage(error),
    });
    throw error;
  }
}

function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("Missing GEMINI_API_KEY");
  }

  cachedClient ??= new GoogleGenAI({ apiKey });
  return cachedClient;
}

function usageFromMetadata(
  metadata: GenerateContentResponseUsageMetadata | undefined,
): UsageSnapshot {
  return {
    inputTokens:
      (metadata?.promptTokenCount ?? 0) + (metadata?.toolUsePromptTokenCount ?? 0),
    outputTokens:
      (metadata?.candidatesTokenCount ?? 0) + (metadata?.thoughtsTokenCount ?? 0),
  };
}

function mergeUsage(target: UsageSnapshot, next: UsageSnapshot): void {
  target.inputTokens = Math.max(target.inputTokens, next.inputTokens);
  target.outputTokens = Math.max(target.outputTokens, next.outputTokens);
}

async function logAiCall(params: {
  userId?: string;
  orgId?: string | null;
  job: GeminiJob;
  model: GeminiModelId;
  usage: UsageSnapshot;
  latencyMs: number;
  status: "success" | "error";
  error: string | null;
}): Promise<void> {
  const supabase = createV2ServiceClient();

  if (!supabase) {
    return;
  }

  await supabase.from("ai_call_log").insert({
    org_id: params.orgId ?? null,
    user_id: params.userId ?? null,
    job: params.job,
    model: params.model,
    input_tokens: params.usage.inputTokens,
    output_tokens: params.usage.outputTokens,
    cost_usd: estimateCostUsd(params.model, params.usage),
    latency_ms: params.latencyMs,
    status: params.status,
    error: params.error,
  });
}

function estimateCostUsd(model: GeminiModelId, usage: UsageSnapshot): number {
  const inputRate = readPrice(
    `${modelToEnvPrefix(model)}_INPUT_USD_PER_MILLION_TOKENS`,
  );
  const outputRate = readPrice(
    `${modelToEnvPrefix(model)}_OUTPUT_USD_PER_MILLION_TOKENS`,
  );

  return roundUsd(
    (usage.inputTokens / 1_000_000) * inputRate +
      (usage.outputTokens / 1_000_000) * outputRate,
  );
}

function modelToEnvPrefix(model: GeminiModelId): string {
  if (model === GEMINI_MODELS.pro) {
    return "GEMINI_PRO";
  }

  if (model === GEMINI_MODELS.embedding) {
    return "GEMINI_EMBEDDING";
  }

  return "GEMINI_FLASH";
}

function readPrice(name: string): number {
  const value = process.env[name];
  if (!value) {
    return 0;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
}

function roundUsd(value: number): number {
  return Math.round(value * 1_000_000) / 1_000_000;
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message.slice(0, 500) : "Unknown Gemini error";
}
