import { display } from '@/lib/format';

export const servicesContent = {
  hero: {
    eyebrow: 'Serviços',
    title: 'Reparos para iPhone e Android, feitos com precisão.',
    lead: 'Troca de tela, de bateria e de conector de carga, outros reparos e acessórios. Com busca e entrega grátis e pagamento em até 4x sem juros.',
    jumpLabel: 'Ir para o serviço',
    imageAlt: 'iPhone com a tela ligada, segurado diante da bancada de reparo, com o cartão de visita da MARK ao lado.',
  },
  proofLabel: 'O que diz quem já fez',
  accessoriesProducts: 'Ver produtos',
  conveniences: {
    eyebrow: 'Facilidades',
    title: 'Mais simples do que você imagina.',
  },
  cta: {
    eyebrow: 'Orçamento',
    title: 'Não sabe qual é o problema?',
    text: 'Descreva o que está acontecendo com o aparelho. A MARK avalia e explica o que precisa ser feito.',
  },
} as const;

/** Copy of the prices page. The values themselves live in src/data/pricing.ts. */
export const pricingContent = {
  hero: {
    eyebrow: 'Preços',
    title: 'Clareza para escolher.',
    titleAccent: 'Simplicidade para começar.',
    lead: 'Confira os valores de referência da MARK e fale com a equipe para confirmar o atendimento ideal para o seu caso.',
    jumpLabel: 'Ir para a opção',
  },
  system: {
    eyebrow: 'Valores de referência',
    title: 'Escolha a linha do seu aparelho.',
    intro:
      'Ao escolher uma opção, você segue para o contato com ela já identificada. É só confirmar o atendimento com a MARK.',
    referenceLabel: 'Valor de referência',
    choose: 'Escolher esta opção',
  },
  note: {
    title: 'Sobre os valores',
    text: 'Valores de referência informados pela MARK. O valor final pode variar conforme a avaliação do aparelho e o serviço necessário.',
  },
  conveniences: {
    title: 'Facilidades da MARK',
  },
  cta: {
    eyebrow: 'Atendimento',
    title: 'Já sabe o que precisa?',
    text: 'Escolha uma opção e fale diretamente com a MARK para confirmar o atendimento.',
    legend: 'Escolha uma opção',
    submit: 'Escolher e falar com a MARK',
    error: 'Escolha uma das opções para continuar.',
    unsure: 'Prefere conversar antes?',
  },
} as const;

/** Copy of the products page. Names, descriptions and prices live in src/data/products.ts. */
export const productsContent = {
  hero: {
    eyebrow: 'Produtos',
    title: 'Acessórios para o seu dia a dia.',
    titleAccent: 'Escolha e fale com a MARK.',
    lead: 'Fone de ouvido, cabos e carregador, com os valores informados pela MARK. Abra um produto para ver os detalhes ou chame direto no WhatsApp.',
  },
  catalog: {
    eyebrow: 'Catálogo',
    title: 'Escolha o seu acessório.',
    note: 'Valores informados pela MARK. A disponibilidade é confirmada no atendimento pelo WhatsApp.',
  },
  card: {
    details: ', ver detalhes',
    cta: 'Tenho interesse',
    ctaContext: (name: string) => `no produto ${name}`,
  },
  sheet: {
    close: 'Fechar detalhes do produto',
    cta: 'Consultar pelo WhatsApp',
    hint: 'O WhatsApp abre com a mensagem pronta, com o nome e o valor do produto. É só revisar e enviar.',
  },
  cta: {
    eyebrow: 'Atendimento',
    title: 'Procura outro acessório?',
    text: 'Pergunte pelo WhatsApp o que a MARK tem disponível na loja.',
  },
} as const;

export const companyContent = {
  hero: {
    eyebrow: 'Empresa',
    title: 'Assistência de celulares na Vila Yolanda, em Osasco.',
    lead: 'A MARK ASSISTÊNCIA cuida de reparos e acessórios para celular, com atendimento próximo, busca e entrega grátis e pagamento facilitado.',
    imageAlt:
      'Interior da loja da MARK ASSISTÊNCIA: parede amarela com o letreiro iluminado da marca, quadros, certificado emoldurado e bancada de reparo.',
  },
  stat: {
    value: '+600',
    label: 'atendimentos realizados',
    text: 'Mais de 600 atendimentos realizados até aqui — e clientes que voltam e recomendam.',
  },
  principles: {
    eyebrow: 'Nosso jeito de trabalhar',
    title: 'Cuidado que aparece nos detalhes.',
    items: [
      {
        title: 'Clareza do início ao fim',
        text: 'Avaliamos o aparelho e explicamos o que precisa ser feito, sem rodeios.',
        quote: 'transparency',
      },
      {
        title: 'Atendimento próximo',
        text: 'Atendimento pelo WhatsApp, por telefone ou na loja, com acompanhamento do seu aparelho.',
        quote: 'serviceAndPrice',
      },
      {
        title: 'Conveniência de verdade',
        text: `Busca e entrega grátis, pagamento em até 4x sem juros e atendimento das ${display.hours}.`,
      },
    ],
  },
  workshop: {
    eyebrow: 'A bancada',
    title: 'Onde o reparo acontece.',
    text: 'Imagens reais da loja: a bancada, as ferramentas e o dia a dia do trabalho com os aparelhos.',
    images: {
      bench: {
        alt: 'iPhone com a tela ligada, segurado diante da bancada de reparo, com o cartão de visita da MARK ao lado.',
      },
      precision: {
        alt: 'Mãos trabalhando em um iPhone na bancada, entre peças e ferramentas.',
        caption: 'Reparo em andamento na bancada.',
      },
      certificate: {
        alt: 'Certificado emoldurado do Curso de Manutenção de Celulares, módulos Android, Tablet e iPhone.',
        caption: 'Certificado do curso de manutenção de celulares (módulos Android, tablet e iPhone), exposto na loja.',
      },
    },
  },
  identity: {
    eyebrow: 'Dados da empresa',
    title: 'Transparência também é isso.',
    labels: {
      name: 'Nome',
      cnpj: 'CNPJ',
      address: 'Endereço',
      hours: 'Horário',
      phone: 'Telefone e WhatsApp',
      email: 'E-mail',
      instagram: 'Instagram',
    },
  },
  cta: {
    eyebrow: 'Atendimento',
    title: 'Conheça a MARK de perto.',
    text: 'Venha até a loja na Vila Yolanda ou chame no WhatsApp para combinar a busca do seu aparelho.',
  },
} as const;

export const reviewsContent = {
  hero: {
    eyebrow: 'Avaliações',
    title: 'O que dizem os clientes da MARK.',
    lead: 'Avaliações no Google, comentários no Instagram e conversas no WhatsApp, reproduzidos a partir de capturas de tela reais.',
  },
  featured: {
    eyebrow: 'Em destaque',
    title: 'Nas palavras de quem já foi atendido.',
  },
  gallery: {
    eyebrow: 'Capturas de tela',
    title: 'Veja as mensagens originais.',
    filterLabel: 'Filtrar por origem',
    all: 'Todas',
    open: 'Ampliar captura',
    count: (n: number) => (n === 1 ? '1 captura' : `${n} capturas`),
  },
  lightbox: {
    close: 'Fechar',
    previous: 'Captura anterior',
    next: 'Próxima captura',
    position: (current: number, total: number) => `${current} de ${total}`,
  },
  cta: {
    eyebrow: 'Atendimento',
    title: 'Seu celular pode ser o próximo.',
    text: 'Chame a MARK no WhatsApp e conte o que está acontecendo com o aparelho.',
  },
} as const;

export const contactContent = {
  hero: {
    eyebrow: 'Contato',
    title: 'Fale com a MARK.',
    lead: `Atendimento das ${display.hours}. Chame no WhatsApp, ligue ou venha até a loja na Vila Yolanda, em Osasco.`,
  },
  channels: {
    title: 'Canais de atendimento',
    whatsapp: { label: 'WhatsApp', hint: 'Mande uma mensagem e combine o atendimento.' },
    phone: { label: 'Telefone' },
    email: { label: 'E-mail' },
    instagram: { label: 'Instagram' },
    address: { label: 'Endereço' },
    hours: { label: 'Horário de atendimento', value: `Das ${display.hours}` },
  },
  /** Shown when the visitor arrives from the prices page (`?servico=`). */
  selection: {
    label: 'Serviço selecionado',
    note: 'Valor de referência. O valor final pode variar conforme a avaliação do aparelho e o serviço necessário.',
    action: 'Falar com a MARK',
    change: 'Ver outros preços',
    formContext: 'Opção escolhida',
  },
  form: {
    eyebrow: 'Mensagem',
    title: 'Monte sua mensagem.',
    intro:
      'Preencha os campos e a mensagem abre pronta no WhatsApp para você revisar e enviar. Nada do que você digitar fica armazenado neste site.',
    fields: {
      name: { label: 'Seu nome', placeholder: 'Como podemos chamar você?' },
      device: { label: 'Modelo do aparelho', optional: '(opcional)', placeholder: 'Ex.: iPhone 13' },
      subject: { legend: 'Assunto' },
      message: { label: 'Mensagem', placeholder: 'Conte o que aconteceu com o aparelho', hint: 'Até 600 caracteres.' },
    },
    submitWhatsapp: 'Abrir no WhatsApp',
    submitEmail: 'Enviar por e-mail',
    note: 'A mensagem abre no WhatsApp ou no seu aplicativo de e-mail para você revisar e enviar.',
    privacyLink: 'Política de privacidade',
    errorSummary: 'Revise os campos destacados para continuar.',
    success: {
      whatsapp: {
        title: 'Sua mensagem está pronta no WhatsApp.',
        text: 'Abrimos o WhatsApp em uma nova aba com o texto preenchido. Revise e toque em enviar para falar com a MARK.',
        fallback: 'Se a aba não abriu, use o botão abaixo.',
        action: 'Abrir o WhatsApp',
      },
      email: {
        title: 'Sua mensagem está pronta no e-mail.',
        text: 'Seu aplicativo de e-mail deve abrir com o texto preenchido. Revise e envie para falar com a MARK.',
        fallback: 'Se nada abriu, escreva para o endereço abaixo.',
        action: 'Abrir o e-mail',
      },
      again: 'Escrever outra mensagem',
    },
  },
} as const;

export const notFoundContent = {
  code: '404',
  title: 'Esta página não existe.',
  text: 'O endereço pode ter mudado ou estar incorreto. Escolha um caminho abaixo ou fale direto com a MARK.',
  home: 'Voltar para o início',
} as const;

export const errorContent = {
  title: 'Algo não saiu como esperado.',
  text: 'Não foi possível carregar esta página. Tente novamente ou fale com a MARK pelo WhatsApp.',
  outdatedTitle: 'Há uma versão mais recente do site.',
  outdatedText: 'Recarregue a página para continuar navegando.',
  retry: 'Recarregar a página',
} as const;
