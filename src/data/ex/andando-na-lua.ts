import type { Exercise } from '../../types.ts';

/** Educativo de corrida: passadas lentas e exageradas, com tempo de voo longo. */
const ex: Exercise = {
  id: 'andando-na-lua',
  name: 'Andando na lua',
  kind: 'educativo',
  group: 'pernas',
  muscles: {
    primary: ['glúteo máximo', 'quadríceps'],
    secondary: ['panturrilha', 'flexores do quadril', 'posteriores de coxa'],
  },
  equipment: ['peso do corpo'],
  how: [
    'Fique em pé, tronco alto, um braço à frente e o outro atrás, prontos para um balanço amplo.',
    'Empurre o chão com a perna de trás até ela estender e suba bem o joelho da frente.',
    'Flutue: segure a posição no ar o máximo que conseguir, como em câmera lenta.',
    'Aterrisse macio na ponta do pé, embaixo do corpo, e emende a passada do outro lado.',
  ],
  cues: [
    'Objetivo: amplitude da passada; empurrão completo atrás, joelho alto e voo longo.',
    'Braços grandes, do quadril à altura do queixo, dão equilíbrio e tempo no ar.',
    'Sem pressa: quanto mais tempo no ar em cada passada, melhor.',
  ],
  mistakes: [
    'Acelerar e virar corrida comum, sem tempo de voo',
    'Encolher os braços e perder o equilíbrio no ar',
    'Cair pesado no calcanhar, com a perna esticada à frente do corpo',
  ],
  breath: 'Puxe o ar em uma passada e solte na seguinte, acompanhando o ritmo lento.',
  easier: 'Faça sem saltar: passadas largas e lentas, parando 1 s com o joelho no alto.',
  harder: 'Aumente o tempo de voo e a distância de cada passada, sem perder o equilíbrio.',
  yt: 'andando na lua educativo de corrida passadas saltadas execução',
};

export default ex;
