import type { Exercise } from '../../types.ts';

/** Ficha C · Braços e ombros. O exercício pesado de bíceps. */
const ex: Exercise = {
  id: 'rosca-direta-barra',
  name: 'Rosca direta com barra',
  aka: ['Rosca direta', 'Rosca com barra reta', 'Rosca com barra W'],
  kind: 'forca',
  group: 'biceps',
  muscles: {
    primary: ['bíceps'],
    secondary: ['braquial', 'antebraço'],
  },
  equipment: ['barra'],
  how: [
    'Fique em pé, pés na largura do quadril, segurando a barra com as palmas para a frente.',
    'Cole os cotovelos ao lado do tronco e firme o abdômen.',
    'Dobre os cotovelos e suba a barra até perto dos ombros, sem mexer o tronco.',
    'Aperte o bíceps no alto e desça devagar até estender os braços por completo.',
  ],
  cues: [
    'Cotovelos parados ao lado das costelas: só o antebraço se mexe.',
    'Sinta o bíceps trabalhar na subida e segurar a descida.',
    'Punhos retos, sem dobrar para trás.',
  ],
  mistakes: [
    'Balançar o tronco para trás para subir a barra',
    'Levar os cotovelos para a frente no fim da subida',
    'Descer pela metade, sem estender os braços',
  ],
  breath: 'Solte o ar ao subir a barra e puxe o ar na descida.',
  easier: 'Encoste as costas na parede para o tronco não balançar e use menos carga.',
  harder: 'Desça em 3 segundos em todas as repetições.',
  swap: ['rosca-banco-inclinado', 'rosca-martelo'],
  yt: 'rosca direta com barra execução correta',
};

export default ex;
