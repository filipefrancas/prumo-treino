import type { Exercise } from '../../types.ts';

/** Fortalecimento dos pés: o tornozelo gira para fora contra um elástico que puxa para dentro. */
const ex: Exercise = {
  id: 'eversao-do-pe',
  name: 'Eversão do pé com elástico',
  aka: ['Eversão de tornozelo com elástico', 'Fortalecimento dos fibulares'],
  kind: 'pes',
  group: 'pes',
  muscles: {
    primary: ['fibulares'],
    secondary: ['extensores dos dedos'],
  },
  equipment: ['elástico'],
  sided: true,
  how: [
    'Sente no chão com uma perna estendida e passe o elástico pela ponta desse pé.',
    'Prenda a outra ponta em algo firme do lado da outra perna, para o elástico puxar o pé para dentro.',
    'Com o pé reto e o elástico já esticado, gire a ponta do pé para fora, só com o tornozelo.',
    'Segure 1 segundo no fim do giro, com o dedinho apontando para fora e para cima.',
    'Volte devagar, sem deixar o elástico vencer, até o pé ficar reto de novo.',
  ],
  cues: [
    'Sinta a lateral de fora da canela: é ela que firma o tornozelo em piso irregular.',
    'O calcanhar fica no lugar e o joelho aponta para o teto; quem gira é o pé.',
    'Sem ponto fixo, passe o elástico pelo outro pé, que fica parado servindo de âncora.',
  ],
  mistakes: [
    'Rodar a perna inteira para fora a partir do quadril',
    'Arrastar o calcanhar para o lado em vez de girar o tornozelo',
    'Voltar rápido, deixando o elástico trazer o pé',
  ],
  breath: 'Solte o ar ao girar o pé para fora e puxe o ar na volta lenta.',
  easier: 'Faça sem elástico, só o giro completo do pé, ou use um elástico mais leve.',
  harder: 'Dê uma volta a mais do elástico no pé para aumentar a tensão, ou segure 3 segundos no fim.',
  yt: 'eversão de tornozelo com elástico fibulares exercício',
};

export default ex;
