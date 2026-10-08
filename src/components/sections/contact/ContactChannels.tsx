import { ArrowUpRight, Clock, Mail, MapPin, Phone } from 'lucide-react';
import { type ReactNode } from 'react';
import styled, { keyframes } from 'styled-components';
import { WhatsAppButton } from '@/components/common/ContactActions';
import { selectionTransitionName } from '@/components/motion/viewTransition';
import { InstagramIcon, WhatsAppIcon } from '@/components/ui/BrandIcons';
import { ButtonLink } from '@/components/ui/Button';
import { VisuallyHidden } from '@/components/ui/Layout';
import { PriceTag } from '@/components/ui/Price';
import { business } from '@/config/business';
import { a11y, cta } from '@/content/common';
import { contactContent } from '@/content/pages';
import { pricingOptionNumber, type PricingOption } from '@/data/pricing';
import { track, type AnalyticsEvent } from '@/lib/analytics';
import { display } from '@/lib/format';
import { directionsUrl, instagramUrl, mailtoUrl, telUrl, wazeUrl } from '@/lib/links';
import { paths } from '@/routes/paths';
import { media } from '@/theme/media';
import { color, font, motion, radius, rgb, space } from '@/theme/tokens';

const copy = contactContent.channels;

/**
 * Every way to reach the shop, with WhatsApp as the primary action. With a
 * price option selected, the primary card becomes that option: same place,
 * same weight, and its WhatsApp message already names the option.
 */
export function ContactChannels({ selection }: { selection: PricingOption | null }) {
  return (
    <Wrapper aria-labelledby="canais-titulo">
      <VisuallyHidden as="h2" id="canais-titulo">
        {copy.title}
      </VisuallyHidden>

      {selection ? (
        <Selection option={selection} />
      ) : (
        <Primary>
          <IconBadge aria-hidden="true" $brand>
            <WhatsAppIcon size={22} />
          </IconBadge>
          <div>
            <Label>{copy.whatsapp.label}</Label>
            <Value>{display.phone}</Value>
            <Hint>{copy.whatsapp.hint}</Hint>
          </div>
          <WhatsAppButton message="general" placement="contato-canais" size="md">
            {cta.whatsapp}
          </WhatsAppButton>
        </Primary>
      )}

      <List>
        <Channel icon={<Phone size={19} />} label={copy.phone.label}>
          <ChannelLink href={telUrl} event={{ name: 'phone_click', placement: 'contato' }}>
            {display.phone}
          </ChannelLink>
        </Channel>
        <Channel icon={<Mail size={19} />} label={copy.email.label}>
          <ChannelLink href={mailtoUrl()} event={{ name: 'email_click', placement: 'contato' }}>
            {business.email}
          </ChannelLink>
        </Channel>
        <Channel icon={<InstagramIcon size={19} />} label={copy.instagram.label}>
          <ChannelLink href={instagramUrl} external event={{ name: 'instagram_click', placement: 'contato' }}>
            {display.instagramHandle}
          </ChannelLink>
        </Channel>
        <Channel icon={<MapPin size={19} />} label={copy.address.label}>
          <Text>
            {display.addressLine1}
            <br />
            {display.addressLine2}
          </Text>
          <Routes>
            <ChannelLink
              href={directionsUrl}
              external
              event={{ name: 'directions_click', placement: 'contato', provider: 'google-maps' }}
            >
              {cta.googleMaps}
            </ChannelLink>
            <ChannelLink
              href={wazeUrl}
              external
              event={{ name: 'directions_click', placement: 'contato', provider: 'waze' }}
            >
              {cta.waze}
            </ChannelLink>
          </Routes>
        </Channel>
        <Channel icon={<Clock size={19} />} label={copy.hours.label}>
          <Text>{copy.hours.value}</Text>
        </Channel>
      </List>
    </Wrapper>
  );
}

/** The option chosen on the prices page: what it is, its reference price and the next step. */
function Selection({ option }: { option: PricingOption }) {
  const text = contactContent.selection;
  return (
    <SelectedCard>
      <IconBadge aria-hidden="true" $brand>
        <b>{pricingOptionNumber(option)}</b>
      </IconBadge>
      <div>
        <Label>{text.label}</Label>
        <Value as="h3" id="selecao-titulo">
          {option.name}
        </Value>
        <SelectedPrice>
          <PriceTag price={option.price} size="lg" />
        </SelectedPrice>
        <Hint>{text.note}</Hint>
      </div>
      <SelectionActions>
        <WhatsAppButton text={option.message} placement="contato-selecao" size="md">
          {text.action}
        </WhatsAppButton>
        <ButtonLink to={paths.pricing} variant="tertiary" size="md">
          {text.change}
        </ButtonLink>
      </SelectionActions>
    </SelectedCard>
  );
}

function Channel({ icon, label, children }: { icon: ReactNode; label: string; children: ReactNode }) {
  return (
    <Row>
      <IconBadge aria-hidden="true">{icon}</IconBadge>
      <div>
        <Label>{label}</Label>
        {children}
      </div>
    </Row>
  );
}

function ChannelLink({
  href,
  external = false,
  event,
  children,
}: {
  href: string;
  external?: boolean;
  event: AnalyticsEvent;
  children: ReactNode;
}) {
  return (
    <Anchor
      href={href}
      onClick={() => {
        track(event);
      }}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {children}
      {external ? (
        <>
          <ArrowUpRight size={15} aria-hidden="true" />
          <VisuallyHidden> {a11y.opensInNewTab}</VisuallyHidden>
        </>
      ) : null}
    </Anchor>
  );
}

const Wrapper = styled.section`
  display: grid;
  gap: ${space[5]};
  align-content: start;
`;

const Primary = styled.div`
  display: grid;
  gap: ${space[5]};
  padding: clamp(1.5rem, 1rem + 2vw, 2.25rem);
  border-radius: ${radius.xl};
  background: radial-gradient(90% 120% at 100% 0%, rgba(${rgb.brand}, 0.16), transparent 60%), ${color.ink850};
  box-shadow:
    inset 0 0 0 1px rgba(${rgb.brand}, 0.28),
    0 40px 90px -50px rgba(${rgb.brand}, 0.45);

  ${media.up('sm')} {
    grid-template-columns: auto minmax(0, 1fr);
    align-items: center;

    & > a {
      grid-column: 1 / -1;
      justify-self: start;
    }
  }
`;

const selectionIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: none; }
`;

/* Same frame as the WhatsApp card it stands in for; the target of the price-module morph. */
const SelectedCard = styled(Primary)`
  view-transition-name: ${selectionTransitionName};
  animation: ${selectionIn} 0.6s ${motion.css.out} both;

  /* While the browser morphs the price module into this card, a second entrance would fight it. */
  html:active-view-transition & {
    animation: none;
  }

  /* The option number sits level with the "Serviço selecionado" label, not mid-card. */
  & > span:first-child {
    align-self: start;
  }

  b {
    font-size: ${font.size.small};
    font-weight: ${font.weight.bold};
    font-variant-numeric: tabular-nums;
  }
`;

const SelectedPrice = styled.div`
  margin-block: ${space[3]} ${space[1]};
`;

const SelectionActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${space[3]} ${space[6]};

  ${media.up('sm')} {
    grid-column: 1 / -1;
  }
`;

const List = styled.ul`
  display: grid;
  margin: 0;
  padding: 0;
  list-style: none;
  border-radius: ${radius.xl};
  background: ${color.ink850};
  box-shadow: inset 0 0 0 1px ${color.line};
`;

const Row = styled.li`
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: ${space[4]};
  align-items: start;
  padding: ${space[5]} ${space[6]};

  & + & {
    border-top: 1px solid ${color.line};
  }
`;

const IconBadge = styled.span<{ $brand?: boolean }>`
  display: grid;
  place-items: center;
  width: 2.75rem;
  height: 2.75rem;
  border-radius: ${radius.md};
  color: ${({ $brand }) => ($brand ? color.onBrand : color.brand)};
  background: ${({ $brand }) => ($brand ? color.brand : color.brandTint)};
  box-shadow: inset 0 0 0 1px rgba(${rgb.brand}, 0.25);
`;

const Label = styled.p`
  font-size: ${font.size.eyebrow};
  font-weight: ${font.weight.semibold};
  letter-spacing: ${font.tracking.eyebrow};
  text-transform: uppercase;
  color: ${color.textSubtle};
`;

const Value = styled.p`
  margin-top: ${space[1]};
  font-size: ${font.size.h3};
  font-weight: ${font.weight.semibold};
  letter-spacing: ${font.tracking.snug};
`;

const Hint = styled.p`
  margin-top: ${space[1]};
  font-size: ${font.size.small};
  color: ${color.textMuted};
`;

const Text = styled.p`
  margin-top: ${space[1]};
  color: ${color.text};
`;

const Anchor = styled.a`
  display: inline-flex;
  align-items: center;
  gap: ${space[1]};
  min-height: 2rem;
  margin-top: ${space[1]};
  color: ${color.text};
  overflow-wrap: anywhere;
  text-decoration: underline;
  text-decoration-color: rgba(${rgb.brand}, 0.45);
  text-underline-offset: 4px;
  transition:
    color 0.3s,
    text-decoration-color 0.3s;

  svg {
    color: ${color.textSubtle};
    transition: transform 0.4s ${motion.css.out};
  }

  &:hover {
    color: ${color.brand};
    text-decoration-color: ${color.brand};
  }

  &:hover svg {
    transform: translate(2px, -2px);
  }
`;

const Routes = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${space[5]};
`;
