import type { Exercise } from '../../types.ts';

const ex: Exercise = {
  id: 'prancha-lateral',
  name: 'Prancha lateral',
  aka: ['Prancha lateral no antebraço', 'Ponte lateral'],
  kind: 'core',
  group: 'core',
  muscles: {
    primary: ['oblíquos', 'quadrado lombar'],
    secondary: ['glúteo médio', 'transverso do abdômen', 'reto abdominal'],
  },
  equipment: ['colchonete'],
  sided: true,
  how: [
    'Deite de lado, com o antebraço de baixo no chão e o cotovelo embaixo do ombro.',
    'Estenda as pernas, um pé sobre o outro, e apoie a mão de cima na cintura.',
    'Tire o quadril do chão até o corpo formar uma linha reta dos pés à cabeça.',
    'Sustente a posição pelo tempo previsto, com o quadril alto e o peito virado para a frente.',
    'Desça o quadril com controle e repita do outro lado.',
  ],
  cues: [
    'Sinta trabalhar a lateral do abdômen que está virada para o chão.',
    'Empurre o chão com o antebraço: o ombro de baixo fica longe da orelha.',
    'Quadril para a frente e para cima, glúteos contraídos, olhar reto à frente.',
  ],
  mistakes: [
    'Deixar o quadril cair em direção ao chão',
    'Sentar o quadril para trás, dobrando o corpo na cintura',
    'Rolar o ombro de cima para a frente e virar o peito para o chão',
  ],
  breath: 'Respire curto e contínuo pelo nariz, mantendo a cintura firme, sem prender o ar.',
  easier: 'Dobre os joelhos e apoie o de baixo no chão, mantendo o quadril alto e alinhado.',
  harder: 'Erga a perna de cima e segure-a no alto, sem deixar o quadril descer.',
  swap: ['prancha', 'perdigueiro', 'inseto-morto'],
  yt: 'prancha lateral antebraço execução correta',
};

export default ex;
