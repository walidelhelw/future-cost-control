BEGIN;

INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES
  ('00000000-0000-0000-0000-0000000000a1', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'a@example.com', 'x', NOW(), NOW(), NOW()),
  ('00000000-0000-0000-0000-0000000000b1', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'b@example.com', 'x', NOW(), NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO organizations (id, name, slug)
VALUES
  ('10000000-0000-0000-0000-000000000001', 'Org A', 'org-a-rls-test'),
  ('20000000-0000-0000-0000-000000000001', 'Org B', 'org-b-rls-test')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO profiles (id, org_id, email, full_name, role, status)
VALUES
  ('00000000-0000-0000-0000-0000000000a1', '10000000-0000-0000-0000-000000000001', 'a@example.com', 'User A', 'pm', 'active'),
  ('00000000-0000-0000-0000-0000000000b1', '20000000-0000-0000-0000-000000000001', 'b@example.com', 'User B', 'pm', 'active')
ON CONFLICT (id) DO UPDATE SET org_id = EXCLUDED.org_id, role = EXCLUDED.role, status = EXCLUDED.status;

INSERT INTO projects (id, org_id, code, name, client, project_type, status)
VALUES
  ('10000000-0000-0000-0000-0000000000aa', '10000000-0000-0000-0000-000000000001', 'RLS-A', 'A Project', 'A Client', 'RESIDENTIAL', 'ACTIVE'),
  ('20000000-0000-0000-0000-0000000000bb', '20000000-0000-0000-0000-000000000001', 'RLS-B', 'B Project', 'B Client', 'RESIDENTIAL', 'ACTIVE')
ON CONFLICT (code) DO UPDATE SET org_id = EXCLUDED.org_id;

INSERT INTO project_members (org_id, project_id, user_id, role)
VALUES
  ('10000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-0000000000aa', '00000000-0000-0000-0000-0000000000a1', 'pm'),
  ('20000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-0000000000bb', '00000000-0000-0000-0000-0000000000b1', 'pm')
ON CONFLICT DO NOTHING;

INSERT INTO budget_baselines (id, org_id, project_id, code, name, amount)
VALUES
  ('10000000-0000-0000-0000-000000000111', '10000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-0000000000aa', 'BASE-A', 'A Baseline', 100),
  ('20000000-0000-0000-0000-000000000222', '20000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-0000000000bb', 'BASE-B', 'B Baseline', 200)
ON CONFLICT (id) DO NOTHING;

SET LOCAL ROLE authenticated;
SET LOCAL request.jwt.claim.sub = '00000000-0000-0000-0000-0000000000a1';
SET LOCAL request.jwt.claim.role = 'authenticated';

DO $$
BEGIN
  IF (SELECT COUNT(*) FROM projects) <> 1 THEN
    RAISE EXCEPTION 'User A should see exactly one project';
  END IF;

  IF EXISTS (SELECT 1 FROM projects WHERE org_id = '20000000-0000-0000-0000-000000000001') THEN
    RAISE EXCEPTION 'User A can see Org B projects';
  END IF;

  IF EXISTS (SELECT 1 FROM budget_baselines WHERE org_id = '20000000-0000-0000-0000-000000000001') THEN
    RAISE EXCEPTION 'User A can see Org B budget baselines';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename IN ('projects','budget_baselines','chat_history','embeddings')
      AND (qual = 'true' OR with_check = 'true')
  ) THEN
    RAISE EXCEPTION 'Unsafe broad RLS policy remains on V2 tables';
  END IF;
END $$;

ROLLBACK;
