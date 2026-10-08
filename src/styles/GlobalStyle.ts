import { createGlobalStyle } from 'styled-components';
import manropeLatin from '@fontsource-variable/manrope/files/manrope-latin-wght-normal.woff2?url';
import { selectionTransitionName } from '@/components/motion/viewTransition';
import { color, font, layout, motion } from '@/theme/tokens';

export { manropeLatin };

/**
 * Only the Latin subset is shipped (it covers all of PT-BR). The fallback faces
 * are metric-matched to Manrope (measured in Chrome: width ≈102% of Arial at
 * body weights, ≈99.8% at bold), so the swap from fallback to web font does
 * not shift the layout.
 */
export const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: 'Manrope Variable';
    font-style: normal;
    font-display: swap;
    font-weight: 200 800;
    src: url(${manropeLatin}) format('woff2-variations'), url(${manropeLatin}) format('woff2');
    unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329,
      U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
  }

  @font-face {
    font-family: 'Manrope Fallback';
    src: local('Arial'), local('ArialMT');
    font-weight: 200 590;
    size-adjust: 102%;
    ascent-override: 104.5%;
    descent-override: 29.4%;
    line-gap-override: 0%;
  }

  @font-face {
    font-family: 'Manrope Fallback';
    src: local('Arial Bold'), local('Arial-BoldMT');
    font-weight: 600 800;
    size-adjust: 99.8%;
    ascent-override: 106.8%;
    descent-override: 30.1%;
    line-gap-override: 0%;
  }

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  html {
    -webkit-text-size-adjust: 100%;
    text-size-adjust: 100%;
    color-scheme: dark;
    background: ${color.ink900};
    scroll-padding-top: calc(${layout.headerHeight} + 1rem);
    scrollbar-color: ${color.ink600} ${color.ink900};
    scrollbar-width: thin;
    hanging-punctuation: first last;
  }

  /* Modal dialogs (menu, lightbox) lock the page behind them. */
  html:has(dialog[open]) {
    overflow: hidden;
  }

  body {
    margin: 0;
    min-height: 100svh;
    font-family: ${font.family};
    font-size: ${font.size.body};
    font-weight: ${font.weight.regular};
    line-height: ${font.leading.relaxed};
    color: ${color.text};
    background: ${color.ink900};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
    overflow-x: clip;
  }

  img,
  picture,
  video,
  svg,
  canvas {
    display: block;
    max-width: 100%;
  }

  img,
  video {
    height: auto;
  }

  input,
  button,
  textarea,
  select {
    font: inherit;
    color: inherit;
    letter-spacing: inherit;
  }

  button {
    background: none;
    border: 0;
    padding: 0;
    cursor: pointer;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  h1,
  h2,
  h3,
  h4,
  p,
  figure,
  blockquote,
  dl,
  dd {
    margin: 0;
  }

  h1,
  h2,
  h3,
  h4 {
    font-weight: ${font.weight.bold};
    line-height: ${font.leading.heading};
    letter-spacing: ${font.tracking.snug};
    text-wrap: balance;
    overflow-wrap: break-word;
  }

  p,
  li,
  dd,
  figcaption {
    text-wrap: pretty;
    overflow-wrap: break-word;
  }

  strong {
    font-weight: ${font.weight.semibold};
  }

  ::selection {
    background: ${color.brand};
    color: ${color.onBrand};
  }

  :focus-visible {
    outline: 2px solid ${color.brand};
    outline-offset: 3px;
  }

  [tabindex='-1']:focus {
    outline: none;
  }

  dialog {
    color: inherit;
  }

  /* Lenis (smooth wheel scrolling on desktop) */
  html.lenis,
  html.lenis body {
    height: auto;
  }

  .lenis:not(.lenis-autoToggle).lenis-stopped {
    overflow: clip;
  }

  .lenis [data-lenis-prevent] {
    overscroll-behavior: contain;
  }

  /*
   * View Transitions (choosing a price): the page cross-fades while the chosen
   * module morphs into the selection card on the contact page.
   */
  ::view-transition-old(root),
  ::view-transition-new(root) {
    animation-duration: 0.35s;
    animation-timing-function: ${motion.css.out};
  }

  ::view-transition-group(${selectionTransitionName}) {
    animation-duration: 0.7s;
    animation-timing-function: ${motion.css.out};
  }

  ::view-transition-old(${selectionTransitionName}),
  ::view-transition-new(${selectionTransitionName}) {
    animation-duration: 0.45s;
    animation-timing-function: ${motion.css.out};
  }

  @media (prefers-reduced-motion: reduce) {
    ::view-transition-group(*),
    ::view-transition-old(*),
    ::view-transition-new(*) {
      animation: none !important;
    }

    *,
    *::before,
    *::after {
      animation-duration: 0.001ms !important;
      animation-delay: 0ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.001ms !important;
      transition-delay: 0ms !important;
      scroll-behavior: auto !important;
    }
  }

  :root {
    --ease-out: ${motion.css.out};
    --header-h: ${layout.headerHeight};
  }
`;
