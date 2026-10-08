import { House, Truck, Wrench } from 'lucide-react';
import { m } from 'motion/react';
import styled, { keyframes } from 'styled-components';
import { WhatsAppButton } from '@/components/common/ContactActions';
import { spotlightSurface } from '@/components/motion/css';
import { revealVariants, staggerVariants, viewportOnce } from '@/components/motion/variants';
import { Reveal } from '@/components/motion/Reveal';
import { TextReveal } from '@/components/motion/TextReveal';
import { Container, Section } from '@/components/ui/Layout';
import { Eyebrow, SectionHeader } from '@/components/ui/Typography';
import { cta } from '@/content/common';
import { homeContent } from '@/content/home';
import { useSpotlight } from '@/hooks/useSpotlight';
import { media } from '@/theme/media';
import { color, font, motion, radius, rgb, space } from '@/theme/tokens';

const content = homeContent.process;

/** Act 3 — Experience: how an appointment works, plus the two conveniences. */
export function ProcessSection() {
  const pickupLight = useSpotlight<HTMLDivElement>();
  const paymentLight = useSpotlight<HTMLDivElement>();

  return (
    <Section id="como-funciona" aria-labelledby="como-funciona-titulo">
      <Container>
        <SectionHeader>
          <Eyebrow>{content.eyebrow}</Eyebrow>
          <Title id="como-funciona-titulo" text={content.title} />
        </SectionHeader>

        <Steps variants={staggerVariants(0.12, 0.1)} initial="hidden" whileInView="visible" viewport={viewportOnce}>
          <Connector
            aria-hidden="true"
            variants={{
              hidden: { scaleX: 0 },
              visible: { scaleX: 1, transition: { duration: 1.6, ease: motion.ease.out } },
            }}
          />
          {content.steps.map((step, index) => (
            <Step key={step.title} data-reveal="" variants={revealVariants.rise}>
              <StepNumber aria-hidden="true">{index + 1}</StepNumber>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </Step>
          ))}
        </Steps>

        <Bento>
          <Reveal>
            <Panel {...pickupLight}>
              <PanelIcon aria-hidden="true">
                <Truck size={22} />
              </PanelIcon>
              <h3>{content.pickup.title}</h3>
              <p>{content.pickup.text}</p>
              <RouteMap aria-hidden="true">
                <Stop>
                  <House size={18} />
                  <span>{content.pickup.routeFrom}</span>
                </Stop>
                <Path>
                  <Runner>
                    <Dot />
                  </Runner>
                </Path>
                <Stop $brand>
                  <Wrench size={18} />
                  <span>{content.pickup.routeTo}</span>
                </Stop>
              </RouteMap>
              <WhatsAppButton message="pickup" placement="home-pickup" variant="secondary" size="md">
                {cta.pickup}
              </WhatsAppButton>
            </Panel>
          </Reveal>

          <Reveal delay={0.12}>
            <Panel {...paymentLight} $accent>
              <Installments>
                <strong>{content.installments.value}</strong>
                <span>{content.installments.title}</span>
              </Installments>
              <p>{content.installments.text}</p>
              <WhatsAppButton message="installments" placement="home-installments" variant="tertiary" size="md">
                {cta.installments}
              </WhatsAppButton>
            </Panel>
          </Reveal>
        </Bento>
      </Container>
    </Section>
  );
}

const travel = keyframes`
  0% { transform: translateX(0%); opacity: 0; }
  12% { opacity: 1; }
  88% { opacity: 1; }
  100% { transform: translateX(100%); opacity: 0; }
`;

const Title = styled(TextReveal)`
  font-size: ${font.size.h2};
  line-height: ${font.leading.snug};
  letter-spacing: ${font.tracking.tight};
  max-width: 20ch;
`;

const Steps = styled(m.ol)`
  position: relative;
  display: grid;
  gap: ${space[8]};
  margin: 0 0 clamp(3rem, 2rem + 3vw, 5rem);
  padding: 0;
  list-style: none;

  ${media.up('md')} {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  ${media.up('lg')} {
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: ${space[10]};
  }
`;

/** Line linking the steps (desktop), drawing itself when revealed. */
const Connector = styled(m.span)`
  display: none;

  ${media.up('lg')} {
    display: block;
    position: absolute;
    top: 1.375rem;
    left: 1.375rem;
    right: 12%;
    height: 1px;
    transform-origin: left center;
    background: linear-gradient(90deg, rgba(${rgb.brand}, 0.7), rgba(${rgb.brand}, 0.15));
  }
`;

const Step = styled(m.li)`
  position: relative;
  display: grid;
  gap: ${space[3]};
  align-content: start;

  h3 {
    font-size: ${font.size.h4};
    font-weight: ${font.weight.semibold};
    margin-top: ${space[3]};
  }

  p {
    font-size: ${font.size.small};
    color: ${color.textMuted};
    max-width: 22rem;
  }
`;

const StepNumber = styled.span`
  position: relative;
  display: grid;
  place-items: center;
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 50%;
  font-weight: ${font.weight.bold};
  font-variant-numeric: tabular-nums;
  color: ${color.brand};
  background: ${color.ink900};
  box-shadow:
    inset 0 0 0 1px rgba(${rgb.brand}, 0.45),
    0 0 24px -6px rgba(${rgb.brand}, 0.55);
`;

const Bento = styled.div`
  display: grid;
  gap: ${space[5]};

  ${media.up('lg')} {
    grid-template-columns: minmax(0, 1.55fr) minmax(0, 1fr);
  }

  & > div {
    height: 100%;
  }
`;

const Panel = styled.div<{ $accent?: boolean }>`
  ${spotlightSurface}
  display: grid;
  gap: ${space[5]};
  align-content: start;
  justify-items: start;
  height: 100%;
  padding: clamp(1.75rem, 1.25rem + 2vw, 3rem);
  border-radius: ${radius.xl};
  background: ${({ $accent }) =>
    $accent
      ? `radial-gradient(120% 90% at 100% 0%, rgba(${rgb.brand}, 0.18), transparent 60%), ${color.ink850}`
      : color.ink850};
  box-shadow: inset 0 0 0 1px ${color.line};

  h3 {
    font-size: ${font.size.h3};
    font-weight: ${font.weight.semibold};
  }

  p {
    color: ${color.textMuted};
    max-width: 30rem;
  }
`;

const PanelIcon = styled.span`
  display: grid;
  place-items: center;
  width: 3rem;
  height: 3rem;
  border-radius: ${radius.md};
  color: ${color.brand};
  background: ${color.brandTint};
  box-shadow: inset 0 0 0 1px rgba(${rgb.brand}, 0.25);
`;

const RouteMap = styled.div`
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: ${space[3]};
  width: 100%;
  margin-block: ${space[2]};
`;

const Stop = styled.span<{ $brand?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: ${space[2]};
  padding: ${space[2]} ${space[3]};
  border-radius: ${radius.pill};
  font-size: ${font.size.caption};
  font-weight: ${font.weight.semibold};
  color: ${({ $brand }) => ($brand ? color.onBrand : color.text)};
  background: ${({ $brand }) => ($brand ? color.brand : 'rgba(255, 255, 255, 0.05)')};
  box-shadow: inset 0 0 0 1px ${({ $brand }) => ($brand ? 'transparent' : color.lineStrong)};
  white-space: nowrap;

  ${media.down('sm')} {
    span {
      position: absolute;
      width: 1px;
      height: 1px;
      overflow: hidden;
      clip-path: inset(50%);
    }
  }
`;

/** Clipping track: tall enough for the dot's glow, so the moving runner never adds overflow. */
const Path = styled.span`
  position: relative;
  height: 28px;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    top: 50%;
    height: 2px;
    margin-top: -1px;
    background-image: linear-gradient(90deg, ${color.lineStrong} 50%, transparent 50%);
    background-size: 10px 2px;
  }
`;

/** Spans the whole path, so translateX(100%) moves the dot end to end (compositor-only). */
const Runner = styled.span`
  position: absolute;
  inset: 0;
  transform: translateX(50%);

  ${media.motionOk} {
    animation: ${travel} 3.6s ${motion.css.inOut} infinite;
  }
`;

const Dot = styled.span`
  position: absolute;
  top: 50%;
  left: 0;
  width: 10px;
  height: 10px;
  margin: -5px 0 0 -5px;
  border-radius: 50%;
  background: ${color.brand};
  box-shadow: 0 0 14px 3px rgba(${rgb.brand}, 0.65);
`;

const Installments = styled.p`
  display: flex;
  align-items: baseline;
  gap: ${space[3]};

  strong {
    font-size: clamp(4rem, 3rem + 4vw, 6rem);
    font-weight: ${font.weight.heavy};
    line-height: 0.9;
    letter-spacing: ${font.tracking.tighter};
    color: ${color.brand};
    text-shadow: 0 0 50px rgba(${rgb.brand}, 0.35);
  }

  span {
    font-size: ${font.size.h3};
    font-weight: ${font.weight.semibold};
    color: ${color.text};
  }
`;
