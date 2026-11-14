import type { Exercise } from '../../types.ts';

const ex: Exercise = {
  id: 'pernas-juntas-a-frente',
  name: 'Pernas juntas à frente',
  aka: ['Sentar e alcançar', 'Postura da pinça'],
  kind: 'alongamento',
  group: 'posterior',
  muscles: {
    primary: ['posteriores de coxa'],
    secondary: ['panturrilha', 'eretores da espinha', 'glúteo máximo'],
  },
  equipment: ['colchonete'],
  how: [
    'Sente no chão com as pernas estendidas e juntas à frente, mãos apoiadas nos joelhos.',
    'Cresça a coluna e puxe as pontas dos pés na sua direção.',
    'Incline o tronco à frente a partir do quadril, deslizando as mãos pelas canelas até os pés.',
    'Segure onde alcançar com as costas longas, respirando devagar.',
    'Volte subindo o tronco devagar, com as mãos deslizando até os joelhos.',
  ],
  cues: [
    'Sinta alongar atrás das duas coxas; um puxão leve na panturrilha também é normal.',
    'A barriga vai em direção às coxas antes de a cabeça ir em direção aos joelhos.',
    'Ombros longe das orelhas e pescoço solto, na linha da coluna.',
  ],
  mistakes: [
    'Arredondar as costas inteiras só para encostar as mãos nos pés',
    'Dar trancos para a frente tentando ir mais longe',
    'Puxar com os braços e encolher os ombros até as orelhas',
  ],
  breath: 'Ao puxar o ar, alongue a coluna; ao soltar, desça um pouco mais e relaxe os ombros.',
  easier: 'Dobre de leve os joelhos ou sente sobre uma toalha dobrada para a coluna não arredondar.',
  harder: 'Segure as solas dos pés e leve o peito em direção às canelas, sem curvar as costas.',
  yt: 'alongamento posterior de coxa sentado pernas estendidas',
};

export default ex;
