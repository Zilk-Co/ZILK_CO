import type { Variants } from 'framer-motion';

/* ─────────────────────────────────────────
   SPRING PRESETS
───────────────────────────────────────── */
export const springs = {
  snappy: { type: 'spring' as const, stiffness: 420, damping: 32 },
  smooth: { type: 'spring' as const, stiffness: 200, damping: 30 },
  gentle: { type: 'spring' as const, stiffness: 100, damping: 24 },
  bouncy: { type: 'spring' as const, stiffness: 280, damping: 18, mass: 0.8 },
};

/* ─────────────────────────────────────────
   EASING PRESETS
───────────────────────────────────────── */
export const ease = {
  /** Custom expo — fast initial, smooth landing */
  expo: [0.16, 1, 0.3, 1] as const,
  /** Smooth quart */
  quart: [0.25, 1, 0.5, 1] as const,
  /** Material standard */
  standard: [0.4, 0, 0.2, 1] as const,
  /** Sharp entry — used for reveals */
  sharp: [0.76, 0, 0.24, 1] as const,
};

/* ─────────────────────────────────────────
   STAGGER CONTAINER
───────────────────────────────────────── */
export const staggerContainer = (
  staggerChildren = 0.08,
  delayChildren = 0,
): Variants => ({
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: { staggerChildren, delayChildren },
  },
});

/* ─────────────────────────────────────────
   ELEMENT VARIANTS
───────────────────────────────────────── */

/** Fade up — general purpose reveal */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.72, ease: ease.expo },
  },
};

/** Fade in — no movement */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.55, ease: 'easeOut' },
  },
};

/**
 * Clip reveal — the parent div must have `overflow: hidden`.
 * The child animates from translateY(105%) to translateY(0),
 * producing the "text slides up into frame" agency effect.
 */
export const clipReveal: Variants = {
  hidden: { y: '108%' },
  visible: {
    y: '0%',
    transition: { duration: 0.9, ease: ease.expo },
  },
};

/** Scale in — subtle zoom reveal */
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.65, ease: ease.expo },
  },
};

/** Slide right — element enters from left */
export const slideRight: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: ease.expo },
  },
};

/** Draw a line — scaleX 0→1 from left origin */
export const drawLine: Variants = {
  hidden: { scaleX: 0, originX: 0 },
  visible: {
    scaleX: 1,
    transition: { duration: 1.0, ease: ease.expo },
  },
};

/** Number count up — drives opacity only; JS handles number display */
export const countUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: ease.expo },
  },
};
