-- Future Cost Control Mini-Suite Database Schema
-- Version: 1.0.0

-- Note: Using gen_random_uuid() which is built into PostgreSQL 13+

-- ============================================
-- SUPPLIERS MODULE
-- ============================================

-- Suppliers table
CREATE TABLE IF NOT EXISTS suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'materials',
  contact_info JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Supplier evaluations table
CREATE TABLE IF NOT EXISTS supplier_evaluations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id UUID NOT NULL REFERENCES suppliers(id) ON DELETE CASCADE,
  quality_score DECIMAL(3,1) NOT NULL DEFAULT 5 CHECK (quality_score >= 0 AND quality_score <= 10),
  price_score DECIMAL(3,1) NOT NULL DEFAULT 5 CHECK (price_score >= 0 AND price_score <= 10),
  delivery_score DECIMAL(3,1) NOT NULL DEFAULT 5 CHECK (delivery_score >= 0 AND delivery_score <= 10),
  payment_terms_score DECIMAL(3,1) NOT NULL DEFAULT 5 CHECK (payment_terms_score >= 0 AND payment_terms_score <= 10),
  experience_score DECIMAL(3,1) NOT NULL DEFAULT 5 CHECK (experience_score >= 0 AND experience_score <= 10),
  after_sales_score DECIMAL(3,1) NOT NULL DEFAULT 5 CHECK (after_sales_score >= 0 AND after_sales_score <= 10),
  risk_deduction DECIMAL(3,1) NOT NULL DEFAULT 0 CHECK (risk_deduction >= 0 AND risk_deduction <= 10),
  -- Calculated fields
  total_score DECIMAL(4,2) GENERATED ALWAYS AS (
    quality_score * 0.30 +
    price_score * 0.25 +
    delivery_score * 0.20 +
    payment_terms_score * 0.10 +
    experience_score * 0.10 +
    after_sales_score * 0.05 -
    risk_deduction * 0.10
  ) STORED,
  status TEXT GENERATED ALWAYS AS (
    CASE
      WHEN (quality_score * 0.30 + price_score * 0.25 + delivery_score * 0.20 +
            payment_terms_score * 0.10 + experience_score * 0.10 +
            after_sales_score * 0.05 - risk_deduction * 0.10) >= 8.0
      THEN 'primary'
      WHEN (quality_score * 0.30 + price_score * 0.25 + delivery_score * 0.20 +
            payment_terms_score * 0.10 + experience_score * 0.10 +
            after_sales_score * 0.05 - risk_deduction * 0.10) >= 7.0
      THEN 'conditional'
      WHEN (quality_score * 0.30 + price_score * 0.25 + delivery_score * 0.20 +
            payment_terms_score * 0.10 + experience_score * 0.10 +
            after_sales_score * 0.05 - risk_deduction * 0.10) >= 6.0
      THEN 'backup'
      ELSE 'rejected'
    END
  ) STORED,
  evaluated_at TIMESTAMPTZ DEFAULT NOW(),
  notes TEXT
);

-- ============================================
-- RISKS MODULE
-- ============================================

-- Project risks table
CREATE TABLE IF NOT EXISTS project_risks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID,
  risk_id TEXT NOT NULL,
  risk_statement TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'financial',
  probability DECIMAL(3,2) NOT NULL DEFAULT 0.5 CHECK (probability >= 0 AND probability <= 1),
  impact DECIMAL(3,2) NOT NULL DEFAULT 0.5 CHECK (impact >= 0 AND impact <= 1),
  -- Calculated fields
  emv DECIMAL(4,2) GENERATED ALWAYS AS (probability * impact) STORED,
  response_category TEXT GENERATED ALWAYS AS (
    CASE
      WHEN probability * impact >= 0.49 THEN 'high'
      WHEN probability * impact >= 0.25 THEN 'medium'
      ELSE 'low'
    END
  ) STORED,
  mitigation_plan TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- BOQ MODULE
-- ============================================

-- BOQ estimates table
CREATE TABLE IF NOT EXISTS boq_estimates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- BOQ estimate items table
CREATE TABLE IF NOT EXISTS boq_estimate_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  estimate_id UUID NOT NULL REFERENCES boq_estimates(id) ON DELETE CASCADE,
  item_id TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  unit TEXT NOT NULL,
  unit_ar TEXT NOT NULL,
  quantity DECIMAL(12,2) NOT NULL,
  direct_cost DECIMAL(12,2) NOT NULL,
  direct_value DECIMAL(14,2) NOT NULL,
  indirect_value DECIMAL(14,2) NOT NULL,
  markup DECIMAL(14,2) NOT NULL,
  grand_total DECIMAL(14,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- CASHFLOW MODULE
-- ============================================

-- Cashflow projects table
CREATE TABLE IF NOT EXISTS cashflow_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  discount_rate DECIMAL(5,2) DEFAULT 10,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Cashflow periods table
CREATE TABLE IF NOT EXISTS cashflow_periods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES cashflow_projects(id) ON DELETE CASCADE,
  period INTEGER NOT NULL,
  cash_in DECIMAL(14,2) DEFAULT 0,
  cash_out DECIMAL(14,2) DEFAULT 0,
  -- Calculated fields are handled in application layer for cumulative
  scenario TEXT DEFAULT 'A',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_suppliers_category ON suppliers(category);
CREATE INDEX IF NOT EXISTS idx_supplier_evaluations_supplier ON supplier_evaluations(supplier_id);
CREATE INDEX IF NOT EXISTS idx_supplier_evaluations_status ON supplier_evaluations(status);
CREATE INDEX IF NOT EXISTS idx_project_risks_category ON project_risks(response_category);
CREATE INDEX IF NOT EXISTS idx_boq_estimate_items_estimate ON boq_estimate_items(estimate_id);
CREATE INDEX IF NOT EXISTS idx_cashflow_periods_project ON cashflow_periods(project_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS) - Basic setup
-- ============================================

-- Enable RLS on all tables (can be configured for multi-tenancy later)
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE supplier_evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_risks ENABLE ROW LEVEL SECURITY;
ALTER TABLE boq_estimates ENABLE ROW LEVEL SECURITY;
ALTER TABLE boq_estimate_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE cashflow_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE cashflow_periods ENABLE ROW LEVEL SECURITY;

-- For development, allow all operations (customize for production)
CREATE POLICY "Allow all for authenticated users" ON suppliers FOR ALL USING (true);
CREATE POLICY "Allow all for authenticated users" ON supplier_evaluations FOR ALL USING (true);
CREATE POLICY "Allow all for authenticated users" ON project_risks FOR ALL USING (true);
CREATE POLICY "Allow all for authenticated users" ON boq_estimates FOR ALL USING (true);
CREATE POLICY "Allow all for authenticated users" ON boq_estimate_items FOR ALL USING (true);
CREATE POLICY "Allow all for authenticated users" ON cashflow_projects FOR ALL USING (true);
CREATE POLICY "Allow all for authenticated users" ON cashflow_periods FOR ALL USING (true);

-- ============================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER suppliers_updated_at
  BEFORE UPDATE ON suppliers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER project_risks_updated_at
  BEFORE UPDATE ON project_risks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER boq_estimates_updated_at
  BEFORE UPDATE ON boq_estimates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER cashflow_projects_updated_at
  BEFORE UPDATE ON cashflow_projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
