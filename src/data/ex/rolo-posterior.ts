import type { Exercise } from '../../types.ts';

const ex: Exercise = {
  id: 'rolo-posterior',
  name: 'Rolo no posterior da coxa',
  aka: ['Liberação miofascial do posterior de coxa', 'Rolo nos isquiotibiais', 'Foam roller no posterior'],
  kind: 'liberacao',
  group: 'posterior',
  muscles: {
    primary: ['posteriores de coxa'],
  },
  equipment: ['rolo'],
  sided: true,
  how: [
    'Sente no chão, mãos apoiadas atrás do corpo, com o rolo sob a parte de trás de uma coxa.',
    'Apoie o outro pé no chão, tire o quadril do chão e deslize o corpo para a frente e para trás.',
    'Role devagar de logo abaixo do glúteo até logo acima do joelho, sem chegar atrás dele.',
    'Onde a coxa estiver mais tensa, pare alguns segundos, respire e continue.',
  ],
  cues: [
    'Deixe a perna pesada e solta sobre o rolo; com a coxa contraída, a pressão não entra.',
    'Gire a coxa um pouco para dentro e para fora: são três músculos lado a lado.',
    'Peito aberto e ombros longe das orelhas enquanto os braços empurram o chão.',
  ],
  mistakes: [
    'Deixar a perna dura, com o joelho travado e a coxa contraída',
    'Levar o rolo até a dobra de trás do joelho',
    'Subir demais e apoiar o osso de sentar no rolo em vez do músculo',
  ],
  breath: 'Respire devagar, sem prender o ar, e solte o ar comprido nos pontos mais tensos.',
  easier: 'Apoie as duas coxas no rolo ao mesmo tempo para dividir o peso.',
  harder: 'Cruze a outra perna por cima e, parado no ponto tenso, dobre e estenda o joelho devagar.',
  yt: 'liberação miofascial posterior de coxa rolo isquiotibiais',
};

export default ex;
