import "server-only";

import type { ApprovalRow, ChangeOrderRow, RfqQuoteRow, RfqRow } from "../database.types";
import { clampAssistantLimit } from "../limits";
import {
  assertDalRead,
  assertNoDalError,
  assertProjectAccess,
  type AssistantDataResult,
  type DalContext,
} from "./types";

export type ApprovalSummary = Pick<ApprovalRow, "id" | "project_id" | "subject" | "status" | "created_at">;
export type ChangeOrderSummary = Pick<ChangeOrderRow, "id" | "project_id" | "title" | "amount" | "status" | "created_at">;
export type RfqSummary = Pick<RfqRow, "id" | "project_id" | "title" | "status" | "created_at"> & {
  quotes: Pick<RfqQuoteRow, "id" | "amount" | "lead_time_days" | "supplier_id">[];
};

export type ProjectScopedInput = {
  projectId?: string;
  limit?: number;
};

export async function listApprovals(
  context: DalContext,
  input: ProjectScopedInput = {},
): Promise<AssistantDataResult<ApprovalSummary[]>> {
  assertDalRead(context, "approvals:read");
  if (input.projectId) assertProjectAccess(context, input.projectId);

  let query = context.supabase
    .from("approvals")
    .select("id, project_id, subject, status, created_at")
    .order("created_at", { ascending: false })
    .limit(clampAssistantLimit(input.limit));

  if (input.projectId) query = query.eq("project_id", input.projectId);

  const { data, error } = await query;
  assertNoDalError(error, "Unable to load approvals");
  const rows = (data ?? []) as ApprovalSummary[];

  return {
    data: rows,
    citations: rows.map((approval) => ({
      table: "approvals",
      id: approval.id,
      label: approval.subject,
    })),
  };
}

export async function listChangeOrders(
  context: DalContext,
  input: ProjectScopedInput = {},
): Promise<AssistantDataResult<ChangeOrderSummary[]>> {
  assertDalRead(context, "change_orders:read");
  if (input.projectId) assertProjectAccess(context, input.projectId);

  let query = context.supabase
    .from("change_orders")
    .select("id, project_id, title, amount, status, created_at")
    .order("created_at", { ascending: false })
    .limit(clampAssistantLimit(input.limit));

  if (input.projectId) query = query.eq("project_id", input.projectId);

  const { data, error } = await query;
  assertNoDalError(error, "Unable to load change orders");
  const rows = (data ?? []) as ChangeOrderSummary[];

  return {
    data: rows,
    citations: rows.map((order) => ({
      table: "change_orders",
      id: order.id,
      label: order.title,
    })),
  };
}

export async function listRfqs(
  context: DalContext,
  input: ProjectScopedInput = {},
): Promise<AssistantDataResult<RfqSummary[]>> {
  assertDalRead(context, "rfqs:read");
  if (input.projectId) assertProjectAccess(context, input.projectId);

  let query = context.supabase
    .from("rfqs")
    .select("id, project_id, title, status, created_at")
    .order("created_at", { ascending: false })
    .limit(clampAssistantLimit(input.limit));

  if (input.projectId) query = query.eq("project_id", input.projectId);

  const { data, error } = await query;
  assertNoDalError(error, "Unable to load RFQs");
  const rfqs = (data ?? []) as Pick<RfqRow, "id" | "project_id" | "title" | "status" | "created_at">[];
  const quoteMap = await loadQuotes(context, rfqs.map((rfq) => rfq.id));

  const rows = rfqs.map((rfq) => ({
    ...rfq,
    quotes: quoteMap.get(rfq.id) ?? [],
  }));

  return {
    data: rows,
    citations: rows.map((rfq) => ({
      table: "rfqs",
      id: rfq.id,
      label: rfq.title,
    })),
  };
}

async function loadQuotes(
  context: DalContext,
  rfqIds: string[],
): Promise<Map<string, Pick<RfqQuoteRow, "id" | "amount" | "lead_time_days" | "supplier_id">[]>> {
  if (rfqIds.length === 0) return new Map();

  const { data, error } = await context.supabase
    .from("rfq_quotes")
    .select("id, rfq_id, amount, lead_time_days, supplier_id")
    .in("rfq_id", rfqIds);

  assertNoDalError(error, "Unable to load RFQ quotes");

  return ((data ?? []) as Pick<RfqQuoteRow, "id" | "rfq_id" | "amount" | "lead_time_days" | "supplier_id">[])
    .reduce((map, quote) => {
      const quotes = map.get(quote.rfq_id) ?? [];
      quotes.push({
        id: quote.id,
        amount: quote.amount,
        lead_time_days: quote.lead_time_days,
        supplier_id: quote.supplier_id,
      });
      map.set(quote.rfq_id, quotes);
      return map;
    }, new Map<string, Pick<RfqQuoteRow, "id" | "amount" | "lead_time_days" | "supplier_id">[]>());
}
