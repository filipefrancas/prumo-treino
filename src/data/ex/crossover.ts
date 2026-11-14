import type { Exercise } from '../../types.ts';

/** Ficha B · Peito e costas. */
const ex: Exercise = {
  id: 'crossover',
  name: 'Crossover na polia',
  aka: ['Cross over', 'Crucifixo na polia', 'Voador no cabo'],
  kind: 'forca',
  group: 'peito',
  muscles: {
    primary: ['peitoral maior'],
    secondary: ['deltoide anterior'],
  },
  equipment: ['polia'],
  how: [
    'Ajuste as duas polias no alto, segure um pegador em cada mão e dê um passo à frente.',
    'Fique com um pé à frente, tronco um pouco inclinado e cotovelos levemente dobrados.',
    'Feche os braços para baixo e para a frente até as mãos se encontrarem na altura do umbigo.',
    'Aperte o peito por 1 segundo e abra devagar até sentir ele esticar.',
  ],
  cues: [
    'Pense em abraçar uma árvore grande: os cotovelos não dobram nem esticam.',
    'Sinta o peito apertar quando as mãos se encontram.',
    'Ombros longe das orelhas e tronco parado.',
  ],
  mistakes: [
    'Dobrar e esticar os cotovelos, transformando o movimento em empurrar',
    'Abrir demais na volta e deixar os ombros irem para a frente',
    'Usar carga alta e balançar o corpo para fechar os braços',
  ],
  breath: 'Solte o ar ao fechar os braços e puxe o ar ao abrir.',
  easier: 'Use menos carga e faça um braço de cada vez.',
  harder: 'Segure 2 segundos com as mãos juntas e abra em 3 segundos.',
  swap: ['crucifixo-inclinado', 'supino-inclinado-halteres'],
  yt: 'crossover na polia alta execução correta',
};

export default ex;
