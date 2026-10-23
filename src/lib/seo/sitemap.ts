import { type PageSeo } from '@/config/seo';
import { absoluteUrl } from '@/lib/seo/head';

/**
 * sitemap.xml for the indexable pages. `lastModified` is the build date
 * (W3C date, YYYY-MM-DD): the site is deployed when its content changes.
 */
export function buildSitemap(pages: readonly PageSeo[], siteUrl: string, lastModified: string): string {
  const urls = pages
    .filter((page) => !page.noindex)
    .map((page) => {
      const lines = [`<loc>${absoluteUrl(siteUrl, page.path)}</loc>`, `<lastmod>${lastModified}</lastmod>`];
      if (page.sitemap) {
        lines.push(
          `<changefreq>${page.sitemap.changeFrequency}</changefreq>`,
          `<priority>${page.sitemap.priority.toFixed(1)}</priority>`,
        );
      }
      return `  <url>\n${lines.map((line) => `    ${line}`).join('\n')}\n  </url>`;
    });
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`;
}
