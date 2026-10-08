export const paths = {
  home: '/',
  services: '/servicos',
  pricing: '/precos',
  products: '/produtos',
  company: '/empresa',
  reviews: '/avaliacoes',
  contact: '/contato',
  privacy: '/privacidade',
  terms: '/termos',
} as const;

export type AppPath = (typeof paths)[keyof typeof paths];
