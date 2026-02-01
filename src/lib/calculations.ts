// Supplier Evaluation Calculations
export interface SupplierScores {
  quality: number; // 1-10
  price: number; // 1-10
  delivery: number; // 1-10
  paymentTerms: number; // 1-10
  experience: number; // 1-10
  afterSales: number; // 1-10
  riskDeduction: number; // 1-10
}

export const SUPPLIER_WEIGHTS = {
  quality: 0.3,
  price: 0.25,
  delivery: 0.2,
  paymentTerms: 0.1,
  experience: 0.1,
  afterSales: 0.05,
  riskDeduction: -0.1,
};

export function calculateSupplierScore(scores: SupplierScores): number {
  return (
    scores.quality * SUPPLIER_WEIGHTS.quality +
    scores.price * SUPPLIER_WEIGHTS.price +
    scores.delivery * SUPPLIER_WEIGHTS.delivery +
    scores.paymentTerms * SUPPLIER_WEIGHTS.paymentTerms +
    scores.experience * SUPPLIER_WEIGHTS.experience +
    scores.afterSales * SUPPLIER_WEIGHTS.afterSales +
    scores.riskDeduction * SUPPLIER_WEIGHTS.riskDeduction
  );
}

export type SupplierStatus =
  | "primary"
  | "conditional"
  | "backup"
  | "rejected";

export function getSupplierStatus(score: number): SupplierStatus {
  if (score >= 8.0) return "primary";
  if (score >= 7.0) return "conditional";
  if (score >= 6.0) return "backup";
  return "rejected";
}

export function getSupplierStatusColor(status: SupplierStatus): string {
  switch (status) {
    case "primary":
      return "bg-green-500";
    case "conditional":
      return "bg-yellow-500";
    case "backup":
      return "bg-orange-500";
    case "rejected":
      return "bg-red-500";
  }
}

// BOQ Calculations
export const BOQ_PERCENTAGES = {
  indirect: 0.152183, // 15.22%
  netProfit: 0.2, // 20%
  markup: 0.16, // 16%
};

export interface BOQCalculation {
  directValue: number;
  indirectValue: number;
  totalBeforeMarkup: number;
  markup: number;
  grandTotal: number;
}

export function calculateBOQ(
  directCost: number,
  quantity: number
): BOQCalculation {
  const directValue = directCost * quantity;
  const indirectValue =
    directValue * BOQ_PERCENTAGES.indirect * (1 + BOQ_PERCENTAGES.netProfit);
  const totalBeforeMarkup = directValue + indirectValue;
  const markup = totalBeforeMarkup * BOQ_PERCENTAGES.markup;
  const grandTotal = totalBeforeMarkup + markup;

  return {
    directValue,
    indirectValue,
    totalBeforeMarkup,
    markup,
    grandTotal,
  };
}

// Risk Assessment Calculations
export interface RiskCalculation {
  emv: number;
  category: "high" | "medium" | "low";
}

export function calculateRiskEMV(
  probability: number,
  impact: number
): RiskCalculation {
  const emv = probability * impact;
  let category: "high" | "medium" | "low";

  if (emv >= 0.49) {
    category = "high";
  } else if (emv >= 0.25) {
    category = "medium";
  } else {
    category = "low";
  }

  return { emv, category };
}

export function getRiskColor(category: "high" | "medium" | "low"): string {
  switch (category) {
    case "high":
      return "bg-red-500";
    case "medium":
      return "bg-yellow-500";
    case "low":
      return "bg-green-500";
  }
}

// Cashflow Calculations
export function calculateNPV(cashflows: number[], discountRate: number): number {
  return cashflows.reduce((npv, cf, year) => {
    return npv + cf / Math.pow(1 + discountRate, year);
  }, 0);
}

export function calculateCumulative(values: number[]): number[] {
  const cumulative: number[] = [];
  let sum = 0;
  for (const value of values) {
    sum += value;
    cumulative.push(sum);
  }
  return cumulative;
}

export function calculateFundingGap(
  cashIn: number[],
  cashOut: number[]
): number[] {
  const cumCashIn = calculateCumulative(cashIn);
  const cumCashOut = calculateCumulative(cashOut);
  return cumCashIn.map((ci, i) => ci - cumCashOut[i]);
}
