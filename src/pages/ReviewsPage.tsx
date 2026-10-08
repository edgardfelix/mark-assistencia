import { Expand } from 'lucide-react';
import { m } from 'motion/react';
import { useCallback, useState } from 'react';
import styled from 'styled-components';
import { hoverLift } from '@/components/motion/css';
import { Reveal } from '@/components/motion/Reveal';
import { TextReveal } from '@/components/motion/TextReveal';
import { revealVariants, staggerVariants, viewportOnce } from '@/components/motion/variants';
import { Lightbox } from '@/components/sections/reviews/Lightbox';
import { CtaBand } from '@/components/sections/shared/CtaBand';
import { QuoteCard, ShotFigure, SourceBadge } from '@/components/sections/shared/Feedback';
import { PageHero } from '@/components/sections/shared/PageHero';
import { Container, Section, VisuallyHidden } from '@/components/ui/Layout';
import { Eyebrow, SectionHeader } from '@/components/ui/Typography';
import { reviewsContent } from '@/content/pages';
import {
  type FeedbackShot,
  type FeedbackShotId,
  type FeedbackSource,
  feedbackQuotes,
  feedbackShots,
  feedbackSourceLabel,
} from '@/data/feedback';
import { media } from '@/theme/media';
import { color, font, motion, radius, rgb, space } from '@/theme/tokens';

type Filter = 'all' | FeedbackSource;
const filters: Filter[] = ['all', 'google', 'whatsapp', 'instagram'];
const featured = [
  feedbackQuotes.serviceAndPrice,
  feedbackQuotes.transparency,
  feedbackQuotes.screenRepair,
  feedbackQuotes.instagram,
];
const { hero, featured: featuredCopy, gallery, cta } = reviewsContent;

export default function ReviewsPage() {
  const [filter, setFilter] = useState<Filter>('all');
  const [viewer, setViewer] = useState<{ list: readonly FeedbackShot[]; index: number } | null>(null);
  const visible = filter === 'all' ? feedbackShots : feedbackShots.filter((shot) => shot.source === filter);

  const openShot = (list: readonly FeedbackShot[], id: FeedbackShotId) => {
    setViewer({
      list,
      index: Math.max(
        0,
        list.findIndex((shot) => shot.id === id),
      ),
    });
  };
  const closeViewer = useCallback(() => {
    setViewer(null);
  }, []);
  const navigate = useCallback((index: number) => {
    setViewer((current) => (current ? { ...current, index } : current));
  }, []);

  return (
    <>
      <PageHero eyebrow={hero.eyebrow} title={hero.title} lead={hero.lead} />

      <Section aria-labelledby="destaques-titulo">
        <Container>
          <SectionHeader>
            <Eyebrow>{featuredCopy.eyebrow}</Eyebrow>
            <Title id="destaques-titulo" text={featuredCopy.title} />
          </SectionHeader>
          <Quotes>
            {featured.map((quote, index) => (
              <Reveal key={quote.text} delay={index * 0.08} className={index === 0 ? 'lead' : undefined}>
                <QuotePanel>
                  <QuoteCard
                    quote={quote}
                    size={index === 0 ? 'lg' : 'md'}
                    action={
                      <ViewButton
                        type="button"
                        onClick={() => {
                          openShot(feedbackShots, quote.shotId);
                        }}
                      >
                        <Expand size={15} aria-hidden="true" />
                        Ver captura original
                      </ViewButton>
                    }
                  />
                </QuotePanel>
              </Reveal>
            ))}
          </Quotes>
        </Container>
      </Section>

      <Section aria-labelledby="capturas-titulo" $flush="top">
        <Container>
          <GalleryHeader>
            <div>
              <Eyebrow>{gallery.eyebrow}</Eyebrow>
              <Title id="capturas-titulo" text={gallery.title} />
            </div>
            <Filters role="group" aria-label={gallery.filterLabel}>
              {filters.map((key) => (
                <FilterButton
                  key={key}
                  type="button"
                  aria-pressed={filter === key}
                  onClick={() => {
                    setFilter(key);
                  }}
                >
                  {key === 'all' ? gallery.all : feedbackSourceLabel[key]}
                </FilterButton>
              ))}
            </Filters>
          </GalleryHeader>
          <VisuallyHidden role="status" aria-live="polite">
            {gallery.count(visible.length)}
          </VisuallyHidden>

          <Masonry
            key={filter}
            variants={staggerVariants(0.06)}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            role="list"
          >
            {visible.map((shot) => (
              <Item key={shot.id} data-reveal="" variants={revealVariants.rise}>
                <ShotButton
                  type="button"
                  onClick={() => {
                    openShot(visible, shot.id);
                  }}
                >
                  <ShotFigure
                    shot={shot}
                    sizes="(min-width: 1024px) 360px, (min-width: 640px) 45vw, 92vw"
                    showCaption={false}
                  />
                  <Overlay aria-hidden="true">
                    <Expand size={18} />
                  </Overlay>
                  <VisuallyHidden>{`${gallery.open}: ${shot.caption}`}</VisuallyHidden>
                </ShotButton>
                <Meta>
                  <SourceBadge source={shot.source} />
                  <span>{shot.caption}</span>
                </Meta>
              </Item>
            ))}
          </Masonry>
        </Container>
      </Section>

      <CtaBand
        id="avaliacoes-cta"
        eyebrow={cta.eyebrow}
        title={cta.title}
        text={cta.text}
        message="service"
        placement="avaliacoes-final"
      />

      <Lightbox
        shots={viewer?.list ?? feedbackShots}
        index={viewer?.index ?? null}
        onClose={closeViewer}
        onNavigate={navigate}
      />
    </>
  );
}

const Title = styled(TextReveal)`
  font-size: ${font.size.h2};
  line-height: ${font.leading.snug};
  letter-spacing: ${font.tracking.tight};
  max-width: 20ch;
`;

const Quotes = styled.div`
  display: grid;
  gap: ${space[5]};

  ${media.up('md')} {
    grid-template-columns: repeat(2, minmax(0, 1fr));

    .lead {
      grid-column: 1 / -1;
    }
  }

  & > div {
    height: 100%;
  }
`;

const QuotePanel = styled.div`
  ${hoverLift}
  height: 100%;
  padding: clamp(1.5rem, 1rem + 2vw, 2.75rem);
  border-radius: ${radius.xl};
  background: ${color.ink850};
  box-shadow: inset 0 0 0 1px ${color.line};

  .lead & {
    background: radial-gradient(80% 120% at 100% 0%, rgba(${rgb.brand}, 0.12), transparent 60%), ${color.ink850};
  }
`;

const ViewButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: ${space[2]};
  min-height: 2.75rem;
  margin-left: auto;
  padding-inline: ${space[3]};
  border-radius: ${radius.pill};
  font-size: ${font.size.caption};
  font-weight: ${font.weight.semibold};
  color: ${color.textMuted};
  transition: color 0.3s;

  &:hover {
    color: ${color.brand};
  }
`;

const GalleryHeader = styled.header`
  display: grid;
  gap: ${space[6]};
  margin-bottom: ${space[10]};

  /* Title block only; the filter group keeps its own flex layout. */
  & > div:first-child {
    display: grid;
    gap: ${space[5]};
  }

  ${media.up('lg')} {
    /* max-content: an auto column would squeeze the wrapping filter row to one button per line. */
    grid-template-columns: minmax(0, 1fr) max-content;
    align-items: end;
  }
`;

const Filters = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${space[2]};
`;

const FilterButton = styled.button`
  min-height: 2.75rem;
  padding-inline: ${space[5]};
  border-radius: ${radius.pill};
  font-size: ${font.size.small};
  font-weight: ${font.weight.medium};
  color: ${color.textMuted};
  box-shadow: inset 0 0 0 1px ${color.lineStrong};
  transition:
    color 0.3s,
    background-color 0.35s ${motion.css.out},
    box-shadow 0.3s;

  &:hover {
    color: ${color.text};
  }

  &[aria-pressed='true'] {
    color: ${color.onBrand};
    background: ${color.brand};
    box-shadow: 0 0 24px -6px rgba(${rgb.brand}, 0.7);
  }
`;

const Masonry = styled(m.ul)`
  columns: 1;
  column-gap: ${space[5]};
  margin: 0;
  padding: 0;
  list-style: none;

  @media (min-width: 640px) {
    columns: 2;
  }

  ${media.up('lg')} {
    columns: 3;
  }
`;

const Item = styled(m.li)`
  display: grid;
  gap: ${space[3]};
  margin-bottom: ${space[8]};
  break-inside: avoid;
`;

const Overlay = styled.span`
  position: absolute;
  top: ${space[3]};
  right: ${space[3]};
  display: grid;
  place-items: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  color: ${color.onBrand};
  background: ${color.brand};
  opacity: 0;
  transform: scale(0.85);
  transition:
    opacity 0.3s,
    transform 0.4s ${motion.css.out};
`;

const ShotButton = styled.button`
  position: relative;
  display: block;
  width: 100%;
  border-radius: ${radius.lg};
  text-align: left;

  figure > div {
    transition: box-shadow 0.4s ${motion.css.out};
  }

  img {
    transition: transform 0.9s ${motion.css.out};
  }

  ${media.finePointer} {
    &:hover figure > div {
      box-shadow:
        inset 0 0 0 1px rgba(${rgb.brand}, 0.55),
        0 30px 70px -30px rgba(0, 0, 0, 0.95);
    }
    &:hover img {
      transform: scale(1.02);
    }
    &:hover ${Overlay} {
      opacity: 1;
      transform: none;
    }
  }
`;

const Meta = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${space[2]} ${space[3]};
  font-size: ${font.size.caption};
  color: ${color.textSubtle};
`;
