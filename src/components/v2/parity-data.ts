import type { LocalizedText } from "./localize";

export type V2ParityModuleKey =
  | "rates"
  | "productivity"
  | "projects"
  | "estimates"
  | "suppliers"
  | "boq"
  | "risks"
  | "cashflow";

export type RateKind = "MATERIAL" | "LABOR" | "EQUIPMENT";
export type ProjectStatus = "DRAFT" | "ACTIVE" | "ON_HOLD" | "COMPLETED";
export type SupplierStatus = "primary" | "conditional" | "backup" | "rejected";
export type RiskLevel = "low" | "medium" | "high";

export type RateItem = {
  id: string;
  code: string;
  name: LocalizedText;
  type: RateKind;
  unit: string;
  rate: number;
  waste: number;
  source: string;
};

export type ProductivityTemplate = {
  id: string;
  activity: LocalizedText;
  unit: string;
  baseOutput: number;
  crew: string;
  dailyCost: number;
};

export type ProjectItem = {
  id: string;
  code: string;
  name: LocalizedText;
  client: string;
  type: string;
  status: ProjectStatus;
  area: number;
  duration: number;
  estimates: number;
};

export type EstimateLine = {
  id: string;
  description: LocalizedText;
  unit: string;
  quantity: number;
  unitRate: number;
};

export type EstimateItem = {
  id: string;
  code: string;
  project: LocalizedText;
  status: "draft" | "review" | "approved";
  lines: EstimateLine[];
};

export type SupplierScores = {
  quality: number;
  price: number;
  delivery: number;
  payment: number;
  experience: number;
  afterSales: number;
  riskDeduction: number;
};

export type SupplierItem = {
  id: string;
  name: string;
  category: string;
  scores: SupplierScores;
};

export type BoqTemplate = {
  id: string;
  description: LocalizedText;
  unit: string;
  baseRate: number;
};

export type RiskItem = {
  id: string;
  code: string;
  statement: LocalizedText;
  category: string;
  probability: number;
  impact: number;
};

export type CashflowPeriod = {
  id: string;
  month: number;
  cashIn: number;
  cashOut: number;
};

export const parityMeta: Record<V2ParityModuleKey, { title: LocalizedText; subtitle: LocalizedText; eyebrow: LocalizedText }> = {
  rates: {
    eyebrow: { ar: "مكتبة الأسعار", en: "Rate Library" },
    title: { ar: "الأسعار والتحليلات", en: "Rates and Intelligence" },
    subtitle: { ar: "بحث وتصنيف وإدارة أسعار المواد والعمالة والمعدات محليا داخل تجربة V2.", en: "Search, filter, and manage material, labor, and equipment rates locally in V2." },
  },
  productivity: {
    eyebrow: { ar: "الإنتاجية", en: "Productivity" },
    title: { ar: "حاسبة الإنتاجية", en: "Productivity Calculator" },
    subtitle: { ar: "احسب إنتاجية الطاقم وتكلفة الوحدة مع معاملات ظروف العمل.", en: "Calculate crew output and unit cost with condition factors." },
  },
  projects: {
    eyebrow: { ar: "المشاريع", en: "Projects" },
    title: { ar: "محفظة المشاريع", en: "Project Portfolio" },
    subtitle: { ar: "إضافة وتعديل وحذف المشاريع مع بحث سريع وفلاتر حالة.", en: "Add, edit, delete, search, and filter demo projects." },
  },
  estimates: {
    eyebrow: { ar: "المقايسات", en: "Estimates" },
    title: { ar: "قائمة المقايسات وبنودها", en: "Estimates and Line Items" },
    subtitle: { ar: "مقايسات تجريبية ببنود قابلة للتعديل وتحديث فوري للإجماليات.", en: "Demo estimates with editable line items and live totals." },
  },
  suppliers: {
    eyebrow: { ar: "الموردون", en: "Suppliers" },
    title: { ar: "تقييم الموردين 7 معايير", en: "7-Criteria Supplier Scoring" },
    subtitle: { ar: "تصنيف الموردين حسب الجودة والسعر والتسليم وشروط الدفع والخبرة وخدمة ما بعد البيع والمخاطر.", en: "Score suppliers by quality, price, delivery, payment, experience, after-sales, and risk." },
  },
  boq: {
    eyebrow: { ar: "BOQ", en: "BOQ" },
    title: { ar: "حاسبة بنود المقايسة", en: "BOQ Calculator" },
    subtitle: { ar: "أضف بنودا من قوالب محلية واحذف أو امسح القائمة بالكامل.", en: "Add items from local templates, remove rows, or clear the estimate." },
  },
  risks: {
    eyebrow: { ar: "المخاطر", en: "Risks" },
    title: { ar: "مصفوفة EMV للمخاطر", en: "Risk EMV Matrix" },
    subtitle: { ar: "إدارة سجل المخاطر مع الاحتمال والأثر والقيمة النقدية المتوقعة.", en: "Manage risks with probability, impact, and expected monetary value." },
  },
  cashflow: {
    eyebrow: { ar: "التدفقات النقدية", en: "Cashflow" },
    title: { ar: "NPV وفجوة التمويل", en: "NPV and Funding Gap" },
    subtitle: { ar: "عدّل معدل الخصم وشاهد NPV وفترة التعادل وأكبر فجوة تمويل.", en: "Tune discount rate and see NPV, break-even, and funding gap." },
  },
};

export const seedRates: RateItem[] = [
  { id: "r1", code: "MAT-STEEL", name: { ar: "حديد تسليح", en: "Rebar Steel" }, type: "MATERIAL", unit: "طن", rate: 42000, waste: 1.03, source: "Excel" },
  { id: "r2", code: "MAT-CONC", name: { ar: "خرسانة مسلحة", en: "Reinforced Concrete" }, type: "MATERIAL", unit: "م3", rate: 1850, waste: 1.05, source: "Excel" },
  { id: "r3", code: "LAB-MASON", name: { ar: "بناء طوب", en: "Block Mason" }, type: "LABOR", unit: "يوم", rate: 650, waste: 1, source: "Productivity" },
  { id: "r4", code: "EQP-PUMP", name: { ar: "مضخة خرسانة", en: "Concrete Pump" }, type: "EQUIPMENT", unit: "يوم", rate: 5800, waste: 1, source: "Market" },
];

export const seedProductivity: ProductivityTemplate[] = [
  { id: "p1", activity: { ar: "صب خرسانة للأسقف", en: "Slab concrete pour" }, unit: "م3", baseOutput: 42, crew: "فورمان + 8 عمال + مضخة", dailyCost: 18600 },
  { id: "p2", activity: { ar: "مباني طوب داخلي", en: "Internal blockwork" }, unit: "م2", baseOutput: 115, crew: "2 بنايين + 4 عمال", dailyCost: 7200 },
  { id: "p3", activity: { ar: "بياض داخلي", en: "Internal plaster" }, unit: "م2", baseOutput: 155, crew: "3 صنايعية + 3 عمال", dailyCost: 8100 },
];

export const seedProjects: ProjectItem[] = [
  { id: "pr1", code: "PRJ-2026-001", name: { ar: "مدرسة النخيل", en: "Al Nakheel School" }, client: "Future Education", type: "تعليمي", status: "ACTIVE", area: 6200, duration: 14, estimates: 3 },
  { id: "pr2", code: "PRJ-2026-002", name: { ar: "مجمع إداري", en: "Business Complex" }, client: "Delta Holding", type: "تجاري", status: "DRAFT", area: 9400, duration: 18, estimates: 1 },
  { id: "pr3", code: "PRJ-2026-003", name: { ar: "مخزن لوجستي", en: "Logistics Warehouse" }, client: "Nile Logistics", type: "صناعي", status: "ON_HOLD", area: 12800, duration: 10, estimates: 2 },
];

export const seedEstimates: EstimateItem[] = [
  {
    id: "e1",
    code: "EST-001",
    project: { ar: "مدرسة النخيل", en: "Al Nakheel School" },
    status: "review",
    lines: [
      { id: "l1", description: { ar: "خرسانة مسلحة للأساسات", en: "Foundation reinforced concrete" }, unit: "م3", quantity: 420, unitRate: 1850 },
      { id: "l2", description: { ar: "حديد تسليح", en: "Rebar steel" }, unit: "طن", quantity: 76, unitRate: 42000 },
    ],
  },
  {
    id: "e2",
    code: "EST-002",
    project: { ar: "مجمع إداري", en: "Business Complex" },
    status: "draft",
    lines: [
      { id: "l3", description: { ar: "أعمال حفر", en: "Excavation works" }, unit: "م3", quantity: 1300, unitRate: 95 },
      { id: "l4", description: { ar: "عزل بيتومين", en: "Bitumen waterproofing" }, unit: "م2", quantity: 860, unitRate: 145 },
    ],
  },
];

export const seedSuppliers: SupplierItem[] = [
  { id: "s1", name: "شركة الأهرام للحديد", category: "materials", scores: { quality: 9, price: 8, delivery: 8, payment: 7, experience: 9, afterSales: 7, riskDeduction: 1 } },
  { id: "s2", name: "مصنع النيل للخرسانة", category: "materials", scores: { quality: 8, price: 8.5, delivery: 7, payment: 7, experience: 8, afterSales: 6.5, riskDeduction: 1.5 } },
  { id: "s3", name: "دلتا للمعدات", category: "equipment", scores: { quality: 7, price: 7.5, delivery: 6.5, payment: 6, experience: 7, afterSales: 6, riskDeduction: 2 } },
];

export const seedBoqTemplates: BoqTemplate[] = [
  { id: "b1", description: { ar: "خرسانة عادية", en: "Plain concrete" }, unit: "م3", baseRate: 1250 },
  { id: "b2", description: { ar: "خرسانة مسلحة", en: "Reinforced concrete" }, unit: "م3", baseRate: 1850 },
  { id: "b3", description: { ar: "مباني طوب", en: "Blockwork" }, unit: "م2", baseRate: 420 },
];

export const seedRisks: RiskItem[] = [
  { id: "rk1", code: "R-01", statement: { ar: "تأخر توريد الحديد", en: "Rebar delivery delay" }, category: "procurement", probability: 0.35, impact: 850000 },
  { id: "rk2", code: "R-02", statement: { ar: "زيادة سعر الخرسانة", en: "Concrete price escalation" }, category: "cost", probability: 0.25, impact: 620000 },
  { id: "rk3", code: "R-03", statement: { ar: "تعارض رسومات الموقع", en: "Site drawing clash" }, category: "technical", probability: 0.2, impact: 410000 },
];

export const seedCashflow: CashflowPeriod[] = [
  { id: "c0", month: 0, cashIn: 0, cashOut: 3_800_000 },
  { id: "c1", month: 1, cashIn: 1_200_000, cashOut: 1_750_000 },
  { id: "c2", month: 2, cashIn: 2_400_000, cashOut: 1_900_000 },
  { id: "c3", month: 3, cashIn: 3_200_000, cashOut: 2_050_000 },
  { id: "c4", month: 4, cashIn: 3_600_000, cashOut: 1_700_000 },
];
