/**
 * Backup próprio do Prumo Treino, importação de histórico de corridas e "apagar tudo".
 * As mensagens de erro são textos prontos para mostrar na interface.
 */
import type { RunLog, RunTipo, WeightLog } from '../types.ts';
import { ehISO } from './dates.ts';
import { apagarDisco, getState, normalizarEstado, replaceState, uid, update } from './store.ts';

const APP = 'prumo-treino';
const VERSAO = 1;
const KIND_HISTORICO = 'prumo-treino-historico';

const ERRO_JSON = 'Não foi possível ler o arquivo. Ele não é um JSON válido.';
const ERRO_NAO_E_BACKUP = 'Este arquivo não é um backup do Prumo Treino.';
const ERRO_NAO_E_HISTORICO = 'Este arquivo não é um histórico de corridas do Prumo Treino.';

type Obj = Record<string, unknown>;
const ehObj = (v: unknown): v is Obj => typeof v === 'object' && v !== null && !Array.isArray(v);
const ehNum = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);

function ler(json: string): { ok: true; valor: unknown } | { ok: false } {
  try {
    return { ok: true, valor: JSON.parse(json) as unknown };
  } catch {
    return { ok: false };
  }
}

/** Backup completo em JSON: `{ app: 'prumo-treino', versao: 1, exportadoEm, state }`. Não altera o estado. */
export function exportBackup(): string {
  return JSON.stringify({ app: APP, versao: VERSAO, exportadoEm: new Date().toISOString(), state: getState() }, null, 2);
}

/** Marca no estado que um backup acabou de ser feito (chame depois que o arquivo foi salvo ou compartilhado). */
export function marcarBackupFeito(quando: number = Date.now()): void {
  update((s) => {
    s.ultimoBackup = quando;
  });
}

/** Restaura um backup do Prumo Treino, trocando todo o estado. Campos que faltam ficam com o valor inicial. */
export function importBackup(json: string): { ok: boolean; error?: string } {
  const lido = ler(json);
  if (!lido.ok) return { ok: false, error: ERRO_JSON };
  const b = lido.valor;
  if (!ehObj(b)) return { ok: false, error: ERRO_NAO_E_BACKUP };
  if (b.kind === KIND_HISTORICO) {
    return { ok: false, error: 'Este arquivo é um histórico de corridas. Use a opção "Importar histórico".' };
  }
  if (b.app === 'prumo') {
    return { ok: false, error: 'Este arquivo é um backup do Prumo. Use a opção "Importar backup do Prumo".' };
  }
  if (b.app !== APP) return { ok: false, error: ERRO_NAO_E_BACKUP };
  if (!ehNum(b.versao) || b.versao < 1) return { ok: false, error: ERRO_NAO_E_BACKUP };
  if (b.versao > VERSAO) {
    return { ok: false, error: 'Este backup foi feito por uma versão mais nova do app. Atualize o app e tente de novo.' };
  }
  const st = b.state;
  if (!ehObj(st) || !ehObj(st.settings)) {
    return { ok: false, error: 'O backup está incompleto: faltam os dados do app. Nada foi alterado.' };
  }
  for (const lista of ['runs', 'lifts', 'weights', 'mob'] as const) {
    if (st[lista] !== undefined && !Array.isArray(st[lista])) {
      return { ok: false, error: 'O backup está danificado: os registros não puderam ser lidos. Nada foi alterado.' };
    }
  }
  replaceState(normalizarEstado(st));
  return { ok: true };
}

const TIPOS: readonly RunTipo[] = ['Rodagem', 'Longão', 'Intervalado', 'Tempo run', 'Regenerativo', 'Prova'];

/** Chave de duplicidade de uma corrida: mesma data e mesma duração em minutos (arredondada). */
function chaveCorrida(data: string, min: number | undefined): string {
  return `${data}|${min === undefined ? '' : Math.round(min)}`;
}

function corridaDe(v: unknown): Omit<RunLog, 'id'> & { id?: string } | undefined {
  if (!ehObj(v) || !ehISO(v.data)) return undefined;
  const min = ehNum(v.min) && v.min > 0 ? v.min : undefined;
  const km = ehNum(v.km) && v.km > 0 ? v.km : undefined;
  if (min === undefined && km === undefined) return undefined;
  const r: Omit<RunLog, 'id'> & { id?: string } = {
    data: v.data,
    tipo: TIPOS.find((t) => t === v.tipo) ?? 'Rodagem',
    fonte: 'historico',
  };
  if (typeof v.id === 'string' && v.id !== '') r.id = v.id;
  if (km !== undefined) r.km = km;
  if (min !== undefined) r.min = min;
  if (ehNum(v.fc)) r.fc = v.fc;
  if (ehNum(v.elev)) r.elev = v.elev;
  if (ehNum(v.cad)) r.cad = v.cad;
  if (ehNum(v.rpe)) r.rpe = v.rpe;
  if (ehNum(v.pse)) r.pse = v.pse;
  if (ehNum(v.fcMax)) r.fcMax = v.fcMax;
  if (typeof v.obs === 'string' && v.obs !== '') r.obs = v.obs;
  if (typeof v.titulo === 'string' && v.titulo !== '') r.titulo = v.titulo;
  if (v.local === 'rua' || v.local === 'esteira') r.local = v.local;
  if (v.sensacao === 1 || v.sensacao === 2 || v.sensacao === 3 || v.sensacao === 4 || v.sensacao === 5) r.sensacao = v.sensacao;
  return r;
}

/**
 * Importa o histórico gerado fora do app:
 * `{ "kind": "prumo-treino-historico", "version": 1, "runs": RunLog[], "weights"?: WeightLog[] }`.
 * As corridas entram com fonte 'historico' e não duplicam (mesma data e mesma duração em minutos de uma corrida
 * que já existe, de qualquer fonte); os pesos não duplicam por data. Itens sem data válida são ignorados.
 * `added` conta as corridas novas; `pesos`, os pesos novos.
 */
export function importHistory(json: string): { ok: boolean; added: number; pesos?: number; error?: string } {
  const lido = ler(json);
  if (!lido.ok) return { ok: false, added: 0, error: ERRO_JSON };
  const h = lido.valor;
  if (!ehObj(h)) return { ok: false, added: 0, error: ERRO_NAO_E_HISTORICO };
  if (h.app === APP) {
    return { ok: false, added: 0, error: 'Este arquivo é um backup do Prumo Treino. Use a opção "Restaurar backup".' };
  }
  if (h.kind !== KIND_HISTORICO) return { ok: false, added: 0, error: ERRO_NAO_E_HISTORICO };
  if (ehNum(h.version) && h.version > 1) {
    return { ok: false, added: 0, error: 'Este histórico foi gerado em um formato mais novo. Atualize o app e tente de novo.' };
  }
  if (!Array.isArray(h.runs)) {
    return { ok: false, added: 0, error: 'O histórico está incompleto: falta a lista de corridas.' };
  }
  if (h.weights !== undefined && !Array.isArray(h.weights)) {
    return { ok: false, added: 0, error: 'O histórico está danificado: a lista de pesos não pôde ser lida.' };
  }

  const atual = getState();
  const chaves = new Set(atual.runs.map((r) => chaveCorrida(r.data, r.min)));
  const ids = new Set(atual.runs.map((r) => r.id));
  const novas: RunLog[] = [];
  for (const item of h.runs as unknown[]) {
    const r = corridaDe(item);
    if (!r) continue;
    const chave = chaveCorrida(r.data, r.min);
    if (chaves.has(chave)) continue;
    chaves.add(chave);
    let id = r.id;
    while (id === undefined || ids.has(id)) id = uid();
    ids.add(id);
    novas.push({ ...r, id });
  }

  const datasDePeso = new Set(atual.weights.map((w) => w.data));
  const idsDePeso = new Set(atual.weights.map((w) => w.id));
  const pesos: WeightLog[] = [];
  for (const item of (h.weights ?? []) as unknown[]) {
    if (!ehObj(item) || !ehISO(item.data) || !ehNum(item.kg) || item.kg <= 0) continue;
    if (datasDePeso.has(item.data)) continue;
    datasDePeso.add(item.data);
    let id = typeof item.id === 'string' && item.id !== '' ? item.id : undefined;
    while (id === undefined || idsDePeso.has(id)) id = uid();
    idsDePeso.add(id);
    const w: WeightLog = { id, data: item.data, kg: item.kg };
    if (typeof item.obs === 'string' && item.obs !== '') w.obs = item.obs;
    pesos.push(w);
  }

  update((s) => {
    s.runs.push(...novas);
    s.weights.push(...pesos);
    s.historicoEm = Date.now();
  });
  return { ok: true, added: novas.length, pesos: pesos.length };
}

/** Volta ao estado inicial e limpa o disco (IndexedDB e espelho). */
export async function resetAll(): Promise<void> {
  await apagarDisco();
}
