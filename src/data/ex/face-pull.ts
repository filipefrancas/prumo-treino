import type { Exercise } from '../../types.ts';

/** Ficha B · Peito e costas. Fecha o treino e cuida da postura dos ombros. */
const ex: Exercise = {
  id: 'face-pull',
  name: 'Face pull na polia',
  aka: ['Puxada para o rosto', 'Face pull com corda'],
  kind: 'forca',
  group: 'ombros',
  muscles: {
    primary: ['deltoide posterior', 'trapézio médio'],
    secondary: ['romboides', 'manguito rotador'],
  },
  equipment: ['polia', 'corda'],
  how: [
    'Ajuste a polia na altura do rosto, com a corda, e segure uma ponta em cada mão, polegares para trás.',
    'Dê um passo para trás, braços estendidos à frente, um pé na frente do outro e tronco firme.',
    'Puxe a corda em direção ao rosto, abrindo os cotovelos para os lados, na altura dos ombros.',
    'Termine com as mãos ao lado das orelhas, segure 2 segundos e volte devagar.',
  ],
  cues: [
    'Sinta a parte de trás dos ombros e o meio das costas, não o pescoço.',
    'Cotovelos altos, na linha dos ombros, do começo ao fim.',
    'No final, gire as mãos para trás como quem mostra o muque.',
  ],
  mistakes: [
    'Inclinar o tronco para trás para ajudar a puxar',
    'Deixar os cotovelos caírem e transformar o movimento em remada',
    'Encolher os ombros em direção às orelhas',
  ],
  breath: 'Solte o ar ao puxar e puxe o ar ao voltar.',
  easier: 'Faça com um elástico preso na altura do rosto.',
  harder: 'Segure 3 segundos na posição final em cada repetição.',
  swap: ['crucifixo-inverso', 'remada-baixa'],
  yt: 'face pull na polia com corda execução',
};

export default ex;
