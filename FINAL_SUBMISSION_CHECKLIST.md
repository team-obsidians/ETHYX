# ETHYX AI — Final Deployment Smoke Test Checklist

## A. Final Deployment Checklist

### Frontend deployment
- Set only public frontend variables on the frontend host.
- Set `NEXT_PUBLIC_API_URL` to the deployed FastAPI origin, not localhost.
- Run `npm ci` and `npm run build` before deploying.
- Confirm protected routes redirect logged-out users to `/login`.

### Backend deployment
- Use Python 3.10 or 3.11. Do not deploy with local Python 3.14.
- Deploy from `backend/` with `uvicorn main:app`.
- Set backend secrets only on the backend host.
- Confirm CORS allows the deployed frontend origin.

### Supabase setup
- Apply `supabase/schema.sql` in the target Supabase project.
- Enable email/password auth and any OAuth providers used for the demo.
- Add the deployed frontend `/auth/callback` URL to Supabase Auth redirect URLs.
- Confirm RLS policies allow user-owned frontend reads and writes.
- Confirm backend `DATABASE_URL` can perform server-side insert/update/delete on `audits`, `fairness_results`, and `audit_events`.

### Azure Blob Storage setup
- Create an Azure Storage account.
- Use a private container matching `AZURE_STORAGE_CONTAINER_NAME`.
- Keep public blob access disabled.
- Configure Blob Storage CORS for browser `PUT` uploads from the deployed frontend.

### Local deploy-equivalent verification
- Use Python 3.10 or 3.11.
- Run frontend build, backend compile, and `pip check`.
- Do not package `node_modules`, `.next`, `.env.local`, backend `.env`, `__pycache__`, or virtual environments.

### Live smoke test
- Complete the full flow with real Supabase and Azure services.
- Do not mark ETHYX AI fully ready until the live smoke test passes.

## B. Required Environment Variables

| Env var | Set where | Public/secret | What breaks if missing |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Frontend host | Public | Supabase client and middleware auth fail |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Frontend host | Public | Login, signup, and browser Supabase calls fail |
| `NEXT_PUBLIC_API_URL` | Frontend host | Public | Upload SAS, analyze, explain, and mitigate calls fail |
| `NEXT_PUBLIC_BASE_URL` | Frontend host | Public optional | Metadata falls back to localhost |
| `SUPABASE_URL` | Backend host | Server config | Backend Supabase integrations fail if used |
| `SUPABASE_SERVICE_ROLE_KEY` | Backend host only | Secret | Backend service-role Supabase operations fail; never expose to frontend |
| `SUPABASE_JWT_SECRET` | Backend host only | Secret | Backend JWT verification rejects protected requests |
| `DATABASE_URL` | Backend host only | Secret | Backend DB pool fails; analyze, status, and mitigate fail |
| `AZURE_STORAGE_CONNECTION_STRING` | Backend host only | Secret | SAS generation and blob download fail |
| `AZURE_STORAGE_CONTAINER_NAME` | Backend host | Server config | Defaults to `ethyx-uploads`; mismatch causes upload/download failures |
| `GEMINI_API_KEY` | Backend host only | Secret optional | Gemini-backed explanations or summaries fail if invoked |
| `FRONTEND_URL` | Backend host | Server config | CORS may block browser requests |
| `CORS_ORIGINS` | Backend host | Server config optional | Multi-origin CORS may be wrong; use comma-separated origins |
| `BACKEND_PORT` | Backend host if required | Server config optional | Host-specific startup may choose the wrong port |

## C. Supabase Setup Checklist
- Apply `supabase/schema.sql`.
- Confirm required `audits` columns exist: `id`, `user_id`, `blob_path`, `target_column`, `protected_attributes`, `positive_label`, `risk_score`, `status`.
- Confirm required `fairness_results` columns exist: `audit_id`, `user_id`, `overall_risk_score`, `risk_level`, `metrics`, `group_results`, `recommendations`.
- Confirm `audit_events` exists.
- Confirm RLS is enabled and policies restrict frontend access to `auth.uid() = user_id`.
- Confirm backend `DATABASE_URL` is not anon/client credentials and supports:
  `INSERT/UPDATE audits`, `DELETE/INSERT fairness_results`, and `INSERT audit_events`.
- Configure Auth redirect URLs:
  `https://YOUR-FRONTEND-DOMAIN/auth/callback` and local callback URLs if testing locally.

## D. Azure Blob Setup Checklist
- Create the storage account and private blob container.
- Set `AZURE_STORAGE_CONTAINER_NAME` to the same container name.
- Pre-create the container if possible. The backend also create-or-ignores it before SAS generation.
- Configure Blob Storage CORS:
  allowed origins include deployed frontend and local frontend if testing;
  allowed methods include `PUT` and `OPTIONS`;
  allowed headers include `x-ms-blob-type`, `content-type`, and `x-ms-*`;
  exposed headers include `etag`, `x-ms-request-id`, and `x-ms-version`;
  max age can be `3600`.
- Confirm public blob access remains disabled.

## E. Deploy-Equivalent Verification Commands

Frontend:
```powershell
cd frontend
npm ci
npm run build
npm run start
```

Backend with Python 3.11 on Windows:
```powershell
cd backend
py -3.11 -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
python -m compileall .
python -m pip check
uvicorn main:app --host 0.0.0.0 --port 8000
```

Backend with Python 3.11 on Linux/macOS:
```bash
cd backend
python3.11 -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
python -m compileall .
python -m pip check
uvicorn main:app --host 0.0.0.0 --port "${BACKEND_PORT:-8000}"
```

Package scans:
```powershell
rg -n "JSONL|/api/upload|api/upload|NEXT_PUBLIC_AZURE|NEXT_PUBLIC_GEMINI|SUPABASE_SERVICE_ROLE_KEY" frontend backend supabase
rg -n "joblib\.load|window\.print|json\.loads\(response\.text\)" frontend backend
Get-ChildItem -Recurse -Force -Directory -Include node_modules,.next,__pycache__,venv,.venv
Get-ChildItem -Recurse -Force -File -Include .env.local,.env,tsconfig.tsbuildinfo
```

## F. Live Smoke Test Steps

| Step | Expected result | Inspect if it fails | Likely file or route |
| --- | --- | --- | --- |
| Open deployed frontend | Landing page loads | Browser console, frontend env | `frontend/app/(public)/page.tsx` |
| Sign up or login | User redirects into app | Supabase Auth logs, redirect URLs | `login/page.tsx`, `signup/page.tsx`, `auth/callback/route.ts` |
| Upload valid CSV | CSV accepted and upload starts | File type, browser console | `Step2Source.tsx` |
| Upload to Azure via SAS | Browser `PUT` returns 200 or 201 | Network tab, Azure CORS, SAS URL | `POST /upload/sas-url`, `azure_blob.py` |
| Create audit row | `audits.blob_path` has a real blob name | Supabase table editor | `frontend/app/api/audits/route.ts` |
| Start analysis | `audits.status = analyzing` | Backend logs, network response | `POST /analyze` |
| Write results | One `fairness_results` row exists | DB permissions, backend logs | `_run_analysis()` |
| Complete audit | `audits.status = completed` | `audit_events`, backend logs | `analyze.py` |
| Update risk score | `audits.risk_score` is non-null | DB update permissions | `analyze.py` |
| Load dashboard | `/dashboard?auditId=<id>` renders | `/api/audits/[auditId]` response | `useDashboardData.ts` |
| Load explain | `/explain?auditId=<id>` renders | Backend token, CORS, Gemini if used | `useExplainData.ts`, `explain.py` |
| Load mitigate | Strategy cards and metrics render | `/mitigate/{audit_id}` response | `useMitigateData.ts`, `mitigate.py` |
| Load report | Report page renders same audit | Dashboard data adapter | `report/page.tsx` |
| Export PDF | PDF downloads or opens | Browser console, canvas errors | Report export utilities |
| Open profile | Recent audit appears | `/api/profile`, `/api/audits` | `profile/page.tsx`, `api/profile/route.ts` |

## G. Failure Debugging Map
- Login loops or immediate logout: check Supabase URL/key, middleware, and Auth redirect URLs.
- `NEXT_PUBLIC_API_URL is not configured`: frontend host env is missing or frontend was not redeployed after env changes.
- Browser upload blocked: check Azure CORS and SAS URL response.
- SAS endpoint returns 401: check frontend bearer token and backend `SUPABASE_JWT_SECRET`.
- Analyze returns 404: audit row is missing, wrong audit ID, or not owned by the user.
- Analyze returns 400 for empty blob: audit row was created without a successful blob upload.
- Analyze returns 409: audit status is already queued, analyzing, or completed.
- Analyze returns 500 during DB write: `DATABASE_URL` likely lacks privileged server-side delete/insert/update permissions.
- Dashboard is blank for a completed audit: inspect `/api/audits/[auditId]` and `fairness_results` shape.
- Explain or mitigate has CORS failure: check backend `FRONTEND_URL` and `CORS_ORIGINS`.
- PDF export fails: inspect browser console for canvas or DOM rendering errors.

## H. Final Packaging Commands

Cleanup generated artifacts:
```powershell
Remove-Item -Recurse -Force frontend\node_modules,frontend\.next -ErrorAction SilentlyContinue
Remove-Item -Force frontend\tsconfig.tsbuildinfo,frontend\.env.local,backend\.env -ErrorAction SilentlyContinue
Get-ChildItem -Recurse -Directory -Filter __pycache__ | Remove-Item -Recurse -Force
Get-ChildItem -Recurse -Directory -Include venv,.venv | Remove-Item -Recurse -Force
```

Create archive from a Git repository root:
```powershell
git archive --format=zip --output ethyx-ai-final-submission.zip HEAD
```

If the workspace has no `.git`, create a clean copy manually only after the forbidden artifact scan passes.

## I. Remaining Risks
- Live Supabase + Azure flow is still unverified.
- Local Python 3.14.2 is not deployment-equivalent.
- Backend duplicate cleanup depends on privileged backend `DATABASE_URL`.
- Azure browser upload depends on correct Blob Storage CORS.
- Gemini-backed explanation behavior depends on `GEMINI_API_KEY` if those routes invoke Gemini.

## J. Final Verdict
**Ready after live smoke test.**

ETHYX AI should not be called fully ready until the complete deployed flow passes with real Supabase Auth, Supabase Postgres/RLS, Azure SAS upload, backend analysis, and PDF export.
