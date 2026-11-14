import type { Exercise } from '../../types.ts';

/** Ficha A · Pernas. A lateral do quadril segura o joelho alinhado na passada. */
const ex: Exercise = {
  id: 'cadeira-abdutora',
  name: 'Cadeira abdutora',
  aka: ['Abdutora', 'Abdução de quadril na máquina'],
  kind: 'forca',
  group: 'gluteos',
  muscles: {
    primary: ['glúteo médio'],
    secondary: ['glúteo mínimo', 'tensor da fáscia lata'],
  },
  equipment: ['máquina'],
  how: [
    'Sente na cadeira com as costas no encosto e a parte de fora das coxas encostada nas almofadas.',
    'Segure os pegadores e mantenha os pés nos apoios.',
    'Abra as pernas empurrando as almofadas para fora, até onde conseguir sem tirar o quadril do banco.',
    'Segure um instante e feche devagar, sem deixar os pesos baterem.',
  ],
  cues: [
    'Sinta a lateral do quadril, logo abaixo da cintura.',
    'O tronco fica parado: só as pernas se movem.',
    'A volta é tão importante quanto a abertura: conte 2 segundos.',
  ],
  mistakes: [
    'Dar impulso com o tronco para abrir',
    'Deixar as pernas fecharem de uma vez',
    'Usar tanta carga que a abertura fica pela metade',
  ],
  breath: 'Solte o ar ao abrir e puxe o ar ao fechar.',
  easier: 'Use menos carga e faça a abertura completa.',
  harder: 'Incline o tronco um pouco à frente e segure 2 segundos aberto.',
  swap: ['passada-lateral-elastico', 'elevacao-pelvica'],
  yt: 'cadeira abdutora execução correta',
};

export default ex;
