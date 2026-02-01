-- Smart Estimate Module Database Schema
-- Version: 1.1.0 - Adding Rate Database, Projects, and Estimates modules

-- ============================================
-- RATE DATABASE MODULE
-- ============================================

-- Rate types enum
CREATE TYPE rate_type AS ENUM ('MATERIAL', 'LABOR', 'EQUIPMENT', 'SUBCONTRACTOR');

-- Rate categories table
CREATE TABLE IF NOT EXISTS rate_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  type rate_type NOT NULL,
  parent_id UUID REFERENCES rate_categories(id),
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Master rates table
CREATE TABLE IF NOT EXISTS master_rates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES rate_categories(id),
  code TEXT UNIQUE NOT NULL,
  name_ar TEXT NOT NULL,
  name_en TEXT,
  description TEXT,
  unit TEXT NOT NULL,
  current_rate DECIMAL(12,2) NOT NULL,
  min_rate DECIMAL(12,2),
  max_rate DECIMAL(12,2),
  waste_factor DECIMAL(5,3) DEFAULT 1.000,
  effective_from TIMESTAMPTZ DEFAULT NOW(),
  source TEXT DEFAULT 'manual',
  notes TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Rate history table
CREATE TABLE IF NOT EXISTS rate_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rate_id UUID NOT NULL REFERENCES master_rates(id) ON DELETE CASCADE,
  old_value DECIMAL(12,2) NOT NULL,
  new_value DECIMAL(12,2) NOT NULL,
  changed_at TIMESTAMPTZ DEFAULT NOW(),
  changed_by TEXT,
  reason TEXT,
  source TEXT DEFAULT 'manual'
);

-- ============================================
-- BOQ TEMPLATES MODULE (Enhanced)
-- ============================================

-- BOQ categories table
CREATE TABLE IF NOT EXISTS boq_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  name_ar TEXT NOT NULL,
  name_en TEXT,
  parent_id UUID REFERENCES boq_categories(id),
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- BOQ templates table (enhanced version)
CREATE TABLE IF NOT EXISTS boq_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  name_ar TEXT NOT NULL,
  name_en TEXT,
  description TEXT,
  category_id UUID REFERENCES boq_categories(id),
  unit TEXT NOT NULL,
  materials JSONB DEFAULT '[]',
  labor JSONB DEFAULT '[]',
  equipment JSONB DEFAULT '[]',
  productivity_rate DECIMAL(10,4),
  crew_size INTEGER,
  source TEXT DEFAULT 'manual',
  source_ref TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PROJECTS MODULE
-- ============================================

-- Project status enum
CREATE TYPE project_status AS ENUM ('DRAFT', 'ACTIVE', 'ON_HOLD', 'COMPLETED', 'CANCELLED');

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  client TEXT NOT NULL,
  description TEXT,
  project_type TEXT NOT NULL DEFAULT 'RESIDENTIAL',
  location TEXT,
  area DECIMAL(12,2),
  floors INTEGER,
  units INTEGER,
  duration INTEGER,
  status project_status DEFAULT 'DRAFT',
  created_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ESTIMATES MODULE
-- ============================================

-- Estimate status enum
CREATE TYPE estimate_status AS ENUM ('DRAFT', 'PENDING_REVIEW', 'APPROVED', 'REJECTED', 'SUPERSEDED');

-- Estimates table
CREATE TABLE IF NOT EXISTS estimates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  version INTEGER DEFAULT 1,
  name TEXT,
  description TEXT,
  indirect_rate DECIMAL(5,4) DEFAULT 0.1500,
  profit_margin DECIMAL(5,4) DEFAULT 0.2000,
  contingency DECIMAL(5,4) DEFAULT 0.0500,
  total_direct DECIMAL(15,2) DEFAULT 0,
  total_indirect DECIMAL(15,2) DEFAULT 0,
  total_profit DECIMAL(15,2) DEFAULT 0,
  total_contingency DECIMAL(15,2) DEFAULT 0,
  total_selling DECIMAL(15,2) DEFAULT 0,
  materials_cost DECIMAL(15,2) DEFAULT 0,
  labor_cost DECIMAL(15,2) DEFAULT 0,
  equipment_cost DECIMAL(15,2) DEFAULT 0,
  subcontractor_cost DECIMAL(15,2) DEFAULT 0,
  status estimate_status DEFAULT 'DRAFT',
  created_by TEXT,
  approved_by TEXT,
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(project_id, version)
);

-- Estimate items table
CREATE TABLE IF NOT EXISTS estimate_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  estimate_id UUID NOT NULL REFERENCES estimates(id) ON DELETE CASCADE,
  boq_code TEXT NOT NULL,
  description_ar TEXT NOT NULL,
  description_en TEXT,
  unit TEXT NOT NULL,
  quantity DECIMAL(12,3) NOT NULL,
  material_cost DECIMAL(12,2) DEFAULT 0,
  labor_cost DECIMAL(12,2) DEFAULT 0,
  equipment_cost DECIMAL(12,2) DEFAULT 0,
  direct_cost DECIMAL(12,2) DEFAULT 0,
  indirect_cost DECIMAL(12,2) DEFAULT 0,
  profit DECIMAL(12,2) DEFAULT 0,
  selling_rate DECIMAL(12,2) DEFAULT 0,
  total DECIMAL(15,2) DEFAULT 0,
  breakdown JSONB DEFAULT '{}',
  notes TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- VALIDATION & CONFIGURATION
-- ============================================

-- Validation results table
CREATE TABLE IF NOT EXISTS validation_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  estimate_id UUID NOT NULL REFERENCES estimates(id) ON DELETE CASCADE,
  rule_id TEXT NOT NULL,
  rule_name TEXT NOT NULL,
  severity TEXT NOT NULL,
  message TEXT NOT NULL,
  field TEXT,
  item_id TEXT,
  suggestion TEXT,
  is_resolved BOOLEAN DEFAULT false,
  resolved_at TIMESTAMPTZ,
  resolved_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indirect cost configuration table
CREATE TABLE IF NOT EXISTS indirect_cost_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  name_ar TEXT NOT NULL,
  name_en TEXT,
  description TEXT,
  calc_method TEXT NOT NULL DEFAULT 'PERCENTAGE',
  percentage DECIMAL(5,4),
  fixed_amount DECIMAL(15,2),
  formula TEXT,
  applies_to TEXT[] DEFAULT ARRAY['ALL'],
  project_types TEXT[] DEFAULT ARRAY['ALL'],
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audit log table
CREATE TABLE IF NOT EXISTS audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  action TEXT NOT NULL,
  user_id TEXT,
  user_name TEXT,
  changes JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_rate_categories_type ON rate_categories(type);
CREATE INDEX IF NOT EXISTS idx_rate_categories_parent ON rate_categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_master_rates_category ON master_rates(category_id);
CREATE INDEX IF NOT EXISTS idx_master_rates_code ON master_rates(code);
CREATE INDEX IF NOT EXISTS idx_master_rates_name ON master_rates(name_ar);
CREATE INDEX IF NOT EXISTS idx_rate_history_rate ON rate_history(rate_id);
CREATE INDEX IF NOT EXISTS idx_rate_history_date ON rate_history(changed_at);
CREATE INDEX IF NOT EXISTS idx_boq_categories_parent ON boq_categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_boq_templates_category ON boq_templates(category_id);
CREATE INDEX IF NOT EXISTS idx_boq_templates_code ON boq_templates(code);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_code ON projects(code);
CREATE INDEX IF NOT EXISTS idx_estimates_project ON estimates(project_id);
CREATE INDEX IF NOT EXISTS idx_estimates_status ON estimates(status);
CREATE INDEX IF NOT EXISTS idx_estimate_items_estimate ON estimate_items(estimate_id);
CREATE INDEX IF NOT EXISTS idx_estimate_items_boq ON estimate_items(boq_code);
CREATE INDEX IF NOT EXISTS idx_validation_results_estimate ON validation_results(estimate_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_entity ON audit_log(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_date ON audit_log(created_at);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE rate_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE master_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE rate_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE boq_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE boq_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE estimates ENABLE ROW LEVEL SECURITY;
ALTER TABLE estimate_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE validation_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE indirect_cost_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- Allow all for development (customize for production)
CREATE POLICY "Allow all for rate_categories" ON rate_categories FOR ALL USING (true);
CREATE POLICY "Allow all for master_rates" ON master_rates FOR ALL USING (true);
CREATE POLICY "Allow all for rate_history" ON rate_history FOR ALL USING (true);
CREATE POLICY "Allow all for boq_categories" ON boq_categories FOR ALL USING (true);
CREATE POLICY "Allow all for boq_templates" ON boq_templates FOR ALL USING (true);
CREATE POLICY "Allow all for projects" ON projects FOR ALL USING (true);
CREATE POLICY "Allow all for estimates" ON estimates FOR ALL USING (true);
CREATE POLICY "Allow all for estimate_items" ON estimate_items FOR ALL USING (true);
CREATE POLICY "Allow all for validation_results" ON validation_results FOR ALL USING (true);
CREATE POLICY "Allow all for indirect_cost_config" ON indirect_cost_config FOR ALL USING (true);
CREATE POLICY "Allow all for audit_log" ON audit_log FOR ALL USING (true);

-- ============================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================

CREATE TRIGGER rate_categories_updated_at
  BEFORE UPDATE ON rate_categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER master_rates_updated_at
  BEFORE UPDATE ON master_rates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER boq_categories_updated_at
  BEFORE UPDATE ON boq_categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER boq_templates_updated_at
  BEFORE UPDATE ON boq_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER estimates_updated_at
  BEFORE UPDATE ON estimates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER estimate_items_updated_at
  BEFORE UPDATE ON estimate_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER indirect_cost_config_updated_at
  BEFORE UPDATE ON indirect_cost_config
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- ============================================
-- SEED DATA
-- ============================================

-- Insert default rate categories
INSERT INTO rate_categories (code, name_ar, name_en, type, sort_order) VALUES
  ('MAT', 'المواد', 'Materials', 'MATERIAL', 1),
  ('LAB', 'العمالة', 'Labor', 'LABOR', 2),
  ('EQP', 'المعدات', 'Equipment', 'EQUIPMENT', 3),
  ('SUB', 'المقاولين الفرعيين', 'Subcontractors', 'SUBCONTRACTOR', 4)
ON CONFLICT (code) DO NOTHING;

-- Insert material subcategories
INSERT INTO rate_categories (code, name_ar, name_en, type, parent_id, sort_order)
SELECT 'MAT-CON', 'الخرسانة', 'Concrete', 'MATERIAL', id, 1
FROM rate_categories WHERE code = 'MAT'
ON CONFLICT (code) DO NOTHING;

INSERT INTO rate_categories (code, name_ar, name_en, type, parent_id, sort_order)
SELECT 'MAT-STL', 'الحديد', 'Steel', 'MATERIAL', id, 2
FROM rate_categories WHERE code = 'MAT'
ON CONFLICT (code) DO NOTHING;

INSERT INTO rate_categories (code, name_ar, name_en, type, parent_id, sort_order)
SELECT 'MAT-BLK', 'الطوب والبلوك', 'Blocks & Bricks', 'MATERIAL', id, 3
FROM rate_categories WHERE code = 'MAT'
ON CONFLICT (code) DO NOTHING;

-- Insert BOQ categories
INSERT INTO boq_categories (code, name_ar, name_en, sort_order) VALUES
  ('STR', 'الأعمال الإنشائية', 'Structural Works', 1),
  ('EXC', 'أعمال الحفر', 'Excavation Works', 2),
  ('MAS', 'أعمال البناء', 'Masonry Works', 3),
  ('FIN', 'أعمال التشطيبات', 'Finishing Works', 4),
  ('MEP', 'الأعمال الكهروميكانيكية', 'MEP Works', 5)
ON CONFLICT (code) DO NOTHING;

-- Insert default indirect cost configuration
INSERT INTO indirect_cost_config (code, name_ar, name_en, calc_method, percentage, applies_to, project_types) VALUES
  ('IND-SITE', 'مصاريف الموقع', 'Site Overhead', 'PERCENTAGE', 0.0800, ARRAY['ALL'], ARRAY['ALL']),
  ('IND-HEAD', 'مصاريف إدارية', 'Head Office Overhead', 'PERCENTAGE', 0.0500, ARRAY['ALL'], ARRAY['ALL']),
  ('IND-INS', 'التأمينات', 'Insurance', 'PERCENTAGE', 0.0200, ARRAY['ALL'], ARRAY['ALL'])
ON CONFLICT (code) DO NOTHING;
