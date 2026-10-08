import { type ComponentType } from 'react';
import { type RouteObject } from 'react-router';
import { RootErrorBoundary, RouteErrorBoundary } from '@/components/layout/RouteErrorBoundary';
import { RootLayout } from '@/components/layout/RootLayout';
import { lcpImages } from '@/config/lcp';
import { pageSeo } from '@/config/seo';
import { type RouteHandle } from './handle';
import { pageImporters } from './prefetch';

const page = (importer: () => Promise<{ default: ComponentType }>) => async () => ({
  Component: (await importer()).default,
});

/**
 * Route tree shared by the browser router and the static prerenderer.
 * The pathless child holds the error boundary, so a failing page keeps the
 * header and footer around it.
 */
export const routes: RouteObject[] = [
  {
    path: '/',
    Component: RootLayout,
    ErrorBoundary: RootErrorBoundary,
    children: [
      {
        ErrorBoundary: RouteErrorBoundary,
        children: [
          {
            index: true,
            lazy: page(pageImporters.home),
            handle: { seo: pageSeo.home, lcp: lcpImages.home } satisfies RouteHandle,
          },
          {
            path: 'servicos',
            lazy: page(pageImporters.services),
            handle: { seo: pageSeo.services, lcp: lcpImages.services } satisfies RouteHandle,
          },
          {
            path: 'precos',
            lazy: page(pageImporters.pricing),
            handle: { seo: pageSeo.pricing } satisfies RouteHandle,
          },
          {
            path: 'produtos',
            lazy: page(pageImporters.products),
            handle: { seo: pageSeo.products } satisfies RouteHandle,
          },
          {
            path: 'empresa',
            lazy: page(pageImporters.company),
            handle: { seo: pageSeo.company, lcp: lcpImages.company } satisfies RouteHandle,
          },
          {
            path: 'avaliacoes',
            lazy: page(pageImporters.reviews),
            handle: { seo: pageSeo.reviews } satisfies RouteHandle,
          },
          {
            path: 'contato',
            lazy: page(pageImporters.contact),
            handle: { seo: pageSeo.contact } satisfies RouteHandle,
          },
          {
            path: 'privacidade',
            lazy: page(pageImporters.privacy),
            handle: { seo: pageSeo.privacy } satisfies RouteHandle,
          },
          { path: 'termos', lazy: page(pageImporters.terms), handle: { seo: pageSeo.terms } satisfies RouteHandle },
          { path: '*', lazy: page(pageImporters.notFound), handle: { seo: pageSeo.notFound } satisfies RouteHandle },
        ],
      },
    ],
  },
];

/** Paths prerendered to static HTML at build time (the 404 is rendered separately). */
export const prerenderPaths = [
  pageSeo.home.path,
  pageSeo.services.path,
  pageSeo.pricing.path,
  pageSeo.products.path,
  pageSeo.company.path,
  pageSeo.reviews.path,
  pageSeo.contact.path,
  pageSeo.privacy.path,
  pageSeo.terms.path,
] as const;
