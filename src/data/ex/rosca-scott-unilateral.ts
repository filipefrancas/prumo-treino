import type { Exercise } from '../../types.ts';

/** Ficha A · Costas e bíceps. */
const ex: Exercise = {
  id: 'rosca-scott-unilateral',
  name: 'Rosca Scott unilateral com halter',
  aka: ['Rosca Scott Unilateral com Halteres', 'Rosca Scott com halter', 'Rosca no banco Scott'],
  kind: 'forca',
  group: 'biceps',
  muscles: {
    primary: ['bíceps'],
    secondary: ['braquial', 'antebraço'],
  },
  equipment: ['halteres', 'banco Scott'],
  sided: true,
  how: [
    'Sente no banco Scott e encoste toda a parte de trás do braço no apoio, com a axila no topo.',
    'Comece com o braço quase estendido, palma para cima e punho reto.',
    'Dobre o cotovelo e suba o halter até perto do ombro, sem descolar o braço do apoio.',
    'Desça devagar até quase estender, mantendo uma dobra leve no cotovelo.',
  ],
  cues: [
    'Sinta o bíceps do começo ao fim; a parte de baixo é a mais dura, não fuja dela.',
    'Braço colado no apoio, ombro baixo e quadril no assento.',
    'Punho firme e reto: o halter não pode dobrar a mão para trás.',
  ],
  mistakes: [
    'Descolar o cotovelo do apoio para ganhar impulso',
    'Soltar o peso na descida e esticar o cotovelo de uma vez',
    'Levantar o quadril do assento e jogar o ombro para a frente',
  ],
  breath: 'Solte o ar ao subir o halter e puxe o ar na descida.',
  easier: 'Dê uma ajuda leve com a mão livre na parte mais difícil da subida.',
  harder: 'Desça em 3 a 4 segundos em cada repetição, sem perder o apoio do braço.',
  swap: ['rosca-banco-inclinado'],
  yt: 'rosca scott unilateral com halter execução',
};

export default ex;
