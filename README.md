# ETHYX AI

**Is your AI treating everyone fairly?**

ETHYX AI is a hackathon MVP SaaS application for auditing tabular datasets for fairness and bias signals. Users upload a CSV, run a fairness audit, inspect the dashboard, review explanations, preview mitigation strategies, and export a PDF report.

> ETHYX AI is an analytical MVP, not a certified compliance, legal, or regulatory assurance system.

---

## Overview

ETHYX AI helps teams quickly answer a practical question before shipping or presenting an AI-assisted decision workflow:

```text
Are outcomes distributed fairly across protected or sensitive groups?
```

The product flow is intentionally simple:

1. Sign up or log in with Supabase Auth.
2. Upload a CSV dataset.
3. Store the dataset privately in Azure Blob Storage through a backend-issued SAS URL.
4. Create an audit record in Supabase Postgres.
5. Run backend fairness analysis with Pandas and fairness utilities.
6. Store results in `fairness_results`.
7. Open dashboard, explain, mitigate, report, and profile views.
8. Export a client-side PDF report.

---

## Core Features

- **Secure auth flow** using Supabase Auth and server-side `getUser()` validation.
- **CSV-only upload pipeline** with private Azure Blob Storage and backend-generated SAS URLs.
- **Fairness scoring** over protected attributes and binary target outcomes.
- **Risk model** where higher `fairness_score` is better and higher `risk_score` is worse.
- **Dashboard views** for technical and executive review.
- **Explain page** for audit-oriented interpretation.
- **Mitigation sandbox** for previewing bias-reduction strategies and generated example code.
- **PDF report export** using `jsPDF` and `html2canvas`.
- **Profile and recent audits** backed by Supabase-authenticated API routes.

---

## Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | Next.js 14 App Router, TypeScript, Tailwind CSS |
| UI | shadcn-style primitives, Framer Motion, Sonner, Lucide icons |
| Charts and reports | Recharts, jsPDF, html2canvas |
| Auth and database | Supabase Auth, Supabase Postgres, RLS |
| Backend | FastAPI, Python 3.10/3.11 |
| Storage | Azure Blob Storage, private container, SAS upload URLs |
| Analysis | Pandas, fairness utilities, AIF360/Fairlearn dependencies |
| AI summaries | Gemini API, optional depending on enabled routes |

---

## Repository Structure

```text
ethyx/
  frontend/                  Next.js application
    app/                     App Router pages and route handlers
    components/              UI, dashboard, upload, report, profile components
    hooks/                   Client data hooks
    lib/                     Supabase clients and auth helpers
    types/                   Shared frontend types

  backend/                   FastAPI application
    auth/                    Supabase JWT verification
    routes/                  upload, analyze, explain, mitigate, report
    utils/                   Azure, DB, fairness, Gemini helpers
    main.py                  FastAPI entrypoint
    requirements.txt         Python dependencies

  supabase/
    schema.sql               Tables, indexes, and RLS policies

  stitch-exports/            Original UI reference exports
  FINAL_SUBMISSION_CHECKLIST.md
```

---

## System Architecture

```text
Browser
  |
  | Supabase Auth session
  v
Next.js frontend
  |
  | POST /upload/sas-url with bearer token
  v
FastAPI backend
  |
  | verifies Supabase JWT
  | creates Azure SAS URL
  v
Azure Blob Storage private container
  ^
  | browser PUT upload with SAS URL
  |
Next.js frontend
  |
  | POST /api/audits
  v
Supabase Postgres audits
  |
  | POST /analyze
  v
FastAPI fairness analysis
  |
  | writes fairness_results and updates audits.risk_score
  v
Dashboard / Explain / Mitigate / Report / Profile
```

---

## Data Model

The MVP uses three primary tables:

| Table | Purpose |
| --- | --- |
| `audits` | One uploaded dataset audit owned by a Supabase user |
| `fairness_results` | Computed metrics, risk level, group results, recommendations |
| `audit_events` | Analysis lifecycle and error events |

Status lifecycle:

```text
uploaded -> queued -> analyzing -> completed
                       |           |
                       v           v
                    failed      timeout
```

Risk semantics:

```text
fairness_score: higher is better
risk_score:     higher is worse
```

After analysis completes, the backend updates both:

- `fairness_results.overall_risk_score`
- `audits.risk_score`

---

## API Surface

Backend protected routes require:

```http
Authorization: Bearer <supabase_access_token>
```

| Method | Route | Purpose |
| --- | --- | --- |
| `POST` | `/upload/sas-url` | Generate a short-lived Azure SAS URL for CSV upload |
| `POST` | `/analyze` | Start fairness analysis for an existing audit |
| `GET` | `/analyze/{audit_id}/status` | Poll analysis status and results |
| `GET` | `/explain/{audit_id}` | Fetch explanation data for an audit |
| `GET` | `/mitigate/{audit_id}` | Fetch mitigation strategy previews |
| `POST` | `/mitigate` | Simulate applying a mitigation strategy |
| `GET` | `/report/{run_id}` | Placeholder backend report route |

Frontend API routes:

| Method | Route | Purpose |
| --- | --- | --- |
| `GET` | `/api/audits` | List authenticated user's audits |
| `POST` | `/api/audits` | Create an audit row after successful blob upload |
| `GET` | `/api/audits/[auditId]` | Fetch audit, fairness results, and events |
| `GET` | `/api/profile` | Fetch auth-backed profile summary and stats |

---

## Security Model

- Frontend auth validation uses Supabase `getUser()`.
- Backend verifies Supabase JWTs and does not trust frontend-provided `user_id`.
- Backend supports Supabase legacy `HS256` tokens and JWKS-based asymmetric tokens.
- Azure connection string, Supabase service role key, JWT secret, database URL, and Gemini key are backend-only.
- Azure container remains private; browser uploads use short-lived SAS URLs.
- Supabase RLS restricts user-owned rows with `auth.uid() = user_id`.
- Backend database connection must be privileged enough for server-side insert/update/delete operations.
- No model deserialization from user uploads is used.

---

## Environment Variables

### Frontend

Create `frontend/.env.local` from `frontend/.env.example`.

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

Only public `NEXT_PUBLIC_*` values belong in the frontend.

### Backend

Create `backend/.env` from `backend/.env.example`.

```env
SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
SUPABASE_SERVICE_ROLE_KEY=YOUR_SUPABASE_SERVICE_ROLE_KEY
SUPABASE_JWT_SECRET=YOUR_SUPABASE_JWT_SECRET
DATABASE_URL=postgresql://...

AZURE_STORAGE_CONNECTION_STRING=DefaultEndpointsProtocol=https;AccountName=...;AccountKey=...;EndpointSuffix=core.windows.net
AZURE_STORAGE_CONTAINER_NAME=ethyx-uploads

GEMINI_API_KEY=YOUR_GEMINI_API_KEY
FRONTEND_URL=http://localhost:3000
CORS_ORIGINS=http://localhost:3000
BACKEND_PORT=8000
```

Never commit real `.env`, `.env.local`, connection strings, service role keys, JWT secrets, or API keys.

---

## Local Development

### 1. Supabase

1. Create a Supabase project.
2. Run `supabase/schema.sql` in the SQL editor.
3. Enable email/password auth.
4. Add local redirect URL:

```text
http://localhost:3000/auth/callback
```

### 2. Azure Blob Storage

1. Create a private container, for example:

```text
ethyx-uploads
```

2. Configure Blob Storage CORS for local development:

```text
Allowed origins: http://localhost:3000
Allowed methods: PUT, OPTIONS
Allowed headers: *
Exposed headers: etag, x-ms-request-id, x-ms-version
Max age: 3600
```

### 3. Backend

Use Python 3.10 or 3.11.

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

Expected:

```text
Uvicorn running on http://0.0.0.0:8000
```

### 4. Frontend

```powershell
cd frontend
npm ci
npm run dev
```

Open:

```text
http://localhost:3000
```

---

## Deployment Guide

### Frontend

Recommended host: Vercel or another Next.js-compatible platform.

```text
Root directory: frontend
Install command: npm ci
Build command: npm run build
Start command: npm run start
```

Set:

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
NEXT_PUBLIC_API_URL=https://YOUR_BACKEND_DOMAIN
NEXT_PUBLIC_BASE_URL=https://YOUR_FRONTEND_DOMAIN
```

### Backend

Recommended runtime: Python 3.10 or 3.11.

```text
Root directory: backend
Install command: pip install -r requirements.txt
Start command: uvicorn main:app --host 0.0.0.0 --port $PORT
```

Set backend-only secrets on the backend host.

After frontend deployment, update:

```env
FRONTEND_URL=https://YOUR_FRONTEND_DOMAIN
CORS_ORIGINS=https://YOUR_FRONTEND_DOMAIN,http://localhost:3000
```

Also add this Supabase Auth redirect URL:

```text
https://YOUR_FRONTEND_DOMAIN/auth/callback
```

And add the frontend domain to Azure Blob CORS allowed origins.

---

## Smoke Test Checklist

Run this flow before declaring the MVP ready:

1. Open frontend.
2. Sign up or log in.
3. Upload a valid CSV.
4. Confirm browser uploads to Azure Blob via SAS URL.
5. Confirm `audits.blob_path` is populated.
6. Start analysis.
7. Confirm `fairness_results` row is created.
8. Confirm `audits.status = completed`.
9. Confirm `audits.risk_score` is non-null.
10. Open `/dashboard?auditId=<id>`.
11. Open `/explain?auditId=<id>`.
12. Open `/mitigate?auditId=<id>`.
13. Open `/report?auditId=<id>`.
14. Export PDF.
15. Open `/profile` and confirm recent audits appear.

---

## Production Readiness Notes

ETHYX AI is currently a hackathon MVP. Before treating it as production software, add:

- Stronger data validation and column mapping controls.
- More complete fairness metrics and model-aware evaluation.
- Background job queue instead of in-process `asyncio.create_task`.
- Durable rate-limit storage.
- Observability dashboards and alerting.
- End-to-end automated tests.
- Formal legal and compliance review for regulated use cases.

---

## Packaging and Push Hygiene

Do not commit generated files or secrets:

```text
frontend/node_modules/
frontend/.next/
frontend/.env.local
backend/.env
backend/.venv/
__pycache__/
*.zip
```

Final scan:

```powershell
rg -n "NEXT_PUBLIC_AZURE|NEXT_PUBLIC_GEMINI" frontend backend supabase
rg -n "joblib\.load|window\.print|json\.loads\(response\.text\)" frontend backend
Get-ChildItem -Recurse -Force -Directory -Include node_modules,.next,__pycache__,venv,.venv
Get-ChildItem -Recurse -Force -File -Include .env.local,.env,tsconfig.tsbuildinfo
```

Initialize and push if needed:

```powershell
git init
git add .
git commit -m "Prepare ETHYX AI MVP for deployment"
git branch -M main
git remote add origin https://github.com/YOUR_ORG_OR_USER/ETHYX.git
git push -u origin main
```

---

## License

No license has been specified yet. Add a license before public or commercial distribution.
