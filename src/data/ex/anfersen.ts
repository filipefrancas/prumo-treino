import type { Exercise } from '../../types.ts';

/** Educativo de corrida: recolhimento rápido do calcanhar até o glúteo. */
const ex: Exercise = {
  id: 'anfersen',
  name: 'Anfersen',
  aka: ['Calcanhar no glúteo', 'Butt kick'],
  kind: 'educativo',
  group: 'posterior',
  muscles: {
    primary: ['posteriores de coxa'],
    secondary: ['panturrilha', 'glúteo máximo'],
  },
  equipment: ['peso do corpo'],
  how: [
    'Fique em pé, tronco alto e levemente inclinado à frente, cotovelos a 90°.',
    'Dobre um joelho e puxe o calcanhar para trás e para cima, com a coxa quase na vertical.',
    'Encoste o calcanhar no glúteo, com o joelho apontando para o chão.',
    'Desça o pé embaixo do quadril, na ponta, enquanto o outro calcanhar já sobe.',
  ],
  cues: [
    'Objetivo: recolher o calcanhar rápido depois do apoio, como na passada de corrida.',
    'Sinta a parte de trás da coxa puxar o pé; a frente da coxa alonga de leve.',
    'Joelhos juntos e apontados para o chão; braços no ritmo, olhar à frente.',
  ],
  mistakes: [
    'Jogar a coxa para trás junto com o calcanhar, arqueando a lombar',
    'Dobrar o tronco à frente e empinar o quadril',
    'Abrir os joelhos para os lados na subida do calcanhar',
  ],
  breath: 'Respire solto e ritmado, como na corrida leve, sem prender o ar.',
  easier: 'Faça caminhando: a cada passo, um calcanhar sobe até o glúteo, sem saltar.',
  harder: 'Aumente a cadência sem perder o toque do calcanhar no glúteo.',
  yt: 'anfersen calcanhar no glúteo educativo de corrida execução',
};

export default ex;
