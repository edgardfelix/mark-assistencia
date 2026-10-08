import { BadgeCheck, Clock, CreditCard, Truck } from 'lucide-react';
import { m } from 'motion/react';
import { type ReactNode } from 'react';
import styled from 'styled-components';
import { revealVariants, staggerVariants, viewportOnce } from '@/components/motion/variants';
import { Container, VisuallyHidden } from '@/components/ui/Layout';
import { facts } from '@/content/common';
import { pricingContent } from '@/content/pages';
import { display } from '@/lib/format';
import { media } from '@/theme/media';
import { color, font, radius, rgb, space } from '@/theme/tokens';

interface Convenience {
  icon: ReactNode;
  text: string;
}

/** Verified facts only (src/config/business.ts), in the same words used across the site. */
const items: Convenience[] = [
  { icon: <BadgeCheck size={18} />, text: `${facts.completedServices.value} ${facts.completedServices.label}` },
  { icon: <Truck size={18} />, text: facts.pickup.short },
  { icon: <CreditCard size={18} />, text: facts.installments.short },
  { icon: <Clock size={18} />, text: `Atendimento das ${display.hours}` },
];

/** Compact reinforcement after the prices: one line on desktop, a tidy 2 × 2 on phones. */
export function ConvenienceStrip() {
  return (
    <Wrapper aria-labelledby="facilidades-titulo">
      <Container>
        <VisuallyHidden as="h2" id="facilidades-titulo">
          {pricingContent.conveniences.title}
        </VisuallyHidden>
        <Strip
          role="list"
          variants={staggerVariants(0.08)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          {items.map((item) => (
            <Item key={item.text} data-reveal="" variants={revealVariants.rise}>
              <Icon aria-hidden="true">{item.icon}</Icon>
              <span>{item.text}</span>
            </Item>
          ))}
        </Strip>
      </Container>
    </Wrapper>
  );
}

const Wrapper = styled.section`
  position: relative;
  padding-block: clamp(1rem, 0.5rem + 2vw, 2.5rem);
`;

const Strip = styled(m.ul)`
  display: grid;
  margin: 0;
  padding: ${space[2]};
  list-style: none;
  border-radius: ${radius.xl};
  background: linear-gradient(180deg, rgba(${rgb.white}, 0.03), rgba(${rgb.white}, 0.01)), ${color.ink850};
  box-shadow:
    inset 0 0 0 1px ${color.line},
    inset 0 1px 0 rgba(${rgb.white}, 0.06);

  ${media.up('sm')} {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  ${media.up('lg')} {
    /* Auto tracks share the spare width equally, so the dividers fall between items. */
    grid-template-columns: repeat(4, auto);
  }
`;

const Item = styled(m.li)`
  position: relative;
  display: flex;
  align-items: center;
  gap: ${space[3]};
  min-width: 0;
  padding: ${space[4]} clamp(0.75rem, 0.5rem + 1vw, 1.5rem);
  font-size: ${font.size.small};
  font-weight: ${font.weight.semibold};
  line-height: 1.35;
  color: ${color.text};

  /* Hairline dividers. Phones: one list, a line under each row but the last. */
  &:not(:last-child)::before {
    content: '';
    position: absolute;
    left: ${space[4]};
    right: ${space[4]};
    bottom: 0;
    height: 1px;
    background: ${color.line};
  }

  /* 2 × 2: a line between the columns and one between the rows. */
  ${media.up('sm')} {
    &:not(:last-child)::before {
      display: none;
    }

    &:nth-child(odd)::after,
    &:nth-child(-n + 2)::before {
      content: '';
      display: block;
      position: absolute;
      background: ${color.line};
    }

    &:nth-child(odd)::after {
      top: 22%;
      bottom: 22%;
      right: 0;
      width: 1px;
    }

    &:nth-child(-n + 2)::before {
      left: 8%;
      right: 8%;
      bottom: 0;
      height: 1px;
    }
  }

  ${media.up('lg')} {
    justify-content: center;
    white-space: nowrap;

    &:nth-child(-n + 2)::before {
      display: none;
    }

    &:not(:last-child)::after {
      content: '';
      position: absolute;
      top: 26%;
      bottom: 26%;
      right: 0;
      width: 1px;
      background: ${color.line};
    }
  }
`;

const Icon = styled.span`
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: ${radius.md};
  color: ${color.brand};
  background: ${color.brandTint};
  box-shadow: inset 0 0 0 1px rgba(${rgb.brand}, 0.22);
`;
