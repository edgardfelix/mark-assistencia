import { describe, expect, it, vi } from 'vitest';
import { pageSeo } from '@/config/seo';
import { normalizeSiteUrl, officialSiteUrl } from '@/config/site';
import { prerenderPaths } from '@/routes/routes';
import { buildHeadTags, serializeHeadTags } from './head';
import { localBusinessJsonLd, pageJsonLd, serializeJsonLd } from './structured-data';

const SITE = 'https://www.exemplo.com.br';

describe('page metadata', () => {
  const pages = Object.values(pageSeo);

  it('keeps titles and descriptions within search-result limits', () => {
    for (const page of pages) {
      expect(page.title.length, page.title).toBeLessThanOrEqual(60);
      expect(page.description.length, page.description).toBeGreaterThanOrEqual(50);
      expect(page.description.length, page.description).toBeLessThanOrEqual(160);
    }
  });

  it('has unique titles, descriptions and paths', () => {
    expect(new Set(pages.map((p) => p.title)).size).toBe(pages.length);
    expect(new Set(pages.map((p) => p.description)).size).toBe(pages.length);
    expect(new Set(pages.map((p) => p.path)).size).toBe(pages.length);
  });

  it('prerenders every indexable page and keeps the 404 out of the index', () => {
    const indexable = pages.filter((p) => !('noindex' in p)).map((p) => p.path);
    expect([...prerenderPaths].sort()).toEqual(indexable.sort());
    expect(pageSeo.notFound.noindex).toBe(true);
  });
});

describe('site URL', () => {
  it('accepts only https origins (or localhost)', () => {
    expect(normalizeSiteUrl('https://www.exemplo.com.br/qualquer/')).toBe(SITE);
    expect(normalizeSiteUrl('http://www.exemplo.com.br')).toBe('');
    expect(normalizeSiteUrl('javascript:alert(1)')).toBe('');
    expect(normalizeSiteUrl(undefined)).toBe('');
  });

  it('uses the official domain unless VITE_SITE_URL points a copy elsewhere', async () => {
    expect(normalizeSiteUrl(officialSiteUrl)).toBe(officialSiteUrl);
    try {
      vi.stubEnv('VITE_SITE_URL', '');
      vi.resetModules();
      expect((await import('@/config/site')).siteUrl).toBe(officialSiteUrl);
      vi.stubEnv('VITE_SITE_URL', 'https://copia.exemplo.com.br/');
      vi.resetModules();
      expect((await import('@/config/site')).siteUrl).toBe('https://copia.exemplo.com.br');
    } finally {
      vi.unstubAllEnvs();
      vi.resetModules();
    }
  });
});

describe('head tags', () => {
  it('emits canonical and Open Graph URLs only when the origin is known', () => {
    const withUrl = serializeHeadTags(buildHeadTags(pageSeo.services, SITE));
    expect(withUrl).toContain(`<link data-head rel="canonical" href="${SITE}/servicos">`);
    expect(withUrl).toContain(`content="${SITE}/og-image.jpg"`);

    const withoutUrl = serializeHeadTags(buildHeadTags(pageSeo.services, ''));
    expect(withoutUrl).not.toContain('canonical');
    expect(withoutUrl).not.toContain('og:image"');
  });

  it('marks the 404 page as noindex without a canonical', () => {
    const html = serializeHeadTags(buildHeadTags(pageSeo.notFound, SITE));
    expect(html).toContain('content="noindex, follow"');
    expect(html).not.toContain('canonical');
  });

  it('escapes attribute values', () => {
    const html = serializeHeadTags(buildHeadTags({ path: '/x', title: 'A "B" <C>', description: 'D & E' }, ''));
    expect(html).toContain('<title>A &quot;B&quot; &lt;C&gt;</title>');
    expect(html).toContain('content="D &amp; E"');
  });
});

describe('structured data', () => {
  it('describes the business with verified data only', () => {
    const data = localBusinessJsonLd(SITE);
    expect(data).toMatchObject({
      '@type': 'LocalBusiness',
      name: 'MARK ASSISTÊNCIA',
      telephone: '+55 11 97665-4797',
      taxID: '64.246.102/0001-74',
      address: { addressLocality: 'Osasco', addressRegion: 'SP', addressCountry: 'BR' },
    });
    // Unknown facts are omitted instead of guessed.
    for (const key of ['openingHoursSpecification', 'openingHours', 'geo', 'aggregateRating', 'priceRange', 'review']) {
      expect(data).not.toHaveProperty(key);
    }
  });

  it('places the business entity on the home and contact pages only', () => {
    const types = (path: keyof typeof pageSeo) => pageJsonLd(pageSeo[path], SITE).map((block) => block['@type']);
    expect(types('home')).toContain('LocalBusiness');
    expect(types('contact')).toContain('LocalBusiness');
    expect(types('services')).toEqual(['BreadcrumbList']);
  });

  it('cannot break out of its script element', () => {
    const html = serializeJsonLd([{ name: '</script><script>alert(1)</script>' }]);
    expect(html).not.toContain('</script><script>');
    expect(html).toContain('\\u003c/script>');
  });
});
