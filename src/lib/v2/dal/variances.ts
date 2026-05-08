import "server-only";

import type { VarianceRow } from "../database.types";
import { clampAssistantLimit } from "../limits";
import {
  assertDalRead,
  assertNoDalError,
  assertProjectAccess,
  type AssistantDataResult,
  type DalContext,
} from "./types";

export type VarianceSummary = Pick<
  VarianceRow,
  | "id"
  | "project_id"
  | "code"
  | "description"
  | "planned_cost"
  | "actual_cost"
  | "variance_amount"
  | "variance_percent"
  | "status"
  | "created_at"
>;

export type ListVariancesInput = {
  projectId?: string;
  limit?: number;
};

export async function listVariances(
  context: DalContext,
  input: ListVariancesInput = {},
): Promise<AssistantDataResult<VarianceSummary[]>> {
  assertDalRead(context, "variances:read");

  if (input.projectId) {
    assertProjectAccess(context, input.projectId);
  }

  let query = context.supabase
    .from("variances")
    .select(
      "id, project_id, code, description, planned_cost, actual_cost, variance_amount, variance_percent, status, created_at",
    )
    .order("created_at", { ascending: false })
    .limit(clampAssistantLimit(input.limit));

  if (input.projectId) {
    query = query.eq("project_id", input.projectId);
  } else if (context.auth.rbacReady && context.auth.projectIds.length > 0) {
    query = query.in("project_id", [...context.auth.projectIds]);
  }

  const { data, error } = await query;
  assertNoDalError(error, "Unable to load variances");

  const rows = (data ?? []) as VarianceSummary[];

  return {
    data: rows,
    citations: rows.map((variance) => ({
      table: "variances",
      id: variance.id,
      label: variance.description ?? variance.code ?? "Variance",
    })),
  };
}
