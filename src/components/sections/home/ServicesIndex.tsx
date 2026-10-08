import { ArrowRight, Headphones } from 'lucide-react';
import { m, useMotionValue, useSpring } from 'motion/react';
import { type PointerEvent, useState } from 'react';
import { Link } from 'react-router';
import styled from 'styled-components';
import { revealVariants, staggerVariants, viewportOnce } from '@/components/motion/variants';
import { TextReveal } from '@/components/motion/TextReveal';
import { Reveal } from '@/components/motion/Reveal';
import { ButtonLink } from '@/components/ui/Button';
import { Container, Section } from '@/components/ui/Layout';
import { ResponsiveImage } from '@/components/ui/ResponsiveImage';
import { Body, Eyebrow } from '@/components/ui/Typography';
import { cta } from '@/content/common';
import { homeContent } from '@/content/home';
import { services } from '@/data/services';
import { prefetchRoute } from '@/routes/prefetch';
import { paths } from '@/routes/paths';
import { media } from '@/theme/media';
import { color, font, motion, radius, rgb, space } from '@/theme/tokens';

const content = homeContent.services;
const follow = { stiffness: 260, damping: 28, mass: 0.6 };

/** Act 3 — Experience: what MARK fixes, as an editorial index. */
export function ServicesIndex() {
  const [active, setActive] = useState<number | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, follow);
  const springY = useSpring(y, follow);

  const handleMove = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'mouse') return;
    const rect = event.currentTarget.getBoundingClientRect();
    x.set(event.clientX - rect.left);
    y.set(event.clientY - rect.top);
  };

  return (
    <Section aria-labelledby="servicos-titulo">
      <Container>
        <Head>
          <div>
            <Eyebrow>{content.eyebrow}</Eyebrow>
            <Title id="servicos-titulo" text={content.title} />
          </div>
          <Reveal delay={0.1}>
            <Body>{content.intro}</Body>
          </Reveal>
        </Head>

        <Board
          onPointerMove={handleMove}
          onPointerLeave={() => {
            setActive(null);
          }}
        >
          <List
            variants={staggerVariants(0.07)}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            role="list"
          >
            {services.map((service, index) => (
              <Row key={service.slug} data-reveal="" variants={revealVariants.rise}>
                <RowLink
                  to={`${paths.services}#${service.slug}`}
                  data-active={active === index}
                  onPointerEnter={() => {
                    setActive(index);
                    prefetchRoute(paths.services);
                  }}
                  onFocus={() => {
                    prefetchRoute(paths.services);
                  }}
                >
                  <Index aria-hidden="true">{String(index + 1).padStart(2, '0')}</Index>
                  <Name>{service.title}</Name>
                  <Summary>{service.summary}</Summary>
                  <Thumb aria-hidden="true">
                    {service.image ? (
                      <ResponsiveImage id={service.image.id} alt="" sizes="72px" />
                    ) : (
                      <IconTile>
                        <Headphones size={22} />
                      </IconTile>
                    )}
                  </Thumb>
                  <Arrow aria-hidden="true">
                    <ArrowRight size={20} />
                  </Arrow>
                </RowLink>
              </Row>
            ))}
          </List>

          <Preview aria-hidden="true" style={{ x: springX, y: springY }} data-visible={active !== null}>
            {services.map((service, index) => (
              <PreviewItem key={service.slug} data-active={active === index}>
                {service.image ? (
                  <ResponsiveImage id={service.image.id} alt="" sizes="260px" />
                ) : (
                  <IconTile $large>
                    <Headphones size={44} />
                  </IconTile>
                )}
              </PreviewItem>
            ))}
          </Preview>
        </Board>

        <Footer>
          <ButtonLink to={paths.services} variant="tertiary" size="md">
            {cta.allServices}
          </ButtonLink>
        </Footer>
      </Container>
    </Section>
  );
}

const Head = styled.header`
  display: grid;
  gap: ${space[6]};
  margin-bottom: clamp(2.5rem, 1.5rem + 3vw, 4.5rem);

  & > div:first-child {
    display: grid;
    gap: ${space[5]};
  }

  ${media.up('lg')} {
    grid-template-columns: minmax(0, 1.3fr) minmax(0, 1fr);
    align-items: end;
    gap: ${space[16]};
  }
`;

const Title = styled(TextReveal)`
  font-size: ${font.size.h2};
  line-height: ${font.leading.snug};
  letter-spacing: ${font.tracking.tight};
  max-width: 16ch;
`;

const Board = styled.div`
  position: relative;
`;

const List = styled(m.ul)`
  margin: 0;
  padding: 0;
  list-style: none;
  border-top: 1px solid ${color.line};
`;

const Row = styled(m.li)`
  border-bottom: 1px solid ${color.line};
`;

const RowLink = styled(Link)`
  position: relative;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  grid-template-areas:
    'index name thumb'
    'index summary thumb';
  align-items: center;
  column-gap: ${space[5]};
  row-gap: ${space[1]};
  padding: ${space[6]} ${space[2]};
  transition:
    background-color 0.4s ${motion.css.out},
    padding 0.5s ${motion.css.out};

  ${media.up('md')} {
    grid-template-columns: 4rem minmax(0, 1.1fr) minmax(0, 1fr) auto;
    grid-template-areas: 'index name summary arrow';
    column-gap: ${space[8]};
    padding-block: clamp(1.6rem, 1.2rem + 1vw, 2.4rem);
  }

  ${media.finePointer} {
    &:hover,
    &[data-active='true'] {
      background: linear-gradient(90deg, rgba(${rgb.brand}, 0.06), transparent 70%);
    }
  }

  &:focus-visible {
    outline-offset: -2px;
    border-radius: ${radius.sm};
  }
`;

const Index = styled.span`
  grid-area: index;
  align-self: start;
  padding-top: 0.45em;
  font-size: ${font.size.caption};
  font-weight: ${font.weight.semibold};
  letter-spacing: ${font.tracking.wide};
  font-variant-numeric: tabular-nums;
  color: ${color.textSubtle};
  transition: color 0.4s;

  ${RowLink}:hover &,
  ${RowLink}[data-active='true'] & {
    color: ${color.brand};
  }

  ${media.up('md')} {
    align-self: center;
    padding-top: 0;
  }
`;

const Name = styled.span`
  grid-area: name;
  font-size: clamp(1.35rem, 1.05rem + 1.4vw, 2.25rem);
  font-weight: ${font.weight.semibold};
  letter-spacing: ${font.tracking.tight};
  line-height: 1.15;
  transition: transform 0.6s ${motion.css.out};

  ${media.finePointer} {
    ${RowLink}:hover &,
    ${RowLink}[data-active='true'] & {
      transform: translateX(8px);
    }
  }
`;

const Summary = styled.span`
  grid-area: summary;
  font-size: ${font.size.small};
  color: ${color.textMuted};
`;

const Thumb = styled.span`
  grid-area: thumb;
  width: 4.5rem;
  height: 4.5rem;
  border-radius: ${radius.md};
  overflow: hidden;
  box-shadow: inset 0 0 0 1px ${color.line};

  picture {
    width: 100%;
    height: 100%;
  }

  ${media.up('md')} {
    display: none;
  }
`;

const IconTile = styled.span<{ $large?: boolean }>`
  display: grid;
  place-items: center;
  width: 100%;
  height: 100%;
  color: ${color.brand};
  background:
    radial-gradient(circle at 50% 40%, rgba(${rgb.brand}, ${({ $large }) => ($large ? 0.2 : 0.14)}), transparent 70%),
    ${color.ink800};
`;

const Arrow = styled.span`
  grid-area: arrow;
  display: none;
  place-items: center;
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 50%;
  color: ${color.text};
  box-shadow: inset 0 0 0 1px ${color.lineStrong};
  transition:
    transform 0.5s ${motion.css.out},
    background-color 0.4s,
    color 0.4s;

  ${media.up('md')} {
    display: grid;
  }

  ${RowLink}:hover &,
  ${RowLink}[data-active='true'] & {
    color: ${color.onBrand};
    background: ${color.brand};
    transform: rotate(-45deg);
  }
`;

const Preview = styled(m.div)`
  display: none;

  ${media.finePointer} {
    ${media.up('lg')} {
      display: block;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 2;
      width: 15rem;
      aspect-ratio: 4 / 5;
      margin: -9rem 0 0 2.5rem;
      border-radius: ${radius.lg};
      overflow: hidden;
      pointer-events: none;
      opacity: 0;
      scale: 0.92;
      box-shadow:
        0 30px 70px -20px rgba(0, 0, 0, 0.9),
        0 0 0 1px ${color.lineStrong};
      transition:
        opacity 0.35s ${motion.css.out},
        scale 0.5s ${motion.css.out};

      &[data-visible='true'] {
        opacity: 1;
        scale: 1;
      }
    }
  }
`;

const PreviewItem = styled.div`
  position: absolute;
  inset: 0;
  opacity: 0;
  transition: opacity 0.4s ${motion.css.out};

  &[data-active='true'] {
    opacity: 1;
  }

  picture {
    width: 100%;
    height: 100%;
  }
`;

const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: ${space[8]};
`;
