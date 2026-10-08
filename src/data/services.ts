import { type WhatsappMessageKey } from '@/content/common';
import { type FeedbackShotId, feedbackQuotes, type FeedbackQuote } from '@/data/feedback';
import { type ImageId } from '@/lib/media';

/**
 * Service catalog. The list comes from the business's own material: the logo
 * ("Assistência · Reparos · Acessórios") and its promotional card ("Troca de
 * tela · Conector de carga · Troca de bateria"). iPhone and Android devices
 * appear in the business's photos, video and customer feedback.
 * "Sinais comuns" are generic symptoms each repair addresses — not promises.
 */
export interface ServiceImage {
  id: ImageId;
  alt: string;
  caption?: string;
}

export interface Service {
  slug: string;
  title: string;
  summary: string;
  description: string;
  /** Short list shown under the description, with its own heading. */
  points: { title: string; items: readonly string[] };
  image?: ServiceImage;
  inset?: ServiceImage;
  proof?: { quote: FeedbackQuote } | { shotId: FeedbackShotId; caption: string };
  whatsapp: WhatsappMessageKey;
  ctaLabel: string;
}

export const services: readonly Service[] = [
  {
    slug: 'troca-de-tela',
    title: 'Troca de tela',
    summary: 'Vidro trincado, manchas na imagem ou toque falhando.',
    description:
      'Quando a tela quebra, todo o uso do aparelho fica comprometido. Avaliamos o celular e fazemos a troca da tela, com o cuidado que um componente tão delicado exige.',
    points: {
      title: 'Sinais comuns',
      items: [
        'Vidro trincado ou estilhaçado',
        'Manchas, linhas ou falhas na imagem',
        'Toque que falha ou não responde',
      ],
    },
    image: {
      id: 'screen-cracked',
      alt: 'Celular Android com a tela trincada, segurado diante de um certificado emoldurado na parede amarela da loja.',
    },
    inset: {
      id: 'glass-removal',
      alt: 'Mãos removendo vidro estilhaçado de um iPhone com uma ferramenta de abertura.',
    },
    proof: { quote: feedbackQuotes.screenRepair },
    whatsapp: 'screen',
    ctaLabel: 'Orçamento de troca de tela',
  },
  {
    slug: 'troca-de-bateria',
    title: 'Troca de bateria',
    summary: 'Bateria que não dura ou aparelho que desliga sozinho.',
    description:
      'Bateria que acaba cedo demais, aparelho que desliga com carga sobrando ou bateria estufada: são sinais de que chegou a hora de trocar.',
    points: {
      title: 'Sinais comuns',
      items: ['Descarrega rápido demais', 'Desliga sozinho com carga sobrando', 'Bateria estufada ou aquecendo'],
    },
    image: {
      id: 'device-internals',
      alt: 'Aparelho aberto sobre a bancada, com os componentes internos expostos.',
    },
    proof: { shotId: 'feedback-7', caption: 'Conversa no WhatsApp: o cliente aprova o resultado do serviço.' },
    whatsapp: 'battery',
    ctaLabel: 'Orçamento de troca de bateria',
  },
  {
    slug: 'conector-de-carga',
    title: 'Conector de carga',
    summary: 'Celular que não carrega ou só carrega em uma posição.',
    description:
      'Se o celular não carrega, carrega devagar ou só funciona com o cabo em certa posição, o problema pode estar no conector de carga.',
    points: {
      title: 'Sinais comuns',
      items: ['Não carrega ou carrega devagar', 'Só funciona com o cabo em certa posição', 'Cabo frouxo na entrada'],
    },
    image: {
      id: 'bench-detail',
      alt: 'Mãos trabalhando em um celular sobre a bancada, entre peças e ferramentas.',
    },
    proof: {
      shotId: 'feedback-1',
      caption: 'Conversa no WhatsApp: a cliente confirma que o iPhone está carregando normalmente.',
    },
    whatsapp: 'charging',
    ctaLabel: 'Orçamento de conector de carga',
  },
  {
    slug: 'outros-reparos',
    title: 'Outros reparos',
    summary: 'Avaliação clara do aparelho e o reparo de que ele precisa.',
    description:
      'Seu problema não está na lista? Avaliamos o aparelho, explicamos com clareza o que precisa ser feito e seguimos com o reparo. Atendemos iPhone e Android.',
    points: {
      title: 'Como atendemos',
      items: ['iPhone e Android', 'Explicação clara do que precisa ser feito', 'Acompanhamento pelo WhatsApp'],
    },
    image: {
      id: 'repair-iphone-15-pro-max',
      alt: 'iPhone 15 Pro Max visto por trás, com o cartão de visita da MARK ao fundo e detalhes da lateral e da tela do aparelho.',
      caption: 'Reparo em iPhone 15 Pro Max 256 GB, divulgado pela loja.',
    },
    proof: { quote: feedbackQuotes.transparency },
    whatsapp: 'repair',
    ctaLabel: 'Pedir uma avaliação',
  },
  {
    slug: 'acessorios',
    title: 'Acessórios',
    summary: 'Itens para o dia a dia do seu celular.',
    description:
      'Além dos reparos, a MARK trabalha com acessórios para celular. Consulte pelo WhatsApp ou na loja o que está disponível.',
    points: { title: 'Disponibilidade', items: ['Consulte pelo WhatsApp', 'Ou confira direto na loja'] },
    whatsapp: 'accessories',
    ctaLabel: 'Consultar acessórios',
  },
];

export function getService(slug: string): Service {
  const service = services.find((s) => s.slug === slug);
  if (!service) throw new Error(`Unknown service: ${slug}`);
  return service;
}
