-- V2 foundation: identity, RLS, AI logs, reference data, and cost spine.
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'viewer',
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('invited','active','disabled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS roles (
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  label TEXT NOT NULL,
  PRIMARY KEY (org_id, name)
);

CREATE TABLE IF NOT EXISTS role_permissions (
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  permission TEXT NOT NULL,
  PRIMARY KEY (org_id, role, permission)
);

ALTER TABLE projects ADD COLUMN IF NOT EXISTS org_id UUID REFERENCES organizations(id);
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS org_id UUID REFERENCES organizations(id);
ALTER TABLE project_risks ADD COLUMN IF NOT EXISTS org_id UUID REFERENCES organizations(id);
ALTER TABLE boq_estimates ADD COLUMN IF NOT EXISTS org_id UUID REFERENCES organizations(id);
ALTER TABLE cashflow_projects ADD COLUMN IF NOT EXISTS org_id UUID REFERENCES organizations(id);
ALTER TABLE audit_log ADD COLUMN IF NOT EXISTS org_id UUID REFERENCES organizations(id);
ALTER TABLE audit_log ADD COLUMN IF NOT EXISTS project_id UUID;
ALTER TABLE audit_log ALTER COLUMN entity_id DROP NOT NULL;

ALTER TABLE rate_categories ADD COLUMN IF NOT EXISTS org_id UUID REFERENCES organizations(id);
ALTER TABLE rate_categories ADD COLUMN IF NOT EXISTS is_global BOOLEAN DEFAULT true;
ALTER TABLE master_rates ADD COLUMN IF NOT EXISTS org_id UUID REFERENCES organizations(id);
ALTER TABLE master_rates ADD COLUMN IF NOT EXISTS is_global BOOLEAN DEFAULT true;
ALTER TABLE boq_categories ADD COLUMN IF NOT EXISTS org_id UUID REFERENCES organizations(id);
ALTER TABLE boq_categories ADD COLUMN IF NOT EXISTS is_global BOOLEAN DEFAULT true;
ALTER TABLE boq_templates ADD COLUMN IF NOT EXISTS org_id UUID REFERENCES organizations(id);
ALTER TABLE boq_templates ADD COLUMN IF NOT EXISTS is_global BOOLEAN DEFAULT true;
ALTER TABLE indirect_cost_config ADD COLUMN IF NOT EXISTS org_id UUID REFERENCES organizations(id);
ALTER TABLE indirect_cost_config ADD COLUMN IF NOT EXISTS is_global BOOLEAN DEFAULT true;

CREATE TABLE IF NOT EXISTS project_members (
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'viewer',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (project_id, user_id)
);

CREATE TABLE IF NOT EXISTS ai_call_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  job TEXT NOT NULL,
  model TEXT NOT NULL,
  input_tokens INTEGER NOT NULL DEFAULT 0,
  output_tokens INTEGER NOT NULL DEFAULT 0,
  cost_usd NUMERIC(12,6) NOT NULL DEFAULT 0,
  latency_ms INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'success',
  error TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS chat_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user','assistant','tool')),
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS embeddings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  source_table TEXT NOT NULL,
  source_id UUID,
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  embedding vector(3072),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS v2_reference_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  kind TEXT NOT NULL,
  code TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  name_en TEXT,
  payload JSONB NOT NULL DEFAULT '{}',
  is_global BOOLEAN NOT NULL DEFAULT true,
  effective_from DATE NOT NULL DEFAULT CURRENT_DATE,
  source TEXT NOT NULL DEFAULT 'v1_static_migration',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (org_id, kind, code, effective_from)
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_v2_reference_global_unique
  ON v2_reference_data(kind, code, effective_from)
  WHERE org_id IS NULL;

CREATE TABLE IF NOT EXISTS budget_baselines (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), org_id UUID NOT NULL REFERENCES organizations(id), project_id UUID NOT NULL REFERENCES projects(id), code TEXT NOT NULL, name TEXT NOT NULL, amount NUMERIC(15,2) NOT NULL DEFAULT 0, created_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS commitments (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), org_id UUID NOT NULL REFERENCES organizations(id), project_id UUID NOT NULL REFERENCES projects(id), supplier_id UUID REFERENCES suppliers(id), amount NUMERIC(15,2) NOT NULL DEFAULT 0, status TEXT NOT NULL DEFAULT 'draft', created_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS pos (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), org_id UUID NOT NULL REFERENCES organizations(id), project_id UUID NOT NULL REFERENCES projects(id), commitment_id UUID REFERENCES commitments(id), po_number TEXT NOT NULL, amount NUMERIC(15,2) NOT NULL DEFAULT 0, status TEXT NOT NULL DEFAULT 'issued', created_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS grns (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), org_id UUID NOT NULL REFERENCES organizations(id), project_id UUID NOT NULL REFERENCES projects(id), po_id UUID REFERENCES pos(id), grn_number TEXT NOT NULL, received_at DATE, amount NUMERIC(15,2) NOT NULL DEFAULT 0, created_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS invoices (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), org_id UUID NOT NULL REFERENCES organizations(id), project_id UUID NOT NULL REFERENCES projects(id), po_id UUID REFERENCES pos(id), grn_id UUID REFERENCES grns(id), invoice_number TEXT NOT NULL, amount NUMERIC(15,2) NOT NULL DEFAULT 0, status TEXT NOT NULL DEFAULT 'pending', created_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS payment_certs (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), org_id UUID NOT NULL REFERENCES organizations(id), project_id UUID NOT NULL REFERENCES projects(id), invoice_id UUID REFERENCES invoices(id), cert_number TEXT NOT NULL, amount NUMERIC(15,2) NOT NULL DEFAULT 0, status TEXT NOT NULL DEFAULT 'draft', created_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS variances (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), org_id UUID NOT NULL REFERENCES organizations(id), project_id UUID NOT NULL REFERENCES projects(id), source_table TEXT NOT NULL, source_id UUID, variance_amount NUMERIC(15,2) NOT NULL DEFAULT 0, severity TEXT NOT NULL DEFAULT 'medium', created_at TIMESTAMPTZ DEFAULT NOW());

CREATE TABLE IF NOT EXISTS ai_jobs (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), org_id UUID NOT NULL REFERENCES organizations(id), user_id UUID REFERENCES auth.users(id), job_type TEXT NOT NULL, file_hash TEXT, status TEXT NOT NULL DEFAULT 'queued', result JSONB DEFAULT '{}', cost_usd NUMERIC(12,6) DEFAULT 0, created_at TIMESTAMPTZ DEFAULT NOW(), UNIQUE (org_id, job_type, file_hash));
CREATE TABLE IF NOT EXISTS tenders_ai (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), org_id UUID NOT NULL REFERENCES organizations(id), project_id UUID REFERENCES projects(id), ai_job_id UUID REFERENCES ai_jobs(id), source_file_path TEXT, extracted_json JSONB DEFAULT '{}', confidence NUMERIC(5,2) DEFAULT 0, created_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS daily_reports (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), org_id UUID NOT NULL REFERENCES organizations(id), project_id UUID NOT NULL REFERENCES projects(id), user_id UUID REFERENCES auth.users(id), report_date DATE NOT NULL DEFAULT CURRENT_DATE, payload JSONB DEFAULT '{}', created_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS workflows (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), org_id UUID NOT NULL REFERENCES organizations(id), name TEXT NOT NULL, type TEXT NOT NULL, steps JSONB NOT NULL DEFAULT '[]', is_active BOOLEAN DEFAULT true, created_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS approvals (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), org_id UUID NOT NULL REFERENCES organizations(id), project_id UUID REFERENCES projects(id), workflow_id UUID REFERENCES workflows(id), subject TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'pending', created_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS approval_history (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), org_id UUID NOT NULL REFERENCES organizations(id), approval_id UUID NOT NULL REFERENCES approvals(id), actor_id UUID REFERENCES auth.users(id), action TEXT NOT NULL, comment TEXT, created_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS change_orders (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), org_id UUID NOT NULL REFERENCES organizations(id), project_id UUID NOT NULL REFERENCES projects(id), title TEXT NOT NULL, amount NUMERIC(15,2) DEFAULT 0, status TEXT DEFAULT 'draft', created_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS rfqs (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), org_id UUID NOT NULL REFERENCES organizations(id), project_id UUID REFERENCES projects(id), title TEXT NOT NULL, status TEXT DEFAULT 'draft', created_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS rfq_quotes (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), org_id UUID NOT NULL REFERENCES organizations(id), rfq_id UUID NOT NULL REFERENCES rfqs(id), supplier_id UUID REFERENCES suppliers(id), amount NUMERIC(15,2) DEFAULT 0, lead_time_days INTEGER, payload JSONB DEFAULT '{}', created_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS notifications (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), org_id UUID NOT NULL REFERENCES organizations(id), user_id UUID REFERENCES auth.users(id), channel TEXT NOT NULL DEFAULT 'in_app', subject TEXT NOT NULL, body TEXT NOT NULL, read_at TIMESTAMPTZ, created_at TIMESTAMPTZ DEFAULT NOW());

CREATE OR REPLACE FUNCTION v2_current_org_id() RETURNS UUID LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$ SELECT org_id FROM profiles WHERE id = auth.uid() AND status = 'active' $$;
CREATE OR REPLACE FUNCTION v2_current_role() RETURNS TEXT LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$ SELECT role FROM profiles WHERE id = auth.uid() AND status = 'active' $$;
CREATE OR REPLACE FUNCTION v2_can_access_project(project_uuid UUID) RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$ SELECT EXISTS (SELECT 1 FROM projects p WHERE p.id = project_uuid AND p.org_id = v2_current_org_id() AND (v2_current_role() IN ('admin','executive') OR EXISTS (SELECT 1 FROM project_members pm WHERE pm.project_id = project_uuid AND pm.user_id = auth.uid()))) $$;
CREATE OR REPLACE FUNCTION v2_same_org(target_org UUID) RETURNS BOOLEAN LANGUAGE SQL STABLE AS $$ SELECT target_org IS NOT NULL AND target_org = v2_current_org_id() $$;

DO $$ DECLARE t TEXT; BEGIN
  FOREACH t IN ARRAY ARRAY['organizations','profiles','roles','role_permissions','project_members','ai_call_log','chat_history','embeddings','v2_reference_data','budget_baselines','commitments','pos','grns','invoices','payment_certs','variances','ai_jobs','tenders_ai','daily_reports','workflows','approvals','approval_history','change_orders','rfqs','rfq_quotes','notifications'] LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', t);
  END LOOP;
END $$;

DROP POLICY IF EXISTS "Allow all for authenticated users" ON suppliers;
DROP POLICY IF EXISTS "Allow all for authenticated users" ON supplier_evaluations;
DROP POLICY IF EXISTS "Allow all for authenticated users" ON project_risks;
DROP POLICY IF EXISTS "Allow all for authenticated users" ON boq_estimates;
DROP POLICY IF EXISTS "Allow all for authenticated users" ON boq_estimate_items;
DROP POLICY IF EXISTS "Allow all for authenticated users" ON cashflow_projects;
DROP POLICY IF EXISTS "Allow all for authenticated users" ON cashflow_periods;
DROP POLICY IF EXISTS "Allow all for projects" ON projects;
DROP POLICY IF EXISTS "Allow all for estimates" ON estimates;
DROP POLICY IF EXISTS "Allow all for estimate_items" ON estimate_items;
DROP POLICY IF EXISTS "Allow all for validation_results" ON validation_results;

CREATE POLICY "org member read organizations" ON organizations FOR SELECT USING (id = v2_current_org_id());
CREATE POLICY "profile owner read" ON profiles FOR SELECT USING (org_id = v2_current_org_id());
CREATE POLICY "profile owner update" ON profiles FOR UPDATE USING (id = auth.uid()) WITH CHECK (id = auth.uid());
CREATE POLICY "org scoped roles" ON roles FOR SELECT USING (org_id = v2_current_org_id());
CREATE POLICY "org scoped permissions" ON role_permissions FOR SELECT USING (org_id = v2_current_org_id());
CREATE POLICY "project member read" ON project_members FOR SELECT USING (org_id = v2_current_org_id());
CREATE POLICY "project member admin write" ON project_members FOR ALL USING (org_id = v2_current_org_id() AND v2_current_role() IN ('admin','executive')) WITH CHECK (org_id = v2_current_org_id());
CREATE POLICY "ai log org read" ON ai_call_log FOR SELECT USING (org_id = v2_current_org_id() OR user_id = auth.uid());
CREATE POLICY "chat owner access" ON chat_history FOR ALL USING (org_id = v2_current_org_id() AND user_id = auth.uid()) WITH CHECK (org_id = v2_current_org_id() AND user_id = auth.uid());
CREATE POLICY "embedding org read" ON embeddings FOR SELECT USING (org_id = v2_current_org_id() AND (project_id IS NULL OR v2_can_access_project(project_id)));
CREATE POLICY "reference org read" ON v2_reference_data FOR SELECT USING (is_global OR org_id = v2_current_org_id());
CREATE POLICY "reference org write" ON v2_reference_data FOR ALL USING (org_id = v2_current_org_id()) WITH CHECK (org_id = v2_current_org_id());

CREATE POLICY "v2 projects scoped" ON projects FOR ALL USING (v2_can_access_project(id)) WITH CHECK (org_id = v2_current_org_id());
CREATE POLICY "v2 suppliers scoped" ON suppliers FOR ALL USING (org_id = v2_current_org_id()) WITH CHECK (org_id = v2_current_org_id());
CREATE POLICY "v2 supplier_evals scoped" ON supplier_evaluations FOR ALL USING (EXISTS (SELECT 1 FROM suppliers s WHERE s.id = supplier_id AND v2_same_org(s.org_id)));
CREATE POLICY "v2 risks scoped" ON project_risks FOR ALL USING (org_id = v2_current_org_id() AND (project_id IS NULL OR v2_can_access_project(project_id))) WITH CHECK (org_id = v2_current_org_id());
CREATE POLICY "v2 boq_estimates scoped" ON boq_estimates FOR ALL USING (org_id = v2_current_org_id() AND (project_id IS NULL OR v2_can_access_project(project_id))) WITH CHECK (org_id = v2_current_org_id());
CREATE POLICY "v2 boq_items scoped" ON boq_estimate_items FOR ALL USING (EXISTS (SELECT 1 FROM boq_estimates b WHERE b.id = estimate_id AND v2_same_org(b.org_id)));
CREATE POLICY "v2 cashflow_projects scoped" ON cashflow_projects FOR ALL USING (org_id = v2_current_org_id()) WITH CHECK (org_id = v2_current_org_id());
CREATE POLICY "v2 cashflow_periods scoped" ON cashflow_periods FOR ALL USING (EXISTS (SELECT 1 FROM cashflow_projects c WHERE c.id = project_id AND v2_same_org(c.org_id)));
CREATE POLICY "v2 estimates scoped" ON estimates FOR ALL USING (v2_can_access_project(project_id)) WITH CHECK (v2_can_access_project(project_id));
CREATE POLICY "v2 estimate_items scoped" ON estimate_items FOR ALL USING (EXISTS (SELECT 1 FROM estimates e WHERE e.id = estimate_id AND v2_can_access_project(e.project_id)));
CREATE POLICY "v2 validation scoped" ON validation_results FOR ALL USING (EXISTS (SELECT 1 FROM estimates e WHERE e.id = estimate_id AND v2_can_access_project(e.project_id)));
CREATE POLICY "v2 audit scoped" ON audit_log FOR SELECT USING (org_id = v2_current_org_id());

CREATE POLICY "global rate_categories read" ON rate_categories FOR SELECT USING (is_global OR org_id = v2_current_org_id());
CREATE POLICY "global master_rates read" ON master_rates FOR SELECT USING (is_global OR org_id = v2_current_org_id());
CREATE POLICY "global rate_history read" ON rate_history FOR SELECT USING (EXISTS (SELECT 1 FROM master_rates r WHERE r.id = rate_id AND (r.is_global OR v2_same_org(r.org_id))));
CREATE POLICY "global boq_categories read" ON boq_categories FOR SELECT USING (is_global OR org_id = v2_current_org_id());
CREATE POLICY "global boq_templates read" ON boq_templates FOR SELECT USING (is_global OR org_id = v2_current_org_id());
CREATE POLICY "global indirect_config read" ON indirect_cost_config FOR SELECT USING (is_global OR org_id = v2_current_org_id());

CREATE POLICY "cost spine project scoped" ON budget_baselines FOR ALL USING (v2_can_access_project(project_id)) WITH CHECK (org_id = v2_current_org_id());
CREATE POLICY "commitments project scoped" ON commitments FOR ALL USING (v2_can_access_project(project_id)) WITH CHECK (org_id = v2_current_org_id());
CREATE POLICY "pos project scoped" ON pos FOR ALL USING (v2_can_access_project(project_id)) WITH CHECK (org_id = v2_current_org_id());
CREATE POLICY "grns project scoped" ON grns FOR ALL USING (v2_can_access_project(project_id)) WITH CHECK (org_id = v2_current_org_id());
CREATE POLICY "invoices project scoped" ON invoices FOR ALL USING (v2_can_access_project(project_id)) WITH CHECK (org_id = v2_current_org_id());
CREATE POLICY "payment certs project scoped" ON payment_certs FOR ALL USING (v2_can_access_project(project_id)) WITH CHECK (org_id = v2_current_org_id());
CREATE POLICY "variances project scoped" ON variances FOR ALL USING (v2_can_access_project(project_id)) WITH CHECK (org_id = v2_current_org_id());
CREATE POLICY "ai jobs org scoped" ON ai_jobs FOR ALL USING (org_id = v2_current_org_id()) WITH CHECK (org_id = v2_current_org_id());
CREATE POLICY "feature org scoped tenders" ON tenders_ai FOR ALL USING (org_id = v2_current_org_id()) WITH CHECK (org_id = v2_current_org_id());
CREATE POLICY "feature project scoped reports" ON daily_reports FOR ALL USING (v2_can_access_project(project_id)) WITH CHECK (org_id = v2_current_org_id());
CREATE POLICY "feature org scoped workflows" ON workflows FOR ALL USING (org_id = v2_current_org_id()) WITH CHECK (org_id = v2_current_org_id());
CREATE POLICY "feature org scoped approvals" ON approvals FOR ALL USING (org_id = v2_current_org_id() AND (project_id IS NULL OR v2_can_access_project(project_id))) WITH CHECK (org_id = v2_current_org_id());
CREATE POLICY "feature org scoped approval history" ON approval_history FOR ALL USING (org_id = v2_current_org_id()) WITH CHECK (org_id = v2_current_org_id());
CREATE POLICY "feature project scoped changes" ON change_orders FOR ALL USING (v2_can_access_project(project_id)) WITH CHECK (org_id = v2_current_org_id());
CREATE POLICY "feature org scoped rfqs" ON rfqs FOR ALL USING (org_id = v2_current_org_id()) WITH CHECK (org_id = v2_current_org_id());
CREATE POLICY "feature org scoped rfq quotes" ON rfq_quotes FOR ALL USING (org_id = v2_current_org_id()) WITH CHECK (org_id = v2_current_org_id());
CREATE POLICY "notification owner scoped" ON notifications FOR ALL USING (org_id = v2_current_org_id() AND (user_id IS NULL OR user_id = auth.uid())) WITH CHECK (org_id = v2_current_org_id());
