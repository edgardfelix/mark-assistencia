import { business } from '@/config/business';
import { display } from '@/lib/format';

/**
 * Every outbound URL is built here from verified constants. `assertSafeExternalUrl`
 * is the gate used by link components: only https URLs on known hosts pass, so a
 * future content edit can never introduce `javascript:` or an open redirect.
 */
export const ALLOWED_EXTERNAL_HOSTS = ['wa.me', 'www.instagram.com', 'www.google.com', 'waze.com'] as const;

export function isSafeExternalUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && (ALLOWED_EXTERNAL_HOSTS as readonly string[]).includes(url.hostname);
  } catch {
    return false;
  }
}

export function isSafeContactUri(value: string): boolean {
  return /^tel:\+\d{12,13}$/.test(value) || /^mailto:[^\s@]+@[^\s@]+\.[^\s@]+(\?.*)?$/.test(value);
}

/** wa.me deep link with an optional pre-filled message. */
export function whatsappUrl(message?: string): string {
  const base = `https://wa.me/${business.phone.e164}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export const telUrl = `tel:+${business.phone.e164}`;

export function mailtoUrl(subject?: string, body?: string): string {
  const params = new URLSearchParams();
  if (subject) params.set('subject', subject);
  if (body) params.set('body', body);
  // URLSearchParams encodes spaces as "+", which mail clients render literally.
  const query = params.toString().replace(/\+/g, '%20');
  return `mailto:${business.email}${query ? `?${query}` : ''}`;
}

const mapsQuery = encodeURIComponent(display.addressFull);

export const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`;
export const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${mapsQuery}`;
export const wazeUrl = `https://waze.com/ul?q=${mapsQuery}&navigate=yes`;
export const instagramUrl = business.instagram.url;
