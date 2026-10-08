import { css, keyframes } from 'styled-components';
import { motion, rgb } from '@/theme/tokens';
import { media } from '@/theme/media';

/** CSS-level motion primitives (no JavaScript, compositor-friendly). */

/** HoverLift: a short rise with deepening shadow, desktop pointers only. */
export const hoverLift = css`
  transition:
    transform 0.5s ${motion.css.out},
    box-shadow 0.5s ${motion.css.out};

  ${media.finePointer} {
    &:hover {
      transform: translateY(-4px);
    }
  }
`;

const pulse = keyframes`
  0%, 100% { opacity: 0.55; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.12); }
`;

/** GlowPulse: a slow breathing halo, for status dots and a single focal point. */
export const glowPulse = css`
  ${media.motionOk} {
    animation: ${pulse} 3.2s ${motion.css.inOut} infinite;
  }
`;

const enterUp = keyframes`
  from { opacity: 0; transform: translate3d(0, 18px, 0); }
  to { opacity: 1; transform: none; }
`;

/**
 * First-paint entrance for above-the-fold content (heroes). Pure CSS so it
 * starts with the server-rendered HTML instead of waiting for JavaScript.
 */
export const entrance = (delay: number, duration = 0.9) => css`
  animation: ${enterUp} ${duration}s ${motion.css.out} ${delay}s both;
`;

const riseOnly = keyframes`
  from { transform: translate3d(0, 22px, 0); }
  to { transform: none; }
`;

/**
 * Entrance for LCP candidates (hero paragraphs and hero media): movement only,
 * never invisible, so the browser can count the element as painted at once.
 */
export const entranceRise = (delay: number, duration = 1) => css`
  animation: ${riseOnly} ${duration}s ${motion.css.out} ${delay}s both;
`;

/** Cursor-reactive surface light (see useSpotlight): a halo plus a lit border. */
export const spotlightSurface = css`
  --spot-x: 50%;
  --spot-y: 0%;
  position: relative;
  isolation: isolate;

  &::before,
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.4s ${motion.css.out};
  }

  &::before {
    z-index: -1;
    background: radial-gradient(
      520px circle at var(--spot-x) var(--spot-y),
      rgba(${rgb.brand}, 0.075),
      transparent 46%
    );
  }

  &::after {
    padding: 1px;
    background: radial-gradient(280px circle at var(--spot-x) var(--spot-y), rgba(${rgb.brand}, 0.6), transparent 62%);
    mask:
      linear-gradient(#000 0 0) content-box,
      linear-gradient(#000 0 0);
    mask-composite: exclude;
  }

  ${media.finePointer} {
    &:hover::before,
    &:hover::after {
      opacity: 1;
    }
  }
`;
