import { describe, expect, it } from 'vitest';
import { pageSeo } from '@/config/seo';
import { whatsappUrl } from '@/lib/links';
import { formatPrice } from '@/lib/price';
import { pricingContactPath, pricingOptions, resolvePricingOption } from './pricing';

describe('pricing data', () => {
  it('shows exactly the prices supplied by the client', () => {
    expect(pricingOptions.map((option) => [option.name, formatPrice(option.price).text])).toEqual([
      ['Linha Motorola', 'R$ 150,00'],
      ['Linha Samsung', 'R$ 150,00'],
      ['Linha Xiaomi', 'R$ 150,00'],
      ['iPhone', 'A partir de R$ 200,00'],
    ]);
  });

  it('uses unique, URL-safe ids in the 01–04 order', () => {
    expect(pricingOptions.map((option) => option.id)).toEqual([
      'linha-motorola',
      'linha-samsung',
      'linha-xiaomi',
      'iphone',
    ]);
    for (const option of pricingOptions) expect(option.id).toMatch(/^[a-z0-9-]+$/);
  });

  it('links each option to the contact page through ?servico=', () => {
    expect(pricingOptions.map((option) => pricingContactPath(option.id))).toEqual([
      '/contato?servico=linha-motorola',
      '/contato?servico=linha-samsung',
      '/contato?servico=linha-xiaomi',
      '/contato?servico=iphone',
    ]);
  });

  it('pre-fills the agreed WhatsApp messages, encoded for the known number', () => {
    expect(pricingOptions.map((option) => option.message)).toEqual([
      'Olá! Vi a página de preços da MARK e gostaria de saber mais sobre a Linha Motorola.',
      'Olá! Vi a página de preços da MARK e gostaria de saber mais sobre a Linha Samsung.',
      'Olá! Vi a página de preços da MARK e gostaria de saber mais sobre a Linha Xiaomi.',
      'Olá! Vi a página de preços da MARK e gostaria de saber mais sobre o atendimento para iPhone.',
    ]);
    for (const option of pricingOptions) {
      const url = new URL(whatsappUrl(option.message));
      expect(url.origin).toBe('https://wa.me');
      expect(url.pathname).toBe('/5511976654797');
      expect(url.searchParams.get('text')).toBe(option.message);
    }
  });

  it('formats Brazilian currency deterministically', () => {
    expect(formatPrice({ kind: 'reference', cents: 15000 })).toEqual({
      prefix: null,
      currency: 'R$',
      integer: '150',
      cents: ',00',
      text: 'R$ 150,00',
    });
    expect(formatPrice({ kind: 'reference', cents: 123456 }).text).toBe('R$ 1.234,56');
    expect(formatPrice({ kind: 'from', cents: 20000 }).text).toBe('A partir de R$ 200,00');
  });

  it('keeps the page description in line with the data', () => {
    expect(pageSeo.pricing.description).toContain('R$ 150,00');
    expect(pageSeo.pricing.description).toContain('a partir de R$ 200,00');
  });
});

describe('?servico= resolution (untrusted input)', () => {
  it('resolves known ids, tolerating case and surrounding spaces', () => {
    expect(resolvePricingOption('iphone')?.name).toBe('iPhone');
    expect(resolvePricingOption('linha-xiaomi')?.name).toBe('Linha Xiaomi');
    expect(resolvePricingOption('  LINHA-SAMSUNG ')?.id).toBe('linha-samsung');
  });

  it('ignores everything else, including prototype keys and injection attempts', () => {
    const hostile = [
      null,
      undefined,
      '',
      'invalid',
      'abc',
      '__proto__',
      'constructor',
      'toString',
      'hasOwnProperty',
      '<script>alert(1)</script>',
      '"><img src=x onerror=alert(1)>',
      'javascript:alert(1)',
      'https://example.com',
      '//example.com',
      '../contato',
      'iphone<',
      'iphone\u0000',
      'linha-motorola,iphone',
      'x'.repeat(10_000),
    ];
    for (const value of hostile) expect(resolvePricingOption(value), String(value).slice(0, 40)).toBeNull();
  });
});
