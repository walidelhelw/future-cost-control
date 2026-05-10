import { formatV2Money, type V2Locale } from "@/components/v2/localize";

export type LocalizedCopy = {
  ar: string;
  en: string;
};

export type CostSpineMetrics = {
  baseline: number;
  commitment: number;
  po: number;
  grn: number;
  invoice: number;
  paymentCert: number;
  cpi: number;
  spi: number;
  eoc: number;
};

export type CostSpineEvent = {
  id: string;
  label: LocalizedCopy;
  type: "baseline" | "commitment" | "po" | "grn" | "invoice" | "cert" | "variance";
  amount: number;
  status: LocalizedCopy;
};

export type CostRow = {
  id: string;
  code: string;
  item: LocalizedCopy;
  budget: number;
  committed: number;
  actual: number;
  metrics: CostSpineMetrics;
  events: CostSpineEvent[];
  overrunReason: LocalizedCopy;
};

export type FieldReport = {
  id: string;
  project: LocalizedCopy;
  text: string;
  progress: number;
  crew: number;
  createdAt: string;
  changeSignal: boolean;
  captureType: "text" | "photo" | "voice" | "crew";
  offlineQueued: boolean;
  gps: string;
  materialSignal: LocalizedCopy;
};

export type ApprovalItem = {
  id: string;
  subject: LocalizedCopy;
  amount: number;
  status: "pending" | "approved" | "rejected";
  slaHoursLeft: number;
  escalation: LocalizedCopy;
  comments: string[];
  decidedAt?: string;
};

export type ChangeOrder = {
  id: string;
  sourceReportId: string;
  title: LocalizedCopy;
  costImpact: number;
  daysImpact: number;
  status: "draft" | "routed" | "approved";
  arabicNotice: string;
  approvalRoute: LocalizedCopy;
};

export type Quote = {
  id: string;
  supplier: string;
  amount: number;
  leadDays: number;
  score: number;
  awarded: boolean;
  quality: number;
  delivery: number;
  payment: number;
  risk: number;
};

export type Rfq = {
  id: string;
  title: LocalizedCopy;
  quotes: Quote[];
};

export type EstimateDraft = {
  id: string;
  fileName: string;
  hash: string;
  total: number;
  confidence: number;
  createdAt: string;
};

export type AuditEvent = {
  id: string;
  action: string;
  details: LocalizedCopy;
  createdAt: string;
};

export type V2MvpState = {
  costRows: CostRow[];
  fieldReports: FieldReport[];
  approvals: ApprovalItem[];
  changeOrders: ChangeOrder[];
  rfqs: Rfq[];
  estimateDrafts: EstimateDraft[];
  audit: AuditEvent[];
  admin: {
    roles: string[];
    aiCalls: { id: string; tool: string; costUsd: number; status: string; createdAt: string }[];
    referenceCounts: { projects: number; suppliers: number; costCodes: number; workflows: number };
  };
};

export function createInitialMvpState(): V2MvpState {
  const now = new Date().toISOString();

  return {
    costRows: [
      createCostRow("concrete", "C-101", { ar: "خرسانة مسلحة", en: "Reinforced concrete" }, 18_400_000, 19_250_000, 17_900_000, 18_120_000, 20_080_000, 12_600_000, 0.92, 0.96, { ar: "زيادة الهالك وسعر المضخة", en: "Waste and pump-rate pressure" }),
      createCostRow("rebar", "S-220", { ar: "حديد تسليح", en: "Rebar supply" }, 22_000_000, 21_400_000, 19_700_000, 18_950_000, 20_900_000, 14_100_000, 1.05, 1.01, { ar: "التزام أقل من الميزانية", en: "Commitment remains below budget" }),
      createCostRow("mep", "M-410", { ar: "أعمال كهروميكانيك", en: "MEP package" }, 14_800_000, 16_300_000, 13_900_000, 12_200_000, 15_700_000, 7_950_000, 0.88, 0.91, { ar: "تغيير مواصفات المالك", en: "Owner specification change" }),
    ],
    fieldReports: [
      {
        id: "fr-1",
        project: { ar: "كمبوند لوتس", en: "Lotus Compound" },
        text: "المالك طلب تغيير السيراميك في الدور الأرضي",
        progress: 61,
        crew: 42,
        createdAt: now,
        changeSignal: true,
        captureType: "text",
        offlineQueued: false,
        gps: "30.0444, 31.2357",
        materialSignal: { ar: "تسليم سيراميك مؤجل إلى الغد", en: "Tile delivery slipped to tomorrow" },
      },
    ],
    approvals: [
      { id: "ap-1", subject: { ar: "اعتماد أمر شراء حديد", en: "Approve rebar PO" }, amount: 8_400_000, status: "pending", slaHoursLeft: 5, escalation: { ar: "يصعد إلى مدير المشتريات بعد 5 ساعات", en: "Escalates to procurement director in 5h" }, comments: ["System: supplier score and budget guard attached."] },
      { id: "ap-2", subject: { ar: "اعتماد مستخلص خرسانة", en: "Approve concrete payment cert" }, amount: 3_200_000, status: "pending", slaHoursLeft: 2, escalation: { ar: "خطر كسر SLA اليوم", en: "At risk of breaching SLA today" }, comments: ["QS: GRN and invoice match within tolerance."] },
    ],
    changeOrders: [
      {
        id: "co-1",
        sourceReportId: "fr-1",
        title: { ar: "تغيير سيراميك الدور الأرضي", en: "Ground-floor tile change" },
        costImpact: 640_000,
        daysImpact: 4,
        status: "draft",
        arabicNotice: "إخطار تغيير: بناء على طلب المالك بتغيير نوع السيراميك في الدور الأرضي، يتوقع زيادة تكلفة قدرها 640,000 جنيه وتأثير زمني 4 أيام.",
        approvalRoute: { ar: "الموقع -> مدير المشروع -> المالك", en: "Site -> PM -> Owner" },
      },
    ],
    rfqs: [
      {
        id: "rfq-1",
        title: { ar: "توريد 88 طن حديد", en: "Supply 88t rebar" },
        quotes: [
          { id: "q-1", supplier: "Ezz Steel", amount: 4_840_000, leadDays: 7, score: 91, awarded: false, quality: 96, delivery: 91, payment: 86, risk: 92 },
          { id: "q-2", supplier: "Beshay Steel", amount: 4_720_000, leadDays: 11, score: 87, awarded: false, quality: 92, delivery: 81, payment: 94, risk: 88 },
          { id: "q-3", supplier: "Delta Metals", amount: 4_910_000, leadDays: 5, score: 89, awarded: false, quality: 88, delivery: 96, payment: 82, risk: 90 },
        ],
      },
    ],
    estimateDrafts: [],
    admin: {
      roles: ["CEO", "CFO", "Project Manager", "QS Engineer", "Foreman", "Procurement"],
      aiCalls: [
        { id: "ai-1", tool: "boq.extract", costUsd: 0.03, status: "cached", createdAt: now },
        { id: "ai-2", tool: "change.detect", costUsd: 0.01, status: "seeded", createdAt: now },
      ],
      referenceCounts: { projects: 7, suppliers: 34, costCodes: 128, workflows: 8 },
    },
    audit: [
      { id: "au-1", action: "system.seed", details: { ar: "تم تجهيز بيانات MVP التشغيلية", en: "Operational MVP data seeded" }, createdAt: now },
    ],
  };
}

export function addAudit(
  state: V2MvpState,
  action: string,
  details: LocalizedCopy,
): V2MvpState {
  return {
    ...state,
    audit: [
      {
        id: crypto.randomUUID(),
        action,
        details,
        createdAt: new Date().toISOString(),
      },
      ...state.audit,
    ].slice(0, 20),
  };
}

export function totals(rows: readonly CostRow[]) {
  return rows.reduce(
    (sum, row) => ({
      budget: sum.budget + row.budget,
      committed: sum.committed + row.committed,
      actual: sum.actual + row.actual,
    }),
    { budget: 0, committed: 0, actual: 0 },
  );
}

export function money(value: number, locale: V2Locale) {
  return formatV2Money(value, locale);
}

export function hasChangeSignal(text: string) {
  return /تغيير|المالك طلب|variation|change|scope|claim/i.test(text);
}

export function normalizeMvpState(input: Partial<V2MvpState>): V2MvpState {
  const seeded = createInitialMvpState();
  const costRows = input.costRows?.map((row, index) => {
    const fallback = seeded.costRows[index] ?? seeded.costRows[0];
    return {
      ...fallback,
      ...row,
      item: row.item ?? fallback.item,
      metrics: row.metrics ?? fallback.metrics,
      events: row.events ?? fallback.events,
      overrunReason: row.overrunReason ?? fallback.overrunReason,
    };
  }) ?? seeded.costRows;

  return {
    ...seeded,
    ...input,
    costRows,
    fieldReports: input.fieldReports?.map((report) => ({
      ...report,
      captureType: report.captureType ?? "text",
      offlineQueued: report.offlineQueued ?? false,
      gps: report.gps ?? "30.0444, 31.2357",
      materialSignal: report.materialSignal ?? { ar: "لا توجد إشارة مواد", en: "No material signal" },
    })) ?? seeded.fieldReports,
    approvals: input.approvals?.map((item) => ({
      ...item,
      escalation: item.escalation ?? { ar: "تصعيد SLA نشط", en: "SLA escalation active" },
      comments: item.comments ?? [],
    })) ?? seeded.approvals,
    changeOrders: input.changeOrders?.map((order) => ({
      ...order,
      arabicNotice: order.arabicNotice ?? `إخطار تغيير: ${order.title?.ar ?? "تغيير موقع"} بتأثير تكلفة ${order.costImpact} جنيه وتأثير زمني ${order.daysImpact} أيام.`,
      approvalRoute: order.approvalRoute ?? { ar: "الموقع -> مدير المشروع -> المالك", en: "Site -> PM -> Owner" },
    })) ?? seeded.changeOrders,
    rfqs: input.rfqs?.map((rfq, rfqIndex) => {
      const fallbackRfq = seeded.rfqs[rfqIndex] ?? seeded.rfqs[0];
      return {
        ...fallbackRfq,
        ...rfq,
        quotes: rfq.quotes.map((quote, quoteIndex) => {
          const fallbackQuote = fallbackRfq.quotes[quoteIndex] ?? fallbackRfq.quotes[0];
          return { ...fallbackQuote, ...quote };
        }),
      };
    }) ?? seeded.rfqs,
    admin: input.admin ?? seeded.admin,
    audit: input.audit ?? seeded.audit,
    estimateDrafts: input.estimateDrafts ?? seeded.estimateDrafts,
  };
}

function createCostRow(
  id: string,
  code: string,
  item: LocalizedCopy,
  budget: number,
  committed: number,
  po: number,
  grn: number,
  actual: number,
  paymentCert: number,
  cpi: number,
  spi: number,
  overrunReason: LocalizedCopy,
): CostRow {
  const variance = actual - budget;
  const eoc = actual + Math.max(committed - actual, 0) / Math.max(cpi, 0.1);

  return {
    id,
    code,
    item,
    budget,
    committed,
    actual,
    overrunReason,
    metrics: { baseline: budget, commitment: committed, po, grn, invoice: actual, paymentCert, cpi, spi, eoc },
    events: [
      { id: `${id}-baseline`, label: { ar: "الميزانية", en: "Budget" }, type: "baseline", amount: budget, status: { ar: "معتمدة", en: "Approved" } },
      { id: `${id}-commitment`, label: { ar: "التزام", en: "Commitment" }, type: "commitment", amount: committed, status: { ar: "مفتوح", en: "Open" } },
      { id: `${id}-po`, label: { ar: "أمر شراء", en: "PO" }, type: "po", amount: po, status: { ar: "مصدر", en: "Issued" } },
      { id: `${id}-grn`, label: { ar: "استلام GRN", en: "GRN" }, type: "grn", amount: grn, status: { ar: "مطابق", en: "Matched" } },
      { id: `${id}-invoice`, label: { ar: "فاتورة", en: "Invoice" }, type: "invoice", amount: actual, status: { ar: "مدققة", en: "Audited" } },
      { id: `${id}-cert`, label: { ar: "مستخلص", en: "Payment cert" }, type: "cert", amount: paymentCert, status: { ar: "قيد الاعتماد", en: "In approval" } },
      { id: `${id}-variance`, label: { ar: "فرق", en: "Variance" }, type: "variance", amount: variance, status: variance > 0 ? { ar: "تجاوز", en: "Overrun" } : { ar: "تحت السيطرة", en: "Controlled" } },
    ],
  };
}
