import type { Exercise } from '../../types.ts';

/** Fortalecimento dos pés: o tornozelo gira para dentro contra um elástico que puxa para fora. */
const ex: Exercise = {
  id: 'inversao-do-pe',
  name: 'Inversão do pé com elástico',
  aka: ['Inversão de tornozelo com elástico', 'Fortalecimento do tibial posterior'],
  kind: 'pes',
  group: 'pes',
  muscles: {
    primary: ['tibial posterior'],
    secondary: ['tibial anterior', 'flexores dos dedos'],
  },
  equipment: ['elástico'],
  sided: true,
  how: [
    'Sente no chão com uma perna estendida e passe o elástico pela ponta desse pé.',
    'Prenda a outra ponta em algo firme ao lado, de modo que o elástico puxe o pé para fora.',
    'Com o pé reto e o elástico já esticado, gire a ponta do pé para dentro, só com o tornozelo.',
    'Segure 1 segundo no fim do giro, com a sola do pé virada para a outra perna.',
    'Volte devagar, freando o elástico, até o pé ficar reto de novo.',
  ],
  cues: [
    'Sinta a parte de dentro da canela e do tornozelo: é ela que sustenta o arco do pé.',
    'Só o tornozelo se mexe; o joelho continua apontando para o teto.',
    'Leve o dedão para dentro e para cima, sem dobrar os dedos em garra.',
  ],
  mistakes: [
    'Girar a perna inteira a partir do quadril em vez de mexer só o pé',
    'Deixar o elástico puxar o pé de volta de uma vez',
    'Usar elástico forte demais e fazer só um pedaço do movimento',
  ],
  breath: 'Solte o ar ao girar o pé para dentro e puxe o ar na volta lenta.',
  easier: 'Sente mais perto do ponto onde o elástico está preso, com menos tensão, ou use um mais leve.',
  harder: 'Segure 3 segundos com o pé virado para dentro ou use um elástico mais forte.',
  yt: 'inversão de tornozelo com elástico tibial posterior exercício',
};

export default ex;
