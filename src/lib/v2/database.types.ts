export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

type Table<Row extends Record<string, unknown>> = {
  Row: Row;
  Insert: Partial<Row>;
  Update: Partial<Row>;
  Relationships: [];
};

export type ProjectStatus =
  | "DRAFT"
  | "ACTIVE"
  | "ON_HOLD"
  | "COMPLETED"
  | "CANCELLED";

export type EstimateStatus =
  | "DRAFT"
  | "PENDING_REVIEW"
  | "APPROVED"
  | "REJECTED"
  | "SUPERSEDED";

export type RateType = "MATERIAL" | "LABOR" | "EQUIPMENT" | "SUBCONTRACTOR";

export type ProfileRow = {
  id: string;
  org_id: string | null;
  email: string | null;
  full_name: string | null;
  role: string | null;
  status: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export type ProjectRow = {
  id: string;
  org_id: string | null;
  code: string;
  name: string;
  client: string;
  description: string | null;
  project_type: string;
  location: string | null;
  area: number | null;
  floors: number | null;
  units: number | null;
  duration: number | null;
  status: ProjectStatus | null;
  created_by: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export type EstimateRow = {
  id: string;
  project_id: string;
  version: number | null;
  name: string | null;
  total_direct: number | null;
  total_selling: number | null;
  status: EstimateStatus | null;
  created_by: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export type MasterRateRow = {
  id: string;
  category_id: string;
  code: string;
  name_ar: string;
  name_en: string | null;
  unit: string;
  current_rate: number;
  min_rate: number | null;
  max_rate: number | null;
  source: string | null;
  is_active: boolean | null;
  updated_at: string | null;
};

export type RateCategoryRow = {
  id: string;
  code: string;
  name_ar: string;
  name_en: string;
  type: RateType;
  parent_id: string | null;
  is_active: boolean | null;
};

export type SupplierRow = {
  id: string;
  name: string;
  category: string;
  contact_info: Json | null;
  created_at: string | null;
  updated_at: string | null;
};

export type SupplierEvaluationRow = {
  id: string;
  supplier_id: string;
  total_score: number | null;
  status: string | null;
  evaluated_at: string | null;
};

export type ProjectRiskRow = {
  id: string;
  project_id: string | null;
  risk_id: string;
  risk_statement: string;
  category: string;
  probability: number;
  impact: number;
  emv: number | null;
  response_category: string | null;
  mitigation_plan: string | null;
  created_at: string | null;
};

export type CashflowProjectRow = {
  id: string;
  name: string;
  description: string | null;
  discount_rate: number | null;
  created_at: string | null;
};

export type CashflowPeriodRow = {
  id: string;
  project_id: string;
  period: number;
  cash_in: number | null;
  cash_out: number | null;
  scenario: string | null;
  created_at: string | null;
};

export type VarianceRow = {
  id: string;
  project_id: string;
  code: string | null;
  description: string | null;
  planned_cost: number | null;
  actual_cost: number | null;
  variance_amount: number | null;
  variance_percent: number | null;
  status: string | null;
  created_at: string | null;
};

export type EmbeddingRow = {
  id: string;
  org_id: string | null;
  project_id: string | null;
  source_table: string;
  source_id: string;
  title: string | null;
  content: string;
  metadata: Json | null;
  created_at: string | null;
};

export type AiCallLogRow = {
  id: string;
  org_id: string | null;
  user_id: string | null;
  job: string;
  model: string;
  input_tokens: number;
  output_tokens: number;
  cost_usd: number;
  latency_ms: number;
  status: string;
  error: string | null;
  created_at: string | null;
};

export type ChatHistoryRow = {
  id: string;
  user_id: string;
  org_id: string | null;
  role: string;
  content: string;
  metadata: Json | null;
  created_at: string | null;
};

export type Database = {
  public: {
    Tables: {
      profiles: Table<ProfileRow>;
      project_members: Table<{
        id: string;
        user_id: string;
        project_id: string;
        role: string | null;
        created_at: string | null;
      }>;
      role_permissions: Table<{
        id: string;
        org_id: string | null;
        role: string;
        permission: string;
        created_at: string | null;
      }>;
      rate_categories: Table<RateCategoryRow>;
      projects: Table<ProjectRow>;
      estimates: Table<EstimateRow>;
      master_rates: Table<MasterRateRow>;
      suppliers: Table<SupplierRow>;
      supplier_evaluations: Table<SupplierEvaluationRow>;
      project_risks: Table<ProjectRiskRow>;
      cashflow_projects: Table<CashflowProjectRow>;
      cashflow_periods: Table<CashflowPeriodRow>;
      variances: Table<VarianceRow>;
      embeddings: Table<EmbeddingRow>;
      ai_call_log: Table<AiCallLogRow>;
      chat_history: Table<ChatHistoryRow>;
      audit_log: Table<{
        id: string;
        entity_type: string;
        entity_id: string;
        action: string;
        user_id: string | null;
        changes: Json | null;
        created_at: string | null;
      }>;
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      project_status: ProjectStatus;
      estimate_status: EstimateStatus;
      rate_type: RateType;
    };
    CompositeTypes: Record<string, never>;
  };
};
