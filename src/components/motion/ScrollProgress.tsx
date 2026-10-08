import { m, useScroll, useSpring } from 'motion/react';
import styled from 'styled-components';
import { color, rgb } from '@/theme/tokens';

/** Hairline reading-progress indicator along the bottom edge of the header. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 220, damping: 40, restDelta: 0.001 });
  return <Bar aria-hidden="true" style={{ scaleX }} />;
}

const Bar = styled(m.div)`
  position: absolute;
  left: 0;
  right: 0;
  bottom: -1px;
  height: 1px;
  transform-origin: 0 50%;
  background: linear-gradient(90deg, rgba(${rgb.brand}, 0.2), ${color.brand});
  box-shadow: 0 0 12px rgba(${rgb.brand}, 0.6);
  pointer-events: none;
`;
