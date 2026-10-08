import { Info } from 'lucide-react';
import { m, useMotionValue, useScroll, useSpring, useTransform, type Variants } from 'motion/react';
import { type PointerEvent, useRef } from 'react';
import styled from 'styled-components';
import { Reveal } from '@/components/motion/Reveal';
import { TextReveal } from '@/components/motion/TextReveal';
import { staggerVariants, viewportOnce } from '@/components/motion/variants';
import { markSelectionSource, useSelectionTransition } from '@/components/motion/viewTransition';
import { Container, Section } from '@/components/ui/Layout';
import { Body, Eyebrow } from '@/components/ui/Typography';
import { pricingContent } from '@/content/pages';
import { pricingOptions, type PricingOption } from '@/data/pricing';
import { useFinePointer, usePrefersReducedMotion } from '@/hooks/useMediaQuery';
import { track } from '@/lib/analytics';
import { media } from '@/theme/media';
import { color, font, motion, radius, rgb, space } from '@/theme/tokens';
import { type CoreCorner, type ModuleTexture, PriceModule } from './PriceModule';

const copy = pricingContent.system;

/** Reading order 01 → 04; each module's inner corner faces the shared light at the centre. */
const placement: readonly { corner: CoreCorner; texture: ModuleTexture }[] = [
  { corner: 'bottom-right', texture: 'rings' },
  { corner: 'bottom-left', texture: 'lines' },
  { corner: 'top-right', texture: 'dots' },
  { corner: 'top-left', texture: 'grid' },
];

const coreVariants: Variants = {
  hidden: { opacity: 0, scale: 0.4 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: motion.ease.out } },
};

const seamVariants = (axis: 'x' | 'y'): Variants => ({
  hidden: axis === 'x' ? { scaleX: 0 } : { scaleY: 0 },
  visible: {
    ...(axis === 'x' ? { scaleX: 1 } : { scaleY: 1 }),
    transition: { duration: 1.4, ease: motion.ease.out, delay: 0.1 },
  },
});

const haloSpring = { stiffness: 50, damping: 18, mass: 1 };
/** Maximum light displacement, in px: felt more than seen. */
const HALO_TRAVEL = 70;

/**
 * Act 2 — the price system. Four entry points arranged around one source of
 * light: the core lights up first, the seams draw outward and the modules
 * follow in reading order. On desktop the grid settles from a slight tilt as it
 * scrolls in, and the ambient light leans gently toward the pointer.
 */
export function PriceSystem() {
  const reduced = usePrefersReducedMotion();
  const finePointer = useFinePointer();
  const immersive = finePointer && !reduced;
  const transition = useSelectionTransition();

  const board = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: board, offset: ['start end', 'start 0.35'] });
  const settle = useTransform(scrollYProgress, [0, 1], immersive ? [4, 0] : [0, 0]);

  const lightX = useMotionValue(0);
  const lightY = useMotionValue(0);
  const haloX = useSpring(lightX, haloSpring);
  const haloY = useSpring(lightY, haloSpring);

  const handlePointerMove = (event: PointerEvent<HTMLElement>) => {
    if (!immersive || event.pointerType !== 'mouse') return;
    const rect = event.currentTarget.getBoundingClientRect();
    lightX.set(((event.clientX - rect.left) / rect.width - 0.5) * 2 * HALO_TRAVEL);
    lightY.set(((event.clientY - rect.top) / rect.height - 0.5) * 2 * HALO_TRAVEL);
  };

  const handleSelect = (option: PricingOption, card: HTMLAnchorElement) => {
    track({ name: 'pricing_select', option: option.id, placement: 'precos-sistema' });
    if (transition) markSelectionSource(card);
  };

  return (
    <Wrapper
      id="opcoes"
      aria-labelledby="opcoes-titulo"
      $flush="top"
      onPointerMove={handlePointerMove}
      onPointerLeave={() => {
        lightX.set(0);
        lightY.set(0);
      }}
    >
      <Halo aria-hidden="true" style={{ x: haloX, y: haloY }} />
      <Container>
        <Head>
          <div>
            <Eyebrow>{copy.eyebrow}</Eyebrow>
            <Title id="opcoes-titulo" text={copy.title} />
          </div>
          <Reveal delay={0.1}>
            <Body>{copy.intro}</Body>
          </Reveal>
        </Head>

        <Board ref={board} initial="hidden" whileInView="visible" viewport={viewportOnce}>
          <Core aria-hidden="true">
            <Seam $axis="x" variants={seamVariants('x')} />
            <Seam $axis="y" variants={seamVariants('y')} />
            <Node variants={coreVariants} />
          </Core>
          <Quad
            role="list"
            variants={staggerVariants(0.1, 0.18)}
            style={immersive ? { rotateX: settle, transformPerspective: 1800 } : undefined}
          >
            {pricingOptions.map((option, index) => {
              const { corner, texture } = placement[index] ?? { corner: 'bottom-right', texture: 'rings' };
              return (
                <PriceModule
                  key={option.id}
                  option={option}
                  corner={corner}
                  texture={texture}
                  viewTransition={transition}
                  onSelect={handleSelect}
                />
              );
            })}
          </Quad>
        </Board>

        <Reveal delay={0.1}>
          <Note>
            <NoteIcon aria-hidden="true">
              <Info size={18} />
            </NoteIcon>
            <p>
              <strong>{pricingContent.note.title}.</strong> {pricingContent.note.text}
            </p>
          </Note>
        </Reveal>
      </Container>
    </Wrapper>
  );
}

const Wrapper = styled(Section)`
  padding-top: clamp(2.5rem, 1.5rem + 3vw, 4.5rem);
  overflow: clip;
`;

/* Ambient light behind the system; leans toward the pointer (transform only). */
const Halo = styled(m.div)`
  position: absolute;
  top: 18%;
  left: 50%;
  z-index: -1;
  width: min(1100px, 120vw);
  aspect-ratio: 1.4;
  margin-left: calc(min(1100px, 120vw) / -2);
  border-radius: 50%;
  pointer-events: none;
  background: radial-gradient(closest-side, rgba(${rgb.brand}, 0.075), transparent);
`;

const Head = styled.header`
  display: grid;
  gap: ${space[6]};
  margin-bottom: clamp(2rem, 1.25rem + 2.5vw, 3.5rem);

  & > div:first-child {
    display: grid;
    gap: ${space[5]};
  }

  ${media.up('lg')} {
    grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr);
    align-items: end;
    gap: ${space[16]};
  }
`;

const Title = styled(TextReveal)`
  font-size: ${font.size.h2};
  line-height: ${font.leading.snug};
  letter-spacing: ${font.tracking.tight};
  /* em, not ch: stays the same when the web font replaces the fallback (no re-wrap). */
  max-width: 10.5em;
`;

const Board = styled(m.div)`
  position: relative;
  isolation: isolate;
`;

/* The shared light: a node and two seams that live in the gaps between modules. */
const Core = styled.div`
  display: none;

  ${media.up('md')} {
    display: block;
    position: absolute;
    inset: 0;
    z-index: -1;
    pointer-events: none;
  }
`;

const Seam = styled(m.span)<{ $axis: 'x' | 'y' }>`
  position: absolute;
  ${({ $axis }) =>
    $axis === 'x'
      ? `left: 4%; right: 4%; top: 50%; height: 1px; margin-top: -0.5px;
         background: linear-gradient(90deg, transparent, rgba(${rgb.brand}, 0.55) 50%, transparent);`
      : `top: 4%; bottom: 4%; left: 50%; width: 1px; margin-left: -0.5px;
         background: linear-gradient(180deg, transparent, rgba(${rgb.brand}, 0.55) 50%, transparent);`}
`;

const Node = styled(m.span)`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 8px;
  height: 8px;
  margin: -4px 0 0 -4px;
  border-radius: 50%;
  background: ${color.brand};
  box-shadow:
    0 0 0 4px rgba(${rgb.brand}, 0.12),
    0 0 26px 4px rgba(${rgb.brand}, 0.55);
`;

const Quad = styled(m.ul)`
  display: grid;
  gap: ${space[4]};
  margin: 0;
  padding: 0;
  list-style: none;
  transform-origin: 50% 100%;

  ${media.up('md')} {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    grid-auto-rows: 1fr;
    gap: clamp(0.875rem, 0.6rem + 0.5vw, 1.125rem);
  }
`;

const Note = styled.div`
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: ${space[4]};
  align-items: start;
  max-width: 54rem;
  margin-top: clamp(1.75rem, 1.25rem + 1.5vw, 2.75rem);
  padding: ${space[5]} ${space[6]};
  border-radius: ${radius.lg};
  background: rgba(${rgb.white}, 0.02);
  box-shadow: inset 0 0 0 1px ${color.line};

  p {
    font-size: ${font.size.small};
    color: ${color.textMuted};
  }

  strong {
    color: ${color.text};
  }
`;

const NoteIcon = styled.span`
  display: grid;
  place-items: center;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: ${radius.md};
  color: ${color.brand};
  background: ${color.brandTint};
  box-shadow: inset 0 0 0 1px rgba(${rgb.brand}, 0.22);
`;
