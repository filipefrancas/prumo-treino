import type { Exercise } from '../../types.ts';

/** Ficha A · Pernas. O glúteo é o motor da corrida. */
const ex: Exercise = {
  id: 'elevacao-pelvica',
  name: 'Elevação pélvica com barra',
  aka: ['Hip thrust', 'Elevação de quadril com barra'],
  kind: 'forca',
  group: 'gluteos',
  muscles: {
    primary: ['glúteo máximo'],
    secondary: ['posteriores de coxa', 'quadríceps'],
  },
  equipment: ['barra', 'banco'],
  how: [
    'Sente no chão com a parte de cima das costas apoiada na lateral de um banco e a barra sobre o quadril, com uma proteção.',
    'Apoie os pés inteiros no chão, na largura do quadril, com os joelhos dobrados.',
    'Empurre o chão com os calcanhares e suba o quadril até o tronco ficar reto, paralelo ao chão.',
    'Aperte os glúteos um instante no alto e desça devagar, sem encostar de vez no chão.',
  ],
  cues: [
    'Sinta os glúteos, não a lombar.',
    'No alto, as canelas ficam na vertical e o queixo levemente para baixo.',
    'Costelas para baixo: o movimento é do quadril, não de arquear as costas.',
  ],
  mistakes: [
    'Arquear a lombar no alto para subir mais',
    'Pés longe demais, o que joga o esforço para a parte de trás da coxa',
    'Subir de tranco e descer sem controle',
  ],
  breath: 'Solte o ar ao subir e puxe o ar ao descer.',
  easier: 'Faça sem barra, só com o peso do corpo, ou na máquina de elevação pélvica.',
  harder: 'Segure 2 segundos no alto em cada repetição.',
  swap: ['ponte-de-gluteo', 'leg-press-45'],
  yt: 'elevação pélvica com barra execução correta',
};

export default ex;
