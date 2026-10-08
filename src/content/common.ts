/**
 * Shared copy: CTA labels and the pre-filled WhatsApp messages.
 * Every claim on the site is reviewed against src/config/business.ts.
 */
export const whatsappMessages = {
  general: 'Olá! Vi o site da MARK ASSISTÊNCIA e gostaria de falar com vocês.',
  service: 'Olá! Gostaria de saber mais sobre o atendimento da MARK ASSISTÊNCIA.',
  pickup: 'Olá! Gostaria de combinar a busca e a entrega do meu aparelho.',
  installments: 'Olá! Gostaria de saber mais sobre o pagamento em até 4x sem juros.',
  screen: 'Olá! Gostaria de um orçamento para troca de tela.',
  battery: 'Olá! Gostaria de um orçamento para troca de bateria.',
  charging: 'Olá! Meu celular está com problema para carregar e gostaria de um orçamento.',
  repair: 'Olá! Meu celular está com um problema e gostaria de uma avaliação.',
  accessories: 'Olá! Gostaria de saber quais acessórios vocês têm disponíveis.',
  visit: 'Olá! Gostaria de levar meu aparelho até a loja.',
} as const;

export type WhatsappMessageKey = keyof typeof whatsappMessages;

export const cta = {
  whatsapp: 'Chamar no WhatsApp',
  whatsappShort: 'WhatsApp',
  talkToMark: 'Falar com a MARK',
  wantService: 'Quero atendimento',
  meetMark: 'Conhecer a MARK',
  howItWorks: 'Ver como funciona',
  services: 'Ver serviços',
  allServices: 'Ver todos os serviços',
  reviews: 'Ver todas as avaliações',
  call: 'Ligar',
  email: 'Enviar e-mail',
  instagram: 'Abrir Instagram',
  googleMaps: 'Google Maps',
  waze: 'Waze',
  directions: 'Como chegar',
  pickup: 'Combinar busca',
  installments: 'Perguntar sobre parcelamento',
} as const;

export const facts = {
  completedServices: { value: '+600', label: 'atendimentos realizados' },
  pickup: { value: 'Grátis', label: 'busca e entrega do aparelho', short: 'Busca e entrega grátis' },
  installments: { value: '4x', label: 'sem juros no pagamento', short: 'Até 4x sem juros' },
} as const;

export const a11y = {
  skipToContent: 'Pular para o conteúdo',
  opensInNewTab: '(abre em nova aba)',
  mainNav: 'Navegação principal',
  footerNav: 'Navegação do rodapé',
  legalNav: 'Links legais',
  openMenu: 'Abrir menu',
  closeMenu: 'Fechar menu',
  pauseVideo: 'Pausar vídeo',
  playVideo: 'Reproduzir vídeo',
  pageLoading: 'Carregando página',
  routeChanged: (title: string) => `Página carregada: ${title}`,
} as const;
