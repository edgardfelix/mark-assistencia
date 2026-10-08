import { m } from 'motion/react';
import styled from 'styled-components';
import { ParallaxMedia } from '@/components/motion/Parallax';
import { Reveal } from '@/components/motion/Reveal';
import { TextReveal } from '@/components/motion/TextReveal';
import { revealVariants, staggerVariants, viewportOnce } from '@/components/motion/variants';
import { CtaBand } from '@/components/sections/shared/CtaBand';
import { QuoteCard } from '@/components/sections/shared/Feedback';
import { PageHero } from '@/components/sections/shared/PageHero';
import { Container, Section, VisuallyHidden } from '@/components/ui/Layout';
import { ResponsiveImage } from '@/components/ui/ResponsiveImage';
import { Body, Eyebrow, SectionHeader } from '@/components/ui/Typography';
import { business } from '@/config/business';
import { lcpImages } from '@/config/lcp';
import { a11y } from '@/content/common';
import { companyContent } from '@/content/pages';
import { feedbackQuotes } from '@/data/feedback';
import { display } from '@/lib/format';
import { instagramUrl, mailtoUrl, telUrl } from '@/lib/links';
import { brandImages } from '@/lib/media';
import { media } from '@/theme/media';
import { color, font, radius, rgb, space } from '@/theme/tokens';

const { hero, stat, principles, workshop, identity, cta } = companyContent;

export default function CompanyPage() {
  return (
    <>
      <PageHero
        eyebrow={hero.eyebrow}
        title={hero.title}
        lead={hero.lead}
        aside={
          <HeroMedia>
            <ResponsiveImage
              id={lcpImages.company.id}
              alt={hero.imageAlt}
              sizes={lcpImages.company.sizes}
              priority
              position="50% 25%"
            />
          </HeroMedia>
        }
      />

      <Section aria-labelledby="numeros-titulo">
        <Container>
          <Stat>
            <Reveal kind="blur">
              <StatValue id="numeros-titulo">
                {stat.value}
                <span> {stat.label}</span>
              </StatValue>
            </Reveal>
            <Reveal delay={0.15}>
              <Body>{stat.text}</Body>
            </Reveal>
          </Stat>
        </Container>
      </Section>

      <Section aria-labelledby="principios-titulo" $flush="top">
        <Container>
          <SectionHeader>
            <Eyebrow>{principles.eyebrow}</Eyebrow>
            <SectionTitle id="principios-titulo" text={principles.title} />
          </SectionHeader>
          <Principles
            variants={staggerVariants(0.12)}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            role="list"
          >
            {principles.items.map((item, index) => (
              <Principle key={item.title} data-reveal="" variants={revealVariants.rise}>
                <Index aria-hidden="true">{String(index + 1).padStart(2, '0')}</Index>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
                {'quote' in item ? <Quote quote={feedbackQuotes[item.quote]} /> : null}
              </Principle>
            ))}
          </Principles>
        </Container>
      </Section>

      <Section aria-labelledby="bancada-titulo">
        <Container>
          <SectionHeader>
            <Eyebrow>{workshop.eyebrow}</Eyebrow>
            <SectionTitle id="bancada-titulo" text={workshop.title} />
            <Body>{workshop.text}</Body>
          </SectionHeader>
          <Gallery>
            <Reveal kind="scale" className="tall">
              <Shot>
                <GalleryMedia $ratio="3 / 4">
                  <ResponsiveImage
                    id="bench-iphone"
                    alt={workshop.images.bench.alt}
                    sizes="(min-width: 1024px) 520px, 92vw"
                  />
                </GalleryMedia>
              </Shot>
            </Reveal>
            <Reveal kind="scale" delay={0.1}>
              <Shot>
                <GalleryMedia $ratio="4 / 5">
                  <ResponsiveImage
                    id="bench-precision"
                    alt={workshop.images.precision.alt}
                    sizes="(min-width: 1024px) 380px, 92vw"
                  />
                </GalleryMedia>
                <figcaption>{workshop.images.precision.caption}</figcaption>
              </Shot>
            </Reveal>
            <Reveal kind="scale" delay={0.2} className="wide">
              <Shot>
                <GalleryMedia $ratio="940 / 372">
                  <ResponsiveImage
                    id="certificate"
                    alt={workshop.images.certificate.alt}
                    sizes="(min-width: 1024px) 620px, 92vw"
                  />
                </GalleryMedia>
                <figcaption>{workshop.images.certificate.caption}</figcaption>
              </Shot>
            </Reveal>
          </Gallery>
        </Container>
      </Section>

      <Section aria-labelledby="dados-titulo">
        <Container>
          <Identity>
            <Sign>
              <img
                src={brandImages.sign.src}
                srcSet={brandImages.sign.srcSet}
                sizes="(min-width: 1024px) 400px, 80vw"
                width={brandImages.sign.width}
                height={brandImages.sign.height}
                alt="Logotipo da MARK ASSISTÊNCIA com os dizeres Assistência, Reparos e Acessórios"
                loading="lazy"
                decoding="async"
              />
            </Sign>
            <div>
              <Eyebrow>{identity.eyebrow}</Eyebrow>
              <IdentityTitle id="dados-titulo">{identity.title}</IdentityTitle>
              <Data>
                <div>
                  <dt>{identity.labels.name}</dt>
                  <dd>{business.name}</dd>
                </div>
                <div>
                  <dt>{identity.labels.cnpj}</dt>
                  <dd>{display.cnpj}</dd>
                </div>
                <div className="span">
                  <dt>{identity.labels.address}</dt>
                  <dd>{display.addressFull}</dd>
                </div>
                <div>
                  <dt>{identity.labels.hours}</dt>
                  <dd>Das {display.hours}</dd>
                </div>
                <div>
                  <dt>{identity.labels.phone}</dt>
                  <dd>
                    <a href={telUrl}>{display.phone}</a>
                  </dd>
                </div>
                <div>
                  <dt>{identity.labels.email}</dt>
                  <dd>
                    <a href={mailtoUrl()}>{business.email}</a>
                  </dd>
                </div>
                <div>
                  <dt>{identity.labels.instagram}</dt>
                  <dd>
                    <a href={instagramUrl} target="_blank" rel="noopener noreferrer">
                      {display.instagramHandle}
                      <VisuallyHidden> {a11y.opensInNewTab}</VisuallyHidden>
                    </a>
                  </dd>
                </div>
              </Data>
            </div>
          </Identity>
        </Container>
      </Section>

      <CtaBand
        id="empresa-cta"
        eyebrow={cta.eyebrow}
        title={cta.title}
        text={cta.text}
        message="visit"
        placement="empresa-final"
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

const Stat = styled.div`
  display: grid;
  gap: ${space[6]};
  align-items: end;

  ${media.up('lg')} {
    grid-template-columns: minmax(0, 1.2fr) minmax(0, 0.8fr);
    gap: ${space[16]};
  }
`;

const StatValue = styled.h2`
  font-size: clamp(5rem, 2.5rem + 10vw, 11rem);
  font-weight: ${font.weight.heavy};
  line-height: 0.9;
  letter-spacing: -0.05em;
  background: linear-gradient(180deg, ${color.brandHover} 10%, ${color.brand} 55%, #c9a800 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  filter: drop-shadow(0 0 40px rgba(${rgb.brand}, 0.25));

  span {
    display: block;
    margin-top: ${space[4]};
    font-size: ${font.size.h3};
    font-weight: ${font.weight.semibold};
    letter-spacing: ${font.tracking.snug};
    line-height: 1.2;
    background: none;
    -webkit-background-clip: border-box;
    background-clip: border-box;
    color: ${color.text};
  }
`;

const SectionTitle = styled(TextReveal)`
  font-size: ${font.size.h2};
  line-height: ${font.leading.snug};
  letter-spacing: ${font.tracking.tight};
  max-width: 20ch;
`;

const Principles = styled(m.ul)`
  display: grid;
  gap: ${space[10]};
  margin: 0;
  padding: 0;
  list-style: none;

  ${media.up('lg')} {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: ${space[8]};
  }
`;

const Principle = styled(m.li)`
  display: grid;
  gap: ${space[4]};
  align-content: start;
  padding-top: ${space[6]};
  border-top: 1px solid ${color.line};

  h3 {
    font-size: ${font.size.h3};
    font-weight: ${font.weight.semibold};
  }

  p {
    color: ${color.textMuted};
  }
`;

const Index = styled.span`
  font-size: ${font.size.caption};
  font-weight: ${font.weight.semibold};
  letter-spacing: ${font.tracking.wide};
  color: ${color.brand};
`;

const Quote = styled(QuoteCard)`
  margin-top: ${space[2]};
  gap: ${space[4]};

  blockquote p {
    font-size: ${font.size.small};
    color: ${color.textMuted};
  }

  & > span {
    font-size: 2.5rem;
  }
`;

const Gallery = styled.div`
  display: grid;
  gap: ${space[6]};

  ${media.up('md')} {
    grid-template-columns: minmax(0, 1.25fr) minmax(0, 1fr);
    align-items: start;

    .tall {
      grid-row: span 2;
    }
  }
`;

const Shot = styled.figure`
  display: grid;
  gap: ${space[3]};

  figcaption {
    font-size: ${font.size.caption};
    color: ${color.textSubtle};
  }
`;

const GalleryMedia = styled(ParallaxMedia)<{ $ratio: string }>`
  aspect-ratio: ${({ $ratio }) => $ratio};
  border-radius: ${radius.xl};
  box-shadow: inset 0 0 0 1px ${color.line};
`;

const Identity = styled.div`
  display: grid;
  gap: ${space[10]};
  padding: clamp(1.75rem, 1rem + 3vw, 3.5rem);
  border-radius: ${radius.xxl};
  background: radial-gradient(70% 90% at 0% 0%, rgba(${rgb.brand}, 0.08), transparent 60%), ${color.ink850};
  box-shadow: inset 0 0 0 1px ${color.line};

  & > div {
    display: grid;
    gap: ${space[4]};
    align-content: start;
  }

  ${media.up('lg')} {
    grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr);
    align-items: center;
    gap: ${space[16]};
  }
`;

const Sign = styled.div`
  display: grid;
  place-items: center;
  padding: ${space[4]};

  img {
    width: min(100%, 25rem);
    height: auto;
  }
`;

const IdentityTitle = styled.h2`
  font-size: ${font.size.h3};
  font-weight: ${font.weight.semibold};
`;

const Data = styled.dl`
  display: grid;
  gap: ${space[5]} ${space[8]};
  margin: ${space[4]} 0 0;

  ${media.up('sm')} {
    grid-template-columns: repeat(2, minmax(0, 1fr));

    .span {
      grid-column: 1 / -1;
    }
  }

  dt {
    font-size: ${font.size.eyebrow};
    font-weight: ${font.weight.semibold};
    letter-spacing: ${font.tracking.eyebrow};
    text-transform: uppercase;
    color: ${color.textSubtle};
  }

  dd {
    margin: ${space[1]} 0 0;
    color: ${color.text};
    overflow-wrap: anywhere;
  }

  a {
    text-decoration: underline;
    text-decoration-color: rgba(${rgb.brand}, 0.5);
    text-underline-offset: 4px;
  }
`;
