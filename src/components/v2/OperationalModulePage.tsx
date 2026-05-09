"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import {
  Activity,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  GitBranch,
  RotateCcw,
  ShieldCheck,
  Truck,
  XCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { money, totals } from "@/lib/v2/mvp-store";
import { pickText, type V2Locale } from "./localize";
import { useV2MvpState } from "./useV2MvpState";

export type OperationalPageKey = "admin" | "ask" | "change" | "cost" | "field" | "flow" | "rfq";

type OperationalModulePageProps = {
  locale: V2Locale;
  pageKey: OperationalPageKey;
};

export function OperationalModulePage({ locale, pageKey }: OperationalModulePageProps) {
  const t = useTranslations("v2.mvp");
  const { state, actions } = useV2MvpState();
  const [reportText, setReportText] = useState("المالك طلب تغيير السيراميك في الدور الأول");
  const [progress, setProgress] = useState(64);
  const [crew, setCrew] = useState(38);
  const costTotals = totals(state.costRows);

  return (
    <div className="mx-auto grid max-w-[1700px] gap-3 xl:grid-cols-[minmax(0,1fr)_380px]">
      <section className="space-y-3">
        <div className="rounded-md border border-white/10 bg-black/35 p-5">
          <Badge className="border-cyan-300/30 bg-cyan-300/10 text-cyan-100 hover:bg-cyan-300/10">
            {t("liveWorkflow")}
          </Badge>
          <h1 className="mt-4 text-3xl font-semibold text-white md:text-5xl">
            {t(`pages.${pageKey}.title`)}
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">
            {t(`pages.${pageKey}.subtitle`)}
          </p>
        </div>

        {pageKey === "cost" ? (
          <section className="space-y-3">
            <div className="grid gap-3 md:grid-cols-3">
              <Metric label={t("budget")} value={money(costTotals.budget, locale)} />
              <Metric label={t("committed")} value={money(costTotals.committed, locale)} />
              <Metric label={t("actual")} value={money(costTotals.actual, locale)} />
            </div>
            <div className="overflow-hidden rounded-md border border-white/10 bg-black/35">
              {state.costRows.map((row) => {
                const variance = row.actual - row.budget;
                return (
                  <div className="grid gap-3 border-t border-white/10 p-4 first:border-t-0 lg:grid-cols-[100px_1fr_160px_140px]" key={row.id}>
                    <span className="text-sm text-slate-500" dir="ltr">{row.code}</span>
                    <div>
                      <p className="font-medium text-white">{pickText(row.item, locale)}</p>
                      <p className={variance > 0 ? "text-sm text-amber-200" : "text-sm text-emerald-200"}>
                        {t("variance")}: {money(variance, locale)}
                      </p>
                    </div>
                    <span className="text-sm text-slate-300">{money(row.actual, locale)}</span>
                    <Button className="bg-cyan-300 text-black hover:bg-cyan-200" onClick={() => actions.addInvoice(row.id, 125_000)}>
                      {t("addInvoice")}
                    </Button>
                  </div>
                );
              })}
            </div>
          </section>
        ) : null}

        {pageKey === "field" ? (
          <section className="grid gap-3 lg:grid-cols-[420px_1fr]">
            <div className="rounded-md border border-cyan-300/20 bg-cyan-300/10 p-4">
              <h2 className="text-lg font-semibold text-white">{t("fieldCapture")}</h2>
              <textarea className="mt-4 min-h-32 w-full rounded border border-white/10 bg-black/35 p-3 text-sm text-white outline-none focus:border-cyan-300/50" dir="rtl" value={reportText} onChange={(event) => setReportText(event.target.value)} />
              <label className="mt-4 block text-xs text-slate-400">
                {t("progress")}: {progress}%
                <input className="mt-2 w-full accent-cyan-300" max={100} min={0} onChange={(event) => setProgress(Number(event.target.value))} type="range" value={progress} />
              </label>
              <label className="mt-4 block text-xs text-slate-400">
                {t("crew")}
                <input className="mt-2 h-10 w-full rounded border border-white/10 bg-black/35 px-3 text-white outline-none" min={1} onChange={(event) => setCrew(Number(event.target.value))} type="number" value={crew} />
              </label>
              <Button className="mt-4 w-full bg-cyan-300 text-black hover:bg-cyan-200" onClick={() => actions.submitFieldReport(reportText, progress, crew)}>
                <Activity className="me-2 h-4 w-4" />
                {t("submitReport")}
              </Button>
            </div>
            <List title={t("reports")}>
              {state.fieldReports.map((report) => (
                <Row key={report.id} meta={`${report.progress}% · ${report.crew} ${t("workers")}`} title={report.text}>
                  {report.changeSignal ? <Badge className="bg-amber-300 text-black hover:bg-amber-300">{t("changeSignal")}</Badge> : null}
                </Row>
              ))}
            </List>
          </section>
        ) : null}

        {pageKey === "flow" ? (
          <List title={t("approvalInbox")}>
            {state.approvals.map((item) => (
              <Row key={item.id} meta={`${money(item.amount, locale)} · SLA ${item.slaHoursLeft}h`} title={pickText(item.subject, locale)}>
                {item.status === "pending" ? (
                  <div className="flex gap-2">
                    <Button className="bg-emerald-300 text-black hover:bg-emerald-200" onClick={() => actions.decideApproval(item.id, "approved")} size="sm">
                      <CheckCircle2 className="me-1 h-4 w-4" /> {t("approve")}
                    </Button>
                    <Button className="border-white/10 bg-white/5 text-slate-200 hover:bg-white/10" onClick={() => actions.decideApproval(item.id, "rejected")} size="sm" variant="outline">
                      <XCircle className="me-1 h-4 w-4" /> {t("reject")}
                    </Button>
                  </div>
                ) : <Badge>{t(item.status)}</Badge>}
              </Row>
            ))}
          </List>
        ) : null}

        {pageKey === "change" ? (
          <List title={t("changeNotices")}>
            {state.changeOrders.map((order) => (
              <Row key={order.id} meta={`${money(order.costImpact, locale)} · +${order.daysImpact} ${t("days")}`} title={pickText(order.title, locale)}>
                {order.status === "draft" ? (
                  <Button className="bg-cyan-300 text-black hover:bg-cyan-200" onClick={() => actions.routeChangeOrder(order.id)} size="sm">
                    <GitBranch className="me-1 h-4 w-4" /> {t("routeApproval")}
                  </Button>
                ) : <Badge className="bg-emerald-300 text-black hover:bg-emerald-300">{t(order.status)}</Badge>}
              </Row>
            ))}
          </List>
        ) : null}

        {pageKey === "rfq" ? (
          <List title={t("quoteComparison")}>
            {state.rfqs[0]?.quotes.map((quote) => (
              <Row key={quote.id} meta={`${money(quote.amount, locale)} · ${quote.leadDays} ${t("days")} · ${quote.score}/100`} title={quote.supplier}>
                <Button className={quote.awarded ? "bg-emerald-300 text-black" : "bg-cyan-300 text-black hover:bg-cyan-200"} disabled={quote.awarded} onClick={() => actions.awardQuote("rfq-1", quote.id)} size="sm">
                  <Truck className="me-1 h-4 w-4" /> {quote.awarded ? t("awarded") : t("award")}
                </Button>
              </Row>
            ))}
          </List>
        ) : null}

        {pageKey === "ask" ? (
          <List title={t("assistantWorkbench")}>
            {["كم تكلفة المشاريع المتأخرة؟", "أفضل مورد للحديد هذا الشهر؟", "ما الموافقات التي ستكسر SLA؟"].map((query) => (
              <Row key={query} meta={t("useFloatingFuture")} title={query}>
                <Badge className="bg-cyan-300 text-black hover:bg-cyan-300">Future</Badge>
              </Row>
            ))}
          </List>
        ) : null}

        {pageKey === "admin" ? (
          <div className="grid gap-3 lg:grid-cols-3">
            <Metric label={t("roles")} value="5" />
            <Metric label={t("auditEvents")} value={String(state.audit.length)} />
            <Button className="h-full min-h-24 border-white/10 bg-white/5 text-slate-200 hover:bg-white/10" onClick={actions.reset} variant="outline">
              <RotateCcw className="me-2 h-4 w-4" /> {t("resetDemo")}
            </Button>
          </div>
        ) : null}
      </section>

      <aside className="space-y-3">
        <div className="rounded-md border border-emerald-300/20 bg-emerald-300/10 p-4">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-5 w-5 text-emerald-200" />
            <h2 className="font-semibold text-white">{t("auditTrail")}</h2>
          </div>
          <div className="mt-4 space-y-3">
            {state.audit.slice(0, 8).map((event) => (
              <div className="rounded border border-white/10 bg-black/25 p-3 text-sm" key={event.id}>
                <p className="text-white">{pickText(event.details, locale)}</p>
                <p className="mt-1 text-xs text-slate-500" dir="ltr">{event.action}</p>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-white/10 bg-black/35 p-4">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-white" dir="ltr">{value}</p>
    </div>
  );
}

function List({ children, title }: { children: ReactNode; title: string }) {
  return (
    <section className="overflow-hidden rounded-md border border-white/10 bg-black/35">
      <div className="flex items-center gap-2 border-b border-white/10 p-4">
        <ClipboardCheck className="h-5 w-5 text-cyan-200" />
        <h2 className="font-semibold text-white">{title}</h2>
      </div>
      <div>{children}</div>
    </section>
  );
}

function Row({ children, meta, title }: { children: ReactNode; meta: string; title: string }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 p-4 first:border-t-0">
      <div className="min-w-0">
        <p className="font-medium text-white"><FileText className="me-2 inline h-4 w-4 text-cyan-200" />{title}</p>
        <p className="mt-1 text-xs text-slate-500">{meta}</p>
      </div>
      {children}
    </div>
  );
}
