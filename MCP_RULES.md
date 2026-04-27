# ETHYX AI — MCP_RULES.md
# Exact rules for when/how to use each MCP server and Skill
# Place at: /ethyx/MCP_RULES.md (project root)
# Read this before every prompt to know which tools to activate.

---

## ⚡ MCP SERVER RULES

---

### MCP: context7
**What it does:** Fetches live, version-specific documentation for any library directly
into your context. Prevents hallucinated APIs and outdated code patterns.

**MANDATORY trigger words — add to prompt when:**
- Writing ANY Supabase code → `use library /supabase/supabase`
- Writing ANY Next.js App Router code → `use library /vercel/next.js`
- Writing ANY Recharts code → `use library /recharts/recharts`
- Writing ANY Framer Motion code → `use library /framer-motion/motion`
- Writing ANY Azure Blob Storage code → `use library /azure/azure-sdk-for-js`
- Generic trigger for any library → `use context7`

**ETHYX-specific context7 triggers by phase:**

| Phase | Trigger |
|-------|---------|
| P0 — Scaffold | `use library /supabase/supabase` + `use library /vercel/next.js` |
| P1 — Foundation | `use library /tailwindlabs/tailwindcss` + `use library /framer-motion/motion` |
| P2 — Auth pages | `use library /supabase/supabase` (PKCE OAuth docs critical) |
| P3 — Upload | `use library /supabase/supabase` + Azure Blob docs |
| P4 — Backend | context7 for FastAPI patterns |
| P5 — Dashboard | `use library /recharts/recharts` |
| P6 — Explain | `use library /recharts/recharts` |
| P9 — Tests | `use library /microsoft/playwright` |

**How to trigger in prompt:**
```
# Explicit library (fastest — skips matching step)
use library /supabase/supabase for auth and database docs
use library /vercel/next.js for App Router docs

# Generic (slower — context7 auto-matches library)
use context7
```

---

### MCP: 21st_dev (Magic Component Builder)
**What it does:** Generates polished React/TypeScript UI components from natural
language. Like v0 but inside Antigravity. Always generates multiple variants to pick from.

**Trigger syntax:**
```
/ui [description of component]
```

**ETHYX trigger rules — use /ui for:**
```
✅ Any new visual component being created from scratch
✅ KPI cards, chart wrappers, badge groups
✅ Forms, inputs, dropzone areas
✅ Tables, data grids, expandable rows
✅ Navigation elements, tabs, toggles
✅ Modals, drawers, popovers
✅ Dashboard sections (alerts feed, AI chat widget)
✅ Enhancement of existing components (add animation, glow)
✅ Logo search via SVGL integration

❌ DO NOT use /ui for:
❌ Logic/utility functions
❌ API calls or data fetching
❌ Auth code
❌ Backend routes
```

**ETHYX-specific /ui calls by phase:**

```
Phase 1:
  /ui create dark glassmorphism sidebar 240px with teal active indicator
  /ui create dark frosted glass topbar 56px with breadcrumb and icon row
  /ui create analysis loading overlay with concentric teal rings and step checklist

Phase 2:
  /ui create asymmetric hero section dark SaaS with teal accent and bias gauge right
  /ui create animated conic-gradient border auth card with split panels
  /ui create 3-segment password strength bar teal/amber/green

Phase 3:
  /ui create dark CSV dropzone with dashed teal border and drag-hover state
  /ui create 3 domain selection cards horizontal with teal selected state

Phase 5:
  /ui create 4 dark glassmorphism KPI cards with DM Mono metrics and count-up animation
  /ui create dark bar chart approval rate gap with teal bars and reference line
  /ui create dark AI chat widget with teal user bubbles and typing indicator

Phase 6:
  /ui create dark data table with inline drawer expansion and Framer Motion layout
  /ui create horizontal SHAP bar chart positive teal negative red extending from center
  /ui create PDP partial dependence curve with interactive slider and impact pill

Phase 7:
  /ui create before/after bias score comparison cards animated bar transition
  /ui create 2x2 strategy selection grid dark with teal selected state and glow

Phase 8:
  /ui create dark audit report document card with traffic light risk indicator
  /ui create user profile card with teal gradient avatar and stats row
```

---

### MCP: shadcn
**What it does:** Provides direct access to shadcn/ui component registry —
unstyled Radix UI primitives styled with Tailwind. Install and customize.

**ETHYX component mapping — use shadcn for:**

```
shadcn Sheet     → SHAP drawer in /explain (slide-in panel)
shadcn Tabs      → Profile page (Account/History/Billing/Integrations)
                 → Dashboard toggle (Technical/Executive — or custom)
shadcn Toast     → Upload success, analysis complete, copy link, errors
shadcn Dialog    → Deploy confirmation in /mitigate
                 → Decommission account in /profile
                 → Delete data confirmation
shadcn Progress  → Upload progress bar, analysis step progress
shadcn Select    → Column mapping dropdowns in /upload Step 3
                 → Domain select (mobile fallback)
shadcn Tooltip   → Bias metric tooltips (what does "Disparate Impact" mean)
shadcn Badge     → Status badges (PASS/FAIL/WARN) throughout app
shadcn Switch    → Notification toggles in /profile Account tab
shadcn Popover   → Date pickers, filter menus
```

**Dark theme all shadcn components:**
```typescript
// All shadcn components need dark theme overrides
// bg inputs: #393E46
// borders: rgba(0,173,181,0.2)
// focus rings: teal
// text: #EEEEEE
// Apply via CSS variables in globals.css
```

---

### MCP: Stitch
**What it does:** Connects to your Google Stitch generated page designs.
Use to export layout structure, spacing, and component patterns from your chosen variants.

**ETHYX workflow with Stitch:**
```
1. At the start of each page phase:
   → Reference /stitch-exports/[page].html
   → Antigravity reads the Stitch export as visual source of truth

2. For each phase prompt, add:
   "Reference /stitch-exports/05_dashboard.html for the exact layout.
    Convert to Next.js following the design system tokens."

3. Stitch export → Antigravity uses it to:
   → Extract exact spacing values
   → Identify component patterns
   → Match the layout structure you approved in Stitch
```

**Per-page Stitch file reference:**
```
Phase 2 Landing  → /stitch-exports/01_landing.html
Phase 2 Login    → /stitch-exports/02_login.html
Phase 2 Signup   → /stitch-exports/03_signup.html
Phase 3 Upload   → /stitch-exports/04_upload.html
Phase 5 Dashboard → /stitch-exports/05_dashboard.html
Phase 6 Explain  → /stitch-exports/06_explain.html
Phase 7 Mitigate → /stitch-exports/07_mitigate.html
Phase 8 Report   → /stitch-exports/08_report.html
Phase 8 Profile  → /stitch-exports/09_profile.html
```

---

### MCP: playwright
**What it does:** Browser automation and E2E testing.
Runs real browser sessions to test the complete app flow.

**Use playwright for (Phase 9 only):**
```
✅ Auth flow E2E: signup → email verify → login → dashboard
✅ Upload wizard: domain select → CSV upload → column mapping → analysis start
✅ Dashboard: polling → results load → chart renders → toggle view
✅ Report export: PDF download triggers correctly
✅ Profile: tab switching, edit form, danger zone confirms
✅ Mobile viewport tests (375px)
✅ Accessibility snapshots on every page
✅ Visual regression screenshots
```

---

## ◆ SKILL USAGE RULES

---

### Skill: frontend-design
**Fire when:** ANY page or visual component is being built.
Core skill. Always active for UI work.
Enforces: bold aesthetic choices, distinctive typography usage,
layered backgrounds, unexpected layouts, high-impact animations.

---

### Skill: ui-ux-pro-max
**Fire when:** Complex interactive pages with high visual requirements:
- Landing page (hero, scroll animations, speedometer)
- Dashboard (multiple chart types, toggle views, live feed)
- Explain page (interactive drawer, PDP slider)

Pushes design quality to maximum. Use alongside frontend-design.

---

### Skill: react-best-practices
**Fire when:** Writing ANY React component.
Enforces: correct hooks usage, memo optimization, error boundaries,
prop-types with TypeScript interfaces, component composition.

---

### Skill: react-patterns
**Fire when:** Building complex React structures:
- Upload wizard (compound component + useReducer)
- Dashboard (Context + useReducer for view state)
- Explain page (compound table with expandable rows)
- Custom hooks: useAnalysisPolling, useAnalysisResults

---

### Skill: nextjs-best-practices
**Fire when:** Writing Next.js App Router code:
- Route groups `(public)` vs `(app)` layout distinction
- Server vs Client component decisions
- Metadata API, generateMetadata()
- Route handlers vs page components
- Middleware session handling

---

### Skill: tailwind-patterns
**Fire when:** Writing Tailwind CSS classes.
Prevents: class bloat, non-responsive patterns, magic numbers in styles.
Enforces: design token usage, consistent spacing scale, proper responsive prefixes.

---

### Skill: 3d-web-experience
**Fire when:** Building the Landing page hero section.
Use for: SVG speedometer gauge with animated needle, teal glow orb,
3D-effect depth on the hero visual, crosshair decorations.

---

### Skill: canvas-design
**Fire when:** Building chart-heavy or custom visual components:
- Bias heatmap matrix (Dashboard — 7x7 color grid)
- Executive gauge (semi-circle SVG gauge with animated needle)
- Custom Recharts shapes or renderers

---

### Skill: scroll-experience
**Fire when:** Building the Landing page.
Use for: scroll-triggered section reveals, parallax effects on hero,
How It Works step animations on scroll-enter,
Capabilities cards staggered reveal.

---

### Skill: senior-fullstack
**Fire when:** Architecture decisions, not feature code:
- Project scaffold (Phase 0)
- Middleware design
- Error handling strategy
- API contract design
- Security review

---

### Skill: frontend-developer
**Fire when:** Component file structure, organization:
- Setting up component folders
- Import organization
- TypeScript interface definitions
- Prop type design
- Report page (document-like component structure)

---

### Skill: backend-dev-guidelines
**Fire when:** FastAPI backend code:
- Route design and dependency injection
- Async patterns and background tasks
- Error response shapes
- Logging strategy

---

### Skill: api-patterns
**Fire when:** Designing or consuming APIs:
- FastAPI endpoint naming and request/response schemas
- Frontend API client functions
- Error handling for fetch calls
- SAS token generation flow

---

### Skill: database-design
**Fire when:** Database-related work:
- Supabase SQL schema writing
- RLS policy design
- JSONB column structure
- Index strategy
- Query optimization

---

## 🗺️ PHASE → MCP + SKILL CHEATSHEET

```
Phase 0  Setup:     context7 · senior-fullstack · database-design · nextjs-best-practices
Phase 1  Foundation: 21st_dev · shadcn · context7 · frontend-design · tailwind-patterns · nextjs-best-practices · react-best-practices · frontend-developer
Phase 2  Public:    21st_dev · shadcn · Stitch · context7 · ui-ux-pro-max · frontend-design · scroll-experience · 3d-web-experience · tailwind-patterns
Phase 3  Upload:    21st_dev · context7 · shadcn · Stitch · react-patterns · nextjs-best-practices · api-patterns · frontend-developer
Phase 4  Backend:   context7 · backend-dev-guidelines · api-patterns · database-design · senior-fullstack
Phase 5  Dashboard: 21st_dev · shadcn · context7 · Stitch · canvas-design · react-best-practices · react-patterns · ui-ux-pro-max · tailwind-patterns
Phase 6  Explain:   21st_dev · shadcn · context7 · Stitch · react-patterns · canvas-design · ui-ux-pro-max · react-best-practices
Phase 7  Mitigate:  21st_dev · shadcn · context7 · Stitch · react-best-practices · frontend-design · tailwind-patterns
Phase 8  Report+Profile: 21st_dev · shadcn · context7 · Stitch · frontend-developer · react-patterns · tailwind-patterns
Phase 9  Tests:     playwright · context7 · senior-fullstack · backend-dev-guidelines · nextjs-best-practices
```
