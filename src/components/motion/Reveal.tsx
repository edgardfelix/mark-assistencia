import { m, type HTMLMotionProps } from 'motion/react';
import { revealVariants, staggerVariants, viewportOnce, type RevealKind } from './variants';

interface RevealProps extends Omit<HTMLMotionProps<'div'>, 'variants' | 'initial' | 'whileInView' | 'custom'> {
  kind?: RevealKind;
  delay?: number;
}

/**
 * Reveal-on-scroll (FadeIn / Rise / Scale / Blur / Slide via `kind`).
 * `data-reveal` lets the <noscript> rule in index.html show content without JS.
 */
export function Reveal({ kind = 'rise', delay = 0, viewport = viewportOnce, ...rest }: RevealProps) {
  return (
    <m.div
      data-reveal=""
      variants={revealVariants[kind]}
      custom={delay}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      {...rest}
    />
  );
}

interface StaggerProps extends Omit<HTMLMotionProps<'div'>, 'variants' | 'initial' | 'whileInView'> {
  gap?: number;
  delay?: number;
}

/** Parent that reveals its <StaggerItem> children in sequence. */
export function Stagger({ gap = 0.08, delay = 0, viewport = viewportOnce, ...rest }: StaggerProps) {
  return (
    <m.div
      variants={staggerVariants(gap, delay)}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      {...rest}
    />
  );
}

interface StaggerItemProps extends Omit<HTMLMotionProps<'div'>, 'variants' | 'custom'> {
  kind?: RevealKind;
  delay?: number;
}

export function StaggerItem({ kind = 'rise', delay = 0, ...rest }: StaggerItemProps) {
  return <m.div data-reveal="" variants={revealVariants[kind]} custom={delay} {...rest} />;
}
