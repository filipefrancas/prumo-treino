import type { RunBlock, RunFamily, RunPlan, RunStep, RunWorkout, Target } from '../types.ts';

/**
 * Plano de corrida: bloco de retorno de 6 semanas (quarta, sexta e domingo), mais os dois últimos treinos
 * deixados pelo treinador. Os mesmos treinos estão agendados no Garmin Connect, com os mesmos alvos.
 */

const fc = (min: number, max: number): Target => ({ kind: 'fc', min, max });
const pse = (min: number, max: number): Target => ({ kind: 'pse', min, max });
const livre: Target = { kind: 'livre' };

const LEVE = fc(130, 152);
const CONT = fc(140, 158);
const MOD = fc(148, 160);
const FORTE = fc(155, 168);

const aq = (sec: number, label: string, target: Target = livre): RunStep => ({ kind: 'aquecimento', sec, label, target, level: 1 });
const des = (sec: number, label: string, target: Target = livre): RunStep => ({ kind: 'desaquecimento', sec, label, target, level: 1 });
const rit = (sec: number, label: string, target: Target, level: RunStep['level']): RunStep => ({ kind: 'ritmo', sec, label, target, level });
const rec = (sec: number, label: string, target: Target = livre, level: RunStep['level'] = 1): RunStep => ({ kind: 'recuperacao', sec, label, target, level });
const rep = (times: number, ...steps: RunStep[]): RunBlock => ({ times, steps });

const AQ5 = aq(300, 'Caminhada rápida ou trote bem leve');
const DES5 = des(300, 'Caminhada para desaquecer');

const TXT = {
  regenerativo:
    'Regenerativo: correr bem leve, só para voltar a rodar. Não existe ritmo certo aqui; existe ritmo de conversa. O objetivo é terminar inteiro e com vontade de correr de novo.',
  continuo:
    'Contínuo em ritmo confortável, guiado pela frequência cardíaca. Se a FC passar do teto, diminua o passo ou caminhe um pouco até ela voltar. Aquecimento e desaquecimento podem ser caminhando.',
  longo:
    'Longo por percepção de esforço (PSE 4 a 6 de 10). Ritmo de conversa, sem olhar o pace. É o treino que acostuma o corpo a ficar mais tempo em movimento. Se precisar, caminhe 1 minuto e volte a correr.',
  fartlek:
    'Fartlek: variações de ritmo para dar estímulo sem exagero. Nos trechos fortes, vá por sensação (PSE 7 a 8), nunca tiro máximo. Recupere bem leve; pode caminhar, só não pare.',
} as const;

const TIPS_LONGO = ['Leve água se passar de 40 minutos ou se estiver calor.', 'Os primeiros 10 minutos são sempre os mais pesados: comece devagar.'];

interface Spec {
  date: string;
  title: string;
  family: RunFamily;
  purpose: string;
  description: string;
  blocks: RunBlock[];
  tips?: string[];
  source?: 'claude' | 'treinador';
}

const totalSec = (blocks: RunBlock[]): number =>
  blocks.reduce((s, b) => s + ('times' in b ? b.times * b.steps.reduce((x, y) => x + y.sec, 0) : b.sec), 0);

const w = (s: Spec): RunWorkout => ({
  id: `c-${s.date}`,
  date: s.date,
  title: s.title,
  family: s.family,
  minutes: Math.round(totalSec(s.blocks) / 60),
  purpose: s.purpose,
  description: s.description,
  blocks: s.blocks,
  tips: s.tips,
  source: s.source ?? 'claude',
  onWatch: true,
});

const longo = (date: string, min: number, extra = ''): RunWorkout =>
  w({
    date,
    title: `Longo ${min}' (PSE)`,
    family: 'longo',
    purpose: 'Acostumar o corpo ao movimento prolongado, em ritmo de conversa.',
    description: TXT.longo + extra,
    blocks: [rit(min * 60, 'Ritmo de conversa', pse(4, 6), 2)],
    tips: TIPS_LONGO,
  });

const continuo = (date: string, title: string, min: number, purpose = 'Sustentar um ritmo confortável sem parar.'): RunWorkout =>
  w({
    date,
    title,
    family: 'continuo',
    purpose,
    description: TXT.continuo,
    blocks: [AQ5, rit(min * 60, 'Contínuo', CONT, 3), DES5],
  });

const regenerativo = (date: string, extra = ''): RunWorkout =>
  w({
    date,
    title: "Regenerativo 25'",
    family: 'regenerativo',
    purpose: 'Rodar leve e recuperar.',
    description: TXT.regenerativo + extra,
    blocks: [AQ5, rit(900, 'Corrida leve', LEVE, 2), DES5],
  });

export const RUN_PLAN: RunPlan = {
  id: 'retorno-2026-11',
  name: 'Bloco de retorno',
  goal: 'Voltar a correr três vezes por semana e chegar a 50 minutos contínuos no fim de dezembro: é a base para os longos de 15 a 18 km de 2027.',
  start: '2026-11-09',
  end: '2026-12-27',
  version: 1,
  weeks: [
    {
      index: 0,
      start: '2026-11-09',
      theme: 'Fecho do ciclo com o treinador',
      note: 'Os dois últimos treinos que seu treinador deixou. Faça por sensação: o relógio ainda cobra o seu ritmo antigo, então ignore o pace e vá no esforço.',
      workouts: [
        w({
          date: '2026-11-13',
          title: "Fartlek 2M .79 25'",
          family: 'fartlek',
          purpose: 'Reativar as pernas com estímulos curtos.',
          description:
            'Treino do seu treinador. Estímulos curtos de 30 segundos e, depois, um bloco que sobe de intensidade. Como você está voltando de quase três semanas parado, faça os trechos fortes em esforço 7 de 10, sem tiro máximo.',
          blocks: [
            aq(300, 'Corrida leve'),
            rep(4, rit(30, 'Ritmo forte', pse(7, 7), 5), rec(60, 'Caminhando ou correndo leve')),
            rit(240, 'Leve', pse(4, 5), 2),
            rit(240, 'Moderado', pse(6, 6), 3),
            rit(60, 'Forte', pse(7, 8), 4),
            des(300, 'Caminhada rápida'),
          ],
          source: 'treinador',
        }),
        w({
          date: '2026-11-15',
          title: "Longo 35' (PSE)",
          family: 'longo',
          purpose: 'Acostumar o corpo ao movimento prolongado.',
          description: 'Treino do seu treinador. ' + TXT.longo,
          blocks: [rit(2100, 'Ritmo de conversa', pse(4, 6), 2)],
          tips: TIPS_LONGO,
          source: 'treinador',
        }),
      ],
    },
    {
      index: 1,
      start: '2026-11-16',
      theme: 'Voltar a rodar',
      note: 'Semana de reencontro com a corrida. Nada de provar ritmo: três treinos curtos e leves, terminando com sobra. Se a frequência cardíaca subir demais, caminhe sem culpa.',
      workouts: [
        regenerativo('2026-11-18'),
        w({
          date: '2026-11-20',
          title: "Contínuo leve 25'",
          family: 'continuo',
          purpose: 'Correr 15 minutos seguidos em ritmo leve.',
          description: TXT.continuo,
          blocks: [AQ5, rit(900, 'Contínuo leve', LEVE, 2), DES5],
        }),
        longo('2026-11-22', 30),
      ],
    },
    {
      index: 2,
      start: '2026-11-23',
      theme: 'Ganhar ritmo',
      note: 'Cinco minutos a mais em cada treino e os primeiros estímulos moderados, ainda sem nada forte. A regra continua: melhor terminar querendo mais do que terminar quebrado.',
      workouts: [
        continuo('2026-11-25', "Contínuo .80 30'", 20),
        w({
          date: '2026-11-27',
          title: "Regenerativo + Estímulos 30'",
          family: 'regenerativo',
          purpose: 'Rodar leve com pequenos estímulos moderados.',
          description:
            'Regenerativo com pequenos estímulos de ritmo moderado, que não são tiros. Corra leve e, nos estímulos de 1 minuto, suba só um pouco o ritmo. A caminhada entre eles é para a frequência cardíaca baixar.',
          blocks: [
            aq(480, 'Contínuo leve', LEVE),
            rep(5, rec(120, 'Caminhada'), rit(60, 'Moderado', pse(6, 6), 3)),
            des(420, 'Contínuo leve', LEVE),
          ],
        }),
        longo('2026-11-29', 35),
      ],
    },
    {
      index: 3,
      start: '2026-11-30',
      theme: 'Primeiro estímulo forte',
      note: 'O contínuo cresce, o longo chega a 40 minutos e na sexta entra o primeiro Fartlek do bloco. Sexta é o dia de sentir as pernas trabalhando; quarta e domingo seguem tranquilos.',
      workouts: [
        continuo('2026-12-02', "Contínuo .81 35'", 25),
        w({
          date: '2026-12-04',
          title: "Fartlek 2M 30'",
          family: 'fartlek',
          purpose: 'Variar o ritmo e dar o primeiro estímulo forte.',
          description: TXT.fartlek,
          blocks: [
            aq(300, 'Aquecimento leve'),
            rit(360, 'Leve', LEVE, 2),
            rit(240, 'Moderado', MOD, 3),
            rit(120, 'Forte', FORTE, 4),
            rep(5, rit(30, 'Ritmo forte', pse(8, 8), 5), rec(60, 'Caminhando ou correndo leve')),
            des(330, 'Caminhada para desaquecer'),
          ],
        }),
        longo('2026-12-06', 40),
      ],
    },
    {
      index: 4,
      start: '2026-12-07',
      theme: 'Semana de alívio',
      note: 'Menos volume de propósito: é na semana leve que o corpo absorve as três anteriores. Não compense correndo mais forte. Aproveite para caprichar no alongamento.',
      workouts: [
        regenerativo('2026-12-09', ' Esta é a semana de alívio do bloco.'),
        continuo('2026-12-11', "Contínuo .80 30'", 20),
        longo('2026-12-13', 35),
      ],
    },
    {
      index: 5,
      start: '2026-12-14',
      theme: 'Subir o volume',
      note: 'A semana mais completa do bloco: um contínuo em dois blocos, o primeiro intervalado e um longo com variação de ritmo. Durma bem e chegue descansado na sexta.',
      workouts: [
        w({
          date: '2026-12-16',
          title: "Contínuo 2 .83 40'",
          family: 'continuo',
          purpose: 'Dois blocos contínuos, o segundo mais firme.',
          description:
            'Contínuo em dois blocos: o primeiro confortável, o segundo um pouco mais firme. Controle pela frequência cardíaca e use os 5 minutos leves do meio para ela baixar antes de acelerar de novo.',
          blocks: [AQ5, rit(900, 'Bloco 1, confortável', CONT, 3), rec(300, 'Leve', LEVE, 2), rit(600, 'Bloco 2, firme', FORTE, 4), DES5],
        }),
        w({
          date: '2026-12-18',
          title: "Intervalado 6x 2'/1'",
          family: 'intervalado',
          purpose: 'Seis repetições fortes de 2 minutos.',
          description:
            'Intervalado: seis repetições de 2 minutos fortes (PSE 7 a 8, difícil mas controlado), com 1 minuto de recuperação caminhando ou trotando. A última repetição deve sair igual à primeira; se estiver sobrando no começo, segure.',
          blocks: [
            aq(600, 'Aquecimento leve', LEVE),
            rep(6, rit(120, 'Ritmo forte', pse(7, 8), 5), rec(60, 'Caminhando ou correndo leve')),
            des(420, 'Desaquecimento leve'),
          ],
        }),
        w({
          date: '2026-12-20',
          title: "Longo Variável 45'",
          family: 'longo',
          purpose: 'Longo leve com dois blocos moderados no meio.',
          description:
            'Longo com variação de ritmo: dois blocos moderados de 5 minutos dentro de um longo leve. Ensina a mudar de marcha e a voltar para o leve sem parar.',
          blocks: [aq(600, 'Aquecimento leve', LEVE), rep(2, rit(300, 'Moderado', MOD, 3), rec(600, 'Leve', LEVE, 2)), des(300, 'Desaquecimento')],
          tips: TIPS_LONGO,
        }),
      ],
    },
    {
      index: 6,
      start: '2026-12-21',
      theme: 'Fechar o bloco',
      note: 'Última semana: 30 minutos contínuos na quarta, um Fartlek na sexta (é Natal: se precisar, troque de dia) e o longo de 50 minutos no domingo, que é a meta do bloco.',
      workouts: [
        continuo('2026-12-23', "Contínuo .83 40'", 30, 'Trinta minutos contínuos em ritmo confortável.'),
        w({
          date: '2026-12-25',
          title: "Fartlek 2L 35'",
          family: 'fartlek',
          purpose: 'Estímulos fortes mais longos, de 2 minutos.',
          description: TXT.fartlek + ' Dia 25 é Natal: se o dia apertar, faça no sábado e deixe o longo para o domingo normalmente.',
          blocks: [
            aq(300, 'Aquecimento leve'),
            rit(240, 'Leve', LEVE, 2),
            rit(180, 'Moderado', MOD, 3),
            rit(180, 'Forte', FORTE, 4),
            rep(3, rec(180, 'Leve', LEVE, 2), rit(120, 'Ritmo forte', pse(7, 8), 5)),
            des(300, 'Desaquecimento'),
          ],
        }),
        longo('2026-12-27', 50, ' Este é o treino que fecha o bloco de retorno.'),
      ],
    },
  ],
};

export const ALL_RUNS: RunWorkout[] = RUN_PLAN.weeks.flatMap((wk) => wk.workouts);

export const runById = (id: string): RunWorkout | undefined => ALL_RUNS.find((r) => r.id === id);
export const runOn = (date: string): RunWorkout | undefined => ALL_RUNS.find((r) => r.date === date);

/** Achata os blocos (expandindo as repetições) na ordem em que serão executados. */
export function flattenBlocks(blocks: RunBlock[]): RunStep[] {
  return blocks.flatMap((b) => ('times' in b ? Array.from({ length: b.times }, () => b.steps).flat() : [b]));
}

export const blocksSeconds = totalSec;
