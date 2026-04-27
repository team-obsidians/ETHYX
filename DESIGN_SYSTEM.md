# ETHYX AI — DESIGN_SYSTEM.md
# Complete design token specification and component rules
# Place at: /ethyx/DESIGN_SYSTEM.md (project root)
# Read this file for EVERY UI task. No exceptions.

---

## 🎨 COLOR TOKENS

```css
/* Background layers */
--bg-base:    #222831;   /* page background */
--bg-surface: #1C2128;   /* sidebars, panels, elevated surfaces */
--bg-card:    rgba(57, 62, 70, 0.72); /* glassmorphism cards */
--bg-input:   #393E46;   /* form inputs, code bg */
--bg-hover:   rgba(0, 173, 181, 0.05); /* subtle hover */

/* Primary accent — ONE color only */
--teal:       #00ADB5;   /* primary CTA, active states, borders */
--teal-dark:  #008891;   /* teal gradient end, hover states */
--teal-light: #22D3EE;   /* teal highlights, glow effects */
--teal-dim:   rgba(0, 173, 181, 0.12); /* card borders */
--teal-glow:  rgba(0, 173, 181, 0.25); /* box-shadow glow */
--teal-bg:    rgba(0, 173, 181, 0.08); /* active nav item bg */

/* Semantic colors */
--success:    #10B981;   /* pass, approved, fair */
--warning:    #F59E0B;   /* medium risk, amber alert */
--danger:     #EF4444;   /* fail, rejected, high risk */

/* Text hierarchy */
--text-primary:   #EEEEEE; /* headings, primary content */
--text-secondary: #AABBC4; /* descriptions, body text */
--text-muted:     #6B8090; /* labels, timestamps, captions */
--text-faint:     #4A5360; /* footer, watermarks */

/* Borders */
--border-default: rgba(0, 173, 181, 0.12); /* card borders */
--border-subtle:  rgba(0, 173, 181, 0.08);  /* sidebar, topbar */
--border-strong:  rgba(0, 173, 181, 0.25);  /* focused, active */
--border-base:    #393E46; /* non-teal borders, inputs */
```

### ❌ Colors NEVER Allowed
```
purple  (#8B5CF6 or any variant)
indigo  (#6366F1 or any variant)
bright blue (#3B82F6 or any variant)
white backgrounds (#FFFFFF)
gray backgrounds (light grays)
```
If Stitch generated any purple — replace with teal `#00ADB5`.

---

## 🔤 TYPOGRAPHY

### Font Families
```css
font-family: 'Orbitron', monospace;    /* weight: 700, 900 */
font-family: 'DM Sans', sans-serif;    /* weight: 400, 500, 600 */
font-family: 'DM Mono', monospace;     /* weight: 400, 500 */
```

### Google Fonts Import (globals.css)
```css
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600&family=DM+Mono:wght@400;500&display=swap');
```

### When to Use Each Font
| Font | Use For | Never Use For |
|------|---------|---------------|
| Orbitron 900 | Logo, page titles, section eyebrows, KPI labels, alert codes | Body text, paragraphs, descriptions |
| Orbitron 700 | Sub-headers, card titles, badge text | Long-form content |
| DM Sans 600 | Button labels, nav items, form labels | Metrics, code |
| DM Sans 400/500 | Body text, descriptions, paragraphs | Display text |
| DM Mono 500 | Metric values, scores, percentages, timestamps, code | Headings, body |
| DM Mono 400 | Code blocks, footer text, muted metadata | Headings |

### Type Scale (Tailwind classes)
```
Orbitron display:     text-[22px] lg:text-[32px] tracking-[0.08em]
Orbitron section:     text-[11px] tracking-[0.22em] uppercase
Orbitron logo:        text-[12px] tracking-[0.12em] font-black
DM Sans body:         text-[13px] leading-[1.65]
DM Sans large:        text-[16px] leading-[1.7]
DM Mono metric:       text-[28px] tabular-nums
DM Mono label:        text-[9px] tracking-[0.15em] uppercase
DM Mono small:        text-[10px] tracking-[0.06em]
```

---

## 🧩 COMPONENT SPECS

### Cards
```css
/* Standard card */
background: rgba(57, 62, 70, 0.72);
backdrop-filter: blur(14px);
border: 1px solid rgba(0, 173, 181, 0.12);
border-radius: 14px;
padding: 1.3rem 1.5rem;

/* Tailwind equivalent */
className="bg-card backdrop-blur-[14px] border border-teal/12 rounded-[14px] p-5"
```

### Card Variants
```
Teal card:    border rgba(0,173,181,0.28)  bg rgba(0,173,181,0.04)
Amber card:   border rgba(245,158,11,0.28) bg rgba(245,158,11,0.04)
Red card:     border rgba(239,68,68,0.28)  bg rgba(239,68,68,0.04)
Green card:   border rgba(16,185,129,0.28) bg rgba(16,185,129,0.04)
```

### Buttons
```css
/* Primary button */
background: #00ADB5;
color: #222831;
font-family: 'DM Sans'; font-weight: 600; font-size: 14px;
border-radius: 8px;
padding: 10px 20px;
transition: all 0.15s;
hover: background #008891, transform scale(1.01)

/* Ghost button */
background: transparent;
border: 1px solid #00ADB5;
color: #00ADB5;
same radius/padding as primary

/* Danger button */
border: 1px solid #EF4444;
color: #EF4444;
background: transparent;
```

### Inputs
```css
background: #393E46;
border: 1px solid #393E46;
border-radius: 8px;
padding: 10px 14px;
color: #EEEEEE;
font-family: 'DM Sans'; font-size: 14px;
focus: border-color #00ADB5, box-shadow 0 0 0 2px rgba(0,173,181,0.2)
placeholder color: #6B8090;
```

### Badges / Pills
```css
/* Teal badge */
background: rgba(0,173,181,0.1); color: #00ADB5;
border: 1px solid rgba(0,173,181,0.3);
border-radius: 99px; padding: 2px 8px;
font-family: DM Mono; font-size: 9.5px; font-weight: 700;

/* Status badges */
PASS:  bg rgba(16,185,129,0.12)  color #10B981  border rgba(16,185,129,0.3)
FAIL:  bg rgba(239,68,68,0.12)   color #EF4444  border rgba(239,68,68,0.3)
WARN:  bg rgba(245,158,11,0.12)  color #F59E0B  border rgba(245,158,11,0.3)
```

### Section Labels (Orbitron eyebrows)
```jsx
/* Always with gradient line after */
<div className="flex items-center gap-3 mb-4">
  <span className="font-orbitron text-[8.5px] font-bold tracking-[0.22em]
                   uppercase text-teal">
    SECTION TITLE
  </span>
  <div className="flex-1 h-px bg-gradient-to-r from-teal/30 to-transparent" />
</div>
```

---

## 🏗️ LAYOUT SPECS

### Dot Grid Background (ALL pages)
```css
/* Apply to every page wrapper */
background-image: radial-gradient(circle, rgba(0,173,181,0.05) 1px, transparent 1px);
background-size: 28px 28px;

/* Tailwind custom class in globals.css */
.dot-grid {
  background-image: radial-gradient(circle, rgba(0,173,181,0.05) 1px, transparent 1px);
  background-size: 28px 28px;
}
```

### Sidebar (ALL app pages)
```
Width:           240px fixed left
Background:      #1C2128
Right border:    1px solid rgba(0,173,181,0.08)
Logo area:       teal shield SVG + "ETHYX AI" Orbitron 900 + "OBSIDIAN LENS" DM Mono 8px
Nav items:       Upload → Dashboard → Explain → Mitigate → Report → Profile
Active item:     3px teal left border + rgba(0,173,181,0.08) bg + #EEEEEE text
Hover item:      rgba(0,173,181,0.05) bg + #AABBC4 text
Icons:           Lucide icons, 16px, match text color
Bottom:          teal gradient avatar + name DM Sans 13px + "FREE PLAN" badge
EXCLUDED:        Settings · Logout · "New Audit" button
```

### Topbar (ALL app pages)
```
Height:          56px
Background:      rgba(34,40,49,0.95) + backdrop-blur(16px)
Bottom border:   1px solid rgba(0,173,181,0.08)
Left:            Breadcrumb — DM Sans 13px #AABBC4
Right icons:     Bell · Chat · Settings · Avatar (Lucide, teal #00ADB5, 18px)
```

### App Footer (ALL app pages)
```
Content:   "SYSTEM INTEGRITY: 99.9% · AUDIT HASH: 0x8F2...3A1 · © 2026 ETHYX AI QUANTUM AUDIT SYSTEMS"
Font:      DM Mono 9px
Color:     #4A5360
Align:     centered
```

### Page Content Area
```
Margin-left:     240px (sidebar width)
Padding-top:     56px (topbar height)
Background:      #222831 + dot-grid
Padding:         2rem
Overflow-y:      auto
```

---

## ✨ ANIMATION RULES

### Framer Motion — Standard Variants
```typescript
// Page enter (use on every page)
const pageVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } }
}

// Stagger children (use on card grids)
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } }
}

// Card reveal
const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } }
}

// Count-up for KPI numbers (use on dashboard metrics)
// Use react-countup or manual useEffect with requestAnimationFrame
```

### Teal Glow (CSS)
```css
/* Box shadow glow on active/selected elements */
box-shadow: 0 0 20px rgba(0, 173, 181, 0.25);

/* Stronger glow for CTAs */
box-shadow: 0 0 30px rgba(0, 173, 181, 0.35), 0 0 60px rgba(0, 173, 181, 0.1);
```

### Sidebar Active Indicator
```typescript
// Framer Motion layoutId for smooth sliding indicator
<motion.div
  layoutId="sidebar-active-indicator"
  className="absolute left-0 top-0 w-[3px] h-full bg-teal rounded-r-sm"
/>
```

---

## 📱 RESPONSIVE BREAKPOINTS

```
Mobile:  < 768px  — sidebar hidden (hamburger), single column
Tablet:  768–1024px — sidebar collapsed to icons only
Desktop: > 1024px — full 240px sidebar, full layout
```

### Mobile Overrides
```
Sidebar: hidden by default, slide-in on hamburger click (shadcn Sheet)
Cards: stack to 1 column
Charts: horizontal scroll container or simplified view
Topbar: show hamburger left + logo center + avatar right
```

---

## 🔣 ICON RULES

```
Library:    Lucide React ONLY. No other icon library.
Default size: 16px (nav), 18px (topbar), 20px (cards), 24px (hero)
Color:       Match context (teal for active/primary, #6B8090 for muted)
Stroke:      1.5px (default Lucide)

Key icons:
  Upload → Upload
  Dashboard → LayoutDashboard
  Explain → Microscope
  Mitigate → Shield
  Report → FileText
  Profile → User
  Bell → Bell
  Chat → MessageSquare
  Settings → Settings2
  Alert → AlertTriangle (amber) / AlertCircle (red)
  Check → CheckCircle2 (green)
  Error → XCircle (red)
```

---

## 🔡 CHART STYLING (Recharts)

```typescript
// All charts MUST use these exact styles
const chartTheme = {
  // Tooltip
  tooltip: {
    contentStyle: {
      background: '#1C2128',
      border: '1px solid rgba(0,173,181,0.25)',
      borderRadius: '8px',
      fontFamily: 'DM Mono',
      fontSize: '11px',
      color: '#EEEEEE'
    }
  },
  // Grid lines
  cartesianGrid: {
    strokeDasharray: '3 3',
    stroke: 'rgba(255,255,255,0.06)'
  },
  // Axis labels
  axis: {
    tick: { fill: '#6B8090', fontSize: 10, fontFamily: 'DM Mono' },
    axisLine: { stroke: 'rgba(255,255,255,0.08)' }
  },
  // Primary bar/line color
  primary: '#00ADB5',
  secondary: 'rgba(0,173,181,0.45)',
}

// All charts wrapped in ResponsiveContainer
<ResponsiveContainer width="100%" height={280}>
  {/* chart here */}
</ResponsiveContainer>
```

---

## ⚡ TAILWIND CONFIG REFERENCE

```typescript
// tailwind.config.ts — custom extensions
extend: {
  colors: {
    'bg-base': '#222831',
    'surface': '#1C2128',
    'teal': '#00ADB5',
    'teal-dark': '#008891',
    'teal-light': '#22D3EE',
    'text-primary': '#EEEEEE',
    'text-secondary': '#AABBC4',
    'text-muted': '#6B8090',
    'success': '#10B981',
    'warning': '#F59E0B',
    'danger': '#EF4444',
  },
  fontFamily: {
    'orbitron': ['Orbitron', 'monospace'],
    'dm-sans': ['DM Sans', 'sans-serif'],
    'dm-mono': ['DM Mono', 'monospace'],
  },
  borderRadius: {
    'card': '14px',
    'btn': '8px',
    'badge': '99px',
  },
  backdropBlur: {
    'card': '14px',
    'nav': '20px',
  },
  boxShadow: {
    'teal-glow': '0 0 20px rgba(0,173,181,0.25)',
    'teal-glow-lg': '0 0 40px rgba(0,173,181,0.3)',
  }
}
```
