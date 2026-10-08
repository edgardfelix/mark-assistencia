import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { VisuallyHidden } from '@/components/ui/Layout';
import { ResponsiveImage } from '@/components/ui/ResponsiveImage';
import { reviewsContent } from '@/content/pages';
import { type FeedbackShot } from '@/data/feedback';
import { smoothScroll } from '@/lib/smooth-scroll';
import { media } from '@/theme/media';
import { color, font, motion, radius, rgb, space } from '@/theme/tokens';
import { SourceBadge } from '../shared/Feedback';

interface LightboxProps {
  shots: readonly FeedbackShot[];
  index: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

const copy = reviewsContent.lightbox;

/**
 * Full-size view of an original screenshot. Native modal <dialog>: focus trap,
 * Escape and focus restoration come from the browser; arrows move between shots.
 */
export function Lightbox({ shots, index, onClose, onNavigate }: LightboxProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const open = index !== null;
  const shot = index !== null ? shots[index] : undefined;

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      smoothScroll.stop();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog || index === null) return;
    const step = (delta: number) => {
      onNavigate((index + delta + shots.length) % shots.length);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') step(1);
      if (event.key === 'ArrowLeft') step(-1);
    };
    // A click on the backdrop lands on the <dialog> element itself.
    const onBackdrop = (event: MouseEvent) => {
      if (event.target === dialog) dialog.close();
    };
    dialog.addEventListener('keydown', onKey);
    dialog.addEventListener('click', onBackdrop);
    return () => {
      dialog.removeEventListener('keydown', onKey);
      dialog.removeEventListener('click', onBackdrop);
    };
  }, [index, shots.length, onNavigate]);

  const step = (delta: number) => {
    if (index !== null) onNavigate((index + delta + shots.length) % shots.length);
  };

  return (
    <Dialog
      ref={ref}
      aria-labelledby="lightbox-legenda"
      onClose={() => {
        smoothScroll.start();
        onClose();
      }}
    >
      {shot && index !== null ? (
        <Panel>
          <Bar>
            <SourceBadge source={shot.source} />
            <Position aria-live="polite">{copy.position(index + 1, shots.length)}</Position>
            <IconButton type="button" onClick={onClose}>
              <X size={20} aria-hidden="true" />
              <VisuallyHidden>{copy.close}</VisuallyHidden>
            </IconButton>
          </Bar>
          <Stage>
            <ResponsiveImage
              key={shot.id}
              id={shot.id}
              alt={shot.alt}
              sizes="(min-width: 768px) 620px, 92vw"
              fit="contain"
            />
          </Stage>
          <Footer>
            <IconButton
              type="button"
              onClick={() => {
                step(-1);
              }}
            >
              <ChevronLeft size={22} aria-hidden="true" />
              <VisuallyHidden>{copy.previous}</VisuallyHidden>
            </IconButton>
            <p id="lightbox-legenda">{shot.caption}</p>
            <IconButton
              type="button"
              onClick={() => {
                step(1);
              }}
            >
              <ChevronRight size={22} aria-hidden="true" />
              <VisuallyHidden>{copy.next}</VisuallyHidden>
            </IconButton>
          </Footer>
        </Panel>
      ) : null}
    </Dialog>
  );
}

const Dialog = styled.dialog`
  width: min(100% - 2rem, 44rem);
  max-height: calc(100% - 2rem);
  margin: auto;
  padding: 0;
  border: 0;
  border-radius: ${radius.xl};
  background: ${color.ink850};
  box-shadow:
    inset 0 0 0 1px ${color.lineStrong},
    0 60px 140px -40px rgba(0, 0, 0, 0.95);
  opacity: 0;
  transform: scale(0.97);
  transition:
    opacity 0.3s ${motion.css.out},
    transform 0.45s ${motion.css.out},
    overlay 0.45s allow-discrete,
    display 0.45s allow-discrete;

  &[open] {
    opacity: 1;
    transform: none;
  }

  @starting-style {
    &[open] {
      opacity: 0;
      transform: scale(0.97);
    }
  }

  &::backdrop {
    background: rgba(${rgb.ink}, 0.78);
    backdrop-filter: blur(8px);
  }
`;

const Panel = styled.div`
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  max-height: calc(100dvh - 2rem);
`;

const Bar = styled.div`
  display: flex;
  align-items: center;
  gap: ${space[3]};
  padding: ${space[3]} ${space[3]} ${space[3]} ${space[5]};
  border-bottom: 1px solid ${color.line};
`;

const Position = styled.span`
  margin-left: auto;
  font-size: ${font.size.caption};
  color: ${color.textSubtle};
  font-variant-numeric: tabular-nums;
`;

const Stage = styled.div`
  min-height: 0;
  padding: ${space[4]};
  background: ${color.ink950};

  picture {
    height: 100%;
    max-height: calc(100dvh - 12rem);
    background: transparent !important;
  }

  img {
    max-height: calc(100dvh - 12rem);
  }
`;

const Footer = styled.div`
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: ${space[3]};
  padding: ${space[3]};
  border-top: 1px solid ${color.line};

  p {
    text-align: center;
    font-size: ${font.size.small};
    color: ${color.textMuted};
  }

  ${media.up('md')} {
    padding-inline: ${space[4]};
  }
`;

const IconButton = styled.button`
  display: inline-grid;
  place-items: center;
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 50%;
  color: ${color.text};
  box-shadow: inset 0 0 0 1px ${color.lineStrong};
  transition:
    box-shadow 0.3s,
    background-color 0.3s;

  &:hover {
    background: rgba(${rgb.white}, 0.06);
    box-shadow: inset 0 0 0 1px rgba(${rgb.brand}, 0.5);
  }
`;
