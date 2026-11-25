import type { Exercise } from '../../types.ts';

/** Ficha B · Peito e costas. Fecha o treino e cuida da postura dos ombros (entrou no lugar do face pull). */
const ex: Exercise = {
  id: 'crucifixo-inverso-voador',
  name: 'Crucifixo inverso no voador',
  aka: ['Voador inverso', 'Peck deck inverso', 'Crucifixo invertido na máquina'],
  kind: 'forca',
  group: 'ombros',
  muscles: {
    primary: ['deltoide posterior'],
    secondary: ['trapézio médio', 'romboides'],
  },
  equipment: ['máquina'],
  how: [
    'Sente de frente para o encosto do voador, com os pegadores na altura dos ombros.',
    'Fique com o tronco ereto e o abdômen firme, sem encostar o peito na almofada.',
    'Com os cotovelos quase estendidos, abra os braços para trás até ficarem na linha dos ombros.',
    'Segure um instante e volte devagar, sem deixar os pesos baterem.',
  ],
  cues: [
    'Abdômen travado: o peito não toca na almofada.',
    'Sinta a parte de trás do ombro, não o pescoço.',
    'Abra os braços para os lados, sem encolher os ombros.',
  ],
  mistakes: [
    'Apoiar o peito na almofada',
    'Jogar o tronco para trás para ajudar',
    'Carga alta demais, que vira remada com o cotovelo dobrado',
  ],
  breath: 'Solte o ar ao abrir e puxe o ar ao voltar.',
  easier: 'Use menos carga e abra só até onde o tronco fica parado.',
  harder: 'Segure 2 segundos com os braços abertos.',
  swap: ['crucifixo-inverso', 'face-pull'],
  yt: 'crucifixo inverso no voador peck deck execução correta',
};

export default ex;
