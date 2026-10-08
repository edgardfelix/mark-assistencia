import { business } from '@/config/business';

/** 11976654797 → (11) 97665-4797 */
export function formatPhone(national: string): string {
  const digits = national.replace(/\D/g, '');
  if (digits.length === 11) return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  if (digits.length === 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return national;
}

/** 64246102000174 → 64.246.102/0001-74 */
export function formatCnpj(cnpj: string): string {
  const d = cnpj.replace(/\D/g, '');
  if (d.length !== 14) return cnpj;
  return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8, 12)}-${d.slice(12)}`;
}

/** Validates CNPJ check digits (mod 11). */
export function isValidCnpj(cnpj: string): boolean {
  const d = cnpj.replace(/\D/g, '');
  if (d.length !== 14 || /^(\d)\1+$/.test(d)) return false;
  const digit = (base: string) => {
    const weights = base.length === 12 ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2] : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    const sum = weights.reduce((acc, w, i) => acc + w * Number(base[i]), 0);
    const rest = sum % 11;
    return rest < 2 ? 0 : 11 - rest;
  };
  const first = digit(d.slice(0, 12));
  const second = digit(d.slice(0, 12) + String(first));
  return d.endsWith(`${first}${second}`);
}

/** "07:00" → "7h" · "20:00" → "20h" · "07:30" → "7h30" */
export function formatHour(time: string): string {
  const [h = '0', m = '00'] = time.split(':');
  const hour = String(Number(h));
  return m === '00' ? `${hour}h` : `${hour}h${m}`;
}

export const display = {
  phone: formatPhone(business.phone.national),
  phoneInternational: `+55 ${business.phone.national.slice(0, 2)} ${business.phone.national.slice(2, 7)}-${business.phone.national.slice(7)}`,
  cnpj: formatCnpj(business.cnpj),
  hours: `${formatHour(business.hours.opens)} às ${formatHour(business.hours.closes)}`,
  hoursCompact: `${formatHour(business.hours.opens)}–${formatHour(business.hours.closes)}`,
  addressLine1: `${business.address.street}, ${business.address.number}`,
  addressLine2: `${business.address.neighborhood} · ${business.address.city} – ${business.address.state}`,
  addressFull: `${business.address.street}, ${business.address.number} – ${business.address.neighborhood}, ${business.address.city} – ${business.address.state}`,
  instagramHandle: `@${business.instagram.handle}`,
} as const;
