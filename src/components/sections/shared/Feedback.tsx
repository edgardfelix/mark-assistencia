import { Star } from 'lucide-react';
import { type ReactNode } from 'react';
import styled, { css } from 'styled-components';
import { InstagramIcon, WhatsAppIcon } from '@/components/ui/BrandIcons';
import { VisuallyHidden } from '@/components/ui/Layout';
import { ResponsiveImage } from '@/components/ui/ResponsiveImage';
import { type FeedbackQuote, type FeedbackShot, type FeedbackSource, feedbackSourceLabel } from '@/data/feedback';
import { color, font, radius, rgb, space } from '@/theme/tokens';

/** Origin of a piece of feedback (Google / Instagram / WhatsApp). */
export function SourceBadge({ source }: { source: FeedbackSource }) {
  return (
    <Badge $source={source}>
      {source === 'google' && <Star size={13} fill="currentColor" aria-hidden="true" />}
      {source === 'instagram' && <InstagramIcon size={13} />}
      {source === 'whatsapp' && <WhatsAppIcon size={13} />}
      {feedbackSourceLabel[source]}
    </Badge>
  );
}

export function Stars({ rating }: { rating: number }) {
  return (
    <StarRow>
      {Array.from({ length: rating }, (_, i) => (
        <Star key={i} size={15} fill="currentColor" aria-hidden="true" />
      ))}
      <VisuallyHidden>{`Avaliação: ${String(rating)} de 5 estrelas`}</VisuallyHidden>
    </StarRow>
  );
}

interface QuoteCardProps {
  quote: FeedbackQuote;
  size?: 'md' | 'lg';
  action?: ReactNode;
  className?: string;
}

/** Verbatim customer quote with its origin. */
export function QuoteCard({ quote, size = 'md', action, className }: QuoteCardProps) {
  return (
    <Quote className={className} $size={size}>
      <Mark aria-hidden="true">“</Mark>
      <blockquote>
        <p>{quote.text}</p>
      </blockquote>
      <Meta>
        <SourceBadge source={quote.source} />
        {quote.rating ? <Stars rating={quote.rating} /> : null}
        {action}
      </Meta>
    </Quote>
  );
}

interface ShotFigureProps {
  shot: FeedbackShot;
  sizes: string;
  className?: string;
  /** Hide the caption when the surrounding UI already shows it. */
  showCaption?: boolean;
}

/** An original screenshot, shown whole (never cropped) on a neutral frame. */
export function ShotFigure({ shot, sizes, className, showCaption = true }: ShotFigureProps) {
  return (
    <Figure className={className}>
      <Frame>
        <ResponsiveImage id={shot.id} alt={shot.alt} sizes={sizes} fit="contain" />
      </Frame>
      {showCaption ? (
        <figcaption>
          <SourceBadge source={shot.source} />
          <span>{shot.caption}</span>
        </figcaption>
      ) : null}
    </Figure>
  );
}

const sourceColors: Record<FeedbackSource, ReturnType<typeof css>> = {
  google: css`
    color: ${color.brand};
    background: ${color.brandTint};
    box-shadow: inset 0 0 0 1px rgba(${rgb.brand}, 0.25);
  `,
  instagram: css`
    color: #f5b8d6;
    background: rgba(245, 184, 214, 0.08);
    box-shadow: inset 0 0 0 1px rgba(245, 184, 214, 0.22);
  `,
  whatsapp: css`
    color: #8fe3b0;
    background: rgba(143, 227, 176, 0.08);
    box-shadow: inset 0 0 0 1px rgba(143, 227, 176, 0.22);
  `,
};

const Badge = styled.span<{ $source: FeedbackSource }>`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  height: 1.75rem;
  padding-inline: 0.7rem;
  border-radius: ${radius.pill};
  font-size: ${font.size.caption};
  font-weight: ${font.weight.semibold};
  white-space: nowrap;
  ${({ $source }) => sourceColors[$source]}
`;

const StarRow = styled.span`
  display: inline-flex;
  gap: 2px;
  color: ${color.brand};
`;

const Quote = styled.figure<{ $size: 'md' | 'lg' }>`
  position: relative;
  display: grid;
  gap: ${space[6]};
  align-content: start;

  blockquote p {
    font-size: ${({ $size }) => ($size === 'lg' ? 'clamp(1.35rem, 1.05rem + 1.3vw, 2.1rem)' : font.size.lead)};
    font-weight: ${({ $size }) => ($size === 'lg' ? font.weight.medium : font.weight.regular)};
    line-height: ${({ $size }) => ($size === 'lg' ? 1.35 : font.leading.relaxed)};
    letter-spacing: ${({ $size }) => ($size === 'lg' ? font.tracking.snug : font.tracking.normal)};
    color: ${color.text};
  }
`;

const Mark = styled.span`
  display: block;
  height: 0.5em;
  font-size: 4.5rem;
  line-height: 1;
  font-weight: ${font.weight.heavy};
  color: ${color.brand};
  text-shadow: 0 0 30px rgba(${rgb.brand}, 0.45);
`;

const Meta = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${space[3]};
`;

const Figure = styled.figure`
  display: grid;
  gap: ${space[3]};

  figcaption {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: ${space[2]} ${space[3]};
    font-size: ${font.size.caption};
    color: ${color.textSubtle};
  }
`;

const Frame = styled.div`
  overflow: hidden;
  border-radius: ${radius.lg};
  background: ${color.ink950};
  box-shadow:
    inset 0 0 0 1px ${color.line},
    0 24px 60px -30px rgba(0, 0, 0, 0.9);

  picture {
    height: 100%;
  }
`;
