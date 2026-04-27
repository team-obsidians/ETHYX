// c:\Obsidian\Ethyx\frontend\tailwind.config.ts
// Tailwind configuration with all ETHYX AI design tokens from DESIGN_SYSTEM.md

import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        /* Background layers */
        "bg-base": "#222831",
        "surface": "#1C2128",
        "card": "rgba(57, 62, 70, 0.72)",
        "input": "#393E46",

        /* Primary accent */
        "teal": {
          DEFAULT: "#00ADB5",
          dark: "#008891",
          light: "#55d8e1",
          dim: "rgba(0, 173, 181, 0.12)",
          glow: "rgba(0, 173, 181, 0.25)",
          bg: "rgba(0, 173, 181, 0.08)",
          hover: "rgba(0, 173, 181, 0.05)",
        },

        /* Semantic */
        "success": "#10B981",
        "warning": "#F59E0B",
        "danger": "#EF4444",

        /* Text hierarchy */
        "text-primary": "#EEEEEE",
        "text-secondary": "#AABBC4",
        "text-muted": "#6B8090",
        "text-faint": "#4A5360",

        /* Borders */
        "border-default": "rgba(0, 173, 181, 0.12)",
        "border-subtle": "rgba(0, 173, 181, 0.08)",
        "border-strong": "rgba(0, 173, 181, 0.25)",
        "border-base": "#393E46",
      },
      fontFamily: {
        "orbitron": ["var(--font-orbitron)", "monospace"],
        "dm-sans": ["var(--font-dm-sans)", "sans-serif"],
        "dm-mono": ["var(--font-dm-mono)", "monospace"],
      },
      borderRadius: {
        "card": "14px",
        "btn": "8px",
        "badge": "99px",
      },
      backdropBlur: {
        "card": "14px",
        "nav": "20px",
      },
      boxShadow: {
        "teal-glow": "0 0 20px rgba(0, 173, 181, 0.25)",
        "teal-glow-lg": "0 0 30px rgba(0, 173, 181, 0.35), 0 0 60px rgba(0, 173, 181, 0.1)",
      },
      backgroundImage: {
        "dot-grid": "radial-gradient(circle, rgba(0, 173, 181, 0.05) 1px, transparent 1px)",
        "ambient-glow": "radial-gradient(ellipse 600px at 100% 0%, rgba(0, 173, 181, 0.08), transparent)",
      },
      backgroundSize: {
        "dot-grid": "28px 28px",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 8px rgba(0, 173, 181, 0.3)" },
          "50%": { boxShadow: "0 0 20px rgba(0, 173, 181, 0.6)" },
        },
        "shimmer": {
          "0%": { transform: "translateX(-100%) skewX(-30deg)" },
          "100%": { transform: "translateX(200%) skewX(-30deg)" },
        },
        "rotate-glow": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "shimmer": "shimmer 2s infinite",
        "rotate-glow": "rotate-glow 6s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

export default config
