import { business } from '@/config/business';
import { pageSeo, type PageSeo } from '@/config/seo';
import { site } from '@/config/site';
import { services } from '@/data/services';
import { display } from '@/lib/format';
import { absoluteUrl } from '@/lib/seo/head';

/**
 * schema.org JSON-LD built strictly from verified data.
 * Intentionally omitted (unknown): openingHoursSpecification (days of the week
 * were not provided), geo coordinates, postal code, price range (the published
 * prices are reference values per device line, not a range for every service), ratings
 * (self-published reviews are not eligible and the aggregate is unknown).
 */
type JsonLd = Record<string, unknown>;

export function localBusinessJsonLd(siteUrl: string): JsonLd {
  const data: JsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: business.name,
    description: pageSeo.home.description,
    telephone: display.phoneInternational,
    email: business.email,
    taxID: display.cnpj,
    address: {
      '@type': 'PostalAddress',
      streetAddress: `${display.addressLine1} – ${business.address.neighborhood}`,
      addressLocality: business.address.city,
      addressRegion: business.address.state,
      addressCountry: business.address.country,
    },
    sameAs: [business.instagram.url],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Serviços',
      itemListElement: services.map((s) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: s.title, description: s.summary },
      })),
    },
  };
  if (siteUrl) {
    Object.assign(data, {
      '@id': `${siteUrl}/#negocio`,
      url: `${siteUrl}/`,
      image: `${siteUrl}${site.ogImage.path}`,
      logo: `${siteUrl}/icon-512.png`,
    });
  }
  return data;
}

export function webSiteJsonLd(siteUrl: string): JsonLd | null {
  if (!siteUrl) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: site.name,
    url: `${siteUrl}/`,
    inLanguage: site.language,
  };
}

export function breadcrumbJsonLd(seo: PageSeo, siteUrl: string): JsonLd | null {
  if (!siteUrl || !seo.breadcrumb) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Início', item: `${siteUrl}/` },
      { '@type': 'ListItem', position: 2, name: seo.breadcrumb, item: absoluteUrl(siteUrl, seo.path) },
    ],
  };
}

/** JSON-LD blocks for a page. The business entity goes on the home and contact pages. */
export function pageJsonLd(seo: PageSeo, siteUrl: string): JsonLd[] {
  const blocks: (JsonLd | null)[] = [];
  if (seo.path === pageSeo.home.path) blocks.push(localBusinessJsonLd(siteUrl), webSiteJsonLd(siteUrl));
  if (seo.path === pageSeo.contact.path) blocks.push(localBusinessJsonLd(siteUrl));
  if (!seo.noindex) blocks.push(breadcrumbJsonLd(seo, siteUrl));
  return blocks.filter((b): b is JsonLd => b !== null);
}

/** Safe for embedding inside <script type="application/ld+json">. */
export function serializeJsonLd(blocks: readonly JsonLd[]): string {
  return blocks
    .map((b) => `<script type="application/ld+json">${JSON.stringify(b).replace(/</g, '\\u003c')}</script>`)
    .join('\n    ');
}
