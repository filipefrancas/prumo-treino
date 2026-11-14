import type { Exercise } from '../../types.ts';

/** Preparação da ficha A · Costas e bíceps (10 repetições lentas, alternando com o alongamento de peitoral com fita). */
const ex: Exercise = {
  id: 'mobilidade-ombro-bastao',
  name: 'Mobilidade de ombro com bastão',
  aka: ['Mobilidade de Ombro I', 'Extensão de ombros com bastão'],
  kind: 'aquecimento',
  group: 'ombros',
  muscles: {
    primary: ['deltoide anterior', 'peitoral maior'],
    secondary: ['bíceps', 'deltoide posterior', 'romboides'],
  },
  equipment: ['bastão'],
  how: [
    'Em pé, segure o bastão na horizontal atrás do corpo, de braços estendidos, encostado no glúteo.',
    'Suba os braços para trás, afastando o bastão do corpo, sem dobrar os cotovelos.',
    'Vá até onde os ombros deixam, com o tronco parado, e segure 1 s.',
    'Desça devagar até o bastão encostar de novo no glúteo.',
  ],
  cues: [
    'Peito aberto, ombros para trás e para baixo, longe das orelhas.',
    'Sinta abrir a frente dos ombros e o alto do peito.',
    'Olhar reto à frente e queixo recolhido; o tronco não se mexe.',
  ],
  mistakes: [
    'Inclinar o tronco para a frente para levar o bastão mais alto',
    'Dobrar os cotovelos na subida',
    'Fazer rápido, no embalo, sem controlar a descida',
  ],
  breath: 'Solte o ar ao subir os braços e puxe o ar ao descer.',
  easier: 'Afaste mais as mãos no bastão e suba menos.',
  harder: 'Aproxime as mãos no bastão e pare 2 s no ponto mais alto.',
  yt: 'mobilidade de ombro com bastão atrás do corpo',
};

export default ex;
