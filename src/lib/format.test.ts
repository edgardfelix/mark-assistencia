import { describe, expect, it } from 'vitest';
import { business } from '@/config/business';
import { display, formatCnpj, formatHour, formatPhone, isValidCnpj } from './format';

describe('format', () => {
  it('formats Brazilian mobile and landline numbers', () => {
    expect(formatPhone('11976654797')).toBe('(11) 97665-4797');
    expect(formatPhone('1136654797')).toBe('(11) 3665-4797');
    expect(formatPhone('123')).toBe('123');
  });

  it('formats and validates the business CNPJ', () => {
    expect(formatCnpj(business.cnpj)).toBe('64.246.102/0001-74');
    expect(isValidCnpj(business.cnpj)).toBe(true);
  });

  it('rejects CNPJs with wrong check digits or repeated digits', () => {
    expect(isValidCnpj('64246102000175')).toBe(false);
    expect(isValidCnpj('11111111111111')).toBe(false);
    expect(isValidCnpj('123')).toBe(false);
  });

  it('formats opening hours the Brazilian way', () => {
    expect(formatHour('07:00')).toBe('7h');
    expect(formatHour('20:00')).toBe('20h');
    expect(formatHour('07:30')).toBe('7h30');
    expect(display.hours).toBe('7h às 20h');
  });

  it('builds the display address only from verified data', () => {
    expect(display.addressFull).toBe('Rua General Nelson Braga Moreira, 366 – Vila Yolanda, Osasco – SP');
    expect(display.phoneInternational).toBe('+55 11 97665-4797');
  });
});
