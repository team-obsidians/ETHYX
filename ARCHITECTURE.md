# ETHYX AI — ARCHITECTURE.md
# Full technical architecture, stack, DB schema, API contracts
# Place at: /ethyx/ARCHITECTURE.md (project root)
# Read before any backend, auth, DB, or API work.

---

## 🏗️ TECH STACK (ALL VERSIONS PINNED)

### Frontend — /frontend/
```json
{
  "next": "^14.x",
  "@supabase/ssr": "0.5.2",
  "@supabase/supabase-js": "^2.x",
  "tailwindcss": "^3.x",
  "framer-motion": "^11.x",
  "recharts": "^2.x",
  "lucide-react": "latest",
  "jspdf": "^2.5.1",
  "html2canvas": "^1.4.1",
  "@sentry/nextjs": "latest",
  "@azure/storage-blob": "^12.19.0",
  "class-variance-authority": "latest",
  "clsx": "latest",
  "tailwind-merge": "latest"
}
```

**Critical:** `@supabase/ssr` must be exactly `0.5.2`. Not `^0.5.2`. Not `latest`.
PKCE strategy differs between 0.4.x and 0.5.x — wrong version = silent OAuth failure.

### Backend — /backend/ (Python 3.10.11 EXACT)
```
numpy>=1.23.0,<2.0.0          ← HARD LIMIT — AIF360 C extensions crash on 2.x
aif360==0.6.1
fairlearn==0.10.0
erroranalysis==0.4.5
interpret-community==0.29.0
google-generativeai==0.8.3     ← Pin exactly — API changes between minor versions
asyncpg==0.29.0
uvicorn[standard]==0.30.6
azure-storage-blob>=12.19.0
PyJWT>=2.8.0                   ← No firebase-admin. PyJWT only.
slowapi                        ← Rate limiting
cachetools
sentry-sdk[fastapi]
python-multipart
fastapi>=0.110.0
pandas
scikit-learn
```

---

## 🌐 INFRASTRUCTURE

| Component | Service | Cost | Notes |
|-----------|---------|------|-------|
| Frontend | Vercel | Free | Best for Next.js. Zero config. |
| Backend | Azure App Service B1 | ~$13/mo | Always-on. No cold starts. |
| Auth | Supabase Auth | Free | Google OAuth + email/password |
| Database | Supabase PostgreSQL | Free | RLS enabled. 500MB limit. |
| File Storage | Azure Blob Storage | ~$0.01/mo | CSV uploads only. Private container. |
| AI | Google Gemini API | $0 | Free tier. gemini-1.5-flash. |
| Monitoring | Azure Application Insights | Free | Native to App Service. |

---

## 🔐 ROUTES & AUTH

### Public Routes (no auth required)
```
GET  /                    Landing page
GET  /login               Login page
GET  /signup              Signup page
GET  /auth/callback       OAuth PKCE handler (route.ts — NEVER page.tsx)
```

### Protected Routes (auth required — redirect to /login if no session)
```
GET  /upload              Upload wizard (3 steps)
GET  /dashboard           Dashboard (Technical + Executive views)
GET  /explain             Explanation page (SHAP, Counterfactual, PDP)
GET  /mitigate            Mitigation strategies
GET  /report              Audit report + export
GET  /profile             User profile + history
```

### After Login → /dashboard
### After Signup → /upload

### Next.js Middleware (middleware.ts)
```typescript
// Runs on every request to protected routes
// Uses createServerClient from @supabase/ssr 0.5.2
// Uses supabase.auth.getUser() — NOT getSession() (getSession is insecure)
// Protected paths: /upload, /dashboard, /explain, /mitigate, /report, /profile
// No session → redirect to /login
// Refreshes session cookies on every request
```

---

## 🗄️ DATABASE SCHEMA (Supabase PostgreSQL)

### Table: profiles
```sql
CREATE TABLE public.profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name        TEXT,
  org_name    TEXT,
  plan        TEXT NOT NULL DEFAULT 'free',    -- 'free' | 'pro'
  onboarded   BOOLEAN DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
-- RLS: users can only read/write their own row
-- Auto-created by trigger on auth.users INSERT
```

### Table: analysis_runs
```sql
CREATE TABLE public.analysis_runs (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  domain           TEXT NOT NULL CHECK (domain IN ('hiring', 'loans', 'healthcare')),
  status           TEXT NOT NULL DEFAULT 'pending'
                     CHECK (status IN ('pending', 'running', 'complete', 'failed')),
  step             INTEGER NOT NULL DEFAULT 0,      -- 0-4 progress steps
  step_description TEXT,                            -- human-readable step label
  blob_key         TEXT,                            -- Azure Blob path
  column_mapping   JSONB,                           -- { outcome, sensitive_attr, group_label, ground_truth }
  results_json     JSONB,                           -- full analysis results
  error_message    TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
-- RLS: users can only read/write their own analysis_runs
```

### results_json Shape
```typescript
// This is what gets stored in results_json column
interface AnalysisResults {
  metrics: {
    disparate_impact: number       // threshold: 0.80
    statistical_parity: number     // threshold: ±0.05
    equal_opportunity: number      // threshold: ±0.05
    average_odds: number           // threshold: ±0.05
    calibration: number            // threshold: >0.90
  }
  predictions: Array<{
    id: string
    entity: string
    prediction: 'approved' | 'rejected'
    confidence: number
    fairness_risk: 'high' | 'medium' | 'low'
    shap_values: Record<string, number>
    counterfactual: Record<string, any>
  }>
  heatmap: number[][]             // 7x7 correlation matrix
  approval_rates: Record<string, { male: number; female: number }>
  narrative: string               // Gemini-generated summary
  domain: string
  row_count: number
  column_count: number
  missing_value_pct: number
  risk_score: number              // 0-100
  risk_level: 'low' | 'medium' | 'high'
}
```

---

## 🔌 BACKEND API CONTRACTS

### Base URL
```
Development: http://localhost:8000
Production:  https://[your-app].azurewebsites.net
```

### Authentication Header (all protected routes)
```
Authorization: Bearer [supabase_access_token]
```
Backend verifies with PyJWT + SUPABASE_JWT_SECRET. No firebase-admin.

### Endpoints

#### POST /upload/sas-url
Generate SAS URL for direct Azure Blob upload from browser.
```typescript
Request:  { filename: string, contentType: 'text/csv' }
Response: { sasUrl: string, blobKey: string, expiresIn: 900 }
```

#### POST /upload/model (MOCK — RCE fix)
```typescript
// Returns static mock. joblib.load() DELETED permanently.
Response: { status: 'ok', model_type: 'LogisticRegression', mock: true }
```

#### POST /analyze
Start bias analysis. Returns immediately (async background task).
Rate limit: 3/hour per IP.
```typescript
Request: {
  blobKey: string           // Azure Blob path of uploaded CSV
  domain: 'hiring' | 'loans' | 'healthcare'
  columnMapping: {
    outcome: string         // column name for model prediction
    sensitiveAttr: string   // column name for protected attribute
    groupLabel: string      // column name for demographic group
    groundTruth?: string    // optional actual outcome column
  }
}
Response: { analysisId: string, status: 'pending' }
```

#### GET /analyze/{id}/status
Poll for analysis progress. Frontend polls every 2s, max 90 retries.
```typescript
Response: {
  status: 'pending' | 'running' | 'complete' | 'failed'
  step: 0 | 1 | 2 | 3 | 4
  stepDescription: string
  results: AnalysisResults | null  // only when status='complete'
  error: string | null             // only when status='failed'
}
```

#### POST /analyze/{id}/chat
ETHYX AI Assistant. Rate limit: 10/hour per IP.
```typescript
Request:  { question: string }
Response: { answer: string, sources: string[] }
```

#### GET /explain/{id}
Get per-prediction SHAP + counterfactual data.
```typescript
Response: {
  predictions: AnalysisResults['predictions']
  feature_names: string[]
}
```

#### POST /mitigate
Generate mitigation strategy + Python code. Rate limit: 10/hour.
```typescript
Request: {
  analysisId: string
  strategy: 'reweighing' | 'adversarial' | 'equalized_odds' | 'reject_option'
  intensity: number   // 0.0-1.0
}
Response: {
  mitigated_metrics: Record<string, number>
  improvement_pct: number
  python_code: string
  explanation: string
}
```

#### GET /report/{id}
Full report data for PDF generation.
```typescript
Response: {
  reportId: string
  generatedAt: string
  dataset: { name: string, domain: string, rowCount: number }
  metrics: AnalysisResults['metrics']
  riskLevel: string
  recommendations: string[]
  narrative: string
}
```

---

## 🔄 ANALYSIS FLOW (end-to-end)

```
1. User uploads CSV → browser PUTs to Azure Blob SAS URL (direct, no backend proxy)
2. Frontend POSTs /analyze with { blobKey, domain, columnMapping }
3. Backend creates analysis_run row (status=pending), returns analysisId
4. Background asyncio.Task starts run_analysis():
   a. Downloads CSV from Azure Blob
   b. Parses with pandas
   c. Computes metrics with AIF360 + fairlearn (wrapped in asyncio.wait_for 5min timeout)
   d. Generates SHAP values with interpret-community
   e. Calls Gemini for narrative (parse_gemini_json strips fences)
   f. Updates analysis_run status=complete, stores results_json
5. Frontend polls GET /analyze/{id}/status every 2s
6. On status=complete: stops polling, shows dashboard
7. On 90th retry without complete: shows timeout error
```

---

## 🌍 ENVIRONMENT VARIABLES

### Frontend (.env.local)
```bash
NEXT_PUBLIC_SUPABASE_URL=https://[project].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[anon_key]
NEXT_PUBLIC_API_URL=https://[app].azurewebsites.net
SENTRY_DSN=[frontend_sentry_dsn]
# NEVER add NEXT_PUBLIC_AZURE_* or NEXT_PUBLIC_GEMINI_*
```

### Backend (Azure App Service environment)
```bash
SUPABASE_JWT_SECRET=[from supabase dashboard > settings > api > jwt secret]
AZURE_STORAGE_CONNECTION_STRING=[from azure portal > storage > access keys]
AZURE_CONTAINER_NAME=ethyx-uploads
AZURE_ACCOUNT_NAME=[storage account name]
AZURE_ACCOUNT_KEY=[storage account key]
GEMINI_API_KEY=[from aistudio.google.com]
FRONTEND_URL=https://[your-app].vercel.app
SENTRY_DSN=[backend_sentry_dsn]
PYTHON_VERSION=3.10
```

---

## 📦 SUPABASE CLIENT SETUP

### Browser Client (/lib/supabase/client.ts)
```typescript
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

### Server Client (/lib/supabase/server.ts)
```typescript
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createClient() {
  const cookieStore = cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options))
        },
      },
    }
  )
}
```

---

## 🚫 WHAT IS PERMANENTLY REMOVED

Do not re-introduce any of these under any circumstances:

```
firebase                    ← All Firebase packages removed
firebase-admin              ← Replaced by PyJWT
NEXT_PUBLIC_FIREBASE_*      ← All 8 Firebase env vars removed
/app/auth/callback/page.tsx ← Replaced by route.ts
joblib.load()               ← RCE vulnerability. DELETED.
json.loads(response.text)   ← Crashes on Gemini fences. Use parse_gemini_json()
window.print()              ← Replaced by jsPDF + html2canvas
Firebase Realtime DB        ← Replaced by polling (max 90 retries)
Firebase Storage            ← Replaced by Azure Blob Storage
```
