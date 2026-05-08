import "server-only";

import type { EstimateRow, EstimateStatus } from "../database.types";
import { clampAssistantLimit } from "../limits";
import {
  assertDalRead,
  assertNoDalError,
  assertProjectAccess,
  type AssistantDataResult,
  type DalContext,
} from "./types";

export type EstimateSummary = Pick<
  EstimateRow,
  | "id"
  | "project_id"
  | "version"
  | "name"
  | "total_direct"
  | "total_selling"
  | "status"
  | "updated_at"
>;

export type ListEstimatesInput = {
  projectId?: string;
  status?: EstimateStatus;
  limit?: number;
};

export async function listEstimates(
  context: DalContext,
  input: ListEstimatesInput = {},
): Promise<AssistantDataResult<EstimateSummary[]>> {
  assertDalRead(context, "estimates:read");

  if (input.projectId) {
    assertProjectAccess(context, input.projectId);
  }

  let query = context.supabase
    .from("estimates")
    .select("id, project_id, version, name, total_direct, total_selling, status, updated_at")
    .order("updated_at", { ascending: false })
    .limit(clampAssistantLimit(input.limit));

  if (input.projectId) {
    query = query.eq("project_id", input.projectId);
  } else if (context.auth.rbacReady && context.auth.projectIds.length > 0) {
    query = query.in("project_id", [...context.auth.projectIds]);
  }

  if (input.status) {
    query = query.eq("status", input.status);
  }

  const { data, error } = await query;
  assertNoDalError(error, "Unable to load estimates");

  const rows = (data ?? []) as EstimateSummary[];

  return {
    data: rows,
    citations: rows.map((estimate) => ({
      table: "estimates",
      id: estimate.id,
      label: estimate.name ?? `Estimate ${estimate.version ?? ""}`.trim(),
    })),
  };
}
