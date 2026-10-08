import { describe, expect, it } from 'vitest';
import manifest from '@/assets/media/manifest.json';
import { whatsappUrl } from '@/lib/links';
import { formatPrice } from '@/lib/price';
import { productPath, products, productWhatsappMessage, resolveProduct } from './products';

/** The client's catalog, verbatim (2026-10-08). */
const catalog = [
  {
    name: 'Fone de Ouvido JBL Tune 520BT',
    description:
      'Fone de ouvido Bluetooth JBL Tune 520BT, com design confortável, som de qualidade e conexão sem fio. Ideal para ouvir músicas, assistir vídeos e atender chamadas no dia a dia.',
    price: 'R$ 100,00',
    image: 'product-jbl-tune-520bt',
  },
  {
    name: 'Cabo USB-C Xiaomi 6A',
    description:
      'Cabo USB-A para USB-C Xiaomi de alta qualidade, ideal para carregamento rápido e transferência de dados. Resistente, prático e compatível com diversos dispositivos com entrada USB-C.',
    price: 'R$ 80,00',
    image: 'product-cabo-xiaomi-6a',
  },
  {
    name: 'Cabo USB-C Samsung Original',
    description:
      'Cabo USB-A para USB-C Samsung, ideal para carregamento e transferência de dados. Compacto, resistente e compatível com smartphones, tablets e outros dispositivos com entrada USB-C.',
    price: 'R$ 80,00',
    image: 'product-cabo-samsung',
  },
  {
    name: 'Carregador Motorola TurboPower 68W',
    description:
      'Carregador Motorola TurboPower de 68W com tecnologia de carregamento rápido e saída USB-C. Ideal para smartphones, tablets e outros dispositivos compatíveis, oferecendo mais potência e praticidade no dia a dia.',
    price: 'R$ 80,00',
    image: 'product-carregador-motorola-68w',
  },
  {
    name: 'Cabo USB Kaidi KD-306 – 1 Metro',
    description:
      'Cabo USB Kaidi de 1 metro, desenvolvido para carregamento rápido e transferência de dados. Possui construção resistente e é ideal para uso diário com dispositivos compatíveis.',
    price: 'R$ 20,00',
    image: 'product-cabo-kaidi-kd306',
  },
  {
    name: 'Cabo USB Kaidi Tipo-C – 1 Metro',
    description:
      'Cabo Kaidi USB para Tipo-C de 1 metro, ideal para carregamento rápido e transferência de dados. Prático, resistente e compatível com diversos dispositivos com entrada USB-C.',
    price: 'R$ 20,00',
    image: 'product-cabo-kaidi-tipo-c',
  },
];

describe('product catalog', () => {
  it('matches the client catalog exactly (name, description, price, photo)', () => {
    expect(
      products.map((p) => ({
        name: p.name,
        description: p.description,
        price: formatPrice(p.price).text,
        image: p.image.id,
      })),
    ).toEqual(catalog);
  });

  it('uses one distinct, generated photo per product, each with a description', () => {
    const images = products.map((p) => p.image.id);
    expect(new Set(images).size).toBe(products.length);
    for (const product of products) {
      const entry = manifest.images[product.image.id];
      expect(entry, product.image.id).toBeDefined();
      expect(entry.width, product.image.id).toBe(entry.height);
      expect(product.image.alt.length).toBeGreaterThan(30);
    }
  });

  it('keeps ids unique and URL-safe, and summaries verbatim from the descriptions', () => {
    expect(new Set(products.map((p) => p.id)).size).toBe(products.length);
    for (const product of products) {
      expect(product.id).toMatch(/^[a-z0-9-]+$/);
      expect(product.description.startsWith(product.summary), product.id).toBe(true);
    }
  });

  it('builds a contextual WhatsApp message for each product, safely encoded', () => {
    for (const product of products) {
      const message = productWhatsappMessage(product);
      expect(message).toContain(`*${product.name}*`);
      expect(message).toContain(`Valor no site: ${formatPrice(product.price).text}`);
      expect(message).toContain(product.summary);
      const url = new URL(whatsappUrl(message));
      expect(url.origin + url.pathname).toBe('https://wa.me/5511976654797');
      // Accents, the en dash and line breaks survive the round trip.
      expect(url.searchParams.get('text')).toBe(message);
    }
    expect(new Set(products.map(productWhatsappMessage)).size).toBe(products.length);
  });

  it('links to each product’s details and resolves only known ids', () => {
    expect(productPath('cabo-usb-c-samsung-original')).toBe('/produtos?produto=cabo-usb-c-samsung-original');
    expect(resolveProduct(' FONE-JBL-TUNE-520BT ')?.name).toBe('Fone de Ouvido JBL Tune 520BT');
    for (const value of [
      null,
      '',
      'invalid',
      '__proto__',
      'constructor',
      '<script>alert(1)</script>',
      'https://example.com',
    ]) {
      expect(resolveProduct(value)).toBeNull();
    }
  });
});
