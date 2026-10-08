import { type Price } from '@/lib/price';
import { paths } from '@/routes/paths';

/**
 * Reference prices by device line, supplied by the client (MARK) on 2026-10-08
 * and shown exactly as provided. They are not quotes: the final value depends on
 * the evaluation of the device and on the service needed, which the site says
 * next to the prices. There are no discounts, promotions, crossed-out prices or
 * guarantees — none may be added here.
 *
 * `id` doubles as the public `?servico=` value of the contact page, so this list
 * is also the allowlist that untrusted query strings are resolved against.
 */
interface PricingOptionShape {
  id: string;
  /** Short brand label for the visual index, e.g. "01 / MOTOROLA". */
  label: string;
  name: string;
  price: Price;
  /** WhatsApp text pre-filled when this option is selected. It is never sent automatically. */
  message: string;
  /** Placeholder of the device-model field on the contact form. */
  devicePlaceholder: string;
}

export const pricingOptions = [
  {
    id: 'linha-motorola',
    label: 'Motorola',
    name: 'Linha Motorola',
    price: { kind: 'reference', cents: 15000 },
    message: 'Olá! Vi a página de preços da MARK e gostaria de saber mais sobre a Linha Motorola.',
    devicePlaceholder: 'Qual é o modelo do seu Motorola?',
  },
  {
    id: 'linha-samsung',
    label: 'Samsung',
    name: 'Linha Samsung',
    price: { kind: 'reference', cents: 15000 },
    message: 'Olá! Vi a página de preços da MARK e gostaria de saber mais sobre a Linha Samsung.',
    devicePlaceholder: 'Qual é o modelo do seu Samsung?',
  },
  {
    id: 'linha-xiaomi',
    label: 'Xiaomi',
    name: 'Linha Xiaomi',
    price: { kind: 'reference', cents: 15000 },
    message: 'Olá! Vi a página de preços da MARK e gostaria de saber mais sobre a Linha Xiaomi.',
    devicePlaceholder: 'Qual é o modelo do seu Xiaomi?',
  },
  {
    id: 'iphone',
    label: 'iPhone',
    name: 'iPhone',
    price: { kind: 'from', cents: 20000 },
    message: 'Olá! Vi a página de preços da MARK e gostaria de saber mais sobre o atendimento para iPhone.',
    devicePlaceholder: 'Qual é o modelo do seu iPhone?',
  },
] as const satisfies readonly PricingOptionShape[];

export type PricingOption = (typeof pricingOptions)[number];
export type PricingOptionId = PricingOption['id'];

/** Name of the contact-page query parameter that carries the selected option. */
export const pricingQueryParam = 'servico';

/** Internal link from the prices page to the contact page, e.g. `/contato?servico=iphone`. */
export function pricingContactPath(id: PricingOptionId): string {
  return `${paths.contact}?${new URLSearchParams({ [pricingQueryParam]: id }).toString()}`;
}

const optionsById: ReadonlyMap<string, PricingOption> = new Map(pricingOptions.map((option) => [option.id, option]));

/**
 * Resolves an untrusted `?servico=` value against the allowlist above. Unknown
 * values (including prototype keys such as `__proto__`) resolve to `null`; the
 * raw value is never rendered or used to build a URL.
 */
export function resolvePricingOption(value: string | null | undefined): PricingOption | null {
  if (!value) return null;
  return optionsById.get(value.trim().toLowerCase()) ?? null;
}

/** "01" … "04": the option's position in the price system. */
export function pricingOptionNumber(option: PricingOption): string {
  return String(pricingOptions.indexOf(option) + 1).padStart(2, '0');
}
