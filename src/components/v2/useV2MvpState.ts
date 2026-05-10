"use client";

import { useEffect, useState } from "react";
import {
  addAudit,
  createInitialMvpState,
  hasChangeSignal,
  normalizeMvpState,
  type EstimateDraft,
  type FieldReport,
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
      const next = normalizeMvpState(JSON.parse(stored) as Partial<V2MvpState>);
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setState(next);
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
              costRows: current.costRows.map((row) => {
                if (row.id !== rowId) return row;
                const actual = row.actual + amount;
                const variance = actual - row.budget;
                return {
                  ...row,
                  actual,
                  metrics: {
                    ...row.metrics,
                    invoice: actual,
                    paymentCert: row.metrics.paymentCert + Math.round(amount * 0.72),
                    cpi: Number((row.budget / Math.max(actual, 1)).toFixed(2)),
                    eoc: actual + Math.max(row.committed - actual, 0),
                  },
                  events: row.events.map((event) => {
                    if (event.type === "invoice") return { ...event, amount: actual, status: { ar: "مدققة الآن", en: "Audited now" } };
                    if (event.type === "cert") return { ...event, amount: row.metrics.paymentCert + Math.round(amount * 0.72) };
                    if (event.type === "variance") {
                      return {
                        ...event,
                        amount: variance,
                        status: variance > 0 ? { ar: "تجاوز", en: "Overrun" } : { ar: "تحت السيطرة", en: "Controlled" },
                      };
                    }
                    return event;
                  }),
                };
              }),
            },
            "cost.invoice_added",
            { ar: "تمت إضافة فاتورة مدققة إلى عمود التكلفة", en: "Audited invoice added to Cost Spine" },
          ),
        );
      },
      addFieldAction(captureType: FieldReport["captureType"]) {
        update((current) => {
          const labels = {
            photo: { ar: "تقرير صور من الموقع", en: "Photo field report" },
            voice: { ar: "تقرير صوتي من الفورمان", en: "Foreman voice report" },
            crew: { ar: "تسجيل دخول الطاقم", en: "Crew tap-in" },
            text: { ar: "تقرير نصي من الموقع", en: "Text field report" },
          };
          const report: FieldReport = {
            id: crypto.randomUUID(),
            project: { ar: "كمبوند لوتس", en: "Lotus Compound" },
            text: labels[captureType].ar,
            progress: captureType === "crew" ? current.fieldReports[0]?.progress ?? 64 : 66,
            crew: captureType === "crew" ? 44 : current.fieldReports[0]?.crew ?? 38,
            createdAt: new Date().toISOString(),
            changeSignal: captureType === "voice",
            captureType,
            offlineQueued: captureType === "photo",
            gps: "30.0419, 31.2368",
            materialSignal: captureType === "photo"
              ? { ar: "صور تثبت تأخر توريد البلوك", en: "Photos confirm block delivery delay" }
              : { ar: "إشارة مواد مستقرة", en: "Material signal stable" },
          };
          return addAudit(
            { ...current, fieldReports: [report, ...current.fieldReports] },
            `field.${captureType}`,
            labels[captureType],
          );
        });
      },
      submitFieldReport(text: string, progress: number, crew: number) {
        update((current) => {
          const report: FieldReport = {
            id: crypto.randomUUID(),
            project: { ar: "كمبوند لوتس", en: "Lotus Compound" },
            text,
            progress,
            crew,
            createdAt: new Date().toISOString(),
            changeSignal: hasChangeSignal(text),
            captureType: "text",
            offlineQueued: false,
            gps: "30.0444, 31.2357",
            materialSignal: { ar: "إشارة توريد مرتبطة بالتقرير", en: "Delivery signal linked to report" },
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
                  arabicNotice: "إخطار تغيير: تقرير الموقع يشير إلى طلب تغيير من المالك. التأثير المبدئي 420,000 جنيه و3 أيام، ويحتاج اعتماد مدير المشروع والمالك.",
                  approvalRoute: { ar: "الموقع -> مدير المشروع -> المالك", en: "Site -> PM -> Owner" },
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
      decideApproval(id: string, status: "approved" | "rejected", comment = "") {
        update((current) =>
          addAudit(
            {
              ...current,
              approvals: current.approvals.map((item) =>
                item.id === id
                  ? {
                      ...item,
                      status,
                      decidedAt: new Date().toISOString(),
                      comments: [...item.comments, comment || (status === "approved" ? "Approved in CEO demo." : "Rejected in CEO demo.")],
                    }
                  : item,
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
              approvals: [
                {
                  id: crypto.randomUUID(),
                  subject: { ar: "اعتماد إخطار تغيير", en: "Approve change notice" },
                  amount: current.changeOrders.find((order) => order.id === id)?.costImpact ?? 0,
                  status: "pending",
                  slaHoursLeft: 8,
                  escalation: { ar: "يصعد إلى المدير التنفيذي إذا لم يعتمد اليوم", en: "Escalates to CEO if not approved today" },
                  comments: ["Change notice routed from Change Control."],
                },
                ...current.approvals,
              ],
            },
            "change.routed",
            { ar: "تم تحويل إخطار التغيير إلى الموافقات", en: "Change notice routed to approvals" },
          ),
        );
      },
      awardQuote(rfqId: string, quoteId: string) {
        update((current) => {
          const rfq = current.rfqs.find((item) => item.id === rfqId);
          const selectedAmount = rfq?.quotes.find((quote) => quote.id === quoteId)?.amount ?? 0;
          const previousAmount = rfq?.quotes.find((quote) => quote.awarded)?.amount ?? 0;
          const delta = selectedAmount - previousAmount;

          return addAudit(
            {
              ...current,
              rfqs: current.rfqs.map((item) =>
                item.id === rfqId
                  ? {
                      ...item,
                      quotes: item.quotes.map((quote) => ({
                        ...quote,
                        awarded: quote.id === quoteId,
                      })),
                    }
                  : item,
              ),
              costRows: current.costRows.map((row) =>
                row.id === "rebar"
                  ? {
                      ...row,
                      committed: row.committed + delta,
                      metrics: {
                        ...row.metrics,
                        commitment: row.metrics.commitment + delta,
                      },
                      events: row.events.map((event) =>
                        event.type === "commitment"
                          ? { ...event, amount: event.amount + delta, status: { ar: "محدث من RFQ", en: "Updated from RFQ" } }
                          : event,
                      ),
                    }
                  : row,
              ),
            },
            "rfq.awarded",
            { ar: "تم ترسية عرض وتحويله إلى التزام", en: "Quote awarded and converted to commitment" },
          );
        });
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
