import type { Exercise } from '../../types.ts';

/** Ficha A · Costas e bíceps. Na ficha, o treinador indica o pulldown articulado, um braço de cada vez. */
const ex: Exercise = {
  id: 'pulldown-unilateral',
  name: 'Pulldown unilateral na máquina',
  aka: ['Pulldown Máquina Unilateral', 'Pulldown articulado unilateral', 'Puxada alta unilateral na máquina'],
  kind: 'forca',
  group: 'costas',
  muscles: {
    primary: ['dorsal'],
    secondary: ['bíceps', 'romboides', 'deltoide posterior'],
  },
  equipment: ['máquina'],
  sided: true,
  how: [
    'Sente com as coxas presas sob o rolo, tronco ereto, e segure um pegador com o braço estendido.',
    'Descanse a outra mão na coxa e deixe o ombro subir, alongando a lateral das costas.',
    'Puxe o cotovelo para baixo até a lateral do tronco, com a mão na altura do ombro.',
    'Volte devagar até o braço estender por completo, deixando o ombro subir de novo.',
  ],
  cues: [
    'Comece baixando o ombro; só depois dobre o cotovelo.',
    'Sinta a lateral das costas, abaixo da axila, alongar no alto e apertar embaixo.',
    'Tronco parado e de frente para a máquina: só o braço se mexe.',
  ],
  mistakes: [
    'Inclinar o tronco para o lado do braço que puxa para vencer a carga',
    'Girar o tronco e levantar o quadril do assento no fim da puxada',
    'Encurtar a volta e não deixar o braço estender no alto',
  ],
  breath: 'Solte o ar ao descer o cotovelo e puxe o ar enquanto o braço sobe.',
  easier: 'Puxe com os dois braços ao mesmo tempo, com menos carga em cada lado.',
  harder: 'Segure 2 segundos com o cotovelo junto ao tronco antes de voltar.',
  swap: ['puxada-supinada', 'remada-maquina'],
  yt: 'pulldown articulado unilateral máquina execução',
};

export default ex;
