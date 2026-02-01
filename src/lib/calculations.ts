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

// ============================================
// SMART ESTIMATE MODULE CALCULATIONS
// ============================================

// Default cost configuration
export const DEFAULT_COST_CONFIG = {
  indirectRate: 0.15, // 15%
  profitMargin: 0.20, // 20%
  contingency: 0.05, // 5%
};

// Component item for cost breakdown
export interface ComponentItem {
  rateCode: string;
  qty: number;
  description?: string;
  rate?: number;
  cost?: number;
}

// Full cost breakdown structure
export interface CostBreakdown {
  materials: {
    items: ComponentItem[];
    subtotal: number;
  };
  labor: {
    items: ComponentItem[];
    subtotal: number;
  };
  equipment: {
    items: ComponentItem[];
    subtotal: number;
  };
  directCost: number;
  indirectCost: number;
  profit: number;
  contingency: number;
  sellingPrice: number;
}

// Estimate item calculation result
export interface EstimateItemResult {
  materialCost: number;
  laborCost: number;
  equipmentCost: number;
  directCost: number;
  indirectCost: number;
  profit: number;
  sellingRate: number;
  total: number;
  breakdown: CostBreakdown;
}

// Rate lookup function type
export type RateLookup = (code: string) => number | undefined;

/**
 * Calculate cost for a single component (material, labor, or equipment)
 */
export function calculateComponentCost(
  item: ComponentItem,
  rateLookup: RateLookup
): number {
  const rate = item.rate ?? rateLookup(item.rateCode) ?? 0;
  return item.qty * rate;
}

/**
 * Calculate total for a list of components
 */
export function calculateComponentsTotal(
  items: ComponentItem[],
  rateLookup: RateLookup
): { items: ComponentItem[]; subtotal: number } {
  const calculatedItems = items.map((item) => {
    const rate = item.rate ?? rateLookup(item.rateCode) ?? 0;
    const cost = item.qty * rate;
    return { ...item, rate, cost };
  });

  const subtotal = calculatedItems.reduce((sum, item) => sum + (item.cost ?? 0), 0);
  return { items: calculatedItems, subtotal };
}

/**
 * Calculate full cost breakdown for an estimate item
 */
export function calculateEstimateItem(
  quantity: number,
  materials: ComponentItem[],
  labor: ComponentItem[],
  equipment: ComponentItem[],
  rateLookup: RateLookup,
  config: {
    indirectRate: number;
    profitMargin: number;
    contingency: number;
  } = DEFAULT_COST_CONFIG
): EstimateItemResult {
  // Calculate component costs
  const materialsResult = calculateComponentsTotal(materials, rateLookup);
  const laborResult = calculateComponentsTotal(labor, rateLookup);
  const equipmentResult = calculateComponentsTotal(equipment, rateLookup);

  // Calculate totals per unit
  const materialCost = materialsResult.subtotal;
  const laborCost = laborResult.subtotal;
  const equipmentCost = equipmentResult.subtotal;
  const directCost = materialCost + laborCost + equipmentCost;

  // Calculate indirect, profit, contingency
  const indirectCost = directCost * config.indirectRate;
  const costBeforeProfit = directCost + indirectCost;
  const profit = costBeforeProfit * config.profitMargin;
  const costBeforeContingency = costBeforeProfit + profit;
  const contingencyCost = costBeforeContingency * config.contingency;
  const sellingRate = costBeforeContingency + contingencyCost;

  // Calculate total with quantity
  const total = sellingRate * quantity;

  const breakdown: CostBreakdown = {
    materials: materialsResult,
    labor: laborResult,
    equipment: equipmentResult,
    directCost,
    indirectCost,
    profit,
    contingency: contingencyCost,
    sellingPrice: sellingRate,
  };

  return {
    materialCost,
    laborCost,
    equipmentCost,
    directCost,
    indirectCost,
    profit,
    sellingRate,
    total,
    breakdown,
  };
}

/**
 * Calculate estimate totals from all items
 */
export interface EstimateTotals {
  totalDirect: number;
  totalIndirect: number;
  totalProfit: number;
  totalContingency: number;
  totalSelling: number;
  materialsCost: number;
  laborCost: number;
  equipmentCost: number;
}

export function calculateEstimateTotals(
  items: EstimateItemResult[],
  quantities: number[]
): EstimateTotals {
  const totals = items.reduce(
    (acc, item, index) => {
      const qty = quantities[index] ?? 1;
      return {
        totalDirect: acc.totalDirect + item.directCost * qty,
        totalIndirect: acc.totalIndirect + item.indirectCost * qty,
        totalProfit: acc.totalProfit + item.profit * qty,
        totalContingency: acc.totalContingency + (item.breakdown.contingency ?? 0) * qty,
        totalSelling: acc.totalSelling + item.total,
        materialsCost: acc.materialsCost + item.materialCost * qty,
        laborCost: acc.laborCost + item.laborCost * qty,
        equipmentCost: acc.equipmentCost + item.equipmentCost * qty,
      };
    },
    {
      totalDirect: 0,
      totalIndirect: 0,
      totalProfit: 0,
      totalContingency: 0,
      totalSelling: 0,
      materialsCost: 0,
      laborCost: 0,
      equipmentCost: 0,
    }
  );

  return totals;
}

/**
 * Apply waste factor to quantity
 */
export function applyWasteFactor(quantity: number, wasteFactor: number): number {
  return quantity * wasteFactor;
}

/**
 * Calculate escalation adjustment (V2 = V1 × 0.85 × 0.05 × ((New Rate / Old Rate) - 1))
 */
export function calculateEscalation(
  baseValue: number,
  oldRate: number,
  newRate: number
): number {
  if (oldRate === 0) return 0;
  const rateChange = (newRate / oldRate) - 1;
  return baseValue * 0.85 * 0.05 * rateChange;
}

// ============================================
// VALIDATION RULES FOR ESTIMATES
// ============================================

export interface ValidationRule {
  id: string;
  name: string;
  severity: 'ERROR' | 'WARNING' | 'INFO';
  check: (data: Record<string, unknown>) => boolean;
  message: string;
  suggestion?: string;
}

export const ESTIMATE_VALIDATION_RULES: ValidationRule[] = [
  {
    id: 'RATE_BOUNDS',
    name: 'Rate within bounds',
    severity: 'WARNING',
    check: (data) => {
      const rate = data.rate as number;
      const minRate = data.minRate as number | undefined;
      const maxRate = data.maxRate as number | undefined;
      if (minRate !== undefined && rate < minRate) return false;
      if (maxRate !== undefined && rate > maxRate) return false;
      return true;
    },
    message: 'Rate is outside the acceptable range',
    suggestion: 'Review the rate and update if necessary',
  },
  {
    id: 'QUANTITY_POSITIVE',
    name: 'Positive quantity',
    severity: 'ERROR',
    check: (data) => (data.quantity as number) > 0,
    message: 'Quantity must be greater than zero',
    suggestion: 'Enter a positive quantity value',
  },
  {
    id: 'INDIRECT_MIN',
    name: 'Minimum indirect rate',
    severity: 'WARNING',
    check: (data) => (data.indirectRate as number) >= 0.12,
    message: 'Indirect rate is below the recommended minimum of 12%',
    suggestion: 'Consider increasing indirect rate to at least 12%',
  },
  {
    id: 'PROFIT_MIN',
    name: 'Minimum profit margin',
    severity: 'WARNING',
    check: (data) => (data.profitMargin as number) >= 0.15,
    message: 'Profit margin is below the recommended minimum of 15%',
    suggestion: 'Consider increasing profit margin to at least 15%',
  },
  {
    id: 'CONTINGENCY_RANGE',
    name: 'Contingency within range',
    severity: 'INFO',
    check: (data) => {
      const contingency = data.contingency as number;
      return contingency >= 0.03 && contingency <= 0.10;
    },
    message: 'Contingency is outside typical range (3-10%)',
    suggestion: 'Review project risk profile to determine appropriate contingency',
  },
  {
    id: 'MISSING_DESCRIPTION',
    name: 'Description required',
    severity: 'WARNING',
    check: (data) => Boolean(data.descriptionAr),
    message: 'Arabic description is missing',
    suggestion: 'Add Arabic description for the item',
  },
  {
    id: 'BOQ_CODE_FORMAT',
    name: 'Valid BOQ code format',
    severity: 'ERROR',
    check: (data) => {
      const code = data.boqCode as string;
      return /^[A-Z0-9]+-[A-Z0-9]+(-[A-Z0-9]+)?$/i.test(code);
    },
    message: 'BOQ code format is invalid',
    suggestion: 'Use format: CATEGORY-CODE or CATEGORY-SUB-CODE',
  },
];

/**
 * Validate estimate data against rules
 */
export function validateEstimate(
  data: Record<string, unknown>,
  rules: ValidationRule[] = ESTIMATE_VALIDATION_RULES
): { valid: boolean; errors: ValidationRule[]; warnings: ValidationRule[]; infos: ValidationRule[] } {
  const errors: ValidationRule[] = [];
  const warnings: ValidationRule[] = [];
  const infos: ValidationRule[] = [];

  for (const rule of rules) {
    if (!rule.check(data)) {
      switch (rule.severity) {
        case 'ERROR':
          errors.push(rule);
          break;
        case 'WARNING':
          warnings.push(rule);
          break;
        case 'INFO':
          infos.push(rule);
          break;
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    infos,
  };
}

// ============================================
// PRODUCTIVITY MODULE CALCULATIONS
// ============================================

import type { ConditionFactor } from '@/data/condition-factors';
import type { CrewRole } from '@/data/crew-roles';
import type { ProductivityTemplate, CrewMember } from '@/data/productivity-templates';

/**
 * Result of a productivity-based labor cost calculation
 */
export interface ProductivityCalculation {
  /** Input quantity of work */
  quantity: number;
  /** Base productivity rate (units per day per crew) */
  baseProductivityRate: number;
  /** Adjusted productivity after applying condition factors */
  adjustedProductivityRate: number;
  /** Days required to complete the work */
  daysRequired: number;
  /** Breakdown of crew cost per role */
  crewCostBreakdown: CrewCostItem[];
  /** Total daily crew cost */
  dailyCrewCost: number;
  /** Total labor cost for the work */
  totalLaborCost: number;
  /** Condition factors that were applied */
  appliedFactors: ConditionFactor[];
  /** Combined factor from all conditions (1.0 = no adjustment) */
  combinedFactor: number;
}

/**
 * Individual crew member cost breakdown
 */
export interface CrewCostItem {
  roleCode: string;
  roleName: string;
  roleNameEn?: string;
  quantity: number;
  dailyRate: number;
  totalDays: number;
  totalCost: number;
}

/**
 * Rate lookup function for crew roles
 */
export type CrewRateLookup = (roleCode: string) => CrewRole | undefined;

/**
 * Calculate labor cost based on productivity rate
 *
 * @param template - The productivity template with crew composition
 * @param quantity - Quantity of work to be done
 * @param roleLookup - Function to look up crew role details
 * @param conditionFactors - Optional array of condition factors to apply
 * @returns Full productivity calculation result
 *
 * @example
 * ```ts
 * const result = calculateProductivityCost(
 *   masonryTemplate,
 *   100, // 100 m² of brick wall
 *   getCrewRoleByCode,
 *   [getFactorById('weather-heat')]
 * );
 * // Result: ~4.3 days needed, crew cost breakdown, total labor cost
 * ```
 */
export function calculateProductivityCost(
  template: ProductivityTemplate,
  quantity: number,
  roleLookup: CrewRateLookup,
  conditionFactors: ConditionFactor[] = []
): ProductivityCalculation {
  // Calculate combined condition factor
  const combinedFactor = conditionFactors.reduce(
    (combined, factor) => combined * factor.factor,
    1.0
  );

  // Apply condition factors to productivity rate
  const adjustedProductivityRate = template.productivityRate * combinedFactor;

  // Calculate days required (quantity / adjusted productivity)
  const daysRequired = adjustedProductivityRate > 0
    ? quantity / adjustedProductivityRate
    : 0;

  // Calculate crew cost breakdown
  const crewCostBreakdown: CrewCostItem[] = template.crew.map(member => {
    const role = roleLookup(member.roleCode);
    const dailyRate = role?.dailyRate ?? 0;
    const totalCost = dailyRate * member.qty * daysRequired;

    return {
      roleCode: member.roleCode,
      roleName: role?.nameAr ?? member.description ?? member.roleCode,
      roleNameEn: role?.nameEn,
      quantity: member.qty,
      dailyRate,
      totalDays: daysRequired,
      totalCost
    };
  });

  // Calculate daily crew cost
  const dailyCrewCost = crewCostBreakdown.reduce(
    (sum, item) => sum + (item.dailyRate * item.quantity),
    0
  );

  // Calculate total labor cost
  const totalLaborCost = crewCostBreakdown.reduce(
    (sum, item) => sum + item.totalCost,
    0
  );

  return {
    quantity,
    baseProductivityRate: template.productivityRate,
    adjustedProductivityRate,
    daysRequired,
    crewCostBreakdown,
    dailyCrewCost,
    totalLaborCost,
    appliedFactors: conditionFactors,
    combinedFactor
  };
}

/**
 * Calculate labor cost for a simple crew composition (without template)
 *
 * @param crew - Array of crew members with role codes and quantities
 * @param productivityRate - Units produced per day
 * @param quantity - Total quantity of work
 * @param roleLookup - Function to look up crew role details
 * @returns Simplified productivity calculation
 */
export function calculateCrewLaborCost(
  crew: CrewMember[],
  productivityRate: number,
  quantity: number,
  roleLookup: CrewRateLookup
): {
  daysRequired: number;
  dailyCrewCost: number;
  totalLaborCost: number;
  crewSize: number;
} {
  const daysRequired = productivityRate > 0 ? quantity / productivityRate : 0;

  const dailyCrewCost = crew.reduce((sum, member) => {
    const role = roleLookup(member.roleCode);
    return sum + (role?.dailyRate ?? 0) * member.qty;
  }, 0);

  const crewSize = crew.reduce((sum, member) => sum + member.qty, 0);
  const totalLaborCost = dailyCrewCost * daysRequired;

  return {
    daysRequired,
    dailyCrewCost,
    totalLaborCost,
    crewSize
  };
}

/**
 * Calculate productivity impact from condition factors
 *
 * @param factors - Array of condition factors
 * @returns Impact analysis
 */
export function analyzeConditionImpact(
  factors: ConditionFactor[]
): {
  combinedFactor: number;
  impactPercentage: number;
  impactLevel: 'none' | 'low' | 'medium' | 'high' | 'severe';
  factorsSummary: string;
} {
  const combinedFactor = factors.reduce(
    (combined, factor) => combined * factor.factor,
    1.0
  );

  const impactPercentage = (1 - combinedFactor) * 100;

  let impactLevel: 'none' | 'low' | 'medium' | 'high' | 'severe';
  if (impactPercentage <= 0) {
    impactLevel = 'none';
  } else if (impactPercentage <= 10) {
    impactLevel = 'low';
  } else if (impactPercentage <= 25) {
    impactLevel = 'medium';
  } else if (impactPercentage <= 40) {
    impactLevel = 'high';
  } else {
    impactLevel = 'severe';
  }

  const factorsSummary = factors.map(f => f.nameAr).join('، ');

  return {
    combinedFactor,
    impactPercentage,
    impactLevel,
    factorsSummary
  };
}

/**
 * Estimate completion date based on productivity
 *
 * @param daysRequired - Number of work days needed
 * @param startDate - Start date
 * @param workDaysPerWeek - Working days per week (default: 6)
 * @returns Estimated completion date
 */
export function estimateCompletionDate(
  daysRequired: number,
  startDate: Date = new Date(),
  workDaysPerWeek: number = 6
): Date {
  const totalCalendarDays = Math.ceil(daysRequired * (7 / workDaysPerWeek));
  const completionDate = new Date(startDate);
  completionDate.setDate(completionDate.getDate() + totalCalendarDays);
  return completionDate;
}

/**
 * Compare productivity from multiple sources
 */
export interface ProductivityComparison {
  source: string;
  productivityRate: number;
  crewSize: number;
  daysRequired: number;
  estimatedCost: number;
  variance: number; // percentage from average
}

export function compareProductivitySources(
  sources: Array<{
    source: string;
    productivityRate: number;
    crewSize: number;
    dailyCrewCost: number;
  }>,
  quantity: number
): ProductivityComparison[] {
  const averageRate = sources.reduce((sum, s) => sum + s.productivityRate, 0) / sources.length;

  return sources.map(s => {
    const daysRequired = s.productivityRate > 0 ? quantity / s.productivityRate : 0;
    const estimatedCost = daysRequired * s.dailyCrewCost;
    const variance = averageRate > 0 ? ((s.productivityRate - averageRate) / averageRate) * 100 : 0;

    return {
      source: s.source,
      productivityRate: s.productivityRate,
      crewSize: s.crewSize,
      daysRequired,
      estimatedCost,
      variance
    };
  });
}
