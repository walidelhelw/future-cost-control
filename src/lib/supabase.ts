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
