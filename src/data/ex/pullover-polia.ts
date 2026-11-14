import type { Exercise } from '../../types.ts';

/** Ficha B · Peito e costas. Trabalha as costas com o braço estendido, sem gastar o bíceps. */
const ex: Exercise = {
  id: 'pullover-polia',
  name: 'Pullover na polia',
  aka: ['Pulldown com braços estendidos', 'Pullover em pé na polia alta'],
  kind: 'forca',
  group: 'costas',
  muscles: {
    primary: ['grande dorsal'],
    secondary: ['tríceps (cabeça longa)', 'deltoide posterior', 'abdômen'],
  },
  equipment: ['polia', 'barra reta ou corda'],
  how: [
    'Fique de frente para a polia alta, um passo para trás, e segure a barra com as mãos na largura dos ombros.',
    'Incline o tronco um pouco à frente, joelhos soltos e braços quase estendidos na altura do rosto.',
    'Puxe a barra para baixo em arco, com os braços estendidos, até encostar nas coxas.',
    'Aperte as costas um instante e volte devagar até a altura do rosto.',
  ],
  cues: [
    'Sinta a lateral das costas, embaixo das axilas.',
    'Os cotovelos quase não dobram: o movimento é do ombro.',
    'Abdômen firme para o tronco não balançar.',
  ],
  mistakes: [
    'Dobrar os cotovelos e virar tríceps na polia',
    'Balançar o tronco para ajudar a descer a carga',
    'Encolher os ombros em direção às orelhas',
  ],
  breath: 'Solte o ar ao puxar para baixo e puxe o ar ao voltar.',
  easier: 'Use menos carga e a corda, que deixa os punhos mais livres.',
  harder: 'Segure 2 segundos com a barra nas coxas.',
  swap: ['puxada-frente', 'remada-baixa'],
  yt: 'pullover na polia alta em pé execução',
};

export default ex;
