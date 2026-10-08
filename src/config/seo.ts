import { paths } from '@/routes/paths';

export interface PageSeo {
  path: string;
  title: string;
  description: string;
  /** Breadcrumb label for structured data (inner pages). */
  breadcrumb?: string;
  noindex?: boolean;
}

/** Titles ≤ 60 characters, descriptions ≤ 160 (enforced by seo.test.ts). */
export const pageSeo = {
  home: {
    path: paths.home,
    title: 'MARK ASSISTÊNCIA | Assistência de celulares em Osasco',
    description:
      'Troca de tela, bateria e conector de carga para iPhone e Android na Vila Yolanda, Osasco. Busca e entrega grátis e até 4x sem juros.',
  },
  services: {
    path: paths.services,
    title: 'Serviços de reparo de celular | MARK ASSISTÊNCIA',
    description:
      'Troca de tela, troca de bateria, conector de carga, outros reparos e acessórios para iPhone e Android. Busca e entrega grátis e até 4x sem juros.',
    breadcrumb: 'Serviços',
  },
  pricing: {
    path: paths.pricing,
    title: 'Preços | MARK ASSISTÊNCIA',
    description:
      'Valores de referência da MARK ASSISTÊNCIA: linhas Motorola, Samsung e Xiaomi por R$ 150,00 e iPhone a partir de R$ 200,00, em Osasco.',
    breadcrumb: 'Preços',
  },
  products: {
    path: paths.products,
    title: 'Produtos | MARK ASSISTÊNCIA',
    description:
      'Fone de ouvido JBL Tune 520BT, cabos USB-C Xiaomi, Samsung e Kaidi e carregador Motorola TurboPower 68W na MARK ASSISTÊNCIA, em Osasco.',
    breadcrumb: 'Produtos',
  },
  company: {
    path: paths.company,
    title: 'Sobre a MARK ASSISTÊNCIA | Vila Yolanda, Osasco',
    description:
      'Conheça a MARK ASSISTÊNCIA: assistência de celulares na Vila Yolanda, em Osasco, com mais de 600 atendimentos realizados.',
    breadcrumb: 'Empresa',
  },
  reviews: {
    path: paths.reviews,
    title: 'Avaliações de clientes | MARK ASSISTÊNCIA',
    description:
      'Avaliações no Google, comentários no Instagram e conversas no WhatsApp de clientes da MARK ASSISTÊNCIA, em Osasco.',
    breadcrumb: 'Avaliações',
  },
  contact: {
    path: paths.contact,
    title: 'Contato e endereço | MARK ASSISTÊNCIA',
    description:
      'Fale com a MARK ASSISTÊNCIA pelo WhatsApp (11) 97665-4797. Rua General Nelson Braga Moreira, 366, Vila Yolanda, Osasco. Das 7h às 20h.',
    breadcrumb: 'Contato',
  },
  privacy: {
    path: paths.privacy,
    title: 'Política de privacidade | MARK ASSISTÊNCIA',
    description:
      'Como o site da MARK ASSISTÊNCIA trata dados pessoais: sem cookies, sem rastreamento e sem armazenamento dos dados do formulário.',
    breadcrumb: 'Política de privacidade',
  },
  terms: {
    path: paths.terms,
    title: 'Termos de uso | MARK ASSISTÊNCIA',
    description: 'Condições de uso do site da MARK ASSISTÊNCIA, assistência de celulares na Vila Yolanda, em Osasco.',
    breadcrumb: 'Termos de uso',
  },
  notFound: {
    path: '/404',
    title: 'Página não encontrada | MARK ASSISTÊNCIA',
    description: 'A página procurada não existe no site da MARK ASSISTÊNCIA.',
    noindex: true,
  },
} as const satisfies Record<string, PageSeo>;
