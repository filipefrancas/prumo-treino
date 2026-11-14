import type { Exercise } from '../../types.ts';

/** Educativo de corrida: saltitos baixos em uma perna, dois toques e troca. */
const ex: Exercise = {
  id: 'hop',
  name: 'Hop',
  aka: ['Saltito', 'Hopserlauf'],
  kind: 'educativo',
  group: 'panturrilha',
  muscles: {
    primary: ['panturrilha'],
    secondary: ['musculatura do pé', 'flexores do quadril', 'glúteo médio'],
  },
  equipment: ['peso do corpo'],
  how: [
    'Fique em pé sobre uma perna, na ponta do pé, o outro joelho elevado a uns 45°, cotovelos a 90°.',
    'Dê saltitos baixos na perna de apoio: dois toques seguidos no chão com o mesmo pé.',
    'Saia do chão só o bastante para o pé descolar, com o joelho da frente parado a 45°.',
    'Depois do segundo toque, troque: a perna da frente desce para o apoio e a outra sobe.',
  ],
  cues: [
    'Objetivo: tornozelo reativo e ritmo; o impulso vem do pé, não do joelho.',
    'Conte um, dois, troca: os toques têm sempre o mesmo intervalo.',
    'Sinta a panturrilha como mola: salto baixo, silencioso, perna de apoio quase reta.',
  ],
  mistakes: [
    'Saltar alto e gastar força em vez de quicar baixo e rápido',
    'Dobrar muito o joelho de apoio, amortecendo cada toque como um agachamento',
    'Deixar o joelho elevado cair entre um saltito e outro',
  ],
  breath: 'Respire solto e contínuo; uma boa referência é soltar o ar a cada troca de perna.',
  easier: 'Segure em uma parede e faça só os dois saltitos de um lado; depois, do outro.',
  harder: 'Avance uns 20 m sem perder o ritmo ou passe para o hop alto.',
  yt: 'hop saltito educativo de corrida execução',
};

export default ex;
