import type { Exercise } from '../../types.ts';

/** Aquecimento antes da corrida: saltos leves abrindo e fechando pernas e braços. */
const ex: Exercise = {
  id: 'polichinelo',
  name: 'Polichinelo',
  aka: ['Jumping jack'],
  kind: 'aquecimento',
  group: 'corpo-todo',
  muscles: {
    primary: ['panturrilha', 'deltoide'],
    secondary: ['glúteo médio', 'adutores', 'quadríceps'],
  },
  equipment: ['peso do corpo'],
  how: [
    'Fique em pé, pés juntos e braços ao lado do corpo.',
    'Com um salto leve, afaste os pés e suba os braços estendidos pelos lados.',
    'Chegue com os pés além da largura dos ombros e as mãos juntas acima da cabeça.',
    'Salte de novo e volte à posição inicial, com os pés juntos e os braços ao lado do corpo.',
  ],
  cues: [
    'Salto baixo e elástico, na ponta dos pés; os calcanhares só roçam o chão.',
    'Joelhos soltos, alinhados com os pés, amortecem cada aterrissagem.',
    'Ritmo constante, perto de um ciclo por segundo: a ideia é aquecer, não cansar.',
  ],
  mistakes: [
    'Aterrissar com os joelhos travados e o pé chapado, fazendo barulho',
    'Subir os braços só até a metade, sem as mãos se encontrarem no alto',
    'Deixar os joelhos caírem para dentro quando os pés afastam',
  ],
  breath: 'Respire no ritmo dos saltos, soltando o ar a cada dois, sem prender.',
  easier: 'Sem salto: abra uma perna para o lado de cada vez, subindo os braços normalmente.',
  harder: 'Aumente o ritmo ou desça em meio agachamento cada vez que os pés afastam.',
  yt: 'polichinelo execução correta',
};

export default ex;
