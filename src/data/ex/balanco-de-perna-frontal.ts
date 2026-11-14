import type { Exercise } from '../../types.ts';

/** Aquecimento antes da corrida: a perna balança solta, como um pêndulo, para a frente e para trás. */
const ex: Exercise = {
  id: 'balanco-de-perna-frontal',
  name: 'Balanço de perna para a frente e para trás',
  aka: ['Balanço frontal de perna', 'Pêndulo de perna', 'Leg swing'],
  kind: 'aquecimento',
  group: 'quadril',
  muscles: {
    primary: ['flexores do quadril', 'posteriores de coxa'],
    secondary: ['glúteo máximo', 'glúteo médio', 'reto abdominal'],
  },
  equipment: ['peso do corpo', 'parede ou barra'],
  sided: true,
  how: [
    'Fique em pé sobre uma perna, com a mão desse lado apoiada em uma barra ou parede à frente.',
    'Balance a outra perna (a do lado da vez) solta para a frente, quase reta, até uns 60°.',
    'Deixe a perna voltar e passar para trás, até uns 30°, sem o tronco acompanhar.',
    'Siga no vaivém, como um pêndulo, ganhando amplitude aos poucos.',
  ],
  cues: [
    'Perna solta e pesada: quem manda é o balanço, não a força do chute.',
    'Sinta a frente do quadril abrir quando a perna passa para trás.',
    'Tronco alto e parado, abdômen firme; a perna de apoio fica quase reta.',
  ],
  mistakes: [
    'Balançar o tronco para a frente e para trás junto com a perna',
    'Chutar forte logo nas primeiras repetições, antes de ganhar amplitude',
    'Arquear a lombar para a perna ir mais atrás',
  ],
  breath: 'Solte o ar quando a perna vai à frente e puxe quando ela volta para trás.',
  easier: 'Reduza a amplitude e dobre um pouco o joelho da perna que balança.',
  harder: 'Faça sem apoio da mão, equilibrando só na perna de apoio.',
  yt: 'balanço de perna frontal aquecimento dinâmico para corrida execução',
};

export default ex;
