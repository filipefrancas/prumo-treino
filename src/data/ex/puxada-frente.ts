import type { Exercise } from '../../types.ts';

/** Ficha B · Peito e costas. */
const ex: Exercise = {
  id: 'puxada-frente',
  name: 'Puxada na frente com pegada aberta',
  aka: ['Puxada frontal', 'Puxada alta', 'Pulley frente', 'Lat pulldown'],
  kind: 'forca',
  group: 'costas',
  muscles: {
    primary: ['grande dorsal'],
    secondary: ['bíceps', 'romboides', 'trapézio médio'],
  },
  equipment: ['polia', 'barra'],
  how: [
    'Segure a barra mais aberto que os ombros, palmas para a frente, e sente com as coxas presas no rolo.',
    'Incline o tronco um pouco para trás e estufe o peito.',
    'Puxe a barra até a parte alta do peito, levando os cotovelos para baixo e para trás.',
    'Volte devagar até os braços estenderem, deixando as costas esticarem.',
  ],
  cues: [
    'Pense em levar os cotovelos para os bolsos de trás da calça.',
    'Sinta as laterais das costas, não os braços.',
    'Peito aberto indo ao encontro da barra.',
  ],
  mistakes: [
    'Jogar o tronco para trás e usar o balanço para puxar',
    'Puxar a barra para trás da nuca',
    'Encolher os ombros e parar antes de estender os braços na volta',
  ],
  breath: 'Solte o ar ao puxar a barra e puxe o ar na volta.',
  easier: 'Use a pegada na largura dos ombros, com as palmas viradas para você.',
  harder: 'Segure 1 segundo com a barra no peito e volte em 3 segundos.',
  swap: ['puxada-supinada', 'pulldown-unilateral'],
  yt: 'puxada na frente pegada aberta execução correta',
};

export default ex;
