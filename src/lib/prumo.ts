/**
 * Formato de backup do Prumo (o painel pessoal): `{ app: "prumo", versao: 2, exportadoEm, settings, data }`, em que
 * `data` tem as coleções `weights`, `runs` e `lifts` com os mesmos documentos deste app. Funções puras: quem grava
 * o estado é quem chama.
 */
import type { AppState, ISODate, Lift, Pr, RunLog, RunTipo, SerieFeita, WeightLog } from '../types.ts';

const RE_ISO = /^\d{4}-\d{2}-\d{2}$/;
const RUN_TIPOS: readonly RunTipo[] = ['Rodagem', 'Longão', 'Intervalado', 'Tempo run', 'Regenerativo', 'Prova'];

type Obj = Record<string, unknown>;
const ehObj = (v: unknown): v is Obj => typeof v === 'object' && v !== null && !Array.isArray(v);
const ehIso = (v: unknown): v is ISODate => typeof v === 'string' && RE_ISO.test(v);
/** Número de documento do Prumo (aceita texto com vírgula: "82,5"); vazio ou inválido → undefined. */
function num(v: unknown): number | undefined {
  if (typeof v === 'number') return Number.isFinite(v) ? v : undefined;
  if (typeof v !== 'string' || !v.trim()) return undefined;
  const n = Number(v.trim().replace(',', '.'));
  return Number.isFinite(n) ? n : undefined;
}
const texto = (v: unknown): string | undefined => (typeof v === 'string' && v.trim() ? v : undefined);
const idDe = (v: unknown): string | undefined => (typeof v === 'string' && v ? v : typeof v === 'number' && Number.isFinite(v) ? String(v) : undefined);

/** Esforço do Prumo (1 a 5) a partir da PSE do treinador (1 a 10). */
function rpeDe(r: RunLog): number | undefined {
  if (r.rpe != null && Number.isFinite(r.rpe)) return r.rpe;
  if (r.pse == null || !Number.isFinite(r.pse)) return undefined;
  return Math.min(5, Math.max(1, Math.round(r.pse / 2)));
}

/* ------------------------------------------------------------------ */
/* Exportar                                                            */
/* ------------------------------------------------------------------ */

function runParaPrumo(r: RunLog): Obj {
  const out: Obj = { id: r.id, data: r.data, tipo: r.tipo, km: r.km };
  if (r.min != null) out.min = r.min;
  if (r.fc != null) out.fc = r.fc;
  if (r.elev != null) out.elev = r.elev;
  if (r.cad != null) out.cad = r.cad;
  const rpe = rpeDe(r);
  if (rpe != null) out.rpe = rpe;
  if (r.obs) out.obs = r.obs;
  // o Prumo só conhece "manual" e "garmin"
  out.fonte = r.fonte === 'garmin' ? 'garmin' : 'manual';
  return out;
}

/** Campos de `lifts` que o Prumo conhece, na ordem em que ele grava (os extras deste app, `inicioMs` e `trocas`, ficam fora). */
const CAMPOS_LIFT = [
  'id', 'data', 'ficha', 'treino', 'programa', 'inicio', 'fim', 'emAndamento', 'concluido', 'sets', 'pulados', 'obsEx',
  'min', 'volume', 'prs', 'intensidade', 'cardio', 'hora', 'obs',
] as const satisfies readonly (keyof Lift)[];

function liftParaPrumo(l: Lift): Obj {
  const out: Obj = {};
  for (const k of CAMPOS_LIFT) if (l[k] !== undefined) out[k] = l[k];
  return out;
}

function pesoParaPrumo(w: WeightLog): Obj {
  const out: Obj = { id: w.id, data: w.data, kg: w.kg };
  if (w.obs) out.obs = w.obs;
  return out;
}

/**
 * Backup no formato do Prumo, para colar em Prumo › Ajustes › Seus dados › Restaurar: todos os pesos, as corridas
 * que têm km e os treinos de musculação feitos (em andamento e descartados ficam fora). `settings` vai vazio: os
 * ajustes dos dois apps são diferentes. Em `runs`, `rpe` (1 a 5) sai de `pse` (1 a 10) quando não existe.
 */
export function toPrumoBackup(state: AppState, agora: Date = new Date()): string {
  const backup = {
    app: 'prumo',
    versao: 2,
    exportadoEm: agora.toISOString(),
    settings: {},
    data: {
      weights: state.weights.map(pesoParaPrumo),
      runs: state.runs.filter((r) => r.km != null && Number.isFinite(r.km) && r.km > 0).map(runParaPrumo),
      lifts: state.lifts.filter((l) => l.emAndamento !== true && l.concluido !== false).map(liftParaPrumo),
    },
  };
  return JSON.stringify(backup, null, 2);
}

/* ------------------------------------------------------------------ */
/* Importar                                                            */
/* ------------------------------------------------------------------ */

function pesoDoPrumo(d: Obj): WeightLog | undefined {
  const id = idDe(d.id), kg = num(d.kg);
  if (!id || !ehIso(d.data) || kg == null || kg <= 0) return undefined;
  const out: WeightLog = { id, data: d.data, kg };
  const obs = texto(d.obs);
  if (obs) out.obs = obs;
  return out;
}

function runDoPrumo(d: Obj): RunLog | undefined {
  const id = idDe(d.id), km = num(d.km);
  if (!id || !ehIso(d.data) || km == null || km <= 0) return undefined;
  const tipo = RUN_TIPOS.find((t) => t === d.tipo) ?? 'Rodagem';
  const out: RunLog = { id, data: d.data, tipo, km, fonte: d.fonte === 'garmin' ? 'garmin' : 'manual' };
  const min = num(d.min), fc = num(d.fc), elev = num(d.elev), cad = num(d.cad), rpe = num(d.rpe);
  if (min != null && min >= 0) out.min = min;
  if (fc != null && fc > 0) out.fc = fc;
  if (elev != null) out.elev = elev;
  if (cad != null && cad > 0) out.cad = cad;
  if (rpe != null) out.rpe = rpe;
  const obs = texto(d.obs);
  if (obs) out.obs = obs;
  return out;
}

function setsDoPrumo(v: unknown): Lift['sets'] | undefined {
  if (!ehObj(v)) return undefined;
  const out: NonNullable<Lift['sets']> = {};
  for (const [exId, m] of Object.entries(v)) {
    if (!ehObj(m)) continue;
    const series: Record<string, SerieFeita> = {};
    for (const [n, s] of Object.entries(m)) {
      if (!ehObj(s)) continue;
      const reps = num(s.reps), carga = num(s.carga), t = texto(s.t);
      // mesma ordem de campos do Prumo: reps, carga, feito, t
      const serie: SerieFeita = { ...(reps != null ? { reps } : {}), ...(carga != null ? { carga } : {}), feito: s.feito === true };
      if (t) serie.t = t;
      series[n] = serie;
    }
    out[exId] = series;
  }
  return out;
}

function prsDoPrumo(v: unknown): Pr[] | undefined {
  if (!Array.isArray(v)) return undefined;
  const out: Pr[] = [];
  for (const p of v) {
    if (!ehObj(p)) continue;
    const exId = idDe(p.exId);
    if (!exId) continue;
    out.push({
      exId, nome: texto(p.nome) ?? exId, e1rm: num(p.e1rm) ?? 0, carga: num(p.carga) ?? 0, reps: num(p.reps) ?? 0,
      anterior: num(p.anterior) ?? 0, medida: p.medida === 'reps' ? 'reps' : 'e1rm',
    });
  }
  return out;
}

function liftDoPrumo(d: Obj): Lift | undefined {
  const id = idDe(d.id);
  if (!id || !ehIso(d.data)) return undefined;
  const out: Lift = { id, data: d.data, ficha: texto(d.ficha) ?? '', treino: texto(d.treino) ?? '', programa: texto(d.programa) ?? 'hibrido' };
  const inicio = texto(d.inicio), fim = texto(d.fim), hora = texto(d.hora), obs = texto(d.obs);
  if (inicio) out.inicio = inicio;
  if (fim) out.fim = fim;
  if (typeof d.emAndamento === 'boolean') out.emAndamento = d.emAndamento;
  if (typeof d.concluido === 'boolean') out.concluido = d.concluido;
  const sets = setsDoPrumo(d.sets);
  if (sets) out.sets = sets;
  if (Array.isArray(d.pulados)) out.pulados = d.pulados.filter((x): x is string => typeof x === 'string');
  if (ehObj(d.obsEx)) {
    const obsEx: Record<string, string> = {};
    for (const [k, v] of Object.entries(d.obsEx)) if (typeof v === 'string') obsEx[k] = v;
    out.obsEx = obsEx;
  }
  const min = num(d.min), volume = num(d.volume), intensidade = num(d.intensidade), cardio = num(d.cardio);
  if (min != null && min >= 0) out.min = min;
  if (volume != null) out.volume = volume;
  const prs = prsDoPrumo(d.prs);
  if (prs) out.prs = prs;
  if (intensidade != null && intensidade > 0) out.intensidade = intensidade;
  if (cardio != null) out.cardio = cardio;
  if (hora) out.hora = hora;
  if (obs) out.obs = obs;
  return out;
}

/** Junta os documentos válidos de uma coleção do backup aos existentes, ignorando ids repetidos. */
function juntar<T extends { id: string }>(atuais: T[], colecao: unknown, ler: (d: Obj) => T | undefined): { lista: T[]; novos: number } {
  const ids = new Set(atuais.map((x) => x.id)), lista = [...atuais];
  let novos = 0;
  for (const d of Array.isArray(colecao) ? colecao : []) {
    if (!ehObj(d)) continue;
    const doc = ler(d);
    if (!doc || ids.has(doc.id)) continue;
    ids.add(doc.id);
    lista.push(doc);
    novos++;
  }
  return { lista, novos };
}

const falha = (error: string): { ok: boolean; added: number; error: string } => ({ ok: false, added: 0, error });

/**
 * Importa `weights`, `runs` e `lifts` de um backup do Prumo. Registros novos entram; ids que já existem (ou
 * repetidos dentro do arquivo) são ignorados, assim como documentos sem id, sem data válida, peso sem kg e corrida
 * sem km. Devolve o novo estado (o argumento não é alterado) e quantos registros entraram.
 */
export function fromPrumoBackup(json: string, state: AppState): { ok: boolean; state?: AppState; added: number; error?: string } {
  if (!json.trim()) return falha('Cole aqui o backup do Prumo: o texto está vazio.');
  let bruto: unknown;
  try {
    bruto = JSON.parse(json);
  } catch {
    return falha('Não deu para ler o backup: o texto não é um JSON válido. Copie o backup inteiro no Prumo e cole de novo.');
  }
  if (!ehObj(bruto)) return falha('Este arquivo não é um backup do Prumo.');
  if (bruto.app === 'prumo-treino') return falha('Este é um backup do Prumo Treino, não do Prumo. Use "Restaurar backup".');
  if (bruto.app !== 'prumo') return falha('Este arquivo não é um backup do Prumo.');
  if (!ehObj(bruto.data)) return falha('O backup do Prumo veio sem os dados (campo "data").');
  const data = bruto.data;
  for (const k of ['weights', 'runs', 'lifts']) {
    if (data[k] != null && !Array.isArray(data[k])) return falha(`O backup do Prumo está com a coleção "${k}" em formato inesperado.`);
  }
  const w = juntar(state.weights, data.weights, pesoDoPrumo);
  const r = juntar(state.runs, data.runs, runDoPrumo);
  const l = juntar(state.lifts, data.lifts, liftDoPrumo);
  return { ok: true, state: { ...state, weights: w.lista, runs: r.lista, lifts: l.lista }, added: w.novos + r.novos + l.novos };
}
