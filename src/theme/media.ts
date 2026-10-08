import { breakpoints, type Breakpoint } from './tokens';

/** Media query helpers for styled-components templates. Mobile-first. */
export const media = {
  up: (bp: Breakpoint) => `@media (min-width: ${breakpoints[bp]}px)`,
  down: (bp: Breakpoint) => `@media (max-width: ${breakpoints[bp] - 0.02}px)`,
  finePointer: '@media (hover: hover) and (pointer: fine)',
  reducedMotion: '@media (prefers-reduced-motion: reduce)',
  motionOk: '@media (prefers-reduced-motion: no-preference)',
} as const;

/** Plain query strings for `matchMedia`. */
export const queries = {
  finePointer: '(hover: hover) and (pointer: fine)',
  reducedMotion: '(prefers-reduced-motion: reduce)',
  up: (bp: Breakpoint) => `(min-width: ${breakpoints[bp]}px)`,
} as const;
