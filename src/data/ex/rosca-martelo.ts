import type { Exercise } from '../../types.ts';

/** Ficha C · Braços e ombros. Fecha o bíceps, com mais repetições. */
const ex: Exercise = {
  id: 'rosca-martelo',
  name: 'Rosca martelo com halteres',
  aka: ['Rosca martelo', 'Rosca neutra', 'Hammer curl'],
  kind: 'forca',
  group: 'biceps',
  muscles: {
    primary: ['braquial', 'braquiorradial'],
    secondary: ['bíceps'],
  },
  equipment: ['halteres'],
  how: [
    'Fique em pé com um halter em cada mão, braços ao lado do corpo e palmas viradas para as coxas.',
    'Cole os cotovelos ao lado do tronco e firme o abdômen.',
    'Suba os halteres até perto dos ombros, sem girar os punhos, como quem segura um martelo.',
    'Desça devagar até estender os braços.',
  ],
  cues: [
    'Polegares para cima do começo ao fim.',
    'Sinta a lateral do braço e o antebraço, além do bíceps.',
    'Cotovelos parados ao lado das costelas.',
  ],
  mistakes: [
    'Balançar o corpo para dar impulso aos halteres',
    'Girar os punhos durante a subida',
    'Levar os cotovelos para a frente para encurtar o movimento',
  ],
  breath: 'Solte o ar ao subir os halteres e puxe o ar na descida.',
  easier: 'Suba um braço de cada vez, sentado no banco.',
  harder: 'Desça em 3 segundos e não descanse com os braços estendidos.',
  swap: ['rosca-direta-barra', 'rosca-banco-inclinado'],
  yt: 'rosca martelo com halteres execução correta',
};

export default ex;
