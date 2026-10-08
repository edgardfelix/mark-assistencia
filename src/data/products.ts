import { type ImageId } from '@/lib/media';
import { formatPrice, type Price } from '@/lib/price';
import { paths } from '@/routes/paths';

/**
 * Product catalog supplied by the client (MARK) on 2026-10-08: names,
 * descriptions and prices exactly as provided; photos from assets/produtos
 * (processed by scripts/process-media.mjs under the image ids below).
 * Stock, availability and specifications beyond these texts are unknown and
 * must not be stated anywhere on the site.
 *
 * `id` doubles as the public `?produto=` value that opens a product's details,
 * so this list is also the allowlist untrusted query strings are resolved against.
 */
interface ProductShape {
  id: string;
  /** Kind of accessory, read straight from the product name. */
  category: string;
  name: string;
  /** First sentence of the description, verbatim: card text and WhatsApp context. */
  summary: string;
  description: string;
  price: Price;
  image: { id: ImageId; alt: string };
}

export const products = [
  {
    id: 'fone-jbl-tune-520bt',
    category: 'Fone de ouvido',
    name: 'Fone de Ouvido JBL Tune 520BT',
    summary: 'Fone de ouvido Bluetooth JBL Tune 520BT, com design confortável, som de qualidade e conexão sem fio.',
    description:
      'Fone de ouvido Bluetooth JBL Tune 520BT, com design confortável, som de qualidade e conexão sem fio. Ideal para ouvir músicas, assistir vídeos e atender chamadas no dia a dia.',
    price: { kind: 'fixed', cents: 10000 },
    image: {
      id: 'product-jbl-tune-520bt',
      alt: 'Caixa do fone de ouvido JBL Tune 520BT, com o fone azul estampado, sobre uma superfície clara.',
    },
  },
  {
    id: 'cabo-usb-c-xiaomi-6a',
    category: 'Cabo',
    name: 'Cabo USB-C Xiaomi 6A',
    summary: 'Cabo USB-A para USB-C Xiaomi de alta qualidade, ideal para carregamento rápido e transferência de dados.',
    description:
      'Cabo USB-A para USB-C Xiaomi de alta qualidade, ideal para carregamento rápido e transferência de dados. Resistente, prático e compatível com diversos dispositivos com entrada USB-C.',
    price: { kind: 'fixed', cents: 8000 },
    image: {
      id: 'product-cabo-xiaomi-6a',
      alt: 'Caixa do cabo Xiaomi 6A, de USB-A para USB-C, com o cabo branco enrolado à frente.',
    },
  },
  {
    id: 'cabo-usb-c-samsung-original',
    category: 'Cabo',
    name: 'Cabo USB-C Samsung Original',
    summary: 'Cabo USB-A para USB-C Samsung, ideal para carregamento e transferência de dados.',
    description:
      'Cabo USB-A para USB-C Samsung, ideal para carregamento e transferência de dados. Compacto, resistente e compatível com smartphones, tablets e outros dispositivos com entrada USB-C.',
    price: { kind: 'fixed', cents: 8000 },
    image: {
      id: 'product-cabo-samsung',
      alt: 'Embalagem do cabo USB Samsung original e, ao lado, o cabo branco com conectores USB-A e USB-C.',
    },
  },
  {
    id: 'carregador-motorola-turbopower-68w',
    category: 'Carregador',
    name: 'Carregador Motorola TurboPower 68W',
    summary: 'Carregador Motorola TurboPower de 68W com tecnologia de carregamento rápido e saída USB-C.',
    description:
      'Carregador Motorola TurboPower de 68W com tecnologia de carregamento rápido e saída USB-C. Ideal para smartphones, tablets e outros dispositivos compatíveis, oferecendo mais potência e praticidade no dia a dia.',
    price: { kind: 'fixed', cents: 8000 },
    image: {
      id: 'product-carregador-motorola-68w',
      alt: 'Carregador Motorola preto e cabo preto enrolado com a fita da marca, sobre uma mesa clara.',
    },
  },
  {
    id: 'cabo-usb-kaidi-kd-306',
    category: 'Cabo',
    name: 'Cabo USB Kaidi KD-306 – 1 Metro',
    summary: 'Cabo USB Kaidi de 1 metro, desenvolvido para carregamento rápido e transferência de dados.',
    description:
      'Cabo USB Kaidi de 1 metro, desenvolvido para carregamento rápido e transferência de dados. Possui construção resistente e é ideal para uso diário com dispositivos compatíveis.',
    price: { kind: 'fixed', cents: 2000 },
    image: {
      id: 'product-cabo-kaidi-kd306',
      alt: 'Cabo USB Kaidi branco com pontas verdes ao lado da embalagem laranja do modelo KD-306.',
    },
  },
  {
    id: 'cabo-usb-kaidi-tipo-c',
    category: 'Cabo',
    name: 'Cabo USB Kaidi Tipo-C – 1 Metro',
    summary: 'Cabo Kaidi USB para Tipo-C de 1 metro, ideal para carregamento rápido e transferência de dados.',
    description:
      'Cabo Kaidi USB para Tipo-C de 1 metro, ideal para carregamento rápido e transferência de dados. Prático, resistente e compatível com diversos dispositivos com entrada USB-C.',
    price: { kind: 'fixed', cents: 2000 },
    image: {
      id: 'product-cabo-kaidi-tipo-c',
      alt: 'Cabo Kaidi branco e plano, com conectores USB e Tipo-C, ao lado da embalagem laranja para Tipo-C.',
    },
  },
] as const satisfies readonly ProductShape[];

export type Product = (typeof products)[number];
export type ProductId = Product['id'];

/** Query parameter of /produtos that opens one product's details (shareable, works with Back). */
export const productQueryParam = 'produto';

/** e.g. `/produtos?produto=cabo-usb-c-samsung-original` */
export function productPath(id: ProductId): string {
  return `${paths.products}?${new URLSearchParams({ [productQueryParam]: id }).toString()}`;
}

const productsById: ReadonlyMap<string, Product> = new Map(products.map((product) => [product.id, product]));

/** Resolves an untrusted `?produto=` value against the catalog; anything unknown is ignored. */
export function resolveProduct(value: string | null | undefined): Product | null {
  if (!value) return null;
  return productsById.get(value.trim().toLowerCase()) ?? null;
}

/**
 * Pre-filled WhatsApp text for one product: name, price and a line of context,
 * so the customer never has to type which product they mean. *Bold* is
 * WhatsApp's own formatting. It is never sent automatically.
 */
export function productWhatsappMessage(product: Product): string {
  return [
    'Olá! Vi no site da MARK e tenho interesse neste produto:',
    '',
    `*${product.name}*`,
    `Valor no site: ${formatPrice(product.price).text}`,
    product.summary,
    '',
    'Pode me passar mais detalhes?',
  ].join('\n');
}
