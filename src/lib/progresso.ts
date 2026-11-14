/**
 * Progresso: mapa de consistência, sequência de semanas, peso com média móvel, mobilidade por semana e o resumo
 * em texto para o treinador. Só `salvarPeso` mexe no estado salvo; o resto é função pura.
 */
import { ALL_RUNS } from '../data/runs.ts';
import type { AppState, ISODate, Lift, MobilityLog, RunLog, WeightLog } from '../types.ts';
import { duracaoDoLift, liftsFeitos, volumeDoLift } from './academia.ts';
import { corridasPorData, situacaoDoTreino, ultimasSemanas } from './corrida.ts';
import { addDias, fmtData, hoje, inicioSemana, semanaDe } from './dates.ts';
import { fmtMin, fmtPace, kg, num, pace, plural } from './format.ts';
import { agendaDoDiaEm } from './plano.ts';
import { uid, update } from './store.ts';

export interface DiaTreino { data: ISODate; corrida: boolean; musc: boolean; mob: boolean }

/** Matriz [semana][dia] das N últimas semanas até a de `ate` (padrão: hoje), cada semana de segunda a domingo. */
export function mapaDeTreinos(state: AppState, semanas: number, ate: ISODate = hoje()): DiaTreino[][] {
  const corridas = corridasPorData(state);
  const musc = new Set(liftsFeitos(state.lifts).map((l) => l.data));
  const mob = new Set(state.mob.map((m) => m.data));
  return ultimasSemanas(semanas, ate).map((seg) =>
    semanaDe(seg).map((data) => ({ data, corrida: corridas.has(data), musc: musc.has(data), mob: mob.has(data) })),
  );
}

/**
 * Semanas seguidas com pelo menos `minimo` treinos (corrida + musculação; padrão 3), terminando na semana de
 * `ate` ou, se ela ainda não atingiu o mínimo, na anterior.
 */
export function sequenciaDeSemanas(state: AppState, minimo = 3, ate: ISODate = hoje()): number {
  const min = Math.max(1, minimo);
  const porSemana = new Map<ISODate, number>();
  const soma = (data: ISODate, n: number): void => {
    const s = inicioSemana(data);
    porSemana.set(s, (porSemana.get(s) ?? 0) + n);
  };
  for (const [data, n] of corridasPorData(state)) soma(data, n);
  for (const l of liftsFeitos(state.lifts)) soma(l.data, 1);
  let semana = inicioSemana(ate);
  if ((porSemana.get(semana) ?? 0) < min) semana = addDias(semana, -7);
  let n = 0;
  while ((porSemana.get(semana) ?? 0) >= min) {
    n += 1;
    semana = addDias(semana, -7);
  }
  return n;
}

/** Pesos em ordem de data, cada um com a média móvel dos últimos 7 registros (ele incluído). */
export function pesoComMedia(weights: WeightLog[]): { data: ISODate; kg: number; media: number }[] {
  const ordenados = [...weights].sort((a, b) => (a.data < b.data ? -1 : a.data > b.data ? 1 : 0));
  return ordenados.map((w, i) => {
    const janela = ordenados.slice(Math.max(0, i - 6), i + 1);
    const media = janela.reduce((s, x) => s + x.kg, 0) / janela.length;
    return { data: w.data, kg: w.kg, media: Math.round(media * 100) / 100 };
  });
}

/** Grava o peso do dia; se já existe registro na mesma data, ele é substituído. */
export function salvarPeso(data: ISODate, valorKg: number, obs?: string): void {
  update((draft) => {
    const anterior = draft.weights.find((w) => w.data === data);
    const registro: WeightLog = { id: anterior?.id ?? uid(), data, kg: valorKg };
    const nota = obs?.trim();
    if (nota) registro.obs = nota;
    draft.weights = draft.weights.filter((w) => w.data !== data);
    draft.weights.push(registro);
    draft.weights.sort((a, b) => (a.data < b.data ? -1 : a.data > b.data ? 1 : 0));
  });
}

/** Minutos de mobilidade por semana (segunda a domingo), nas N últimas semanas, inclusive as zeradas. */
export function mobPorSemana(mob: MobilityLog[], semanas: number, ate: ISODate = hoje()): { semana: ISODate; min: number }[] {
  const seg = new Map<ISODate, number>();
  for (const m of mob) {
    const s = inicioSemana(m.data);
    seg.set(s, (seg.get(s) ?? 0) + m.seg);
  }
  return ultimasSemanas(semanas, ate).map((semana) => ({ semana, min: Math.round((seg.get(semana) ?? 0) / 60) }));
}

/* ------------------------------------------------------------------ */
/* Resumo para o treinador                                             */
/* ------------------------------------------------------------------ */

const SEP = ' · ';
const porData = <T extends { data: ISODate }>(a: T, b: T): number => (a.data < b.data ? -1 : a.data > b.data ? 1 : 0);

function linhaDaCorrida(r: RunLog): string {
  const partes: string[] = [fmtData(r.data), r.titulo?.trim() || r.tipo];
  if (r.min !== undefined) partes.push(fmtMin(r.min));
  if (r.km !== undefined) {
    partes.push(`${num(r.km, 2)} km`);
    const p = pace(r.km, r.min);
    if (p !== undefined) partes.push(fmtPace(p));
  }
  if (r.fc !== undefined) partes.push(`FC média ${num(r.fc, 0)}`);
  if (r.pse !== undefined) partes.push(`PSE ${num(r.pse)}`);
  if (r.sensacao !== undefined) partes.push(`sensação ${r.sensacao} de 5`);
  if (r.local === 'esteira') partes.push('esteira');
  const nota = r.obs?.trim();
  if (nota) partes.push(`nota: ${nota}`);
  return partes.join(SEP);
}

function linhaDoLift(l: Lift): string {
  const partes: string[] = [fmtData(l.data), l.treino ? `Ficha ${l.ficha}: ${l.treino}` : `Ficha ${l.ficha}`];
  const dur = duracaoDoLift(l);
  if (dur !== null) partes.push(fmtMin(dur));
  const volume = volumeDoLift(l);
  if (volume > 0) partes.push(`volume ${num(volume, 0)} kg`);
  if (l.intensidade !== undefined) partes.push(`intensidade ${l.intensidade} de 5`);
  const prs = l.prs ?? [];
  if (prs.length > 0) partes.push(`recordes: ${prs.map((p) => `${p.nome} (${num(p.carga, 2)} kg × ${p.reps})`).join(', ')}`);
  const nota = l.obs?.trim();
  if (nota) partes.push(`nota: ${nota}`);
  return partes.join(SEP);
}

/**
 * Texto pronto para colar na conversa com o treinador, cobrindo os últimos `dias` (padrão 14) até `ate`
 * (padrão: hoje): corridas, treinos do plano perdidos ou pulados, musculação, mobilidade, peso e aderência.
 */
export function resumoParaTreinador(state: AppState, dias = 14, ate: ISODate = hoje()): string {
  const n = Math.max(1, Math.trunc(dias));
  const inicio = addDias(ate, -(n - 1));
  const dentro = (d: ISODate): boolean => d >= inicio && d <= ate;
  const linhas: string[] = [];

  const nome = state.settings.nome.trim();
  linhas.push(`Resumo de treino${nome ? ` de ${nome}` : ''}${SEP}${fmtData(inicio)} a ${fmtData(ate)} (${plural(n, 'dia', 'dias')})`);

  const corridas = state.runs.filter((r) => dentro(r.data)).sort(porData);
  const km = corridas.reduce((s, r) => s + (r.km ?? 0), 0);
  const min = corridas.reduce((s, r) => s + (r.min ?? 0), 0);
  linhas.push('');
  if (corridas.length === 0) linhas.push('CORRIDA: nenhuma corrida registrada');
  else {
    const total = [plural(corridas.length, 'corrida', 'corridas'), fmtMin(min)];
    if (km > 0) total.push(`${num(km, 1)} km`);
    linhas.push(`CORRIDA: ${total.join(SEP)}`);
    for (const r of corridas) linhas.push(linhaDaCorrida(r));
  }
  for (const w of ALL_RUNS) {
    if (!dentro(w.date)) continue;
    const sit = situacaoDoTreino(state, w, ate);
    if (sit === 'perdido') linhas.push(`${fmtData(w.date)}${SEP}${w.title}${SEP}não fez`);
    else if (sit === 'pulado') linhas.push(`${fmtData(w.date)}${SEP}${w.title}${SEP}pulou`);
  }

  const lifts = liftsFeitos(state.lifts).filter((l) => dentro(l.data));
  linhas.push('');
  if (lifts.length === 0) linhas.push('MUSCULAÇÃO: nenhum treino registrado');
  else {
    linhas.push(`MUSCULAÇÃO: ${plural(lifts.length, 'treino', 'treinos')}`);
    for (const l of lifts) linhas.push(linhaDoLift(l));
  }

  const mob = state.mob.filter((m) => dentro(m.data)).sort(porData);
  linhas.push('');
  if (mob.length === 0) linhas.push('MOBILIDADE: nenhuma rotina registrada');
  else {
    const seg = mob.reduce((s, m) => s + m.seg, 0);
    linhas.push(`MOBILIDADE: ${plural(mob.length, 'rotina', 'rotinas')}${SEP}${fmtMin(seg / 60)}`);
    const porRotina = new Map<string, { vezes: number; seg: number }>();
    for (const m of mob) {
      const r = porRotina.get(m.nome) ?? { vezes: 0, seg: 0 };
      r.vezes += 1;
      r.seg += m.seg;
      porRotina.set(m.nome, r);
    }
    for (const [rotina, r] of porRotina) linhas.push(`${rotina}${SEP}${r.vezes}×${SEP}${fmtMin(r.seg / 60)}`);
  }

  const pesos = state.weights.filter((w) => dentro(w.data)).sort(porData);
  const primeiro = pesos[0], ultimo = pesos[pesos.length - 1];
  linhas.push('');
  if (!primeiro || !ultimo) linhas.push('PESO: sem registro no período');
  else if (pesos.length === 1) linhas.push(`PESO: ${kg(ultimo.kg)} (${fmtData(ultimo.data)})`);
  else {
    const dif = Math.round((ultimo.kg - primeiro.kg) * 100) / 100;
    const variacao = dif === 0 ? 'sem variação' : `${dif > 0 ? '+' : '−'}${kg(Math.abs(dif))}`;
    linhas.push(`PESO: ${kg(primeiro.kg)} (${fmtData(primeiro.data)}) → ${kg(ultimo.kg)} (${fmtData(ultimo.data)})${SEP}${variacao}`);
  }

  let planejados = 0, feitos = 0;
  for (let d = inicio; d <= ate; d = addDias(d, 1)) {
    for (const item of agendaDoDiaEm(state, d, ate)) {
      planejados += 1;
      if (item.feito) feitos += 1;
    }
  }
  linhas.push('');
  linhas.push(`Aderência: ${feitos} de ${plural(planejados, 'treino planejado', 'treinos planejados')}`);
  return linhas.join('\n');
}
