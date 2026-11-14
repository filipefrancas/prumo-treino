import type { Exercise } from '../../types.ts';

/** Ficha B · Inferiores. A perna que trabalha é a da frente; a de trás só dá o passo e ajuda no equilíbrio. */
const ex: Exercise = {
  id: 'recuo-com-halteres',
  name: 'Recuo com halteres',
  aka: ['Recuo com Halteres', 'Afundo para trás', 'Passada para trás', 'Afundo reverso'],
  kind: 'forca',
  group: 'pernas',
  muscles: {
    primary: ['quadríceps', 'glúteo máximo'],
    secondary: ['posteriores de coxa', 'adutores', 'glúteo médio'],
  },
  equipment: ['halteres'],
  sided: true,
  how: [
    'Fique em pé, pés na largura do quadril, com um halter em cada mão ao lado do corpo.',
    'Dê um passo longo para trás com uma perna e apoie só a ponta desse pé.',
    'Desça reto até o joelho de trás quase tocar o chão, com o joelho da frente a 90°, sobre o tornozelo.',
    'Empurre o chão com o pé da frente e volte a juntar os pés.',
    'Faça todas as repetições com a mesma perna na frente e só então troque.',
  ],
  cues: [
    'Quem faz a força é a perna da frente: sinta o peso no calcanhar e no meio desse pé.',
    'Tronco alto e olhar à frente; os halteres descem em linha reta, sem balançar.',
    'Pés em dois trilhos, na largura do quadril, nunca um atrás do outro em linha.',
  ],
  mistakes: [
    'Deixar o joelho da frente cair para dentro na descida',
    'Dar um passo curto e tirar o calcanhar da frente do chão',
    'Bater o joelho de trás no chão em vez de frear antes',
  ],
  breath: 'Puxe o ar ao dar o passo e descer e solte ao empurrar o chão para voltar.',
  easier: 'Faça sem halteres, com uma mão apoiada em uma barra ou parede para o equilíbrio.',
  harder: 'Suba o pé da frente em um degrau baixo para o joelho de trás descer mais fundo.',
  swap: ['agachamento-halter-frente', 'leg-press-45'],
  yt: 'recuo com halteres afundo para trás execução correta',
};

export default ex;
