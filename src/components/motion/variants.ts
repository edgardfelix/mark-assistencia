import { type Transition, type Variants } from 'motion/react';
import { motion } from '@/theme/tokens';

/** Shared, engineered motion: short distances, one easing family, no bounce. */
export type RevealKind = 'rise' | 'fade' | 'scale' | 'blur' | 'left' | 'right';

const enter = (delay = 0, duration = 0.85): Transition => ({ duration, ease: motion.ease.out, delay });

export const revealVariants: Record<RevealKind, Variants> = {
  rise: { hidden: { opacity: 0, y: 28 }, visible: (d = 0) => ({ opacity: 1, y: 0, transition: enter(Number(d)) }) },
  fade: { hidden: { opacity: 0 }, visible: (d = 0) => ({ opacity: 1, transition: enter(Number(d), 1) }) },
  scale: {
    hidden: { opacity: 0, scale: 0.96 },
    visible: (d = 0) => ({ opacity: 1, scale: 1, transition: enter(Number(d), 1) }),
  },
  blur: {
    hidden: { opacity: 0, y: 14, filter: 'blur(10px)' },
    visible: (d = 0) => ({ opacity: 1, y: 0, filter: 'blur(0px)', transition: enter(Number(d), 1) }),
  },
  left: { hidden: { opacity: 0, x: -32 }, visible: (d = 0) => ({ opacity: 1, x: 0, transition: enter(Number(d)) }) },
  right: { hidden: { opacity: 0, x: 32 }, visible: (d = 0) => ({ opacity: 1, x: 0, transition: enter(Number(d)) }) },
};

export const staggerVariants = (gap = 0.08, delay = 0): Variants => ({
  hidden: {},
  visible: { transition: { staggerChildren: gap, delayChildren: delay } },
});

/**
 * Reveal once, when the element's top edge passes ~88% of the viewport height.
 * 'some' (any visible part) instead of a fraction of the element: a fraction
 * never triggers on elements taller than the screen (e.g. a long gallery on a phone).
 */
export const viewportOnce = { once: true, amount: 'some', margin: '0px 0px -12% 0px' } as const;
