import { m, useMotionValue, useSpring } from 'motion/react';
import { type PointerEvent, type ReactNode, useRef } from 'react';
import { useFinePointer, usePrefersReducedMotion } from '@/hooks/useMediaQuery';

interface MagneticProps {
  children: ReactNode;
  /** Fraction of the pointer offset applied to the element (0–1). */
  strength?: number;
  className?: string;
}

/**
 * Pulls its child gently toward the pointer (desktop only). Pointer movement
 * updates motion values directly, so React never re-renders while moving.
 */
export function Magnetic({ children, strength = 0.28, className }: MagneticProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const finePointer = useFinePointer();
  const reduced = usePrefersReducedMotion();
  const enabled = finePointer && !reduced;

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 240, damping: 18, mass: 0.5 });
  const springY = useSpring(y, { stiffness: 240, damping: 18, mass: 0.5 });

  const handleMove = (event: PointerEvent<HTMLSpanElement>) => {
    const el = ref.current;
    if (!enabled || !el || event.pointerType !== 'mouse') return;
    const rect = el.getBoundingClientRect();
    x.set((event.clientX - (rect.left + rect.width / 2)) * strength);
    y.set((event.clientY - (rect.top + rect.height / 2)) * strength);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <m.span
      ref={ref}
      className={className}
      style={{ x: springX, y: springY, display: 'inline-flex' }}
      onPointerMove={handleMove}
      onPointerLeave={reset}
    >
      {children}
    </m.span>
  );
}
