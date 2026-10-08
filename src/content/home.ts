import { display } from '@/lib/format';

export const homeContent = {
  hero: {
    eyebrow: 'Assistência de celulares',
    eyebrowLocation: ' · Vila Yolanda, Osasco',
    titleLead: 'Reparo preciso.',
    titleAccent: 'Atendimento de perto.',
    lead: 'Troca de tela, bateria e conector de carga para iPhone e Android, na Vila Yolanda, em Osasco. Buscamos e entregamos o seu aparelho sem custo.',
    posterAlt: 'Mãos trabalhando em um iPhone aberto na bancada, com peças e ferramentas ao redor.',
  },
  trust: {
    title: 'A MARK em números e facilidades',
    hoursLabel: 'horário de atendimento',
  },
  services: {
    eyebrow: 'Serviços',
    title: 'O reparo certo para cada problema.',
    intro:
      'Do vidro trincado à bateria que não segura carga: avaliamos o aparelho, explicamos o que precisa ser feito e cuidamos do reparo.',
  },
  process: {
    eyebrow: 'Como funciona',
    title: 'Do primeiro contato à entrega, tudo combinado com você.',
    steps: [
      { title: 'Você chama', text: 'Conte pelo WhatsApp ou por telefone o que aconteceu com o aparelho.' },
      {
        title: 'Buscamos ou você traz',
        text: 'A busca e a entrega são grátis. Se preferir, venha até a loja na Vila Yolanda.',
      },
      { title: 'Avaliação clara', text: 'Avaliamos o aparelho e explicamos o que precisa ser feito.' },
      {
        title: 'Reparo e devolução',
        text: 'Com o serviço concluído, o aparelho volta para você, na loja ou no seu endereço.',
      },
    ],
    pickup: {
      title: 'Busca e entrega grátis',
      text: 'Você não precisa sair de casa: combine pelo WhatsApp a busca e a entrega do seu aparelho.',
      routeFrom: 'Seu endereço',
      routeTo: 'Bancada MARK',
    },
    installments: {
      value: '4x',
      title: 'sem juros',
      text: 'Pague o serviço em até 4 parcelas sem juros.',
    },
  },
  proof: {
    eyebrow: 'Avaliações',
    title: 'Quem passou pela MARK conta como foi.',
    sourceNote: 'Avaliação de 5 estrelas no Google',
  },
  visit: {
    eyebrow: 'Visite a loja',
    title: 'Na Vila Yolanda, em Osasco.',
    text: `${display.addressLine1}. Atendimento das ${display.hours}.`,
    imageAlt:
      'Interior da loja da MARK ASSISTÊNCIA: parede amarela com o letreiro iluminado da marca, bancada de reparo com ferramentas e cadeira de trabalho.',
    imageCaption: 'O espaço da MARK ASSISTÊNCIA.',
  },
  finalCta: {
    eyebrow: 'Atendimento',
    title: 'Conte o que aconteceu com o seu celular.',
    text: `Fale com a MARK pelo WhatsApp ou por telefone, das ${display.hours}. A busca e a entrega são por nossa conta.`,
  },
} as const;
