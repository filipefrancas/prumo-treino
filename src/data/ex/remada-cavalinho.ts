import type { Exercise } from '../../types.ts';

/** Ficha A · Costas e bíceps. */
const ex: Exercise = {
  id: 'remada-cavalinho',
  name: 'Remada cavalinho (pegada neutra)',
  aka: ['Remada Cavalinho (Pegada Neutra)', 'Remada em T', 'Remada cavalinho com triângulo', 'T-bar row'],
  kind: 'forca',
  group: 'costas',
  muscles: {
    primary: ['dorsal', 'trapézio médio'],
    secondary: ['romboides', 'bíceps', 'eretores da espinha'],
  },
  equipment: ['barra', 'anilhas', 'puxador triângulo'],
  how: [
    'Fique em pé com a barra entre as pernas e encaixe o puxador sob ela, perto das anilhas.',
    'Levante a barra com as pernas e pare com o tronco a uns 45°, coluna reta e joelhos um pouco dobrados.',
    'Puxe os cotovelos para trás, rente ao corpo, até as mãos chegarem ao abdômen.',
    'Aperte as costas por um instante e desça devagar até estender os braços, sem mexer o tronco.',
  ],
  cues: [
    'Sinta o meio das costas: pense em guardar os cotovelos nos bolsos de trás da calça.',
    'Olhe para o chão, um passo à frente, com o pescoço na linha da coluna.',
    'Abdômen firme e peso no meio dos pés: o tronco não sobe nem desce.',
  ],
  mistakes: [
    'Levantar o tronco a cada puxada para ajudar a subir a carga',
    'Arredondar a lombar quando a barra desce',
    'Encolher os ombros e puxar só com os braços',
  ],
  breath: 'Solte o ar ao trazer a barra até o abdômen e puxe o ar enquanto ela desce.',
  easier: 'Troque pela remada na máquina, com o peito apoiado, que poupa a lombar.',
  harder: 'Segure 2 segundos com as mãos no abdômen em todas as repetições, como na série com isometria.',
  swap: ['remada-maquina', 'puxada-supinada'],
  yt: 'remada cavalinho pegada neutra execução',
};

export default ex;
