import type { Exercise } from '../../types.ts';

/** Educativo de corrida: frequência de passada com o joelho a meia altura. */
const ex: Exercise = {
  id: 'skipping-medio',
  name: 'Skipping médio',
  aka: ['Skipping', 'Elevação de joelhos'],
  kind: 'educativo',
  group: 'pernas',
  muscles: {
    primary: ['flexores do quadril', 'quadríceps'],
    secondary: ['panturrilha', 'glúteo máximo', 'reto abdominal'],
  },
  equipment: ['peso do corpo'],
  how: [
    'Fique em pé, na ponta dos pés, tronco alto e levemente inclinado à frente, cotovelos a 90°.',
    'Suba um joelho à frente enquanto a outra perna empurra o chão, com o braço oposto acompanhando.',
    'Pare a subida com a coxa a meia altura, uns 45°, e a ponta do pé puxada para a canela.',
    'Desça o pé embaixo do quadril, toque o chão com a ponta e troque de perna na hora.',
  ],
  cues: [
    'Objetivo: frequência de passada, com apoio rápido na ponta dos pés.',
    'Sinta o pé quicar como em chão quente: joelho a meia altura, volta rápida ao chão.',
    'Quadril alto e abdômen firme; olhe para a frente, não para os pés.',
  ],
  mistakes: [
    'Sentar o quadril e jogar o tronco para trás ao subir o joelho',
    'Apoiar o pé inteiro, com o calcanhar batendo no chão',
    'Subir o joelho além da meia altura e deixar a cadência cair',
  ],
  breath: 'Respiração solta, pelo nariz e pela boca, no ritmo que vier; só não prenda o ar.',
  easier: 'Faça marchando, sem saltar: suba o joelho, desça na ponta do pé e troque.',
  harder: 'Acelere a troca de pernas por 10 s ou passe para o skipping alto.',
  yt: 'skipping médio educativo de corrida execução',
};

export default ex;
