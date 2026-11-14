import type { Exercise } from '../../types.ts';

const ex: Exercise = {
  id: 'rolo-toracica',
  name: 'Rolo na coluna torácica',
  aka: ['Liberação miofascial da torácica', 'Rolo nas costas', 'Foam roller na torácica'],
  kind: 'liberacao',
  group: 'costas',
  muscles: {
    primary: ['eretores da espinha'],
    secondary: ['romboides', 'trapézio médio'],
  },
  equipment: ['rolo'],
  how: [
    'Deite de costas com o rolo atravessado sob o meio das costas, joelhos dobrados e pés no chão.',
    'Apoie a cabeça nas mãos, aproxime os cotovelos e tire o quadril do chão.',
    'Empurre o chão com os pés e role devagar do meio das costas até perto dos ombros.',
    'Volte até o meio das costas, sem descer para a lombar, e repita.',
  ],
  cues: [
    'As mãos carregam o peso da cabeça: pescoço solto, queixo levemente para dentro.',
    'Cotovelos próximos afastam as escápulas e o rolo pega a musculatura entre elas.',
    'Abdômen firme e costelas fechadas: o tronco rola inteiro, sem dobrar para trás.',
  ],
  mistakes: [
    'Descer com o rolo até a lombar',
    'Subir com o rolo até o pescoço',
    'Largar a cabeça para trás, sem o apoio das mãos',
  ],
  breath: 'Respire fundo e devagar, soltando o ar enquanto as costas amolecem sobre o rolo.',
  easier: 'Deixe o quadril apoiado no chão para tirar peso do rolo e role um trecho curto.',
  harder: 'Com o quadril no chão e o rolo parado no meio das costas, estenda o tronco para trás sobre ele.',
  yt: 'liberação miofascial coluna torácica rolo como fazer',
};

export default ex;
