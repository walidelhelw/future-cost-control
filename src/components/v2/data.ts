import type { LocalizedText } from "./localize";

export type V2NavKey =
  | "home"
  | "estimate"
  | "cost"
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
  { key: "estimate", href: "/v2/estimate", label: { ar: "التقدير الذكي", en: "Estimate" }, metric: { ar: "91% ثقة", en: "91% confidence" } },
  { key: "cost", href: "/v2/cost", label: { ar: "عمود التكلفة", en: "Cost Spine" }, metric: { ar: "18.4م فرق", en: "18.4M variance" } },
  { key: "field", href: "/v2/field", label: { ar: "الموقع", en: "Field" }, metric: { ar: "27 تقرير", en: "27 reports" } },
  { key: "flow", href: "/v2/flow", label: { ar: "الموافقات", en: "Flow" }, metric: { ar: "8 تنتظر", en: "8 waiting" } },
  { key: "change", href: "/v2/change", label: { ar: "أوامر التغيير", en: "Change" }, metric: { ar: "3 إنذارات", en: "3 alerts" } },
  { key: "rfq", href: "/v2/rfq", label: { ar: "طلبات الأسعار", en: "RFQ" }, metric: { ar: "14 عرض", en: "14 quotes" } },
  { key: "ask", href: "/v2/ask", label: { ar: "اسأل Future", en: "Ask Future" }, metric: { ar: "جاهز", en: "Ready" } },
  { key: "admin", href: "/v2/admin", label: { ar: "الإدارة", en: "Admin" }, metric: { ar: "صلاحيات", en: "Access" } },
];

export const moduleMetrics = [
  { key: "estimate", label: { ar: "التقدير الذكي", en: "Smart Estimate" }, value: "EGP 84.2M", delta: { ar: "+6 بنود خلال 24 ساعة", en: "+6 BOQ lines in 24h" } },
  { key: "cost", label: { ar: "عمود التكلفة", en: "Cost Spine" }, value: "1.08 CPI", delta: { ar: "مشروعان فوق الميزانية", en: "2 projects over budget" } },
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

export const stubPages = {
  cost: {
    title: { ar: "عمود التكلفة الفعلية", en: "Actual-Cost Spine" },
    subtitle: { ar: "الميزانية ← الالتزام ← أمر الشراء ← الاستلام ← الفاتورة ← المستخلص ← الفرق", en: "Baseline → commitment → PO → GRN → invoice → payment cert → variance" },
    stat: "EGP 18.4M",
  },
  field: {
    title: { ar: "وضع الموقع", en: "Foreman Field Mode" },
    subtitle: { ar: "واجهة موبايل لتقارير الصور والصوت والعمالة دون انتظار المكتب.", en: "Mobile-first shell for photo, voice, and crew reports from site." },
    stat: "27",
  },
  flow: {
    title: { ar: "Future Flow", en: "Future Flow" },
    subtitle: { ar: "موافقات SLA ثماني ساعات مع تصعيد وسجل تدقيق.", en: "8-hour SLA approvals with escalation and audit trail." },
    stat: "08",
  },
  change: {
    title: { ar: "رادار أوامر التغيير", en: "Change Order Radar" },
    subtitle: { ar: "يلتقط طلبات المالك من تقارير الموقع ويحوّلها إلى إخطار عربي.", en: "Detects owner variation signals and drafts Arabic notices." },
    stat: "03",
  },
  rfq: {
    title: { ar: "مقارنة طلبات الأسعار", en: "RFQ Comparison" },
    subtitle: { ar: "مقارنة عروض الموردين بالسعر والمدة وشروط الدفع ونقاط الأداء.", en: "Compare supplier quotes by price, lead time, terms, and score." },
    stat: "14",
  },
  ask: {
    title: { ar: "اسأل Future", en: "Ask Future" },
    subtitle: { ar: "واجهة محادثة تنفيذية فوق البيانات المصرح بها فقط.", en: "Executive chat surface over authorized project data only." },
    stat: "AI",
  },
  admin: {
    title: { ar: "إدارة V2", en: "V2 Admin" },
    subtitle: { ar: "إعدادات المستخدمين والصلاحيات ومرجع الأسعار ضمن حدود العرض.", en: "Users, permissions, and reference data shell for the demo." },
    stat: "RBAC",
  },
} as const;
