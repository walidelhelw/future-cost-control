import "server-only";

import type { EstimateStatus, ProjectStatus, RateType } from "../database.types";
import { isAllowedAssistantTool, normalizeAssistantQuery } from "../limits";
import { listCashflow } from "../dal/cashflow";
import { listEstimates } from "../dal/estimates";
import { listApprovals, listChangeOrders, listRfqs } from "../dal/operations";
import { listProjects } from "../dal/projects";
import { searchRates } from "../dal/rates";
import { listRisks } from "../dal/risks";
import { searchSemanticIndex } from "../dal/semantic";
import { listSuppliers } from "../dal/suppliers";
import type { AssistantDataResult, DalContext } from "../dal/types";
import { listVariances } from "../dal/variances";

export type AssistantToolCall = {
  name: string;
  args: Record<string, unknown>;
};

export type AssistantToolExecution =
  | {
      ok: true;
      name: string;
      result: AssistantDataResult<unknown>;
    }
  | {
      ok: false;
      name: string;
      error: string;
    };

const PROJECT_STATUSES: readonly ProjectStatus[] = [
  "DRAFT",
  "ACTIVE",
  "ON_HOLD",
  "COMPLETED",
  "CANCELLED",
];

const ESTIMATE_STATUSES: readonly EstimateStatus[] = [
  "DRAFT",
  "PENDING_REVIEW",
  "APPROVED",
  "REJECTED",
  "SUPERSEDED",
];

const RATE_TYPES: readonly RateType[] = [
  "MATERIAL",
  "LABOR",
  "EQUIPMENT",
  "SUBCONTRACTOR",
];

export async function executeAssistantToolCalls(
  context: DalContext,
  calls: readonly AssistantToolCall[],
): Promise<AssistantToolExecution[]> {
  const uniqueCalls = dedupeToolCalls(calls).slice(0, 4);
  const executions: AssistantToolExecution[] = [];

  for (const call of uniqueCalls) {
    executions.push(await executeAssistantToolCall(context, call));
  }

  return executions;
}

export function planFallbackToolCalls(message: string): AssistantToolCall[] {
  const text = message.toLowerCase();

  if (/supplier|vendor|مورد|مقاول/.test(text)) {
    return [{ name: "getSuppliers", args: { query: message, limit: 5 } }];
  }

  if (/rfq|quote|quotation|عرض سعر|طلبات الأسعار/.test(text)) {
    return [{ name: "getRfqs", args: { limit: 5 } }];
  }

  if (/approval|sla|اعتماد|موافقة|تصعيد/.test(text)) {
    return [{ name: "getApprovals", args: { limit: 5 } }];
  }

  if (/change order|variation|claim|تغيير|إخطار|مطالبة/.test(text)) {
    return [{ name: "getChangeOrders", args: { limit: 5 } }];
  }

  if (/rate|price|steel|rebar|سعر|حديد|بند/.test(text)) {
    return [{ name: "getRates", args: { query: message, limit: 5 } }];
  }

  if (/risk|emv|مخاطر|خطر/.test(text)) {
    return [{ name: "getRisks", args: { limit: 5 } }];
  }

  if (/cash|burn|flow|تدفق|نقد/.test(text)) {
    return [{ name: "getCashflow", args: { limit: 5 } }];
  }

  if (/variance|over budget|فرق|انحراف|تجاوز/.test(text)) {
    return [{ name: "getVariances", args: { limit: 5 } }];
  }

  if (/estimate|boq|تقدير|مقايسة/.test(text)) {
    return [{ name: "getEstimates", args: { limit: 5 } }];
  }

  return [{ name: "getProjects", args: { limit: 5 } }];
}

async function executeAssistantToolCall(
  context: DalContext,
  call: AssistantToolCall,
): Promise<AssistantToolExecution> {
  if (!isAllowedAssistantTool(call.name)) {
    return { ok: false, name: call.name, error: "Tool is not allowed" };
  }

  try {
    switch (call.name) {
      case "getProjects":
        return { ok: true, name: call.name, result: await listProjects(context, parseProjects(call.args)) };
      case "getEstimates":
        return { ok: true, name: call.name, result: await listEstimates(context, parseEstimates(call.args)) };
      case "getSuppliers":
        return { ok: true, name: call.name, result: await listSuppliers(context, parseSupplier(call.args)) };
      case "getRates":
        return { ok: true, name: call.name, result: await searchRates(context, parseRates(call.args)) };
      case "getRisks":
        return { ok: true, name: call.name, result: await listRisks(context, parseRisks(call.args)) };
      case "getCashflow":
        return { ok: true, name: call.name, result: await listCashflow(context, parseProjectScoped(call.args)) };
      case "searchSemantic":
        return { ok: true, name: call.name, result: await searchSemanticIndex(context, parseSemantic(call.args)) };
      case "getVariances":
        return { ok: true, name: call.name, result: await listVariances(context, parseProjectScoped(call.args)) };
      case "getApprovals":
        return { ok: true, name: call.name, result: await listApprovals(context, parseProjectScoped(call.args)) };
      case "getRfqs":
        return { ok: true, name: call.name, result: await listRfqs(context, parseProjectScoped(call.args)) };
      case "getChangeOrders":
        return { ok: true, name: call.name, result: await listChangeOrders(context, parseProjectScoped(call.args)) };
    }
  } catch (error) {
    return {
      ok: false,
      name: call.name,
      error: error instanceof Error ? error.message : "Tool failed",
    };
  }
}

function parseProjects(args: Record<string, unknown>) {
  return {
    status: enumValue(args.status, PROJECT_STATUSES),
    limit: numberValue(args.limit),
  };
}

function parseEstimates(args: Record<string, unknown>) {
  return {
    projectId: stringValue(args.projectId),
    status: enumValue(args.status, ESTIMATE_STATUSES),
    limit: numberValue(args.limit),
  };
}

function parseSupplier(args: Record<string, unknown>) {
  return {
    category: stringValue(args.category),
    query: stringValue(args.query),
    limit: numberValue(args.limit),
  };
}

function parseRates(args: Record<string, unknown>) {
  return {
    query: stringValue(args.query),
    type: enumValue(args.type, RATE_TYPES),
    limit: numberValue(args.limit),
  };
}

function parseRisks(args: Record<string, unknown>) {
  return {
    projectId: stringValue(args.projectId),
    minimumEmv: numberValue(args.minimumEmv),
    limit: numberValue(args.limit),
  };
}

function parseProjectScoped(args: Record<string, unknown>) {
  return {
    projectId: stringValue(args.projectId),
    limit: numberValue(args.limit),
  };
}

function parseSemantic(args: Record<string, unknown>) {
  return {
    query: normalizeAssistantQuery(stringValue(args.query)),
    limit: numberValue(args.limit),
  };
}

function dedupeToolCalls(calls: readonly AssistantToolCall[]): AssistantToolCall[] {
  const seen = new Set<string>();
  return calls.filter((call) => {
    const key = `${call.name}:${JSON.stringify(call.args)}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

function stringValue(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function numberValue(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function enumValue<T extends string>(
  value: unknown,
  allowed: readonly T[],
): T | undefined {
  return typeof value === "string" && allowed.includes(value as T)
    ? (value as T)
    : undefined;
}
