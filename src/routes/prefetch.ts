import { paths } from './paths';

/** Page modules, code-split per route. Shared by the router and intent prefetching. */
export const pageImporters = {
  home: () => import('@/pages/HomePage'),
  services: () => import('@/pages/ServicesPage'),
  pricing: () => import('@/pages/PricingPage'),
  products: () => import('@/pages/ProductsPage'),
  company: () => import('@/pages/CompanyPage'),
  reviews: () => import('@/pages/ReviewsPage'),
  contact: () => import('@/pages/ContactPage'),
  privacy: () => import('@/pages/PrivacyPage'),
  terms: () => import('@/pages/TermsPage'),
  notFound: () => import('@/pages/NotFoundPage'),
} as const;

const byPath: Record<string, () => Promise<unknown>> = {
  [paths.home]: pageImporters.home,
  [paths.services]: pageImporters.services,
  [paths.pricing]: pageImporters.pricing,
  [paths.products]: pageImporters.products,
  [paths.company]: pageImporters.company,
  [paths.reviews]: pageImporters.reviews,
  [paths.contact]: pageImporters.contact,
  [paths.privacy]: pageImporters.privacy,
  [paths.terms]: pageImporters.terms,
};

/** Starts downloading a route's code on hover/focus so navigation feels instant. */
export function prefetchRoute(to: string): void {
  const pathname = to.split(/[?#]/)[0] ?? to;
  const importer = byPath[pathname];
  if (importer) {
    importer().catch(() => {
      // A failed prefetch is harmless: navigation retries and handles errors.
    });
  }
}
