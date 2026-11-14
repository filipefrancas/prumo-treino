import type { Exercise } from '../../types.ts';

/** Educativo de corrida: elevação do joelho até a altura do quadril, com o tronco alto. */
const ex: Exercise = {
  id: 'skipping-alto',
  name: 'Skipping alto',
  aka: ['Skipping', 'Joelho alto', 'High knees'],
  kind: 'educativo',
  group: 'pernas',
  muscles: {
    primary: ['flexores do quadril', 'quadríceps'],
    secondary: ['panturrilha', 'glúteo máximo', 'reto abdominal'],
  },
  equipment: ['peso do corpo'],
  how: [
    'Fique em pé, na ponta dos pés, tronco alto, abdômen firme e cotovelos a 90°.',
    'Suba um joelho com força enquanto a outra perna empurra o chão e estende.',
    'Chegue com o joelho na altura do quadril, coxa na horizontal, sem o tronco cair para trás.',
    'Desça o pé embaixo do quadril, na ponta, e suba o outro joelho em seguida.',
  ],
  cues: [
    'Objetivo: elevação do joelho com o quadril alto, base de uma passada ampla.',
    'Sinta a frente do quadril puxar a coxa enquanto a perna de apoio empurra o chão.',
    'Braços fortes, do quadril ao queixo; olhar à frente e abdômen firme.',
  ],
  mistakes: [
    'Inclinar o tronco para trás para o joelho chegar mais alto',
    'Dobrar a perna de apoio e correr sentado, com o quadril baixo',
    'Cair no calcanhar, com barulho, em vez de pisar leve na ponta do pé',
  ],
  breath: 'Solte o ar pela boca em sopros curtos e puxe pelo nariz, sem travar a respiração no esforço.',
  easier: 'Faça o skipping médio ou a versão marchando, um joelho de cada vez.',
  harder: 'Faça 10 s no lugar o mais rápido que conseguir e saia trotando por 20 m.',
  yt: 'skipping alto educativo de corrida execução',
};

export default ex;
