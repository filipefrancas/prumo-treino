import type { Exercise } from '../../types.ts';

/** Ficha A · Pernas. */
const ex: Exercise = {
  id: 'cadeira-extensora',
  name: 'Cadeira extensora',
  aka: ['Extensora', 'Extensão de joelhos na máquina'],
  kind: 'forca',
  group: 'pernas',
  muscles: {
    primary: ['quadríceps'],
  },
  equipment: ['máquina'],
  how: [
    'Ajuste o encosto para o joelho ficar na linha do eixo da máquina e o rolo na frente dos tornozelos.',
    'Sente com as costas no encosto e segure os pegadores ao lado do assento.',
    'Estenda as duas pernas até ficarem retas e aperte a frente das coxas por um instante.',
    'Desça devagar até os joelhos dobrarem a 90°, sem deixar a carga bater.',
  ],
  cues: [
    'Sinta a frente das coxas queimar, principalmente no alto do movimento.',
    'Quadril colado no assento do começo ao fim.',
    'A descida é tão importante quanto a subida: controle a volta.',
  ],
  mistakes: [
    'Chutar a carga com impulso em vez de estender com controle',
    'Levantar o quadril do assento para ajudar',
    'Soltar a carga na descida e deixar as placas baterem',
  ],
  breath: 'Solte o ar ao estender as pernas e puxe o ar na descida.',
  easier: 'Use menos carga e segure 1 segundo com as pernas estendidas.',
  harder: 'Segure 2 segundos no alto e desça em 3 segundos.',
  swap: ['cadeira-extensora-unilateral', 'leg-press-45'],
  yt: 'cadeira extensora execução correta',
};

export default ex;
