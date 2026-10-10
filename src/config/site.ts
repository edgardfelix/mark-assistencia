/**
 * Public site configuration.
 *
 * `siteUrl` is the origin of every absolute URL (canonical, og:url, og:image,
 * sitemap, structured data): the official domain, unless VITE_SITE_URL is set
 * to build a copy that lives at another address.
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

/**
 * Official domain, registered at Registro.br. www is the primary host: the bare
 * domain redirects to it (set up in the Vercel project, not in the code).
 */
export const officialSiteUrl = 'https://www.markassistencia.com.br';

export const siteUrl = normalizeSiteUrl(import.meta.env.VITE_SITE_URL) || officialSiteUrl;

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
