/**
 * Verified business facts — the only source of factual claims on the site.
 *
 * Provided by the client: name, CNPJ, phone, address, opening hours, e-mail,
 * Instagram, "+600" completed services, free pickup/delivery, up to 4
 * interest-free installments.
 * Confirmed by the client's own assets: street type "Rua" and the WhatsApp
 * number (business card), service list (screen, battery, charging port,
 * repairs, accessories — logo and promotional card).
 *
 * Reference prices by device line (supplied 2026-10-08) live in src/data/pricing.ts.
 *
 * Deliberately NOT stated anywhere (unknown): days of the week, postal code,
 * coordinates, prices beyond those references, warranty terms, turnaround times,
 * part origin.
 */
export const business = {
  name: 'MARK ASSISTÊNCIA',
  shortName: 'MARK',
  category: 'Assistência de celulares',
  cnpj: '64246102000174',
  phone: {
    /** E.164 without the plus sign — used for tel: and wa.me links. */
    e164: '5511976654797',
    national: '11976654797',
  },
  email: 'paulo.marcel2@gmail.com',
  instagram: {
    handle: 'mark_assistenciacel',
    url: 'https://www.instagram.com/mark_assistenciacel/',
  },
  address: {
    street: 'Rua General Nelson Braga Moreira',
    number: '366',
    neighborhood: 'Vila Yolanda',
    city: 'Osasco',
    state: 'SP',
    country: 'BR',
  },
  hours: { opens: '07:00', closes: '20:00' },
  highlights: {
    completedServices: 600,
    freePickupAndDelivery: true,
    maxInterestFreeInstallments: 4,
  },
} as const;

export type Business = typeof business;
