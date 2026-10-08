import { BadgeCheck, Clock, CreditCard, Truck } from 'lucide-react';
import { m } from 'motion/react';
import { type ReactNode } from 'react';
import styled from 'styled-components';
import { spotlightSurface } from '@/components/motion/css';
import { revealVariants, staggerVariants, viewportOnce } from '@/components/motion/variants';
import { VisuallyHidden } from '@/components/ui/Layout';
import { facts } from '@/content/common';
import { useSpotlight } from '@/hooks/useSpotlight';
import { display } from '@/lib/format';
import { media } from '@/theme/media';
import { color, font, radius, rgb, space } from '@/theme/tokens';

interface Fact {
  icon: ReactNode;
  value: string;
  label: string;
}

/** The strip sits on the fold: reveal as soon as any of it is visible. */
const revealEarly = { ...viewportOnce, amount: 0, margin: '0px' } as const;

const items: Fact[] = [
  { icon: <BadgeCheck size={20} />, ...facts.completedServices },
  { icon: <Truck size={20} />, value: facts.pickup.value, label: facts.pickup.label },
  { icon: <CreditCard size={20} />, value: facts.installments.value, label: facts.installments.label },
  { icon: <Clock size={20} />, value: display.hoursCompact, label: 'horário de atendimento' },
];

/**
 * Act 2 — Trust. The four verified facts, read in one glance.
 * `title` adds a screen-reader heading when no visible heading precedes the strip.
 */
export function FactsStrip({ title }: { title?: string }) {
  const spotlight = useSpotlight<HTMLDivElement>();
  return (
    <Panel {...spotlight}>
      {title ? <VisuallyHidden as="h2">{title}</VisuallyHidden> : null}
      <List variants={staggerVariants(0.09)} initial="hidden" whileInView="visible" viewport={revealEarly}>
        {items.map((item) => (
          <Item key={item.label} data-reveal="" variants={revealVariants.rise}>
            <Icon aria-hidden="true">{item.icon}</Icon>
            <Value>{item.value}</Value>
            <Label>{item.label}</Label>
          </Item>
        ))}
      </List>
    </Panel>
  );
}

const Panel = styled.div`
  ${spotlightSurface}
  border-radius: ${radius.xl};
  background: linear-gradient(180deg, rgba(${rgb.white}, 0.035), rgba(${rgb.white}, 0.01)), ${color.ink850};
  box-shadow:
    inset 0 0 0 1px ${color.line},
    inset 0 1px 0 rgba(${rgb.white}, 0.06),
    0 30px 80px -40px rgba(0, 0, 0, 0.9);
`;

const List = styled(m.ul)`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  margin: 0;
  padding: 0;
  list-style: none;

  ${media.up('lg')} {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
`;

const Item = styled(m.li)`
  position: relative;
  display: grid;
  gap: ${space[2]};
  align-content: start;
  padding: clamp(1.4rem, 1rem + 1.6vw, 2.25rem);

  /* Hairline dividers between cells. */
  &:nth-child(odd)::after,
  &:nth-child(-n + 2)::before {
    content: '';
    position: absolute;
    background: ${color.line};
  }

  &:nth-child(odd)::after {
    top: 18%;
    bottom: 18%;
    right: 0;
    width: 1px;
  }

  &:nth-child(-n + 2)::before {
    left: 10%;
    right: 10%;
    bottom: 0;
    height: 1px;
  }

  ${media.up('lg')} {
    &:nth-child(-n + 2)::before {
      display: none;
    }
    &:not(:last-child)::after {
      content: '';
      position: absolute;
      top: 22%;
      bottom: 22%;
      right: 0;
      width: 1px;
      background: ${color.line};
    }
  }
`;

const Icon = styled.span`
  display: inline-grid;
  place-items: center;
  width: 2.5rem;
  height: 2.5rem;
  margin-bottom: ${space[2]};
  border-radius: ${radius.md};
  color: ${color.brand};
  background: ${color.brandTint};
  box-shadow: inset 0 0 0 1px rgba(${rgb.brand}, 0.22);
`;

const Value = styled.p`
  font-size: clamp(1.85rem, 1.35rem + 2.6vw, 3.6rem);
  white-space: nowrap;
  font-weight: ${font.weight.bold};
  line-height: 1;
  letter-spacing: ${font.tracking.tighter};
  font-variant-numeric: tabular-nums;
  color: ${color.text};
`;

const Label = styled.p`
  font-size: ${font.size.small};
  color: ${color.textMuted};
`;
