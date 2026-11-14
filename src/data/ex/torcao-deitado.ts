import type { Exercise } from '../../types.ts';

const ex: Exercise = {
  id: 'torcao-deitado',
  name: 'Torção deitado',
  aka: ['Torção de coluna deitado', 'Rotação de tronco deitado'],
  kind: 'alongamento',
  group: 'costas',
  muscles: {
    primary: ['eretores da espinha', 'oblíquos'],
    secondary: ['glúteo máximo', 'glúteo médio', 'peitoral maior'],
  },
  equipment: ['colchonete'],
  sided: true,
  how: [
    'Deite de costas, com as pernas estendidas e os braços abertos em cruz, na linha dos ombros.',
    'Dobre um joelho e suba a coxa até ele apontar para o teto.',
    'Leve esse joelho por cima do corpo e deixe-o descer para o outro lado, em direção ao chão.',
    'Pare onde os dois ombros ainda ficam no chão e segure, respirando devagar.',
    'Volte o joelho ao centro, estenda a perna e repita para o outro lado.',
  ],
  cues: [
    'Sinta a torção na lombar e na lateral do quadril; o peso da perna faz o trabalho.',
    'O ombro do lado do joelho dobrado quer subir: deixe-o pesado no chão.',
    'Olhe para o teto ou vire o rosto para longe do joelho, sem forçar o pescoço.',
  ],
  mistakes: [
    'Deixar o ombro descolar do chão para o joelho encostar',
    'Forçar o joelho para baixo no tranco',
    'Prender o ar e endurecer a barriga durante a torção',
  ],
  breath: 'Puxe o ar pelo nariz sem pressa e solte devagar, deixando o joelho pesar um pouco mais.',
  easier: 'Apoie o joelho cruzado em uma almofada ou toalha dobrada se ele não chegar ao chão.',
  harder: 'Apoie sobre o joelho a mão do lado para onde ele desceu e deixe o peso do braço agir.',
  yt: 'alongamento torção de coluna deitado lombar',
};

export default ex;
