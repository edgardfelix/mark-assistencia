/**
 * Real customer feedback, provided by the business as screenshots.
 *
 * Rules applied here:
 *  - Quotes are verbatim (original spelling and punctuation preserved).
 *    A trailing "[…]" marks text that is truncated in the screenshot itself.
 *  - Customer names are not repeated in page text (data minimization); they
 *    remain only where the original screenshot shows them.
 *  - Alt texts describe what is visible without adding meaning.
 */
export type FeedbackSource = 'google' | 'instagram' | 'whatsapp';

export const feedbackSourceLabel: Record<FeedbackSource, string> = {
  google: 'Google',
  instagram: 'Instagram',
  whatsapp: 'WhatsApp',
};

export type FeedbackShotId = `feedback-${1 | 2 | 3 | 4 | 5 | 6 | 7}`;

export interface FeedbackShot {
  id: FeedbackShotId;
  source: FeedbackSource;
  caption: string;
  alt: string;
}

export const feedbackShots: readonly FeedbackShot[] = [
  {
    id: 'feedback-4',
    source: 'google',
    caption: 'Avaliação de 5 estrelas no Google.',
    alt: 'Avaliação de 5 estrelas no Google: “Excelente atendimento! Profissional de qualidade e com preço justo. Entreguei um celular e em um dia estava pronto. Recomendo!”',
  },
  {
    id: 'feedback-3',
    source: 'whatsapp',
    caption: 'Cliente agradece pelo resultado; a loja lembra que busca e entrega.',
    alt: 'Conversa no WhatsApp. A loja pergunta “E o celular, como ficou?” e a cliente responde: “Graça a DEUS E você está otimo muito obrigada e DEUS te abençõe ajudou de mais”. A loja responde “Que bom, fico feliz”, pede indicações, comenta que busca e entrega e envia uma arte com os serviços troca de tela, conector de carga e troca de bateria.',
  },
  {
    id: 'feedback-6',
    source: 'instagram',
    caption: 'Comentários de clientes no Instagram.',
    alt: 'Comentários no Instagram: “Super recomendo! Cara bom no que faz, trabalho bem executado no meu G52 e preço justo! RECOMENDO” e “Ficou perfeito”.',
  },
  {
    id: 'feedback-5',
    source: 'google',
    caption: 'Três avaliações de 5 estrelas no Google.',
    alt: 'Lista de avaliações de 5 estrelas no Google. Trechos: “Muito top, atendimento excelente!!! Só arrumo meu celular aqui, transparente com oque realmente precisa ser feito!!!”; “Além do reparo da tela trocou a câmera, e não cobrou por isso. Muito bom atendimento.”; e “Meu celular quebrou e eu fiquei desesperada para arrumar, porque precisava dele para trabalhar no dia seguinte. Eles abrem de domingo e, logo que cheguei, fui super bem atendida”, com o restante cortado na captura.',
  },
  {
    id: 'feedback-1',
    source: 'whatsapp',
    caption: 'Cliente confirma que o iPhone está carregando normalmente.',
    alt: 'Conversa no WhatsApp. A loja pergunta “Seu iPhone tá carregando de boa?” e a cliente responde “Ta simmmm, obrigadaaa”.',
  },
  {
    id: 'feedback-7',
    source: 'whatsapp',
    caption: 'Cliente aprova o resultado do serviço.',
    alt: 'Conversa no WhatsApp com a miniatura de um vídeo que mostra a bateria de um aparelho Samsung aberto. O cliente responde: “O Marcel obg ficou bom Deus abençoe vcs.”',
  },
  {
    id: 'feedback-2',
    source: 'whatsapp',
    caption: 'Aviso de entrega e agradecimento do cliente.',
    alt: 'Conversa no WhatsApp. A loja avisa “Deixei com seu haroldo” e o cliente responde “Valeu mano tmj”, seguido de mensagens de áudio.',
  },
];

export interface FeedbackQuote {
  text: string;
  source: FeedbackSource;
  /** Star rating shown in the original screenshot, when there is one. */
  rating?: 5;
  shotId: FeedbackShotId;
}

export const feedbackQuotes = {
  serviceAndPrice: {
    text: 'Excelente atendimento! Profissional de qualidade e com preço justo. Entreguei um celular e em um dia estava pronto. Recomendo!',
    source: 'google',
    rating: 5,
    shotId: 'feedback-4',
  },
  transparency: {
    text: 'Muito top, atendimento excelente!!! Só arrumo meu celular aqui, transparente com oque realmente precisa ser feito!!! […]',
    source: 'google',
    rating: 5,
    shotId: 'feedback-5',
  },
  screenRepair: {
    text: 'Além do reparo da tela trocou a câmera, e não cobrou por isso. Muito bom atendimento.',
    source: 'google',
    rating: 5,
    shotId: 'feedback-5',
  },
  instagram: {
    text: 'Super recomendo! Cara bom no que faz, trabalho bem executado no meu G52 e preço justo! RECOMENDO',
    source: 'instagram',
    shotId: 'feedback-6',
  },
} as const satisfies Record<string, FeedbackQuote>;

export function getShot(id: FeedbackShotId): FeedbackShot {
  const shot = feedbackShots.find((s) => s.id === id);
  if (!shot) throw new Error(`Unknown feedback shot: ${id}`);
  return shot;
}
