# ETHYX AI — AGENTS.md
# Master instruction file for Google Antigravity AI IDE
# Place at: /ethyx/AGENTS.md (project root)
# Antigravity reads this automatically on every prompt.

---

## 🧠 WHO YOU ARE BUILDING FOR

You are building **ETHYX AI** — a production-grade AI bias detection and fairness auditing SaaS.
- Tagline: "Is your AI treating everyone fairly?"
- Brand: ETHYX AI / OBSIDIAN LENS / AI BIAS DETECTION PLATFORM
- **NEVER** say FairCheck, FairPlay, or any previous name. Zero tolerance.
- Run `grep -r "FairCheck\|FairPlay"` before every file creation. Must return zero results.

---

## 🏗️ PROJECT STRUCTURE

```
/ethyx/                          ← monorepo root (YOU ARE HERE)
  AGENTS.md                      ← this file (read first always)
  DESIGN_SYSTEM.md               ← design tokens (read for all UI work)
  ARCHITECTURE.md                ← tech stack, routes, DB schema
  MCP_RULES.md                   ← when to use each MCP server and skill
  /stitch-exports/               ← Stitch-generated page designs (source of truth for UI)
    01_landing.html
    02_login.html
    03_signup.html
    04_upload.html
    05_dashboard.html
    06_explain.html
    07_mitigate.html
    08_report.html
    09_profile.html
  /frontend/                     ← Next.js 14 App Router
    /app/
      /auth/callback/route.ts    ← OAuth PKCE handler (NEVER page.tsx)
      /(public)/                 ← Landing, Login, Signup (no auth, no sidebar)
        page.tsx                 ← Landing
        /login/page.tsx
        /signup/page.tsx
      /(app)/                    ← Auth-protected routes (sidebar + topbar)
        layout.tsx               ← Shared sidebar + topbar layout
        /dashboard/page.tsx
        /upload/page.tsx
        /explain/page.tsx
        /mitigate/page.tsx
        /report/page.tsx
        /profile/page.tsx
    /components/
      /shared/                   ← Sidebar, Topbar, Footer, LoadingOverlay
      /ui/                       ← shadcn/ui primitives
      /charts/                   ← All Recharts wrappers
      /forms/                    ← Form components
    /lib/
      /supabase/
        client.ts                ← createBrowserClient
        server.ts                ← createServerClient
    middleware.ts                ← Route protection (session refresh)
    tailwind.config.ts
    globals.css
    package.json
  /backend/                      ← FastAPI Python 3.10.11
    /routes/
      auth.py, upload.py, analyze.py, explain.py, mitigate.py, report.py
    /utils/
      azure_blob.py, gemini.py, fairness.py, db.py
    main.py
    requirements.txt

```

---

## ⚙️ CORE BEHAVIORAL RULES

### Rule 1 — Always Read Stitch Exports First
Before building ANY page, read the corresponding file in `/stitch-exports/`.
That file is the visual source of truth. The PRD describes the spec.
Your job is to convert the Stitch design into production Next.js code.

### Rule 2 — Context7 for Every Library Call
Before writing any code that uses an external library, call context7 to get live docs.
This is mandatory for: Supabase, Next.js App Router, Recharts, Framer Motion, Azure Storage SDK.
Never guess at API signatures. Never use training data for library APIs.
```
use library /supabase/supabase
use library /vercel/next.js
use library /recharts/recharts
```

### Rule 3 — 21st_dev for Every UI Component
When creating any visual component, use the `/ui` command first.
Never write raw JSX from scratch for complex UI. Let 21st_dev generate it, then adapt.
```
/ui create dark glassmorphism KPI card with teal accent and DM Mono metric value
```

### Rule 4 — Server vs Client Components
- Default to SERVER components in Next.js App Router
- Add `"use client"` ONLY when component needs: useState, useEffect, event handlers, browser APIs
- Data fetching: always in Server Components or Route Handlers
- Auth: always use `supabase.auth.getUser()` — NEVER `getSession()` (insecure, uses cache)

### Rule 5 — TypeScript Everywhere
- All files: `.tsx` or `.ts`. Zero `.js` or `.jsx` files in frontend.
- Strict mode on. No `any` types. No `@ts-ignore`.
- Define interfaces for all props, API responses, and DB row types.

### Rule 6 — File Size Limit
- Max 200 lines per component file.
- If a page is getting long, extract sections into sub-components in `/components/`.
- Charts always in `/components/charts/`. Shared layout always in `/components/shared/`.

### Rule 7 — No Inline Styles
- Zero `style={{}}` props in JSX. Use Tailwind classes only.
- Custom values that can't be done with Tailwind go in `globals.css` as CSS custom properties.

### Rule 8 — Error Handling is Mandatory
Every async function must have try/catch.
Every API call must handle: loading state, error state, empty state.
Never leave a UI in a broken state silently.

### Rule 9 — Security Non-Negotiables
- Azure connection string: NEVER in frontend code. Server-side only.
- Gemini API key: NEVER in frontend. Backend only.
- All protected routes: verified by `middleware.ts` + backend JWT check.
- No `joblib.load()` anywhere. The /upload/model route returns a mock only.

### Rule 10 — Import Order
```typescript
// 1. React/Next.js
import { useState } from 'react'
import { useRouter } from 'next/navigation'
// 2. External libraries
import { motion } from 'framer-motion'
import { BarChart } from 'recharts'
// 3. Internal components
import { Sidebar } from '@/components/shared/Sidebar'
// 4. Utilities/types
import { cn } from '@/lib/utils'
import type { AnalysisRun } from '@/types'
// 5. Styles (if needed)
```

---

## 🎨 QUICK DESIGN REFERENCE

Full details in `DESIGN_SYSTEM.md`. Quick cheatsheet:

```
bg:       #222831    surface:  #1C2128    card: rgba(57,62,70,0.72)
teal:     #00ADB5    text:     #EEEEEE    muted: #6B8090
success:  #10B981    warning:  #F59E0B    danger: #EF4444
font-display: Orbitron 900    font-body: DM Sans    font-mono: DM Mono
card-radius: 14px    card-border: rgba(0,173,181,0.12)
NEVER: purple · indigo · bright blue · white backgrounds
```

---

## 🔒 CRITICAL BUGS — PRE-FIXED (DO NOT REINTRODUCE)

1. **RCE** — `joblib.load()` on user bytes = Remote Code Execution. DELETED. Mock only.
2. **OAuth** — `/auth/callback` MUST be `route.ts` (Route Handler), NEVER `page.tsx`.
3. **numpy** — MUST stay `>=1.23.0,<2.0.0`. AIF360 breaks on numpy 2.x.
4. **CORS** — `CORSMiddleware` with `FRONTEND_URL` env var. Required day 1.
5. **Gemini JSON** — Always use `parse_gemini_json()`. Never bare `json.loads(response.text)`.
6. **Polling** — Max 90 retries (3 min). Must call `setPollStatus('timeout')` on limit.
7. **Stale jobs** — `lifespan()` marks orphaned `running`/`pending` jobs as `failed` on restart.
8. **Secrets** — `AZURE_STORAGE_CONNECTION_STRING` and `GEMINI_API_KEY` are backend-only. Never `NEXT_PUBLIC_*`.

---

## ✅ PRE-DEPLOY CHECKLIST (run before every commit)

```bash
grep -r "FairCheck\|FairPlay" .        # → must return 0 results
grep -r "joblib.load" .                # → must return 0 results
grep -r "NEXT_PUBLIC_AZURE\|NEXT_PUBLIC_GEMINI" . # → must return 0
grep -r "window.print" .               # → must return 0 (use jsPDF)
grep -r "json.loads(response.text)" .  # → must return 0 (use parse_gemini_json)
npm run build                          # → zero TypeScript errors
pip check                              # → "No broken requirements"
```
