import type { Exercise } from '../../types.ts';

/** Fortalecimento dos pés: frente da canela, puxando o pé contra um elástico preso à frente. */
const ex: Exercise = {
  id: 'dorsiflexao-do-pe',
  name: 'Dorsiflexão do pé com elástico',
  aka: ['Dorsiflexão de tornozelo com elástico', 'Fortalecimento do tibial anterior'],
  kind: 'pes',
  group: 'pes',
  muscles: {
    primary: ['tibial anterior'],
    secondary: ['extensores dos dedos'],
  },
  equipment: ['elástico'],
  sided: true,
  how: [
    'Sente no chão com uma perna estendida e passe o elástico pelo peito desse pé.',
    'Prenda a outra ponta em algo firme à sua frente e afaste-se até o elástico esticar.',
    'Partindo do pé em ponta, puxe o peito do pé em direção à canela, sem dobrar o joelho.',
    'Segure 1 segundo com o pé puxado o máximo que conseguir.',
    'Volte devagar, resistindo ao elástico, até o pé ficar em ponta de novo.',
  ],
  cues: [
    'Sinta a frente da canela trabalhar; ela costuma arder nas últimas repetições.',
    'Quem dobra é o tornozelo; os dedos só acompanham, sem puxar sozinhos.',
    'Se o calcanhar raspar no chão, apoie a panturrilha em uma toalha enrolada.',
  ],
  mistakes: [
    'Dobrar só os dedos para trás e mexer pouco o tornozelo',
    'Dobrar o joelho para ajudar a puxar o elástico',
    'Soltar o pé na volta e deixar o elástico esticá-lo de uma vez',
  ],
  breath: 'Solte o ar ao puxar a ponta do pé para a canela e puxe o ar ao voltar.',
  easier: 'Sente mais perto do ponto onde o elástico está preso, com ele menos esticado.',
  harder: 'Afaste-se mais para esticar o elástico e leve 3 segundos para voltar à ponta.',
  yt: 'dorsiflexão com elástico tibial anterior exercício',
};

export default ex;
