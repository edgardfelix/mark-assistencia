import styled, { keyframes } from 'styled-components';
import grain from '@/assets/textures/grain.svg?url';
import { media } from '@/theme/media';
import { rgb, zIndex } from '@/theme/tokens';

/**
 * Continuous lighting behind every page: two slow-drifting warm light fields
 * and a film-grain texture. Transform-only keyframes (compositor), very low
 * intensity — meant to be felt rather than noticed. Static for reduced motion.
 */
export function AmbientLight() {
  return (
    <Layer aria-hidden="true">
      <Field $variant="a" />
      <Field $variant="b" />
      <Grain />
    </Layer>
  );
}

const driftA = keyframes`
  0% { transform: translate3d(-8%, -6%, 0) scale(1); }
  50% { transform: translate3d(6%, 4%, 0) scale(1.08); }
  100% { transform: translate3d(-8%, -6%, 0) scale(1); }
`;

const driftB = keyframes`
  0% { transform: translate3d(6%, 8%, 0) scale(1.05); }
  50% { transform: translate3d(-5%, -4%, 0) scale(0.96); }
  100% { transform: translate3d(6%, 8%, 0) scale(1.05); }
`;

const Layer = styled.div`
  position: fixed;
  inset: 0;
  z-index: ${zIndex.base};
  overflow: hidden;
  pointer-events: none;
`;

const Field = styled.div<{ $variant: 'a' | 'b' }>`
  position: absolute;
  width: 70vmax;
  height: 70vmax;
  border-radius: 50%;
  will-change: transform;
  background: radial-gradient(
    closest-side,
    rgba(${rgb.brand}, ${({ $variant }) => ($variant === 'a' ? 0.07 : 0.045)}),
    transparent
  );
  top: ${({ $variant }) => ($variant === 'a' ? '-30vmax' : '45vh')};
  left: ${({ $variant }) => ($variant === 'a' ? '-18vmax' : '55vw')};

  ${media.motionOk} {
    animation: ${({ $variant }) => ($variant === 'a' ? driftA : driftB)}
      ${({ $variant }) => ($variant === 'a' ? 38 : 46)}s ease-in-out infinite;
  }
`;

const Grain = styled.div`
  position: absolute;
  inset: 0;
  background-image: url(${grain});
  background-size: 180px 180px;
  opacity: 0.05;
`;
