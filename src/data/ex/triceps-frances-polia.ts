import type { Exercise } from '../../types.ts';

/** Ficha C · Peito, ombro e braço. */
const ex: Exercise = {
  id: 'triceps-frances-polia',
  name: 'Tríceps francês unilateral na polia',
  aka: ['Tríceps Francês Unilateral na Polia', 'Tríceps francês no cabo', 'Extensão de tríceps acima da cabeça'],
  kind: 'forca',
  group: 'triceps',
  muscles: {
    primary: ['tríceps'],
    secondary: ['reto abdominal'],
  },
  equipment: ['polia'],
  sided: true,
  how: [
    'Fique de costas para a polia, um pé à frente, tronco levemente inclinado e abdômen firme.',
    'Leve o cotovelo para cima, ao lado da cabeça, com a mão atrás da nuca segurando o pegador.',
    'Estenda o antebraço para cima e para a frente até o braço ficar reto.',
    'Volte devagar até a mão chegar atrás da nuca, sem deixar o cotovelo abrir ou descer.',
  ],
  cues: [
    'Sinta o tríceps alongar atrás da cabeça e apertar quando o braço estica.',
    'Cotovelo parado, apontando para cima: só o antebraço se mexe.',
    'Costelas para baixo e olhar à frente, sem arquear a lombar.',
  ],
  mistakes: [
    'Abrir o cotovelo para o lado ou deixá-lo descer a cada repetição',
    'Arquear a lombar quando o cabo puxa o braço para trás',
    'Encurtar a volta e não levar a mão até atrás da nuca',
  ],
  breath: 'Solte o ar ao estender o braço e puxe o ar na volta.',
  easier: 'Segure o cotovelo com a mão livre para mantê-lo parado e use menos carga.',
  harder: 'Segure 1 segundo com o braço reto e volte em 3 segundos, alongando bem atrás da cabeça.',
  swap: ['triceps-paralela-maquina'],
  yt: 'tríceps francês unilateral na polia execução',
};

export default ex;
