import "server-only";

import type { MasterRateRow, RateType } from "../database.types";
import { clampAssistantLimit, normalizeAssistantQuery } from "../limits";
import {
  assertDalRead,
  assertNoDalError,
  type AssistantDataResult,
  type DalContext,
} from "./types";

export type RateSummary = Pick<
  MasterRateRow,
  | "id"
  | "code"
  | "name_ar"
  | "name_en"
  | "unit"
  | "current_rate"
  | "min_rate"
  | "max_rate"
  | "source"
  | "updated_at"
>;

export type SearchRatesInput = {
  query?: string;
  type?: RateType;
  limit?: number;
};

export async function searchRates(
  context: DalContext,
  input: SearchRatesInput = {},
): Promise<AssistantDataResult<RateSummary[]>> {
  assertDalRead(context, "rates:read");

  const search = normalizeAssistantQuery(input.query);
  const categoryIds = input.type ? await loadRateCategoryIds(context, input.type) : null;

  if (categoryIds && categoryIds.length === 0) {
    return { data: [], citations: [] };
  }

  let query = context.supabase
    .from("master_rates")
    .select("id, code, name_ar, name_en, unit, current_rate, min_rate, max_rate, source, updated_at")
    .eq("is_active", true)
    .order("updated_at", { ascending: false })
    .limit(clampAssistantLimit(input.limit));

  if (search) {
    query = query.ilike("name_ar", `%${search}%`);
  }

  if (categoryIds) {
    query = query.in("category_id", categoryIds);
  }

  const { data, error } = await query;
  assertNoDalError(error, "Unable to load rates");

  const rows = (data ?? []) as RateSummary[];

  return {
    data: rows,
    citations: rows.map((rate) => ({
      table: "master_rates",
      id: rate.id,
      label: `${rate.code} ${rate.name_ar}`,
    })),
  };
}

async function loadRateCategoryIds(
  context: DalContext,
  type: RateType,
): Promise<string[]> {
  const { data, error } = await context.supabase
    .from("rate_categories")
    .select("id")
    .eq("type", type)
    .eq("is_active", true);

  assertNoDalError(error, "Unable to load rate categories");

  return (data ?? []).map((row) => row.id);
}
