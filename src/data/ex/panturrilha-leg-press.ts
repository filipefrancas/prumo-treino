import type { Exercise } from '../../types.ts';

/** Ficha B · Inferiores (com pausa de 2 s no alongamento, embaixo). */
const ex: Exercise = {
  id: 'panturrilha-leg-press',
  name: 'Panturrilha no leg press horizontal',
  aka: ['Panturrilha no Leg Press Horizontal', 'Flexão plantar no leg press', 'Gêmeos no leg press'],
  kind: 'forca',
  group: 'panturrilha',
  muscles: {
    primary: ['panturrilha'],
    secondary: ['musculatura do pé', 'tibial posterior', 'fibulares'],
  },
  equipment: ['máquina'],
  how: [
    'Sente no leg press horizontal, estenda as pernas e apoie só a ponta dos pés na plataforma.',
    'Deixe a ponta dos pés ceder na direção das canelas até a panturrilha esticar e segure 2 s.',
    'Empurre a plataforma com a ponta dos pés até ficar com os pés em ponta, o mais longe que der.',
    'Volte devagar ao alongamento, movendo só os tornozelos: os joelhos ficam estendidos, sem travar.',
  ],
  cues: [
    'Empurre pela base do dedão, sem deixar o pé rolar para o lado de fora.',
    'A pausa de 2 s é embaixo, com a panturrilha alongada; nada de quicar.',
    'No alto, aperte a panturrilha por um instante antes de voltar.',
  ],
  mistakes: [
    'Quicar no fundo e aproveitar o embalo, sem fazer a pausa',
    'Dobrar os joelhos para ajudar a empurrar a plataforma',
    'Encurtar o movimento, sem alongar embaixo nem subir até o fim',
  ],
  breath: 'Solte o ar ao empurrar a plataforma e puxe na volta, sem prender a respiração na pausa.',
  easier: 'Em pé, na borda de um degrau, só com o peso do corpo e as mãos apoiadas.',
  harder: 'Faça uma perna de cada vez, com cerca de metade da carga.',
  swap: ['flexao-plantar', 'elevacao-de-panturrilha'],
  yt: 'panturrilha no leg press horizontal execução correta',
};

export default ex;
