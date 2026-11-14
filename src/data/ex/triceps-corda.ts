import type { Exercise } from '../../types.ts';

/** Ficha C · Braços e ombros. Fecha o tríceps, com mais repetições. */
const ex: Exercise = {
  id: 'triceps-corda',
  name: 'Tríceps na polia com corda',
  aka: ['Tríceps corda', 'Tríceps pulley com corda', 'Extensão de tríceps na polia'],
  kind: 'forca',
  group: 'triceps',
  muscles: {
    primary: ['tríceps'],
    secondary: ['antebraço'],
  },
  equipment: ['polia', 'corda'],
  how: [
    'Prenda a corda na polia alta e segure uma ponta em cada mão, de frente para o aparelho.',
    'Incline um pouco o tronco e cole os cotovelos ao lado das costelas.',
    'Empurre a corda para baixo até estender os braços, abrindo as mãos para os lados no fim.',
    'Volte devagar até as mãos chegarem à altura do peito, sem soltar os cotovelos.',
  ],
  cues: [
    'Cotovelos presos ao lado do corpo: só o antebraço se mexe.',
    'Sinta a parte de trás do braço apertar quando a corda abre embaixo.',
    'Ombros para baixo e tronco parado.',
  ],
  mistakes: [
    'Jogar o peso do corpo em cima da corda para empurrar',
    'Deixar os cotovelos subirem e abrirem na volta',
    'Parar antes de estender os braços por completo',
  ],
  breath: 'Solte o ar ao empurrar a corda e puxe o ar na volta.',
  easier: 'Use menos carga e segure 1 segundo com os braços estendidos.',
  harder: 'Segure 2 segundos embaixo e volte em 3 segundos.',
  swap: ['triceps-frances-polia', 'triceps-paralela-maquina'],
  yt: 'tríceps na polia com corda execução correta',
};

export default ex;
