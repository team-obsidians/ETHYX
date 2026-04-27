# ETHYX AI — STITCH_CORRECTIONS.md
# Per-page conversion reference. Apply these when converting Stitch → Next.js.
# Active voice. Not an audit — a build instruction set.

## ALL PAGES (apply universally)
- Remove Space Grotesk, Manrope, Inter, Poppins, Roboto from fonts.
- Replace with Orbitron (700/900), DM Sans (400/500/600), DM Mono (400/500).
- Replace any purple/indigo/blue accent → #00ADB5.
- Replace white/light-gray backgrounds → #222831.
- Replace lh3.googleusercontent.com image URLs → inline SVG placeholders.
- Convert every style="" attribute → Tailwind classes.
- Replace Material Symbols → Lucide React icons.
- Add dot-grid class to every page wrapper.
- Add ambient teal glow (radial-gradient 600px top-right).
- Use #55d8e1 for text labels/glows only. Use #00ADB5 for buttons/borders/CTAs.

## 00_loading.html → LoadingOverlay component
- Remove Space Grotesk from font import. Keep Orbitron + DM Sans + DM Mono only.
- Convert rotating-glow conic-gradient to Framer Motion rotate animation.
- Convert scanline CSS animation to CSS module or globals.css keyframe.

## 01_landing.html → /(public)/page.tsx
- Remove Space Grotesk and Manrope font families entirely.
- Replace font-headline (Space Grotesk) → font-orbitron for display text.
- Replace font-body (Manrope) → font-dm-sans for body text.
- Replace primary #55d8e1 → #00ADB5 for buttons/borders. Keep #55d8e1 for text glow.
- Replace bg #0e141c → #222831. Surface hierarchy per DESIGN.md stays.
- Replace Material Symbols icons → Lucide React equivalents.

## 02_login.html, 03_signup.html → /(public)/login, signup
- Rebuild auth card with glassmorphism: bg-card backdrop-blur-[14px].
- Replace any Google OAuth button icon → inline SVG.
- Ensure form inputs match: bg-[#393E46] border-[#393E46] focus:border-[#00ADB5].

## 04_upload (steps 1-3) → /(app)/upload/page.tsx
- Rebuild sidebar to exact 240px spec (w-[240px], not w-64).
- Use 6 nav items only: Upload, Dashboard, Explain, Mitigate, Report, Profile.
- Remove Settings, Logout, "New Audit" from sidebar.
- Add Framer Motion layoutId="sidebar-active-indicator" sliding indicator.
- Rebuild topbar to h-[56px] with Bell/MessageSquare/Settings2/Avatar icons.
- Add footer with system integrity text.

## 05_dashboard_technical.html → /(app)/dashboard/page.tsx
- Remove Space Grotesk and Manrope font references.
- Rebuild sidebar to 240px with left-border active indicator (not right-border).
- Replace orbitron-heavy class → font-orbitron font-black.
- Replace dm-mono class → font-dm-mono.
- Replace teal-gradient class → bg-[#00ADB5] or gradient utility.
- Replace glow-primary class → shadow-teal-glow.
- Replace glass-card class → Tailwind glassmorphism utilities.
- Replace HTML bar chart → Recharts BarChart with ETHYX chart theme.
- Add dot-grid background to main content area.

## 05_dashboard_executive.html → Dashboard executive toggle state
- Same corrections as technical. This is the toggle alternate view.

## 06_explain (variants 1-2) → /(app)/explain/page.tsx
- Rebuild sidebar and topbar identically to other app pages.
- SHAP drawer uses shadcn Sheet component with drawerOpen animation.

## 07_mitigate.html → /(app)/mitigate/page.tsx
- Rebuild sidebar/topbar. Add strategy selection grid with layoutId.
- Before/after cards use Framer Motion animated transitions.

## 08_report.html → /(app)/report/page.tsx
- Rebuild sidebar/topbar. PDF export uses jsPDF — never window.print().

## 09_profile.html → /(app)/profile/page.tsx
- Rebuild sidebar/topbar. Tabs use shadcn Tabs with layoutId indicator.
- Remove any Settings/Logout from sidebar (they live in profile page body only).

## dashboard_spacious_v1.html → Cherry-pick only
- Extract 2 alert text cards only. Never use as layout base.
