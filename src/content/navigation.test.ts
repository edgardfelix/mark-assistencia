import { describe, expect, it } from 'vitest';
import { prerenderPaths } from '@/routes/routes';
import { primaryNav } from './navigation';

describe('primary navigation', () => {
  it('lists the seven destinations in the agreed order', () => {
    expect(primaryNav.map((item) => item.label)).toEqual([
      'Início',
      'Serviços',
      'Preços',
      'Produtos',
      'Empresa',
      'Avaliações',
      'Contato',
    ]);
    expect(primaryNav.find((item) => item.label === 'Preços')?.to).toBe('/precos');
    expect(primaryNav.find((item) => item.label === 'Produtos')?.to).toBe('/produtos');
  });

  it('only points to prerendered pages', () => {
    for (const item of primaryNav) expect(prerenderPaths).toContain(item.to);
  });
});
