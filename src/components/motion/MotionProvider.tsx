import { LazyMotion, MotionConfig } from 'motion/react';
import { type ReactNode } from 'react';
import { motion } from '@/theme/tokens';

const loadFeatures = () => import('./features').then((module) => module.default);

/**
 * `strict` forbids the full `motion` component (only the light `m` is allowed),
 * keeping the animation runtime out of the critical bundle. `reducedMotion="user"`
 * removes transform animations for visitors who ask for reduced motion.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={loadFeatures} strict>
      <MotionConfig reducedMotion="user" transition={{ duration: motion.duration.slow, ease: motion.ease.out }}>
        {children}
      </MotionConfig>
    </LazyMotion>
  );
}
