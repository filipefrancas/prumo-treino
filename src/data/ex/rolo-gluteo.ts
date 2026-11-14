import type { Exercise } from '../../types.ts';

const ex: Exercise = {
  id: 'rolo-gluteo',
  name: 'Rolo no glúteo',
  aka: ['Liberação miofascial do glúteo', 'Rolo no piriforme', 'Foam roller no glúteo'],
  kind: 'liberacao',
  group: 'gluteos',
  muscles: {
    primary: ['glúteo máximo'],
    secondary: ['piriforme'],
  },
  equipment: ['rolo'],
  sided: true,
  how: [
    'Sente em cima do rolo, com uma mão apoiada no chão atrás do corpo.',
    'Cruze um tornozelo sobre o outro joelho e incline o tronco para o lado da perna cruzada.',
    'Role devagar para a frente e para trás, cobrindo esse glúteo do alto até a dobra da coxa.',
    'No ponto mais tenso, pare alguns segundos, respire fundo e volte a rolar.',
  ],
  cues: [
    'O peso fica no glúteo da perna cruzada; o outro lado quase não encosta no rolo.',
    'Deixe o joelho da perna cruzada cair para fora: o glúteo alonga e o rolo pega mais fundo.',
    'Movimento curto, de um palmo, procurando o ponto fundo no meio do glúteo.',
  ],
  mistakes: [
    'Ficar sentado reto, com o peso dividido entre os dois glúteos',
    'Rolar sobre o osso do fim da coluna em vez do músculo',
    'Insistir em um ponto que dá choque ou formigamento descendo pela perna',
  ],
  breath: 'Respire fundo e devagar e, a cada vez que soltar o ar, deixe o glúteo afundar no rolo.',
  easier: 'Deixe os dois pés no chão, sem cruzar a perna, e só incline o corpo para um lado.',
  harder: 'Troque o rolo por uma bolinha firme, de tênis ou de lacrosse, para pressionar um ponto só.',
  yt: 'liberação miofascial glúteo piriforme rolo',
};

export default ex;
