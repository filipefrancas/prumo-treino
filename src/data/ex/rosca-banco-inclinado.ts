import type { Exercise } from '../../types.ts';

/** Ficha C · Braços e ombros. Alonga o bíceps: é o que o banco inclinado tem de especial. */
const ex: Exercise = {
  id: 'rosca-banco-inclinado',
  name: 'Rosca no banco inclinado com halteres',
  aka: ['Rosca inclinada com halteres', 'Rosca no banco inclinado', 'Rosca direta no banco inclinado'],
  kind: 'forca',
  group: 'biceps',
  muscles: {
    primary: ['bíceps'],
    secondary: ['braquial', 'antebraço'],
  },
  equipment: ['halteres', 'banco inclinado'],
  how: [
    'Sente no banco inclinado a uns 60°, costas e cabeça apoiadas, um halter em cada mão.',
    'Deixe os braços penderem retos, atrás da linha do tronco, com as palmas para a frente.',
    'Dobre os cotovelos e suba os halteres até perto dos ombros, sem tirar os cotovelos do lugar.',
    'Aperte o bíceps no alto e desça devagar até estender os braços por completo.',
  ],
  cues: [
    'Cotovelos apontando para o chão o tempo todo, como se estivessem pregados ali.',
    'Sinta o bíceps alongar embaixo: é isso que o banco inclinado tem de especial.',
    'Ombros para trás, colados no banco, e cabeça apoiada do começo ao fim.',
  ],
  mistakes: [
    'Trazer os cotovelos para a frente para ajudar a subir',
    'Desencostar os ombros e a cabeça do banco no fim da subida',
    'Parar a descida antes de estender os braços',
  ],
  breath: 'Solte o ar ao subir os halteres e puxe o ar na descida.',
  easier: 'Levante um pouco mais o encosto ou suba um braço de cada vez.',
  harder: 'Desça em 3 segundos e pare 1 segundo com os braços estendidos antes de subir de novo.',
  swap: ['rosca-direta-barra', 'rosca-martelo'],
  yt: 'rosca no banco inclinado com halteres execução',
};

export default ex;
