/**
 * Public site configuration.
 *
 * `siteUrl` is resolved at build time (see vite.config.ts): VITE_SITE_URL, or the
 * hosting platform's production URL. When it is unknown, tags that require an
 * absolute URL (canonical, og:url, og:image, sitemap) are omitted instead of
 * being filled with a guessed domain.
 */
export function normalizeSiteUrl(value: string | undefined): string {
  if (!value) return '';
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:' && url.hostname !== 'localhost') return '';
    return url.origin;
  } catch {
    return '';
  }
}

export const siteUrl = normalizeSiteUrl(import.meta.env.VITE_SITE_URL);

export const site = {
  name: 'MARK ASSISTÊNCIA',
  locale: 'pt_BR',
  language: 'pt-BR',
  themeColor: '#0a0a0b',
  ogImage: {
    path: '/og-image.jpg',
    width: 1200,
    height: 630,
    type: 'image/jpeg',
    alt: 'Logotipo da MARK ASSISTÊNCIA ao lado de uma foto da loja, com o letreiro iluminado na parede amarela.',
  },
} as const;
