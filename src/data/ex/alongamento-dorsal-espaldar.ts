import type { Exercise } from '../../types.ts';

/** Preparação da ficha A · Costas e bíceps (posição sustentada, 30 a 45 s). */
const ex: Exercise = {
  id: 'alongamento-dorsal-espaldar',
  name: 'Alongamento de dorsal no espaldar',
  aka: ['Alongamento Dorsal Espaldar I', 'Alongamento de dorsal pendurado', 'Suspensão no espaldar'],
  kind: 'alongamento',
  group: 'costas',
  muscles: {
    primary: ['dorsal'],
    secondary: ['redondo maior', 'peitoral maior'],
  },
  equipment: ['espaldar'],
  how: [
    'Segure a barra mais alta do espaldar com as duas mãos, na largura dos ombros.',
    'Solte o peso do corpo aos poucos até ficar pendurado, de braços estendidos e pés tocando de leve o apoio.',
    'Leve o quadril um pouco para trás e deixe as laterais das costas esticarem.',
    'Para sair, apoie os pés inteiros no chão ou em um degrau antes de soltar as mãos.',
  ],
  cues: [
    'Sinta esticar da axila até a cintura, nas laterais das costas.',
    'Braços e ombros soltos: aqui é para deixar o corpo pesar, não para puxar.',
    'Quanto mais peso você tira dos pés, mais forte fica o alongamento.',
  ],
  mistakes: [
    'Manter os braços dobrados e os ombros contraídos, sem soltar o peso',
    'Prender a respiração enquanto está pendurado',
    'Soltar o corpo de uma vez ou ficar balançando',
  ],
  breath: 'Respire fundo e devagar e, ao soltar o ar, deixe o corpo pesar um pouco mais nas mãos.',
  easier: 'Deixe os pés inteiros no chão ou em um degrau, com mais peso nas pernas.',
  harder: 'Tire os pés do apoio e fique pendurado só pelas mãos.',
  yt: 'alongamento de dorsal pendurado no espaldar',
};

export default ex;
