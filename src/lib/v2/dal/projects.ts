import "server-only";

import type { ProjectRow, ProjectStatus } from "../database.types";
import { clampAssistantLimit } from "../limits";
import {
  assertDalRead,
  assertNoDalError,
  type AssistantDataResult,
  type DalContext,
} from "./types";

export type ProjectSummary = Pick<
  ProjectRow,
  "id" | "code" | "name" | "client" | "project_type" | "location" | "status" | "updated_at"
>;

export type ListProjectsInput = {
  status?: ProjectStatus;
  limit?: number;
};

export async function listProjects(
  context: DalContext,
  input: ListProjectsInput = {},
): Promise<AssistantDataResult<ProjectSummary[]>> {
  assertDalRead(context, "projects:read");

  let query = context.supabase
    .from("projects")
    .select("id, code, name, client, project_type, location, status, updated_at")
    .order("updated_at", { ascending: false })
    .limit(clampAssistantLimit(input.limit));

  if (input.status) {
    query = query.eq("status", input.status);
  }

  if (context.auth.rbacReady && context.auth.projectIds.length > 0) {
    query = query.in("id", [...context.auth.projectIds]);
  }

  const { data, error } = await query;
  assertNoDalError(error, "Unable to load projects");

  const rows = (data ?? []) as ProjectSummary[];

  return {
    data: rows,
    citations: rows.map((project) => ({
      table: "projects",
      id: project.id,
      label: `${project.code} ${project.name}`,
    })),
  };
}
