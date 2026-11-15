/**
 * Garmin, pelo intervals.icu: o relógio manda as atividades para o Garmin Connect, o Garmin Connect manda para o
 * intervals.icu (integração oficial e gratuita) e este app lê as corridas de lá com a chave de API pessoal.
 *
 * - A chave fica só neste aparelho, em localStorage["prumo-treino:garmin"], fora do AppState: assim não vai para
 *   o backup nem para a cópia do Prumo.
 * - O intervals.icu responde CORS para qualquer origem com o cabeçalho Authorization, então o app fala direto com
 *   ele, sem servidor no meio.
 * - Só corridas entram (Run, TrailRun, VirtualRun). Cada uma vira um RunLog com fonte 'garmin' e `garminId`.
 *   Se já houver corrida no mesmo dia com duração parecida (registro manual), ela é completada, não duplicada.
 *   Se no dia há treino do plano ainda sem registro, a corrida fica ligada a ele e o treino conta como feito.
 */
import { runOn } from '../data/runs.ts';
import type { AppState, ISODate, RunLog } from '../types.ts';
import { tipoDaFamilia } from './corrida.ts';
import { addDias, hoje } from './dates.ts';
import { getState, uid, update } from './store.ts';

export const GARMIN_KEY = 'prumo-treino:garmin';
const API = 'https://intervals.icu/api/v1';
/** Primeira busca: um ano para trás (o intervals.icu também só traz um ano do Garmin). */
const DIAS_PRIMEIRA = 365;
/** Buscas seguintes: alguns dias antes da última, para pegar atividades que sincronizaram atrasadas. */
const DIAS_FOLGA = 3;
/** Intervalo mínimo entre buscas automáticas. */
const INTERVALO_AUTO_MS = 10 * 60 * 1000;
const TIPOS_CORRIDA = new Set(['Run', 'TrailRun', 'VirtualRun', 'TreadmillRun']);
const TIPOS_CAMINHADA = new Set(['Walk', 'Hike']);

export interface GarminConfig {
  chave: string;
  /** Epoch (ms) da última busca que deu certo. */
  ultima?: number;
  /** Data local da última busca que deu certo. */
  ultimaData?: ISODate;
}

/* ------------------------------------------------------------------ */
/* Configuração no aparelho                                            */
/* ------------------------------------------------------------------ */

function ls(): Storage | undefined {
  try {
    return (globalThis as { localStorage?: Storage }).localStorage ?? undefined;
  } catch {
    return undefined;
  }
}

export function lerConfig(): GarminConfig | undefined {
  try {
    const txt = ls()?.getItem(GARMIN_KEY);
    if (!txt) return undefined;
    const v = JSON.parse(txt) as Partial<GarminConfig>;
    if (typeof v.chave !== 'string' || v.chave.trim() === '') return undefined;
    const c: GarminConfig = { chave: v.chave.trim() };
    if (typeof v.ultima === 'number') c.ultima = v.ultima;
    if (typeof v.ultimaData === 'string') c.ultimaData = v.ultimaData;
    return c;
  } catch {
    return undefined;
  }
}

function gravarConfig(c: GarminConfig | undefined): void {
  try {
    if (c) ls()?.setItem(GARMIN_KEY, JSON.stringify(c));
    else ls()?.removeItem(GARMIN_KEY);
  } catch {
    /* sem disco: segue em memória até fechar */
  }
  avisar();
}

const ouvintes = new Set<() => void>();
function avisar(): void {
  for (const fn of [...ouvintes]) fn();
}
/** Assina mudanças na configuração ou no estado da busca. */
export function assinarGarmin(fn: () => void): () => void {
  ouvintes.add(fn);
  return () => ouvintes.delete(fn);
}

/* ------------------------------------------------------------------ */
/* Conversão (função pura)                                             */
/* ------------------------------------------------------------------ */

/** Atividade como o intervals.icu devolve (só os campos usados). */
export interface Atividade {
  id: string | number;
  start_date_local?: string;
  type?: string;
  name?: string;
  distance?: number | null;
  moving_time?: number | null;
  elapsed_time?: number | null;
  total_elevation_gain?: number | null;
  average_heartrate?: number | null;
  max_heartrate?: number | null;
  average_cadence?: number | null;
  trainer?: boolean | null;
}

const num = (v: unknown): number | undefined => (typeof v === 'number' && Number.isFinite(v) && v > 0 ? v : undefined);
const r1 = (v: number): number => Math.round(v * 10) / 10;
const r2 = (v: number): number => Math.round(v * 100) / 100;

/** Atividade → corrida (sem id, sem ligação ao plano). Devolve undefined se não for corrida ou não tiver dados. */
export function corridaDaAtividade(a: Atividade): (Omit<RunLog, 'id'> & { garminId: string }) | undefined {
  if (!a || !TIPOS_CORRIDA.has(String(a.type)) || typeof a.start_date_local !== 'string') return undefined;
  const data = a.start_date_local.slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(data)) return undefined;
  const seg = num(a.moving_time) ?? num(a.elapsed_time);
  const metros = num(a.distance);
  if (seg === undefined && metros === undefined) return undefined;
  const r: Omit<RunLog, 'id'> & { garminId: string } = { data, tipo: 'Rodagem', fonte: 'garmin', garminId: String(a.id) };
  if (metros !== undefined) r.km = r2(metros / 1000);
  if (seg !== undefined) r.min = r1(seg / 60);
  const fc = num(a.average_heartrate), fcMax = num(a.max_heartrate), elev = num(a.total_elevation_gain);
  let cad = num(a.average_cadence);
  if (fc !== undefined) r.fc = Math.round(fc);
  if (fcMax !== undefined) r.fcMax = Math.round(fcMax);
  if (elev !== undefined) r.elev = Math.round(elev);
  // O Garmin grava a cadência da corrida em passadas por minuto (um pé); o app usa passos por minuto.
  if (cad !== undefined) {
    if (cad < 120) cad *= 2;
    r.cad = Math.round(cad);
  }
  if (typeof a.name === 'string' && a.name.trim() !== '') r.titulo = a.name.trim().slice(0, 80);
  r.local = a.type === 'VirtualRun' || a.type === 'TreadmillRun' || a.trainer === true ? 'esteira' : 'rua';
  return r;
}

/** Duas corridas do mesmo dia são a mesma se a duração bate (até 3 min ou 10%) ou, sem duração, a distância. */
function mesmaCorrida(a: RunLog, b: Omit<RunLog, 'id'>): boolean {
  if (a.data !== b.data) return false;
  if (a.min !== undefined && b.min !== undefined) return Math.abs(a.min - b.min) <= Math.max(3, b.min * 0.1);
  if (a.km !== undefined && b.km !== undefined) return Math.abs(a.km - b.km) <= Math.max(0.3, b.km * 0.1);
  return false;
}

const DO_RELOGIO = ['km', 'min', 'fc', 'fcMax', 'elev', 'cad'] as const;

/** Caminhada do relógio → resumo para pendurar na corrida do mesmo dia. */
export function caminhadaDaAtividade(a: Atividade): ({ data: ISODate } & NonNullable<RunLog['caminhada']>) | undefined {
  if (!a || !TIPOS_CAMINHADA.has(String(a.type)) || typeof a.start_date_local !== 'string') return undefined;
  const data = a.start_date_local.slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(data)) return undefined;
  const seg = num(a.moving_time) ?? num(a.elapsed_time);
  const metros = num(a.distance);
  if (seg === undefined && metros === undefined) return undefined;
  const c: { data: ISODate } & NonNullable<RunLog['caminhada']> = { data, garminId: String(a.id) };
  if (metros !== undefined) c.km = r2(metros / 1000);
  if (seg !== undefined) c.min = r1(seg / 60);
  const fc = num(a.average_heartrate);
  if (fc !== undefined) c.fc = Math.round(fc);
  return c;
}

/**
 * Junta as atividades ao estado (muda `draft`). Devolve quantas corridas entraram novas e quantas existentes
 * foram completadas com os números do relógio.
 */
export function juntarAtividades(draft: AppState, atividades: Atividade[]): { novas: number; completadas: number; caminhadas: number } {
  let novas = 0, completadas = 0, caminhadas = 0;
  const vistas = new Set(draft.runs.map((r) => r.garminId).filter((x): x is string => typeof x === 'string'));
  const lista = atividades
    .map(corridaDaAtividade)
    .filter((x): x is NonNullable<typeof x> => x !== undefined)
    .sort((a, b) => (a.data < b.data ? -1 : a.data > b.data ? 1 : 0));

  for (const nova of lista) {
    if (vistas.has(nova.garminId)) continue;
    vistas.add(nova.garminId);

    const existente = draft.runs.find((r) => r.garminId === undefined && mesmaCorrida(r, nova));
    if (existente) {
      // registro feito à mão: os números do relógio valem mais; nota, PSE e sensação do usuário ficam.
      for (const k of DO_RELOGIO) if (nova[k] !== undefined) existente[k] = nova[k];
      existente.garminId = nova.garminId;
      if (existente.local === undefined && nova.local) existente.local = nova.local;
      completadas += 1;
      continue;
    }

    const registro: RunLog = { ...nova, id: uid() };
    const treino = runOn(nova.data);
    const ocupado = treino ? draft.marcas[treino.id] !== undefined || draft.runs.some((r) => r.treinoId === treino.id) : true;
    if (treino && !ocupado) {
      registro.treinoId = treino.id;
      registro.tipo = tipoDaFamilia(treino.family);
      registro.titulo = treino.title;
      draft.marcas[treino.id] = 'feito';
    }
    draft.runs.push(registro);
    novas += 1;
  }

  // Caminhada no mesmo dia de uma corrida entra junto dela. Sem corrida no dia, fica de fora (e é tentada de
  // novo na próxima busca, caso a corrida ainda não tenha sincronizado).
  const comCaminhada = new Set(draft.runs.map((r) => r.caminhada?.garminId).filter((x): x is string => typeof x === 'string'));
  for (const a of atividades) {
    const c = caminhadaDaAtividade(a);
    if (!c || comCaminhada.has(c.garminId)) continue;
    const alvo = draft.runs.find((r) => r.data === c.data && r.caminhada === undefined && r.garminId !== undefined)
      ?? draft.runs.find((r) => r.data === c.data && r.caminhada === undefined);
    if (!alvo) continue;
    const { data: _d, ...resto } = c;
    alvo.caminhada = resto;
    comCaminhada.add(c.garminId);
    caminhadas += 1;
  }
  return { novas, completadas, caminhadas };
}

/* ------------------------------------------------------------------ */
/* Rede                                                                */
/* ------------------------------------------------------------------ */

export type ErroGarmin = 'chave' | 'rede' | 'servidor';

export class FalhaGarmin extends Error {
  constructor(public tipo: ErroGarmin, msg: string) {
    super(msg);
  }
}

export const MENSAGEM_ERRO: Record<ErroGarmin, string> = {
  chave: 'O intervals.icu recusou a chave. Confira se copiou a chave inteira, sem espaços.',
  rede: 'Sem conexão com o intervals.icu agora. Tento de novo quando você abrir o app com internet.',
  servidor: 'O intervals.icu não respondeu direito. Tento de novo mais tarde.',
};

function basic(chave: string): string {
  return 'Basic ' + btoa(`API_KEY:${chave}`);
}

/** Busca as atividades entre as datas (inclusive). */
export async function buscarAtividades(chave: string, de: ISODate, ate: ISODate, f: typeof fetch = fetch): Promise<Atividade[]> {
  let resp: Response;
  try {
    resp = await f(`${API}/athlete/0/activities?oldest=${de}&newest=${ate}`, {
      headers: { Authorization: basic(chave), Accept: 'application/json' },
      cache: 'no-store',
    });
  } catch {
    throw new FalhaGarmin('rede', MENSAGEM_ERRO.rede);
  }
  if (resp.status === 401 || resp.status === 403) throw new FalhaGarmin('chave', MENSAGEM_ERRO.chave);
  if (!resp.ok) throw new FalhaGarmin('servidor', MENSAGEM_ERRO.servidor);
  let corpo: unknown;
  try {
    corpo = await resp.json();
  } catch {
    throw new FalhaGarmin('servidor', MENSAGEM_ERRO.servidor);
  }
  return Array.isArray(corpo) ? (corpo as Atividade[]) : [];
}

/* ------------------------------------------------------------------ */
/* Sincronizar                                                         */
/* ------------------------------------------------------------------ */

export interface ResultadoSync { novas: number; completadas: number; caminhadas: number }

let emCurso: Promise<ResultadoSync> | null = null;
let ultimoErro: string | undefined;

export const buscando = (): boolean => emCurso !== null;
export const erroGarmin = (): string | undefined => ultimoErro;

/**
 * Busca as corridas novas e junta ao estado. Com `chaveNova`, testa e guarda a chave (só guarda se a busca der
 * certo). Rejeita com FalhaGarmin.
 */
export function sincronizar(opts: { chaveNova?: string; f?: typeof fetch } = {}): Promise<ResultadoSync> {
  if (emCurso) return emCurso;
  const atual = lerConfig();
  const chave = opts.chaveNova?.trim() || atual?.chave;
  if (!chave) return Promise.reject(new FalhaGarmin('chave', 'Falta a chave do intervals.icu.'));
  const dia = hoje();
  const nova = opts.chaveNova !== undefined && opts.chaveNova.trim() !== atual?.chave;
  const de = !nova && atual?.ultimaData ? addDias(atual.ultimaData, -DIAS_FOLGA) : addDias(dia, -DIAS_PRIMEIRA);

  emCurso = (async () => {
    try {
      const atividades = await buscarAtividades(chave, de, dia, opts.f);
      let res: ResultadoSync = { novas: 0, completadas: 0, caminhadas: 0 };
      const previa = structuredClone(getState());
      const teste = juntarAtividades(previa, atividades);
      if (teste.novas + teste.completadas + teste.caminhadas > 0) {
        update((d) => {
          res = juntarAtividades(d, atividades);
        });
      }
      ultimoErro = undefined;
      gravarConfig({ chave, ultima: Date.now(), ultimaData: dia });
      return res;
    } catch (e) {
      const falha = e instanceof FalhaGarmin ? e : new FalhaGarmin('servidor', MENSAGEM_ERRO.servidor);
      ultimoErro = falha.message;
      throw falha;
    } finally {
      emCurso = null;
      avisar();
    }
  })();
  avisar();
  return emCurso;
}

/** Esquece a chave neste aparelho. As corridas já trazidas ficam. */
export function desconectar(): void {
  ultimoErro = undefined;
  gravarConfig(undefined);
}

/**
 * Busca automática: ao abrir o app e sempre que ele volta para a frente, se houver chave e a última busca tiver
 * mais de 10 minutos. `aoTrazer` recebe o resultado quando entra algo.
 */
export function ligarSyncAutomatico(aoTrazer: (r: ResultadoSync) => void): void {
  const tentar = (): void => {
    const c = lerConfig();
    if (!c || emCurso) return;
    if (typeof document !== 'undefined' && document.visibilityState === 'hidden') return;
    if (typeof navigator !== 'undefined' && navigator.onLine === false) return;
    if (c.ultima !== undefined && Date.now() - c.ultima < INTERVALO_AUTO_MS) return;
    sincronizar()
      .then((r) => {
        if (r.novas + r.completadas + r.caminhadas > 0) aoTrazer(r);
      })
      .catch(() => {
        /* o erro fica em erroGarmin() e aparece em Ajustes */
      });
  };
  tentar();
  document.addEventListener('visibilitychange', tentar);
  window.addEventListener('online', tentar);
}
