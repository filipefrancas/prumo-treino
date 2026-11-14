import type { Exercise } from '../../types.ts';

/** Educativo de corrida: trabalho de tornozelo e cadência, com passos curtíssimos. */
const ex: Exercise = {
  id: 'dribling',
  name: 'Dribling',
  aka: ['Dribbling', 'Skipping baixo'],
  kind: 'educativo',
  group: 'panturrilha',
  muscles: {
    primary: ['panturrilha', 'musculatura do pé'],
    secondary: ['tibial anterior', 'flexores do quadril'],
  },
  equipment: ['peso do corpo'],
  how: [
    'Fique em pé, tronco alto e levemente inclinado à frente, cotovelos a 90°.',
    'Troque passos curtíssimos e rápidos, rolando o pé do calcanhar à ponta para sair do chão.',
    'Tire o pé só uns 8 cm do chão: o joelho sobe muito pouco e o tornozelo faz o trabalho.',
    'Volte tocando a ponta do pé primeiro e deixe o calcanhar baixar de leve antes do próximo passo.',
    'No lugar ou avançando, dê muitos passos em pouca distância.',
  ],
  cues: [
    'Objetivo: cadência alta e tornozelo solto, com contato curto e leve no chão.',
    'Sinta o pé rolar inteiro e a panturrilha esquentar; os joelhos só acompanham.',
    'Braços curtos e rápidos ditam o ritmo; ombros soltos e olhar à frente.',
  ],
  mistakes: [
    'Subir os joelhos e transformar o exercício em skipping',
    'Pisar com o pé chapado, sem rolar do calcanhar à ponta',
    'Alongar o passo para avançar rápido, perdendo a cadência',
  ],
  breath: 'Respire solto e contínuo, como no trote leve; não prenda o ar por causa da pressa nos pés.',
  easier: 'Faça caminhando, só rolando o pé do calcanhar à ponta a cada passo, sem pressa.',
  harder: 'Acelere a cadência ao máximo por 10 s, sem aumentar o tamanho do passo.',
  yt: 'dribling educativo de corrida execução',
};

export default ex;
