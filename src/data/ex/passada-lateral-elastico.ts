import type { Exercise } from '../../types.ts';

/**
 * Ficha B · Inferiores, preparação: 20 passos para cada lado, alternando com o agachamento com halter na frente.
 * A ficha diz "elástico no pé"; a animação mostra o elástico nos tornozelos, e a versão no pé entra como variação.
 */
const ex: Exercise = {
  id: 'passada-lateral-elastico',
  name: 'Passada lateral com elástico',
  aka: ['Passada lateral com elástico no pé', 'Caminhada lateral com miniband', 'Deslocamento lateral com elástico'],
  kind: 'aquecimento',
  group: 'gluteos',
  muscles: {
    primary: ['glúteo médio'],
    secondary: ['glúteo máximo', 'tensor da fáscia lata'],
  },
  equipment: ['elástico'],
  sided: true,
  how: [
    'Passe o elástico curto em volta dos tornozelos, pés na largura do quadril e mãos na cintura.',
    'Dobre um pouco os joelhos e o quadril e mantenha essa altura até o fim.',
    'Dê um passo para o lado com um pé, esticando o elástico, sem inclinar o tronco.',
    'Traga o outro pé devagar até a largura do quadril, sem deixar o elástico afrouxar.',
    'Complete os passos para um lado e volte puxando com a outra perna.',
  ],
  cues: [
    'Sinta a lateral do quadril esquentar, dos dois lados.',
    'Pés paralelos, apontando para a frente, e quadril sempre na mesma altura.',
    'Passos curtos: o elástico fica esticado do começo ao fim.',
  ],
  mistakes: [
    'Balançar o tronco de um lado para o outro a cada passo',
    'Juntar os pés e deixar o elástico afrouxar',
    'Deixar os joelhos caírem para dentro ou arrastar o pé que vem atrás',
  ],
  breath: 'Respire normalmente, no ritmo dos passos, sem prender o ar.',
  easier: 'Suba o elástico para logo acima dos joelhos.',
  harder: 'Passe o elástico em volta do meio dos pés: os glúteos trabalham mais.',
  yt: 'passada lateral com elástico mini band glúteo médio',
};

export default ex;
