import { Phone } from 'lucide-react';
import { type ComponentProps } from 'react';
import { whatsappMessages, type WhatsappMessageKey } from '@/content/common';
import { track } from '@/lib/analytics';
import { telUrl, whatsappUrl } from '@/lib/links';
import { WhatsAppIcon } from '../ui/BrandIcons';
import { ButtonAnchor } from '../ui/Button';

type AnchorButtonProps = Omit<ComponentProps<typeof ButtonAnchor>, 'href' | 'icon'>;

interface WhatsAppButtonProps extends AnchorButtonProps {
  message?: WhatsappMessageKey;
  /** Pre-filled text from verified internal data (e.g. a price option); overrides `message`. */
  text?: string;
  /** Where the button lives, for conversion analytics. */
  placement: string;
}

/** WhatsApp CTA with a pre-filled, context-specific message. */
export function WhatsAppButton({ message = 'general', text, placement, onClick, ...rest }: WhatsAppButtonProps) {
  return (
    <ButtonAnchor
      href={whatsappUrl(text ?? whatsappMessages[message])}
      icon={<WhatsAppIcon size={19} />}
      trailing="none"
      onClick={(event) => {
        track({ name: 'whatsapp_click', placement });
        onClick?.(event);
      }}
      {...rest}
    />
  );
}

interface PhoneButtonProps extends AnchorButtonProps {
  placement: string;
}

export function PhoneButton({ placement, onClick, ...rest }: PhoneButtonProps) {
  return (
    <ButtonAnchor
      href={telUrl}
      icon={<Phone size={18} aria-hidden="true" />}
      onClick={(event) => {
        track({ name: 'phone_click', placement });
        onClick?.(event);
      }}
      {...rest}
    />
  );
}
