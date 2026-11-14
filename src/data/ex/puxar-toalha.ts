import type { Exercise } from '../../types.ts';

/** Fortalecimento dos pés: musculatura da sola e do arco, sentado e descalço. */
const ex: Exercise = {
  id: 'puxar-toalha',
  name: 'Puxar a toalha com o pé',
  aka: ['Exercício da toalha', 'Enrugar a toalha com os dedos', 'Towel curl'],
  kind: 'pes',
  group: 'pes',
  muscles: {
    primary: ['musculatura do pé'],
    secondary: ['flexores dos dedos'],
  },
  equipment: ['toalha', 'cadeira'],
  sided: true,
  how: [
    'Sente em uma cadeira, descalço, com a toalha estendida no chão e um pé apoiado na ponta dela.',
    'Com o calcanhar parado no chão, abra e estique os dedos sobre a toalha.',
    'Feche os dedos como uma garra e puxe a toalha para baixo do pé, formando uma ruga.',
    'Solte, estique os dedos de novo e repita; se a toalha acabar, estenda e continue.',
  ],
  cues: [
    'Sinta a sola do pé contrair e o arco subir a cada puxada.',
    'O calcanhar não sai do lugar: quem anda é a toalha, não o pé.',
    'Cãibra na sola é comum no começo: solte, mexa os dedos e recomece.',
  ],
  mistakes: [
    'Arrastar o pé inteiro para trás em vez de puxar com os dedos',
    'Levantar o calcanhar para ajudar na puxada',
    'Dar puxadas curtas e apressadas, sem abrir bem os dedos antes',
  ],
  breath: 'Respire solto, sem prender o ar, soltando o ar a cada puxada dos dedos.',
  easier: 'Use uma toalha fina em piso liso, que desliza com menos esforço.',
  harder: 'Ponha um peso na ponta da toalha (um livro ou um halter leve) ou faça em pé.',
  yt: 'exercício da toalha fortalecimento do pé arco plantar',
};

export default ex;
