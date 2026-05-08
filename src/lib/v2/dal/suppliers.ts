import "server-only";

import type { SupplierEvaluationRow, SupplierRow } from "../database.types";
import { clampAssistantLimit, normalizeAssistantQuery } from "../limits";
import {
  assertDalRead,
  assertNoDalError,
  type AssistantDataResult,
  type DalContext,
} from "./types";

export type SupplierSummary = Pick<
  SupplierRow,
  "id" | "name" | "category" | "updated_at"
> & {
  latest_score: number | null;
  latest_status: string | null;
};

export type ListSuppliersInput = {
  category?: string;
  query?: string;
  limit?: number;
};

export async function listSuppliers(
  context: DalContext,
  input: ListSuppliersInput = {},
): Promise<AssistantDataResult<SupplierSummary[]>> {
  assertDalRead(context, "suppliers:read");

  const search = normalizeAssistantQuery(input.query);
  let query = context.supabase
    .from("suppliers")
    .select("id, name, category, updated_at")
    .order("updated_at", { ascending: false })
    .limit(clampAssistantLimit(input.limit));

  if (input.category) {
    query = query.eq("category", normalizeAssistantQuery(input.category));
  }

  if (search) {
    query = query.ilike("name", `%${search}%`);
  }

  const { data, error } = await query;
  assertNoDalError(error, "Unable to load suppliers");

  const suppliers = (data ?? []) as Pick<SupplierRow, "id" | "name" | "category" | "updated_at">[];
  const supplierIds = suppliers.map((supplier) => supplier.id);

  const evaluations = supplierIds.length > 0
    ? await loadLatestEvaluations(context, supplierIds)
    : new Map<string, SupplierEvaluationRow>();

  const rows = suppliers.map((supplier) => {
    const evaluation = evaluations.get(supplier.id);
    return {
      ...supplier,
      latest_score: evaluation?.total_score ?? null,
      latest_status: evaluation?.status ?? null,
    };
  });

  return {
    data: rows,
    citations: rows.map((supplier) => ({
      table: "suppliers",
      id: supplier.id,
      label: supplier.name,
    })),
  };
}

async function loadLatestEvaluations(
  context: DalContext,
  supplierIds: readonly string[],
): Promise<Map<string, SupplierEvaluationRow>> {
  const { data, error } = await context.supabase
    .from("supplier_evaluations")
    .select("id, supplier_id, total_score, status, evaluated_at")
    .in("supplier_id", [...supplierIds])
    .order("evaluated_at", { ascending: false });

  assertNoDalError(error, "Unable to load supplier evaluations");

  const evaluations = new Map<string, SupplierEvaluationRow>();
  ((data ?? []) as SupplierEvaluationRow[]).forEach((evaluation) => {
    if (!evaluations.has(evaluation.supplier_id)) {
      evaluations.set(evaluation.supplier_id, evaluation);
    }
  });

  return evaluations;
}
