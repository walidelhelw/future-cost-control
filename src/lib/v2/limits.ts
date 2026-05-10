export const ASSISTANT_MAX_LIMIT = 10;
export const ASSISTANT_DEFAULT_LIMIT = 5;

export type AssistantToolName =
  | "getProjects"
  | "getEstimates"
  | "getSuppliers"
  | "getRates"
  | "getRisks"
  | "getCashflow"
  | "searchSemantic"
  | "getVariances"
  | "getApprovals"
  | "getRfqs"
  | "getChangeOrders";

const ASSISTANT_TOOL_NAMES: readonly AssistantToolName[] = [
  "getProjects",
  "getEstimates",
  "getSuppliers",
  "getRates",
  "getRisks",
  "getCashflow",
  "searchSemantic",
  "getVariances",
  "getApprovals",
  "getRfqs",
  "getChangeOrders",
];

export function clampAssistantLimit(
  requested: number | undefined,
  fallback = ASSISTANT_DEFAULT_LIMIT,
): number {
  const numeric =
    typeof requested === "number" && Number.isFinite(requested)
      ? Math.trunc(requested)
      : fallback;
  return Math.min(Math.max(numeric, 1), ASSISTANT_MAX_LIMIT);
}

export function normalizeAssistantQuery(input: string | undefined): string {
  return (input ?? "")
    .replace(/[%_,;"'\\]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 80);
}

export function isAllowedAssistantTool(name: string): name is AssistantToolName {
  return ASSISTANT_TOOL_NAMES.includes(name as AssistantToolName);
}

export function getAllowedAssistantTools(): readonly AssistantToolName[] {
  return ASSISTANT_TOOL_NAMES;
}
