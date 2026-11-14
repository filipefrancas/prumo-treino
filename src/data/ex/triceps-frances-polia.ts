import type { Exercise } from '../../types.ts';

/** Ficha C · Braços e ombros. Com a corda, nas duas mãos: alonga o tríceps atrás da cabeça. */
const ex: Exercise = {
  id: 'triceps-frances-polia',
  name: 'Tríceps francês na polia',
  aka: ['Tríceps francês com corda', 'Tríceps francês no cabo', 'Extensão de tríceps acima da cabeça'],
  kind: 'forca',
  group: 'triceps',
  muscles: {
    primary: ['tríceps'],
    secondary: ['reto abdominal'],
  },
  equipment: ['polia', 'corda'],
  how: [
    'Prenda a corda na polia baixa, segure uma ponta em cada mão e vire de costas para o aparelho.',
    'Dê um passo à frente, um pé adiante do outro, tronco levemente inclinado e abdômen firme.',
    'Leve os cotovelos para cima, ao lado da cabeça, com as mãos atrás da nuca.',
    'Estenda os antebraços para cima e para a frente até os braços ficarem retos.',
    'Volte devagar até as mãos chegarem atrás da nuca, sem os cotovelos abrirem ou descerem.',
  ],
  cues: [
    'Sinta o tríceps alongar atrás da cabeça e apertar quando os braços esticam.',
    'Cotovelos parados, apontando para a frente e para cima: só os antebraços se mexem.',
    'Costelas para baixo e olhar à frente, sem arquear a lombar.',
  ],
  mistakes: [
    'Abrir os cotovelos para os lados ou deixá-los descer a cada repetição',
    'Arquear a lombar quando o cabo puxa os braços para trás',
    'Encurtar a volta e não levar as mãos até atrás da nuca',
  ],
  breath: 'Solte o ar ao estender os braços e puxe o ar na volta.',
  easier: 'Use menos carga e faça sentado em um banco, de costas para a polia.',
  harder: 'Segure 1 segundo com os braços retos e volte em 3 segundos, alongando bem atrás da cabeça.',
  swap: ['triceps-testa', 'triceps-corda'],
  yt: 'tríceps francês na polia com corda execução',
};

export default ex;
