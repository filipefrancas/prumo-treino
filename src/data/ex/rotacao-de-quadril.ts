import type { Exercise } from '../../types.ts';

/** Aquecimento antes da corrida: o joelho sobe à frente, abre para o lado e desce, em círculo. */
const ex: Exercise = {
  id: 'rotacao-de-quadril',
  name: 'Rotação de quadril',
  aka: ['Abrir a porteira', 'Círculo de quadril em pé'],
  kind: 'aquecimento',
  group: 'quadril',
  muscles: {
    primary: ['flexores do quadril', 'glúteo médio'],
    secondary: ['adutores', 'rotadores do quadril'],
  },
  equipment: ['peso do corpo'],
  sided: true,
  how: [
    'Fique em pé, mãos na cintura, tronco alto e o peso em uma perna.',
    'Suba o outro joelho (o do lado da vez) à frente até a altura do quadril.',
    'Abra o joelho para o lado, mantendo a altura, e desenhe um círculo amplo com a coxa.',
    'Desça o pé ao chão ao lado do outro e recomece pela frente.',
  ],
  cues: [
    'Imagine o joelho passando por cima de uma cerca baixa ao seu lado.',
    'Bacia e ombros de frente, parados; o círculo sai da coxa, não do tronco.',
    'Movimento lento e redondo; sinta o quadril soltar um pouco mais a cada repetição.',
  ],
  mistakes: [
    'Girar o tronco e a bacia junto com o joelho',
    'Fazer um círculo pequeno e apressado, com o joelho abaixo do quadril',
    'Tombar o corpo para o lado da perna de apoio para compensar',
  ],
  breath: 'Puxe o ar ao subir o joelho e solte enquanto ele abre e desce.',
  easier: 'Apoie uma mão na parede e faça um círculo menor, com o joelho mais baixo.',
  harder: 'Faça também no sentido inverso: abra o joelho ao lado, traga para a frente e desça.',
  yt: 'abrir a porteira rotação de quadril aquecimento para corrida execução',
};

export default ex;
