import type { Exercise } from '../../types.ts';

/**
 * Preparação da ficha B · Inferiores: 15 repetições de cada lado, "frente e atrás", com pausa de 2 s à frente.
 * À frente alonga a frente do quadril da perna de trás; atrás, a parte de trás da coxa da perna da frente.
 */
const ex: Exercise = {
  id: 'anterior-quadril-flexao-tronco',
  name: 'Mobilidade anterior de quadril',
  aka: ['Anterior Quadril com Flexão de Tronco', 'Flexor do quadril meio-ajoelhado, frente e atrás'],
  kind: 'alongamento',
  group: 'quadril',
  muscles: {
    primary: ['flexores do quadril'],
    secondary: ['posteriores de coxa', 'quadríceps'],
  },
  equipment: ['colchonete'],
  sided: true,
  how: [
    'Ajoelhe no colchonete com um joelho no chão e o outro pé à frente, joelho da frente a 90°.',
    'De tronco ereto, aperte o glúteo da perna de trás, empurre o quadril à frente e segure 2 s.',
    'Leve o quadril para trás, estendendo um pouco a perna da frente, e incline o tronco sobre ela.',
    'Volte à frente e repita sem pressa; no fim das repetições, troque a perna da frente.',
  ],
  cues: [
    'À frente, sinta a frente do quadril da perna de trás; atrás, a coxa da perna da frente.',
    'Glúteo de trás contraído e costelas para baixo: a lombar não arqueia.',
    'Ao inclinar, dobre no quadril, com as costas retas e o peito indo em direção ao joelho.',
  ],
  mistakes: [
    'Arquear a lombar em vez de empurrar o quadril à frente',
    'Curvar as costas ao inclinar sobre a perna da frente',
    'Fazer com pressa, sem a pausa de 2 s com o quadril à frente',
  ],
  breath: 'Solte o ar ao chegar em cada posição e puxe o ar na passagem entre elas, em ritmo lento.',
  easier: 'Apoie as mãos em um banco ao lado e ponha uma toalha dobrada sob o joelho.',
  harder: 'Com o quadril à frente, levante acima da cabeça o braço do lado do joelho apoiado.',
  yt: 'mobilidade de quadril meio ajoelhado flexor do quadril e posterior de coxa',
};

export default ex;
