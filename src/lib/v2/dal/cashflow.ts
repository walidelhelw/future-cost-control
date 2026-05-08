import "server-only";

import type { CashflowPeriodRow } from "../database.types";
import { clampAssistantLimit } from "../limits";
import {
  assertDalRead,
  assertNoDalError,
  assertProjectAccess,
  type AssistantDataResult,
  type DalContext,
} from "./types";

export type CashflowPeriodSummary = Pick<
  CashflowPeriodRow,
  "id" | "project_id" | "period" | "cash_in" | "cash_out" | "scenario" | "created_at"
> & {
  net_cashflow: number;
};

export type ListCashflowInput = {
  projectId?: string;
  limit?: number;
};

export async function listCashflow(
  context: DalContext,
  input: ListCashflowInput = {},
): Promise<AssistantDataResult<CashflowPeriodSummary[]>> {
  assertDalRead(context, "cashflow:read");

  if (input.projectId) {
    assertProjectAccess(context, input.projectId);
  }

  let query = context.supabase
    .from("cashflow_periods")
    .select("id, project_id, period, cash_in, cash_out, scenario, created_at")
    .order("period", { ascending: true })
    .limit(clampAssistantLimit(input.limit));

  if (input.projectId) {
    query = query.eq("project_id", input.projectId);
  } else if (context.auth.rbacReady && context.auth.projectIds.length > 0) {
    query = query.in("project_id", [...context.auth.projectIds]);
  }

  const { data, error } = await query;
  assertNoDalError(error, "Unable to load cashflow");

  const rows = ((data ?? []) as CashflowPeriodRow[]).map((period) => ({
    id: period.id,
    project_id: period.project_id,
    period: period.period,
    cash_in: period.cash_in,
    cash_out: period.cash_out,
    scenario: period.scenario,
    created_at: period.created_at,
    net_cashflow: (period.cash_in ?? 0) - (period.cash_out ?? 0),
  }));

  return {
    data: rows,
    citations: rows.map((period) => ({
      table: "cashflow_periods",
      id: period.id,
      label: `Period ${period.period}`,
    })),
  };
}
