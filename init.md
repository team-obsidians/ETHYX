# ETHYX AI — PROJECT INITIALIZATION PROMPT
# For Google Antigravity · Claude Opus 4.6 · Planning Mode
# Single prompt. Reads everything. Applies corrections. Builds Phase 0. Now.
# Place this file at: /ethyx/INIT.md

---

## 1 — ACTIVATE EVERYTHING FIRST

### MCP Servers (keep active for entire session)
```
⚡ context7   — live library docs, prevents hallucinated APIs
⚡ 21st_dev   — UI component generation for all visual components
⚡ shadcn     — Radix UI primitive registry
⚡ Stitch     — design export reference (the /stitch-exports/ files)
```

### Library Triggers (fire all now via context7)
```
use library /vercel/next.js
use library /supabase/supabase
use library /recharts/recharts
use library /framer-motion/motion
use library /tailwindlabs/tailwindcss
use library /microsoft/playwright
use library /azure/azure-sdk-for-js
```

### Skills (all 14 — active for entire session)
```
◆ frontend-design        ◆ ui-ux-pro-max         ◆ react-best-practices
◆ react-patterns         ◆ nextjs-best-practices  ◆ tailwind-patterns
◆ 3d-web-experience      ◆ canvas-design          ◆ scroll-experience
◆ senior-fullstack       ◆ frontend-developer     ◆ backend-dev-guidelines
◆ api-patterns           ◆ database-design
```

---

## 2 — READ EVERYTHING (exact order, completely)

```
1. /ethyx/AGENTS.md
2. /ethyx/DESIGN_SYSTEM.md
3. /ethyx/ARCHITECTURE.md
4. /ethyx/MCP_RULES.md
5. /ethyx/stitch-exports/00_loading.html
6. /ethyx/stitch-exports/01_landing.html
7. /ethyx/stitch-exports/02_login.html
8. /ethyx/stitch-exports/03_signup.html
9. /ethyx/stitch-exports/04_upload.html
10. /ethyx/stitch-exports/05_dashboard_technical.html
11. /ethyx/stitch-exports/05_dashboard_executive.html
12. /ethyx/stitch-exports/06_explain.html
13. /ethyx/stitch-exports/07_mitigate.html
14. /ethyx/stitch-exports/08_report.html
15. /ethyx/stitch-exports/09_profile.html
16. /ethyx/stitch-exports/04_upload_1.html
17. /ethyx/stitch-exports/04_upload_2.html
18. /ethyx/stitch-exports/04_upload_3.html
19. /ethyx/stitch-exports/06_explain_1.html
20. /ethyx/stitch-exports/06_explain_2.html
21. /ethyx/stitch-exports/dashboard_spacious_v1.html
22. /ethyx/stitch-exports/DESIGN.md
```

Read every file completely. The Stitch files are your visual source of truth.
The 4 context docs are your technical and design authority.
When they conflict, the context docs win over Stitch — always.

---

## 3 — PRODUCT IDENTITY (commit to memory, zero tolerance for deviation)

```
Name:     ETHYX AI          — never FairCheck, never FairPlay, never any other name
Brand:    OBSIDIAN LENS / AI BIAS DETECTION PLATFORM
Tagline:  "Is your AI treating everyone fairly?"
Product:  AI bias detection and fairness auditing SaaS
Stack:    Next.js 14 App Router + FastAPI Python 3.10.11 + Supabase + Azure Blob + Gemini
```

---

## 4 — STITCH CORRECTION DIRECTIVES
### Applied inline during building — not audited, not reported, just fixed

These are known issues with all Google Stitch exports for this project.
Apply every directive automatically whenever you touch a Stitch file or convert it to code.
Do not produce audit tables. Do not produce violation reports. Just build correctly.

### 4A — Typography (apply to every file)
```
DELETE immediately from @import and font-family — these are BANNED:
  Space Grotesk · Manrope · Inter · Poppins · Roboto

REPLACE with this exact font stack:
  Display / Logo / Section labels / KPI labels / Badge text / Alert codes:
    font-family: 'Orbitron', monospace — weight 700 or 900 ONLY
    @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900...')

  Body / Nav items / Buttons / Descriptions / Form labels / Paragraphs:
    font-family: 'DM Sans', sans-serif — weight 400, 500, 600
    
  Metric values / Percentages / Timestamps / Code / Chart axes / Footer / Badges:
    font-family: 'DM Mono', monospace — weight 400, 500 — always tabular-nums on numbers

CORRECT usage rules:
  Orbitron section eyebrow: text-[8.5px] tracking-[0.22em] uppercase text-[#00ADB5]
  Orbitron logo: text-[12px] tracking-[0.12em] font-black
  Orbitron display: text-[22px] lg:text-[32px] tracking-[0.08em] font-black
  DM Mono KPI primary: text-[28px] font-medium tabular-nums
  DM Mono labels: text-[9px] tracking-[0.15em] uppercase
  DM Sans body: text-[13px] leading-[1.65]

Every section eyebrow MUST use this pattern (extract as SectionLabel component):
  <div className="flex items-center gap-3 mb-4">
    <span className="font-orbitron text-[8.5px] font-bold tracking-[0.22em] uppercase text-[#00ADB5]">
      SECTION TITLE
    </span>
    <div className="flex-1 h-px bg-gradient-to-r from-[#00ADB5]/30 to-transparent" />
  </div>
```

### 4B — Colors (apply to every file)
```
REPLACE THESE IMMEDIATELY — zero exceptions:
  Any purple  (#8B5CF6 or variant) → #00ADB5
  Any indigo  (#6366F1 or variant) → #00ADB5
  Any blue    (#3B82F6 or variant) → #00ADB5
  Any white bg (#FFFFFF)           → #222831
  Any light gray bg                → #222831
  lh3.googleusercontent.com URLs  → inline SVG placeholder

CORRECT color tokens — use these exactly:
  Page background:    #222831
  Surface/panels:     #1C2128
  Cards:              rgba(57,62,70,0.72)
  Inputs:             #393E46
  Primary teal:       #00ADB5  ← THE ONLY ACCENT COLOR
  Teal hover:         #008891
  Teal text/glow:     #55d8e1  ← labels and glows ONLY, never buttons
  Card border:        rgba(0,173,181,0.12)
  Card border active: rgba(0,173,181,0.25)
  Teal glow shadow:   rgba(0,173,181,0.25)
  Active nav bg:      rgba(0,173,181,0.08)
  Text primary:       #EEEEEE
  Text secondary:     #AABBC4
  Text muted:         #6B8090
  Text faint:         #4A5360
  Success:            #10B981
  Warning:            #F59E0B
  Danger:             #EF4444
```

### 4C — Layout Fixes (app pages 04–09 only)
```
SIDEBAR — rebuild to exact spec on EVERY app page:
  Width: w-[240px] — not w-64, not 256px, exactly 240px
  Background: bg-[#1C2128]
  Right border: border-r border-[rgba(0,173,181,0.08)]
  Nav items (6 EXACTLY — no more, no less):
    Upload (Lucide: Upload) · Dashboard (LayoutDashboard) · Explain (Microscope)
    Mitigate (Shield) · Report (FileText) · Profile (User)
  Active item: 3px left teal border + rgba(0,173,181,0.08) bg + #EEEEEE text
               Framer Motion layoutId="sidebar-active-indicator" sliding indicator
  Hover item: rgba(0,173,181,0.05) bg + #AABBC4 text — transition 100ms
  Bottom: teal gradient avatar + DM Sans 13px name + "FREE PLAN" DM Mono badge
  REMOVE FROM SIDEBAR: Settings · Logout · "New Audit" button — delete entirely

TOPBAR — correct on every app page:
  Height: h-[56px]
  Background: bg-[rgba(34,40,49,0.95)] backdrop-blur-[16px]
  Bottom border: border-b border-[rgba(0,173,181,0.08)]
  Right icons: Bell · MessageSquare · Settings2 · Avatar (Lucide, teal #00ADB5, 18px)

BACKGROUND — apply to every page wrapper (public and app):
  Base: bg-[#222831]
  Dot grid (add .dot-grid class from globals.css):
    background-image: radial-gradient(circle, rgba(0,173,181,0.05) 1px, transparent 1px)
    background-size: 28px 28px
  Ambient glow (top-right, every page):
    background: radial-gradient(ellipse 600px at 100% 0%, rgba(0,173,181,0.08), transparent)

FOOTER — present on every app page, bottom of main content:
  "SYSTEM INTEGRITY: 99.9% · AUDIT HASH: 0x8F2...3A1 · © 2026 ETHYX AI QUANTUM AUDIT SYSTEMS"
  font-dm-mono text-[9px] text-[#4A5360] text-center
```

### 4D — Component Corrections
```
ALL CARDS — apply glassmorphism:
  bg-[rgba(57,62,70,0.72)] backdrop-blur-[14px]
  border border-[rgba(0,173,181,0.12)] rounded-[14px] p-5
  (not solid backgrounds, not white, not #1C2128 flat)

ALL BUTTONS:
  Primary: bg-[#00ADB5] text-[#222831] font-dm-sans font-semibold text-[14px] rounded-[8px]
           hover: bg-[#008891] + box-shadow 0 0 30px rgba(0,173,181,0.35) + scale(1.01)
  Ghost:   transparent border border-[#00ADB5] text-[#00ADB5] same radius
  Danger:  transparent border border-[#EF4444] text-[#EF4444]

ALL FORM INPUTS:
  bg-[#393E46] border border-[#393E46] rounded-[8px] text-[#EEEEEE]
  placeholder text-[#6B8090] font-dm-sans text-[14px]
  focus: border-[#00ADB5] ring-2 ring-[rgba(0,173,181,0.2)] transition-all 150ms

ALL INLINE STYLES — convert every style="" to Tailwind classes. Zero exceptions.
  If a value has no Tailwind equivalent, add it to globals.css as a utility class.

ALL CHARTS (Recharts) — apply this exact theme to every chart on every page:
  Tooltip: { contentStyle: { background:'#1C2128', border:'1px solid rgba(0,173,181,0.25)',
             borderRadius:'8px', fontFamily:'DM Mono', fontSize:'11px', color:'#EEEEEE' } }
  CartesianGrid: strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)"
  Axis ticks: fill="#6B8090" fontSize={10} fontFamily="DM Mono"
  Axis lines: stroke="rgba(255,255,255,0.08)"
  Primary series: #00ADB5 | Secondary: rgba(0,173,181,0.45) | Danger: #EF4444
  All wrapped in: <ResponsiveContainer width="100%" height={280}>

ALL ICONS — Lucide React only:
  Nav: 16px | Topbar: 18px | Cards: 20px | Hero: 24px
  Active/teal context: text-[#00ADB5] | Muted context: text-[#6B8090]
```

### 4E — Animation Architecture
```
Create /lib/animations.ts on Day 1. Every page imports from here. No one-off animations.

export const animations = {
  pageEnter: {
    hidden: { opacity: 0, y: 8 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } }
  },
  cardReveal: {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.35 } }
  },
  stagger: { visible: { transition: { staggerChildren: 0.08 } } },
  hoverGlow: { boxShadow: '0 0 20px rgba(0,173,181,0.25)', transition: { duration: 0.15 } },
  tapPress: { scale: 0.98 },
  spring: { type: 'spring', stiffness: 300, damping: 30 },
  heavySpring: { type: 'spring', stiffness: 400, damping: 40 },
  drawerOpen: {
    initial: { x: '100%', opacity: 0 }, animate: { x: 0, opacity: 1 },
    exit: { x: '100%', opacity: 0 }, transition: { type: 'spring', stiffness: 400, damping: 40 }
  },
  modalOpen: {
    initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 }, transition: { duration: 0.2 }
  },
}

Shared layoutIds (globally unique — never duplicate):
  "sidebar-active-indicator" | "dashboard-view-indicator" | "profile-tab-indicator" | "strategy-selected-border"
```

---

## 5 — ARCHITECTURE (LOCKED — no debate, no alternatives)

### Tech Stack
```
Frontend:   Next.js 14 App Router — TypeScript strict — Tailwind CSS — Framer Motion 11.x
Auth:       Supabase Auth + @supabase/ssr EXACTLY 0.5.2 (not ^ not latest) + Google OAuth
Database:   Supabase PostgreSQL + RLS
Storage:    Azure Blob Storage — container: ethyx-uploads — PRIVATE
Backend:    FastAPI Python 3.10.11 EXACT on Azure App Service B1
AI:         Gemini 1.5 Flash free tier — always parse_gemini_json(), never json.loads()
Charts:     Recharts ONLY — no Chart.js, no D3 direct
Icons:      Lucide React ONLY
PDF:        jsPDF + html2canvas — never window.print()
Errors:     Azure Application Insights
Tests:      Playwright (Phase 9)
```

### Critical Pinned Versions
```
@supabase/ssr:        0.5.2 EXACT — PKCE breaks on any other version
numpy:                >=1.23.0,<2.0.0 — AIF360 C extensions crash on 2.x
aif360:               0.6.1
fairlearn:            0.10.0
google-generativeai:  0.8.3
asyncpg:              0.29.0
uvicorn[standard]:    0.30.6
azure-storage-blob:   >=12.19.0
```

### Monorepo Structure
```
/ethyx/
  ├── AGENTS.md · DESIGN_SYSTEM.md · ARCHITECTURE.md · MCP_RULES.md · WORKFLOW.md
  ├── stitch-exports/          ← the 11 HTML files (visual source of truth)
  ├── frontend/                ← Next.js 14 App Router
  │   ├── app/
  │   │   ├── auth/callback/route.ts      ← OAuth PKCE — MUST be route.ts, NEVER page.tsx
  │   │   ├── (public)/
  │   │   │   ├── page.tsx               ← Landing
  │   │   │   ├── login/page.tsx
  │   │   │   └── signup/page.tsx
  │   │   └── (app)/
  │   │       ├── layout.tsx             ← Sidebar + Topbar shell
  │   │       ├── upload/page.tsx
  │   │       ├── dashboard/page.tsx
  │   │       ├── explain/page.tsx
  │   │       ├── mitigate/page.tsx
  │   │       ├── report/page.tsx
  │   │       └── profile/page.tsx
  │   ├── components/
  │   │   ├── shared/    ← Sidebar · Topbar · Footer · LoadingOverlay · SectionLabel · StatusBadge · CodeBlock
  │   │   ├── charts/    ← ApprovalRateChart · BiasHeatmap · ExecutiveGauge · ShapChart · PDPChart · MitigationFlowChart
  │   │   ├── dashboard/ ← KPICard · AlertsFeed · AIChatWidget · ViewToggle
  │   │   ├── mitigate/  ← BeforeAfterCards · StrategyGrid
  │   │   ├── report/    ← MetricsTable
  │   │   ├── forms/     ← reusable form elements
  │   │   └── ui/        ← shadcn primitives (CLI generated)
  │   ├── hooks/         ← useAnalysisPolling · useUploadWizard · useSHAPDrawer
  │   ├── lib/
  │   │   ├── supabase/client.ts · server.ts
  │   │   ├── animations.ts
  │   │   └── utils.ts
  │   ├── middleware.ts
  │   ├── tailwind.config.ts
  │   ├── globals.css
  │   └── package.json
  └── backend/                 ← FastAPI Python 3.10.11
      ├── routes/ — auth · upload · analyze · explain · mitigate · report
      ├── utils/  — azure_blob · gemini · fairness · db
      ├── auth/verify_jwt.py   ← PyJWT only, never firebase-admin
      ├── main.py
      └── requirements.txt
```

### Routes
```
Public (no auth): /  ·  /login  ·  /signup  ·  /auth/callback
Protected (auth): /upload → /dashboard → /explain → /mitigate → /report → /profile
After login  → /dashboard
After signup → /upload
```

### Database Schema
```sql
-- Run in Supabase SQL Editor

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT, org_name TEXT,
  plan TEXT NOT NULL DEFAULT 'free',
  onboarded BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.analysis_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  domain TEXT NOT NULL CHECK (domain IN ('hiring','loans','healthcare')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','running','complete','failed')),
  step INTEGER NOT NULL DEFAULT 0,
  step_description TEXT,
  blob_key TEXT,
  column_mapping JSONB,
  results_json JSONB,
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analysis_runs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own_profile" ON public.profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "own_runs" ON public.analysis_runs FOR ALL USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.handle_updated_at() RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END; $$ LANGUAGE plpgsql;
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.analysis_runs
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS TRIGGER AS $$
BEGIN INSERT INTO public.profiles (id, name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email));
  RETURN NEW; END; $$ LANGUAGE plpgsql SECURITY DEFINER;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### Backend API (FastAPI — match these exactly)
```
POST /upload/sas-url         → { sasUrl, blobKey, expiresIn: 900 }
POST /upload/model           → MOCK ONLY — no joblib.load() — RCE vulnerability
POST /analyze                → { analysisId, status:'pending' } — rate: 3/hr per IP
GET  /analyze/{id}/status    → { status, step, stepDescription, results, error }
POST /analyze/{id}/chat      → { answer, sources } — rate: 10/hr per IP
GET  /explain/{id}           → { predictions, feature_names }
POST /mitigate               → { mitigated_metrics, improvement_pct, python_code, explanation } — rate: 10/hr
GET  /report/{id}            → { reportId, generatedAt, dataset, metrics, riskLevel, recommendations, narrative }
```

### Environment Variables
```
Frontend (.env.local) — ONLY these, nothing else:
  NEXT_PUBLIC_SUPABASE_URL=https://skvsljnuaxcwaxuekpzc.supabase.co
  NEXT_PUBLIC_SUPABASE_ANON_KEY=[from Supabase dashboard]
  NEXT_PUBLIC_API_URL=https://[azure-app].azurewebsites.net
  SENTRY_DSN=[frontend sentry dsn]

Backend (Azure App Service env) — server-side ONLY, never expose to frontend:
  SUPABASE_JWT_SECRET · AZURE_STORAGE_CONNECTION_STRING · AZURE_CONTAINER_NAME=ethyx-uploads
  AZURE_ACCOUNT_NAME · AZURE_ACCOUNT_KEY · GEMINI_API_KEY · FRONTEND_URL · SENTRY_DSN
```

---

## 6 — SECURITY NON-NEGOTIABLES (pre-fixed bugs — never reintroduce)

```
joblib.load()           → DELETED. RCE vulnerability. /upload/model returns mock only.
/auth/callback/page.tsx → DELETED. Must be route.ts for PKCE. Never page.tsx.
numpy >= 2.0.0          → BANNED. AIF360 C extensions crash. Keep <2.0.0 hard limit.
getSession()            → NEVER USE. Use getUser() always. getSession() is insecure.
json.loads(response.text) → NEVER. Use parse_gemini_json() which strips markdown fences.
window.print()          → DELETED. Use jsPDF + html2canvas only.
NEXT_PUBLIC_AZURE_*     → BANNED. Azure secrets are server-side only.
NEXT_PUBLIC_GEMINI_*    → BANNED. Gemini key is server-side only.
Polling without limit   → BANNED. Max 90 retries (3 min) then timeout error and stop.
```

---

## 7 — PHASE 0 BUILD TASK (produce this in the current session)

You have read all context docs and all 11 Stitch exports.
You understand the correction directives and architecture.
Now use planning mode to build Phase 0 completely.

**Produce every file below with full implementation — no stubs, no TODOs:**

### Frontend Foundation
```
/ethyx/frontend/package.json
  — @supabase/ssr exactly "0.5.2" (no caret)
  — next "^14", framer-motion "^11", recharts "^2"
  — lucide-react, jspdf, html2canvas, @azure/storage-blob "^12.19.0"
  — @sentry/nextjs, clsx, tailwind-merge, class-variance-authority

/ethyx/frontend/tailwind.config.ts
  — Custom colors: bg-base, surface, teal, teal-dark, teal-light, text-primary,
    text-secondary, text-muted, text-faint, success, warning, danger
  — Custom fonts: orbitron, dm-sans, dm-mono
  — Custom borderRadius: card (14px), btn (8px), badge (99px)
  — Custom boxShadow: teal-glow, teal-glow-lg
  — Custom backgroundImage: dot-grid (radial-gradient pattern)
  — Custom backdropBlur: card (14px), nav (20px)

/ethyx/frontend/globals.css
  — Google Fonts import: Orbitron 700+900, DM Sans 400+500+600, DM Mono 400+500
  — CSS custom properties for ALL design tokens
  — .dot-grid utility class
  — .glass utility class
  — Scrollbar: thin teal track
  — ::selection: teal bg dark text
  — :focus-visible: 2px teal ring
  — shadcn dark theme CSS variable overrides (bg, border, ring, foreground)

/ethyx/frontend/lib/animations.ts
  — All animation tokens from Section 4E above — complete file, no stubs

/ethyx/frontend/lib/utils.ts
  — cn() helper using clsx + tailwind-merge
  — Any other shared utilities

/ethyx/frontend/lib/supabase/client.ts
  — createBrowserClient from @supabase/ssr 0.5.2

/ethyx/frontend/lib/supabase/server.ts
  — createServerClient from @supabase/ssr 0.5.2
  — cookies() integration for Next.js App Router

/ethyx/frontend/middleware.ts
  — createServerClient session refresh on every request
  — Protected paths: /upload /dashboard /explain /mitigate /report /profile
  — getUser() — never getSession()
  — No session → redirect to /login
  — Refreshes cookies on every response

/ethyx/frontend/app/auth/callback/route.ts
  — PKCE code exchange using exchangeCodeForSession(code)
  — Success → redirect to /dashboard
  — Failure → redirect to /login?error=oauth_failed
  — NEVER as page.tsx

/ethyx/frontend/.env.local.example
  — All frontend env vars with placeholders, comments, and the warning about secrets
```

### Backend Foundation
```
/ethyx/backend/requirements.txt
  — All packages pinned to exact versions from ARCHITECTURE.md
  — numpy>=1.23.0,<2.0.0 with comment explaining the hard limit
  — Python version comment: # Python 3.10.11 EXACT

/ethyx/backend/main.py
  — FastAPI app with CORS (FRONTEND_URL env var, not wildcard *)
  — slowapi rate limiting (Limiter keyed by remote address)
  — lifespan() context manager: marks orphaned 'running'/'pending' jobs as 'failed' on startup
  — Sentry initialization (SENTRY_DSN env var)
  — All routes included

/ethyx/backend/auth/verify_jwt.py
  — PyJWT decode with SUPABASE_JWT_SECRET and audience="authenticated"
  — Returns UserClaims(id, email)
  — Raises HTTPException 401 on expired or invalid token
  — No firebase-admin anywhere

/ethyx/backend/utils/gemini.py
  — parse_gemini_json() that strips ```json and ``` fences before json.loads()
  — call_gemini_with_retry() with max 3 retries and exponential backoff

/ethyx/backend/utils/azure_blob.py
  — generate_sas_upload_url() — 15 min expiry, write+create permissions
  — download_blob() — returns bytes for CSV processing
  — Uses AZURE_STORAGE_CONNECTION_STRING from env only (never hardcoded)

/ethyx/backend/utils/fairness.py
  — compute_fairness_metrics() stub with asyncio.wait_for timeout=300
  — Returns AnalysisResults shape from ARCHITECTURE.md

/ethyx/backend/routes/analyze.py
  — POST /analyze → create DB row + launch asyncio.create_task(run_analysis())
  — GET /analyze/{id}/status → return current status/step/results
  — run_analysis() with full try/except: timeout→failed, error→failed+sentry
  — @limiter.limit("3/hour") on POST /analyze
```

### shadcn/ui Setup
```
Provide the exact commands to run:
  npx shadcn-ui@latest init (dark theme, CSS variables, path aliases)
  npx shadcn-ui@latest add toast dialog tabs sheet progress badge tooltip select switch popover dropdown-menu

Then provide the globals.css shadcn variable overrides for dark ETHYX theme.
```

### Folder Structure Initialization
```
Create all remaining empty folders with .gitkeep:
  /ethyx/frontend/components/shared/
  /ethyx/frontend/components/charts/
  /ethyx/frontend/components/dashboard/
  /ethyx/frontend/components/mitigate/
  /ethyx/frontend/components/report/
  /ethyx/frontend/components/forms/
  /ethyx/frontend/hooks/
  /ethyx/backend/routes/
  /ethyx/backend/utils/
  /ethyx/backend/auth/
```

---

## 8 — CODE QUALITY RULES (apply to every file you generate)

```
TypeScript:  Strict mode. No any. No @ts-ignore. All .tsx/.ts — zero .jsx/.js.
Components:  Max 200 lines per file. Extract if longer.
Imports:     1) React/Next 2) External libs 3) Internal components 4) Utils/types
Styles:      Zero style="" attributes. Tailwind only. Custom values → globals.css.
Errors:      Every async function: try/catch. Every API call: loading + error + empty state.
Server/Client: Default Server Component. Add "use client" only when: useState/useEffect/
               event handlers/browser APIs/Framer Motion/Recharts are needed.
Supabase:    getUser() always — never getSession(). createBrowserClient for client,
             createServerClient for server — both from @supabase/ssr 0.5.2.
File header: Add a 2-line comment at top of each file: purpose + key dependencies.
```

---

## 9 — OUTPUT SPECIFICATION

After reading all files and processing all directives, use planning mode to:

**1. Produce a DESIGN CORRECTION SUMMARY** (one concise reference file — max 60 lines):
   `/ethyx/STITCH_CORRECTIONS.md`
   — Per page: list of corrections applied when converting to Next.js
   — Not a violation audit. A conversion reference. Active voice: "Remove Space Grotesk. Add dot-grid. Rebuild sidebar to 240px."
   — This file will be referenced at the start of each build phase.

**2. Produce ALL Phase 0 files** from Section 7 with complete implementation.
   — Every file complete. No stubs. No "add your logic here".
   — Code must pass `npm run build` and `pip check` with zero errors.

**3. Confirm readiness** with this exact summary:
```
═══════════════════════════════════════════════════
ETHYX AI — PHASE 0 COMPLETE
═══════════════════════════════════════════════════
Files generated:       [N]
shadcn components:     [list]
Pre-deploy checks:     [run and confirm all pass]

  grep -r "FairCheck|FairPlay" .        → 0 results ✓
  grep -r "joblib.load" .               → 0 results ✓
  grep -r "NEXT_PUBLIC_AZURE|NEXT_PUBLIC_GEMINI" . → 0 results ✓
  grep -r "window.print" .              → 0 results ✓
  grep -r "getSession" .                → 0 results ✓

Ready for Phase 1: [YES / BLOCKED BY: ...]
Next command:      Paste PROMPT 1 from PRD_v3.html for Design Foundation
═══════════════════════════════════════════════════
```

