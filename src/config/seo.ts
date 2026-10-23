import { gaMeasurementId } from '@/config/analytics';
import { paths } from '@/routes/paths';

/** sitemap.xml hints. Google ignores both (it reads only <lastmod>); other search engines may use them. */
export interface SitemapHints {
  changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  /** 0.0–1.0, relative to the other pages of this site. */
  priority: number;
}

export interface PageSeo {
  path: string;
  title: string;
  description: string;
  /** Breadcrumb label for structured data (inner pages). */
  breadcrumb?: string;
  noindex?: boolean;
  /** Required on indexable pages (enforced by seo.test.ts). */
  sitemap?: SitemapHints;
}

/** Titles ≤ 60 characters, descriptions ≤ 160 (enforced by seo.test.ts). */
export const pageSeo = {
  home: {
    path: paths.home,
    title: 'MARK ASSISTÊNCIA | Assistência de celulares em Osasco',
    description:
      'Troca de tela, bateria e conector de carga para iPhone e Android na Vila Yolanda, Osasco. Busca e entrega grátis e até 4x sem juros.',
    sitemap: { changeFrequency: 'weekly', priority: 1 },
  },
  services: {
    path: paths.services,
    title: 'Serviços de reparo de celular | MARK ASSISTÊNCIA',
    description:
      'Troca de tela, troca de bateria, conector de carga, outros reparos e acessórios para iPhone e Android. Busca e entrega grátis e até 4x sem juros.',
    breadcrumb: 'Serviços',
    sitemap: { changeFrequency: 'monthly', priority: 0.9 },
  },
  pricing: {
    path: paths.pricing,
    title: 'Preços | MARK ASSISTÊNCIA',
    description:
      'Valores de referência da MARK ASSISTÊNCIA: linhas Motorola, Samsung e Xiaomi por R$ 150,00 e iPhone a partir de R$ 200,00, em Osasco.',
    breadcrumb: 'Preços',
    sitemap: { changeFrequency: 'weekly', priority: 0.9 },
  },
  products: {
    path: paths.products,
    title: 'Produtos | MARK ASSISTÊNCIA',
    description:
      'Fone de ouvido JBL Tune 520BT, cabos USB-C Xiaomi, Samsung e Kaidi e carregador Motorola TurboPower 68W na MARK ASSISTÊNCIA, em Osasco.',
    breadcrumb: 'Produtos',
    sitemap: { changeFrequency: 'weekly', priority: 0.8 },
  },
  company: {
    path: paths.company,
    title: 'Sobre a MARK ASSISTÊNCIA | Vila Yolanda, Osasco',
    description:
      'Conheça a MARK ASSISTÊNCIA: assistência de celulares na Vila Yolanda, em Osasco, com mais de 600 atendimentos realizados.',
    breadcrumb: 'Empresa',
    sitemap: { changeFrequency: 'monthly', priority: 0.6 },
  },
  reviews: {
    path: paths.reviews,
    title: 'Avaliações de clientes | MARK ASSISTÊNCIA',
    description:
      'Avaliações no Google, comentários no Instagram e conversas no WhatsApp de clientes da MARK ASSISTÊNCIA, em Osasco.',
    breadcrumb: 'Avaliações',
    sitemap: { changeFrequency: 'monthly', priority: 0.7 },
  },
  contact: {
    path: paths.contact,
    title: 'Contato e endereço | MARK ASSISTÊNCIA',
    description:
      'Fale com a MARK ASSISTÊNCIA pelo WhatsApp (11) 97665-4797. Rua General Nelson Braga Moreira, 366, Vila Yolanda, Osasco. Das 7h às 20h.',
    breadcrumb: 'Contato',
    sitemap: { changeFrequency: 'monthly', priority: 0.8 },
  },
  privacy: {
    path: paths.privacy,
    title: 'Política de privacidade | MARK ASSISTÊNCIA',
    description: gaMeasurementId
      ? 'Como o site da MARK ASSISTÊNCIA trata dados pessoais: audiência medida com Google Analytics e dados do formulário nunca armazenados.'
      : 'Como o site da MARK ASSISTÊNCIA trata dados pessoais: sem cookies, sem rastreamento e sem armazenamento dos dados do formulário.',
    breadcrumb: 'Política de privacidade',
    sitemap: { changeFrequency: 'yearly', priority: 0.3 },
  },
  terms: {
    path: paths.terms,
    title: 'Termos de uso | MARK ASSISTÊNCIA',
    description: 'Condições de uso do site da MARK ASSISTÊNCIA, assistência de celulares na Vila Yolanda, em Osasco.',
    breadcrumb: 'Termos de uso',
    sitemap: { changeFrequency: 'yearly', priority: 0.3 },
  },
  notFound: {
    path: '/404',
    title: 'Página não encontrada | MARK ASSISTÊNCIA',
    description: 'A página procurada não existe no site da MARK ASSISTÊNCIA.',
    noindex: true,
  },
} as const satisfies Record<string, PageSeo>;
