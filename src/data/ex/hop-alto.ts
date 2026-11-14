import type { Exercise } from '../../types.ts';

/** Educativo de corrida: o hop com salto mais alto e joelho na altura do quadril. */
const ex: Exercise = {
  id: 'hop-alto',
  name: 'Hop alto',
  aka: ['Saltito alto'],
  kind: 'educativo',
  group: 'pernas',
  muscles: {
    primary: ['quadríceps', 'glúteo máximo'],
    secondary: ['panturrilha', 'flexores do quadril'],
  },
  equipment: ['peso do corpo'],
  how: [
    'Fique em pé sobre uma perna, o outro joelho elevado, tronco alto e cotovelos a 90°.',
    'Empurre o chão e salte para cima, subindo o joelho da frente junto com o braço oposto.',
    'No alto, joelho na altura do quadril, perna de impulso estendida e tronco reto.',
    'Aterrisse na ponta do mesmo pé, dê o segundo toque e troque de perna.',
  ],
  cues: [
    'Objetivo: impulsão; estenda tornozelo, joelho e quadril da perna que empurra.',
    'O braço oposto sobe junto com o joelho e ajuda a ganhar altura.',
    'Aterrisse macio, joelho alinhado com o pé, e aproveite o quique para o salto seguinte.',
  ],
  mistakes: [
    'Jogar o tronco para trás na hora de subir o joelho',
    'Aterrissar duro, com a perna travada e o calcanhar batendo no chão',
    'Perder o ritmo dos dois toques por buscar mais altura do que consegue controlar',
  ],
  breath: 'Solte o ar nos impulsos e puxe entre eles; não prenda a respiração para saltar.',
  easier: 'Volte ao hop: salto baixo, joelho a uns 45°, mesmo ritmo de dois toques.',
  harder: 'Avance uns 20 m buscando altura em cada salto, sem quebrar o ritmo.',
  yt: 'hop alto saltito educativo de corrida execução',
};

export default ex;
