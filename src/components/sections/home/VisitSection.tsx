import { Clock, MapPin, Navigation } from 'lucide-react';
import styled from 'styled-components';
import { PhoneButton } from '@/components/common/ContactActions';
import { ParallaxMedia } from '@/components/motion/Parallax';
import { Reveal } from '@/components/motion/Reveal';
import { TextReveal } from '@/components/motion/TextReveal';
import { ButtonAnchor, ButtonLink } from '@/components/ui/Button';
import { Container, Section } from '@/components/ui/Layout';
import { ResponsiveImage } from '@/components/ui/ResponsiveImage';
import { Eyebrow } from '@/components/ui/Typography';
import { cta } from '@/content/common';
import { homeContent } from '@/content/home';
import { track } from '@/lib/analytics';
import { display } from '@/lib/format';
import { directionsUrl, wazeUrl } from '@/lib/links';
import { paths } from '@/routes/paths';
import { media } from '@/theme/media';
import { color, font, radius, rgb, space } from '@/theme/tokens';

const content = homeContent.visit;

/** Local presence: where the shop is and when it is open. */
export function VisitSection() {
  return (
    <Section aria-labelledby="visite-titulo">
      <Container>
        <Grid>
          <Reveal kind="scale">
            <Figure>
              <Media>
                <ResponsiveImage
                  id="store-interior"
                  alt={content.imageAlt}
                  sizes="(min-width: 1024px) 560px, 100vw"
                  position="50% 20%"
                />
              </Media>
              <figcaption>{content.imageCaption}</figcaption>
            </Figure>
          </Reveal>

          <Copy>
            <Eyebrow>{content.eyebrow}</Eyebrow>
            <Title id="visite-titulo" text={content.title} />
            <Reveal delay={0.12}>
              <Details>
                <div>
                  <dt>
                    <MapPin size={18} aria-hidden="true" />
                    Endereço
                  </dt>
                  <dd>
                    {display.addressLine1}
                    <br />
                    {display.addressLine2}
                  </dd>
                </div>
                <div>
                  <dt>
                    <Clock size={18} aria-hidden="true" />
                    Horário
                  </dt>
                  <dd>Atendimento das {display.hours}</dd>
                </div>
              </Details>
            </Reveal>
            <Reveal delay={0.2}>
              <Actions>
                <ButtonAnchor
                  href={directionsUrl}
                  size="md"
                  icon={<Navigation size={17} aria-hidden="true" />}
                  onClick={() => {
                    track({ name: 'directions_click', placement: 'home-visit', provider: 'google-maps' });
                  }}
                >
                  {cta.directions}
                </ButtonAnchor>
                <ButtonAnchor
                  href={wazeUrl}
                  size="md"
                  variant="secondary"
                  onClick={() => {
                    track({ name: 'directions_click', placement: 'home-visit', provider: 'waze' });
                  }}
                >
                  {cta.waze}
                </ButtonAnchor>
                <PhoneButton placement="home-visit" size="md" variant="secondary">
                  {cta.call}
                </PhoneButton>
              </Actions>
            </Reveal>
            <ButtonLink to={paths.company} variant="tertiary" size="md">
              {cta.meetMark}
            </ButtonLink>
          </Copy>
        </Grid>
      </Container>
    </Section>
  );
}

const Grid = styled.div`
  display: grid;
  gap: clamp(2.5rem, 1.5rem + 4vw, 5rem);

  ${media.up('lg')} {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    align-items: center;
  }
`;

const Figure = styled.figure`
  display: grid;
  gap: ${space[3]};

  figcaption {
    font-size: ${font.size.caption};
    color: ${color.textSubtle};
  }
`;

const Media = styled(ParallaxMedia)`
  aspect-ratio: 4 / 3;
  border-radius: ${radius.xxl};
  box-shadow:
    inset 0 0 0 1px ${color.line},
    0 50px 100px -50px rgba(${rgb.brand}, 0.35);

  ${media.up('lg')} {
    aspect-ratio: 5 / 6;
  }
`;

const Copy = styled.div`
  display: grid;
  gap: ${space[6]};
  justify-items: start;
`;

const Title = styled(TextReveal)`
  font-size: ${font.size.h2};
  line-height: ${font.leading.snug};
  letter-spacing: ${font.tracking.tight};
`;

const Details = styled.dl`
  display: grid;
  gap: ${space[5]};
  margin: 0;

  dt {
    display: inline-flex;
    align-items: center;
    gap: ${space[2]};
    font-size: ${font.size.eyebrow};
    font-weight: ${font.weight.semibold};
    letter-spacing: ${font.tracking.eyebrow};
    text-transform: uppercase;
    color: ${color.textSubtle};

    svg {
      color: ${color.brand};
    }
  }

  dd {
    margin: ${space[2]} 0 0;
    font-size: ${font.size.lead};
    color: ${color.text};
  }
`;

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${space[3]};
`;
