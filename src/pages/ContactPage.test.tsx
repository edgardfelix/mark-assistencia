// @vitest-environment jsdom
import { act, render, screen, within } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { describe, expect, it } from 'vitest';
import ContactPage from './ContactPage';

function renderAt(url: string) {
  const router = createMemoryRouter([{ path: '/contato', Component: ContactPage }], { initialEntries: [url] });
  render(<RouterProvider router={router} />);
  return router;
}

function required<T>(value: T | null | undefined, what: string): T {
  if (value == null) throw new Error(`${what} not found`);
  return value;
}

const whatsappText = (link: HTMLElement) => new URL(link.getAttribute('href') ?? '').searchParams.get('text') ?? '';

describe('contact page with a price option', () => {
  it.each([
    ['linha-motorola', 'Linha Motorola', 'R$ 150,00', 'sobre a Linha Motorola.'],
    ['linha-samsung', 'Linha Samsung', 'R$ 150,00', 'sobre a Linha Samsung.'],
    ['linha-xiaomi', 'Linha Xiaomi', 'R$ 150,00', 'sobre a Linha Xiaomi.'],
    ['iphone', 'iPhone', 'A partir de R$ 200,00', 'sobre o atendimento para iPhone.'],
  ])('?servico=%s shows the selection and a pre-filled WhatsApp link', (id, name, price, ending) => {
    renderAt(`/contato?servico=${id}`);

    const title = screen.getByRole('heading', { level: 3, name });
    const scope = within(required(title.parentElement?.parentElement, 'selection card'));
    expect(scope.getByText('Serviço selecionado')).toBeInTheDocument();
    expect(scope.getByText(price)).toBeInTheDocument();

    const link = scope.getByRole('link', { name: /Falar com a MARK/ });
    expect(whatsappText(link)).toBe(`Olá! Vi a página de preços da MARK e gostaria de saber mais ${ending}`);
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    expect(scope.getByRole('link', { name: 'Ver outros preços' })).toHaveAttribute('href', '/precos');
  });

  it.each(['invalid', 'abc', '__proto__', '<script>alert(1)</script>', 'https://example.com'])(
    'ignores the unknown value %j and shows the regular page',
    (value) => {
      renderAt(`/contato?servico=${encodeURIComponent(value)}`);
      expect(screen.queryByText('Serviço selecionado')).not.toBeInTheDocument();
      expect(screen.queryByText('Opção escolhida')).not.toBeInTheDocument();
      expect(document.body.textContent).not.toContain(value);
      expect(screen.getByText('(11) 97665-4797', { selector: 'p' })).toBeInTheDocument();
    },
  );

  it('works normally without a query string', () => {
    renderAt('/contato');
    expect(screen.queryByText('Serviço selecionado')).not.toBeInTheDocument();
    const link = required(screen.getAllByRole('link', { name: /Chamar no WhatsApp/ })[0], 'WhatsApp link');
    expect(whatsappText(link)).toBe('Olá! Vi o site da MARK ASSISTÊNCIA e gostaria de falar com vocês.');
  });

  it('follows the URL: changing or removing the query never leaves a stale selection', async () => {
    const router = renderAt('/contato?servico=linha-samsung');
    expect(screen.getByRole('heading', { level: 3, name: 'Linha Samsung' })).toBeInTheDocument();

    await act(() => router.navigate('/contato?servico=iphone'));
    expect(screen.getByRole('heading', { level: 3, name: 'iPhone' })).toBeInTheDocument();
    expect(screen.queryByText('Linha Samsung')).not.toBeInTheDocument();

    await act(() => router.navigate('/contato'));
    expect(screen.queryByText('Serviço selecionado')).not.toBeInTheDocument();

    await act(() => router.navigate(-1));
    expect(screen.getByRole('heading', { level: 3, name: 'iPhone' })).toBeInTheDocument();
  });
});
