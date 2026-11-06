// Páginas del sitio y lo que cada una tiene que declarar.
export const PAGINAS = ['/', '/sobre-mi/', '/proyectos/', '/contacto/'];

export const META: Record<string, { title: string | RegExp; description: RegExp; h1: string }> = {
  '/': {
    title: 'fmv · QA Engineer',
    description: /^QA con 4 años en sistemas bancarios/,
    h1: 'Hago QA en sistemas bancarios, donde un error le cuesta plata a alguien.',
  },
  '/sobre-mi/': {
    title: 'Sobre mí · fmv',
    description: /^Recorrido de fmv como QA: el CRM de un banco/,
    h1: 'De la pantalla del CRM al batch del mainframe',
  },
  '/proyectos/': {
    title: 'Proyectos · fmv',
    description: /^Repos públicos de fmv en GitHub/,
    h1: 'Proyectos',
  },
  '/contacto/': {
    title: 'Contacto · fmv',
    description: /^Escribime y coordinamos una entrevista\.$/,
    h1: '¿Buscás QA para un equipo de banca o fintech?',
  },
};
