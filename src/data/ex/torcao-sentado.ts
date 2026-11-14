import type { Exercise } from '../../types.ts';

const ex: Exercise = {
  id: 'torcao-sentado',
  name: 'Torção sentado',
  aka: ['Torção de coluna sentado', 'Meia torção sentada'],
  kind: 'alongamento',
  group: 'gluteos',
  muscles: {
    primary: ['glúteo máximo', 'eretores da espinha'],
    secondary: ['piriforme', 'glúteo médio', 'oblíquos'],
  },
  equipment: ['colchonete'],
  sided: true,
  how: [
    'Sente no chão com as duas pernas estendidas à frente e a coluna ereta.',
    'Dobre uma perna e apoie o pé do lado de fora do joelho da perna estendida.',
    'Abrace o joelho dobrado com o braço oposto e apoie a outra mão no chão, atrás do quadril.',
    'Gire o tronco para o lado do joelho dobrado e olhe por cima do ombro de trás.',
    'Segure respirando devagar; desfaça a torção com calma e troque de lado.',
  ],
  cues: [
    'Sinta alongar a lateral do glúteo da perna cruzada e a torção subir pela lombar.',
    'Os dois lados do quadril ficam apoiados no chão enquanto o tronco gira.',
    'Cresça primeiro, gire depois; a mão de trás só apoia, não empurra.',
  ],
  mistakes: [
    'Arredondar as costas e largar o peso na mão de trás',
    'Tirar do chão o quadril do lado da perna cruzada',
    'Girar só o pescoço, sem levar o peito junto',
  ],
  breath: 'Ao puxar o ar, cresça a coluna; ao soltar, gire um pouco mais, sem pressa.',
  easier: 'Sente sobre uma toalha dobrada e apenas abrace o joelho contra o peito, girando pouco.',
  harder: 'Passe o cotovelo oposto para fora do joelho dobrado e use-o de alavanca para girar mais.',
  yt: 'alongamento torção sentado glúteo coluna',
};

export default ex;
