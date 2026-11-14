import type { Exercise } from '../../types.ts';

/** Educativo de corrida: saltos alternados com voo curto, para treinar a impulsão. */
const ex: Exercise = {
  id: 'bambi-baixo',
  name: 'Bambi baixo',
  aka: ['Bambi', 'Saltos alternados', 'Corrida saltada'],
  kind: 'educativo',
  group: 'pernas',
  muscles: {
    primary: ['panturrilha', 'quadríceps'],
    secondary: ['glúteo máximo', 'flexores do quadril', 'musculatura do pé'],
  },
  equipment: ['peso do corpo'],
  how: [
    'Fique em pé, tronco alto e levemente inclinado à frente, cotovelos a 90°.',
    'Empurre o chão com uma perna e salte para a frente e para cima, o outro joelho subindo a uns 45°.',
    'Passe um instante no ar, com os dois pés fora do chão e a perna de trás estendida.',
    'Aterrisse na ponta do pé da frente e emende o salto seguinte com a outra perna.',
  ],
  cues: [
    'Objetivo: impulsão; estenda a perna de trás até o fim antes de sair do chão.',
    'Pouse macio na ponta do pé, embaixo do corpo, e use o chão como mola.',
    'Voo curto e ritmo constante; o braço oposto acompanha o joelho que sobe.',
  ],
  mistakes: [
    'Buscar distância esticando a perna à frente e frear no calcanhar',
    'Saltar alto demais e perder o ritmo entre um apoio e outro',
    'Aterrissar com a perna travada, sem deixar tornozelo e joelho amortecerem',
  ],
  breath: 'Solte o ar nos impulsos e puxe durante o voo, em ritmo natural, sem prender.',
  easier: 'Diminua o salto: um trote com um pouco mais de impulso a cada passada.',
  harder: 'Aumente o tempo de voo e suba o joelho até a altura do quadril, mantendo o ritmo.',
  yt: 'bambi saltos alternados educativo de corrida execução',
};

export default ex;
