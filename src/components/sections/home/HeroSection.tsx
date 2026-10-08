import { Clock, CreditCard, Truck } from 'lucide-react';
import styled, { keyframes } from 'styled-components';
import { WhatsAppButton } from '@/components/common/ContactActions';
import { entrance, entranceRise, glowPulse } from '@/components/motion/css';
import { EntranceWords } from '@/components/motion/EntranceWords';
import { Magnetic } from '@/components/motion/Magnetic';
import { ButtonLink } from '@/components/ui/Button';
import { Container } from '@/components/ui/Layout';
import { Eyebrow, Lead } from '@/components/ui/Typography';
import { cta, facts } from '@/content/common';
import { homeContent } from '@/content/home';
import { display } from '@/lib/format';
import { heroVideo } from '@/lib/media';
import { paths } from '@/routes/paths';
import { media } from '@/theme/media';
import { color, font, layout, motion, radius, rgb, space } from '@/theme/tokens';
import { HeroStage } from './HeroStage';

const { hero } = homeContent;

/** Act 1 — Impact. */
export function HeroSection() {
  return (
    <Hero aria-labelledby="hero-title">
      <Backdrop aria-hidden="true">
        <Ambient style={{ backgroundImage: `url(${heroVideo.ambient})` }} />
        <Glow />
        <Flare />
        <Guides />
      </Backdrop>

      <Layout $wide>
        <Copy>
          <HeroEyebrow>
            <Live aria-hidden="true" />
            {/* One flex item, so the location keeps normal word spacing. */}
            <span>
              {hero.eyebrow}
              <Location>{hero.eyebrowLocation}</Location>
            </span>
          </HeroEyebrow>
          <Title id="hero-title">
            <span>
              <EntranceWords text={hero.titleLead} delay={0.18} />
            </span>{' '}
            <Accent>
              <EntranceWords text={hero.titleAccent} delay={0.42} />
            </Accent>
          </Title>
          <HeroLead>{hero.lead}</HeroLead>
          <Actions>
            <Magnetic>
              <WhatsAppButton message="service" placement="hero">
                {cta.whatsapp}
              </WhatsAppButton>
            </Magnetic>
            <ButtonLink to={paths.services} variant="secondary">
              {cta.services}
            </ButtonLink>
          </Actions>
          <Facts role="list">
            <li>
              <Truck size={17} aria-hidden="true" />
              {facts.pickup.short}
            </li>
            <li>
              <CreditCard size={17} aria-hidden="true" />
              {facts.installments.short}
            </li>
            <li>
              <Clock size={17} aria-hidden="true" />
              {display.hours}
            </li>
          </Facts>
        </Copy>
        <HeroStage />
      </Layout>
    </Hero>
  );
}

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const drift = keyframes`
  0%, 100% { transform: translate3d(0, 0, 0); opacity: 0.75; }
  50% { transform: translate3d(-4%, 6px, 0); opacity: 1; }
`;

const Hero = styled.section`
  position: relative;
  isolation: isolate;
  display: grid;
  align-items: end;
  min-height: 100svh;
  padding-top: calc(${layout.headerHeight} + ${space[8]});
  padding-bottom: clamp(2.5rem, 2rem + 3vw, 4rem);
  overflow: clip;

  ${media.up('lg')} {
    align-items: center;
    min-height: clamp(42rem, 100svh, 62rem);
    padding-bottom: ${space[16]};
  }
`;

const Backdrop = styled.div`
  position: absolute;
  inset: 0;
  z-index: -2;
  pointer-events: none;
  animation: ${fadeIn} 1.4s ${motion.css.out} both;
`;

/** Pre-blurred frame of the footage: cinematic color without runtime blur. */
const Ambient = styled.div`
  display: none;

  ${media.up('lg')} {
    display: block;
    position: absolute;
    inset: -10%;
    background-size: cover;
    background-position: center;
    opacity: 0.32;
    transform: scale(1.15);
    mask-image: radial-gradient(60% 70% at 72% 45%, #000 0%, transparent 75%);
  }
`;

const Glow = styled.div`
  position: absolute;
  inset: 0;
  background:
    radial-gradient(42% 55% at 74% 46%, rgba(${rgb.brand}, 0.2), transparent 70%),
    radial-gradient(30% 40% at 12% 18%, rgba(${rgb.white}, 0.05), transparent 70%),
    linear-gradient(to bottom, transparent 70%, ${color.ink900});
`;

/** Lens flare: a soft horizontal streak with a hot core, drifting slowly. */
const Flare = styled.div`
  display: none;

  ${media.up('lg')} {
    display: block;
    position: absolute;
    top: 20%;
    right: 2%;
    width: 58%;
    height: 2px;
    border-radius: 2px;
    background: linear-gradient(90deg, transparent, rgba(255, 238, 160, 0.7) 55%, transparent);
    filter: blur(0.5px);
    box-shadow: 0 0 22px 3px rgba(${rgb.brand}, 0.35);

    &::after {
      content: '';
      position: absolute;
      left: 55%;
      top: 50%;
      width: 180px;
      height: 180px;
      transform: translate(-50%, -50%);
      background: radial-gradient(closest-side, rgba(255, 240, 180, 0.22), transparent);
    }

    ${media.motionOk} {
      animation: ${drift} 14s ${motion.css.inOut} infinite;
    }
  }
`;

/** Precision guides: hairlines that frame the composition on large screens. */
const Guides = styled.div`
  display: none;

  ${media.up('lg')} {
    display: block;
    position: absolute;
    inset: 0;
    background:
      linear-gradient(
        to right,
        transparent calc(50% - 0.5px),
        rgba(${rgb.white}, 0.05) calc(50% - 0.5px),
        rgba(${rgb.white}, 0.05) calc(50% + 0.5px),
        transparent calc(50% + 0.5px)
      ),
      linear-gradient(
        to bottom,
        transparent calc(78% - 0.5px),
        rgba(${rgb.white}, 0.05) calc(78% - 0.5px),
        rgba(${rgb.white}, 0.05) calc(78% + 0.5px),
        transparent calc(78% + 0.5px)
      );
    mask-image: radial-gradient(70% 70% at 50% 50%, #000, transparent 85%);
  }
`;

const Layout = styled(Container)`
  display: grid;
  gap: ${space[12]};

  /* Phones/tablets: let the stage anchor to the whole hero (full-bleed video). */
  ${media.down('lg')} {
    position: static;
  }

  ${media.up('lg')} {
    grid-template-columns: minmax(0, 1.25fr) minmax(0, 0.75fr);
    align-items: center;
    gap: ${space[16]};
  }
`;

const Copy = styled.div`
  display: grid;
  gap: ${space[6]};
  max-width: 44rem;

  ${media.up('md')} {
    gap: ${space[7]};
  }
`;

const HeroEyebrow = styled(Eyebrow)`
  ${entrance(0.05)}

  &::before {
    display: none;
  }
`;

const Live = styled.span`
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: ${color.brand};
  box-shadow: 0 0 10px rgba(${rgb.brand}, 0.8);
  /* Breathing via opacity/transform only: runs on the compositor, no per-frame repaint. */
  ${glowPulse}
`;

/* The glow lives on its own layer: a text-shadow would be cut by each word's reveal mask. */
const Title = styled.h1`
  position: relative;
  font-size: clamp(2.45rem, 1.2rem + 3.6vw, 4.1rem);
  font-weight: ${font.weight.bold};
  line-height: ${font.leading.tight};
  letter-spacing: ${font.tracking.tighter};

  & > span {
    display: block;
  }

  &::before {
    content: '';
    position: absolute;
    left: -6%;
    bottom: -10%;
    width: 70%;
    height: 70%;
    z-index: -1;
    background: radial-gradient(closest-side, rgba(${rgb.brand}, 0.16), transparent);
    pointer-events: none;
  }
`;

const Accent = styled.span`
  color: ${color.brand};
`;

const Location = styled.span`
  display: none;

  ${media.up('md')} {
    display: inline;
  }
`;

const HeroLead = styled(Lead)`
  ${entranceRise(0.5)}
  color: ${color.textMuted};
`;

const Actions = styled.div`
  ${entrance(0.78)}
  display: grid;
  gap: ${space[3]};

  & > * {
    width: 100%;
  }

  & a {
    width: 100%;
  }

  ${media.up('sm')} {
    display: flex;
    flex-wrap: wrap;

    & > *,
    & a {
      width: auto;
    }
  }
`;

const Facts = styled.ul`
  ${entrance(0.95)}
  display: flex;
  flex-wrap: wrap;
  gap: ${space[2]};
  margin: 0;
  padding: 0;
  list-style: none;

  li {
    display: inline-flex;
    align-items: center;
    gap: ${space[2]};
    height: 2.25rem;
    padding-inline: ${space[3]};
    border-radius: ${radius.pill};
    font-size: ${font.size.caption};
    font-weight: ${font.weight.medium};
    color: ${color.textMuted};
    /* No backdrop blur: it would be recomputed on every video frame. */
    background: rgba(${rgb.ink}, 0.62);
    box-shadow: inset 0 0 0 1px ${color.line};

    svg {
      color: ${color.brand};
    }
  }
`;
