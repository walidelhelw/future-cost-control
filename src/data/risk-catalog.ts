export interface RiskTemplate {
  id: string;
  statementAr: string;
  statementEn: string;
  category: string;
  defaultProbability: number;
  defaultImpact: number;
}

export const riskCategories = [
  { id: "financial", nameAr: "مالية", nameEn: "Financial" },
  { id: "schedule", nameAr: "جدول زمني", nameEn: "Schedule" },
  { id: "technical", nameAr: "فنية", nameEn: "Technical" },
  { id: "external", nameAr: "خارجية", nameEn: "External" },
  { id: "safety", nameAr: "سلامة", nameEn: "Safety" },
];

// Pre-loaded risks from the Excel RISK EMV sheet
export const riskCatalog: RiskTemplate[] = [
  {
    id: "R1",
    statementAr: "زيادة أسعار مواد البناء",
    statementEn: "Material price increases",
    category: "financial",
    defaultProbability: 0.7,
    defaultImpact: 0.8,
  },
  {
    id: "R2",
    statementAr: "تقلبات سعر الصرف",
    statementEn: "Currency exchange fluctuations",
    category: "financial",
    defaultProbability: 0.6,
    defaultImpact: 0.7,
  },
  {
    id: "R3",
    statementAr: "التضخم/الانكماش الاقتصادي",
    statementEn: "Inflation/deflation",
    category: "financial",
    defaultProbability: 0.5,
    defaultImpact: 0.6,
  },
  {
    id: "R4",
    statementAr: "حوادث الموقع",
    statementEn: "Site accidents",
    category: "safety",
    defaultProbability: 0.3,
    defaultImpact: 0.9,
  },
  {
    id: "R5",
    statementAr: "تأخر الموردين في التسليم",
    statementEn: "Supplier delivery delays",
    category: "schedule",
    defaultProbability: 0.6,
    defaultImpact: 0.5,
  },
  {
    id: "R6",
    statementAr: "نقص العمالة الماهرة",
    statementEn: "Skilled labor shortage",
    category: "technical",
    defaultProbability: 0.5,
    defaultImpact: 0.6,
  },
  {
    id: "R7",
    statementAr: "تغيير في نطاق العمل",
    statementEn: "Scope changes",
    category: "technical",
    defaultProbability: 0.7,
    defaultImpact: 0.7,
  },
  {
    id: "R8",
    statementAr: "ظروف جوية سيئة",
    statementEn: "Adverse weather conditions",
    category: "external",
    defaultProbability: 0.4,
    defaultImpact: 0.5,
  },
  {
    id: "R9",
    statementAr: "مشاكل في التصميم",
    statementEn: "Design issues",
    category: "technical",
    defaultProbability: 0.4,
    defaultImpact: 0.7,
  },
  {
    id: "R10",
    statementAr: "تأخر الموافقات الحكومية",
    statementEn: "Government approval delays",
    category: "external",
    defaultProbability: 0.5,
    defaultImpact: 0.6,
  },
  {
    id: "R11",
    statementAr: "مشاكل في ظروف التربة",
    statementEn: "Unforeseen ground conditions",
    category: "technical",
    defaultProbability: 0.3,
    defaultImpact: 0.8,
  },
  {
    id: "R12",
    statementAr: "نزاعات تعاقدية",
    statementEn: "Contractual disputes",
    category: "external",
    defaultProbability: 0.3,
    defaultImpact: 0.7,
  },
  {
    id: "R13",
    statementAr: "مشاكل في جودة المواد",
    statementEn: "Material quality issues",
    category: "technical",
    defaultProbability: 0.4,
    defaultImpact: 0.6,
  },
  {
    id: "R14",
    statementAr: "تأخر المقاولين من الباطن",
    statementEn: "Subcontractor delays",
    category: "schedule",
    defaultProbability: 0.5,
    defaultImpact: 0.6,
  },
  {
    id: "R15",
    statementAr: "مشاكل السيولة المالية",
    statementEn: "Cash flow problems",
    category: "financial",
    defaultProbability: 0.4,
    defaultImpact: 0.8,
  },
  {
    id: "R16",
    statementAr: "تغييرات في اللوائح والقوانين",
    statementEn: "Regulatory changes",
    category: "external",
    defaultProbability: 0.3,
    defaultImpact: 0.5,
  },
  {
    id: "R17",
    statementAr: "زيادة أسعار الوقود",
    statementEn: "Fuel price increases",
    category: "financial",
    defaultProbability: 0.6,
    defaultImpact: 0.5,
  },
];

export function getRiskById(id: string): RiskTemplate | undefined {
  return riskCatalog.find((risk) => risk.id === id);
}

export function getRisksByCategory(categoryId: string): RiskTemplate[] {
  return riskCatalog.filter((risk) => risk.category === categoryId);
}
