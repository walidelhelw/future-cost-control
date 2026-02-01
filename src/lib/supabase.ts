import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our database
export interface Supplier {
  id: string;
  name: string;
  category: string;
  contact_info: {
    phone?: string;
    email?: string;
    address?: string;
  };
  created_at: string;
}

export interface SupplierEvaluation {
  id: string;
  supplier_id: string;
  quality_score: number;
  price_score: number;
  delivery_score: number;
  payment_terms_score: number;
  experience_score: number;
  after_sales_score: number;
  risk_deduction: number;
  total_score: number;
  status: string;
  evaluated_at: string;
}

export interface ProjectRisk {
  id: string;
  project_id?: string;
  risk_id: string;
  risk_statement: string;
  probability: number;
  impact: number;
  emv: number;
  response_category: string;
  mitigation_plan?: string;
  created_at: string;
}

export interface CashflowPeriod {
  id: string;
  project_id?: string;
  period: number;
  year: number;
  cash_in: number;
  cash_out: number;
  scenario: string;
  created_at: string;
}

// ============================================
// SMART ESTIMATE MODULE TYPES
// ============================================

export type RateType = 'MATERIAL' | 'LABOR' | 'EQUIPMENT' | 'SUBCONTRACTOR';
export type ProjectStatus = 'DRAFT' | 'ACTIVE' | 'ON_HOLD' | 'COMPLETED' | 'CANCELLED';
export type EstimateStatus = 'DRAFT' | 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED' | 'SUPERSEDED';

export interface RateCategory {
  id: string;
  code: string;
  name_ar: string;
  name_en: string;
  type: RateType;
  parent_id?: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  children?: RateCategory[];
  _count?: { rates: number };
}

export interface MasterRate {
  id: string;
  category_id: string;
  code: string;
  name_ar: string;
  name_en?: string;
  description?: string;
  unit: string;
  current_rate: number;
  min_rate?: number;
  max_rate?: number;
  waste_factor: number;
  effective_from: string;
  source: string;
  notes?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  category?: RateCategory;
}

export interface RateHistory {
  id: string;
  rate_id: string;
  old_value: number;
  new_value: number;
  changed_at: string;
  changed_by?: string;
  reason?: string;
  source: string;
}

export interface BOQCategory {
  id: string;
  code: string;
  name_ar: string;
  name_en?: string;
  parent_id?: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface BOQTemplate {
  id: string;
  code: string;
  name_ar: string;
  name_en?: string;
  description?: string;
  category_id?: string;
  unit: string;
  materials: ComponentItem[];
  labor: ComponentItem[];
  equipment: ComponentItem[];
  productivity_rate?: number;
  crew_size?: number;
  source: string;
  source_ref?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  category?: BOQCategory;
}

export interface ComponentItem {
  rateCode: string;
  qty: number;
  description?: string;
  rate?: number;
  cost?: number;
}

export interface Project {
  id: string;
  code: string;
  name: string;
  client: string;
  description?: string;
  project_type: string;
  location?: string;
  area?: number;
  floors?: number;
  units?: number;
  duration?: number;
  status: ProjectStatus;
  created_by?: string;
  created_at: string;
  updated_at: string;
  estimates?: Estimate[];
  _count?: { estimates: number };
}

export interface Estimate {
  id: string;
  project_id: string;
  version: number;
  name?: string;
  description?: string;
  indirect_rate: number;
  profit_margin: number;
  contingency: number;
  total_direct: number;
  total_indirect: number;
  total_profit: number;
  total_contingency: number;
  total_selling: number;
  materials_cost: number;
  labor_cost: number;
  equipment_cost: number;
  subcontractor_cost: number;
  status: EstimateStatus;
  created_by?: string;
  approved_by?: string;
  approved_at?: string;
  created_at: string;
  updated_at: string;
  project?: Project;
  items?: EstimateItem[];
  validations?: ValidationResult[];
}

export interface EstimateItem {
  id: string;
  estimate_id: string;
  boq_code: string;
  description_ar: string;
  description_en?: string;
  unit: string;
  quantity: number;
  material_cost: number;
  labor_cost: number;
  equipment_cost: number;
  direct_cost: number;
  indirect_cost: number;
  profit: number;
  selling_rate: number;
  total: number;
  breakdown: CostBreakdown;
  notes?: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

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

export interface ValidationResult {
  id: string;
  estimate_id: string;
  rule_id: string;
  rule_name: string;
  severity: 'ERROR' | 'WARNING' | 'INFO';
  message: string;
  field?: string;
  item_id?: string;
  suggestion?: string;
  is_resolved: boolean;
  resolved_at?: string;
  resolved_by?: string;
  created_at: string;
}

export interface IndirectCostConfig {
  id: string;
  code: string;
  name_ar: string;
  name_en?: string;
  description?: string;
  calc_method: string;
  percentage?: number;
  fixed_amount?: number;
  formula?: string;
  applies_to: string[];
  project_types: string[];
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}
