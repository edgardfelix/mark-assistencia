import { m, type Variants } from 'motion/react';
import styled, { css } from 'styled-components';
import { formatPrice, type Price } from '@/lib/price';
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery';
import { color, font, motion } from '@/theme/tokens';
import { VisuallyHidden } from './Layout';
import { priceLabelStyles } from './PriceLabel';

type PriceSize = 'display' | 'lg' | 'md' | 'inline';

interface PriceTagProps {
  price: Price;
  /** `display`: price modules · `lg`: contact selection · `md`: product cards · `inline`: running text and chips. */
  size?: PriceSize;
  /**
   * Entrance driven by an ancestor's `hidden` → `visible` variants: the amount
   * rises out of a mask while its blur clears, then one light sweep crosses the
   * numerals. It never repeats, so the value reads as a fact, not a live figure.
   */
  animated?: boolean;
  className?: string;
}

const amountVariants: Variants = {
  hidden: { y: '104%', filter: 'blur(8px)' },
  visible: { y: '0%', filter: 'blur(0px)', transition: { duration: 0.95, ease: motion.ease.out, delay: 0.18 } },
};

const sweepVariants: Variants = {
  hidden: { backgroundPosition: '100% 0%' },
  visible: { backgroundPosition: '0% 0%', transition: { duration: 1.7, ease: motion.ease.inOut, delay: 0.5 } },
};

const calmVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5, delay: 0.1 } },
};

/**
 * Typographic price: "R$" and centavos set small against dominant numerals.
 * Screen readers get the full text once ("R$ 150,00", "A partir de R$ 200,00");
 * the styled pieces are hidden from them so the value is never read in fragments.
 */
export function PriceTag({ price, size = 'display', animated = false, className }: PriceTagProps) {
  const parts = formatPrice(price);
  const reduced = usePrefersReducedMotion();

  if (size === 'inline') return <Inline className={className}>{parts.text}</Inline>;

  const entrance = animated ? (reduced ? calmVariants : amountVariants) : undefined;
  const sweep = animated && !reduced ? sweepVariants : undefined;

  return (
    <Wrapper className={className} $size={size}>
      <VisuallyHidden>{parts.text}</VisuallyHidden>
      <Visual aria-hidden="true">
        {parts.prefix ? <Prefix>{parts.prefix}</Prefix> : null}
        <Mask>
          <Amount data-reveal="" {...(entrance ? { variants: entrance } : {})}>
            <Currency>{parts.currency}</Currency>
            <Integer {...(sweep ? { variants: sweep } : {})}>{parts.integer}</Integer>
            <Cents>{parts.cents}</Cents>
          </Amount>
        </Mask>
      </Visual>
    </Wrapper>
  );
}

const sizes: Record<Exclude<PriceSize, 'inline'>, ReturnType<typeof css>> = {
  display: css`
    font-size: ${font.size.price};
  `,
  lg: css`
    font-size: clamp(2.35rem, 1.9rem + 1.6vw, 3.1rem);
  `,
  md: css`
    font-size: clamp(1.85rem, 1.6rem + 0.8vw, 2.25rem);
  `,
};

/* line-height 1: the numerals' line box must hug the glyphs (the body's 1.65 would add ~60% of air). */
const Wrapper = styled.span<{ $size: Exclude<PriceSize, 'inline'> }>`
  display: block;
  line-height: 1;
  ${({ $size }) => sizes[$size]}
`;

const Visual = styled.span`
  display: grid;
  justify-items: start;
  gap: 0.12em;
`;

const Prefix = styled.span`
  ${priceLabelStyles}
  font-size: max(0.2em, ${font.size.caption});
`;

/*
 * Clips the rising amount; the padding keeps "$" and the numerals' overshoot inside.
 * Flex (not block): no line box, so the amount is not shifted by baseline alignment.
 */
const Mask = styled.span`
  display: flex;
  overflow: clip;
  padding-block: 0.08em 0.12em;
  margin-block: -0.08em -0.12em;
`;

const Amount = styled(m.span)`
  display: inline-flex;
  align-items: flex-start;
  font-weight: ${font.weight.heavy};
  line-height: 0.92;
  letter-spacing: -0.045em;
  font-variant-numeric: lining-nums tabular-nums;
  white-space: nowrap;
`;

const Currency = styled.span`
  margin: 0.19em 0.14em 0 0;
  /* Never below 12 px, so small prices keep a legible "R$". */
  font-size: max(0.32em, 0.75rem);
  font-weight: ${font.weight.bold};
  letter-spacing: 0;
  color: ${color.brand};
`;

/* Numerals filled with a gradient whose light band crosses once (background-position). */
const Integer = styled(m.span)`
  padding-right: 0.03em;
  color: ${color.text};

  @supports ((-webkit-background-clip: text) or (background-clip: text)) {
    background-image: linear-gradient(
      100deg,
      ${color.text} 0%,
      ${color.text} 40%,
      ${color.brandHover} 50%,
      ${color.text} 60%,
      ${color.text} 100%
    );
    background-size: 300% 100%;
    background-position: 0% 0%;
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  @media (forced-colors: active) {
    background: none;
    -webkit-text-fill-color: currentColor;
  }
`;

const Cents = styled.span`
  margin: 0.17em 0 0 0.05em;
  font-size: max(0.34em, 0.75rem);
  font-weight: ${font.weight.bold};
  letter-spacing: -0.01em;
  color: ${color.textMuted};
`;

const Inline = styled.span`
  font-weight: ${font.weight.semibold};
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
`;
