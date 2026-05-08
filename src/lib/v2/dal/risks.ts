import "server-only";

import type { ProjectRiskRow } from "../database.types";
import { clampAssistantLimit } from "../limits";
import {
  assertDalRead,
  assertNoDalError,
  assertProjectAccess,
  type AssistantDataResult,
  type DalContext,
} from "./types";

export type RiskSummary = Pick<
  ProjectRiskRow,
  | "id"
  | "project_id"
  | "risk_id"
  | "risk_statement"
  | "category"
  | "probability"
  | "impact"
  | "emv"
  | "response_category"
  | "mitigation_plan"
>;

export type ListRisksInput = {
  projectId?: string;
  minimumEmv?: number;
  limit?: number;
};

export async function listRisks(
  context: DalContext,
  input: ListRisksInput = {},
): Promise<AssistantDataResult<RiskSummary[]>> {
  assertDalRead(context, "risks:read");

  if (input.projectId) {
    assertProjectAccess(context, input.projectId);
  }

  let query = context.supabase
    .from("project_risks")
    .select(
      "id, project_id, risk_id, risk_statement, category, probability, impact, emv, response_category, mitigation_plan",
    )
    .order("emv", { ascending: false })
    .limit(clampAssistantLimit(input.limit));

  if (input.projectId) {
    query = query.eq("project_id", input.projectId);
  } else if (context.auth.rbacReady && context.auth.projectIds.length > 0) {
    query = query.in("project_id", [...context.auth.projectIds]);
  }

  if (Number.isFinite(input.minimumEmv)) {
    query = query.gte("emv", input.minimumEmv as number);
  }

  const { data, error } = await query;
  assertNoDalError(error, "Unable to load risks");

  const rows = (data ?? []) as RiskSummary[];

  return {
    data: rows,
    citations: rows.map((risk) => ({
      table: "project_risks",
      id: risk.id,
      label: risk.risk_statement,
    })),
  };
}
