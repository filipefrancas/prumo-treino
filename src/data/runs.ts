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

/**
 * "Por que assim": o raciocínio de cada treino, por data. Aparece sempre na tela do treino. Liga o treino ao
 * roteiro (do retorno aos longos de 15 a 18 km) e à musculação da semana: pernas na segunda, peito e costas na
 * quinta, braços e ombros no sábado.
 */
const PORQUE: Record<string, string> = {
  '2026-11-13':
    'É o penúltimo treino que o seu treinador deixou, e ele fica porque 25 minutos com estímulos de 30 segundos acordam a perna sem somar volume. Você vem de quase três semanas parado, então o forte aqui é esforço 7 de 10, não tiro. Sexta é um bom dia para isso: sobra o sábado inteiro antes do longo de domingo.',
  '2026-11-15':
    'Domingo é o dia do longo, e este de 35 minutos é o ponto de partida do caminho até os 15 a 18 km. Vai por sensação porque, na volta, o relógio ainda cobra o seu ritmo antigo. No sábado você treina só braços e ombros, então a perna chega descansada. Na segunda vem o treino de pernas, com dois dias inteiros até a próxima corrida.',
  '2026-11-18':
    'Quarta vem dois dias depois do treino de pernas de segunda, quando a coxa ainda pode estar pesada. Por isso a primeira corrida da semana é a mais leve: 15 minutos em ritmo de conversa, só para a perna voltar a rodar. Na quinta o treino é de peito e costas, então a perna descansa de novo antes de sexta.',
  '2026-11-20':
    'Sexta fica um dia depois de peito e costas, que não cansam a perna. É o dia de correr 15 minutos seguidos sem caminhar, ainda na faixa leve de frequência cardíaca. Nesta primeira semana a ideia é juntar três corridas curtas, não fazer uma corrida boa. No sábado só os braços trabalham, e a perna se guarda para o longo.',
  '2026-11-22':
    'O longo é o treino que mais importa para chegar aos 15 a 18 km, e ele cresce de 5 em 5 minutos. Trinta minutos é menos do que você já fez, de propósito: a primeira semana do bloco é para reencontrar a corrida. Sábado é dia de braços e ombros, então a perna chega inteira. Segunda tem pernas, e a corrida seguinte é só na quarta.',
  '2026-11-25':
    'São 20 minutos contínuos, cinco a mais que na semana passada, porque o corpo aceita bem esse passo pequeno. A frequência cardíaca tem teto para o treino de pernas de segunda não virar uma corrida forçada na quarta. Se a coxa ainda estiver pesada, corra no piso da faixa. Na quinta você treina só o tronco.',
  '2026-11-27':
    'Entram os primeiros estímulos moderados, de 1 minuto, com caminhada entre eles. Servem para lembrar a perna de um ritmo mais alto sem o custo de um treino forte, que ainda é cedo. Sexta é o dia certo: a perna descansou na quinta, que foi de peito e costas, e o sábado de braços não atrapalha o longo.',
  '2026-11-29':
    'Mais cinco minutos no longo: 35 agora, rumo aos 50 do fim de dezembro. O ritmo é de conversa porque o que se treina aqui é tempo em movimento, e isso é o que os longos de 15 a 18 km vão pedir. O sábado de braços e ombros deixa a perna livre. A segunda de pernas fica longe o bastante para você recuperar.',
  '2026-12-02':
    'O contínuo sobe para 25 minutos. É a corrida que constrói o ritmo confortável que você vai levar para os longos maiores. Fica na quarta porque já passaram dois dias desde o treino de pernas, e a frequência cardíaca segura o passo se a coxa ainda reclamar. Quinta é dia de peito e costas, com a perna parada.',
  '2026-12-04':
    'É o primeiro treino com trechos fortes do bloco, depois de três semanas só de base. Ele fica na sexta porque é o dia em que a perna está mais descansada: a última carga pesada nela foi na segunda, e na quinta você treinou só o tronco. O forte é controlado, esforço 8 de 10. No sábado vêm os braços, e a perna se recupera para o longo.',
  '2026-12-06':
    'Quarenta minutos: o longo já passa de 6 km e começa a parecer com o que você gosta de correr. Depois do Fartlek de sexta ele vai bem leve e com água, para somar tempo sem somar desgaste. O sábado foi de braços, então a perna vem só com a corrida de sexta. Segunda tem pernas e depois dois dias sem correr.',
  '2026-12-09':
    'Esta é a semana de alívio: depois de três semanas subindo, o corpo precisa de uma mais leve para absorver o treino. Por isso a quarta volta aos 15 minutos leves, e não vale compensar correndo mais forte. Na segunda de pernas, tire uma série de cada exercício nesta semana. A quinta segue só com o tronco.',
  '2026-12-11':
    'Vinte minutos contínuos, os mesmos de duas semanas atrás, e isso é de propósito. Na semana de alívio você mantém o hábito das três corridas e corta o volume. Sexta vem depois de peito e costas, com a perna descansada, então ele deve sair fácil. Se sair fácil, o bloco está funcionando.',
  '2026-12-13':
    'O longo recua de 40 para 35 minutos para fechar a semana de alívio. É esse passo atrás que deixa você pronto para a semana mais puxada do bloco, que começa amanhã. Ritmo de conversa do começo ao fim. Sábado foi de braços e ombros, e a segunda de pernas volta ao normal.',
  '2026-12-16':
    'Dois blocos contínuos somam 25 minutos de corrida firme, o segundo um pouco mais forte. É o ensaio para sustentar ritmo por mais tempo, que é o que os longos de 15 km vão cobrar. Na quarta a perna já teve dois dias desde o treino de segunda. Se ela estiver pesada, faça o segundo bloco no ritmo do primeiro.',
  '2026-12-18':
    'É o primeiro intervalado: seis repetições de 2 minutos fortes. Ele só entra agora, na quinta semana, porque a base das semanas anteriores é o que protege de lesão num treino assim. Sexta é o dia com a perna mais descansada, um dia depois de peito e costas. O sábado de braços dá o intervalo antes do longo.',
  '2026-12-20':
    'Quarenta e cinco minutos com dois trechos moderados no meio. Além do tempo em movimento, você treina mudar de marcha e voltar para o leve sem parar, o que ajuda muito nos longos maiores. Vem dois dias depois do intervalado, então o resto é bem leve. Sábado foi só de braços, e segunda a perna trabalha na academia.',
  '2026-12-23':
    'Trinta minutos contínuos: o dobro do que você correu na primeira quarta do bloco. É a prova de que a base voltou. Fica na quarta, dois dias depois do treino de pernas, com a frequência cardíaca como freio. Quinta é dia de peito e costas, e a perna descansa para o Fartlek.',
  '2026-12-25':
    'Os trechos fortes agora duram 2 minutos, mais longos que os do primeiro Fartlek, porque a perna já aguenta. É o último treino forte do bloco e fica na sexta, com a perna descansada pela quinta de tronco. Se o Natal apertar, faça no sábado: o treino de braços troca de dia sem prejuízo, e o longo continua no domingo.',
  '2026-12-27':
    'Cinquenta minutos, cerca de 8 km: é a meta do bloco de retorno e a porta de entrada da próxima fase, em que o longo sobe 1 km por semana até os 12 a 13 km. Ritmo de conversa, com água. Sábado foi de braços e ombros, então a perna chega inteira. Anote como foi, porque é com esse treino que o próximo bloco é montado.',
};

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
  porque: PORQUE[s.date],
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
