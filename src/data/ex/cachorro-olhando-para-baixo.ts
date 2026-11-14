import type { Exercise } from '../../types.ts';

const ex: Exercise = {
  id: 'cachorro-olhando-para-baixo',
  name: 'Cachorro olhando para baixo',
  aka: ['Postura do cachorro', 'V invertido'],
  kind: 'alongamento',
  group: 'panturrilha',
  muscles: {
    primary: ['panturrilha', 'posteriores de coxa'],
    secondary: ['dorsal', 'glúteo máximo', 'musculatura do pé'],
  },
  equipment: ['colchonete'],
  how: [
    'Em quatro apoios, ponha as mãos um palmo à frente dos ombros e apoie as pontas dos pés no chão.',
    'Empurre o chão com as mãos e suba o quadril, estendendo as pernas até formar um V invertido.',
    'Deixe a cabeça entre os braços e leve o peito em direção às coxas, com as costas longas.',
    'Desça os calcanhares em direção ao chão, empurrando o quadril para cima e para trás.',
    'Segure respirando devagar; para sair, dobre os joelhos e apoie-os no chão.',
  ],
  cues: [
    'Sinta alongar as panturrilhas e a parte de trás das coxas.',
    'Empurre o chão para longe: ombros afastados das orelhas e costas retas.',
    'Olhe para os pés; o pescoço fica solto, com a cabeça entre os braços.',
  ],
  mistakes: [
    'Arredondar as costas para forçar os calcanhares no chão',
    'Largar o peso nos punhos, com os ombros colados nas orelhas',
    'Deixar os pés perto demais das mãos, encurtando o V',
  ],
  breath: 'Respire fundo pelo nariz; a cada expiração, desça os calcanhares um pouco mais.',
  easier: 'Dobre um pouco os joelhos ou pedale, descendo um calcanhar de cada vez.',
  harder: 'Cruze um pé sobre o outro tornozelo e alongue uma panturrilha de cada vez.',
  yt: 'cachorro olhando para baixo yoga como fazer',
};

export default ex;
