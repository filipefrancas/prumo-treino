/**
 * Fichas de musculação: programa "Maromba" (A · Pernas, B · Peito e costas, C · Braços e ombros), montado em
 * nov/2026 para a Planet Sports. Dias fixos: segunda = A, quinta = B, sábado = C (ver `initialState` em lib/store).
 *
 * Regras do programa:
 * - a primeira série do primeiro exercício de cada ficha é leve (bloco com a nota "aquecimento");
 * - nas demais séries sobram 1 a 2 repetições (`rir: '1-2'`);
 * - quando todas as séries batem o topo da faixa, a carga sobe (a progressão dupla de lib/academia faz isso).
 *
 * As cargas (`carga`, em kg) são um ponto de partida conservador; o app passa a seguir o que for registrado.
 * Em halteres, é o peso de CADA halter; em barra, o total com a barra.
 *
 * Os ids ("m-A-01") são permanentes: são as chaves de `Lift.sets` nos treinos gravados. São novos de propósito,
 * para não colidir com os da ficha anterior ("h-A-07"), que seguem no histórico (ver `EXERCICIOS_ANTIGOS`).
 */
import type { FichaExercicio, Programa, SerieBloco } from '../types.ts';

const RIR = '1-2';

/** Bloco de trabalho. */
const trab = (sets: number, reps: string, carga: number, intervalo: number): SerieBloco => ({ sets, reps, rir: RIR, iso: null, carga, intervalo });
/** A série leve que abre a ficha. */
const leve = (carga: number): SerieBloco => ({ sets: 1, reps: '12-15', rir: null, iso: null, carga, intervalo: 60, nota: 'aquecimento' });

const ex = (id: string, anim: string, nome: string, grupo: string, equipamento: string, series: SerieBloco[]): FichaExercicio => ({
  id, anim, nome, grupo, equipamento, tipo: 'principal', series,
});

export const PROGRAMAS: Programa[] = [
  {
    id: 'maromba',
    nome: 'Maromba',
    objetivo: 'Hipertrofia',
    fonte: 'Treino montado em nov/2026 para a Planet Sports',
    fichas: [
      {
        id: 'A',
        nome: 'Pernas',
        porque:
          'Segunda é o dia mais longe do longo de domingo e deixa dois dias até a corrida de quarta, então a perna pesada mora aqui. Começa pelo agachamento no hack, que é o exercício mais pesado e pede perna descansada. O leg press soma volume sem cansar a lombar. A extensora isola a frente da coxa. Cadeira flexora e stiff cuidam da parte de trás, que é o que mais protege quem corre de lesão. A flexora é a sentada, e não a mesa deitada, para nada apoiar no peito. A abdutora e a adutora fortalecem os dois lados do quadril, que seguram o joelho alinhado na passada. A panturrilha fecha em pé e sentado, porque cada posição pega uma parte dela e é ela que mais apanha no asfalto. Não tem falha total na perna: sobram 1 a 2 repetições, para a corrida de quarta não pagar a conta.',
        exercicios: [
          ex('m-A-01', 'agachamento-hack', 'Agachamento no hack', 'quadríceps', 'máquina', [leve(40), trab(4, '8-10', 80, 120)]),
          ex('m-A-02', 'leg-press-45', 'Leg press 45°', 'quadríceps', 'máquina', [trab(3, '10-12', 160, 90)]),
          ex('m-A-03', 'cadeira-extensora', 'Cadeira extensora', 'quadríceps', 'máquina', [trab(3, '12-15', 45, 60)]),
          ex('m-A-04', 'cadeira-flexora', 'Cadeira flexora', 'posterior', 'máquina', [trab(4, '10-12', 35, 75)]),
          ex('m-A-05', 'stiff-halteres', 'Stiff com halteres', 'posterior', 'halteres', [trab(3, '10-12', 18, 90)]),
          ex('m-A-08', 'cadeira-abdutora', 'Cadeira abdutora', 'glúteo', 'máquina', [trab(3, '12-15', 50, 60)]),
          ex('m-A-07', 'cadeira-adutora', 'Cadeira adutora', 'adutores', 'máquina', [trab(3, '12-15', 50, 60)]),
          ex('m-A-06', 'panturrilha-em-pe-maquina', 'Panturrilha em pé na máquina', 'panturrilha', 'máquina', [trab(4, '12-15', 60, 45)]),
          ex('m-A-09', 'panturrilha-sentado', 'Panturrilha sentado', 'panturrilha', 'máquina', [trab(3, '12-15', 40, 45)]),
        ],
      },
      {
        id: 'B',
        nome: 'Peito e costas',
        porque:
          'Quinta fica entre a corrida de quarta e a de sexta, então é só tronco e a perna descansa. Peito e costas ficam no mesmo dia para liberar o sábado inteiro para os braços. Os dois se revezam: enquanto o peito trabalha, as costas descansam, e o treino rende mais em menos tempo. Supino reto e puxada abrem porque são os mais pesados. Supino inclinado e remada curvada vêm em seguida, e crossover, voador, remada baixa, pullover e face pull fecham com menos carga e mais repetição. O voador e o pullover trabalham peito e costas sem gastar tríceps e bíceps, que ficam inteiros para o sábado. O face pull cuida da postura dos ombros.',
        exercicios: [
          ex('m-B-01', 'supino-reto-barra', 'Supino reto com barra', 'peito', 'barra', [leve(30), trab(4, '6-10', 60, 120)]),
          ex('m-B-02', 'puxada-frente', 'Puxada na frente com pegada aberta', 'costas', 'polia', [trab(4, '8-12', 50, 90)]),
          ex('m-B-03', 'supino-inclinado-halteres', 'Supino inclinado com halteres', 'peito', 'halteres', [trab(3, '8-12', 20, 90)]),
          ex('m-B-04', 'remada-curvada', 'Remada curvada com barra', 'costas', 'barra', [trab(4, '8-10', 40, 120)]),
          ex('m-B-05', 'crossover', 'Crossover na polia', 'peito', 'polia', [trab(3, '12-15', 15, 60)]),
          ex('m-B-08', 'voador', 'Voador (peck deck)', 'peito', 'máquina', [trab(3, '12-15', 40, 60)]),
          ex('m-B-06', 'remada-baixa', 'Remada baixa na polia', 'costas', 'polia', [trab(3, '10-12', 45, 90)]),
          ex('m-B-09', 'pullover-polia', 'Pullover na polia', 'costas', 'polia', [trab(3, '12-15', 25, 60)]),
          ex('m-B-07', 'face-pull', 'Face pull na polia', 'ombro', 'polia', [trab(3, '12-15', 15, 60)]),
        ],
      },
      {
        id: 'C',
        nome: 'Braços e ombros',
        porque:
          'Bíceps e tríceps ganham um dia inteiro, e não sobras no fim de outro treino. Sábado é véspera do longo: braço não cansa a perna, então é o dia perfeito. O ombro abre com desenvolvimento e elevação lateral, enquanto você está descansado. Depois vêm três exercícios de bíceps e três de tríceps, alternados, para um descansar enquanto o outro trabalha. Cada um pega o músculo de um jeito: a rosca direta e o tríceps testa são os pesados, a rosca no banco inclinado e o tríceps francês alongam o músculo, e a rosca martelo e a corda fecham com mais repetição. O abdominal encerra a semana.',
        exercicios: [
          ex('m-C-01', 'desenvolvimento-halteres', 'Desenvolvimento com halteres', 'ombro', 'halteres', [leve(8), trab(3, '8-12', 16, 90)]),
          ex('m-C-02', 'elevacao-lateral', 'Elevação lateral com halteres', 'ombro', 'halteres', [trab(4, '12-15', 10, 45)]),
          ex('m-C-03', 'rosca-direta-barra', 'Rosca direta com barra', 'bíceps', 'barra', [trab(4, '8-10', 25, 75)]),
          ex('m-C-04', 'triceps-testa', 'Tríceps testa com barra W', 'tríceps', 'barra W', [trab(4, '8-10', 20, 75)]),
          ex('m-C-05', 'rosca-banco-inclinado', 'Rosca no banco inclinado com halteres', 'bíceps', 'halteres', [trab(3, '10-12', 14, 60)]),
          ex('m-C-06', 'triceps-frances-polia', 'Tríceps francês na polia', 'tríceps', 'polia', [trab(3, '10-12', 20, 60)]),
          ex('m-C-07', 'rosca-martelo', 'Rosca martelo com halteres', 'bíceps', 'halteres', [trab(3, '10-12', 14, 60)]),
          ex('m-C-08', 'triceps-corda', 'Tríceps na polia com corda', 'tríceps', 'polia', [trab(3, '12-15', 25, 60)]),
          ex('m-C-09', 'abdominal-maquina', 'Abdominal na máquina', 'core', 'máquina', [trab(3, '12-15', 20, 60)]),
        ],
      },
    ],
  },
];

/** Programa pelo id; `undefined` quando não existe. */
export const programaPorId = (id: string): Programa | undefined => PROGRAMAS.find((p) => p.id === id);

/**
 * Texto próprio do método de um exercício (exId → frase). O programa atual não usa métodos de intensidade, então a
 * tabela está vazia; para um exercício com `metodo` vale o texto geral de `METODO_TXT` (lib/academia).
 */
export const METODO_TXT_EXERCICIO: Record<string, string> = {};

/* ------------------------------------------------------------------ */
/* Ficha anterior (só para o histórico)                                */
/* ------------------------------------------------------------------ */

export interface ExercicioAntigo {
  nome: string;
  /** id do catálogo (foto, animação e textos). */
  anim: string;
  /** Séries que não eram de trabalho: 'todas' (alongamento, mobilidade, aquecimento) ou as N primeiras. */
  aquecimento?: 'todas' | number;
}

/** Id do programa anterior, que os treinos antigos trazem em `Lift.programa`. */
export const PROGRAMA_ANTIGO = 'hibrido';

/**
 * Exercícios da ficha usada até nov/2026. Ela saiu do app, mas os treinos gravados com ela continuam no histórico:
 * esta tabela dá nome a esses registros e mantém a contagem de séries de trabalho que eles tinham.
 */
export const EXERCICIOS_ANTIGOS: Record<string, ExercicioAntigo> = {
  'h-A-01': { nome: 'Alongamento de peitoral no espaldar', anim: 'alongamento-peitoral-espaldar', aquecimento: 'todas' },
  'h-A-02': { nome: 'Alongamento de dorsal no espaldar', anim: 'alongamento-dorsal-espaldar', aquecimento: 'todas' },
  'h-A-03': { nome: 'Mobilidade de ombro com bastão', anim: 'mobilidade-ombro-bastao', aquecimento: 'todas' },
  'h-A-04': { nome: 'Alongamento de peitoral com fita', anim: 'alongamento-peitoral-fita', aquecimento: 'todas' },
  'h-A-05': { nome: 'Manguito externo com elástico', anim: 'manguito-externo-elastico', aquecimento: 'todas' },
  'h-A-06': { nome: 'Face pull na polia', anim: 'face-pull' },
  'h-A-07': { nome: 'Remada cavalinho (pegada neutra)', anim: 'remada-cavalinho', aquecimento: 1 },
  'h-A-08': { nome: 'Pulldown unilateral na máquina', anim: 'pulldown-unilateral' },
  'h-A-09': { nome: 'Puxada supinada', anim: 'puxada-supinada' },
  'h-A-10': { nome: 'Remada na máquina (pegada pronada)', anim: 'remada-maquina' },
  'h-A-11': { nome: 'Crucifixo inverso com halteres', anim: 'crucifixo-inverso' },
  'h-A-12': { nome: 'Rosca direta no banco inclinado', anim: 'rosca-banco-inclinado' },
  'h-A-13': { nome: 'Rosca Scott unilateral com halter', anim: 'rosca-scott-unilateral' },
  'h-B-01': { nome: 'Alongamento de panturrilha no degrau', anim: 'panturrilha-no-step', aquecimento: 'todas' },
  'h-B-02': { nome: 'Alongamento de adutor sentado', anim: 'alongamento-adutor-step', aquecimento: 'todas' },
  'h-B-03': { nome: 'Mobilidade de quadril com elástico', anim: 'mobilidade-quadril-elastico', aquecimento: 'todas' },
  'h-B-04': { nome: 'Mobilidade anterior de quadril', anim: 'anterior-quadril-flexao-tronco', aquecimento: 'todas' },
  'h-B-05': { nome: 'Passada lateral com elástico', anim: 'passada-lateral-elastico', aquecimento: 'todas' },
  'h-B-06': { nome: 'Agachamento com halter na frente', anim: 'agachamento-halter-frente' },
  'h-B-07': { nome: 'Recuo com halteres', anim: 'recuo-com-halteres' },
  'h-B-08': { nome: 'Leg press 45° (pés afastados)', anim: 'leg-press-45' },
  'h-B-09': { nome: 'Cadeira extensora unilateral', anim: 'cadeira-extensora-unilateral' },
  'h-B-10': { nome: 'Flexão nórdica', anim: 'flexao-nordica' },
  'h-B-11': { nome: 'Hiperextensão de lombar', anim: 'hiperextensao-lombar' },
  'h-B-12': { nome: 'Panturrilha no leg press horizontal', anim: 'panturrilha-leg-press' },
  'h-B-13': { nome: 'Dorsiflexão com halter', anim: 'dorsiflexao-halter' },
  'h-C-01': { nome: 'Alongamento de peitoral no espaldar', anim: 'alongamento-peitoral-espaldar', aquecimento: 'todas' },
  'h-C-02': { nome: 'Manguito externo com elástico', anim: 'manguito-externo-elastico', aquecimento: 'todas' },
  'h-C-03': { nome: 'Supino reto na máquina', anim: 'supino-reto-maquina', aquecimento: 2 },
  'h-C-04': { nome: 'Supino inclinado na máquina', anim: 'supino-inclinado-maquina' },
  'h-C-05': { nome: 'Crucifixo inclinado com halteres', anim: 'crucifixo-inclinado' },
  'h-C-06': { nome: 'Elevação lateral com halteres', anim: 'elevacao-lateral' },
  'h-C-07': { nome: 'Desenvolvimento na máquina (pegada neutra)', anim: 'desenvolvimento-maquina' },
  'h-C-08': { nome: 'Tríceps francês unilateral na polia', anim: 'triceps-frances-polia' },
  'h-C-09': { nome: 'Tríceps paralela na máquina', anim: 'triceps-paralela-maquina' },
  'h-C-10': { nome: 'Abdominal na máquina', anim: 'abdominal-maquina' },
};
