import type { Exercise } from '../../types.ts';

const ex: Exercise = {
  id: 'sentado-nos-calcanhares',
  name: 'Sentado nos calcanhares',
  aka: ['Alongamento de quadríceps ajoelhado', 'Postura do diamante'],
  kind: 'alongamento',
  group: 'pernas',
  muscles: {
    primary: ['quadríceps', 'tibial anterior'],
    secondary: ['flexores do quadril', 'musculatura do pé'],
  },
  equipment: ['colchonete'],
  how: [
    'Ajoelhe no colchonete com os joelhos juntos e o peito dos pés apoiado no chão.',
    'Sente devagar sobre os calcanhares, com o tronco ereto e as mãos nas coxas.',
    'Apoie as mãos no chão atrás do corpo, uma de cada vez.',
    'Incline o tronco para trás aos poucos, sem tirar o quadril dos calcanhares nem os joelhos do chão.',
    'Segure respirando devagar; volte o tronco à vertical antes de sair da posição.',
  ],
  cues: [
    'Sinta alongar a frente das coxas e o peito dos pés.',
    'Encaixe a bacia e aperte de leve os glúteos: o tronco inclina sem a lombar arquear.',
    'Se o joelho reclamar, volte ao tronco ereto: ali o alongamento já acontece.',
  ],
  mistakes: [
    'Arquear a lombar e abrir as costelas ao inclinar para trás',
    'Deixar os joelhos abrirem ou saírem do chão',
    'Insistir na posição com dor no joelho ou no tornozelo',
  ],
  breath: 'Respire devagar pelo nariz; ao soltar o ar, deixe o peso assentar e incline um pouco mais.',
  easier: 'Fique com o tronco ereto e ponha uma toalha dobrada entre os calcanhares e o quadril.',
  harder: 'Desça até apoiar os antebraços no chão, mantendo os joelhos juntos e a bacia encaixada.',
  yt: 'alongamento quadríceps sentado sobre os calcanhares',
};

export default ex;
