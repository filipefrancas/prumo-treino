import type { Exercise } from '../../types.ts';

const ex: Exercise = {
  id: 'quadriceps-deitado-de-lado',
  name: 'Quadríceps deitado de lado',
  aka: ['Alongamento de quadríceps deitado', 'Calcanhar no glúteo deitado'],
  kind: 'alongamento',
  group: 'pernas',
  muscles: {
    primary: ['quadríceps'],
    secondary: ['flexores do quadril'],
  },
  equipment: ['colchonete'],
  sided: true,
  how: [
    'Deite de lado, com a cabeça no braço de baixo estendido e as pernas na linha do tronco.',
    'Dobre o joelho da perna de cima e segure o peito desse pé com a mão de cima.',
    'Puxe o calcanhar em direção ao glúteo, mantendo o joelho alinhado com o quadril.',
    'Leve o quadril um pouco à frente, sem arquear a lombar, até alongar a frente da coxa.',
    'Segure respirando devagar; solte o pé com cuidado e vire para o outro lado.',
  ],
  cues: [
    'Sinta alongar a frente da coxa de cima, do joelho até a virilha.',
    'Aperte de leve o glúteo e a barriga: o quadril avança sem a lombar arquear.',
    'Joelho de cima na altura do de baixo, sem subir em direção ao teto.',
  ],
  mistakes: [
    'Arquear a lombar para o calcanhar chegar ao glúteo',
    'Deixar o joelho de cima vir para a frente do corpo',
    'Rolar o tronco para trás e perder o apoio de lado',
  ],
  breath: 'Respire devagar; ao soltar o ar, aproxime um pouco mais o calcanhar do glúteo.',
  easier: 'Passe uma toalha pelo tornozelo e puxe por ela se a mão não alcançar o pé.',
  harder: 'Dobre o joelho de baixo à frente do corpo para firmar a bacia e leve a coxa de cima mais atrás.',
  yt: 'alongamento quadríceps deitado de lado',
};

export default ex;
