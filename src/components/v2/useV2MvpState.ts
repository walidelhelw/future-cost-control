"use client";

import { useEffect, useState } from "react";
import {
  addAudit,
  createInitialMvpState,
  hasChangeSignal,
  type EstimateDraft,
  type V2MvpState,
} from "@/lib/v2/mvp-store";

const STORAGE_KEY = "future-cost-control-v2-mvp";

type UpdateState = (current: V2MvpState) => V2MvpState;

export function useV2MvpState() {
  const [state, setState] = useState<V2MvpState>(() => createInitialMvpState());

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return;

    try {
      setState(JSON.parse(stored) as V2MvpState);
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  function update(apply: UpdateState) {
    setState((current) => {
      const next = apply(current);
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }

  const actions = {
      addInvoice(rowId: string, amount: number) {
        update((current) =>
          addAudit(
            {
              ...current,
              costRows: current.costRows.map((row) =>
                row.id === rowId ? { ...row, actual: row.actual + amount } : row,
              ),
            },
            "cost.invoice_added",
            { ar: "تمت إضافة فاتورة فعلية إلى عمود التكلفة", en: "Actual invoice added to Cost Spine" },
          ),
        );
      },
      submitFieldReport(text: string, progress: number, crew: number) {
        update((current) => {
          const report = {
            id: crypto.randomUUID(),
            project: { ar: "كمبوند لوتس", en: "Lotus Compound" },
            text,
            progress,
            crew,
            createdAt: new Date().toISOString(),
            changeSignal: hasChangeSignal(text),
          };
          const changeOrders = report.changeSignal
            ? [
                {
                  id: crypto.randomUUID(),
                  sourceReportId: report.id,
                  title: {
                    ar: "إخطار تغيير من تقرير الموقع",
                    en: "Change notice from site report",
                  },
                  costImpact: 420_000,
                  daysImpact: 3,
                  status: "draft" as const,
                },
                ...current.changeOrders,
              ]
            : current.changeOrders;

          return addAudit(
            { ...current, changeOrders, fieldReports: [report, ...current.fieldReports] },
            report.changeSignal ? "field.change_signal" : "field.report_created",
            {
              ar: report.changeSignal ? "تقرير موقع جديد مع إشارة تغيير" : "تقرير موقع جديد",
              en: report.changeSignal ? "New site report with change signal" : "New site report",
            },
          );
        });
      },
      decideApproval(id: string, status: "approved" | "rejected") {
        update((current) =>
          addAudit(
            {
              ...current,
              approvals: current.approvals.map((item) =>
                item.id === id ? { ...item, status } : item,
              ),
            },
            `flow.${status}`,
            {
              ar: status === "approved" ? "تم اعتماد طلب موافقة" : "تم رفض طلب موافقة",
              en: status === "approved" ? "Approval request approved" : "Approval request rejected",
            },
          ),
        );
      },
      routeChangeOrder(id: string) {
        update((current) =>
          addAudit(
            {
              ...current,
              changeOrders: current.changeOrders.map((order) =>
                order.id === id ? { ...order, status: "routed" } : order,
              ),
            },
            "change.routed",
            { ar: "تم تحويل إخطار التغيير إلى الموافقات", en: "Change notice routed to approvals" },
          ),
        );
      },
      awardQuote(rfqId: string, quoteId: string) {
        update((current) =>
          addAudit(
            {
              ...current,
              rfqs: current.rfqs.map((rfq) =>
                rfq.id === rfqId
                  ? {
                      ...rfq,
                      quotes: rfq.quotes.map((quote) => ({
                        ...quote,
                        awarded: quote.id === quoteId,
                      })),
                    }
                  : rfq,
              ),
            },
            "rfq.awarded",
            { ar: "تم ترسية عرض وتحويله إلى التزام", en: "Quote awarded and converted to commitment" },
          ),
        );
      },
      commitEstimate(draft: EstimateDraft) {
        update((current) => {
          if (current.estimateDrafts.some((item) => item.hash === draft.hash)) {
            return current;
          }
          return addAudit(
            { ...current, estimateDrafts: [draft, ...current.estimateDrafts] },
            "estimate.committed",
            { ar: "تم حفظ مسودة تقدير من Smart Estimate", en: "Smart Estimate draft committed" },
          );
        });
      },
      reset() {
        const next = createInitialMvpState();
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        setState(next);
      },
    };

  return { state, actions };
}
