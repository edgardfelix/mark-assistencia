import { Plus } from 'lucide-react';
import { m } from 'motion/react';
import styled from 'styled-components';
import { WhatsAppButton } from '@/components/common/ContactActions';
import { spotlightSurface } from '@/components/motion/css';
import { revealVariants } from '@/components/motion/variants';
import { VisuallyHidden } from '@/components/ui/Layout';
import { PriceTag } from '@/components/ui/Price';
import { ResponsiveImage } from '@/components/ui/ResponsiveImage';
import { productsContent } from '@/content/pages';
import { productWhatsappMessage, type Product } from '@/data/products';
import { useSpotlight } from '@/hooks/useSpotlight';
import { media } from '@/theme/media';
import { color, font, motion, radius, rgb, space } from '@/theme/tokens';

const copy = productsContent.card;

/** Rendered width of the photo: 1 column on phones, 2 on tablets, 3 from 1024 px (container capped at 1240 px). */
const imageSizes =
  '(min-width: 1280px) 380px, (min-width: 1024px) calc((100vw - 10rem) / 3), (min-width: 600px) calc((100vw - 8rem) / 2), calc(100vw - 4.5rem)';

interface ProductCardProps {
  product: Product;
  onOpen: (product: Product) => void;
}

/**
 * One product at a glance: photo, name, a line of context, price and the
 * WhatsApp call. The whole card opens the details (a real button sits on the
 * name and stretches over the card); the WhatsApp link stays on top of it.
 */
export function ProductCard({ product, onOpen }: ProductCardProps) {
  const spotlight = useSpotlight<HTMLElement>();
  const titleId = `produto-${product.id}`;

  return (
    <Item data-reveal="" variants={revealVariants.rise}>
      <Card aria-labelledby={titleId} {...spotlight}>
        <Media>
          <ResponsiveImage id={product.image.id} alt={product.image.alt} sizes={imageSizes} />
          <Hint aria-hidden="true">
            <Plus size={18} />
          </Hint>
        </Media>
        <Content>
          <Category>{product.category}</Category>
          <Name>
            <Open
              type="button"
              aria-haspopup="dialog"
              onClick={() => {
                onOpen(product);
              }}
            >
              <span id={titleId}>{product.name}</span>
              <VisuallyHidden>{copy.details}</VisuallyHidden>
            </Open>
          </Name>
          <Summary>{product.summary}</Summary>
          <Buy>
            <PriceTag price={product.price} size="md" />
            <Cta>
              <WhatsAppButton
                text={productWhatsappMessage(product)}
                placement={`produtos-card-${product.id}`}
                size="md"
              >
                {copy.cta} <VisuallyHidden>{copy.ctaContext(product.name)}</VisuallyHidden>
              </WhatsAppButton>
            </Cta>
          </Buy>
        </Content>
      </Card>
    </Item>
  );
}

const Item = styled(m.li)`
  display: grid;
  min-width: 0;
`;

const Card = styled.article`
  ${spotlightSurface}
  display: flex;
  flex-direction: column;
  min-width: 0;
  padding: ${space[3]};
  border-radius: ${radius.xl};
  background:
    radial-gradient(120% 70% at 50% 0%, rgba(${rgb.brand}, 0.07), transparent 60%),
    linear-gradient(180deg, rgba(${rgb.white}, 0.03), rgba(${rgb.white}, 0.008)), ${color.ink850};
  box-shadow:
    inset 0 0 0 1px ${color.line},
    inset 0 1px 0 rgba(${rgb.white}, 0.07),
    0 30px 70px -40px rgba(0, 0, 0, 0.95);
  transition:
    transform 0.5s ${motion.css.out},
    box-shadow 0.5s ${motion.css.out};
  -webkit-tap-highlight-color: transparent;

  ${media.finePointer} {
    &:hover {
      transform: translateY(-4px);
      box-shadow:
        inset 0 0 0 1px rgba(${rgb.brand}, 0.28),
        inset 0 1px 0 rgba(${rgb.white}, 0.09),
        0 40px 80px -40px rgba(${rgb.brand}, 0.3),
        0 30px 70px -40px rgba(0, 0, 0, 0.95);
    }
  }

  /* Keyboard: the whole card shows the focus, not just the name. */
  &:has(button:focus-visible) {
    outline: 2px solid ${color.brand};
    outline-offset: 4px;
  }

  /* Tap/click on the card (not on the WhatsApp link): a short press in. */
  &:has(button:active) {
    transform: scale(0.985);
    transition-duration: 0.2s;
  }
`;

/* A light stage for the photos (most were shot on white); square, so nothing is ever distorted. */
const Media = styled.div`
  position: relative;
  aspect-ratio: 1 / 1;
  border-radius: ${radius.lg};
  overflow: hidden;
  background: #fff;
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.06);

  picture {
    width: 100%;
    height: 100%;
  }

  ${media.finePointer} {
    ${Card}:hover & img {
      transform: scale(1.045);
    }
  }
`;

const Hint = styled.span`
  position: absolute;
  top: ${space[3]};
  right: ${space[3]};
  display: grid;
  place-items: center;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 50%;
  color: ${color.text};
  background: rgba(${rgb.ink}, 0.72);
  box-shadow: inset 0 0 0 1px rgba(${rgb.white}, 0.16);
  transition:
    transform 0.5s ${motion.css.out},
    background-color 0.3s,
    color 0.3s;

  ${media.finePointer} {
    ${Card}:hover & {
      color: ${color.onBrand};
      background: ${color.brand};
      transform: rotate(90deg);
    }
  }
`;

const Content = styled.div`
  container-type: inline-size;
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: ${space[2]};
  padding: ${space[5]} ${space[2]} ${space[2]};
`;

const Category = styled.p`
  font-size: ${font.size.eyebrow};
  font-weight: ${font.weight.semibold};
  letter-spacing: ${font.tracking.eyebrow};
  text-transform: uppercase;
  color: ${color.brand};
`;

const Name = styled.h3`
  font-size: clamp(1.12rem, 1.04rem + 0.35vw, 1.3rem);
  font-weight: ${font.weight.semibold};
  line-height: ${font.leading.snug};
  letter-spacing: ${font.tracking.snug};
`;

/* The button's ::after covers the card, so a tap anywhere opens the details. */
const Open = styled.button`
  text-align: left;
  font-weight: inherit;
  line-height: inherit;
  letter-spacing: inherit;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    z-index: 1;
    border-radius: ${radius.xl};
  }

  &:focus-visible {
    outline: none;
  }
`;

const Summary = styled.p`
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  font-size: ${font.size.small};
  color: ${color.textMuted};
`;

const Buy = styled.div`
  display: grid;
  gap: ${space[4]};
  margin-top: auto;
  padding-top: ${space[4]};

  /* Wide cards: price and button share one row. */
  @container (min-width: 22rem) {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
`;

/* Above the card-wide button, so the WhatsApp link keeps its own click. */
const Cta = styled.div`
  position: relative;
  z-index: 2;

  @container (max-width: 21.99rem) {
    & > a {
      width: 100%;
    }
  }
`;
