// c:\Obsidian\Ethyx\frontend\lib\animations.ts
// Centralized Framer Motion animation tokens. Every page imports from here.
// Dependencies: framer-motion ^11

import type { Variants, Transition } from "framer-motion"

/** Page enter animation — use on every page's root motion.div */
export const pageEnter: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" },
  },
}

/** Card reveal animation — use on individual cards within stagger containers */
export const cardReveal: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35 },
  },
}

/** Stagger container — wrap card grids with this */
export const stagger: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
}

/** Hover glow — use with whileHover on interactive cards */
export const hoverGlow = {
  boxShadow: "0 0 20px rgba(0, 173, 181, 0.25)",
  transition: { duration: 0.15 },
}

/** Tap press — use with whileTap on buttons */
export const tapPress = {
  scale: 0.98,
}

/** Spring transition — general purpose */
export const spring: Transition = {
  type: "spring",
  stiffness: 300,
  damping: 30,
}

/** Heavy spring — for drawers and modals */
export const heavySpring: Transition = {
  type: "spring",
  stiffness: 400,
  damping: 40,
}

/** Drawer open/close — use with AnimatePresence on slide-in panels */
export const drawerOpen = {
  initial: { x: "100%", opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: "100%", opacity: 0 },
  transition: {
    type: "spring" as const,
    stiffness: 400,
    damping: 40,
  },
}

/** Modal open/close — use with AnimatePresence on dialog overlays */
export const modalOpen = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
  transition: { duration: 0.2 },
}

/**
 * Shared layoutId constants — globally unique across the entire app.
 * Never duplicate these strings in any component.
 */
export const LAYOUT_IDS = {
  SIDEBAR_ACTIVE: "sidebar-active-indicator",
  DASHBOARD_VIEW: "dashboard-view-indicator",
  PROFILE_TAB: "profile-tab-indicator",
  STRATEGY_SELECTED: "strategy-selected-border",
} as const
