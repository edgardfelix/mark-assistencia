import { m, useMotionValue, useScroll, useSpring, useTransform } from 'motion/react';
import { type PointerEvent, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { facts } from '@/content/common';
import { useFinePointer, usePrefersReducedMotion } from '@/hooks/useMediaQuery';
import { media } from '@/theme/media';
import { color, font, motion, radius, rgb, space } from '@/theme/tokens';
import { HeroVideo } from './HeroVideo';

const tilt = { stiffness: 120, damping: 20, mass: 0.6 };

/**
 * CSS-3D "exploded device": the footage sits on a screen-like frame with two
 * layers behind it (a nod to the screen assembly the shop repairs). It leans
 * toward the pointer and the layers separate as the hero scrolls away.
 * Transform-only; on phones and tablets it flattens into a full-bleed backdrop.
 */
export function HeroStage() {
  const stage = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const finePointer = useFinePointer();
  const interactive = finePointer && !reduced;

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const rotateY = useSpring(useTransform(pointerX, [-0.5, 0.5], [-20, -8]), tilt);
  const rotateX = useSpring(useTransform(pointerY, [-0.5, 0.5], [9, 1]), tilt);

  const { scrollYProgress } = useScroll({ target: stage, offset: ['start start', 'end start'] });
  const lift = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [0, -70]);
  const midDepth = useTransform(scrollYProgress, [0, 1], reduced ? [-70, -70] : [-70, -150]);
  const farDepth = useTransform(scrollYProgress, [0, 1], reduced ? [-150, -150] : [-150, -300]);
  const badgeDepth = useTransform(scrollYProgress, [0, 1], reduced ? [70, 70] : [70, 140]);

  const handleMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!interactive) return;
    const rect = event.currentTarget.getBoundingClientRect();
    pointerX.set((event.clientX - rect.left) / rect.width - 0.5);
    pointerY.set((event.clientY - rect.top) / rect.height - 0.5);
  };

  const reset = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  return (
    <Stage ref={stage} onPointerMove={handleMove} onPointerLeave={reset}>
      <Rig style={{ rotateX, rotateY, y: lift }}>
        <Plate aria-hidden="true" $layer="far" style={{ z: farDepth, x: 52, y: -40, rotate: 5 }} />
        <Plate aria-hidden="true" $layer="mid" style={{ z: midDepth, x: 26, y: -20, rotate: 2.5 }} />
        <Device>
          <HeroVideo />
        </Device>
        <Badge style={{ z: badgeDepth }}>
          <strong>{facts.completedServices.value}</strong>
          <span>{facts.completedServices.label}</span>
        </Badge>
      </Rig>
    </Stage>
  );
}

/* Transform-only: the poster inside is the desktop LCP image and must never be invisible. */
const appear = keyframes`
  from { transform: translate3d(0, 40px, 0) scale(0.95); }
  to { transform: none; }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const Stage = styled.div`
  /* Phones/tablets: full-bleed background behind the copy. */
  position: absolute;
  inset: 0;
  z-index: -1;

  ${media.up('lg')} {
    position: relative;
    inset: auto;
    z-index: auto;
    justify-self: center;
    width: clamp(17.5rem, 25vw, 23.75rem);
    aspect-ratio: 480 / 768;
    perspective: 1600px;
    animation: ${appear} 1.4s ${motion.css.out} 0.25s both;
  }
`;

const Rig = styled(m.div)`
  position: absolute;
  inset: 0;
  transform-style: preserve-3d;

  ${media.down('lg')} {
    transform: none !important;
  }
`;

const Plate = styled(m.div)<{ $layer: 'mid' | 'far' }>`
  display: none;

  ${media.up('lg')} {
    display: block;
    position: absolute;
    inset: 0;
    border-radius: ${radius.xxl};
    background: linear-gradient(160deg, ${color.ink750}, ${color.ink900} 70%);
    box-shadow: ${({ $layer }) =>
      $layer === 'mid'
        ? `inset 0 0 0 1px rgba(${rgb.brand}, 0.42), 0 0 44px -10px rgba(${rgb.brand}, 0.45)`
        : `inset 0 0 0 1px ${color.lineStrong}`};
    opacity: ${({ $layer }) => ($layer === 'mid' ? 0.9 : 0.55)};
    animation: ${fadeIn} 1.2s ${motion.css.out} ${({ $layer }) => ($layer === 'mid' ? '0.7s' : '0.9s')} both;
  }
`;

const Device = styled.div`
  position: absolute;
  inset: 0;

  ${media.up('lg')} {
    border-radius: ${radius.xxl};
    padding: 7px;
    background: linear-gradient(150deg, #2a2a30, #0d0d0f 45%, #1b1b20);
    box-shadow:
      inset 0 0 0 1px rgba(${rgb.white}, 0.12),
      0 60px 120px -40px rgba(0, 0, 0, 0.95),
      0 0 80px -30px rgba(${rgb.brand}, 0.5);

    & > div {
      inset: 7px;
      border-radius: calc(${radius.xxl} - 7px);
    }
  }
`;

const Badge = styled(m.div)`
  display: none;

  ${media.up('lg')} {
    display: grid;
    gap: 2px;
    position: absolute;
    left: -3.25rem;
    bottom: 12%;
    padding: ${space[4]} ${space[5]};
    border-radius: ${radius.lg};
    background: ${color.glass};
    backdrop-filter: blur(16px) saturate(1.4);
    -webkit-backdrop-filter: blur(16px) saturate(1.4);
    box-shadow:
      inset 0 0 0 1px ${color.lineStrong},
      0 24px 50px -20px rgba(0, 0, 0, 0.9);
    animation: ${fadeIn} 1s ${motion.css.out} 1.2s both;

    strong {
      font-size: 1.75rem;
      font-weight: ${font.weight.bold};
      line-height: 1;
      letter-spacing: ${font.tracking.tight};
      color: ${color.brand};
      text-shadow: 0 0 24px rgba(${rgb.brand}, 0.45);
    }

    span {
      font-size: ${font.size.caption};
      color: ${color.textMuted};
    }
  }
`;
