/**
 * Estado do app: um único objeto AppState em memória, salvo no IndexedDB (banco "prumo-treino", object store
 * "kv", chave "state") com espelho em localStorage["prumo-treino:state"].
 *
 * - O objeto de estado é tratado como imutável: `update` trabalha sobre uma cópia (structuredClone) e troca a
 *   referência. Nunca altere o que `getState()` devolve.
 * - Falha de disco nunca vira exceção para a interface: é registrada com console.warn e o app segue em memória.
 * - Junto do estado vai um carimbo de hora ("salvoEm") nos dois lugares. Ao abrir, vale a cópia mais nova: no
 *   iPhone a gravação no IndexedDB pode não terminar quando o app é fechado, e o espelho (síncrono) termina.
 */
import { useEffect, useReducer, useRef } from 'preact/hooks';
import { programaPorId } from '../data/fichas.ts';
import { ZONES } from '../data/profile.ts';
import type {
  AppState, DiaPlano, FichaAjuste, HrZone, Lift, MobilityLog, PlanMark, PlanoTipo, RunLog, Settings, WeightLog,
} from '../types.ts';

export const SCHEMA_VERSION = 1;

/** Chave do espelho em localStorage (estado em JSON). */
export const STATE_KEY = 'prumo-treino:state';
/** Chave do modo de teste: com o valor '1', o estado é lido só do espelho e o IndexedDB não é tocado. */
export const SEED_KEY = 'prumo-treino:seed';
/** Chave do carimbo de hora (ms) da última gravação do espelho. */
export const SAVED_AT_KEY = 'prumo-treino:salvoEm';

const DB_NAME = 'prumo-treino';
const DB_STORE = 'kv';
const DB_STATE = 'state';
const DB_SAVED_AT = 'salvoEm';
const DEBOUNCE_MS = 300;
const DB_TIMEOUT_MS = 3000;

/* ------------------------------------------------------------------ */
/* Estado inicial e mescla                                             */
/* ------------------------------------------------------------------ */

/** Estado de quem abre o app pela primeira vez (SPEC, seção 4). */
export function initialState(): AppState {
  const settings: Settings = {
    nome: 'Filipe',
    tema: 'auto',
    som: true,
    voz: true,
    vibrar: true,
    telaLigada: true,
    descansoPadrao: 90,
    alongamentoSeg: 60,
    fcMax: 192,
    zonas: ZONES.map((z) => ({ ...z })),
    programa: 'maromba',
    plano: {
      0: { tipo: 'corrida' },
      1: { tipo: 'musc', ficha: 'A' },
      2: { tipo: 'descanso' },
      3: { tipo: 'corrida' },
      4: { tipo: 'musc', ficha: 'B' },
      5: { tipo: 'corrida' },
      6: { tipo: 'musc', ficha: 'C' },
    },
  };
  return { v: SCHEMA_VERSION, criadoEm: Date.now(), settings, runs: [], lifts: [], weights: [], mob: [], marcas: {} };
}

type Obj = Record<string, unknown>;

const ehObj = (v: unknown): v is Obj => typeof v === 'object' && v !== null && !Array.isArray(v);
const ehNum = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);
const texto = (v: unknown, padrao: string): string => (typeof v === 'string' ? v : padrao);
const numero = (v: unknown, padrao: number): number => (ehNum(v) ? v : padrao);
const logico = (v: unknown, padrao: boolean): boolean => (typeof v === 'boolean' ? v : padrao);

/** Mantém só os itens que são objetos com `data` em texto; garante um id em cada um. */
function registros<T extends { id: string; data: string }>(v: unknown): T[] {
  if (!Array.isArray(v)) return [];
  const saida: T[] = [];
  for (const item of v as unknown[]) {
    if (!ehObj(item) || typeof item.data !== 'string') continue;
    const id = typeof item.id === 'string' && item.id !== '' ? item.id : uid();
    saida.push({ ...item, id } as unknown as T);
  }
  return saida;
}

const TEMAS: readonly Settings['tema'][] = ['auto', 'escuro', 'claro'];
const TIPOS_PLANO: readonly PlanoTipo[] = ['musc', 'corrida', 'ambos', 'descanso'];

function zonasDe(v: unknown, padrao: HrZone[]): HrZone[] {
  if (!Array.isArray(v) || v.length === 0) return padrao;
  const saida: HrZone[] = [];
  for (const z of v as unknown[]) {
    if (!ehObj(z) || typeof z.id !== 'string' || !ehNum(z.min) || !ehNum(z.max)) return padrao;
    const base = padrao.find((p) => p.id === z.id);
    saida.push({
      id: z.id as HrZone['id'],
      label: texto(z.label, base?.label ?? z.id),
      min: z.min,
      max: z.max,
      feel: texto(z.feel, base?.feel ?? ''),
    });
  }
  return saida;
}

function planoDe(v: unknown, padrao: Record<number, DiaPlano>): Record<number, DiaPlano> {
  if (!ehObj(v)) return padrao;
  const saida: Record<number, DiaPlano> = { ...padrao };
  for (let d = 0; d <= 6; d++) {
    const dia = v[String(d)];
    if (!ehObj(dia)) continue;
    const tipo = TIPOS_PLANO.find((t) => t === dia.tipo);
    if (!tipo) continue;
    saida[d] = typeof dia.ficha === 'string' && dia.ficha !== '' ? { tipo, ficha: dia.ficha } : { tipo };
  }
  return saida;
}

function settingsDe(v: unknown, base: Settings): Settings {
  if (!ehObj(v)) return base;
  const s: Settings = {
    nome: texto(v.nome, base.nome),
    tema: TEMAS.find((t) => t === v.tema) ?? base.tema,
    som: logico(v.som, base.som),
    voz: logico(v.voz, base.voz),
    vibrar: logico(v.vibrar, base.vibrar),
    telaLigada: logico(v.telaLigada, base.telaLigada),
    descansoPadrao: numero(v.descansoPadrao, base.descansoPadrao),
    alongamentoSeg: numero(v.alongamentoSeg, base.alongamentoSeg),
    fcMax: numero(v.fcMax, base.fcMax),
    zonas: zonasDe(v.zonas, base.zonas),
    programa: texto(v.programa, base.programa),
    plano: planoDe(v.plano, base.plano),
  };
  if (typeof v.nascimento === 'string' && v.nascimento !== '') s.nascimento = v.nascimento;
  if (ehNum(v.alturaCm)) s.alturaCm = v.alturaCm;
  if (ehNum(v.pesoMeta)) s.pesoMeta = v.pesoMeta;
  if (ehObj(v.fichas)) {
    const fichas: Record<string, FichaAjuste> = {};
    for (const [id, aj] of Object.entries(v.fichas)) if (ehObj(aj)) fichas[id] = aj as FichaAjuste;
    s.fichas = fichas;
  }
  return migrarPrograma(s, base);
}

/**
 * Troca de programa (nov/2026): quem vem de um programa que não existe mais no app (a ficha "hibrido") passa para
 * o programa atual. As letras mudaram de sentido (A era costas, agora é pernas), então os dias de musculação voltam
 * às fichas fixas do plano inicial (segunda = A, quinta = B, sábado = C; outro dia de musculação fica na rotação)
 * e os ajustes de carga e de séries da ficha antiga são descartados. Os treinos gravados não são tocados.
 */
function migrarPrograma(s: Settings, base: Settings): Settings {
  if (programaPorId(s.programa)) return s;
  const plano: Record<number, DiaPlano> = {};
  for (const [d, dia] of Object.entries(s.plano)) {
    const n = Number(d), fixa = base.plano[n]?.ficha;
    if (dia.tipo !== 'musc' && dia.tipo !== 'ambos') plano[n] = { tipo: dia.tipo };
    else plano[n] = fixa ? { tipo: dia.tipo, ficha: fixa } : { tipo: dia.tipo };
  }
  const { fichas: _descartados, ...resto } = s;
  return { ...resto, programa: base.programa, plano };
}

/**
 * Migração e conserto: mescla um estado lido do disco ou de um arquivo (possivelmente antigo ou incompleto)
 * sobre `initialState()`, campo a campo. O que falta ou tem tipo errado fica com o valor inicial.
 * Migrações futuras entram aqui, olhando o `v` do estado lido antes da mescla.
 */
export function normalizarEstado(bruto: unknown): AppState {
  const base = initialState();
  if (!ehObj(bruto)) return base;
  const marcas: Record<string, PlanMark> = {};
  if (ehObj(bruto.marcas)) {
    for (const [id, m] of Object.entries(bruto.marcas)) if (m === 'feito' || m === 'pulado') marcas[id] = m;
  }
  const estado: AppState = {
    v: SCHEMA_VERSION,
    criadoEm: numero(bruto.criadoEm, base.criadoEm),
    settings: settingsDe(bruto.settings, base.settings),
    runs: registros<RunLog>(bruto.runs),
    lifts: registros<Lift>(bruto.lifts),
    weights: registros<WeightLog>(bruto.weights).filter((w) => ehNum(w.kg)),
    mob: registros<MobilityLog>(bruto.mob),
    marcas,
  };
  if (ehNum(bruto.ultimoBackup)) estado.ultimoBackup = bruto.ultimoBackup;
  if (ehNum(bruto.historicoEm)) estado.historicoEm = bruto.historicoEm;
  return estado;
}

/* ------------------------------------------------------------------ */
/* Disco                                                               */
/* ------------------------------------------------------------------ */

function aviso(oQue: string, erro: unknown): void {
  try {
    console.warn(`[prumo-treino] ${oQue}`, erro);
  } catch {
    /* sem console */
  }
}

function espelho(): Storage | undefined {
  try {
    const ls = (globalThis as { localStorage?: Storage }).localStorage;
    return ls ?? undefined;
  } catch {
    return undefined;
  }
}

function lerChave(chave: string): string | null {
  try {
    return espelho()?.getItem(chave) ?? null;
  } catch (e) {
    aviso('Não foi possível ler o espelho.', e);
    return null;
  }
}

function gravarEspelho(s: AppState, salvoEm: number): void {
  try {
    const ls = espelho();
    if (!ls) return;
    ls.setItem(STATE_KEY, JSON.stringify(s));
    ls.setItem(SAVED_AT_KEY, String(salvoEm));
  } catch (e) {
    aviso('Não foi possível gravar o espelho.', e);
  }
}

let dbAberto: Promise<IDBDatabase> | null = null;

function abrirDb(): Promise<IDBDatabase> {
  if (dbAberto) return dbAberto;
  const p = new Promise<IDBDatabase>((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('IndexedDB indisponível.'));
      return;
    }
    // O Safari às vezes deixa a abertura do banco sem resposta: desiste depois de alguns segundos.
    const prazo = setTimeout(() => reject(new Error('O IndexedDB não respondeu.')), DB_TIMEOUT_MS);
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      if (!req.result.objectStoreNames.contains(DB_STORE)) req.result.createObjectStore(DB_STORE);
    };
    req.onsuccess = () => {
      clearTimeout(prazo);
      const db = req.result;
      db.onversionchange = () => {
        db.close();
        dbAberto = null;
      };
      db.onclose = () => {
        dbAberto = null;
      };
      resolve(db);
    };
    req.onerror = () => {
      clearTimeout(prazo);
      reject(req.error ?? new Error('Falha ao abrir o IndexedDB.'));
    };
  });
  dbAberto = p;
  p.catch(() => {
    if (dbAberto === p) dbAberto = null;
  });
  return p;
}

function transacao<T>(modo: IDBTransactionMode, fn: (store: IDBObjectStore) => () => T): Promise<T> {
  return abrirDb().then(
    (db) =>
      new Promise<T>((resolve, reject) => {
        const tx = db.transaction(DB_STORE, modo);
        const resultado = fn(tx.objectStore(DB_STORE));
        tx.oncomplete = () => resolve(resultado());
        tx.onerror = () => reject(tx.error ?? new Error('Falha na transação do IndexedDB.'));
        tx.onabort = () => reject(tx.error ?? new Error('Transação do IndexedDB cancelada.'));
      }),
  );
}

function idbLer(): Promise<{ state: unknown; salvoEm: number }> {
  return transacao('readonly', (store) => {
    const a = store.get(DB_STATE);
    const b = store.get(DB_SAVED_AT);
    return () => ({ state: a.result as unknown, salvoEm: ehNum(b.result) ? b.result : 0 });
  });
}

function idbGravar(s: AppState, salvoEm: number): Promise<void> {
  return transacao('readwrite', (store) => {
    store.put(s, DB_STATE);
    store.put(salvoEm, DB_SAVED_AT);
    return () => undefined;
  });
}

function idbLimpar(): Promise<void> {
  return transacao('readwrite', (store) => {
    store.clear();
    return () => undefined;
  });
}

/* ------------------------------------------------------------------ */
/* Memória, assinantes e gravação                                      */
/* ------------------------------------------------------------------ */

let state: AppState | null = null;
let modoSeed = false;
let sujo = false;
let timer: ReturnType<typeof setTimeout> | undefined;
let fila: Promise<void> = Promise.resolve();
let ouvintesDePagina = false;
const assinantes = new Set<() => void>();

function avisarAssinantes(): void {
  for (const fn of [...assinantes]) {
    try {
      fn();
    } catch (e) {
      aviso('Um assinante do estado falhou.', e);
    }
  }
}

function agendarGravacao(): void {
  sujo = true;
  if (timer !== undefined) clearTimeout(timer);
  timer = setTimeout(() => {
    timer = undefined;
    void flush();
  }, DEBOUNCE_MS);
}

/** Grava agora o que estiver pendente. A promessa termina quando o IndexedDB confirmar (ou falhar, com aviso). */
export function flush(): Promise<void> {
  if (timer !== undefined) {
    clearTimeout(timer);
    timer = undefined;
  }
  if (sujo && state) {
    sujo = false;
    const foto = state;
    const salvoEm = Date.now();
    gravarEspelho(foto, salvoEm);
    if (!modoSeed) {
      fila = fila
        .then(() => idbGravar(foto, salvoEm))
        .catch((e: unknown) => aviso('Não foi possível gravar no IndexedDB.', e));
    }
  }
  return fila;
}

function ligarOuvintesDePagina(): void {
  if (ouvintesDePagina) return;
  ouvintesDePagina = true;
  try {
    if (typeof document !== 'undefined' && typeof document.addEventListener === 'function') {
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') void flush();
      });
    }
    if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
      window.addEventListener('pagehide', () => {
        void flush();
      });
    }
  } catch (e) {
    aviso('Não foi possível acompanhar o fechamento do app.', e);
  }
}

function pedirPersistencia(): void {
  try {
    if (typeof navigator === 'undefined') return;
    const p = navigator.storage?.persist?.();
    if (p && typeof p.catch === 'function') p.catch(() => undefined);
  } catch {
    /* sem suporte */
  }
}

function lerEspelho(): { state: unknown; salvoEm: number } | undefined {
  const txt = lerChave(STATE_KEY);
  if (txt === null || txt === '') return undefined;
  try {
    const salvoEm = Number(lerChave(SAVED_AT_KEY) ?? '0');
    return { state: JSON.parse(txt) as unknown, salvoEm: Number.isFinite(salvoEm) ? salvoEm : 0 };
  } catch (e) {
    aviso('O espelho do estado está corrompido.', e);
    return undefined;
  }
}

/**
 * Lê o estado do disco (ou cria o inicial). Chamar uma vez, antes do primeiro render. Nunca rejeita.
 * Também pede armazenamento persistente ao navegador e liga a gravação imediata ao esconder ou fechar o app.
 */
export async function loadState(): Promise<void> {
  modoSeed = lerChave(SEED_KEY) === '1';
  const doEspelho = lerEspelho();
  let escolhido: unknown;
  let regravar = false;

  if (modoSeed) {
    escolhido = doEspelho?.state;
  } else {
    let doBanco: { state: unknown; salvoEm: number } | undefined;
    try {
      const lido = await idbLer();
      if (ehObj(lido.state)) doBanco = lido;
    } catch (e) {
      aviso('Não foi possível ler o IndexedDB; usando o espelho.', e);
    }
    if (doBanco && (!doEspelho || !ehObj(doEspelho.state) || doBanco.salvoEm >= doEspelho.salvoEm)) {
      escolhido = doBanco.state;
    } else {
      escolhido = doEspelho?.state;
      regravar = true; // primeira vez, ou o espelho é mais novo que o banco
    }
  }

  state = normalizarEstado(escolhido);
  ligarOuvintesDePagina();
  pedirPersistencia();
  if (regravar) {
    sujo = true;
    await flush();
  }
  avisarAssinantes();
}

/** O estado atual. Trate como somente leitura: para mudar, use `update`. */
export function getState(): AppState {
  if (!state) state = initialState();
  return state;
}

/** Aplica a mudança sobre uma cópia (structuredClone), troca o estado, agenda a gravação e avisa os assinantes. */
export function update(fn: (draft: AppState) => void): void {
  const draft = structuredClone(getState());
  fn(draft);
  state = draft;
  agendarGravacao();
  avisarAssinantes();
}

/** Troca o estado inteiro (restauração de backup), agenda a gravação e avisa os assinantes. */
export function replaceState(next: AppState): void {
  state = next;
  agendarGravacao();
  avisarAssinantes();
}

/**
 * Apaga tudo: limpa o IndexedDB e o espelho e volta a memória ao estado inicial (auxiliar de `resetAll`,
 * em lib/backup.ts). Nunca rejeita.
 */
export async function apagarDisco(): Promise<void> {
  if (timer !== undefined) {
    clearTimeout(timer);
    timer = undefined;
  }
  sujo = false;
  await fila;
  try {
    const ls = espelho();
    ls?.removeItem(STATE_KEY);
    ls?.removeItem(SAVED_AT_KEY);
  } catch (e) {
    aviso('Não foi possível limpar o espelho.', e);
  }
  if (!modoSeed) {
    fila = idbLimpar().catch((e: unknown) => aviso('Não foi possível limpar o IndexedDB.', e));
    await fila;
  }
  state = initialState();
  avisarAssinantes();
}

/** Assina mudanças do estado. Devolve a função que cancela a assinatura. */
export function subscribe(fn: () => void): () => void {
  assinantes.add(fn);
  return () => {
    assinantes.delete(fn);
  };
}

function useSelecionado<T>(selector: (s: AppState) => T, igual: (a: T, b: T) => boolean): T {
  const [, redesenhar] = useReducer((n: number) => n + 1, 0);
  const seletor = useRef(selector);
  seletor.current = selector;
  const guardado = useRef<{ valor: T } | null>(null);

  const novo = selector(getState());
  const anterior = guardado.current;
  const valor = anterior && igual(anterior.valor, novo) ? anterior.valor : novo;
  guardado.current = { valor };

  useEffect(() => {
    const conferir = (): void => {
      const atual = seletor.current(getState());
      if (!guardado.current || !igual(guardado.current.valor, atual)) redesenhar(0);
    };
    conferir(); // o estado pode ter mudado entre o render e a assinatura
    return subscribe(conferir);
  }, []);

  return valor;
}

/**
 * Hook: o componente redesenha quando o valor selecionado muda (comparação por Object.is).
 * O seletor deve devolver um primitivo ou uma referência estável do estado (`s => s.runs`, `s => s.settings.som`).
 * Se ele monta um objeto ou array novo a cada chamada (`s => ({ a: s.x, b: s.y })`, `s => s.runs.filter(…)`),
 * use `useStoreShallow`, senão o componente redesenha a cada mudança do estado.
 */
export function useStore<T>(selector: (s: AppState) => T): T {
  return useSelecionado(selector, Object.is);
}

/** Comparação rasa: mesmas chaves (ou mesmo tamanho de array) com valores iguais por Object.is. */
export function igualRaso(a: unknown, b: unknown): boolean {
  if (Object.is(a, b)) return true;
  if (typeof a !== 'object' || typeof b !== 'object' || a === null || b === null) return false;
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) if (!Object.is(a[i], b[i])) return false;
    return true;
  }
  const oa = a as Obj;
  const ob = b as Obj;
  const chaves = Object.keys(oa);
  if (chaves.length !== Object.keys(ob).length) return false;
  for (const k of chaves) {
    if (!Object.prototype.hasOwnProperty.call(ob, k) || !Object.is(oa[k], ob[k])) return false;
  }
  return true;
}

/**
 * Como `useStore`, para seletores que devolvem um objeto ou array novo a cada chamada: compara de forma rasa
 * e devolve a mesma referência enquanto o conteúdo não muda.
 */
export function useStoreShallow<T>(selector: (s: AppState) => T): T {
  return useSelecionado(selector, igualRaso);
}

let ultimoUid = '';

/** Id novo: tempo em base 36 + aleatório, como no Prumo. */
export function uid(): string {
  let id = '';
  do {
    id = Date.now().toString(36) + Math.random().toString(36).slice(2, 8).padEnd(6, '0');
  } while (id === ultimoUid);
  ultimoUid = id;
  return id;
}
