// @vitest-environment jsdom
import { act, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { describe, expect, it } from 'vitest';
import PricingPage from './PricingPage';

function renderPricing() {
  const router = createMemoryRouter(
    [
      { path: '/precos', Component: PricingPage },
      { path: '/contato', element: <p>Página de contato</p> },
    ],
    { initialEntries: ['/precos'] },
  );
  render(<RouterProvider router={router} />);
  return router;
}

const optionsList = () => screen.getByRole('heading', { level: 2, name: 'Escolha a linha do seu aparelho.' });

describe('prices page', () => {
  it('has a single h1 and the verified prices, exactly', () => {
    renderPricing();
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Clareza para escolher. Simplicidade para começar.',
    );
    expect(optionsList()).toBeInTheDocument();

    const modules = screen.getAllByRole('heading', { level: 3 }).map((heading) => heading.textContent);
    expect(modules).toEqual(['Linha Motorola', 'Linha Samsung', 'Linha Xiaomi', 'iPhone']);
    expect(screen.getByText(/O valor final pode variar conforme a avaliação do aparelho/)).toBeInTheDocument();
  });

  it.each([
    ['Linha Motorola', 'R$ 150,00', '/contato?servico=linha-motorola'],
    ['Linha Samsung', 'R$ 150,00', '/contato?servico=linha-samsung'],
    ['Linha Xiaomi', 'R$ 150,00', '/contato?servico=linha-xiaomi'],
    ['iPhone', 'A partir de R$ 200,00', '/contato?servico=iphone'],
  ])('the %s module is one accessible link to the contact page', (name, price, href) => {
    renderPricing();
    const heading = screen.getByRole('heading', { level: 3, name });
    const link = heading.closest('a');
    expect(link).toHaveAttribute('href', href);
    expect(within(link as HTMLElement).getByText(price)).toBeInTheDocument();
    expect(link).toHaveAccessibleName(expect.stringContaining(price));
  });

  it('navigates to the contact page with the clicked option', async () => {
    const user = userEvent.setup();
    const router = renderPricing();
    const link = screen.getByRole('heading', { level: 3, name: 'Linha Xiaomi' }).closest('a');
    await user.click(link as HTMLElement);
    expect(router.state.location.pathname + router.state.location.search).toBe('/contato?servico=linha-xiaomi');
  });

  it('final call to action asks for a choice, then opens the contact page with it', async () => {
    const user = userEvent.setup();
    const router = renderPricing();
    const submit = screen.getByRole('button', { name: 'Escolher e falar com a MARK' });

    await user.click(submit);
    expect(await screen.findByText('Escolha uma das opções para continuar.')).toBeInTheDocument();
    expect(router.state.location.pathname).toBe('/precos');
    expect(screen.getByRole('radio', { name: /Linha Motorola/ })).toHaveFocus();

    await user.click(screen.getByRole('radio', { name: /iPhone/ }));
    expect(screen.queryByText('Escolha uma das opções para continuar.')).not.toBeInTheDocument();
    await act(async () => {
      await user.click(submit);
    });
    expect(router.state.location.pathname + router.state.location.search).toBe('/contato?servico=iphone');
  });
});
