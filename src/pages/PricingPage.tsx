import styled from 'styled-components';
import { JumpLink } from '@/components/common/JumpLink';
import { ConvenienceStrip } from '@/components/sections/pricing/ConvenienceStrip';
import { PriceSystem } from '@/components/sections/pricing/PriceSystem';
import { PricingCta } from '@/components/sections/pricing/PricingCta';
import { PageHero } from '@/components/sections/shared/PageHero';
import { PriceTag } from '@/components/ui/Price';
import { pricingContent } from '@/content/pages';
import { pricingOptions } from '@/data/pricing';
import { color, font, motion, radius, rgb, space } from '@/theme/tokens';

/**
 * Prices, told in four beats: the promise (hero, with every price visible at
 * once) → the price system (choose an entry point) → conveniences → action.
 * Choosing any price leads to /contato?servico=… with that option preselected.
 */
export default function PricingPage() {
  const { hero } = pricingContent;
  return (
    <>
      <PageHero eyebrow={hero.eyebrow} title={hero.title} titleAccent={hero.titleAccent} lead={hero.lead}>
        <nav aria-label={hero.jumpLabel}>
          <Chips>
            {pricingOptions.map((option) => (
              <li key={option.id}>
                <Chip targetId={`opcao-${option.id}`}>
                  <span>{option.label}</span>
                  <PriceTag price={option.price} size="inline" />
                </Chip>
              </li>
            ))}
          </Chips>
        </nav>
      </PageHero>
      <PriceSystem />
      <ConvenienceStrip />
      <PricingCta />
    </>
  );
}

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
  gap: ${space[3]};
  min-height: 2.75rem;
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

  & > span:last-child {
    color: ${color.brand};
  }

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
