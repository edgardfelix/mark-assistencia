import { m } from 'motion/react';
import styled from 'styled-components';
import { motion, rgb } from '@/theme/tokens';
import { viewportOnce } from './variants';

/** SectionTransition: a hairline of light that draws itself between chapters. */
export function LightSeam({ className }: { className?: string }) {
  return (
    <Seam
      aria-hidden="true"
      data-reveal=""
      className={className}
      initial={{ scaleX: 0, opacity: 0 }}
      whileInView={{ scaleX: 1, opacity: 1 }}
      viewport={viewportOnce}
      transition={{ duration: 1.6, ease: motion.ease.out }}
    />
  );
}

const Seam = styled(m.div)`
  position: relative;
  height: 1px;
  width: 100%;
  background: linear-gradient(90deg, transparent, rgba(${rgb.brand}, 0.45) 50%, transparent);

  &::after {
    content: '';
    position: absolute;
    left: 50%;
    top: 50%;
    width: min(40%, 420px);
    height: 28px;
    transform: translate(-50%, -50%);
    background: radial-gradient(closest-side, rgba(${rgb.brand}, 0.22), transparent);
  }
`;
