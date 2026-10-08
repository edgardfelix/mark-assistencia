import { m, useScroll, useTransform } from 'motion/react';
import { type ReactNode, useRef } from 'react';
import styled from 'styled-components';
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery';

interface ParallaxMediaProps {
  children: ReactNode;
  /** Vertical travel as a percentage of the frame height, in each direction. */
  range?: number;
  className?: string;
}

/**
 * ImageParallax: the media layer is slightly oversized and drifts inside a
 * clipped frame as the frame crosses the viewport. Transform-only, driven by a
 * single shared scroll observer; disabled for reduced motion.
 */
export function ParallaxMedia({ children, range = 6, className }: ParallaxMediaProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], reduced ? ['0%', '0%'] : [`${-range}%`, `${range}%`]);

  return (
    <Frame ref={ref} className={className}>
      <Layer style={{ y, scale: reduced ? 1 : 1 + (range * 2.2) / 100 }}>{children}</Layer>
    </Frame>
  );
}

const Frame = styled.div`
  position: relative;
  overflow: hidden;
  isolation: isolate;
`;

const Layer = styled(m.div)`
  position: absolute;
  inset: 0;
  will-change: transform;

  & > * {
    width: 100%;
    height: 100%;
  }
`;
