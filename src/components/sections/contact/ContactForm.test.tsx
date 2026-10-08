// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { resolvePricingOption } from '@/data/pricing';
import { ContactForm } from './ContactForm';

function renderForm(selection: ReturnType<typeof resolvePricingOption> = null) {
  const router = createMemoryRouter([{ path: '/', element: <ContactForm selection={selection} /> }]);
  return render(<RouterProvider router={router} />);
}

describe('ContactForm', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('shows accessible Portuguese errors and does not open WhatsApp when invalid', async () => {
    const open = vi.spyOn(window, 'open').mockReturnValue(null);
    const user = userEvent.setup();
    renderForm();

    await user.click(screen.getByRole('button', { name: 'Abrir no WhatsApp' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Revise os campos destacados para continuar.');
    expect(screen.getByLabelText('Seu nome')).toHaveAttribute('aria-invalid', 'true');
    // Focus goes to the first invalid field in reading order.
    expect(screen.getByLabelText('Seu nome')).toHaveFocus();
    expect(screen.getByLabelText('Seu nome')).toHaveAccessibleDescription('Informe seu nome.');
    expect(screen.getByText('Escolha um assunto.')).toBeInTheDocument();
    expect(open).not.toHaveBeenCalled();
  });

  it('composes the message, opens WhatsApp and never claims delivery', async () => {
    const open = vi.spyOn(window, 'open').mockReturnValue(null);
    const user = userEvent.setup();
    renderForm();

    await user.type(screen.getByLabelText('Seu nome'), 'Ana');
    await user.type(screen.getByLabelText(/Modelo do aparelho/), 'iPhone 13');
    await user.click(screen.getByRole('radio', { name: 'Troca de tela' }));
    await user.type(screen.getByLabelText('Mensagem'), 'A tela trincou depois de uma queda.');
    await user.click(screen.getByRole('button', { name: 'Abrir no WhatsApp' }));

    expect(open).toHaveBeenCalledTimes(1);
    const [url, target, features] = open.mock.calls[0] ?? [];
    const parsed = new URL(String(url));
    expect(parsed.hostname).toBe('wa.me');
    expect(parsed.searchParams.get('text')).toContain('Assunto: Troca de tela');
    expect(target).toBe('_blank');
    expect(features).toContain('noopener');

    const heading = await screen.findByRole('heading', { name: 'Sua mensagem está pronta no WhatsApp.' });
    expect(heading).toHaveFocus();
    expect(screen.queryByText(/enviada com sucesso/i)).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Abrir o WhatsApp/ })).toHaveAttribute('href', String(url));
  });

  it('carries the option chosen on the prices page into the message', async () => {
    const open = vi.spyOn(window, 'open').mockReturnValue(null);
    const user = userEvent.setup();
    renderForm(resolvePricingOption('linha-samsung'));

    expect(screen.getByText('Opção escolhida')).toBeInTheDocument();
    expect(screen.getByText('Linha Samsung')).toBeInTheDocument();
    expect(screen.getByLabelText(/Modelo do aparelho/)).toHaveAttribute(
      'placeholder',
      'Qual é o modelo do seu Samsung?',
    );

    await user.type(screen.getByLabelText('Seu nome'), 'Ana');
    await user.click(screen.getByRole('radio', { name: 'Troca de bateria' }));
    await user.type(screen.getByLabelText('Mensagem'), 'A bateria acaba antes do almoço.');
    await user.click(screen.getByRole('button', { name: 'Abrir no WhatsApp' }));

    const text = new URL(String(open.mock.calls[0]?.[0])).searchParams.get('text') ?? '';
    expect(text.startsWith('Olá! Vi a página de preços da MARK e gostaria de saber mais sobre a Linha Samsung.')).toBe(
      true,
    );
    expect(text).toContain('Assunto: Troca de bateria');
  });
});
