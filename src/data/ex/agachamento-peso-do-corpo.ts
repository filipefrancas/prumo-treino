import type { Exercise } from '../../types.ts';

/** Aquecimento antes da corrida: agachamento sem carga, com os braços à frente para equilibrar. */
const ex: Exercise = {
  id: 'agachamento-peso-do-corpo',
  name: 'Agachamento livre',
  aka: ['Agachamento com peso do corpo', 'Agachamento sem carga', 'Air squat'],
  kind: 'aquecimento',
  group: 'pernas',
  muscles: {
    primary: ['quadríceps', 'glúteo máximo'],
    secondary: ['posteriores de coxa', 'adutores', 'eretores da espinha'],
  },
  equipment: ['peso do corpo'],
  how: [
    'Fique em pé, pés na largura dos ombros, pontas levemente para fora, braços estendidos à frente.',
    'Desça levando o quadril para trás e para baixo, como se fosse sentar em uma cadeira.',
    'Vá até as coxas ficarem paralelas ao chão, com os calcanhares apoiados e o peito aberto.',
    'Suba empurrando o chão com o pé inteiro até estender joelhos e quadril.',
  ],
  cues: [
    'Sinta coxas e glúteos; o peso fica no meio do pé, calcanhares pregados no chão.',
    'Os joelhos seguem a direção das pontas dos pés durante toda a descida.',
    'Olhar à frente e braços estendidos: o tronco inclina só o necessário.',
  ],
  mistakes: [
    'Deixar os joelhos caírem para dentro na subida',
    'Tirar os calcanhares do chão e jogar o peso na ponta dos pés',
    'Arredondar as costas e despencar no fundo do movimento',
  ],
  breath: 'Puxe o ar na descida e solte na subida.',
  easier: 'Desça só até a metade ou sente e levante de uma cadeira.',
  harder: 'Desça em 3 s, pare 2 s embaixo e suba; ou segure um halter junto ao peito.',
  yt: 'agachamento livre com peso do corpo execução correta',
};

export default ex;
