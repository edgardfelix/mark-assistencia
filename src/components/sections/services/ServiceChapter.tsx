import { Check, Headphones } from 'lucide-react';
import styled, { css } from 'styled-components';
import { WhatsAppButton } from '@/components/common/ContactActions';
import { ParallaxMedia } from '@/components/motion/Parallax';
import { Reveal } from '@/components/motion/Reveal';
import { ButtonLink } from '@/components/ui/Button';
import { ResponsiveImage } from '@/components/ui/ResponsiveImage';
import { H2, Body } from '@/components/ui/Typography';
import { servicesContent } from '@/content/pages';
import { getShot } from '@/data/feedback';
import { type Service } from '@/data/services';
import { paths } from '@/routes/paths';
import { media } from '@/theme/media';
import { color, font, layout, radius, rgb, space } from '@/theme/tokens';
import { QuoteCard, ShotFigure } from '../shared/Feedback';

interface ServiceChapterProps {
  service: Service;
  index: number;
  total: number;
}

const counter = (n: number) => String(n).padStart(2, '0');

/** One service as an editorial chapter; sides alternate down the page. */
export function ServiceChapter({ service, index, total }: ServiceChapterProps) {
  const reversed = index % 2 === 1;
  const titleId = `${service.slug}-titulo`;

  return (
    <Chapter id={service.slug} tabIndex={-1} aria-labelledby={titleId} $reversed={reversed}>
      <MediaColumn>
        {service.image ? (
          <Reveal kind="scale">
            <Main>
              <ResponsiveImage id={service.image.id} alt={service.image.alt} sizes="(min-width: 1024px) 520px, 92vw" />
            </Main>
            {service.image.caption ? <Caption>{service.image.caption}</Caption> : null}
          </Reveal>
        ) : null}
        {service.inset ? (
          <Inset kind="rise" delay={0.2} $reversed={reversed}>
            <ResponsiveImage id={service.inset.id} alt={service.inset.alt} sizes="220px" />
          </Inset>
        ) : null}
      </MediaColumn>

      <Copy>
        <Counter aria-hidden="true">
          {counter(index + 1)} <span>/ {counter(total)}</span>
        </Counter>
        <H2 id={titleId}>{service.title}</H2>
        <Body>{service.description}</Body>
        <Points>
          <h3>{service.points.title}</h3>
          <ul>
            {service.points.items.map((item) => (
              <li key={item}>
                <Check size={16} aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </Points>
        {service.proof ? (
          <Proof>
            <ProofLabel>{servicesContent.proofLabel}</ProofLabel>
            {'quote' in service.proof ? (
              <QuoteCard quote={service.proof.quote} />
            ) : (
              <ProofShot>
                <ShotFigure shot={getShot(service.proof.shotId)} sizes="200px" showCaption={false} />
                <p>{service.proof.caption}</p>
              </ProofShot>
            )}
          </Proof>
        ) : null}
        <WhatsAppButton message={service.whatsapp} placement={`servicos-${service.slug}`} variant="secondary" size="md">
          {service.ctaLabel}
        </WhatsAppButton>
      </Copy>
    </Chapter>
  );
}

/** Accessories have no photography: a compact typographic band instead of a fake image. */
export function AccessoriesBand({ service }: { service: Service }) {
  return (
    <Band id={service.slug} tabIndex={-1} aria-labelledby={`${service.slug}-titulo`}>
      <BandIcon aria-hidden="true">
        <Headphones size={34} />
      </BandIcon>
      <div>
        <H2 id={`${service.slug}-titulo`}>{service.title}</H2>
        <Body>{service.description}</Body>
      </div>
      <div>
        <ButtonLink to={paths.products} variant="secondary" size="md">
          {servicesContent.accessoriesProducts}
        </ButtonLink>
        <WhatsAppButton message={service.whatsapp} placement={`servicos-${service.slug}`} variant="tertiary" size="md">
          {service.ctaLabel}
        </WhatsAppButton>
      </div>
    </Band>
  );
}

const anchorTarget = css`
  scroll-margin-top: calc(${layout.headerHeight} + ${space[8]});

  &:focus {
    outline: none;
  }
`;

const Chapter = styled.article<{ $reversed: boolean }>`
  ${anchorTarget}
  display: grid;
  gap: clamp(2.5rem, 1.5rem + 4vw, 5.5rem);
  align-items: center;
  padding-block: clamp(3.5rem, 2.5rem + 4vw, 6.5rem);

  ${media.up('lg')} {
    grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);

    ${({ $reversed }) =>
      $reversed &&
      css`
        grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);

        & > :first-child {
          order: 2;
        }
      `}
  }
`;

const MediaColumn = styled.div`
  position: relative;
  padding-bottom: ${space[10]};
`;

const Main = styled(ParallaxMedia)`
  aspect-ratio: 4 / 5;
  border-radius: ${radius.xxl};
  box-shadow:
    inset 0 0 0 1px ${color.line},
    0 50px 100px -50px rgba(0, 0, 0, 0.95);

  ${media.up('md')} {
    aspect-ratio: 5 / 6;
  }
`;

const Caption = styled.p`
  margin-top: ${space[3]};
  font-size: ${font.size.caption};
  color: ${color.textSubtle};
`;

const Inset = styled(Reveal)<{ $reversed: boolean }>`
  position: absolute;
  bottom: 0;
  ${({ $reversed }) => ($reversed ? 'left: -4%;' : 'right: -4%;')}
  width: clamp(8.5rem, 30%, 13.5rem);
  aspect-ratio: 3 / 4;
  border-radius: ${radius.lg};
  overflow: hidden;
  rotate: ${({ $reversed }) => ($reversed ? '-3deg' : '3deg')};
  box-shadow:
    0 0 0 6px ${color.ink900},
    0 0 0 7px ${color.lineStrong},
    0 30px 60px -20px rgba(0, 0, 0, 0.95);

  picture {
    width: 100%;
    height: 100%;
  }

  /* Single-column layouts: no bleed past the column (it would overflow the viewport). */
  ${media.down('lg')} {
    right: 0;
    left: auto;
  }
`;

const Copy = styled.div`
  display: grid;
  gap: ${space[5]};
  justify-items: start;
  align-content: center;
`;

const Counter = styled.p`
  font-size: ${font.size.caption};
  font-weight: ${font.weight.semibold};
  letter-spacing: ${font.tracking.wide};
  font-variant-numeric: tabular-nums;
  color: ${color.brand};

  span {
    color: ${color.textSubtle};
  }
`;

const Points = styled.div`
  display: grid;
  gap: ${space[3]};
  width: 100%;

  h3 {
    font-size: ${font.size.eyebrow};
    font-weight: ${font.weight.semibold};
    letter-spacing: ${font.tracking.eyebrow};
    text-transform: uppercase;
    color: ${color.textSubtle};
  }

  ul {
    display: grid;
    gap: ${space[2]};
    margin: 0;
    padding: 0;
    list-style: none;
  }

  li {
    display: flex;
    align-items: center;
    gap: ${space[3]};
    color: ${color.text};

    svg {
      flex-shrink: 0;
      color: ${color.brand};
    }
  }
`;

const Proof = styled.div`
  display: grid;
  gap: ${space[4]};
  width: 100%;
  padding: ${space[6]};
  border-radius: ${radius.lg};
  background: rgba(${rgb.white}, 0.025);
  box-shadow: inset 0 0 0 1px ${color.line};

  blockquote p {
    font-size: ${font.size.body};
  }

  & > figure > span {
    font-size: 3rem;
  }
`;

const ProofLabel = styled.p`
  font-size: ${font.size.eyebrow};
  font-weight: ${font.weight.semibold};
  letter-spacing: ${font.tracking.eyebrow};
  text-transform: uppercase;
  color: ${color.textSubtle};
`;

const ProofShot = styled.div`
  display: grid;
  grid-template-columns: 6.5rem minmax(0, 1fr);
  gap: ${space[5]};
  align-items: center;

  p {
    font-size: ${font.size.small};
    color: ${color.textMuted};
  }
`;

const Band = styled.section`
  ${anchorTarget}
  display: grid;
  gap: ${space[6]};
  align-items: center;
  margin-block: clamp(3rem, 2rem + 3vw, 5rem);
  padding: clamp(1.75rem, 1.2rem + 2vw, 3rem);
  border-radius: ${radius.xl};
  background: radial-gradient(70% 120% at 0% 50%, rgba(${rgb.brand}, 0.12), transparent 60%), ${color.ink850};
  box-shadow: inset 0 0 0 1px ${color.line};

  & > div {
    display: grid;
    gap: ${space[3]};
  }

  /* Actions: the catalog link first, the WhatsApp question as the quieter option. */
  & > div:last-child {
    justify-items: start;
    gap: ${space[4]};
  }

  ${media.up('lg')} {
    grid-template-columns: auto minmax(0, 1fr) auto;
    gap: ${space[10]};
  }
`;

const BandIcon = styled.span`
  display: grid;
  place-items: center;
  width: 5rem;
  height: 5rem;
  border-radius: ${radius.lg};
  color: ${color.brand};
  background: ${color.brandTint};
  box-shadow:
    inset 0 0 0 1px rgba(${rgb.brand}, 0.3),
    0 0 40px -10px rgba(${rgb.brand}, 0.5);
`;
