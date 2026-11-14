/**
 * Regras de musculação, portadas do Prumo (25-academia.js, 12-fichas.js, 20-metrics.js e o modelo da sessão guiada).
 * Tudo aqui é função pura sobre os registros `Lift` e as fichas: nada de DOM, de store ou de rede.
 *
 * Convenções (iguais às do Prumo):
 * - A série n (a partir de 1, chave de `Lift.sets[exId]`) pertence ao bloco de `ex.series` pela soma cumulativa de
 *   `sets` (Agachamento no hack: série 1 → aquecimento, 2 a 5 → trabalho); além do total, vale o último bloco.
 * - "Série" na interface é a série de TRABALHO: ficam fora os exercícios de alongamento, mobilidade e aquecimento e
 *   as séries que caem num bloco marcado como aquecimento dentro de um exercício principal.
 * - Um treino só conta como feito quando `emAndamento !== true` e `concluido !== false`.
 * - Diferença em relação ao Prumo: `settings.plano` aqui usa 0 = domingo (o Prumo usa 0 = segunda).
 */
import { EXERCICIOS_ANTIGOS, METODO_TXT_EXERCICIO, PROGRAMAS, programaPorId } from '../data/fichas.ts';
import type {
  Ficha, FichaAjuste, FichaExercicio, ISODate, Lift, Metodo, Pr, Programa, SerieBloco, SerieFeita, Settings,
} from '../types.ts';

/* ------------------------------------------------------------------ */
/* Métodos                                                             */
/* ------------------------------------------------------------------ */

/** Rótulo curto do método (pill). */
export const METODO_ROTULO: Record<Metodo, string> = {
  'rest-pause': 'Rest-pause',
  'cluster-set': 'Cluster-set',
  'super-set': 'Super-set',
  'bi-set': 'Bi-set',
  'dead-stop': 'Dead stop',
  'drop-set': 'Drop-set',
};

/**
 * Como executar cada método, em uma frase. Rest-pause, super-set e bi-set são os textos do Prumo; cluster-set,
 * dead stop e drop-set não têm texto geral no Prumo (só por exercício) e foram resumidos a partir deles.
 */
export const METODO_TXT: Record<Metodo, string> = {
  'rest-pause': 'Rest-pause: faça as repetições, pause 10-30 s sem largar o aparelho e volte até a falha (Rest + Max).',
  'cluster-set': 'Cluster-set: divida a série em blocos curtos de repetições, com uma pausa breve entre eles, usando carga alta.',
  'super-set': 'Super-set: uma série deste e, sem descanso, uma do exercício combinado; descanse só depois do par.',
  'bi-set': 'Bi-set: uma série deste e, sem descanso, uma do exercício combinado; descanse só depois do par.',
  'dead-stop': 'Dead stop: faça as primeiras repetições parando a carga por completo no limitador e emende as demais sem encostar.',
  'drop-set': 'Drop-set: faça as repetições, baixe a carga e continue sem descanso, na sequência da ficha; tudo isso é uma série.',
};

/** Texto do método de um exercício: o específico dele (catálogo do Prumo) ou o geral; `undefined` sem método. */
export function metodoTexto(ex: FichaExercicio): string | undefined {
  if (!ex.metodo) return undefined;
  return METODO_TXT_EXERCICIO[ex.id] ?? METODO_TXT[ex.metodo];
}

/* ------------------------------------------------------------------ */
/* Auxiliares internos                                                 */
/* ------------------------------------------------------------------ */

const DESCANSO_FALLBACK = 90;
const TIPOS_AQ: readonly string[] = ['alongamento', 'mobilidade', 'aquecimento'];
const RE_ISO = /^\d{4}-\d{2}-\d{2}$/;
const RE_TEMPO = /\d\s*(s|seg|segundos?|min)\b/i;
const RE_NUMS = /\d+(?:[.,]\d+)?/g;

const soma = (v: number[]): number => v.reduce((a, b) => a + b, 0);
const r05 = (x: number): number => Math.round(x * 2) / 2;
const r1 = (x: number): number => Math.round(x * 10) / 10;
const maximo = (v: number[]): number => (v.length ? Math.max(...v) : 0);
const numOuNull = (v: number | null | undefined): number | null => (typeof v === 'number' && Number.isFinite(v) ? v : null);
const dois = (n: number): string => String(n).padStart(2, '0');
const ehIso = (s: unknown): s is ISODate => typeof s === 'string' && RE_ISO.test(s);
const ehAq = (ex: FichaExercicio | undefined): boolean => !!ex && TIPOS_AQ.includes(ex.tipo);

/** Número com vírgula decimal e sem zeros à direita ("42,5"; "40"). */
function fmtNum(v: number, casas = 1): string {
  const f = 10 ** casas;
  return String(Math.round(v * f) / f).replace('.', ',');
}
const fmtKg = (v: number): string => `${fmtNum(v, 2)} kg`;

/** Data local "AAAA-MM-DD" (nunca toISOString). */
function isoLocal(d: Date): ISODate {
  return `${d.getFullYear()}-${dois(d.getMonth() + 1)}-${dois(d.getDate())}`;
}
function deIso(s: ISODate): Date {
  const [a, m, d] = s.split('-').map(Number);
  return new Date(a ?? 1970, (m ?? 1) - 1, d ?? 1);
}
function maisDias(s: ISODate, n: number): ISODate {
  const d = deIso(s);
  d.setDate(d.getDate() + n);
  return isoLocal(d);
}
const horaMin = (d: Date): string => `${dois(d.getHours())}:${dois(d.getMinutes())}`;
/** "HH:MM" → minutos desde a meia-noite; inválido → null. */
function minutosDe(hm: string | undefined): number | null {
  const m = /^(\d{1,2}):(\d{2})$/.exec(hm ?? '');
  if (!m) return null;
  const h = Number(m[1]), mi = Number(m[2]);
  return h < 24 && mi < 60 ? h * 60 + mi : null;
}

/** Ordem cronológica estável: data, depois hora de início, depois id. */
function cmpLift(a: Lift, b: Lift): number {
  if (a.data !== b.data) return a.data < b.data ? -1 : 1;
  const ia = a.inicio ?? '', ib = b.inicio ?? '';
  if (ia !== ib) return ia < ib ? -1 : 1;
  if (a.id !== b.id) return a.id < b.id ? -1 : 1;
  return 0;
}
const ordena = (lifts: Lift[]): Lift[] => lifts.filter((l) => ehIso(l.data)).sort(cmpLift);

/* ------------------------------------------------------------------ */
/* Leitura de "reps" e blocos de séries                                */
/* ------------------------------------------------------------------ */

/** Esquema sem progressão automática de carga (a sugestão só repete a ficha). */
export type Esquema = 'tempo' | 'cluster-set' | 'dead-stop' | 'soma' | 'drop-set';

export interface RepsLidas {
  /** Menor e maior número do texto ("8-12" → [8, 12]; "10" → [10, 10]; "20/20" → [20, 20]); null em série por tempo. */
  faixa: [number, number] | null;
  /** Série por tempo, em segundos, pelo maior valor ("45 s" → 45; "30-45 s" → 45; "1 min" → 60). */
  segundos: number | null;
  /** Soma dos números ("4-4-4" → 12; "5 + 10" → 15): as repetições por série nos esquemas cluster e dead stop. */
  total: number | null;
  /** Esquema que o TEXTO indica por si só (o método do exercício pode indicar outro: ver `esquemaDaSerie`). */
  esquema: Esquema | null;
}

function numerosDe(reps: string): number[] {
  return (reps.match(RE_NUMS) ?? []).map((x) => Number(x.replace(',', '.'))).filter((x) => Number.isFinite(x));
}

/** Lê o texto de repetições da ficha: "8-12", "10-15", "4-4-4", "45 s", "30-45 s", "20/20", "5 + 10". */
export function lerReps(texto: string): RepsLidas {
  const reps = texto.trim();
  const nums = numerosDe(reps), pos = nums.filter((x) => x > 0);
  const total = soma(nums) || null;
  if (RE_TEMPO.test(reps)) {
    const fator = /\d\s*min\b/i.test(reps) ? 60 : 1;
    return { faixa: null, segundos: pos.length ? Math.max(...pos) * fator : null, total: null, esquema: 'tempo' };
  }
  const faixa: [number, number] | null = pos.length ? [Math.min(...pos), Math.max(...pos)] : null;
  let esquema: Esquema | null = null;
  if (nums.length >= 3 && !reps.includes('+')) esquema = 'cluster-set';
  else if (reps.includes('+')) esquema = 'soma';
  return { faixa, segundos: null, total, esquema };
}

interface EsquemaInfo { k: Esquema; total: number | null; txt: string }

/** Esquema de um bloco (texto de reps + método do exercício + drops), como no Prumo; faixa normal → null. */
function esquemaDoBloco(item: SerieBloco, ex: FichaExercicio): EsquemaInfo | null {
  const reps = item.reps.trim(), metodo = ex.metodo;
  const lidas = lerReps(reps), total = soma(numerosDe(reps)) || null;
  const porSerie = total ? ` (${total} por série)` : '';
  if (lidas.esquema === 'tempo') return { k: 'tempo', total: null, txt: `Tempo: ${reps} como na ficha` };
  if (metodo === 'cluster-set' || lidas.esquema === 'cluster-set') {
    return { k: 'cluster-set', total, txt: `Cluster-set: siga o esquema ${reps || 'da ficha'}${porSerie}` };
  }
  if (metodo === 'dead-stop' || reps.includes('+')) {
    const dead = metodo === 'dead-stop';
    return { k: dead ? 'dead-stop' : 'soma', total, txt: `${dead ? 'Dead stop' : 'Esquema'}: siga ${reps || 'a ficha'}${porSerie}` };
  }
  if (metodo === 'drop-set' || Array.isArray(item.drops)) {
    const d = item.drops ?? [];
    return { k: 'drop-set', total: null, txt: `Drop-set: siga as cargas da ficha${d.length ? ` (${d.map((x) => fmtNum(x, 1)).join(' → ')} kg)` : ''}` };
  }
  return null;
}

interface Item {
  /** Índice do bloco em ex.series. */
  i: number;
  item: SerieBloco;
  sets: number;
  /** Primeira e última série (n) que o bloco cobre. */
  de: number;
  ate: number;
  aquecimento: boolean;
  /** Faixa do Prumo (menor e maior número do texto, inclusive em série por tempo): guia a progressão. */
  faixa: { base: number; topo: number } | null;
  esquema: EsquemaInfo | null;
}

function itensDe(ex: FichaExercicio): Item[] {
  const out: Item[] = [];
  let n = 0;
  ex.series.forEach((s, i) => {
    const sets = Math.max(0, Math.round(numOuNull(s.sets) ?? 0));
    const pos = numerosDe(s.reps).filter((x) => x > 0);
    out.push({
      i, item: s, sets, de: n + 1, ate: n + sets,
      aquecimento: ehAq(ex) || /aquec/i.test(s.nota ?? ''),
      faixa: pos.length ? { base: Math.min(...pos), topo: Math.max(...pos) } : null,
      esquema: esquemaDoBloco(s, ex),
    });
    n += sets;
  });
  return out;
}

/** Bloco que cobre a série n; além do total → o último com séries; nenhum com séries → o primeiro. */
function itemDe(itens: Item[], n: number): Item | undefined {
  const com = itens.filter((x) => x.sets > 0);
  if (!com.length) return itens[0];
  const k = Math.max(1, Math.round(Number.isFinite(n) ? n : 1));
  return com.find((x) => k >= x.de && k <= x.ate) ?? com[com.length - 1];
}

/** Bloco de trabalho que resume a sugestão: fora os aquecimentos, o de MAIOR carga (empate: mais séries, depois o primeiro). */
function itemPrincipal(itens: Item[]): Item | undefined {
  const trab = itens.filter((x) => !x.aquecimento), lista = trab.length ? trab : itens;
  let best: Item | undefined;
  for (const x of lista) {
    if (!best) { best = x; continue; }
    const c = numOuNull(x.item.carga) ?? -1, cb = numOuNull(best.item.carga) ?? -1;
    if (c > cb || (c === cb && x.sets > best.sets)) best = x;
  }
  return best;
}

/* ------------------------------------------------------------------ */
/* Programa e fichas                                                   */
/* ------------------------------------------------------------------ */

/** Programa em uso; id desconhecido, antigo ou vazio → o primeiro do catálogo (Maromba). */
export function programaAtivo(s: Settings): Programa {
  const p = programaPorId(s.programa) ?? PROGRAMAS[0];
  if (!p) throw new Error('Nenhum programa de musculação no catálogo.');
  return p;
}

const copiaBloco = (b: SerieBloco): SerieBloco => (b.drops ? { ...b, drops: [...b.drops] } : { ...b });

/**
 * Cópia do exercício com o ajuste do usuário aplicado: nome; `series` = número de séries do bloco de trabalho
 * principal (o de maior carga, fora os aquecimentos); carga e intervalo em todos os blocos (carga num bloco com
 * drops remove os drops: o usuário assumiu a carga). Aplicar duas vezes dá o mesmo resultado.
 */
export function aplicarAjuste(ex: FichaExercicio, ajuste: FichaAjuste | undefined): FichaExercicio {
  const out: FichaExercicio = { ...ex, series: ex.series.map(copiaBloco) };
  if (!ajuste) return out;
  const nome = typeof ajuste.nome === 'string' ? ajuste.nome.trim() : '';
  if (nome) out.nome = nome;
  const series = numOuNull(ajuste.series);
  if (series != null && Number.isInteger(series) && series > 0) {
    const alvo = itemPrincipal(itensDe(out));
    const bloco = alvo ? out.series[alvo.i] : undefined;
    if (bloco) bloco.sets = series;
  }
  const carga = numOuNull(ajuste.carga);
  if (carga != null && carga >= 0) out.series.forEach((b) => { b.carga = carga; delete b.drops; });
  const intervalo = numOuNull(ajuste.intervalo);
  if (intervalo != null && Number.isInteger(intervalo) && intervalo > 0) out.series.forEach((b) => { b.intervalo = intervalo; });
  return out;
}

/** Fichas do programa ativo (cópias), com `settings.fichas` aplicado. */
export function fichasAtivas(s: Settings): Ficha[] {
  const aj = s.fichas ?? {};
  return programaAtivo(s).fichas.map((f) => ({ ...f, exercicios: f.exercicios.map((ex) => aplicarAjuste(ex, aj[ex.id])) }));
}

export function fichaPorLetra(s: Settings, letra: string): Ficha | undefined {
  return fichasAtivas(s).find((f) => f.id === letra);
}

let indice: Map<string, { programa: Programa; ficha: Ficha; ex: FichaExercicio }> | null = null;

/** Exercício do catálogo (todos os programas, sem os ajustes do usuário) pelo id permanente ("m-A-01"). */
export function acharExercicio(exId: string): { programa: Programa; ficha: Ficha; ex: FichaExercicio } | undefined {
  if (!indice) {
    indice = new Map();
    for (const programa of PROGRAMAS) for (const ficha of programa.fichas) for (const ex of ficha.exercicios) indice.set(ex.id, { programa, ficha, ex });
  }
  return indice.get(exId);
}

/**
 * Nome para mostrar de um exercício gravado em um treino: o da ficha atual, o da ficha anterior (treinos antigos,
 * ids "h-…") ou, sem nenhum dos dois, um texto neutro. Nunca devolve o id cru.
 */
export function nomeDoExercicio(exId: string): string {
  return acharExercicio(exId)?.ex.nome ?? EXERCICIOS_ANTIGOS[exId]?.nome ?? 'Exercício de uma ficha antiga';
}

/** id do catálogo (foto e textos) de um exercício gravado, da ficha atual ou da anterior; desconhecido → undefined. */
export function catalogoDoExercicio(exId: string): string | undefined {
  return acharExercicio(exId)?.ex.anim ?? EXERCICIOS_ANTIGOS[exId]?.anim;
}

/**
 * A série n de um exercício GRAVADO conta como série de trabalho? Vale a ficha atual; para os ids da ficha
 * anterior, a regra que ela tinha (preparação e séries de aquecimento ficam fora); id desconhecido conta.
 */
export function serieGravadaConta(exId: string, n: number): boolean {
  const atual = acharExercicio(exId)?.ex;
  if (atual) return serieConta(atual, n);
  const aq = EXERCICIOS_ANTIGOS[exId]?.aquecimento;
  if (aq === 'todas') return false;
  return typeof aq === 'number' ? n > aq : true;
}

/** Exercício gravado que era só preparação na ficha anterior (alongamento, mobilidade, aquecimento). */
export function ehPreparacaoAntiga(exId: string): boolean {
  return !acharExercicio(exId) && EXERCICIOS_ANTIGOS[exId]?.aquecimento === 'todas';
}

export function ehPrincipal(ex: FichaExercicio): boolean {
  return ex.tipo === 'principal';
}

/** Pares combinados da ficha, na ordem: [[exA, exB], …] (só grupos com exatamente 2 exercícios). */
export function paresCombinados(ficha: Ficha): [FichaExercicio, FichaExercicio][] {
  const grupos = new Map<string, FichaExercicio[]>();
  for (const ex of ficha.exercicios) {
    if (ex.combinado == null) continue;
    const g = grupos.get(ex.combinado);
    if (g) g.push(ex); else grupos.set(ex.combinado, [ex]);
  }
  const out: [FichaExercicio, FichaExercicio][] = [];
  for (const g of grupos.values()) { const [a, b] = g; if (g.length === 2 && a && b) out.push([a, b]); }
  return out;
}

/** O outro exercício do par combinado de `exId` na ficha. */
export function parceiroDe(ficha: Ficha, exId: string): FichaExercicio | undefined {
  for (const [a, b] of paresCombinados(ficha)) { if (a.id === exId) return b; if (b.id === exId) return a; }
  return undefined;
}

/**
 * Treino principal da sessão: os exercícios `principal` E o parceiro combinado de cada um (cartão duplo), mesmo
 * quando o parceiro é aquecimento.
 */
export function exerciciosPrincipais(ficha: Ficha): FichaExercicio[] {
  return ficha.exercicios.filter((ex) => { const p = parceiroDe(ficha, ex.id); return ehPrincipal(ex) || (!!p && ehPrincipal(p)); });
}

/** Preparação (bloco recolhido): alongamento, mobilidade e aquecimento que não fazem par com um principal. */
export function exerciciosPreparacao(ficha: Ficha): FichaExercicio[] {
  return ficha.exercicios.filter((ex) => { const p = parceiroDe(ficha, ex.id); return ehAq(ex) && !(p && ehPrincipal(p)); });
}

/** Blocos do treino principal na ordem da ficha: [ex] ou [a, b] (par combinado, feito alternado A1, B1, A2, B2…). */
export function blocosDaFicha(ficha: Ficha): FichaExercicio[][] {
  const exs = exerciciosPrincipais(ficha), ids = new Set(exs.map((e) => e.id)), vistos = new Set<string>();
  const out: FichaExercicio[][] = [];
  for (const ex of exs) {
    if (vistos.has(ex.id)) continue;
    vistos.add(ex.id);
    const p = parceiroDe(ficha, ex.id);
    if (p && ids.has(p.id) && !vistos.has(p.id)) { vistos.add(p.id); out.push([ex, p]); } else out.push([ex]);
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* Séries planejadas e série de trabalho                               */
/* ------------------------------------------------------------------ */

export interface SeriePlanejada {
  /** Número da série no exercício, a partir de 1 (chave em Lift.sets[exId]). */
  n: number;
  /** Índice do bloco em ex.series. */
  bloco: number;
  /** Texto da ficha. */
  reps: string;
  /** Faixa de repetições quando numérica ("8-12" → [8, 12]); null em série por tempo. */
  faixa: [number, number] | null;
  /** Série por tempo ("45 s" → 45; "30-45 s" → 45). */
  segundos: number | null;
  carga: number | null;
  intervalo: number | null;
  /**
   * Série que NÃO é de trabalho: bloco de aquecimento dentro de um exercício principal (nota com "aquecimento") e,
   * como no Prumo, toda série de exercício de alongamento, mobilidade ou aquecimento.
   */
  aquecimento: boolean;
}

/** Uma linha por série planejada, com n cumulativo entre os blocos. */
export function seriesPlanejadas(ex: FichaExercicio): SeriePlanejada[] {
  const out: SeriePlanejada[] = [];
  for (const x of itensDe(ex)) {
    const lidas = lerReps(x.item.reps);
    for (let n = x.de; n <= x.ate; n++) {
      out.push({
        n, bloco: x.i, reps: x.item.reps, faixa: lidas.faixa, segundos: lidas.segundos,
        carga: numOuNull(x.item.carga), intervalo: numOuNull(x.item.intervalo), aquecimento: x.aquecimento,
      });
    }
  }
  return out;
}

/** Esquema da série n (tempo, cluster-set, dead-stop, soma, drop-set) ou null quando é faixa normal de repetições. */
export function esquemaDaSerie(ex: FichaExercicio, n: number): Esquema | null {
  return itemDe(itensDe(ex), n)?.esquema?.k ?? null;
}

/**
 * Regra única de "série": a série n de `ex` conta como série de trabalho? Exercício que o catálogo não conhece
 * (`undefined`) conta, porque não há como saber.
 */
export function serieConta(ex: FichaExercicio | undefined, n: number): boolean {
  if (!ex) return true;
  if (ehAq(ex)) return false;
  const it = itemDe(itensDe(ex), n);
  return !(it && it.aquecimento);
}

/** Séries de trabalho planejadas de um exercício (aquecimentos ficam fora; exercício de preparação → 0). */
export function seriesDeTrabalho(ex: FichaExercicio): number {
  return ehAq(ex) ? 0 : soma(itensDe(ex).filter((x) => !x.aquecimento).map((x) => x.sets));
}

export function totalSeriesDeTrabalho(ficha: Ficha): number {
  return soma(ficha.exercicios.filter(ehPrincipal).map(seriesDeTrabalho));
}

/* ------------------------------------------------------------------ */
/* Registros: feito, volume, e1RM                                      */
/* ------------------------------------------------------------------ */

export function contaComoFeito(l: Lift): boolean {
  return l.emAndamento !== true && l.concluido !== false;
}

/** Treinos feitos, em ordem crescente de data (depois hora de início e id). */
export function liftsFeitos(lifts: Lift[]): Lift[] {
  return ordena(lifts).filter(contaComoFeito);
}

/** Sessão guiada em andamento (a mais recente), de qualquer dia. */
export function sessaoAberta(lifts: Lift[]): Lift | undefined {
  const abertas = ordena(lifts).filter((l) => l.emAndamento === true);
  return abertas[abertas.length - 1];
}

/** e1RM de Epley, com uma casa: carga × (1 + reps / 30), sem teto; carga ou reps inválidas → 0. */
export function e1rm(carga: number, reps: number): number {
  if (!Number.isFinite(carga) || !Number.isFinite(reps) || carga <= 0 || reps < 1) return 0;
  return r1(carga * (1 + reps / 30));
}

interface SetFeito { exId: string; n: number; reps: number; carga: number; t?: string }

/** Posição do exercício na ficha pelo sufixo do id ("h-A-07" → 7); desconhecido do catálogo → null. */
function posicao(exId: string): number | null {
  if (!acharExercicio(exId)) return null;
  const m = /(\d+)\s*$/.exec(exId);
  return m ? Number(m[1]) : null;
}

/** Séries marcadas como feitas: exercícios na ordem da ficha (os desconhecidos depois, na ordem de gravação), série por n. */
function setsFeitos(l: Lift): SetFeito[] {
  const sets = l.sets;
  if (!sets) return [];
  const exs = Object.keys(sets).map((exId, i) => ({ exId, i, pos: posicao(exId) }));
  exs.sort((a, b) => {
    if ((a.pos == null) !== (b.pos == null)) return a.pos == null ? 1 : -1;
    if (a.pos != null && b.pos != null && a.pos !== b.pos) return a.pos - b.pos;
    return a.i - b.i;
  });
  const out: SetFeito[] = [];
  for (const g of exs) {
    const m = sets[g.exId];
    if (!m) continue;
    const ns = Object.keys(m).map((k) => ({ k, n: Number(k) })).filter((x) => Number.isFinite(x.n)).sort((a, b) => a.n - b.n);
    for (const { k, n } of ns) {
      const s = m[k];
      if (!s || !s.feito) continue;
      out.push({ exId: g.exId, n, reps: numOuNull(s.reps) ?? 0, carga: numOuNull(s.carga) ?? 0, ...(s.t ? { t: s.t } : {}) });
    }
  }
  return out;
}

/** Σ reps × carga das séries feitas; registro sem `sets` (manual ou antigo) usa o `volume` gravado, ou 0. */
export function volumeDoLift(l: Lift): number {
  if (!l.sets) return numOuNull(l.volume) ?? 0;
  return soma(setsFeitos(l).map((s) => s.reps * s.carga));
}

/**
 * Séries de TRABALHO feitas (regra única do Prumo: aquecimento, alongamento e mobilidade ficam fora), no treino
 * inteiro ou só em `exId`. Para contar tudo o que foi marcado, use `seriesMarcadas`.
 */
export function seriesFeitas(l: Lift, exId?: string): number {
  return setsFeitos(l).filter((s) => (exId == null || s.exId === exId) && serieGravadaConta(s.exId, s.n)).length;
}

/** Todas as séries marcadas como feitas (inclusive aquecimento e preparação), no treino inteiro ou só em `exId`. */
export function seriesMarcadas(l: Lift, exId?: string): number {
  return setsFeitos(l).filter((s) => exId == null || s.exId === exId).length;
}

/** Duração em minutos: `min` gravado ou fim − início (virando a meia-noite); sem dado → null. */
export function duracaoDoLift(l: Lift): number | null {
  const m = numOuNull(l.min);
  if (m != null && m >= 0) return m;
  const a = minutosDe(l.inicio), b = minutosDe(l.fim);
  if (a == null || b == null) return null;
  return b - a < 0 ? b - a + 1440 : b - a;
}

/* ------------------------------------------------------------------ */
/* Histórico por exercício                                             */
/* ------------------------------------------------------------------ */

/** Série feita com o número da série (n) a que pertence. */
export interface SerieDaUltimaVez extends SerieFeita { n: number; reps: number; carga: number }

/**
 * Última sessão feita com séries marcadas do exercício. Com `antes`, só valem sessões de datas anteriores à dele
 * (é o "Última vez" mostrado durante a sessão em andamento).
 */
export function ultimaVez(lifts: Lift[], exId: string, antes?: Lift): { data: ISODate; sets: SerieDaUltimaVez[] } | undefined {
  const ord = liftsFeitos(lifts);
  for (let i = ord.length - 1; i >= 0; i--) {
    const l = ord[i];
    if (!l || (antes && (l.id === antes.id || l.data >= antes.data))) continue;
    const sets = setsFeitos(l).filter((s) => s.exId === exId);
    if (!sets.length) continue;
    return { data: l.data, sets: sets.map((s) => ({ n: s.n, reps: s.reps, carga: s.carga, feito: true, ...(s.t ? { t: s.t } : {}) })) };
  }
  return undefined;
}

/** Melhor série (maior e1RM) do exercício nas sessões dadas e a maior contagem de repetições; sem histórico → undefined. */
function melhorHistorico(feitos: Lift[], exId: string): { e1rm: number; repsMax: number } | undefined {
  let best: number | null = null, repsMax = 0;
  for (const l of feitos) for (const s of setsFeitos(l)) {
    if (s.exId !== exId) continue;
    const v = e1rm(s.carga, s.reps);
    if (best == null || v > best) best = v;
    if (s.reps > repsMax) repsMax = s.reps;
  }
  return best == null ? undefined : { e1rm: best, repsMax };
}

/** Recorde com as repetições máximas anteriores quando a medida é "reps" (peso do corpo). */
export interface PrDaSessao extends Pr { repsAnterior?: number }

/**
 * Recordes de UMA sessão: o e1RM da sessão passa o melhor das sessões feitas anteriores (ordem data, início, id);
 * em peso do corpo (e1RM 0 dos dois lados) compara as repetições máximas. A primeira vez de um exercício NÃO é
 * recorde: vira a referência.
 */
export function prsDoLift(anteriores: Lift[], l: Lift): PrDaSessao[] {
  if (!ehIso(l.data)) return [];
  const antes = liftsFeitos(anteriores.filter((a) => a !== l && a.id !== l.id)).filter((a) => cmpLift(a, l) < 0);
  const porEx = new Map<string, { e1rm: number; carga: number; reps: number; repsMax: number }>();
  for (const s of setsFeitos(l)) {
    const v = e1rm(s.carga, s.reps), cur = porEx.get(s.exId);
    if (!cur) porEx.set(s.exId, { e1rm: v, carga: s.carga, reps: s.reps, repsMax: s.reps });
    else {
      if (v > cur.e1rm) { cur.e1rm = v; cur.carga = s.carga; cur.reps = s.reps; }
      if (s.reps > cur.repsMax) cur.repsMax = s.reps;
    }
  }
  const out: PrDaSessao[] = [];
  for (const [exId, b] of porEx) {
    const h = melhorHistorico(antes, exId);
    if (!h) continue;
    const nome = nomeDoExercicio(exId);
    if (b.e1rm > h.e1rm) out.push({ exId, nome, e1rm: b.e1rm, carga: b.carga, reps: b.reps, anterior: h.e1rm, medida: 'e1rm' });
    else if (b.e1rm === 0 && h.e1rm === 0 && b.repsMax > h.repsMax) {
      out.push({ exId, nome, e1rm: 0, carga: 0, reps: b.repsMax, anterior: 0, repsAnterior: h.repsMax, medida: 'reps' });
    }
  }
  return out;
}

/** Progressão por sessão feita (cronológica) de um exercício. */
export function historicoEx(lifts: Lift[], exId: string): { data: ISODate; e1rm: number; cargaMax: number; repsMax: number }[] {
  const out: { data: ISODate; e1rm: number; cargaMax: number; repsMax: number }[] = [];
  for (const l of liftsFeitos(lifts)) {
    const sets = setsFeitos(l).filter((s) => s.exId === exId);
    if (!sets.length) continue;
    out.push({
      data: l.data, e1rm: maximo(sets.map((s) => e1rm(s.carga, s.reps))),
      cargaMax: maximo(sets.map((s) => s.carga)), repsMax: maximo(sets.map((s) => s.reps)),
    });
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* Rotação das fichas e ficha do dia                                   */
/* ------------------------------------------------------------------ */

/**
 * A "próxima ficha" oficial: a que está há mais tempo sem fazer (nunca feita vem primeiro; empate segue a ordem
 * A → B → C). Sessões em andamento, descartadas e de outro programa não contam.
 */
export function proximaFicha(s: Settings, lifts: Lift[]): Ficha {
  const fichas = fichasAtivas(s), prog = programaAtivo(s).id;
  const ultima = new Map<string, ISODate>();
  for (const l of lifts) {
    if (!l.data || !contaComoFeito(l) || (l.programa && l.programa !== prog)) continue;
    const f = fichas.find((x) => x.id === l.ficha || x.nome === l.treino);
    if (!f) continue;
    const d = ultima.get(f.id);
    if (d == null || d < l.data) ultima.set(f.id, l.data);
  }
  let best: Ficha | undefined, bestData = '9999';
  for (const f of fichas) {
    const d = ultima.get(f.id) ?? '';
    if (d < bestData) { best = f; bestData = d; }
  }
  if (!best) throw new Error('O programa de musculação não tem fichas.');
  return best;
}

/** Letras das últimas 6 fichas feitas (cronológicas), a última e a seguinte na ordem A → B → C → A. */
export function rotacaoFichas(s: Settings, lifts: Lift[]): { ultimas: string[]; ultima: string | null; proxima: string } {
  const fichas = fichasAtivas(s), letras = fichas.map((f) => f.id), prog = programaAtivo(s).id;
  const seq: string[] = [];
  for (const l of liftsFeitos(lifts)) {
    if (l.programa && l.programa !== prog) continue;
    const k = l.ficha || fichas.find((f) => f.nome === l.treino)?.id;
    if (k) seq.push(k);
  }
  const ultimas = seq.slice(-6), ultima = ultimas[ultimas.length - 1] ?? null;
  const i = ultima == null ? -1 : letras.indexOf(ultima);
  return { ultimas, ultima, proxima: (i >= 0 ? letras[(i + 1) % letras.length] : letras[0]) ?? 'A' };
}

/**
 * Ficha de musculação do dia conforme `settings.plano` (chave = dia da semana, 0 = DOMINGO, como Date.getDay()):
 * dia de tipo "musc" ou "ambos" → a ficha fixa do dia ou, sem ela, a próxima da rotação; senão `undefined`.
 */
export function fichaDoDia(s: Settings, lifts: Lift[], data: ISODate): Ficha | undefined {
  if (!ehIso(data)) return undefined;
  const dia = s.plano[deIso(data).getDay()];
  if (!dia || (dia.tipo !== 'musc' && dia.tipo !== 'ambos')) return undefined;
  return (dia.ficha ? fichaPorLetra(s, dia.ficha) : undefined) ?? proximaFicha(s, lifts);
}

/* ------------------------------------------------------------------ */
/* Sugestão de carga: progressão dupla por bloco                       */
/* ------------------------------------------------------------------ */

export interface Sugestao {
  tipo: 'ficha' | 'sobe' | 'repete' | 'reps' | 'aquecimento';
  carga: number | null;
  reps: string;
  /** Frase curta para a interface: "Bateu 12 em todas: suba para 42,5 kg". */
  motivo: string;
  /** Valores para pré-preencher cada série (reps null em série por tempo). */
  series: { n: number; carga: number | null; reps: number | null }[];
}

interface SugItem { tipo: Sugestao['tipo']; carga: number | null; reps: number | null; motivo: string }

/** Séries de trabalho entre as feitas: as da carga com MAIS séries (empate: a mais pesada); uma "top set" isolada fica fora. */
function trabalhoDe<T extends { carga: number }>(sets: T[]): T[] {
  if (!sets.length) return [];
  const m = new Map<number, number>();
  for (const s of sets) m.set(s.carga, (m.get(s.carga) ?? 0) + 1);
  let carga: number | null = null, k = 0;
  for (const [c, q] of m) if (q > k || (q === k && (carga == null || c > carga))) { carga = c; k = q; }
  return sets.filter((s) => s.carga === carga);
}

function sugereItem(x: Item, feitos: { reps: number; carga: number }[], ex: FichaExercicio): SugItem {
  const cargaFicha = numOuNull(x.item.carga), base = x.faixa ? x.faixa.base : null, topo = x.faixa ? x.faixa.topo : null;
  const trab = trabalhoDe(feitos), cargaUlt = trab[0] ? trab[0].carga : null;
  const minReps = trab.length ? Math.min(...trab.map((s) => s.reps)) : null;
  if (x.aquecimento) return { carga: cargaUlt ? cargaUlt : cargaFicha ?? cargaUlt, reps: minReps ?? base, tipo: 'aquecimento', motivo: 'Aquecimento: como na ficha' };
  if (cargaUlt == null || minReps == null) {
    return { carga: cargaFicha, reps: x.esquema ? x.esquema.total ?? base : base, tipo: 'ficha', motivo: 'Primeira vez: carga da ficha' };
  }
  if (x.esquema) return { carga: cargaUlt, reps: x.esquema.total ?? minReps, tipo: 'repete', motivo: x.esquema.txt };
  if (base == null || topo == null) {
    return { carga: cargaUlt, reps: minReps || null, tipo: 'repete', motivo: 'Sem faixa de repetições na ficha: repita a última carga' };
  }
  // peso do corpo: carga 0 registrada num exercício sem carga na ficha (ou de peso do corpo) → progride por repetições
  const pesoCorpo = cargaUlt === 0 && (!cargaFicha || /peso do corpo/i.test(ex.equipamento ?? ''));
  if (cargaUlt === 0 && !pesoCorpo) return { carga: cargaFicha, reps: base, tipo: 'ficha', motivo: 'Última vez sem carga registrada: carga da ficha' };
  if (minReps >= topo) {
    if (pesoCorpo) return { carga: 0, reps: minReps + 1, tipo: 'reps', motivo: `Peso do corpo: bateu ${topo} em todas, tente ${minReps + 1}` };
    const nova = cargaUlt >= 60 ? r05(cargaUlt * 1.05) : cargaUlt + 2.5;
    return { carga: nova, reps: base, tipo: 'sobe', motivo: `Bateu ${topo} em todas: suba para ${fmtKg(nova)}` };
  }
  const reps = Math.min(topo, Math.max(base, minReps + 1));
  return {
    carga: cargaUlt, reps, tipo: 'repete',
    motivo: pesoCorpo ? `Peso do corpo: faltou chegar a ${topo}, mire ${reps}` : `Faltou chegar a ${topo} em todas: repita ${fmtKg(cargaUlt)} e mire ${reps}`,
  };
}

/**
 * Progressão dupla POR BLOCO de `series`: as séries da última vez caem no bloco pela posição (n cumulativo); dentro
 * do bloco, as séries de trabalho são as da carga com mais séries (empate: a maior). Bateu o topo da faixa em todas
 * → sobe a carga (+2,5 kg; +5% arredondado a 0,5 kg a partir de 60 kg) e volta à base; senão repete a carga e mira
 * +1 repetição. Peso do corpo progride por repetições (tipo "reps"); cluster, dead stop, tempo e drop-set só
 * repetem o esquema da ficha. O resumo (`tipo`, `carga`, `reps`, `motivo`) é o do bloco principal (maior carga da
 * ficha); `series` traz uma linha por série planejada. Os ajustes de `settings.fichas` são aplicados a `ex`.
 */
export function sugestao(s: Settings, lifts: Lift[], ex: FichaExercicio): Sugestao {
  const alvo = aplicarAjuste(ex, s.fichas?.[ex.id]);
  const itens = itensDe(alvo), ult = ultimaVez(lifts, alvo.id), sets = ult ? ult.sets : [];
  if (!itens.length) {
    const trab = trabalhoDe(sets), primeira = trab[0];
    if (!primeira) return { tipo: 'ficha', carga: null, reps: '', motivo: 'Sem histórico nem ficha', series: [] };
    const minReps = Math.min(...trab.map((x) => x.reps));
    return {
      tipo: 'repete', carga: primeira.carga, reps: minReps ? String(minReps) : '',
      motivo: 'Sem faixa de repetições na ficha: repita a última carga',
      series: sets.map((x) => ({ n: x.n, carga: x.carga, reps: x.reps })),
    };
  }
  const porItem = itens.map((x) => sugereItem(x, sets.filter((f) => itemDe(itens, f.n) === x), alvo));
  const principal = itemPrincipal(itens) ?? itens[0];
  const p = principal ? porItem[itens.indexOf(principal)] : undefined;
  const series: Sugestao['series'] = [];
  itens.forEach((x, k) => {
    const sg = porItem[k];
    if (!sg) return;
    for (let n = x.de; n <= x.ate; n++) series.push({ n, carga: sg.carga, reps: x.esquema?.k === 'tempo' ? null : sg.reps });
  });
  if (!p || !principal) return { tipo: 'ficha', carga: null, reps: '', motivo: 'Sem histórico nem ficha', series };
  const tempo = principal.esquema?.k === 'tempo';
  return { tipo: p.tipo, carga: p.carga, reps: tempo || p.reps == null ? principal.item.reps : String(p.reps), motivo: p.motivo, series };
}

/* ------------------------------------------------------------------ */
/* Descanso                                                            */
/* ------------------------------------------------------------------ */

/**
 * Descanso em segundos depois da série n: o intervalo do bloco que cobre n (0 explícito = sem descanso; além do
 * total → último bloco) → o padrão do usuário (`settings.descansoPadrao`) → 90 s. Com `par` (o outro exercício do
 * par combinado, quando não foi pulado), vale o MAIOR dos dois intervalos prescritos; o descanso do par só começa
 * depois que os dois fizeram a série n (quem decide isso é a tela). Os ajustes de `settings.fichas` são aplicados.
 */
export function descansoDe(s: Settings, ex: FichaExercicio, n: number, par?: FichaExercicio): number {
  const intervaloDe = (e: FichaExercicio): number | null => {
    const x = itemDe(itensDe(aplicarAjuste(e, s.fichas?.[e.id])), n), v = x ? numOuNull(x.item.intervalo) : null;
    return v != null && v >= 0 ? v : null;
  };
  const proprio = intervaloDe(ex);
  if (par) {
    const v = [proprio, intervaloDe(par)].filter((x): x is number => x != null);
    if (v.length) return Math.max(...v);
  }
  if (proprio != null) return proprio;
  const padrao = numOuNull(s.descansoPadrao);
  return padrao != null && padrao > 0 ? padrao : DESCANSO_FALLBACK;
}

/* ------------------------------------------------------------------ */
/* Sessão guiada (devolvem um Lift novo; não alteram o argumento)      */
/* ------------------------------------------------------------------ */

/** id novo: tempo em base 36 + aleatório, como no Prumo. */
function novoId(agora: Date): string {
  return agora.getTime().toString(36) + Math.random().toString(36).slice(2, 8);
}

/** Cria o registro da sessão: em andamento, sem séries, com data e hora locais de `agora`. */
export function iniciarSessao(s: Settings, ficha: Ficha, agora: Date = new Date()): Lift {
  return {
    id: novoId(agora), data: isoLocal(agora), ficha: ficha.id, treino: ficha.nome, programa: programaAtivo(s).id,
    inicio: horaMin(agora), emAndamento: true, concluido: false, sets: {}, inicioMs: agora.getTime(),
  };
}

function comSerie(l: Lift, exId: string, n: number, serie: SerieFeita): Lift {
  const sets = { ...(l.sets ?? {}) };
  sets[exId] = { ...(sets[exId] ?? {}), [String(n)]: serie };
  return { ...l, sets };
}

/** Marca a série n como feita: grava { reps, carga, feito: true, t } (valores já gravados valem para o que faltar em `v`). */
export function marcarSerie(l: Lift, exId: string, n: number, v: { reps?: number; carga?: number }, agora: Date = new Date()): Lift {
  const prev = l.sets?.[exId]?.[String(n)];
  const serie: SerieFeita = { ...(prev ?? {}), feito: true, t: horaMin(agora) };
  if (v.reps != null && Number.isFinite(v.reps)) serie.reps = v.reps;
  if (v.carga != null && Number.isFinite(v.carga)) serie.carga = v.carga;
  return comSerie(l, exId, n, serie);
}

/** Desmarca a série n (feito: false; os valores ficam). Série nunca marcada: nada muda. */
export function desmarcarSerie(l: Lift, exId: string, n: number): Lift {
  const prev = l.sets?.[exId]?.[String(n)];
  return prev ? comSerie(l, exId, n, { ...prev, feito: false }) : { ...l };
}

/** Marca ou desmarca o exercício como pulado. */
export function pularExercicio(l: Lift, exId: string, pular: boolean): Lift {
  const sem = (l.pulados ?? []).filter((x) => x !== exId);
  return { ...l, pulados: pular ? [...sem, exId] : sem };
}

/** Hora de fim: agora (sessão de hoje) ou a da última série marcada (sessão esquecida de outro dia). */
function fimDe(l: Lift, agora: Date): string | undefined {
  if (l.data === isoLocal(agora)) return horaMin(agora);
  let best: string | undefined, bestMin = -1;
  for (const m of Object.values(l.sets ?? {})) for (const s of Object.values(m)) {
    const t = minutosDe(s.t);
    if (s.feito && s.t && t != null && t > bestMin) { best = s.t; bestMin = t; }
  }
  return best;
}

/**
 * Conclui a sessão: grava { concluido: true, emAndamento: false, fim, min, volume, prs, intensidade, obs }.
 * `min` vem do cronômetro (`inicioMs`, décimos de minuto) na sessão de hoje; senão, de início e fim em "HH:MM".
 * `volume` tem uma casa decimal; `prs` compara com as sessões feitas de `anteriores`.
 */
export function concluirSessao(anteriores: Lift[], l: Lift, v: { intensidade?: number; obs?: string }, agora: Date = new Date()): Lift {
  const fim = fimDe(l, agora);
  let min: number | undefined;
  if (l.inicioMs != null && l.inicioMs > 0 && l.data === isoLocal(agora)) {
    const d = (agora.getTime() - l.inicioMs) / 60000;
    if (d >= 0 && d < 1440) min = r1(d);
  }
  if (min == null) {
    const a = minutosDe(l.inicio), b = minutosDe(fim);
    if (a != null && b != null) min = (b - a + 1440) % 1440;
  }
  const prs: Pr[] = prsDoLift(anteriores, l).map((p) => ({ exId: p.exId, nome: p.nome, e1rm: p.e1rm, carga: p.carga, reps: p.reps, anterior: p.anterior, medida: p.medida }));
  const out: Lift = { ...l, concluido: true, emAndamento: false, volume: r1(volumeDoLift(l)), prs, obs: (v.obs ?? l.obs ?? '').trim() };
  if (fim != null) out.fim = fim;
  if (min != null) out.min = min;
  const intensidade = numOuNull(v.intensidade) ?? numOuNull(l.intensidade);
  if (intensidade != null && intensidade > 0) out.intensidade = intensidade; else delete out.intensidade;
  return out;
}

/* ------------------------------------------------------------------ */
/* Semana                                                              */
/* ------------------------------------------------------------------ */

/**
 * Musculação da semana (segunda a domingo) de `ref`: treinos feitos, dias de musculação no plano ("musc" ou
 * "ambos"), volume em kg e séries de trabalho feitas.
 */
export function resumoSemanaMusc(s: Settings, lifts: Lift[], ref: ISODate): { treinos: number; planejados: number; volume: number; series: number } {
  let planejados = 0;
  for (let d = 0; d < 7; d++) { const p = s.plano[d]; if (p && (p.tipo === 'musc' || p.tipo === 'ambos')) planejados++; }
  if (!ehIso(ref)) return { treinos: 0, planejados, volume: 0, series: 0 };
  const a = maisDias(ref, -((deIso(ref).getDay() + 6) % 7)), b = maisDias(a, 7);
  const semana = liftsFeitos(lifts).filter((l) => l.data >= a && l.data < b);
  return { treinos: semana.length, planejados, volume: soma(semana.map(volumeDoLift)), series: soma(semana.map((l) => seriesFeitas(l))) };
}
