import type { Exercise } from '../../types.ts';

/** Ficha C · Braços e ombros. */
const ex: Exercise = {
  id: 'elevacao-lateral',
  name: 'Elevação lateral com halteres',
  aka: ['Elevação lateral', 'Abdução de ombros com halteres'],
  kind: 'forca',
  group: 'ombros',
  muscles: {
    primary: ['deltoide lateral'],
    secondary: ['deltoide anterior', 'trapézio superior', 'manguito rotador'],
  },
  equipment: ['halteres'],
  how: [
    'Fique em pé, pés na largura do quadril, joelhos soltos e um halter em cada mão ao lado do corpo.',
    'Dobre de leve os cotovelos, abra o peito e firme o abdômen.',
    'Suba os braços para os lados até a altura dos ombros, cotovelos na mesma altura das mãos.',
    'Segure um instante e desça devagar, sem encostar os halteres no corpo.',
  ],
  cues: [
    'Pense em afastar os halteres para as paredes, não em levantá-los.',
    'Sinta a lateral dos ombros; se o pescoço tensionar, baixe a carga.',
    'Olhe para a frente, com o tronco parado e os ombros longe das orelhas.',
  ],
  mistakes: [
    'Balançar o tronco para dar impulso aos halteres',
    'Encolher os ombros na subida, deixando o trapézio roubar o trabalho',
    'Subir as mãos mais alto que os cotovelos, puxando com o antebraço',
  ],
  breath: 'Solte o ar ao subir os braços e puxe o ar na descida.',
  easier: 'Dobre os cotovelos a 90° para encurtar a alavanca e use halteres mais leves.',
  harder: 'Desça em 3 segundos e pare antes de os halteres encostarem no corpo, sem descansar embaixo.',
  swap: ['desenvolvimento-halteres', 'desenvolvimento-maquina'],
  yt: 'elevação lateral com halteres execução correta',
};

export default ex;
