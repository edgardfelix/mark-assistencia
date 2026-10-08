// @vitest-environment jsdom
import { act, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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
import { products, productWhatsappMessage } from '@/data/products';
import { formatPrice } from '@/lib/price';
import ProductsPage from './ProductsPage';

const routes: RouteObject[] = [{ path: '/produtos', Component: ProductsPage }];

function renderAt(url = '/produtos') {
  const router = createMemoryRouter(routes, { initialEntries: [url] });
  render(<RouterProvider router={router} />);
  return router;
}

const where = (router: ReturnType<typeof renderAt>) => router.state.location.pathname + router.state.location.search;
const textOf = (link: HTMLElement) => new URL(link.getAttribute('href') ?? '').searchParams.get('text');
const sheet = () => document.querySelector<HTMLDialogElement>('dialog[aria-labelledby="produto-detalhe-titulo"]');

describe('products page', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('shows the six products in order with exact names and prices', () => {
    renderAt();
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    const cards = screen.getAllByRole('article');
    expect(cards).toHaveLength(6);
    cards.forEach((card, index) => {
      const product = products[index];
      if (!product) throw new Error('missing product');
      const scope = within(card);
      expect(scope.getByRole('heading', { level: 3 })).toHaveTextContent(product.name);
      expect(scope.getByText(formatPrice(product.price).text)).toBeInTheDocument();
      expect(scope.getByRole('img')).toHaveAccessibleName(product.image.alt);
    });
  });

  it('gives every product its own WhatsApp link with the product in the message', () => {
    renderAt();
    for (const product of products) {
      const link = screen.getByRole('link', { name: new RegExp(`Tenho interesse no produto ${product.name}`) });
      expect(textOf(link)).toBe(productWhatsappMessage(product));
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    }
  });

  it('opens the details from the card, in the URL, and closes back to the list', async () => {
    const user = userEvent.setup();
    const router = renderAt();
    await user.click(screen.getByRole('button', { name: /Cabo USB-C Samsung Original, ver detalhes/ }));

    expect(where(router)).toBe('/produtos?produto=cabo-usb-c-samsung-original');
    const dialog = sheet();
    expect(dialog?.open).toBe(true);
    const scope = within(dialog as HTMLElement);
    expect(scope.getByRole('heading', { level: 2 })).toHaveTextContent('Cabo USB-C Samsung Original');
    expect(scope.getByText(/Compacto, resistente e compatível/)).toBeInTheDocument();
    const cta = scope.getByRole('link', { name: /Consultar pelo WhatsApp/ });
    expect(textOf(cta)).toContain('*Cabo USB-C Samsung Original*');

    await user.click(scope.getByRole('button', { name: 'Fechar detalhes do produto' }));
    expect(where(router)).toBe('/produtos');
    expect(sheet()?.open).toBe(false);
  });

  it('opens straight from a shared link and ignores unknown products', async () => {
    renderAt('/produtos?produto=carregador-motorola-turbopower-68w');
    expect(sheet()?.open).toBe(true);
    expect(within(sheet() as HTMLElement).getByRole('heading', { level: 2 })).toHaveTextContent(
      'Carregador Motorola TurboPower 68W',
    );
    document.body.innerHTML = '';

    const router = renderAt('/produtos?produto=%3Cscript%3Ealert(1)%3C%2Fscript%3E');
    expect(sheet()?.open).toBe(false);
    expect(document.body.textContent).not.toContain('alert(1)');
    await act(() => router.navigate('/produtos?produto=cabo-usb-kaidi-tipo-c'));
    expect(sheet()?.open).toBe(true);
  });
});

describe('products page hydration with ?produto=', () => {
  it('hydrates the prerendered page without a mismatch, then opens the details', async () => {
    const handler = createStaticHandler(routes);
    const context = await handler.query(new Request('http://localhost/produtos'));
    if (context instanceof Response) throw new Error('unexpected redirect');
    const html = renderToString(
      <StaticRouterProvider
        router={createStaticRouter(handler.dataRoutes, context)}
        context={context}
        hydrate={false}
      />,
    );
    const container = document.createElement('div');
    container.innerHTML = html;
    document.body.appendChild(container);

    const errors: unknown[] = [];
    const router = createMemoryRouter(routes, { initialEntries: ['/produtos?produto=fone-jbl-tune-520bt'] });
    await act(async () => {
      hydrateRoot(container, <RouterProvider router={router} />, {
        onRecoverableError: (error) => errors.push(error),
      });
      await Promise.resolve();
    });

    expect(errors).toEqual([]);
    expect(sheet()?.open).toBe(true);
    expect(container.textContent).toContain('Ideal para ouvir músicas');
  });
});
