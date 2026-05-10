import type { LocalizedText } from "./localize";

export type V2NavKey =
  | "home"
  | "projects"
  | "rates"
  | "productivity"
  | "estimate"
  | "estimates"
  | "boq"
  | "cost"
  | "suppliers"
  | "risks"
  | "cashflow"
  | "field"
  | "flow"
  | "change"
  | "rfq"
  | "ask"
  | "admin";

export type V2NavItem = {
  key: V2NavKey;
  href: string;
  label: LocalizedText;
  metric: LocalizedText;
};

export const navItems: V2NavItem[] = [
  { key: "home", href: "/v2", label: { ar: "مركز القيادة", en: "Command" }, metric: { ar: "12 مشروع حي", en: "12 live projects" } },
  { key: "projects", href: "/v2/projects", label: { ar: "المشاريع", en: "Projects" }, metric: { ar: "إدارة كاملة", en: "Full control" } },
  { key: "rates", href: "/v2/rates", label: { ar: "قاعدة الأسعار", en: "Rates" }, metric: { ar: "87 سعر", en: "87 rates" } },
  { key: "productivity", href: "/v2/productivity", label: { ar: "الإنتاجية", en: "Productivity" }, metric: { ar: "131 قالب", en: "131 templates" } },
  { key: "estimate", href: "/v2/estimate", label: { ar: "التقدير الذكي", en: "Estimate" }, metric: { ar: "91% ثقة", en: "91% confidence" } },
  { key: "estimates", href: "/v2/estimates", label: { ar: "التقديرات", en: "Estimates" }, metric: { ar: "تحرير BOQ", en: "BOQ editing" } },
  { key: "boq", href: "/v2/boq", label: { ar: "حاسبة البنود", en: "BOQ Calc" }, metric: { ar: "تكلفة مباشرة", en: "Direct cost" } },
  { key: "cost", href: "/v2/cost", label: { ar: "عمود التكلفة", en: "Cost Spine" }, metric: { ar: "18.4م فرق", en: "18.4M variance" } },
  { key: "suppliers", href: "/v2/suppliers", label: { ar: "الموردون", en: "Suppliers" }, metric: { ar: "7 معايير", en: "7 criteria" } },
  { key: "risks", href: "/v2/risks", label: { ar: "المخاطر", en: "Risks" }, metric: { ar: "EMV حي", en: "Live EMV" } },
  { key: "cashflow", href: "/v2/cashflow", label: { ar: "التدفق النقدي", en: "Cashflow" }, metric: { ar: "NPV وفجوة", en: "NPV/gap" } },
  { key: "field", href: "/v2/field", label: { ar: "الموقع", en: "Field" }, metric: { ar: "27 تقرير", en: "27 reports" } },
  { key: "flow", href: "/v2/flow", label: { ar: "الموافقات", en: "Flow" }, metric: { ar: "8 تنتظر", en: "8 waiting" } },
  { key: "change", href: "/v2/change", label: { ar: "أوامر التغيير", en: "Change" }, metric: { ar: "3 إنذارات", en: "3 alerts" } },
  { key: "rfq", href: "/v2/rfq", label: { ar: "طلبات الأسعار", en: "RFQ" }, metric: { ar: "14 عرض", en: "14 quotes" } },
  { key: "ask", href: "/v2/ask", label: { ar: "اسأل Future", en: "Ask Future" }, metric: { ar: "جاهز", en: "Ready" } },
  { key: "admin", href: "/v2/admin", label: { ar: "الإدارة", en: "Admin" }, metric: { ar: "صلاحيات", en: "Access" } },
];

export const moduleMetrics = [
  { key: "projects", label: { ar: "المشاريع", en: "Projects" }, value: "12", delta: { ar: "مشاريع نشطة ومفلترة", en: "active, searchable projects" } },
  { key: "rates", label: { ar: "قاعدة الأسعار", en: "Rate Database" }, value: "87", delta: { ar: "مواد وعمالة ومعدات", en: "materials, labor, equipment" } },
  { key: "productivity", label: { ar: "الإنتاجية", en: "Productivity" }, value: "131", delta: { ar: "قوالب تشغيل", en: "production templates" } },
  { key: "estimate", label: { ar: "التقدير الذكي", en: "Smart Estimate" }, value: "EGP 84.2M", delta: { ar: "+6 بنود خلال 24 ساعة", en: "+6 BOQ lines in 24h" } },
  { key: "estimates", label: { ar: "التقديرات", en: "Estimates" }, value: "9", delta: { ar: "مسودات ومراجعات", en: "drafts and reviews" } },
  { key: "boq", label: { ar: "حاسبة البنود", en: "BOQ Calculator" }, value: "4.8M", delta: { ar: "تكلفة مباشرة فورية", en: "instant direct cost" } },
  { key: "cost", label: { ar: "عمود التكلفة", en: "Cost Spine" }, value: "1.08 CPI", delta: { ar: "مشروعان فوق الميزانية", en: "2 projects over budget" } },
  { key: "suppliers", label: { ar: "الموردون", en: "Suppliers" }, value: "91/100", delta: { ar: "أفضل درجة حديد", en: "best rebar score" } },
  { key: "risks", label: { ar: "المخاطر", en: "Risks" }, value: "3 High", delta: { ar: "مخاطر عالية مفتوحة", en: "high risks open" } },
  { key: "cashflow", label: { ar: "التدفق", en: "Cashflow" }, value: "7.4M", delta: { ar: "فجوة تمويل متوقعة", en: "forecast funding gap" } },
  { key: "field", label: { ar: "وضع الموقع", en: "Field Mode" }, value: "27", delta: { ar: "تقارير موقع اليوم", en: "site reports today" } },
  { key: "flow", label: { ar: "Future Flow", en: "Future Flow" }, value: "08", delta: { ar: "موافقات قبل SLA", en: "approvals before SLA" } },
  { key: "change", label: { ar: "رادار التغيير", en: "Change Radar" }, value: "3", delta: { ar: "إشعارات تغيير محتملة", en: "potential notices" } },
];

export const tickerItems = [
  { ar: "سعر CBE: 47.85 جنيه للدولار", en: "CBE EGP/USD: 47.85" },
  { ar: "تسليمات اليوم: 18 أمر توريد", en: "Today deliveries: 18 POs" },
  { ar: "موافقات تنتظر: 8", en: "Approvals waiting: 8" },
  { ar: "أكبر احتراق: برج النيل +8.4م", en: "Biggest burn: Nile Tower +8.4M" },
  { ar: "مشاريع نشطة: 12", en: "Active projects: 12" },
  { ar: "فرق الشهر: 4.7%", en: "Monthly variance: 4.7%" },
];

export const projectPins = [
  { city: { ar: "القاهرة الجديدة", en: "New Cairo" }, name: { ar: "كمبوند لوتس", en: "Lotus Compound" }, x: 58, y: 35, alert: true, value: 84.2 },
  { city: { ar: "العاصمة الإدارية", en: "New Capital" }, name: { ar: "مبنى إداري B2", en: "Admin Block B2" }, x: 66, y: 43, alert: false, value: 42.7 },
  { city: { ar: "الإسكندرية", en: "Alexandria" }, name: { ar: "مخازن الميناء", en: "Port Warehouses" }, x: 42, y: 16, alert: true, value: 29.4 },
  { city: { ar: "العين السخنة", en: "Ain Sokhna" }, name: { ar: "منطقة صناعية", en: "Industrial Zone" }, x: 72, y: 58, alert: false, value: 51.9 },
];

export const activityItems = [
  { title: { ar: "تم استخراج 42 بند BOQ من مناقصة PDF", en: "42 BOQ items extracted from tender PDF" }, meta: { ar: "التقدير الذكي · منذ 3 دقائق", en: "Smart Estimate · 3 min ago" }, tone: "teal" },
  { title: { ar: "فاتورة خرسانة تجاوزت أمر الشراء 6.2%", en: "Concrete invoice exceeded PO by 6.2%" }, meta: { ar: "عمود التكلفة · يحتاج مراجعة", en: "Cost Spine · needs review" }, tone: "amber" },
  { title: { ar: "المهندس أحمد وافق على طلب مواد", en: "Ahmed approved material request" }, meta: { ar: "Future Flow · SLA 5:14 متبقي", en: "Future Flow · SLA 5:14 left" }, tone: "green" },
  { title: { ar: "تم رصد جملة تغيير من تقرير صوتي", en: "Variation phrase detected in voice report" }, meta: { ar: "رادار التغيير · مسودة إخطار", en: "Change Radar · notice drafted" }, tone: "rose" },
];

export const varianceData = [
  { month: "Jan", variance: 2.2, forecast: 2.8 },
  { month: "Feb", variance: 3.8, forecast: 4.1 },
  { month: "Mar", variance: 2.9, forecast: 3.4 },
  { month: "Apr", variance: 5.4, forecast: 5.8 },
  { month: "May", variance: 4.7, forecast: 4.2 },
];

export const cashflowData = [
  { month: "Jan", planned: 18, actual: 15 },
  { month: "Feb", planned: 28, actual: 31 },
  { month: "Mar", planned: 42, actual: 45 },
  { month: "Apr", planned: 58, actual: 64 },
  { month: "May", planned: 76, actual: 82 },
];

export const aiSpendData = [
  { day: "Sat", spend: 3.2 },
  { day: "Sun", spend: 4.8 },
  { day: "Mon", spend: 6.1 },
  { day: "Tue", spend: 5.4 },
  { day: "Wed", spend: 7.2 },
  { day: "Thu", spend: 6.7 },
  { day: "Fri", spend: 4.1 },
];

export const pipelineSteps = [
  { ar: "رفع الملف", en: "Upload" },
  { ar: "قراءة PDF", en: "Parse" },
  { ar: "استخراج البنود", en: "Extract" },
  { ar: "مطابقة الأسعار", en: "Match" },
  { ar: "التحقق", en: "Validate" },
  { ar: "درجة الثقة", en: "Score" },
  { ar: "مراجعة بشرية", en: "Human review" },
  { ar: "حفظ المسودة", en: "Commit draft" },
];

export const extractedBoqRows = [
  { item: "C-101", ar: "خرسانة مسلحة للأساسات", en: "Reinforced concrete foundations", unit: "m3", qty: 420, confidence: 96 },
  { item: "S-220", ar: "حديد تسليح عالي المقاومة", en: "High tensile rebar", unit: "ton", qty: 88, confidence: 91 },
  { item: "F-034", ar: "شدات خشبية للأسقف", en: "Timber formwork for slabs", unit: "m2", qty: 2600, confidence: 87 },
  { item: "M-011", ar: "عزل رطوبة بيتومين", en: "Bitumen waterproofing", unit: "m2", qty: 1450, confidence: 82 },
];
