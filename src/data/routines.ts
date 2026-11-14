import type { Routine, RoutineStep } from '../types.ts';

/**
 * Rotinas de mobilidade: alongamento, aquecimento, educativos de corrida, core, pés e liberação miofascial.
 * Os ids dos exercícios estão em docs/CATALOGO.md.
 */

const lados = (ex: string, rest: Omit<RoutineStep, 'ex' | 'side'>): RoutineStep[] => [
  { ex, side: 'D', ...rest },
  { ex, side: 'E', ...rest },
];
const t = (ex: string, sec: number, note?: string): RoutineStep => ({ ex, sec, note });
const r = (ex: string, reps: number, note?: string): RoutineStep => ({ ex, reps, note });
const rodadas = (n: number, steps: RoutineStep[]): RoutineStep[] => Array.from({ length: n }, () => steps).flat();

const EDU_INICIANTE = ['dribling', 'skipping-medio', 'anfersen', 'pendular-anterior', 'hop', 'bambi-baixo'];
const EDU_INTERMEDIARIO = ['dribling', 'skipping-alto', 'pendular-posterior', 'andando-na-lua', 'pendular-anfersen', 'hop-alto', 'soldado'];

export const ROUTINES: Routine[] = [
  {
    id: 'alongamento-completo',
    name: 'Alongamento completo',
    kind: 'alongamento',
    minutes: 24,
    when: 'Em qualquer horário, de preferência em dia sem treino forte ou à noite.',
    description:
      'As 14 posições que você já fazia, na mesma ordem, do chão para cima. Entre devagar em cada posição, respire fundo e relaxe: alongamento não é para doer. A posição 6 foi trocada pelo afundo ajoelhado, que alonga a mesma região sem forçar o joelho.',
    transition: 6,
    userTimed: true,
    steps: [
      t('joelhos-ao-peito', 60),
      ...lados('joelho-ao-peito', { sec: 60 }),
      ...lados('figura-4-deitado', { sec: 60 }),
      ...lados('torcao-deitado', { sec: 60 }),
      ...lados('quadriceps-deitado-de-lado', { sec: 60 }),
      ...lados('afundo-ajoelhado', { sec: 60, note: 'Apoie o joelho em uma toalha dobrada.' }),
      ...lados('torcao-sentado', { sec: 60 }),
      t('pernas-afastadas', 60),
      ...lados('uma-perna-estendida', { sec: 60 }),
      t('borboleta', 60),
      t('pernas-juntas-a-frente', 60),
      t('sentado-nos-calcanhares', 60, 'Se o joelho incomodar, fique com o tronco ereto.'),
      t('cachorro-olhando-para-baixo', 60),
      ...lados('panturrilha-no-step', { sec: 60, note: 'Em um degrau ou no meio-fio.' }),
    ],
  },
  {
    id: 'pos-corrida',
    name: 'Alongamento pós-corrida',
    kind: 'alongamento',
    minutes: 8,
    when: 'Logo depois de correr, com o corpo ainda quente.',
    description:
      'O essencial para quem acabou de correr: panturrilha, parte de trás da coxa, frente do quadril e glúteo. Leve e sem balançar; 40 segundos por posição.',
    transition: 5,
    steps: [
      ...lados('panturrilha-no-step', { sec: 40 }),
      ...lados('uma-perna-estendida', { sec: 40 }),
      ...lados('afundo-ajoelhado', { sec: 40 }),
      ...lados('figura-4-deitado', { sec: 40 }),
      t('joelhos-ao-peito', 40),
    ],
  },
  {
    id: 'aquecimento-corrida',
    name: 'Aquecimento antes da corrida',
    kind: 'aquecimento',
    minutes: 6,
    when: 'Antes de sair para correr, principalmente de manhã cedo.',
    description:
      'Cinco minutos para acordar quadril, tornozelo e panturrilha antes do primeiro passo. Movimentos soltos, sem forçar amplitude. Depois dele, comece o treino pela caminhada rápida ou pelo trote leve.',
    transition: 4,
    steps: [
      ...lados('balanco-de-perna-frontal', { reps: 12 }),
      ...lados('balanco-de-perna-lateral', { reps: 12 }),
      ...lados('rotacao-de-quadril', { reps: 8 }),
      r('agachamento-peso-do-corpo', 12),
      r('elevacao-de-panturrilha', 15),
      t('polichinelo', 30),
    ],
  },
  {
    id: 'educativos-iniciante',
    name: 'Educativos de corrida · iniciante',
    kind: 'educativos',
    minutes: 6,
    when: 'Antes do aquecimento do treino de corrida.',
    description:
      'Os seis educativos do nível iniciante, parados no lugar: 20 segundos de cada, 10 segundos de pausa, três rodadas. Se tiver espaço, faça avançando cerca de 20 metros e volte trotando, tentando levar para a corrida o que acabou de treinar.',
    transition: 10,
    steps: rodadas(3, EDU_INICIANTE.map((ex) => t(ex, 20))),
  },
  {
    id: 'educativos-intermediario',
    name: 'Educativos de corrida · intermediário',
    kind: 'educativos',
    minutes: 8,
    when: 'Antes do aquecimento do treino de corrida.',
    description:
      'Os educativos do nível intermediário, o mesmo que seu treinador vinha pedindo antes dos treinos: 20 segundos de cada, 10 segundos de pausa, três rodadas. O pendular com anfersen é feito para um lado e depois para o outro.',
    transition: 10,
    steps: rodadas(
      3,
      EDU_INTERMEDIARIO.flatMap((ex) => (ex === 'pendular-anfersen' ? lados(ex, { sec: 20 }) : [t(ex, 20)])),
    ),
  },
  {
    id: 'core-do-corredor',
    name: 'Core do corredor',
    kind: 'core',
    minutes: 9,
    when: 'Duas vezes por semana, depois da corrida leve ou em casa.',
    description:
      'Abdômen, lombar e glúteos firmes seguram a postura quando a perna cansa, e isso poupa joelho e lombar nos longos. Movimentos lentos e controlados; qualidade vale mais que quantidade.',
    transition: 8,
    steps: [
      t('prancha', 40),
      ...lados('prancha-lateral', { sec: 25 }),
      r('ponte-de-gluteo', 15),
      ...lados('perdigueiro', { reps: 10 }),
      r('inseto-morto', 16, 'Oito de cada lado, alternando.'),
      t('prancha', 40),
      r('ponte-de-gluteo', 15),
    ],
  },
  {
    id: 'fortalecimento-dos-pes',
    name: 'Fortalecimento dos pés',
    kind: 'pes',
    minutes: 10,
    when: 'Depois do treino de força ou em um horário livre do dia. Descalço.',
    description:
      'Pés fortes são sinônimo de saúde na corrida e no dia a dia. Você precisa de uma toalha e de um elástico. Faça devagar, sentindo o pé trabalhar; se der cãibra, solte e recomece.',
    transition: 6,
    steps: [
      ...lados('puxar-toalha', { reps: 20 }),
      ...lados('inversao-do-pe', { reps: 15 }),
      ...lados('eversao-do-pe', { reps: 15 }),
      ...lados('dorsiflexao-do-pe', { reps: 20 }),
      ...lados('flexao-plantar', { reps: 20 }),
    ],
  },
  {
    id: 'liberacao-miofascial',
    name: 'Liberação miofascial',
    kind: 'liberacao',
    minutes: 12,
    when: 'Depois do treino ou à noite. Evite logo antes de um treino forte.',
    description:
      'Com o rolo, passe devagar por cada região, oito idas e voltas. Onde estiver mais dolorido, pare alguns segundos e respire. Desconforto é esperado; dor aguda não: nesse caso, alivie o peso com as mãos ou com o outro pé.',
    transition: 6,
    steps: [
      ...lados('rolo-panturrilha', { reps: 8 }),
      ...lados('rolo-posterior', { reps: 8 }),
      ...lados('rolo-gluteo', { reps: 8 }),
      ...lados('rolo-gluteo-medio', { reps: 8 }),
      ...lados('rolo-adutores', { reps: 8 }),
      r('rolo-quadriceps', 8),
      ...lados('rolo-lateral-coxa', { reps: 8 }),
      r('rolo-lombar', 8),
      r('rolo-toracica', 8),
    ],
  },
];

export const routineById = (id: string): Routine | undefined => ROUTINES.find((x) => x.id === id);

/** Duração estimada de uma rotina, em segundos: passos por tempo + ~3 s por repetição + transições. */
export function routineSeconds(routine: Routine, stretchSec?: number): number {
  const stepSec = (s: RoutineStep): number => {
    if (s.sec !== undefined) return routine.userTimed && stretchSec ? stretchSec : s.sec;
    return (s.reps ?? 10) * 3;
  };
  return routine.steps.reduce((sum, s) => sum + stepSec(s) + routine.transition, 0);
}
