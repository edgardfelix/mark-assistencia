import { renderToString } from 'react-dom/server';
import { createStaticHandler, createStaticRouter, StaticRouterProvider } from 'react-router';
import { ServerStyleSheet } from 'styled-components';
import { AppProviders } from '@/app/AppProviders';
import { gaMeasurementId } from '@/config/analytics';
import { type LcpImage } from '@/config/lcp';
import { pageSeo } from '@/config/seo';
import { siteUrl } from '@/config/site';
import { getImage } from '@/lib/media';
import { buildHeadTags, serializeHeadTags } from '@/lib/seo/head';
import { buildSitemap } from '@/lib/seo/sitemap';
import { pageJsonLd, serializeJsonLd } from '@/lib/seo/structured-data';
import { isRouteHandle } from '@/routes/handle';
import { prerenderPaths, routes } from '@/routes/routes';
import { manropeLatin } from '@/styles/GlobalStyle';

export { gaMeasurementId, prerenderPaths, siteUrl };

/** sitemap.xml for every indexable page, dated with the build day (see scripts/prerender.mjs). */
export function renderSitemap(lastModified: string): string {
  return buildSitemap(Object.values(pageSeo), siteUrl, lastModified);
}

export interface RenderResult {
  html: string;
  head: string;
}

const handler = createStaticHandler(routes);

/** High-priority preload of the page's LCP image (AVIF; browsers without AVIF skip it). */
function lcpPreload({ id, sizes }: LcpImage): string {
  const avif = getImage(id).sources.find((source) => source.type === 'image/avif');
  if (!avif) return '';
  return `<link rel="preload" as="image" type="image/avif" imagesrcset="${avif.srcSet}" imagesizes="${sizes}" fetchpriority="high">`;
}

/**
 * Renders one route to static HTML (build-time only, see scripts/prerender.mjs).
 * No hydration script is emitted, so the CSP can forbid inline scripts.
 */
export async function render(path: string): Promise<RenderResult> {
  const context = await handler.query(new Request(`http://localhost${path}`));
  if (context instanceof Response) throw new Error(`Redirecionamento inesperado ao pré-renderizar ${path}`);

  const handle: unknown = [...context.matches].reverse().find((match) => isRouteHandle(match.route.handle))
    ?.route.handle;
  const seo = isRouteHandle(handle) ? handle.seo : pageSeo.notFound;
  const lcp = isRouteHandle(handle) ? handle.lcp : undefined;

  const router = createStaticRouter(handler.dataRoutes, context);
  const sheet = new ServerStyleSheet();
  try {
    const html = renderToString(
      sheet.collectStyles(
        <AppProviders>
          <StaticRouterProvider router={router} context={context} hydrate={false} />
        </AppProviders>,
      ),
    );
    const head = [
      serializeHeadTags(buildHeadTags(seo, siteUrl)),
      `<link rel="preload" href="${manropeLatin}" as="font" type="font/woff2" crossorigin>`,
      lcp ? lcpPreload(lcp) : '',
      serializeJsonLd(pageJsonLd(seo, siteUrl)),
      sheet.getStyleTags(),
    ]
      .filter(Boolean)
      .join('\n    ');
    return { html, head };
  } finally {
    sheet.seal();
  }
}
