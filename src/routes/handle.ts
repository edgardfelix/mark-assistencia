import { type LcpImage } from '@/config/lcp';
import { type PageSeo } from '@/config/seo';

/** Data attached to each route through `handle`. */
export interface RouteHandle {
  seo: PageSeo;
  /** Above-the-fold image preloaded with high priority by the prerender. */
  lcp?: LcpImage;
}

export function isRouteHandle(value: unknown): value is RouteHandle {
  return typeof value === 'object' && value !== null && 'seo' in value;
}
