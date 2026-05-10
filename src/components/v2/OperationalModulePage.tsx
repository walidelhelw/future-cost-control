"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import {
  Activity,
  AlertTriangle,
  BrainCircuit,
  Camera,
  CheckCircle2,
  ClipboardCheck,
  Database,
  FileText,
  GitBranch,
  MapPin,
  Mic,
  PackageCheck,
  RotateCcw,
  ShieldCheck,
  Truck,
  UserCog,
  Users,
  WifiOff,
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
  const [approvalComment, setApprovalComment] = useState(locale === "ar" ? "تمت المراجعة مع المستندات" : "Reviewed with attached documents");
  const costTotals = totals(state.costRows);
  const copy = (ar: string, en: string) => (locale === "ar" ? ar : en);

  return (
    <div className="mx-auto grid max-w-[1700px] gap-3 xl:grid-cols-[minmax(0,1fr)_380px]">
      <section className="space-y-3">
        <div className="rounded-md border border-slate-200 bg-white/90 p-5 shadow-sm">
          <Badge className="border-cyan-200 bg-cyan-50 text-cyan-700 hover:bg-cyan-50">
            {t("liveWorkflow")}
          </Badge>
          <h1 className="mt-4 text-3xl font-semibold text-slate-950 md:text-5xl">
            {t(`pages.${pageKey}.title`)}
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
            {t(`pages.${pageKey}.subtitle`)}
          </p>
        </div>

        {pageKey === "cost" ? (
          <section className="space-y-3">
            <div className="grid gap-3 md:grid-cols-4">
              <Metric label={t("budget")} value={money(costTotals.budget, locale)} />
              <Metric label={t("committed")} value={money(costTotals.committed, locale)} />
              <Metric label={t("actual")} value={money(costTotals.actual, locale)} />
              <Metric label={copy("متوقع عند الإكمال", "EOC")} value={money(state.costRows.reduce((sum, row) => sum + row.metrics.eoc, 0), locale)} />
            </div>
            <div className="grid gap-3 xl:grid-cols-[1fr_360px]">
              <div className="space-y-3">
                {state.costRows.map((row) => {
                  const variance = row.actual - row.budget;
                  return (
                    <div className="rounded-md border border-slate-200 bg-white/90 p-4 shadow-sm" key={row.id}>
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="text-xs text-slate-500" dir="ltr">{row.code}</p>
                          <h2 className="mt-1 text-lg font-semibold text-slate-950">{pickText(row.item, locale)}</h2>
                          <p className={variance > 0 ? "mt-1 text-sm text-amber-700" : "mt-1 text-sm text-emerald-700"}>
                            {pickText(row.overrunReason, locale)} · CPI {row.metrics.cpi.toFixed(2)} · SPI {row.metrics.spi.toFixed(2)}
                          </p>
                        </div>
                        <Button className="bg-cyan-600 text-white hover:bg-cyan-500" onClick={() => actions.addInvoice(row.id, 125_000)}>
                          <FileText className="me-2 h-4 w-4" /> {t("addInvoice")}
                        </Button>
                      </div>
                      <div className="mt-4 grid gap-2 md:grid-cols-4 xl:grid-cols-7">
                        {row.events.map((event) => (
                          <div className="rounded border border-slate-200 bg-slate-50 p-3" key={event.id}>
                            <p className="text-xs font-medium text-slate-500">{pickText(event.label, locale)}</p>
                            <p className={event.type === "variance" && event.amount > 0 ? "mt-2 text-sm font-semibold text-amber-700" : "mt-2 text-sm font-semibold text-slate-950"} dir="ltr">
                              {money(event.amount, locale)}
                            </p>
                            <p className="mt-1 text-[11px] text-slate-500">{pickText(event.status, locale)}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
              <List title={copy("أعلى التجاوزات", "Top overruns")}>
                {[...state.costRows]
                  .sort((a, b) => (b.actual - b.budget) - (a.actual - a.budget))
                  .map((row) => (
                    <Row key={row.id} meta={`${copy("فرق", "Variance")} ${money(row.actual - row.budget, locale)} · EOC ${money(row.metrics.eoc, locale)}`} title={pickText(row.item, locale)}>
                      {(row.actual - row.budget) > 0 ? <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">{copy("يتطلب إجراء", "Action")}</Badge> : <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">{copy("مسيطر", "Controlled")}</Badge>}
                    </Row>
                  ))}
              </List>
            </div>
          </section>
        ) : null}

        {pageKey === "field" ? (
          <section className="grid gap-3 lg:grid-cols-[420px_1fr]">
            <div className="rounded-md border border-cyan-200 bg-cyan-50 p-4 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-950">{t("fieldCapture")}</h2>
              <textarea className="mt-4 min-h-32 w-full rounded border border-slate-200 bg-white p-3 text-sm text-slate-950 outline-none focus:border-cyan-400" dir="rtl" value={reportText} onChange={(event) => setReportText(event.target.value)} />
              <label className="mt-4 block text-xs text-slate-600">
                {t("progress")}: {progress}%
                <input className="mt-2 w-full accent-cyan-600" max={100} min={0} onChange={(event) => setProgress(Number(event.target.value))} type="range" value={progress} />
              </label>
              <label className="mt-4 block text-xs text-slate-600">
                {t("crew")}
                <input className="mt-2 h-10 w-full rounded border border-slate-200 bg-white px-3 text-slate-950 outline-none" min={1} onChange={(event) => setCrew(Number(event.target.value))} type="number" value={crew} />
              </label>
              <Button className="mt-4 w-full bg-cyan-600 text-white hover:bg-cyan-500" onClick={() => actions.submitFieldReport(reportText, progress, crew)}>
                <Activity className="me-2 h-4 w-4" />
                {t("submitReport")}
              </Button>
              <div className="mt-4 grid grid-cols-3 gap-2">
                <Button className="border-slate-200 bg-white text-slate-700 hover:bg-slate-50" onClick={() => actions.addFieldAction("photo")} size="sm" variant="outline">
                  <Camera className="me-1 h-4 w-4" /> {copy("صور", "Photo")}
                </Button>
                <Button className="border-slate-200 bg-white text-slate-700 hover:bg-slate-50" onClick={() => actions.addFieldAction("voice")} size="sm" variant="outline">
                  <Mic className="me-1 h-4 w-4" /> {copy("صوت", "Voice")}
                </Button>
                <Button className="border-slate-200 bg-white text-slate-700 hover:bg-slate-50" onClick={() => actions.addFieldAction("crew")} size="sm" variant="outline">
                  <Users className="me-1 h-4 w-4" /> {copy("طاقم", "Crew")}
                </Button>
              </div>
              <div className="mt-4 grid gap-2 text-xs text-slate-700">
                <Signal icon={<WifiOff className="h-4 w-4" />} label={copy("طابور أوفلاين", "Offline queue")} value={`${state.fieldReports.filter((report) => report.offlineQueued).length}`} />
                <Signal icon={<MapPin className="h-4 w-4" />} label="GPS" value={state.fieldReports[0]?.gps ?? "--"} />
                <Signal icon={<PackageCheck className="h-4 w-4" />} label={copy("المواد", "Materials")} value={pickText(state.fieldReports[0]?.materialSignal ?? { ar: "--", en: "--" }, locale)} />
              </div>
            </div>
            <List title={t("reports")}>
              {state.fieldReports.map((report) => (
                <Row key={report.id} meta={`${report.progress}% · ${report.crew} ${t("workers")} · ${report.captureType} · ${report.gps}`} title={report.text}>
                  {report.changeSignal ? <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">{t("changeSignal")}</Badge> : null}
                </Row>
              ))}
            </List>
          </section>
        ) : null}

        {pageKey === "flow" ? (
          <section className="grid gap-3 lg:grid-cols-[360px_1fr]">
            <div className="rounded-md border border-slate-200 bg-white/90 p-4 shadow-sm">
              <h2 className="font-semibold text-slate-950">{copy("تعليق القرار", "Decision comment")}</h2>
              <textarea className="mt-3 min-h-28 w-full rounded border border-slate-200 bg-white p-3 text-sm text-slate-950 outline-none focus:border-cyan-400" value={approvalComment} onChange={(event) => setApprovalComment(event.target.value)} />
              <div className="mt-3 rounded border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
                <AlertTriangle className="me-2 inline h-4 w-4" />
                {copy("أي قرار يضاف فوراً إلى سجل التدقيق مع تعليق المستخدم.", "Every decision writes a visible audit state with the user comment.")}
              </div>
            </div>
            <List title={t("approvalInbox")}>
              {state.approvals.map((item) => (
                <Row key={item.id} meta={`${money(item.amount, locale)} · SLA ${item.slaHoursLeft}h · ${pickText(item.escalation, locale)}`} title={pickText(item.subject, locale)}>
                  {item.status === "pending" ? (
                    <div className="flex flex-wrap gap-2">
                      <Button className="bg-emerald-600 text-white hover:bg-emerald-500" onClick={() => actions.decideApproval(item.id, "approved", approvalComment)} size="sm">
                        <CheckCircle2 className="me-1 h-4 w-4" /> {t("approve")}
                      </Button>
                      <Button className="border-slate-200 bg-white text-slate-700 hover:bg-slate-50" onClick={() => actions.decideApproval(item.id, "rejected", approvalComment)} size="sm" variant="outline">
                        <XCircle className="me-1 h-4 w-4" /> {t("reject")}
                      </Button>
                    </div>
                  ) : <Badge>{t(item.status)}</Badge>}
                  <p className="basis-full text-xs text-slate-500">{item.comments.at(-1)}</p>
                </Row>
              ))}
            </List>
          </section>
        ) : null}

        {pageKey === "change" ? (
          <List title={t("changeNotices")}>
            {state.changeOrders.map((order) => (
              <Row key={order.id} meta={`${money(order.costImpact, locale)} · +${order.daysImpact} ${t("days")} · ${pickText(order.approvalRoute, locale)}`} title={pickText(order.title, locale)}>
                <div className="w-full max-w-2xl rounded border border-slate-200 bg-slate-50 p-3 text-sm leading-6 text-slate-700" dir="rtl">
                  {order.arabicNotice}
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {order.status === "draft" ? (
                    <Button className="bg-cyan-600 text-white hover:bg-cyan-500" onClick={() => actions.routeChangeOrder(order.id)} size="sm">
                      <GitBranch className="me-1 h-4 w-4" /> {t("routeApproval")}
                    </Button>
                  ) : <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">{t(order.status)}</Badge>}
                </div>
              </Row>
            ))}
          </List>
        ) : null}

        {pageKey === "rfq" ? (
          <List title={t("quoteComparison")}>
            {state.rfqs[0]?.quotes.map((quote) => {
              const weighted = Math.round((quote.score * 0.35) + (quote.quality * 0.25) + (quote.delivery * 0.2) + (quote.payment * 0.1) + (quote.risk * 0.1));
              return (
                <Row key={quote.id} meta={`${money(quote.amount, locale)} · ${quote.leadDays} ${t("days")} · ${copy("مرجح", "Weighted")} ${weighted}/100`} title={quote.supplier}>
                  <div className="grid min-w-[260px] grid-cols-4 gap-2 text-xs text-slate-600">
                    <span>{copy("جودة", "Q")} {quote.quality}</span>
                    <span>{copy("تسليم", "D")} {quote.delivery}</span>
                    <span>{copy("دفع", "P")} {quote.payment}</span>
                    <span>{copy("مخاطر", "R")} {quote.risk}</span>
                  </div>
                  <Button className={quote.awarded ? "bg-emerald-100 text-emerald-800" : "bg-cyan-600 text-white hover:bg-cyan-500"} disabled={quote.awarded} onClick={() => actions.awardQuote("rfq-1", quote.id)} size="sm">
                    <Truck className="me-1 h-4 w-4" /> {quote.awarded ? t("awarded") : t("award")}
                  </Button>
                </Row>
              );
            })}
          </List>
        ) : null}

        {pageKey === "ask" ? (
          <List title={t("assistantWorkbench")}>
            {["كم تكلفة المشاريع المتأخرة؟", "أفضل مورد للحديد هذا الشهر؟", "ما الموافقات التي ستكسر SLA؟"].map((query) => (
              <Row key={query} meta={t("useFloatingFuture")} title={query}>
                <Badge className="bg-cyan-100 text-cyan-800 hover:bg-cyan-100">Future</Badge>
              </Row>
            ))}
          </List>
        ) : null}

        {pageKey === "admin" ? (
          <div className="grid gap-3 lg:grid-cols-3">
            <Metric label={t("roles")} value={String(state.admin.roles.length)} />
            <Metric label={t("auditEvents")} value={String(state.audit.length)} />
            <Metric label={copy("نداءات AI", "AI calls")} value={String(state.admin.aiCalls.length)} />
            <List title={copy("الأدوار", "Roles")}>
              {state.admin.roles.map((role) => (
                <Row key={role} meta={copy("صلاحيات seeded للعرض", "Seeded demo permissions")} title={role}>
                  <UserCog className="h-4 w-4 text-cyan-700" />
                </Row>
              ))}
            </List>
            <List title={copy("سجل AI", "AI call log")}>
              {state.admin.aiCalls.map((call) => (
                <Row key={call.id} meta={`$${call.costUsd.toFixed(2)} · ${call.status}`} title={call.tool}>
                  <BrainCircuit className="h-4 w-4 text-cyan-700" />
                </Row>
              ))}
            </List>
            <div className="rounded-md border border-slate-200 bg-white/90 p-4 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <Database className="h-5 w-5 text-cyan-700" />
                <h2 className="font-semibold text-slate-950">{copy("البيانات المرجعية", "Reference data")}</h2>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(state.admin.referenceCounts).map(([key, value]) => (
                  <Metric key={key} label={key} value={String(value)} />
                ))}
              </div>
            </div>
            <Button className="h-full min-h-24 border-slate-200 bg-white text-slate-700 hover:bg-slate-50" onClick={actions.reset} variant="outline">
              <RotateCcw className="me-2 h-4 w-4" /> {t("resetDemo")}
            </Button>
          </div>
        ) : null}
      </section>

      <aside className="space-y-3">
        <div className="rounded-md border border-emerald-200 bg-emerald-50 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-5 w-5 text-emerald-700" />
            <h2 className="font-semibold text-slate-950">{t("auditTrail")}</h2>
          </div>
          <div className="mt-4 space-y-3">
            {state.audit.slice(0, 8).map((event) => (
              <div className="rounded border border-emerald-200 bg-white p-3 text-sm" key={event.id}>
                <p className="text-slate-900">{pickText(event.details, locale)}</p>
                <p className="mt-1 text-xs text-slate-500" dir="ltr">{event.action}</p>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}

function Signal({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded border border-cyan-200 bg-white p-2">
      <span className="flex items-center gap-2 text-slate-500">{icon}{label}</span>
      <span className="truncate text-slate-900" dir="ltr">{value}</span>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-slate-200 bg-white/90 p-4 shadow-sm">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-slate-950" dir="ltr">{value}</p>
    </div>
  );
}

function List({ children, title }: { children: ReactNode; title: string }) {
  return (
    <section className="overflow-hidden rounded-md border border-slate-200 bg-white/90 shadow-sm">
      <div className="flex items-center gap-2 border-b border-slate-200 p-4">
        <ClipboardCheck className="h-5 w-5 text-cyan-700" />
        <h2 className="font-semibold text-slate-950">{title}</h2>
      </div>
      <div>{children}</div>
    </section>
  );
}

function Row({ children, meta, title }: { children: ReactNode; meta: string; title: string }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 p-4 first:border-t-0">
      <div className="min-w-0">
        <p className="font-medium text-slate-950"><FileText className="me-2 inline h-4 w-4 text-cyan-700" />{title}</p>
        <p className="mt-1 text-xs text-slate-500">{meta}</p>
      </div>
      {children}
    </div>
  );
}
