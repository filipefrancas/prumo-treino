import type { Exercise } from '../../types.ts';

const ex: Exercise = {
  id: 'afundo-ajoelhado',
  name: 'Afundo ajoelhado',
  aka: ['Alongamento de iliopsoas', 'Alongamento do flexor do quadril', 'Avanço ajoelhado'],
  kind: 'alongamento',
  group: 'quadril',
  muscles: {
    primary: ['flexores do quadril', 'quadríceps'],
  },
  equipment: ['colchonete', 'toalha'],
  sided: true,
  how: [
    'Apoie um joelho no chão, sobre uma toalha dobrada, e ponha o outro pé à frente, com o joelho a 90°.',
    'Deixe o tronco ereto, com as mãos na cintura ou apoiadas no joelho da frente.',
    'Avance e desça o quadril devagar, sem inclinar o tronco, até alongar a frente do quadril.',
    'Segure respirando devagar; recue o quadril para sair e troque a perna da frente.',
  ],
  cues: [
    'Sinta alongar a frente do quadril e da coxa da perna que está com o joelho no chão.',
    'Aperte o glúteo do lado de trás e encaixe a bacia: alonga mais sem arquear a lombar.',
    'Peito alto e olhar para a frente; o joelho da frente aponta para a ponta do pé.',
  ],
  mistakes: [
    'Arquear a lombar em vez de levar o quadril à frente',
    'Inclinar o tronco à frente e deitar o peso sobre a coxa',
    'Apoiar o joelho de trás em piso duro, sem toalha nem colchonete',
  ],
  breath: 'Respire fundo e devagar; ao soltar o ar, deixe o quadril afundar um pouco mais.',
  easier: 'Segure em uma cadeira ou na parede ao lado para ter equilíbrio e avance menos o quadril.',
  harder: 'Erga o braço do lado do joelho apoiado e incline o tronco de leve para o lado oposto.',
  yt: 'alongamento iliopsoas ajoelhado flexor do quadril',
};

export default ex;
