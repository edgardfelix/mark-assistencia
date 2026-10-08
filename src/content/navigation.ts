import { paths } from '@/routes/paths';

export interface NavItem {
  to: string;
  label: string;
}

export const primaryNav: readonly NavItem[] = [
  { to: paths.home, label: 'Início' },
  { to: paths.services, label: 'Serviços' },
  { to: paths.pricing, label: 'Preços' },
  { to: paths.products, label: 'Produtos' },
  { to: paths.company, label: 'Empresa' },
  { to: paths.reviews, label: 'Avaliações' },
  { to: paths.contact, label: 'Contato' },
];

export const legalNav: readonly NavItem[] = [
  { to: paths.privacy, label: 'Política de privacidade' },
  { to: paths.terms, label: 'Termos de uso' },
];
