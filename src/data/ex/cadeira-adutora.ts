import type { Exercise } from '../../types.ts';

/** Ficha A · Pernas. A parte de dentro da coxa estabiliza o quadril na passada. */
const ex: Exercise = {
  id: 'cadeira-adutora',
  name: 'Cadeira adutora',
  aka: ['Adutora', 'Adução de quadril na máquina'],
  kind: 'forca',
  group: 'pernas',
  muscles: {
    primary: ['adutores'],
    secondary: ['grácil', 'pectíneo'],
  },
  equipment: ['máquina'],
  how: [
    'Sente na cadeira com as costas no encosto e a parte de dentro das coxas encostada nas almofadas, pernas abertas.',
    'Ajuste a abertura para sentir um alongamento leve, sem dor na virilha.',
    'Feche as pernas até as almofadas se encontrarem.',
    'Segure um instante e abra devagar, sem deixar os pesos baterem.',
  ],
  cues: [
    'Sinta a parte de dentro das coxas.',
    'O tronco fica parado e encostado: só as pernas se movem.',
    'Abra contando 2 segundos.',
  ],
  mistakes: [
    'Começar com abertura grande demais e forçar a virilha',
    'Deixar as pernas abrirem de uma vez',
    'Inclinar o tronco para a frente para ajudar a fechar',
  ],
  breath: 'Solte o ar ao fechar e puxe o ar ao abrir.',
  easier: 'Use menos carga e uma abertura menor.',
  harder: 'Segure 2 segundos com as pernas fechadas.',
  swap: ['cadeira-abdutora', 'leg-press-45'],
  yt: 'cadeira adutora execução correta',
};

export default ex;
