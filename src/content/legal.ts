import { business } from '@/config/business';
import { display } from '@/lib/format';

/**
 * Legal texts. They describe only what this site actually does: no cookies,
 * no analytics, no ad pixels, no server-side storage of form data.
 * If any of that changes (analytics, a form endpoint), these texts must change too.
 * Review by the business owner (and, ideally, legal counsel) before publishing.
 */
export interface LegalSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  items?: readonly string[];
  /** Renders the business contact links at the end of the section. */
  withContact?: boolean;
}

export interface LegalDocument {
  eyebrow: string;
  title: string;
  lead: string;
  updatedAt: { iso: string; label: string };
  tocLabel: string;
  sections: readonly LegalSection[];
}

const updatedAt = { iso: '2026-10-07', label: '7 de outubro de 2026' };
/** The terms changed when the prices page was published (reference values). */
const termsUpdatedAt = { iso: '2026-10-08', label: '8 de outubro de 2026' };

export const privacyPolicy: LegalDocument = {
  eyebrow: 'Privacidade',
  title: 'Política de privacidade',
  lead: 'Como o site da MARK ASSISTÊNCIA lida com dados pessoais, em linguagem direta.',
  updatedAt,
  tocLabel: 'Nesta página',
  sections: [
    {
      id: 'quem-somos',
      title: 'Quem somos',
      paragraphs: [
        `Este site pertence à ${business.name}, inscrita no CNPJ ${display.cnpj}, com endereço na ${display.addressFull}.`,
        'Para qualquer assunto relacionado a dados pessoais, fale com a gente pelos canais abaixo.',
      ],
      withContact: true,
    },
    {
      id: 'dados-coletados',
      title: 'Quais dados este site coleta',
      paragraphs: [
        'Este site não usa cookies, não tem ferramentas de análise de audiência ou de publicidade e não armazena dados pessoais.',
        'O formulário da página de contato não envia dados para nenhum servidor. Ele apenas monta uma mensagem com o que você preencher e a abre no WhatsApp ou no seu aplicativo de e-mail, onde você revisa e decide se envia.',
      ],
    },
    {
      id: 'dados-tecnicos',
      title: 'Dados técnicos de acesso',
      paragraphs: [
        'Como acontece com qualquer site, o serviço de hospedagem pode registrar automaticamente dados técnicos das requisições — como endereço IP, data e hora do acesso e tipo de navegador — para garantir a segurança e o funcionamento do site.',
      ],
    },
    {
      id: 'contato-com-a-loja',
      title: 'Quando você fala com a MARK',
      paragraphs: [
        'Ao entrar em contato pelo WhatsApp, por telefone, por e-mail ou pelo Instagram, você compartilha os dados que escolher informar, como nome, telefone e detalhes do aparelho. Esses dados são usados para responder ao seu contato e prestar o atendimento solicitado.',
        'Essas conversas acontecem em serviços de terceiros (como WhatsApp, Instagram e provedores de e-mail), que têm as próprias políticas de privacidade.',
      ],
    },
    {
      id: 'links-externos',
      title: 'Links para outros sites',
      paragraphs: [
        'O site tem links para WhatsApp, Instagram, Google Maps e Waze. Ao acessá-los, você passa a estar sujeito às políticas de privacidade desses serviços.',
      ],
    },
    {
      id: 'seus-direitos',
      title: 'Seus direitos',
      paragraphs: [
        'A Lei Geral de Proteção de Dados (Lei nº 13.709/2018) garante a você, entre outros, os direitos de:',
      ],
      items: [
        'confirmar se existe tratamento dos seus dados;',
        'acessar os dados que tivermos sobre você;',
        'corrigir dados incompletos, inexatos ou desatualizados;',
        'pedir a eliminação dos dados tratados com o seu consentimento.',
      ],
      withContact: true,
    },
    {
      id: 'alteracoes',
      title: 'Alterações nesta política',
      paragraphs: [
        'Se o site passar a coletar outros dados, esta política será atualizada antes. A data da última atualização aparece no início da página.',
      ],
    },
  ],
};

export const termsOfUse: LegalDocument = {
  eyebrow: 'Termos',
  title: 'Termos de uso',
  lead: 'Condições para usar o site da MARK ASSISTÊNCIA.',
  updatedAt: termsUpdatedAt,
  tocLabel: 'Nesta página',
  sections: [
    {
      id: 'sobre-o-site',
      title: 'Sobre este site',
      paragraphs: [
        `Este site apresenta a ${business.name}, seus serviços e seus canais de atendimento. Ao navegar por ele, você concorda com estes termos.`,
      ],
    },
    {
      id: 'informacoes',
      title: 'Informações e condições',
      paragraphs: [
        'As informações do site têm caráter geral e não constituem uma proposta de serviço. Os preços da página Preços são valores de referência informados pela MARK: o valor final, os prazos e as condições de cada atendimento são confirmados diretamente com a MARK, conforme a avaliação do aparelho e o serviço necessário.',
        'As condições divulgadas — busca e entrega grátis e pagamento em até 4x sem juros — podem ser confirmadas no atendimento.',
      ],
    },
    {
      id: 'avaliacoes',
      title: 'Avaliações exibidas',
      paragraphs: [
        'As avaliações do site são capturas de tela de manifestações reais de clientes no Google, no Instagram e no WhatsApp. Os trechos citados em texto reproduzem essas capturas sem alterações de conteúdo.',
      ],
    },
    {
      id: 'marcas',
      title: 'Marcas de terceiros',
      paragraphs: [
        'iPhone é marca da Apple Inc. e Android é marca da Google LLC. Essas e outras marcas citadas pertencem aos seus titulares e aparecem apenas para indicar os aparelhos atendidos, sem sugerir vínculo ou parceria.',
      ],
    },
    {
      id: 'propriedade-intelectual',
      title: 'Propriedade intelectual',
      paragraphs: [
        `A marca ${business.name}, o logotipo, os textos, as fotos e os vídeos deste site não podem ser reproduzidos sem autorização.`,
      ],
    },
    {
      id: 'links-externos',
      title: 'Links externos',
      paragraphs: [
        'Os links para WhatsApp, Instagram, Google Maps e Waze levam a serviços de terceiros, com termos e políticas próprios.',
      ],
    },
    {
      id: 'contato',
      title: 'Contato',
      paragraphs: ['Dúvidas sobre estes termos podem ser enviadas pelos canais abaixo.'],
      withContact: true,
    },
  ],
};
