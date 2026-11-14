/**
 * Corrida: plano (treino do dia, situação, linha do tempo dos passos), registros (salvar, apagar, marcar) e
 * números do histórico (por semana, totais, recordes). Só `salvarCorrida`, `apagarCorrida` e `marcarTreino`
 * mexem no estado salvo; o resto é função pura.
 */
import { ALL_RUNS, RUN_PLAN, flattenBlocks, runById, runOn } from '../data/runs.ts';
import type { AppState, ISODate, PlanMark, RunFamily, RunLog, RunStep, RunTipo, RunWeek, RunWorkout } from '../types.ts';
import { addDias, hoje, inicioSemana } from './dates.ts';
import { pace } from './format.ts';
import { uid, update } from './store.ts';

export type Situacao = 'feito' | 'pulado' | 'hoje' | 'perdido' | 'futuro';

/** Treino do plano de corrida marcado para a data. */
export function treinoDoDia(data: ISODate): RunWorkout | undefined {
  return runOn(data);
}

/** Semana do plano (segunda a domingo) em que a data cai. */
export function semanaDoPlano(data: ISODate): RunWeek | undefined {
  return RUN_PLAN.weeks.find((wk) => data >= wk.start && data <= addDias(wk.start, 6));
}

/** Registro de corrida ligado ao treino do plano (o mais recente, se houver mais de um). */
export function logDoTreino(state: AppState, treinoId: string): RunLog | undefined {
  let achado: RunLog | undefined;
  for (const r of state.runs) {
    if (r.treinoId === treinoId && (!achado || r.data >= achado.data)) achado = r;
  }
  return achado;
}

/**
 * Situação de um treino do plano: 'feito' se há registro ligado a ele ou marca 'feito'; 'pulado' se a marca é
 * 'pulado'; senão pela data em relação a `ref` (padrão: hoje).
 */
export function situacaoDoTreino(state: AppState, w: RunWorkout, ref: ISODate = hoje()): Situacao {
  const marca = state.marcas[w.id];
  if (marca === 'feito' || state.runs.some((r) => r.treinoId === w.id)) return 'feito';
  if (marca === 'pulado') return 'pulado';
  if (w.date === ref) return 'hoje';
  return w.date < ref ? 'perdido' : 'futuro';
}

const TIPO_POR_FAMILIA: Record<RunFamily, RunTipo> = {
  regenerativo: 'Regenerativo',
  continuo: 'Rodagem',
  longo: 'Longão',
  fartlek: 'Intervalado',
  intervalado: 'Intervalado',
  progressivo: 'Tempo run',
  regressivo: 'Tempo run',
};

/** Tipo de corrida do Prumo que corresponde à família do treino. */
export function tipoDaFamilia(f: RunFamily): RunTipo {
  return TIPO_POR_FAMILIA[f];
}

export interface Passo extends RunStep { inicio: number; fim: number; rep?: [number, number] }

/** Linha do tempo do treino: passos na ordem de execução, com início e fim acumulados em segundos. */
export function passos(w: RunWorkout): Passo[] {
  const saida: Passo[] = [];
  let t = 0;
  const por = (s: RunStep, rep?: [number, number]): void => {
    const p: Passo = { ...s, inicio: t, fim: t + s.sec };
    if (rep) p.rep = rep;
    saida.push(p);
    t += s.sec;
  };
  for (const b of w.blocks) {
    if ('times' in b) {
      for (let i = 1; i <= b.times; i++) for (const s of b.steps) por(s, [i, b.times]);
    } else por(b);
  }
  return saida;
}

const clamp = (v: number, min: number, max: number): number => Math.min(max, Math.max(min, v));

/** Esforço na escala do Prumo (1 a 5) a partir da PSE (1 a 10). */
export function rpeDaPse(pse: number): number {
  return clamp(Math.round(pse / 2), 1, 5);
}

/** Tira a marca do treino quando não sobra registro ligado a ele. */
function limparMarcaSemRegistro(draft: AppState, treinoId: string | undefined): void {
  if (treinoId && !draft.runs.some((r) => r.treinoId === treinoId)) delete draft.marcas[treinoId];
}

/**
 * Grava a corrida no estado (cria com id novo ou edita pelo id) e devolve o id. Com `treinoId`, o tipo vem da
 * família do treino e o treino fica marcado como feito; com `pse`, o `rpe` (1 a 5) é derivado dela.
 */
export function salvarCorrida(log: Omit<RunLog, 'id'> & { id?: string }): string {
  const id = log.id ?? uid();
  const registro: RunLog = { ...log, id };
  const treino = log.treinoId ? runById(log.treinoId) : undefined;
  if (treino) registro.tipo = tipoDaFamilia(treino.family);
  if (log.pse !== undefined && Number.isFinite(log.pse)) registro.rpe = rpeDaPse(log.pse);
  update((draft) => {
    const i = draft.runs.findIndex((r) => r.id === id);
    const anterior = draft.runs[i];
    if (anterior) draft.runs[i] = registro;
    else draft.runs.push(registro);
    if (anterior && anterior.treinoId !== registro.treinoId) limparMarcaSemRegistro(draft, anterior.treinoId);
    if (registro.treinoId) draft.marcas[registro.treinoId] = 'feito';
  });
  return id;
}

/** Apaga o registro e, se ele era o único do treino, a marca do treino. */
export function apagarCorrida(id: string): void {
  update((draft) => {
    const alvo = draft.runs.find((r) => r.id === id);
    if (!alvo) return;
    draft.runs = draft.runs.filter((r) => r.id !== id);
    limparMarcaSemRegistro(draft, alvo.treinoId);
  });
}

/** Marca o treino do plano como feito ou pulado; `null` limpa a marca. */
export function marcarTreino(treinoId: string, marca: PlanMark | null): void {
  update((draft) => {
    if (marca === null) delete draft.marcas[treinoId];
    else draft.marcas[treinoId] = marca;
  });
}

const r1 = (v: number): number => Math.round(v * 10) / 10;
const r2 = (v: number): number => Math.round(v * 100) / 100;

/** As segundas-feiras das N últimas semanas até a semana de `ate`, da mais antiga para a mais nova. */
export function ultimasSemanas(semanas: number, ate: ISODate = hoje()): ISODate[] {
  const n = Math.max(0, Math.trunc(semanas));
  const ultima = inicioSemana(ate);
  return Array.from({ length: n }, (_, i) => addDias(ultima, -7 * (n - 1 - i)));
}

/** Minutos, km e quantidade de corridas por semana (segunda a domingo), nas N últimas semanas, inclusive as zeradas. */
export function porSemana(runs: RunLog[], semanas: number, ate: ISODate = hoje()): { semana: ISODate; min: number; km: number; n: number }[] {
  const linhas = ultimasSemanas(semanas, ate).map((semana) => ({ semana, min: 0, km: 0, n: 0 }));
  const porInicio = new Map(linhas.map((l) => [l.semana, l]));
  for (const r of runs) {
    const l = porInicio.get(inicioSemana(r.data));
    if (!l) continue;
    l.min += r.min ?? 0;
    l.km += r.km ?? 0;
    l.n += 1;
  }
  for (const l of linhas) {
    l.min = r1(l.min);
    l.km = r2(l.km);
  }
  return linhas;
}

/** Minutos e treinos planejados em cada semana do plano de corrida. */
export function planejadoPorSemana(): { semana: ISODate; min: number; n: number }[] {
  return RUN_PLAN.weeks.map((wk) => ({
    semana: wk.start,
    min: wk.workouts.reduce((s, w) => s + w.minutes, 0),
    n: wk.workouts.length,
  }));
}

/** Corridas, km e minutos somados; com `desde`, só os registros dessa data em diante. */
export function totais(runs: RunLog[], desde?: ISODate): { n: number; km: number; min: number } {
  let n = 0, km = 0, min = 0;
  for (const r of runs) {
    if (desde !== undefined && r.data < desde) continue;
    n += 1;
    km += r.km ?? 0;
    min += r.min ?? 0;
  }
  return { n, km: r2(km), min: r1(min) };
}

function melhorNaFaixa(runs: RunLog[], minKm: number, maxKm: number): RunLog | undefined {
  let melhor: RunLog | undefined, melhorPace = Infinity;
  for (const r of runs) {
    if (r.km === undefined || r.km < minKm || r.km > maxKm) continue;
    const p = pace(r.km, r.min);
    if (p !== undefined && p < melhorPace) { melhor = r; melhorPace = p; }
  }
  return melhor;
}

/**
 * Recordes do histórico: a corrida mais longa (por km; por minutos quando nenhum registro tem km) e os melhores
 * 5 km, 10 km e 21 km (menor ritmo entre os registros de 4,9 a 5,5 km, 9,8 a 10,8 km e 20,9 a 21,7 km).
 */
export function recordes(runs: RunLog[]): { maisLonga?: RunLog; melhor5k?: RunLog; melhor10k?: RunLog; melhor21k?: RunLog } {
  const saida: { maisLonga?: RunLog; melhor5k?: RunLog; melhor10k?: RunLog; melhor21k?: RunLog } = {};
  const comKm = runs.some((r) => (r.km ?? 0) > 0);
  let maisLonga: RunLog | undefined, maior = 0;
  for (const r of runs) {
    const v = (comKm ? r.km : r.min) ?? 0;
    if (v > maior) { maisLonga = r; maior = v; }
  }
  if (maisLonga) saida.maisLonga = maisLonga;
  const m5 = melhorNaFaixa(runs, 4.9, 5.5), m10 = melhorNaFaixa(runs, 9.8, 10.8), m21 = melhorNaFaixa(runs, 20.9, 21.7);
  if (m5) saida.melhor5k = m5;
  if (m10) saida.melhor10k = m10;
  if (m21) saida.melhor21k = m21;
  return saida;
}

/**
 * Datas em que houve corrida, com quantas: cada registro conta na sua data; treino do plano marcado como feito
 * sem registro conta na data do treino.
 */
export function corridasPorData(state: AppState): Map<ISODate, number> {
  const mapa = new Map<ISODate, number>();
  const soma = (d: ISODate): void => { mapa.set(d, (mapa.get(d) ?? 0) + 1); };
  for (const r of state.runs) soma(r.data);
  const comRegistro = new Set(state.runs.map((r) => r.treinoId));
  for (const w of ALL_RUNS) {
    if (state.marcas[w.id] === 'feito' && !comRegistro.has(w.id)) soma(w.date);
  }
  return mapa;
}
