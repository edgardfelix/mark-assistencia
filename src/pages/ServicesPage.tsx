import { Fragment } from 'react';
import styled from 'styled-components';
import { JumpLink } from '@/components/common/JumpLink';
import { ParallaxMedia } from '@/components/motion/Parallax';
import { LightSeam } from '@/components/motion/LightSeam';
import { TextReveal } from '@/components/motion/TextReveal';
import { AccessoriesBand, ServiceChapter } from '@/components/sections/services/ServiceChapter';
import { CtaBand } from '@/components/sections/shared/CtaBand';
import { FactsStrip } from '@/components/sections/shared/FactsStrip';
import { PageHero } from '@/components/sections/shared/PageHero';
import { Container, Section } from '@/components/ui/Layout';
import { ResponsiveImage } from '@/components/ui/ResponsiveImage';
import { Eyebrow, SectionHeader } from '@/components/ui/Typography';
import { lcpImages } from '@/config/lcp';
import { servicesContent } from '@/content/pages';
import { getService, services } from '@/data/services';
import { media } from '@/theme/media';
import { color, font, motion, radius, rgb, space } from '@/theme/tokens';

const chapters = services.filter((service) => service.image);
const accessories = getService('acessorios');

export default function ServicesPage() {
  const { hero, conveniences, cta } = servicesContent;
  return (
    <>
      <PageHero
        eyebrow={hero.eyebrow}
        title={hero.title}
        lead={hero.lead}
        aside={
          <HeroMedia>
            <ResponsiveImage
              id={lcpImages.services.id}
              alt={hero.imageAlt}
              sizes={lcpImages.services.sizes}
              priority
              position="50% 35%"
            />
          </HeroMedia>
        }
      >
        <nav aria-label={hero.jumpLabel}>
          <Chips>
            {services.map((service) => (
              <li key={service.slug}>
                <Chip targetId={service.slug}>{service.title}</Chip>
              </li>
            ))}
          </Chips>
        </nav>
      </PageHero>

      <Container>
        {chapters.map((service, index) => (
          <Fragment key={service.slug}>
            <ServiceChapter service={service} index={index} total={services.length} />
            {index < chapters.length - 1 ? <LightSeam /> : null}
          </Fragment>
        ))}
        <AccessoriesBand service={accessories} />
      </Container>

      <Section aria-labelledby="facilidades-titulo">
        <Container $wide>
          <SectionHeader $align="center">
            <Eyebrow>{conveniences.eyebrow}</Eyebrow>
            <Title id="facilidades-titulo" text={conveniences.title} />
          </SectionHeader>
          <FactsStrip />
        </Container>
      </Section>

      <CtaBand
        id="servicos-cta"
        eyebrow={cta.eyebrow}
        title={cta.title}
        text={cta.text}
        message="repair"
        placement="servicos-final"
      />
    </>
  );
}

const HeroMedia = styled(ParallaxMedia)`
  aspect-ratio: 4 / 5;
  border-radius: ${radius.xxl};
  box-shadow:
    inset 0 0 0 1px ${color.line},
    0 50px 120px -50px rgba(${rgb.brand}, 0.4);

  ${media.down('lg')} {
    aspect-ratio: 4 / 3;
  }
`;

const Chips = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: ${space[2]};
  margin: 0;
  padding: 0;
  list-style: none;
`;

const Chip = styled(JumpLink)`
  display: inline-flex;
  align-items: center;
  min-height: 2.5rem;
  padding-inline: ${space[4]};
  border-radius: ${radius.pill};
  font-size: ${font.size.small};
  font-weight: ${font.weight.medium};
  color: ${color.textMuted};
  background: rgba(${rgb.white}, 0.03);
  box-shadow: inset 0 0 0 1px ${color.line};
  transition:
    color 0.3s,
    box-shadow 0.3s,
    background-color 0.3s;

  &:hover {
    color: ${color.text};
    background: ${color.brandTint};
    box-shadow: inset 0 0 0 1px rgba(${rgb.brand}, 0.45);
  }

  &:active {
    transform: scale(0.97);
    transition-timing-function: ${motion.css.out};
  }
`;

const Title = styled(TextReveal)`
  font-size: ${font.size.h2};
  line-height: ${font.leading.snug};
  letter-spacing: ${font.tracking.tight};
`;
