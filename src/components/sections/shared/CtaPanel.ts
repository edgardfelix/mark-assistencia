import styled from 'styled-components';
import { spotlightSurface } from '@/components/motion/css';
import { media } from '@/theme/media';
import { color, radius, rgb, space } from '@/theme/tokens';

/** Lit panel shared by the closing calls to action (CtaBand, prices page). */
export const CtaPanel = styled.div`
  ${spotlightSurface}
  display: grid;
  gap: ${space[10]};
  padding: clamp(2.25rem, 1.5rem + 4vw, 5rem);
  border-radius: ${radius.xxl};
  overflow: hidden;
  background:
    radial-gradient(90% 120% at 100% 100%, rgba(${rgb.brand}, 0.16), transparent 55%),
    radial-gradient(60% 80% at 0% 0%, rgba(${rgb.white}, 0.04), transparent 60%), ${color.ink850};
  box-shadow:
    inset 0 0 0 1px ${color.line},
    0 50px 120px -60px rgba(${rgb.brand}, 0.35);

  ${media.up('lg')} {
    grid-template-columns: minmax(0, 1.25fr) auto;
    align-items: end;
  }
`;

/** Lens-flare streak along the top edge of the panel. */
export const CtaFlare = styled.div`
  position: absolute;
  top: 0;
  left: 12%;
  width: 52%;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255, 240, 170, 0.85), transparent);
  box-shadow: 0 0 18px 2px rgba(${rgb.brand}, 0.45);
  pointer-events: none;
`;
