// @vitest-environment jsdom
import { act } from '@testing-library/react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import {
  createMemoryRouter,
  createStaticHandler,
  createStaticRouter,
  RouterProvider,
  StaticRouterProvider,
  type RouteObject,
} from 'react-router';
import { afterEach, describe, expect, it } from 'vitest';
import ContactPage from './ContactPage';

const routes: RouteObject[] = [{ path: '/contato', Component: ContactPage }];

/** Static HTML exactly as the prerender produces it: the build never sees a query string. */
async function prerender(url: string) {
  const handler = createStaticHandler(routes);
  const context = await handler.query(new Request(`http://localhost${url}`));
  if (context instanceof Response) throw new Error('unexpected redirect');
  const router = createStaticRouter(handler.dataRoutes, context);
  return renderToString(<StaticRouterProvider router={router} context={context} hydrate={false} />);
}

describe('contact page hydration with ?servico=', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('ignores the query on the server, so the static page is the regular one', async () => {
    const html = await prerender('/contato?servico=iphone');
    expect(html).not.toContain('Serviço selecionado');
    expect(html).toContain('Chamar no WhatsApp');
  });

  it('hydrates /contato?servico=iphone without a mismatch, then shows the selection', async () => {
    const container = document.createElement('div');
    container.innerHTML = await prerender('/contato');
    document.body.appendChild(container);

    const errors: unknown[] = [];
    const router = createMemoryRouter(routes, { initialEntries: ['/contato?servico=iphone'] });
    await act(async () => {
      hydrateRoot(container, <RouterProvider router={router} />, {
        onRecoverableError: (error) => errors.push(error),
      });
      await Promise.resolve();
    });

    expect(errors).toEqual([]);
    expect(container.textContent).toContain('Serviço selecionado');
    expect(container.textContent).toContain('A partir de R$ 200,00');
  });
});
