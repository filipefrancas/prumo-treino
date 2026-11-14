import type { Exercise } from '../../types.ts';

/** Aquecimento antes da corrida: subir na ponta dos dois pés e descer com controle. */
const ex: Exercise = {
  id: 'elevacao-de-panturrilha',
  name: 'Elevação de panturrilha',
  aka: ['Panturrilha em pé', 'Gêmeos em pé', 'Calf raise'],
  kind: 'aquecimento',
  group: 'panturrilha',
  muscles: {
    primary: ['panturrilha'],
    secondary: ['musculatura do pé'],
  },
  equipment: ['peso do corpo'],
  how: [
    'Fique em pé, pés paralelos na largura do quadril, mãos na cintura.',
    'Suba na ponta dos dois pés, empurrando o chão com a base dos dedos.',
    'Chegue o mais alto que conseguir, com os joelhos estendidos, e segure 1 s lá em cima.',
    'Desça devagar até os calcanhares encostarem no chão.',
  ],
  cues: [
    'Sinta a panturrilha contrair no alto; o peso fica sobre o dedão e o segundo dedo.',
    'Suba reto, como se um fio puxasse a cabeça para o teto, sem ir para a frente.',
    'Calcanhares sobem alinhados, sem abrir para fora nem os tornozelos virarem.',
  ],
  mistakes: [
    'Subir e descer quicando, sem controlar a descida',
    'Jogar o peso para a borda de fora dos pés, deixando os tornozelos virarem',
    'Dobrar os joelhos ou inclinar o tronco para ganhar impulso',
  ],
  breath: 'Solte o ar na subida e puxe na descida.',
  easier: 'Apoie as mãos em uma parede e suba só até a metade.',
  harder: 'Faça com um pé de cada vez ou na borda de um degrau, descendo o calcanhar abaixo dele.',
  yt: 'elevação de panturrilha em pé com peso do corpo execução',
};

export default ex;
