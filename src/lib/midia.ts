/**
 * Fotos dos exercícios. Elas NÃO fazem parte do app publicado: chegam por um "pacote de fotos" (arquivo JSON) que o
 * usuário importa em Ajustes › Dados e ficam só no aparelho, em um IndexedDB próprio (banco `prumo-treino-midia`,
 * object store `fotos`, chave = id do exercício no catálogo). Não entram no backup nem no "apagar tudo".
 *
 * Formato do pacote:
 *   { "kind": "prumo-treino-fotos", "version": 1,
 *     "fotos": [{ "id": "<id do catálogo>", "mime": "image/jpeg", "data": "<base64>", "credito"?: "..." }] }
 *
 * Cada foto é gravada como bytes + tipo (o Safari tem histórico ruim com Blob dentro do IndexedDB); o Blob é
 * montado na leitura. Nenhuma função rejeita: sem IndexedDB, o app segue só com o boneco animado.
 */
import { useEffect, useReducer, useState } from 'preact/hooks';

export const PACOTE_FOTOS_KIND = 'prumo-treino-fotos';
export const PACOTE_FOTOS_VERSION = 1;

const DB_NAME = 'prumo-treino-midia';
const DB_STORE = 'fotos';
const DB_TIMEOUT_MS = 4000;
/** Tempo que um object URL sem uso fica guardado antes de ser revogado (evita recriar ao trocar de tela). */
const REVOGAR_APOS_MS = 8000;

export interface FotoPacote {
  id: string;
  mime: string;
  data: string;
  credito?: string;
}

interface FotoGravada {
  mime: string;
  bytes: ArrayBuffer;
  credito?: string;
}

/* ---------- banco ---------- */

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

/* ---------- índice em memória e sinal de mudança ---------- */

let ids: Set<string> = new Set();
let carregado: Promise<void> | null = null;
let versao = 0;
const assinantes = new Set<() => void>();

function avisar(): void {
  versao += 1;
  for (const fn of [...assinantes]) {
    try {
      fn();
    } catch {
      /* um assinante com erro não derruba os outros */
    }
  }
}

/** Assina mudanças no conjunto de fotos (importar, apagar, índice carregado). Devolve a função que cancela. */
export function assinarMidia(fn: () => void): () => void {
  assinantes.add(fn);
  return () => {
    assinantes.delete(fn);
  };
}

/** Número que muda a cada alteração no conjunto de fotos. */
export function versaoMidia(): number {
  return versao;
}

/** Hook: redesenha o componente quando as fotos mudam. Devolve a versão atual. */
export function useMidiaVersao(): number {
  const [, redesenhar] = useReducer((n: number) => n + 1, 0);
  useEffect(() => {
    void carregarMidia();
    return assinarMidia(() => redesenhar(0));
  }, []);
  return versao;
}

/**
 * Lê do aparelho a lista de ids com foto. O app chama uma vez ao abrir; chamadas seguintes reaproveitam o
 * resultado. Nunca rejeita: sem IndexedDB, a lista fica vazia.
 */
export function carregarMidia(): Promise<void> {
  if (carregado) return carregado;
  carregado = transacao('readonly', (store) => {
    const req = store.getAllKeys();
    return () => req.result;
  }).then(
    (chaves) => {
      ids = new Set(chaves.filter((k): k is string => typeof k === 'string'));
      if (ids.size > 0) avisar();
    },
    () => {
      ids = new Set();
    },
  );
  return carregado;
}

/** Há foto para este id? Síncrono: vale depois de `carregarMidia()` (ou de uma importação). */
export function temFoto(id: string | undefined): boolean {
  return id !== undefined && ids.has(id);
}

/** Quantas fotos há no aparelho. */
export async function contarFotos(): Promise<number> {
  await carregarMidia();
  return ids.size;
}

/* ---------- importar e apagar ---------- */

const MIME_OK = /^image\/(jpeg|png|webp)$/;

function deBase64(texto: string): ArrayBuffer | undefined {
  try {
    const limpo = texto.replace(/^data:[^,]*,/, '').replace(/\s+/g, '');
    if (limpo === '') return undefined;
    const bin = atob(limpo);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i += 1) bytes[i] = bin.charCodeAt(i);
    return bytes.buffer;
  } catch {
    return undefined;
  }
}

const ehObjeto = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);

/**
 * Importa um pacote de fotos (texto JSON). Fotos com id já existente são trocadas; itens inválidos são ignorados.
 * `added` é o total de fotos gravadas. Nunca rejeita.
 */
export async function importarPacote(json: string): Promise<{ ok: boolean; added: number; error?: string }> {
  let bruto: unknown;
  try {
    bruto = JSON.parse(json);
  } catch {
    return { ok: false, added: 0, error: 'Este arquivo não é um pacote de fotos válido.' };
  }
  if (!ehObjeto(bruto) || bruto.kind !== PACOTE_FOTOS_KIND || !Array.isArray(bruto.fotos)) {
    return { ok: false, added: 0, error: 'Este arquivo não é um pacote de fotos do Prumo Treino.' };
  }
  if (bruto.version !== PACOTE_FOTOS_VERSION) {
    return { ok: false, added: 0, error: 'Este pacote de fotos é de uma versão que o app não conhece. Atualize o app.' };
  }
  const novas = new Map<string, FotoGravada>();
  for (const item of bruto.fotos as unknown[]) {
    if (!ehObjeto(item)) continue;
    const { id, mime, data, credito } = item;
    if (typeof id !== 'string' || id.trim() === '' || typeof mime !== 'string' || !MIME_OK.test(mime) || typeof data !== 'string') continue;
    const bytes = deBase64(data);
    if (!bytes) continue;
    const foto: FotoGravada = { mime, bytes };
    if (typeof credito === 'string' && credito.trim() !== '') foto.credito = credito.trim();
    novas.set(id.trim(), foto);
  }
  if (novas.size === 0) return { ok: false, added: 0, error: 'O pacote não tem nenhuma foto que dê para usar.' };
  await carregarMidia();
  try {
    await transacao('readwrite', (store) => {
      for (const [id, foto] of novas) store.put(foto, id);
      return () => undefined;
    });
  } catch {
    return { ok: false, added: 0, error: 'Não foi possível guardar as fotos neste aparelho. Pode faltar espaço.' };
  }
  for (const id of novas.keys()) {
    ids.add(id);
    descartarUrl(id); // a foto pode ter sido trocada
  }
  avisar();
  return { ok: true, added: novas.size };
}

/** Apaga todas as fotos do aparelho. Nunca rejeita. */
export async function apagarFotos(): Promise<void> {
  await carregarMidia();
  try {
    await transacao('readwrite', (store) => {
      store.clear();
      return () => undefined;
    });
  } catch {
    return;
  }
  ids = new Set();
  for (const id of [...urls.keys()]) descartarUrl(id);
  avisar();
}

/* ---------- object URLs em cache ---------- */

interface UrlEmCache {
  url: Promise<string | undefined>;
  usos: number;
  prazo?: ReturnType<typeof setTimeout>;
}

const urls = new Map<string, UrlEmCache>();

function revogar(url: string | undefined): void {
  if (url === undefined) return;
  try {
    URL.revokeObjectURL(url);
  } catch {
    /* nada a fazer */
  }
}

function descartarUrl(id: string): void {
  const item = urls.get(id);
  if (!item) return;
  if (item.prazo !== undefined) clearTimeout(item.prazo);
  urls.delete(id);
  void item.url.then(revogar);
}

async function criarUrl(id: string): Promise<string | undefined> {
  try {
    const foto = await transacao('readonly', (store) => {
      const req = store.get(id) as IDBRequest<FotoGravada | undefined>;
      return () => req.result;
    });
    if (!foto || typeof URL === 'undefined' || typeof URL.createObjectURL !== 'function') return undefined;
    return URL.createObjectURL(new Blob([foto.bytes], { type: foto.mime }));
  } catch {
    return undefined;
  }
}

/**
 * Pega o object URL da foto de um exercício (criado uma vez e compartilhado). Cada chamada precisa de um
 * `soltarFoto(id)` depois; sem uso, o URL é revogado. Devolve undefined se não houver foto.
 */
export async function reterFoto(id: string): Promise<string | undefined> {
  await carregarMidia();
  if (!ids.has(id)) return undefined;
  let item = urls.get(id);
  if (!item) {
    item = { url: criarUrl(id), usos: 0 };
    urls.set(id, item);
  }
  if (item.prazo !== undefined) {
    clearTimeout(item.prazo);
    item.prazo = undefined;
  }
  item.usos += 1;
  return item.url;
}

/** Devolve um uso pego com `reterFoto`. `agora` revoga na hora quando ninguém mais usa (padrão: depois de uns segundos). */
export function soltarFoto(id: string, agora = false): void {
  const item = urls.get(id);
  if (!item) return;
  item.usos = Math.max(0, item.usos - 1);
  if (item.usos > 0) return;
  if (item.prazo !== undefined) clearTimeout(item.prazo);
  if (agora) {
    descartarUrl(id);
    return;
  }
  item.prazo = setTimeout(() => {
    if (urls.get(id) === item && item.usos === 0) descartarUrl(id);
  }, REVOGAR_APOS_MS);
}

/**
 * Hook: o endereço (object URL) da foto do exercício, ou undefined enquanto carrega ou se não houver foto.
 * Acompanha importações e exclusões; o URL fica em cache e é revogado quando nenhum componente o usa mais.
 */
export function useFoto(id: string | undefined): string | undefined {
  const v = useMidiaVersao();
  const [atual, setAtual] = useState<{ id: string; url: string } | undefined>(undefined);
  useEffect(() => {
    if (id === undefined) return undefined;
    let vivo = true;
    let retido = false;
    void reterFoto(id).then((url) => {
      if (url === undefined) {
        if (vivo) setAtual(undefined);
        return;
      }
      if (!vivo) {
        soltarFoto(id);
        return;
      }
      retido = true;
      setAtual({ id, url });
    });
    return () => {
      vivo = false;
      if (retido) soltarFoto(id);
    };
  }, [id, v]);
  return atual !== undefined && atual.id === id && temFoto(id) ? atual.url : undefined;
}
