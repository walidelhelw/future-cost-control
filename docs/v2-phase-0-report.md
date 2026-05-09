# V2 Phase 0/1 Report

## What Shipped

- Isolated `/[locale]/v2` surface that opens directly to the V2 CEO demo shell.
- CEO-edition V2 shell: dark command layer, RTL-aware navigation, command palette, floating Future assistant, responsive bottom nav.
- Command Center route, Smart Estimate route, and polished operational route targets for Cost Spine, Field Mode, Flow, Change Orders, RFQ, Ask Future, and Admin.
- V2 server foundation in `src/lib/v2`: Supabase SSR clients, auth/RBAC helpers, DAL modules, typed assistant tools, Gemini wrapper, AI cost logging.
- `/api/v2/assistant` streaming endpoint with typed tool routing and no raw SQL surface.
- Supabase migration `003_v2_foundation.sql` for identity, RLS, audit, AI logs, embeddings, reference data, cost spine, and workflow tables.
- Static reference data seed generated from V1 data into `supabase/seed/v2_reference_data.sql` with 243 rows.
- Security headers in `next.config.mjs` and Netlify `public/_headers`; Sentry init is safe when DSNs are missing.

## URLs And Screenshots

- Local URL: `http://localhost:3007/ar/v2`
- English URL: `http://localhost:3007/en/v2`
- Desktop screenshot: `/tmp/future-v2-ar-final.png`
- Mobile screenshot: `/tmp/future-v2-estimate-mobile-final.png`

## AI Cost

No live Gemini calls were made during verification. The assistant smoke route used the no-data smoke response, so incurred AI cost is `$0.00`.

| Cost Area | Phase 0/1 Demo Usage | Estimated Monthly |
| --- | ---: | ---: |
| Supabase Pro | Auth, DB, storage, realtime-ready | `$25` |
| Gemini Flash/Pro | Assistant and Smart Estimate jobs | `$30-80` |
| Sentry | Sandbox/free tier initially | `$0-26` |
| Netlify | Existing deploy target | `$0+` |
| Total | Demo to early pilot | `$55-131/mo` |

## Verification

- `npm run typecheck` passed.
- `npm run lint` passed.
- `npm run build` passed.
- `V2_SMOKE_BASE_URL=http://localhost:3007 npm run smoke:v2` passed for `/ar/v2`, `/en/v2`, and `/api/v2/assistant`.
- Playwright screenshots captured desktop and mobile V2 routes.
- Static scan found no `USING (true)` or direct OpenAI/Anthropic/Twilio/WhatsApp integration in V2 code.

## Notes

- Local Supabase SQL lint could not run because Docker is not running, so the migration was not applied to a local Postgres instance in this session.
- Remote `supabase db push --yes` was attempted, but Supabase rejected the CLI login-role setup without `SUPABASE_DB_PASSWORD`; the migration is committed and ready to apply once that password is available.
- V2 route rendering is open for the CEO demo. Data-mutating and assistant API routes still enforce the V2 Supabase/RBAC checks.
