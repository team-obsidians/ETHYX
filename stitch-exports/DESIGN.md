```markdown
# Design System Strategy: ETHYX AI

## 1. Overview & Creative North Star
**Creative North Star: "The Obsidian Lens"**

This design system is engineered to feel like a high-precision instrument used for auditing the invisible. Rather than a standard SaaS dashboard, it is an editorial exploration of data integrity. By utilizing deep charcoal foundations and piercing teal luminescence, we evoke a sense of "Cyber-Sophistication." 

We break the "template" look through **Intentional Asymmetry**. Dashboards should not be perfectly balanced grids; they should feel like a custom-built workstation where the most critical AI bias metrics are elevated through scale and light, while secondary data recedes into the "Obsidian" depths.

---

## 2. Colors
Our palette is a study in tonal depth. We avoid the clinical coldness of pure blacks and whites, opting instead for a rich, atmospheric dark mode.

### The Palette (Material Design Tokens)
*   **Primary (Teal):** `#55d8e1` (Action/Focus)
*   **Primary Container:** `#00adb5` (Core Brand Teal)
*   **Surface:** `#0e141c` (Deep Base)
*   **Surface Container (Cards):** `rgba(57, 62, 70, 0.72)`
*   **On-Surface (Text):** `#EEEEEE` (High-contrast readability)

### The "No-Line" Rule
Explicitly prohibit 1px solid borders for sectioning. Boundaries must be defined solely through background color shifts or subtle tonal transitions. A `surface-container-low` section sitting on a `surface` background is sufficient. Let the change in value do the work, not a stroke.

### Surface Hierarchy & Nesting
Treat the UI as stacked sheets of frosted glass.
1.  **Level 0 (Background):** `surface` (`#0e141c`) with a subtle teal dot-grid pattern.
2.  **Level 1 (Sections):** `surface-container-low` for large content areas.
3.  **Level 2 (Objects):** `surface-container-highest` for interactive cards and modals.

### The "Glass & Gradient" Rule
Floating elements must utilize **Glassmorphism**. Apply `backdrop-blur(14px)` to all card surfaces. Main CTAs should not be flat; use a subtle linear gradient transitioning from `primary` (`#55d8e1`) to `primary-container` (`#00adb5`) at a 135-degree angle to provide a "lit from within" professional polish.

---

## 3. Typography
We use typography as a brand signature. The contrast between technical brutality and human-centric readability reflects the AI-human intersection of bias detection.

*   **Display & Headline (Orbitron 900):** Reserved for high-impact metrics and section titles. It conveys authority and a "hard-tech" aesthetic. Use `letter-spacing: 0.05em` to enhance its architectural feel.
*   **Body & Title (DM Sans):** Our workhorse. It provides a soft, accessible counterpoint to Orbitron. 
*   **Numbers & Code (DM Mono):** Used for all data points, bias percentages, and log files. Mono fonts imply raw, unedited truth—critical for an audit platform.

---

## 4. Elevation & Depth
In this system, depth is a function of light and translucency, not shadows.

*   **The Layering Principle:** Stacking is key. Place a `surface-container-lowest` card on a `surface-container-low` section to create a soft, natural lift.
*   **Ambient Shadows:** If an element must "float" (like a dropdown), use a shadow with a 40px blur at 6% opacity. The shadow color should be a dark teal-tinted version of the background, mimicking the glow of the interface.
*   **The "Ghost Border" Fallback:** If a border is required for accessibility, use the `outline-variant` token at 15% opacity. Never use 100% opaque borders.
*   **Signature Glows:** Use "Teal Glows" (radial gradients of `#00ADB5` at 5-10% opacity) positioned behind key AI charts or hero sections to create a sense of atmospheric energy.

---

## 5. Components

### Buttons
*   **Primary:** Background `#00ADB5`, 8px radius. Text is `#002022` (On-Primary-Fixed). On hover, add a `0 0 20px rgba(0, 173, 181, 0.4)` glow.
*   **Secondary (Ghost):** Transparent background, 1px border of `#00ADB5` at 40% opacity, 8px radius. 
*   **Tertiary:** No border or background. Teal text. Used for low-priority actions like "Cancel" or "Learn More."

### Data Cards
*   **Radius:** 14px.
*   **Surface:** `rgba(57, 62, 70, 0.72)` with `backdrop-blur(14px)`.
*   **Border:** A 1px "Teal-Tinted" border using `primary` at 20% opacity.
*   **Spacing:** Minimal internal padding (16px to 20px) to keep the data-dense feel of a technical cockpit.

### AI Metric Chips
*   Used for "Bias Detected" or "Fairness Pass" indicators. 
*   Capsule shape (9999px). 
*   High-contrast fills (e.g., `error-container` for bias alerts) but always with a semi-transparent background to maintain the glass theme.

### Inputs & Fields
*   **Style:** Underline-only or subtly filled containers.
*   **Focus State:** The bottom border transforms into a teal glow. Avoid the standard blue focus ring.

---

## 6. Do's and Don'ts

### Do:
*   **Do** use asymmetrical layouts where one column is significantly wider than the other to create editorial tension.
*   **Do** leverage the dot-grid background to "anchor" floating glass elements.
*   **Do** use DM Mono for all percentages (e.g., "98.4% Accuracy").
*   **Do** use overlapping elements. A card can slightly overlap a header to create a sense of Z-space.

### Don't:
*   **Don't** use purple, indigo, or white backgrounds. The dark-base is non-negotiable.
*   **Don't** use standard 1px dividers between list items. Use 8px or 12px of vertical white space instead.
*   **Don't** use sharp 90-degree corners. Everything follows the 8px/14px radius logic to keep the "Premium SaaS" feel.
*   **Don't** use high-opacity shadows. Light is our tool, not darkness.