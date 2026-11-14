import type { Exercise } from '../../types.ts';

const ex: Exercise = {
  id: 'figura-4-deitado',
  name: 'Figura 4 deitado',
  aka: ['Alongamento de piriforme', 'Figura do quatro', 'Pombo reclinado'],
  kind: 'alongamento',
  group: 'gluteos',
  muscles: {
    primary: ['glúteo máximo', 'piriforme'],
    secondary: ['glúteo médio'],
  },
  equipment: ['colchonete'],
  sided: true,
  how: [
    'Deite de costas, com os joelhos dobrados e os pés apoiados no chão.',
    'Cruze um tornozelo sobre o joelho da outra perna e deixe o joelho cruzado abrir para fora.',
    'Tire do chão o pé de apoio e segure por trás dessa coxa, passando uma das mãos por entre as pernas.',
    'Puxe as duas pernas em direção ao peito até sentir alongar o glúteo da perna cruzada.',
    'Segure respirando devagar; solte, apoie o pé no chão e descruze para trocar de lado.',
  ],
  cues: [
    'O alongamento aparece no fundo do glúteo da perna cruzada, não no joelho.',
    'Pé cruzado firme, com os dedos puxados para a canela, para o joelho não torcer.',
    'Cabeça, ombros e quadril apoiados no chão; olhar no teto.',
  ],
  mistakes: [
    'Levantar a cabeça e os ombros para alcançar a coxa',
    'Tirar o quadril do chão e enrolar a lombar para puxar mais',
    'Soltar o pé cruzado e deixar o tornozelo torcer sobre a coxa',
  ],
  breath: 'Respire devagar e fundo; a cada expiração, traga as pernas um pouco mais para o peito.',
  easier: 'Deixe o pé de apoio no chão e só empurre de leve, com a mão, o joelho cruzado para longe.',
  harder: 'Segure pela canela da perna de apoio, em vez da coxa, e puxe mais para o peito.',
  yt: 'alongamento figura 4 deitado piriforme glúteo',
};

export default ex;
