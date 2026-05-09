export type LocalizedCopy = {
  ar: string;
  en: string;
};

export type CostRow = {
  id: string;
  code: string;
  item: LocalizedCopy;
  budget: number;
  committed: number;
  actual: number;
};

export type FieldReport = {
  id: string;
  project: LocalizedCopy;
  text: string;
  progress: number;
  crew: number;
  createdAt: string;
  changeSignal: boolean;
};

export type ApprovalItem = {
  id: string;
  subject: LocalizedCopy;
  amount: number;
  status: "pending" | "approved" | "rejected";
  slaHoursLeft: number;
};

export type ChangeOrder = {
  id: string;
  sourceReportId: string;
  title: LocalizedCopy;
  costImpact: number;
  daysImpact: number;
  status: "draft" | "routed" | "approved";
};

export type Quote = {
  id: string;
  supplier: string;
  amount: number;
  leadDays: number;
  score: number;
  awarded: boolean;
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
};

export function createInitialMvpState(): V2MvpState {
  const now = new Date().toISOString();

  return {
    costRows: [
      { id: "concrete", code: "C-101", item: { ar: "خرسانة مسلحة", en: "Reinforced concrete" }, budget: 18_400_000, committed: 19_250_000, actual: 20_080_000 },
      { id: "rebar", code: "S-220", item: { ar: "حديد تسليح", en: "Rebar supply" }, budget: 22_000_000, committed: 21_400_000, actual: 20_900_000 },
      { id: "mep", code: "M-410", item: { ar: "أعمال كهروميكانيك", en: "MEP package" }, budget: 14_800_000, committed: 16_300_000, actual: 15_700_000 },
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
      },
    ],
    approvals: [
      { id: "ap-1", subject: { ar: "اعتماد أمر شراء حديد", en: "Approve rebar PO" }, amount: 8_400_000, status: "pending", slaHoursLeft: 5 },
      { id: "ap-2", subject: { ar: "اعتماد مستخلص خرسانة", en: "Approve concrete payment cert" }, amount: 3_200_000, status: "pending", slaHoursLeft: 2 },
    ],
    changeOrders: [
      { id: "co-1", sourceReportId: "fr-1", title: { ar: "تغيير سيراميك الدور الأرضي", en: "Ground-floor tile change" }, costImpact: 640_000, daysImpact: 4, status: "draft" },
    ],
    rfqs: [
      {
        id: "rfq-1",
        title: { ar: "توريد 88 طن حديد", en: "Supply 88t rebar" },
        quotes: [
          { id: "q-1", supplier: "Ezz Steel", amount: 4_840_000, leadDays: 7, score: 91, awarded: false },
          { id: "q-2", supplier: "Beshay Steel", amount: 4_720_000, leadDays: 11, score: 87, awarded: false },
          { id: "q-3", supplier: "Delta Metals", amount: 4_910_000, leadDays: 5, score: 89, awarded: false },
        ],
      },
    ],
    estimateDrafts: [],
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

export function money(value: number, locale: "ar" | "en") {
  return new Intl.NumberFormat(locale === "ar" ? "ar-EG" : "en-US", {
    maximumFractionDigits: 1,
    notation: "compact",
    style: "currency",
    currency: "EGP",
  }).format(value);
}

export function hasChangeSignal(text: string) {
  return /تغيير|المالك طلب|variation|change|scope|claim/i.test(text);
}
