import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { createBrowserRouter, matchRoutes } from 'react-router';
import { RouterProvider } from 'react-router/dom';
import { AppProviders } from '@/app/AppProviders';
import { routes } from '@/routes/routes';

/**
 * Pages are prerendered to static HTML at build time and hydrated here.
 * The current route's lazy module is resolved before hydration so the first
 * client render matches the server HTML synchronously.
 */
async function resolveInitialRoutes() {
  const matches = matchRoutes(routes, window.location) ?? [];
  await Promise.all(
    matches.map(async ({ route }) => {
      if (typeof route.lazy !== 'function') return;
      const resolved = await route.lazy();
      Object.assign(route, resolved);
      delete route.lazy;
    }),
  );
}

/**
 * Hydrate only when the markup was prerendered for the route the URL resolves
 * to. A host that answers every path with index.html would otherwise cause a
 * hydration mismatch; in that case the app simply renders on the client.
 */
function matchesPrerenderedRoute(container: HTMLElement): boolean {
  const renderedPath = container.dataset.route;
  if (!renderedPath || !container.firstElementChild) return false;
  const leaf = (pathname: string) => matchRoutes(routes, pathname)?.at(-1)?.route;
  return leaf(renderedPath) === leaf(window.location.pathname);
}

async function start() {
  const container = document.getElementById('root');
  if (!container) throw new Error('Elemento #root não encontrado.');
  const hydrate = matchesPrerenderedRoute(container);

  await resolveInitialRoutes();
  const router = createBrowserRouter(routes);
  const app = (
    <StrictMode>
      <AppProviders>
        <RouterProvider router={router} />
      </AppProviders>
    </StrictMode>
  );

  if (hydrate) {
    hydrateRoot(container, app);
  } else {
    // Development server (no prerendered markup) or markup for another route.
    container.replaceChildren();
    createRoot(container).render(app);
  }
}

void start();
