import type { Exercise } from '../../types.ts';

const ex: Exercise = {
  id: 'uma-perna-estendida',
  name: 'Uma perna estendida',
  aka: ['Alongamento de posterior de coxa sentado', 'Cabeça ao joelho'],
  kind: 'alongamento',
  group: 'posterior',
  muscles: {
    primary: ['posteriores de coxa'],
    secondary: ['panturrilha', 'eretores da espinha'],
  },
  equipment: ['colchonete'],
  sided: true,
  how: [
    'Sente no chão, estenda uma perna à frente e encoste a sola do outro pé na parte interna da coxa.',
    'Vire o peito de frente para a perna estendida e cresça a coluna.',
    'Incline o tronco à frente a partir do quadril, deslizando as mãos pela perna até o pé.',
    'Segure onde alcançar com as costas retas (canela, tornozelo ou pé), respirando devagar.',
    'Volte subindo o tronco devagar e troque de perna.',
  ],
  cues: [
    'O alongamento é no meio da parte de trás da coxa, não atrás do joelho.',
    'Peito em direção ao pé e olhar na ponta do pé: as costas ficam longas.',
    'Dedos do pé da perna estendida apontando para o teto, joelho estendido sem travar.',
  ],
  mistakes: [
    'Curvar as costas para encostar a testa no joelho',
    'Dobrar o joelho da perna estendida para alcançar o pé',
    'Deixar a perna estendida girar para fora, com o pé caído de lado',
  ],
  breath: 'Ao puxar o ar, alongue a coluna; ao soltar, incline um pouco mais sobre a perna.',
  easier: 'Passe uma toalha pela sola do pé e puxe por ela, com as costas retas.',
  harder: 'Segure a sola do pé e puxe os dedos na sua direção para alongar também a panturrilha.',
  yt: 'alongamento posterior de coxa sentado uma perna estendida',
};

export default ex;
