import { X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { WhatsAppButton } from '@/components/common/ContactActions';
import { VisuallyHidden } from '@/components/ui/Layout';
import { PriceTag } from '@/components/ui/Price';
import { ResponsiveImage } from '@/components/ui/ResponsiveImage';
import { productsContent } from '@/content/pages';
import { productWhatsappMessage, type Product } from '@/data/products';
import { smoothScroll } from '@/lib/smooth-scroll';
import { media } from '@/theme/media';
import { color, font, motion, radius, rgb, space } from '@/theme/tokens';

const copy = productsContent.sheet;

interface ProductSheetProps {
  /** The product to show; null closes the sheet. */
  product: Product | null;
  /** Called when the visitor dismisses the sheet (close button, Escape, backdrop). */
  onClose: () => void;
}

/**
 * Product details. A bottom sheet on phones, a centered panel from 768 px.
 * Native modal <dialog>: focus trap, Escape, inert background and focus
 * restoration come from the browser. Open/closed follows `product` (the URL),
 * so the browser's Back button closes it too.
 */
export function ProductSheet({ product, onClose }: ProductSheetProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const open = product !== null;
  // Keeps the last product on screen while the sheet animates out.
  const [shown, setShown] = useState<Product | null>(product);
  if (product !== null && product !== shown) setShown(product);

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
    if (!dialog) return;
    // A click on the backdrop lands on the <dialog> element itself.
    const onBackdrop = (event: MouseEvent) => {
      if (event.target === dialog) dialog.close();
    };
    dialog.addEventListener('click', onBackdrop);
    return () => {
      dialog.removeEventListener('click', onBackdrop);
    };
  }, []);

  return (
    <Sheet
      ref={ref}
      aria-labelledby="produto-detalhe-titulo"
      onClose={() => {
        smoothScroll.start();
        // Closed by the visitor (not by a URL change): bring the URL in line.
        if (open) onClose();
      }}
    >
      {shown ? (
        <Panel data-lenis-prevent="">
          <Top>
            <Handle aria-hidden="true" />
            <Close
              type="button"
              onClick={() => {
                ref.current?.close();
              }}
            >
              <X size={20} aria-hidden="true" />
              <VisuallyHidden>{copy.close}</VisuallyHidden>
            </Close>
          </Top>
          <Layout>
            <Media>
              <ResponsiveImage
                key={shown.id}
                id={shown.image.id}
                alt={shown.image.alt}
                sizes="(min-width: 768px) 420px, calc(100vw - 2.5rem)"
              />
            </Media>
            <Info>
              <Category>{shown.category}</Category>
              <Title id="produto-detalhe-titulo">{shown.name}</Title>
              <PriceTag price={shown.price} size="lg" />
              <Description>{shown.description}</Description>
              <Note>{copy.hint}</Note>
              {/* A direct child of Info: sticky needs a tall containing block to stay in reach. */}
              <StickyCta>
                <WhatsAppButton text={productWhatsappMessage(shown)} placement={`produtos-detalhe-${shown.id}`} block>
                  {copy.cta}
                </WhatsAppButton>
              </StickyCta>
            </Info>
          </Layout>
        </Panel>
      ) : null}
    </Sheet>
  );
}

const Sheet = styled.dialog`
  width: 100%;
  max-width: 100%;
  max-height: min(92svh, 100%);
  margin: auto 0 0;
  padding: 0;
  border: 0;
  border-radius: ${radius.xxl} ${radius.xxl} 0 0;
  color: inherit;
  background: ${color.ink850};
  box-shadow:
    inset 0 1px 0 rgba(${rgb.white}, 0.08),
    0 -30px 80px -20px rgba(0, 0, 0, 0.9);
  overflow: hidden;
  transform: translateY(100%);
  transition:
    transform 0.55s ${motion.css.out},
    overlay 0.55s allow-discrete,
    display 0.55s allow-discrete;

  /* Open: a column whose body scrolls inside the height limit. */
  &[open] {
    display: flex;
    flex-direction: column;
    transform: none;
  }

  @starting-style {
    &[open] {
      transform: translateY(100%);
    }
  }

  &::backdrop {
    background: rgba(${rgb.ink}, 0.72);
    opacity: 0;
    transition:
      opacity 0.4s ${motion.css.out},
      overlay 0.55s allow-discrete,
      display 0.55s allow-discrete;
  }

  &[open]::backdrop {
    opacity: 1;
  }

  @starting-style {
    &[open]::backdrop {
      opacity: 0;
    }
  }

  /* From tablets: a centered panel that rises a little and fades in. */
  ${media.up('md')} {
    width: min(100% - 3rem, 58rem);
    max-height: calc(100% - 3rem);
    margin: auto;
    border-radius: ${radius.xxl};
    box-shadow:
      inset 0 0 0 1px ${color.lineStrong},
      0 60px 140px -40px rgba(0, 0, 0, 0.95);
    opacity: 0;
    transform: translateY(18px) scale(0.98);
    transition:
      opacity 0.35s ${motion.css.out},
      transform 0.5s ${motion.css.out},
      overlay 0.5s allow-discrete,
      display 0.5s allow-discrete;

    &[open] {
      opacity: 1;
      transform: none;
    }

    @starting-style {
      &[open] {
        opacity: 0;
        transform: translateY(18px) scale(0.98);
      }
    }
  }
`;

const Panel = styled.div`
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
  overscroll-behavior: contain;
  padding-bottom: max(${space[6]}, env(safe-area-inset-bottom));
`;

/* Stays visible while the details scroll: the way out is always one tap away. */
const Top = styled.div`
  position: sticky;
  top: 0;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  min-height: 3.5rem;
  padding: ${space[2]} ${space[3]} 0;
  background: linear-gradient(${color.ink850} 70%, rgba(14, 14, 16, 0));
`;

const Handle = styled.span`
  position: absolute;
  top: ${space[3]};
  left: 50%;
  width: 2.5rem;
  height: 4px;
  margin-left: -1.25rem;
  border-radius: 999px;
  background: ${color.lineStrong};

  ${media.up('md')} {
    display: none;
  }
`;

const Close = styled.button`
  display: grid;
  place-items: center;
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 50%;
  color: ${color.text};
  background: rgba(${rgb.white}, 0.06);
  box-shadow: inset 0 0 0 1px ${color.lineStrong};
  transition:
    background-color 0.3s,
    box-shadow 0.3s;

  ${media.finePointer} {
    &:hover {
      background: rgba(${rgb.white}, 0.1);
      box-shadow: inset 0 0 0 1px rgba(${rgb.brand}, 0.5);
    }
  }
`;

const Layout = styled.div`
  display: grid;
  gap: ${space[6]};
  padding: 0 ${space[5]};

  ${media.up('md')} {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    align-items: start;
    gap: ${space[8]};
    padding: 0 ${space[8]} ${space[2]};
  }
`;

/*
 * Square photo, capped by the screen height so the name and the price always
 * sit above the pinned WhatsApp button, even on short phones (vh as fallback).
 */
const Media = styled.div`
  aspect-ratio: 1 / 1;
  width: min(100%, 26rem, 36vh);
  width: min(100%, 26rem, 36svh);
  justify-self: center;

  ${media.up('md')} {
    width: min(100%, 26rem, 62vh);
    width: min(100%, 26rem, 62svh);
  }

  border-radius: ${radius.lg};
  overflow: hidden;
  background: #fff;
  box-shadow:
    inset 0 0 0 1px rgba(0, 0, 0, 0.06),
    0 30px 60px -30px rgba(${rgb.brand}, 0.25);

  picture {
    width: 100%;
    height: 100%;
  }
`;

const Info = styled.div`
  display: grid;
  gap: ${space[4]};
  align-content: start;
`;

const Category = styled.p`
  font-size: ${font.size.eyebrow};
  font-weight: ${font.weight.semibold};
  letter-spacing: ${font.tracking.eyebrow};
  text-transform: uppercase;
  color: ${color.brand};
`;

const Title = styled.h2`
  font-size: clamp(1.5rem, 1.3rem + 1vw, 2rem);
  font-weight: ${font.weight.bold};
  line-height: ${font.leading.snug};
  letter-spacing: ${font.tracking.tight};
`;

const Description = styled.p`
  color: ${color.textMuted};
`;

/* The WhatsApp button stays in reach while the details scroll (phones, short screens). */
const StickyCta = styled.div`
  position: sticky;
  bottom: 0;
  z-index: 1;
  margin-top: ${space[1]};
  margin-inline: calc(-1 * ${space[5]});
  padding: ${space[4]} ${space[5]} ${space[2]};
  background: linear-gradient(rgba(14, 14, 16, 0), ${color.ink850} 32%);

  /* Narrow phones: a little less padding keeps "Consultar pelo WhatsApp" on one line. */
  ${media.down('sm')} {
    a {
      padding-inline: ${space[4]};
    }
  }

  /* Two-column panel: still pinned when the panel scrolls (phones in landscape), otherwise in place. */
  ${media.up('md')} {
    margin-inline: 0;
    padding: ${space[4]} 0 ${space[2]};
  }
`;

const Note = styled.p`
  font-size: ${font.size.caption};
  color: ${color.textSubtle};
`;
