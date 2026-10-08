import { mailtoUrl, whatsappUrl } from '@/lib/links';
import { type ContactFormData } from './schema';

/**
 * There is no form backend. Submitting composes a message that opens in the
 * visitor's own WhatsApp or e-mail app, where they review and send it. The UI
 * says exactly that and never claims a message was delivered.
 */
export type ContactChannel = 'whatsapp' | 'email';

/**
 * What the visitor chose before reaching the form (e.g. an option on the prices
 * page). Built only from verified internal data — never from raw URL input.
 */
export interface ContactContext {
  /** Replaces the generic first line of the message. */
  opening: string;
  /** Short name used in the e-mail subject, e.g. "iPhone". */
  topic: string;
}

const DEFAULT_OPENING = 'Olá! Vim pelo site da MARK ASSISTÊNCIA.';

export function composeContactMessage(data: ContactFormData, context?: ContactContext | null): string {
  const lines = [context?.opening ?? DEFAULT_OPENING, '', `Nome: ${data.name}`];
  if (data.device) lines.push(`Aparelho: ${data.device}`);
  lines.push(`Assunto: ${data.subject}`, '', data.message);
  return lines.join('\n');
}

export function buildContactUrl(
  channel: ContactChannel,
  data: ContactFormData,
  context?: ContactContext | null,
): string {
  const message = composeContactMessage(data, context);
  if (channel === 'whatsapp') return whatsappUrl(message);
  const subject = context
    ? `Contato pelo site — ${context.topic} · ${data.subject}`
    : `Contato pelo site — ${data.subject}`;
  return mailtoUrl(subject, message);
}
