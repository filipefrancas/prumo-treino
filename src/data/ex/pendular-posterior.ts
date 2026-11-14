import type { Exercise } from '../../types.ts';

/** Educativo de corrida: pernas estendidas subindo para trás, para treinar a extensão do quadril. */
const ex: Exercise = {
  id: 'pendular-posterior',
  name: 'Pendular posterior',
  aka: ['Pendular para trás', 'Tesoura para trás'],
  kind: 'educativo',
  group: 'gluteos',
  muscles: {
    primary: ['glúteo máximo'],
    secondary: ['posteriores de coxa', 'eretores da espinha', 'panturrilha'],
  },
  equipment: ['peso do corpo'],
  how: [
    'Fique em pé e incline o tronco reto à frente, a partir do quadril, com as pernas estendidas.',
    'Lance uma perna reta para trás, apertando o glúteo, enquanto a outra apoia na ponta do pé.',
    'Suba a perna só até onde o glúteo leva, sem arquear a lombar nem dobrar o joelho.',
    'Troque no ar: a perna de trás volta para baixo do corpo e a outra sobe reta.',
  ],
  cues: [
    'Objetivo: extensão do quadril; quem leva a perna para trás é o glúteo.',
    'Tronco inclinado em bloco e abdômen firme; a lombar não entra no movimento.',
    'Olhe para o chão, uns 3 m à frente, com o pescoço alinhado com as costas.',
  ],
  mistakes: [
    'Arquear a lombar para a perna subir mais',
    'Dobrar o joelho e fazer anfersen em vez de levar a perna reta',
    'Levantar o tronco a cada passo, perdendo a inclinação',
  ],
  breath: 'Respire solto e contínuo; o abdômen fica firme, mas o ar não prende.',
  easier: 'Faça em marcha, com as mãos em uma parede, levando uma perna reta para trás de cada vez.',
  harder: 'Avance uns 20 m acelerando a troca de pernas, sem levantar o tronco.',
  yt: 'pendular posterior educativo de corrida execução',
};

export default ex;
