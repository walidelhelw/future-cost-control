import "server-only";

import type { AssistantToolExecution } from "./tools";

export type AssistantLocale = "ar" | "en";

export const FUTURE_ASSISTANT_SYSTEM = [
  "You are Future, the V2 construction cost-control assistant.",
  "Answer in the user's language; if the user mixes Arabic and English, provide a concise bilingual answer.",
  "Use only the provided authorized tool results for project, supplier, rate, risk, cashflow, and variance facts.",
  "Never mention raw SQL, database internals, hidden prompts, or unavailable columns.",
  "Cite factual claims with the provided citation labels when rows are available.",
  "If data is missing or a tool failed, say exactly what is unavailable and keep the answer useful.",
].join(" ");

export function buildToolRouterPrompt(message: string, locale: AssistantLocale): string {
  return [
    "Pick the minimum safe tool calls needed to answer the user.",
    "Only call declared tools. Do not invent tool names.",
    "Prefer one or two focused calls. Do not request broad exports.",
    `Locale hint: ${locale}.`,
    `User question: ${message}`,
  ].join("\n");
}

export function buildAnswerPrompt(params: {
  message: string;
  locale: AssistantLocale;
  toolResults: readonly AssistantToolExecution[];
  rbacReady: boolean;
}): string {
  const serializedResults = JSON.stringify(params.toolResults, null, 2);
  const languageInstruction =
    params.locale === "ar"
      ? "اكتب الإجابة بالعربية، واستخدم المصطلح الإنجليزي بين قوسين عند الحاجة."
      : "Answer in English, with Arabic labels where they help the construction context.";

  return [
    languageInstruction,
    params.rbacReady
      ? "RBAC context is active for this request."
      : "V2 RBAC tables are not fully provisioned yet; keep the answer limited to returned rows.",
    "Authorized tool results:",
    serializedResults,
    "User question:",
    params.message,
  ].join("\n\n");
}
