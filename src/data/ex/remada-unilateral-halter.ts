import type { Exercise } from '../../types.ts';

/** Ficha B · Peito e costas. O "serrote": remada pesada sem carregar a lombar e sem nada apoiar no peito. */
const ex: Exercise = {
  id: 'remada-unilateral-halter',
  name: 'Remada unilateral com halter (serrote)',
  aka: ['Serrote', 'Remada serrote', 'Remada unilateral', 'One-arm dumbbell row'],
  kind: 'forca',
  group: 'costas',
  muscles: {
    primary: ['grande dorsal', 'romboides'],
    secondary: ['trapézio médio', 'deltoide posterior', 'bíceps'],
  },
  equipment: ['halter', 'banco'],
  how: [
    'Apoie a mão e o joelho do mesmo lado no banco, com o outro pé firme no chão e as costas retas.',
    'Segure o halter com o braço livre estendido, ombro solto para baixo.',
    'Puxe o halter em direção à cintura, com o cotovelo rente ao corpo.',
    'Segure um instante no alto e desça devagar até estender o braço. Faça todas as repetições e troque de lado.',
  ],
  cues: [
    'Puxe com o cotovelo, não com a mão.',
    'O halter vai para a cintura, não para o peito.',
    'Tronco parado: quem sobe é o braço, o ombro não gira.',
  ],
  mistakes: [
    'Girar o tronco para ajudar a subir o halter',
    'Puxar para o peito e encolher o ombro',
    'Arredondar as costas',
  ],
  breath: 'Solte o ar ao puxar e puxe o ar ao descer.',
  easier: 'Use menos carga e segure 1 segundo no alto.',
  harder: 'Desça em 3 segundos em todas as repetições.',
  swap: ['remada-baixa', 'remada-cavalinho'],
  yt: 'remada unilateral com halter serrote execução correta',
};

export default ex;
