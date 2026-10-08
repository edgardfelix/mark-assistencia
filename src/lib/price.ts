/**
 * Prices as data (integer centavos) and their Brazilian display format, shared
 * by the prices page and the product catalog.
 */
export type PriceKind = 'fixed' | 'reference' | 'from';

export interface Price {
  /** `fixed` and `reference`: "R$ 150,00" · `from`: "A partir de R$ 200,00". */
  kind: PriceKind;
  /** Amount in centavos (integer), e.g. 15000 = R$ 150,00. */
  cents: number;
}

export interface PriceParts {
  /** "A partir de" for starting prices, otherwise null. */
  prefix: string | null;
  currency: 'R$';
  /** Reais with thousands separators, e.g. "150" or "1.200". */
  integer: string;
  /** Centavos with the decimal comma, e.g. ",00". */
  cents: string;
  /** The full text, e.g. "R$ 150,00" or "A partir de R$ 200,00". */
  text: string;
}

const pricePrefix: Record<PriceKind, string | null> = { fixed: null, reference: null, from: 'A partir de' };

/** Brazilian currency format, deterministic on the server and in every browser. */
export function formatPrice(price: Price): PriceParts {
  const integer = String(Math.trunc(price.cents / 100)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  const cents = `,${String(price.cents % 100).padStart(2, '0')}`;
  const prefix = pricePrefix[price.kind];
  const amount = `R$ ${integer}${cents}`;
  return { prefix, currency: 'R$', integer, cents, text: prefix ? `${prefix} ${amount}` : amount };
}
