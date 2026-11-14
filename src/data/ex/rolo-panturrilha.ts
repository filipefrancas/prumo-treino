import type { Exercise } from '../../types.ts';

const ex: Exercise = {
  id: 'rolo-panturrilha',
  name: 'Rolo na panturrilha',
  aka: ['Liberação miofascial da panturrilha', 'Foam roller na panturrilha'],
  kind: 'liberacao',
  group: 'panturrilha',
  muscles: {
    primary: ['panturrilha'],
  },
  equipment: ['rolo'],
  sided: true,
  how: [
    'Sente no chão, mãos apoiadas atrás do corpo, e apoie a panturrilha de uma perna no rolo.',
    'Com o outro pé no chão, tire o quadril do chão e deslize o corpo para a frente e para trás.',
    'Role devagar de logo acima do tornozelo até logo abaixo do joelho, sem chegar atrás dele.',
    'No ponto mais dolorido, pare alguns segundos, respire e só então continue.',
  ],
  cues: [
    'Pressão forte, mas suportável: você precisa conseguir respirar tranquilo.',
    'Gire a perna um pouco para dentro e para fora para pegar as laterais da panturrilha.',
    'Parado no ponto dolorido, mexa o pé para cima e para baixo, bem devagar.',
  ],
  mistakes: [
    'Rolar depressa, sem dar tempo de a panturrilha relaxar',
    'Passar o rolo atrás do joelho',
    'Encolher os ombros e afundar o peito entre os braços',
  ],
  breath: 'Respire lento e fundo, soltando o ar comprido quando parar em um ponto dolorido.',
  easier: 'Deixe o quadril apoiado no chão e mova só a perna sobre o rolo.',
  harder: 'Cruze a outra perna por cima da que está no rolo para aumentar a pressão.',
  yt: 'liberação miofascial panturrilha rolo como fazer',
};

export default ex;
