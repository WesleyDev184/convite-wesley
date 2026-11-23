export const content = {
  siteUrl: 'https://convite-wesley.vercel.app', // trocar se o domínio mudar
  name: 'Wesley',
  course: 'Cientista da Computaria',
  tagline: { title: 'The Graduation Tour', subtitle: 'o último show da turnê' },
  message:
    'Foram anos de noites em claro, provas, código que não compilava e café que não acabava. Nada disso teria sido possível sem as pessoas que estiveram ao meu lado. Agora chegou a hora de celebrar, e eu quero você comigo.',
  event: {
    title: 'Formatura do Wesley — Ciência da Computação',
    start: '2027-01-16T19:00:00-03:00',
    end: '2027-01-17T00:00:00-03:00',
    timeZone: 'America/Sao_Paulo',
    dateLabel: '16 · JAN · 2027',
    timeLabel: '19h',
  },
  setlist: [
    { title: 'Confraternização', time: '19h' },
    { title: 'Churrasco' },
    { title: 'Bar' },
    { title: 'Música' },
    { title: 'Fim', time: 'até onde aguentar' },
  ],
  venue: {
    name: 'Loja Maçônica Acácia do Araguaia',
    address: '',
    mapsUrl: 'https://maps.app.goo.gl/Uh7gPGWeX3BZjBfYA',
  },
  rsvp: {
    title: 'Confirme sua presença',
    deadlineLabel: 'Confirme até 26/12/2026',
    tallyEmbedUrl:
      'https://tally.so/embed/Qo7JpG?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1',
    tallyFormUrl: 'https://tally.so/r/Qo7JpG',
  },
  credits:
    'Obrigado por fazer parte dessa conquista. Nos vemos lá!',
  easter: {
    familyCourse: 'Bacharel em Ciência da Computação (versão para a família)',
    whatsappMessage: 'Desbloqueei o código secreto do convite! Quero meu brinde misterioso 🎁',
  },
  og: {
    title: 'Wesley · The Graduation Tour',
    description: 'Você está convidado para a formatura em Ciência da Computação — 16/01/2027, 19h.',
    image: '/og.png',
  },
};

export const REQUIRED_FIELDS = [
  'name', 'course', 'message', 'event.start', 'event.dateLabel', 'event.timeLabel',
  'venue.name', 'venue.mapsUrl', 'rsvp.tallyEmbedUrl', 'rsvp.tallyFormUrl', 'siteUrl',
];
