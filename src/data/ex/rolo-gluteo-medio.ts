import type { Exercise } from '../../types.ts';

const ex: Exercise = {
  id: 'rolo-gluteo-medio',
  name: 'Rolo no glúteo médio',
  aka: ['Liberação miofascial do glúteo médio', 'Rolo na lateral do quadril'],
  kind: 'liberacao',
  group: 'gluteos',
  muscles: {
    primary: ['glúteo médio'],
    secondary: ['glúteo mínimo', 'tensor da fáscia lata'],
  },
  equipment: ['rolo'],
  sided: true,
  how: [
    'Deite de lado com o rolo sob a lateral do quadril e o antebraço de baixo apoiado no chão.',
    'Cruze a perna de cima à frente e apoie o pé no chão para controlar o peso.',
    'Role curto, um palmo, na parte carnuda entre o osso da cintura e o osso saliente do quadril.',
    'Onde estiver mais dolorido, pare alguns segundos, respire e continue.',
  ],
  cues: [
    'O alvo é carnudo: se sentir osso embaixo, suba ou desça o rolo dois dedos.',
    'Incline o corpo um pouco para trás para o rolo pegar o glúteo, e não a lateral da coxa.',
    'O pé da frente e o antebraço dosam a pressão: empurre o chão para aliviar.',
  ],
  mistakes: [
    'Rolar em cima do osso saliente da lateral do quadril',
    'Descer para a lateral da coxa e sair do glúteo',
    'Largar todo o peso de uma vez e travar o corpo de dor',
  ],
  breath: 'Respire lento e fundo, soltando o ar devagar enquanto a lateral do quadril cede.',
  easier: 'Faça em pé, com o rolo entre a lateral do quadril e a parede.',
  harder: 'Estenda a perna de cima sobre a de baixo, sem o apoio do pé, ou use uma bolinha firme.',
  yt: 'liberação miofascial glúteo médio rolo lateral do quadril',
};

export default ex;
