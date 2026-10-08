/**
 * Design tokens. Components import these directly (single theme), which keeps
 * styled-components output static and avoids per-render style recalculation.
 *
 * Brand yellow is sampled from the official logo (avg rgb 252·226·17).
 * WCAG contrast on `ink900`: text 18.1:1 · textMuted 10.3:1 · textSubtle 6.0:1 · brand 14.5:1.
 * Worst case (`ink700` surfaces): textSubtle 5.0:1 — still AA for body text.
 */
export const color = {
  ink950: '#060607',
  ink900: '#0a0a0b',
  ink850: '#0e0e10',
  ink800: '#131316',
  ink750: '#18181c',
  ink700: '#1f1f24',
  ink600: '#2b2b31',

  text: '#f6f5f0',
  textMuted: '#bcbbb4',
  textSubtle: '#8f8e88',

  brand: '#fcdc12',
  brandHover: '#ffe75a',
  brandPressed: '#e6c800',
  onBrand: '#0a0a0b',

  line: 'rgba(255, 255, 255, 0.08)',
  lineStrong: 'rgba(255, 255, 255, 0.14)',
  lineBrand: 'rgba(252, 220, 18, 0.38)',

  brandTint: 'rgba(252, 220, 18, 0.08)',
  brandTintStrong: 'rgba(252, 220, 18, 0.14)',
  glass: 'rgba(16, 16, 19, 0.62)',
  glassStrong: 'rgba(12, 12, 14, 0.82)',
  scrim: 'rgba(6, 6, 7, 0.72)',

  danger: '#ff8f80',
  dangerTint: 'rgba(255, 143, 128, 0.1)',
  success: '#86e3ad',
} as const;

/** RGB triplets for building gradients with custom alpha. */
export const rgb = {
  brand: '252, 220, 18',
  ink: '10, 10, 11',
  white: '255, 255, 255',
} as const;

export const font = {
  family:
    "'Manrope Variable', 'Manrope Fallback', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
  weight: { regular: 420, medium: 520, semibold: 620, bold: 720, heavy: 800 },
  size: {
    display: 'clamp(2.45rem, 1.45rem + 4vw, 4.6rem)',
    h1: 'clamp(2.25rem, 1.55rem + 2.9vw, 3.85rem)',
    h2: 'clamp(1.9rem, 1.4rem + 2vw, 3.1rem)',
    h3: 'clamp(1.25rem, 1.12rem + 0.55vw, 1.55rem)',
    h4: '1.125rem',
    lead: 'clamp(1.0625rem, 1rem + 0.3vw, 1.2rem)',
    body: '1rem',
    small: '0.9375rem',
    caption: '0.8125rem',
    eyebrow: '0.75rem',
    stat: 'clamp(2.4rem, 1.9rem + 2.2vw, 3.6rem)',
    /** Price numerals on the prices page: the dominant figure of each option. */
    price: 'clamp(3.5rem, 2.2rem + 3.6vw, 5.75rem)',
  },
  tracking: { tighter: '-0.04em', tight: '-0.03em', snug: '-0.015em', normal: '0', wide: '0.06em', eyebrow: '0.2em' },
  leading: { tight: 1.04, snug: 1.14, heading: 1.2, normal: 1.5, relaxed: 1.65 },
} as const;

export const space = {
  1: '0.25rem',
  2: '0.5rem',
  3: '0.75rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  7: '1.75rem',
  8: '2rem',
  10: '2.5rem',
  12: '3rem',
  14: '3.5rem',
  16: '4rem',
  20: '5rem',
  24: '6rem',
  32: '8rem',
} as const;

export const layout = {
  maxWidth: '1240px',
  wideWidth: '1440px',
  proseWidth: '44rem',
  gutter: 'clamp(1.25rem, 4.2vw, 3rem)',
  sectionY: 'clamp(4rem, 2.6rem + 5vw, 7rem)',
  headerHeight: '72px',
} as const;

export const radius = {
  xs: '6px',
  sm: '10px',
  md: '14px',
  lg: '20px',
  xl: '28px',
  xxl: '36px',
  pill: '999px',
} as const;

export const shadow = {
  sm: '0 1px 2px rgba(0, 0, 0, 0.45)',
  md: '0 14px 32px -14px rgba(0, 0, 0, 0.7)',
  lg: '0 40px 90px -30px rgba(0, 0, 0, 0.85)',
  inset: 'inset 0 1px 0 rgba(255, 255, 255, 0.06)',
} as const;

export const glow = {
  ring: `0 0 0 1px rgba(${rgb.brand}, 0.42), 0 0 22px -6px rgba(${rgb.brand}, 0.6)`,
  soft: `0 0 34px -10px rgba(${rgb.brand}, 0.55)`,
  wide: `0 0 90px -20px rgba(${rgb.brand}, 0.4)`,
  text: `0 0 28px rgba(${rgb.brand}, 0.35)`,
} as const;

export const zIndex = {
  base: 0,
  raised: 1,
  sticky: 20,
  floating: 40,
  header: 50,
  progress: 60,
  overlay: 80,
  modal: 100,
} as const;

export const breakpoints = { sm: 480, md: 768, lg: 1024, xl: 1280, xxl: 1440 } as const;

export type Breakpoint = keyof typeof breakpoints;

export const motion = {
  duration: { instant: 0.12, fast: 0.2, base: 0.35, slow: 0.6, slower: 0.9, cinematic: 1.25 },
  ease: {
    out: [0.16, 1, 0.3, 1],
    outSoft: [0.25, 1, 0.5, 1],
    inOut: [0.65, 0, 0.35, 1],
  },
  css: {
    out: 'cubic-bezier(0.16, 1, 0.3, 1)',
    outSoft: 'cubic-bezier(0.25, 1, 0.5, 1)',
    inOut: 'cubic-bezier(0.65, 0, 0.35, 1)',
  },
} as const;
