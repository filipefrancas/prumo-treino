import type { Exercise } from '../../types.ts';

/** Ficha B · Inferiores (séries leves, alternadas com a passada lateral com elástico, antes do treino principal). */
const ex: Exercise = {
  id: 'agachamento-halter-frente',
  name: 'Agachamento com halter na frente',
  aka: ['Agachamento com Halter na Frente', 'Agachamento goblet', 'Agachamento taça', 'Goblet squat'],
  kind: 'forca',
  group: 'pernas',
  muscles: {
    primary: ['quadríceps', 'glúteo máximo'],
    secondary: ['adutores', 'eretores da espinha', 'reto abdominal'],
  },
  equipment: ['halteres'],
  how: [
    'Fique em pé, pés um pouco além da largura dos ombros, e segure um halter junto ao peito com as duas mãos.',
    'Com os cotovelos apontando para baixo, desça como quem senta entre os calcanhares, de tronco alto.',
    'Vá até as coxas ficarem paralelas ao chão ou um pouco abaixo, sem tirar os calcanhares do chão.',
    'Suba empurrando o chão com o pé inteiro até ficar em pé de novo.',
  ],
  cues: [
    'Peso no meio do pé: calcanhar e dedão no chão do começo ao fim.',
    'Halter colado no peito: se ele se afasta, o tronco cai para a frente.',
    'No fundo, os cotovelos passam por dentro dos joelhos e ajudam a mantê-los abertos.',
  ],
  mistakes: [
    'Deixar os joelhos caírem para dentro na subida',
    'Tirar os calcanhares do chão para conseguir descer mais',
    'Arredondar as costas e deixar o halter puxar o tronco para a frente',
  ],
  breath: 'Puxe o ar na descida e solte na subida, com o abdômen firme o tempo todo.',
  easier: 'Agache até encostar de leve em um banco atrás de você e suba.',
  harder: 'Desça em 3 s e pare 2 s no fundo, sem relaxar, antes de subir.',
  swap: ['leg-press-45', 'recuo-com-halteres', 'agachamento-peso-do-corpo'],
  yt: 'agachamento goblet com halter execução correta',
};

export default ex;
