import type { Exercise } from '../../types.ts';

/** Ficha C · Braços e ombros. O exercício pesado de tríceps. */
const ex: Exercise = {
  id: 'triceps-testa',
  name: 'Tríceps testa com barra W',
  aka: ['Tríceps testa', 'Rosca testa', 'Skull crusher'],
  kind: 'forca',
  group: 'triceps',
  muscles: {
    primary: ['tríceps'],
    secondary: ['antebraço'],
  },
  equipment: ['barra W', 'banco'],
  how: [
    'Deite no banco com os pés no chão e segure a barra W na parte de dentro, palmas para a frente.',
    'Estenda os braços acima do peito, levemente inclinados em direção à cabeça.',
    'Dobre só os cotovelos e desça a barra devagar até perto da testa.',
    'Estenda os braços de volta, sem deixar os cotovelos abrirem para os lados.',
  ],
  cues: [
    'Cotovelos apontando para o teto, parados no mesmo lugar.',
    'Sinta a parte de trás do braço esticar embaixo e apertar no alto.',
    'Desça com controle: a barra passa perto da testa, sem pressa.',
  ],
  mistakes: [
    'Abrir os cotovelos para os lados durante a descida',
    'Mexer os ombros e transformar o movimento em supino fechado',
    'Descer rápido demais, sem controle da barra',
  ],
  breath: 'Puxe o ar na descida e solte ao estender os braços.',
  easier: 'Faça com dois halteres, palmas viradas uma para a outra.',
  harder: 'Desça a barra até atrás da cabeça para alongar mais o tríceps.',
  swap: ['triceps-frances-polia', 'triceps-corda'],
  yt: 'tríceps testa com barra W execução correta',
};

export default ex;
