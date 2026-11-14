import type { Exercise } from '../../types.ts';

/** Aquecimento antes da corrida: a perna balança para o lado e cruza à frente da perna de apoio. */
const ex: Exercise = {
  id: 'balanco-de-perna-lateral',
  name: 'Balanço de perna para os lados',
  aka: ['Balanço lateral de perna', 'Pêndulo lateral', 'Leg swing lateral'],
  kind: 'aquecimento',
  group: 'quadril',
  muscles: {
    primary: ['glúteo médio', 'adutores'],
    secondary: ['flexores do quadril', 'oblíquos'],
  },
  equipment: ['peso do corpo', 'parede ou barra'],
  sided: true,
  how: [
    'Fique de frente para uma barra ou parede, mãos apoiadas na altura da cintura, peso em uma perna.',
    'Balance a outra perna (a do lado da vez) solta para o lado, abrindo até uns 45°.',
    'Deixe a perna voltar e cruzar à frente da perna de apoio.',
    'Siga no vaivém, de um lado para o outro, ganhando amplitude aos poucos.',
  ],
  cues: [
    'Sinta a lateral do quadril na abertura e a parte interna da coxa soltar no cruzamento.',
    'Quadril e ombros de frente para a barra o tempo todo; só a perna cruza.',
    'Ponta do pé apontada para a frente, sem girar a perna para fora.',
  ],
  mistakes: [
    'Girar o quadril e o tronco para acompanhar a perna',
    'Tombar o corpo para o lado oposto para a perna subir mais',
    'Deixar o joelho da perna de apoio dobrar ou cair para dentro',
  ],
  breath: 'Solte o ar quando a perna abre e puxe quando ela cruza à frente.',
  easier: 'Abra menos a perna e cruze só até a linha da perna de apoio.',
  harder: 'Apoie só a ponta dos dedos na barra e ganhe amplitude sem tombar o tronco.',
  yt: 'balanço de perna lateral aquecimento dinâmico para corrida execução',
};

export default ex;
