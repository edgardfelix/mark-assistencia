import { ArrowRight, Smartphone } from 'lucide-react';
import { m, useMotionValue, useSpring, type Variants } from 'motion/react';
import { type PointerEvent, useRef } from 'react';
import { Link } from 'react-router';
import styled, { css } from 'styled-components';
import { spotlightSurface } from '@/components/motion/css';
import { isPlainActivation } from '@/components/motion/viewTransition';
import { PriceTag } from '@/components/ui/Price';
import { PriceLabel } from '@/components/ui/PriceLabel';
import { pricingContent } from '@/content/pages';
import { pricingContactPath, pricingOptionNumber, type PricingOption } from '@/data/pricing';
import { useFinePointer, usePrefersReducedMotion } from '@/hooks/useMediaQuery';
import { prefetchRoute } from '@/routes/prefetch';
import { paths } from '@/routes/paths';
import { media } from '@/theme/media';
import { color, font, motion, radius, rgb, space } from '@/theme/tokens';

const copy = pricingContent.system;

/** Corner of the module that faces the centre of the price system (where its light comes from). */
export type CoreCorner = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
/** Line pattern that gives each module its own texture inside one shared system. */
export type ModuleTexture = 'rings' | 'lines' | 'dots' | 'grid';

interface PriceModuleProps {
  option: PricingOption;
  corner: CoreCorner;
  texture: ModuleTexture;
  /** Navigate with a View Transition (motion allowed and supported). */
  viewTransition: boolean;
  /** Plain click/Enter on the module, before navigation starts. */
  onSelect: (option: PricingOption, card: HTMLAnchorElement) => void;
}

const moduleVariants: Variants = {
  hidden: { opacity: 0, y: 34, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.9, ease: motion.ease.out } },
};

/** Degrees at the module's edges: enough to feel physical, never enough to feel like a game. */
const TILT_X = 3.5;
const TILT_Y = 5;
const tiltSpring = { stiffness: 170, damping: 20, mass: 0.7 };

/**
 * One price as an entry point into the MARK experience. The whole module is a
 * single link to the contact page with the option preselected (`?servico=`).
 * Desktop pointers get a restrained 3D tilt, a light that follows the cursor
 * and a lit border; keyboard focus gets the same emphasis without the tilt.
 */
export function PriceModule({ option, corner, texture, viewTransition, onSelect }: PriceModuleProps) {
  const finePointer = useFinePointer();
  const reduced = usePrefersReducedMotion();
  const tiltEnabled = finePointer && !reduced;

  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const rotateX = useSpring(tiltX, tiltSpring);
  const rotateY = useSpring(tiltY, tiltSpring);
  const frame = useRef(0);

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'mouse') return;
    const element = event.currentTarget;
    const { clientX, clientY } = event;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      const rect = element.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      element.style.setProperty('--spot-x', `${String(x)}px`);
      element.style.setProperty('--spot-y', `${String(y)}px`);
      if (!tiltEnabled) return;
      tiltX.set((0.5 - y / rect.height) * 2 * TILT_X);
      tiltY.set((x / rect.width - 0.5) * 2 * TILT_Y);
    });
  };

  const handlePointerLeave = () => {
    cancelAnimationFrame(frame.current);
    tiltX.set(0);
    tiltY.set(0);
  };

  return (
    <Item id={`opcao-${option.id}`} tabIndex={-1} data-reveal="" variants={moduleVariants}>
      <Tilt
        {...(tiltEnabled
          ? { style: { rotateX, rotateY, transformPerspective: 1100 }, whileHover: { scale: 1.012 } }
          : {})}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
      >
        <Card
          to={pricingContactPath(option.id)}
          viewTransition={viewTransition}
          data-corner={corner}
          data-texture={texture}
          onClick={(event) => {
            if (isPlainActivation(event)) onSelect(option, event.currentTarget);
          }}
          onPointerEnter={() => {
            prefetchRoute(paths.contact);
          }}
          onFocus={() => {
            prefetchRoute(paths.contact);
          }}
        >
          <Texture aria-hidden="true" />
          <Head>
            <Index aria-hidden="true">
              <b>{pricingOptionNumber(option)}</b> / {option.label}
            </Index>
            <Glyph aria-hidden="true">
              <Smartphone size={18} strokeWidth={1.75} />
            </Glyph>
          </Head>
          <Name>{option.name}</Name>
          <PriceArea>
            {option.price.kind === 'reference' ? <PriceLabel>{copy.referenceLabel}</PriceLabel> : null}
            <Glow>
              <PriceTag price={option.price} animated />
            </Glow>
          </PriceArea>
          <Cta>
            <span>{copy.choose}</span>
            <ArrowDisc aria-hidden="true">
              <ArrowRight size={18} />
            </ArrowDisc>
          </Cta>
        </Card>
      </Tilt>
    </Item>
  );
}

const Item = styled(m.li)`
  display: grid;
  min-width: 0;
  scroll-margin-top: calc(var(--header-h) + ${space[6]});

  &:focus {
    outline: none;
  }
`;

const Tilt = styled(m.div)`
  display: grid;
  min-width: 0;
  border-radius: ${radius.xl};
`;

/** Where each module's light comes from, and the corner it tightens in the 2 × 2 system. */
const corners: Record<CoreCorner, { at: string; radius: ReturnType<typeof css> }> = {
  'top-left': {
    at: '0% 0%',
    radius: css`
      border-top-left-radius: ${radius.sm};
    `,
  },
  'top-right': {
    at: '100% 0%',
    radius: css`
      border-top-right-radius: ${radius.sm};
    `,
  },
  'bottom-left': {
    at: '0% 100%',
    radius: css`
      border-bottom-left-radius: ${radius.sm};
    `,
  },
  'bottom-right': {
    at: '100% 100%',
    radius: css`
      border-bottom-right-radius: ${radius.sm};
    `,
  },
};

const cornerRules = (Object.keys(corners) as CoreCorner[]).map(
  (corner) => css`
    &[data-corner='${corner}'] {
      --core-at: ${corners[corner].at};

      ${media.up('md')} {
        ${corners[corner].radius}
      }
    }
  `,
);

const emphasis = css`
  box-shadow:
    inset 0 0 0 1px rgba(${rgb.brand}, 0.32),
    inset 0 1px 0 rgba(${rgb.white}, 0.09),
    0 44px 90px -46px rgba(${rgb.brand}, 0.42),
    0 30px 70px -40px rgba(0, 0, 0, 0.95);
`;

const Card = styled(Link)`
  ${spotlightSurface}
  --core-at: 100% 0%;
  --glow-alpha: 0.13;
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: clamp(16.5rem, 11rem + 9vw, 22.5rem);
  padding: clamp(1.4rem, 1rem + 1.4vw, 2.4rem);
  border-radius: ${radius.xl};
  overflow: hidden;
  color: ${color.text};
  background:
    radial-gradient(90% 80% at var(--core-at), rgba(${rgb.brand}, var(--glow-alpha)), transparent 62%),
    linear-gradient(180deg, rgba(${rgb.white}, 0.035), rgba(${rgb.white}, 0.008)), ${color.ink850};
  box-shadow:
    inset 0 0 0 1px ${color.line},
    inset 0 1px 0 rgba(${rgb.white}, 0.07),
    0 30px 70px -40px rgba(0, 0, 0, 0.95);
  transition:
    box-shadow 0.5s ${motion.css.out},
    transform 0.25s ${motion.css.out};
  -webkit-tap-highlight-color: transparent;

  ${cornerRules}

  /* Same light, different intensity: one controlled variable per module. */
  &[data-texture='rings'] {
    --glow-alpha: 0.14;
  }
  &[data-texture='lines'] {
    --glow-alpha: 0.12;
  }
  &[data-texture='dots'] {
    --glow-alpha: 0.13;
  }
  &[data-texture='grid'] {
    --glow-alpha: 0.17;
  }

  ${media.finePointer} {
    &:hover {
      ${emphasis}
    }
  }

  &:focus-visible {
    ${emphasis}
    outline: 2px solid ${color.brand};
    outline-offset: 4px;
  }

  &:focus-visible::before,
  &:focus-visible::after {
    opacity: 1;
  }

  /* Click/tap: a short press in, with the border lighting up (pure CSS, no extra focus stop). */
  &:active {
    transform: scale(0.985);
    box-shadow:
      inset 0 0 0 1px rgba(${rgb.brand}, 0.6),
      0 0 0 4px rgba(${rgb.brand}, 0.08),
      0 30px 70px -40px rgba(0, 0, 0, 0.95);
  }
`;

/* Fine line work radiating from the module's inner corner; it drifts a little on hover. */
const Texture = styled.span`
  position: absolute;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  opacity: 0.85;
  mask-image: radial-gradient(75% 75% at var(--core-at), #000 0%, transparent 78%);
  transition: transform 1.4s ${motion.css.out};

  [data-texture='rings'] > & {
    background: repeating-radial-gradient(
      circle at var(--core-at),
      rgba(${rgb.white}, 0.06) 0 1px,
      transparent 1px 22px
    );
  }

  [data-texture='lines'] > & {
    background: repeating-linear-gradient(118deg, rgba(${rgb.white}, 0.05) 0 1px, transparent 1px 15px);
  }

  [data-texture='dots'] > & {
    background: radial-gradient(circle, rgba(${rgb.white}, 0.16) 1px, transparent 1.6px) 0 0 / 18px 18px;
  }

  [data-texture='grid'] > & {
    background:
      linear-gradient(to right, rgba(${rgb.white}, 0.055) 1px, transparent 1px) 0 0 / 28px 28px,
      linear-gradient(to bottom, rgba(${rgb.white}, 0.055) 1px, transparent 1px) 0 0 / 28px 28px;
  }

  ${media.finePointer} {
    [data-texture='rings']:hover > & {
      transform: scale(1.08);
    }
    [data-texture='lines']:hover > & {
      transform: translateX(-12px);
    }
    [data-texture='dots']:hover > & {
      transform: translateY(-9px);
    }
    [data-texture='grid']:hover > & {
      transform: scale(1.05) translate(6px, 6px);
    }
  }
`;

const Head = styled.span`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${space[4]};
  margin-bottom: ${space[8]};
`;

const Index = styled.span`
  font-size: ${font.size.caption};
  font-weight: ${font.weight.semibold};
  letter-spacing: ${font.tracking.eyebrow};
  text-transform: uppercase;
  font-variant-numeric: tabular-nums;
  /* textMuted, not textSubtle: the index can sit on the module's corner light (≥ 7:1 there). */
  color: ${color.textMuted};

  b {
    font-weight: ${font.weight.bold};
    color: ${color.brand};
  }
`;

const Glyph = styled.span`
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: ${radius.md};
  color: ${color.brand};
  background: ${color.brandTint};
  box-shadow: inset 0 0 0 1px rgba(${rgb.brand}, 0.22);
  transition: transform 0.6s ${motion.css.out};

  ${media.finePointer} {
    ${Card}:hover & {
      transform: translateY(-2px) rotate(-8deg);
    }
  }

  ${Card}:focus-visible & {
    transform: translateY(-2px) rotate(-8deg);
  }
`;

/* margin-top: auto keeps name, price and action together at the foot of the module. */
const Name = styled.h3`
  margin-top: auto;
  margin-bottom: ${space[3]};
  font-size: clamp(1.3rem, 1.12rem + 0.7vw, 1.7rem);
  font-weight: ${font.weight.semibold};
  line-height: ${font.leading.snug};
  letter-spacing: ${font.tracking.tight};
`;

const PriceArea = styled.div`
  display: grid;
  justify-items: start;
  gap: calc(${font.size.price} * 0.12);
  margin-bottom: clamp(1.1rem, 0.85rem + 0.9vw, 1.75rem);
`;

/* Price emphasis on hover/focus: a soft glow that follows the numerals' shape. */
const Glow = styled.div`
  transition: filter 0.6s ${motion.css.out};

  ${media.finePointer} {
    ${Card}:hover & {
      filter: drop-shadow(0 0 22px rgba(${rgb.brand}, 0.28));
    }
  }

  ${Card}:focus-visible & {
    filter: drop-shadow(0 0 22px rgba(${rgb.brand}, 0.28));
  }
`;

const Cta = styled.span`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${space[4]};
  padding-top: ${space[4]};
  border-top: 1px solid ${color.line};
  font-size: ${font.size.small};
  font-weight: ${font.weight.semibold};
  color: ${color.textMuted};
  transition: color 0.3s;

  ${media.finePointer} {
    ${Card}:hover & {
      color: ${color.text};
    }
  }

  ${Card}:focus-visible & {
    color: ${color.text};
  }
`;

const ArrowDisc = styled.span`
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 50%;
  color: ${color.text};
  box-shadow: inset 0 0 0 1px ${color.lineStrong};
  transition:
    transform 0.5s ${motion.css.out},
    background-color 0.4s,
    color 0.4s,
    box-shadow 0.4s;

  ${media.finePointer} {
    ${Card}:hover & {
      color: ${color.onBrand};
      background: ${color.brand};
      box-shadow: 0 0 24px -6px rgba(${rgb.brand}, 0.8);
      transform: rotate(-45deg);
    }
  }

  ${Card}:focus-visible & {
    color: ${color.onBrand};
    background: ${color.brand};
    transform: rotate(-45deg);
  }
`;
