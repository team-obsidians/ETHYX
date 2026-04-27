# ETHYX AI — WORKFLOW.md
# Exact step-by-step build workflow for Antigravity
# Place at: /ethyx/WORKFLOW.md (project root)
# Read this to understand the build sequence and how phases connect.

---

## 📁 FOLDER PLACEMENT GUIDE

```
/ethyx/                          ← PROJECT ROOT
  ├── AGENTS.md                  ← READ FIRST (Antigravity master instructions)
  ├── DESIGN_SYSTEM.md           ← Read for all UI work
  ├── ARCHITECTURE.md            ← Read for all backend/auth/DB work
  ├── MCP_RULES.md               ← Read before every prompt
  ├── WORKFLOW.md                ← This file
  ├── STITCH_ANALYSIS_PROMPT.md  ← Run once before Phase 0
  │
  ├── stitch-exports/            ← YOUR STITCH PAGE EXPORTS (paste here)
  │   ├── 01_landing.html
  │   ├── 02_login.html
  │   ├── 03_signup.html
  │   ├── 04_upload.html
  │   ├── 05_dashboard.html
  │   ├── 06_explain.html
  │   ├── 07_mitigate.html
  │   ├── 08_report.html
  │   └── 09_profile.html
  │
  ├── frontend/                  ← Next.js 14 App
  │   ├── app/
  │   ├── components/
  │   ├── lib/
  │   ├── middleware.ts
  │   ├── tailwind.config.ts
  │   ├── globals.css
  │   └── package.json
  │
  └── backend/                   ← FastAPI Python
      ├── routes/
      ├── utils/
      ├── main.py
      └── requirements.txt
```

---

## 🗓️ BUILD SEQUENCE

### PRE-BUILD (Before Antigravity)
Do these manually outside Antigravity:

```
□ Create Supabase project (supabase.com)
□ Enable Google OAuth in Supabase → Authentication → Providers
□ Add redirect URL: https://[your-domain]/auth/callback
□ Create Azure Storage Account (portal.azure.com)
□ Create container: ethyx-uploads (access: Private)
□ Get Gemini API key (aistudio.google.com) — free tier
□ Create Vercel account + connect GitHub repo
□ Create Azure App Service B1 (or use free F1 for dev)
□ Copy all connection strings/keys to a secure notepad
```

---

### STEP 0 — Stitch Analysis (Run once, Antigravity)
```
Prompt file: STITCH_ANALYSIS_PROMPT.md
Input: /stitch-exports/ folder with all 8 files
Output: Full analysis report — violations, components, build order
Time: 10-15 min
Next: Address any violations before Phase 0
```

---

### PHASE 0 — Project Scaffold
```
PRD Tab: P0
MCPs: context7
Skills: senior-fullstack, database-design, nextjs-best-practices
Output:
  /frontend/   full Next.js 14 scaffold
  /backend/    FastAPI folder structure
  Supabase SQL schema (paste into Supabase SQL Editor)
  middleware.ts (route protection)
  /auth/callback/route.ts (PKCE handler)
  .env.local template
Time: 45 min
```

---

### PHASE 1 — Design Foundation
```
PRD Tab: P1
MCPs: 21st_dev, shadcn, context7
Skills: frontend-design, tailwind-patterns, nextjs-best-practices, react-best-practices
Output:
  tailwind.config.ts (all design tokens)
  globals.css (fonts, dot-grid, utilities)
  /components/shared/Sidebar.tsx
  /components/shared/Topbar.tsx
  /components/shared/LoadingOverlay.tsx
  /app/(app)/layout.tsx
  shadcn/ui installed and configured
Time: 1 hour
```

---

### PHASE 2 — Public Pages
```
PRD Tab: P2
MCPs: 21st_dev, shadcn, Stitch, context7
Skills: ui-ux-pro-max, frontend-design, scroll-experience, 3d-web-experience
Stitch refs: 01_landing.html, 02_login.html, 03_signup.html
Output:
  /app/(public)/page.tsx (Landing)
  /app/(public)/login/page.tsx
  /app/(public)/signup/page.tsx
Time: 2-3 hours
```

---

### PHASE 3 — Upload Wizard
```
PRD Tab: P3
MCPs: 21st_dev, context7, shadcn, Stitch
Skills: react-patterns, nextjs-best-practices, api-patterns, frontend-developer
Stitch ref: 04_upload.html
Output:
  /app/(app)/upload/page.tsx (3-step wizard)
  /app/api/upload-url/route.ts (Azure SAS token generator)
  Custom hook: useUploadWizard
Time: 2 hours
```

---

### PHASE 4 — FastAPI Backend
```
PRD Tab: P4
MCPs: context7
Skills: backend-dev-guidelines, api-patterns, database-design, senior-fullstack
Output:
  /backend/main.py (CORS, rate limiting, lifespan, Sentry)
  /backend/utils/gemini.py (parse_gemini_json, call_gemini_with_retry)
  /backend/utils/azure_blob.py (SAS token, download)
  /backend/utils/fairness.py (AIF360 + fairlearn analysis)
  /backend/routes/analyze.py (POST /analyze, GET /analyze/{id}/status)
  /backend/routes/explain.py
  /backend/routes/mitigate.py
  /backend/routes/report.py
  /backend/auth/verify_jwt.py (PyJWT, no firebase-admin)
  requirements.txt (all pinned)
Time: 3-4 hours
Note: TEST backend independently before building Phase 5
```

---

### PHASE 5 — Dashboard
```
PRD Tab: P5
MCPs: 21st_dev, shadcn, context7, Stitch
Skills: canvas-design, react-best-practices, react-patterns, ui-ux-pro-max
Stitch ref: 05_dashboard.html
Output:
  /app/(app)/dashboard/page.tsx
  /components/charts/ApprovalRateChart.tsx
  /components/charts/BiasHeatmap.tsx
  /components/charts/ExecutiveGauge.tsx
  /hooks/useAnalysisPolling.ts
Time: 2.5 hours
```

---

### PHASE 6 — Explain
```
PRD Tab: P6
MCPs: 21st_dev, shadcn, context7, Stitch
Skills: react-patterns, canvas-design, ui-ux-pro-max
Stitch ref: 06_explain.html
Output:
  /app/(app)/explain/page.tsx
  /components/charts/ShapChart.tsx
  /components/charts/PDPChart.tsx
Time: 2 hours
```

---

### PHASE 7 — Mitigate
```
PRD Tab: P7
MCPs: 21st_dev, shadcn, context7, Stitch
Skills: react-best-practices, frontend-design, tailwind-patterns
Stitch ref: 07_mitigate.html
Output:
  /app/(app)/mitigate/page.tsx
  /components/charts/MitigationFlowChart.tsx
Time: 1.5 hours
```

---

### PHASE 8 — Report + Profile
```
PRD Tab: P8
MCPs: 21st_dev, shadcn, context7, Stitch
Skills: frontend-developer, react-patterns, tailwind-patterns
Stitch refs: 08_report.html, 09_profile.html
Output:
  /app/(app)/report/page.tsx
  /app/(app)/profile/page.tsx
Time: 2 hours
```

---

### PHASE 9 — Security + Tests
```
PRD Tab: P9
MCPs: playwright, context7
Skills: senior-fullstack, backend-dev-guidelines, nextjs-best-practices
Output:
  /tests/auth.spec.ts
  /tests/upload.spec.ts
  /tests/dashboard.spec.ts
  /tests/report.spec.ts
  /tests/fixtures/sample_hiring.csv
  next.config.js (security headers)
  Input validation in all backend routes
  playwright.config.ts
Time: 2 hours
```

---

## 🔁 PER-PHASE WORKFLOW (REPEAT FOR EACH PHASE)

```
1. Open Antigravity
2. Say: "Read AGENTS.md, DESIGN_SYSTEM.md, ARCHITECTURE.md, MCP_RULES.md"
3. Say: "Reference /stitch-exports/[page].html for this phase"
4. Paste the phase prompt from PRD_v3.html (correct tab)
5. Review generated code:
   □ Check design tokens match DESIGN_SYSTEM.md
   □ Check no inline styles (Tailwind only)
   □ Check TypeScript types are correct
   □ Check error states are handled
   □ Check loading states are handled
   □ Run pre-deploy checklist grep commands
6. Test the page manually in browser
7. Move to next phase
```

---

## ⚡ PROMPT TEMPLATE (Use at start of every Antigravity session)

```
Read the following files in this exact order:
1. /AGENTS.md
2. /DESIGN_SYSTEM.md
3. /ARCHITECTURE.md
4. /MCP_RULES.md

Now you understand the full ETHYX AI project context.

Reference: /stitch-exports/[FILENAME].html for the visual design.

use library /[relevant-library] for docs.

[PASTE PHASE PROMPT FROM PRD_v3.html]
```

---

## 🚨 EMERGENCY FIXES (If Something Goes Wrong)

### Auth not working
```
Check: /app/auth/callback/route.ts exists (not page.tsx)
Check: @supabase/ssr is exactly 0.5.2 in package.json
Check: Google OAuth redirect URL in Supabase matches /auth/callback
Check: NEXT_PUBLIC_SUPABASE_URL and ANON_KEY are set in .env.local
```

### Backend crashing on startup
```
Check: Python version is 3.10.11 (not 3.11 or 3.12)
Check: numpy version is <2.0.0 — run `pip show numpy`
Check: run `pip check` — fix all broken requirements
Check: CORS FRONTEND_URL env var is set to Vercel URL
```

### Analysis hanging forever
```
Check: asyncio.wait_for(timeout=300) is on run_analysis()
Check: lifespan() marks stale jobs as failed on startup
Check: Frontend polling has max 90 retries before showing error
```

### Gemini returning parse errors
```
Check: parse_gemini_json() is used everywhere, not bare json.loads()
Check: google-generativeai==0.8.3 is pinned exactly
Check: GEMINI_API_KEY is set in backend env vars
```

### Azure Blob upload failing
```
Check: SAS token is generated server-side in /api/upload-url/route.ts
Check: AZURE_STORAGE_CONNECTION_STRING is in backend env vars (not frontend)
Check: Container name is ethyx-uploads
Check: SAS token has write+create permissions
Check: SAS URL expiry is 15 minutes (enough for upload)
```
