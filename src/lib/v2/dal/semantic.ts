import "server-only";

import type { EmbeddingRow } from "../database.types";
import { clampAssistantLimit, normalizeAssistantQuery } from "../limits";
import {
  assertDalRead,
  assertNoDalError,
  type AssistantDataResult,
  type DalContext,
} from "./types";

export type SemanticSearchInput = {
  query: string;
  limit?: number;
};

export type SemanticMatch = Pick<
  EmbeddingRow,
  "id" | "project_id" | "source_table" | "source_id" | "title" | "content" | "metadata"
>;

export async function searchSemanticIndex(
  context: DalContext,
  input: SemanticSearchInput,
): Promise<AssistantDataResult<SemanticMatch[]>> {
  assertDalRead(context, "semantic:read");

  const search = normalizeAssistantQuery(input.query);

  if (!search) {
    return { data: [], citations: [] };
  }

  let query = context.supabase
    .from("embeddings")
    .select("id, project_id, source_table, source_id, title, content, metadata")
    .ilike("content", `%${search}%`)
    .order("created_at", { ascending: false })
    .limit(clampAssistantLimit(input.limit));

  if (context.auth.organizationId) {
    query = query.eq("org_id", context.auth.organizationId);
  }

  if (context.auth.rbacReady && context.auth.projectIds.length > 0) {
    query = query.or(
      `project_id.is.null,project_id.in.(${context.auth.projectIds.join(",")})`,
    );
  }

  const { data, error } = await query;
  assertNoDalError(error, "Unable to search semantic index");

  const rows = (data ?? []) as SemanticMatch[];

  return {
    data: rows.map((row) => ({
      ...row,
      content: row.content.slice(0, 1_000),
    })),
    citations: rows.map((row) => ({
      table: row.source_table,
      id: row.source_id,
      label: row.title ?? row.source_table,
    })),
  };
}
