import type { Exercise } from '../../types.ts';

/** Ficha B · Inferiores (com pausa de 2 s na contração, no alto). Um halter só, preso entre os pés. */
const ex: Exercise = {
  id: 'dorsiflexao-halter',
  name: 'Dorsiflexão com halter',
  aka: ['Dorsiflexão bilateral com halter', 'Tibial com halter', 'Elevação da ponta dos pés com halter'],
  kind: 'forca',
  group: 'panturrilha',
  muscles: {
    primary: ['tibial anterior'],
    secondary: ['extensores dos dedos'],
  },
  equipment: ['halteres', 'banco reto'],
  how: [
    'Sente no banco reto com as pernas estendidas sobre ele e os pés para fora da ponta.',
    'Prenda o cabo de um halter entre os pés, com a cabeça de cima apoiada no peito dos pés.',
    'Partindo dos pés em ponta, puxe a ponta dos pés na direção das canelas, o mais alto que conseguir.',
    'Segure 2 s no alto e desça devagar até os pés apontarem de novo para a frente.',
  ],
  cues: [
    'Sinta a frente da canela trabalhar: é ela que segura o pé a cada passada da corrida.',
    'Joelhos estendidos e parados; só os tornozelos se mexem.',
    'Aperte o halter com os pés o tempo todo para ele não escorregar.',
  ],
  mistakes: [
    'Dobrar os joelhos ou balançar as pernas para o halter subir',
    'Soltar o peso na descida em vez de frear',
    'Pular a pausa de 2 s no alto',
  ],
  breath: 'Solte o ar ao puxar a ponta dos pés para cima e puxe o ar na descida.',
  easier: 'Sem halter: em pé, com as costas na parede, levante a ponta dos pés do chão.',
  harder: 'Desça em 4 s a cada repetição, sem deixar o halter despencar.',
  swap: ['dorsiflexao-do-pe'],
  yt: 'dorsiflexão com halter sentado no banco tibial anterior',
};

export default ex;
