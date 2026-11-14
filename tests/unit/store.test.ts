import 'fake-indexeddb/auto';
import { IDBFactory } from 'fake-indexeddb';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ZONES } from '../../src/data/profile.ts';
import type { AppState } from '../../src/types.ts';

/** localStorage em memória (o ambiente de teste é o node). */
class MemStorage {
  private m = new Map<string, string>();
  get length(): number { return this.m.size; }
  key(i: number): string | null { return [...this.m.keys()][i] ?? null; }
  getItem(k: string): string | null { return this.m.get(k) ?? null; }
  setItem(k: string, v: string): void { this.m.set(k, String(v)); }
  removeItem(k: string): void { this.m.delete(k); }
  clear(): void { this.m.clear(); }
}

let ls = new MemStorage();

function definir(nome: string, value: unknown): void {
  Object.defineProperty(globalThis, nome, { value, configurable: true, writable: true });
}

/** Carrega o módulo do zero, como se o app tivesse sido aberto de novo. */
async function abrir(): Promise<typeof import('../../src/lib/store.ts')> {
  vi.resetModules();
  return import('../../src/lib/store.ts');
}

/** Lê direto do IndexedDB o que está na chave. */
function lerDoBanco(chave: string): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open('prumo-treino', 1);
    req.onupgradeneeded = () => req.result.createObjectStore('kv');
    req.onerror = () => reject(req.error);
    req.onsuccess = () => {
      const db = req.result;
      const get = db.transaction('kv', 'readonly').objectStore('kv').get(chave);
      get.onsuccess = () => {
        db.close();
        resolve(get.result as unknown);
      };
      get.onerror = () => reject(get.error);
    };
  });
}

beforeEach(() => {
  ls = new MemStorage();
  definir('localStorage', ls);
  definir('indexedDB', new IDBFactory());
});

describe('estado inicial', () => {
  it('segue a especificação', async () => {
    const store = await abrir();
    const s = store.initialState();
    expect(s.v).toBe(store.SCHEMA_VERSION);
    expect(s.settings.nome).toBe('Filipe');
    expect(s.settings.nascimento).toBeUndefined();
    expect(s.settings.alturaCm).toBeUndefined();
    expect(s.settings.pesoMeta).toBeUndefined();
    expect(s.settings.fcMax).toBe(192);
    expect(s.settings.zonas).toEqual(ZONES);
    expect(s.settings.zonas).not.toBe(ZONES);
    expect(s.settings.tema).toBe('auto');
    expect(s.settings.som).toBe(true);
    expect(s.settings.voz).toBe(true);
    expect(s.settings.telaLigada).toBe(true);
    expect(s.settings.descansoPadrao).toBe(90);
    expect(s.settings.alongamentoSeg).toBe(60);
    expect(s.settings.programa).toBe('hibrido');
    expect(s.settings.plano).toEqual({
      0: { tipo: 'corrida' },
      1: { tipo: 'musc', ficha: 'B' },
      2: { tipo: 'descanso' },
      3: { tipo: 'corrida' },
      4: { tipo: 'musc', ficha: 'C' },
      5: { tipo: 'corrida' },
      6: { tipo: 'musc', ficha: 'A' },
    });
    expect([s.runs, s.lifts, s.weights, s.mob]).toEqual([[], [], [], []]);
    expect(s.marcas).toEqual({});
  });

  it('loadState sem nada no disco cria o estado inicial e já grava', async () => {
    const store = await abrir();
    await store.loadState();
    expect(store.getState().settings.nome).toBe('Filipe');
    expect(store.getState().runs).toEqual([]);
    const noBanco = (await lerDoBanco('state')) as AppState;
    expect(noBanco.criadoEm).toBe(store.getState().criadoEm);
    expect(ls.getItem('prumo-treino:state')).not.toBeNull();
  });
});

describe('update, flush e recarregar', () => {
  it('update trabalha sobre uma cópia e avisa os assinantes', async () => {
    const store = await abrir();
    await store.loadState();
    const antes = store.getState();
    let avisos = 0;
    const cancelar = store.subscribe(() => {
      avisos += 1;
    });
    store.update((d) => {
      d.weights.push({ id: store.uid(), data: '2026-11-18', kg: 82.5 });
      d.settings.som = false;
    });
    expect(avisos).toBe(1);
    expect(store.getState()).not.toBe(antes);
    expect(antes.weights).toEqual([]);
    expect(antes.settings.som).toBe(true);
    expect(store.getState().weights[0]?.kg).toBe(82.5);
    cancelar();
    store.update((d) => {
      d.settings.som = true;
    });
    expect(avisos).toBe(1);
    await store.flush();
  });

  it('o que foi salvo volta depois de reabrir o app', async () => {
    const a = await abrir();
    await a.loadState();
    a.update((d) => {
      d.runs.push({ id: 'r1', data: '2026-11-18', tipo: 'Rodagem', km: 5, min: 31, fonte: 'manual' });
      d.marcas['s01-qua'] = 'feito';
      d.settings.pesoMeta = 80;
    });
    await a.flush();

    const b = await abrir();
    expect(b.getState().runs).toEqual([]); // ainda não carregou
    await b.loadState();
    expect(b.getState().runs).toEqual([{ id: 'r1', data: '2026-11-18', tipo: 'Rodagem', km: 5, min: 31, fonte: 'manual' }]);
    expect(b.getState().marcas).toEqual({ 's01-qua': 'feito' });
    expect(b.getState().settings.pesoMeta).toBe(80);
    expect(b.getState().criadoEm).toBe(a.getState().criadoEm);
  });

  it('grava sozinho depois do debounce', async () => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'Date'] });
    try {
      const store = await abrir();
      store.update((d) => {
        d.settings.nome = 'Debounce';
      });
      expect(ls.getItem('prumo-treino:state')).toBeNull();
      vi.advanceTimersByTime(200);
      expect(ls.getItem('prumo-treino:state')).toBeNull();
      vi.advanceTimersByTime(200);
      expect(ls.getItem('prumo-treino:state')).toContain('Debounce');
    } finally {
      vi.useRealTimers();
    }
  });

  it('se o IndexedDB estiver vazio, lê do espelho', async () => {
    const a = await abrir();
    await a.loadState();
    a.update((d) => {
      d.settings.nome = 'Do espelho';
    });
    await a.flush();
    definir('indexedDB', new IDBFactory());

    const b = await abrir();
    await b.loadState();
    expect(b.getState().settings.nome).toBe('Do espelho');
    expect(((await lerDoBanco('state')) as AppState).settings.nome).toBe('Do espelho'); // regravou no banco
  });

  it('se o espelho for mais novo que o banco, vale o espelho', async () => {
    const a = await abrir();
    await a.loadState();
    a.update((d) => {
      d.settings.nome = 'Antigo';
    });
    await a.flush();
    const novo = { ...a.getState(), settings: { ...a.getState().settings, nome: 'Novo' } };
    ls.setItem('prumo-treino:state', JSON.stringify(novo));
    ls.setItem('prumo-treino:salvoEm', String(Date.now() + 5000));

    const b = await abrir();
    await b.loadState();
    expect(b.getState().settings.nome).toBe('Novo');
  });

  it('sem IndexedDB e com localStorage quebrado, segue em memória sem lançar', async () => {
    const avisos = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    try {
      definir('indexedDB', undefined);
      definir('localStorage', {
        getItem: () => { throw new Error('bloqueado'); },
        setItem: () => { throw new Error('cheio'); },
        removeItem: () => { throw new Error('bloqueado'); },
      });
      const store = await abrir();
      await expect(store.loadState()).resolves.toBeUndefined();
      expect(() => store.update((d) => {
        d.settings.nome = 'Memória';
      })).not.toThrow();
      await expect(store.flush()).resolves.toBeUndefined();
      expect(store.getState().settings.nome).toBe('Memória');
      expect(avisos).toHaveBeenCalled();
    } finally {
      avisos.mockRestore();
    }
  });
});

describe('modo seed', () => {
  it('lê só do espelho, mesclado sobre o estado inicial, sem tocar no IndexedDB', async () => {
    // Um estado diferente já está no banco: ele deve ser ignorado.
    const a = await abrir();
    await a.loadState();
    a.update((d) => {
      d.settings.nome = 'Do banco';
    });
    await a.flush();

    ls.setItem('prumo-treino:seed', '1');
    ls.setItem('prumo-treino:state', JSON.stringify({
      settings: { nome: 'Exemplo', som: false },
      runs: [{ id: 'x', data: '2026-11-10', tipo: 'Longão', km: 12, min: 80, fonte: 'historico' }],
    }));
    const b = await abrir();
    await b.loadState();
    expect(b.getState().settings.nome).toBe('Exemplo');
    expect(b.getState().settings.som).toBe(false);
    expect(b.getState().settings.fcMax).toBe(192);
    expect(b.getState().runs).toHaveLength(1);
    expect(b.getState().lifts).toEqual([]);

    b.update((d) => {
      d.settings.nome = 'Alterado no seed';
    });
    await b.flush();
    expect(ls.getItem('prumo-treino:state')).toContain('Alterado no seed');
    expect(((await lerDoBanco('state')) as AppState).settings.nome).toBe('Do banco');
  });

  it('seed sem estado cai no estado inicial e não cria o banco', async () => {
    ls.setItem('prumo-treino:seed', '1');
    const store = await abrir();
    await store.loadState();
    expect(store.getState().settings.nome).toBe('Filipe');
    store.update((d) => {
      d.settings.nome = 'Seed';
    });
    await store.flush();
    const bancos = await indexedDB.databases();
    expect(bancos.map((b) => b.name)).not.toContain('prumo-treino');
  });
});

describe('mescla de estado incompleto', () => {
  it('completa o que falta e descarta o que tem tipo errado', async () => {
    const store = await abrir();
    const s = store.normalizarEstado({
      v: 0,
      criadoEm: 123,
      settings: {
        nome: 'Fulano',
        fcMax: '190',
        tema: 'roxo',
        voz: false,
        plano: { 1: { tipo: 'corrida' }, 2: { tipo: 'invalido' }, 6: { tipo: 'ambos', ficha: 'C' } },
        zonas: [{ id: 'leve', min: 120, max: 140 }],
        pesoMeta: 78.5,
      },
      runs: [{ data: '2026-11-01', tipo: 'Rodagem', min: 30, fonte: 'manual' }, 'lixo', { id: 'sem-data' }],
      weights: 'nada',
      marcas: { a: 'feito', b: 'talvez', c: 'pulado' },
      ultimoBackup: 999,
    });
    expect(s.v).toBe(store.SCHEMA_VERSION);
    expect(s.criadoEm).toBe(123);
    expect(s.settings.nome).toBe('Fulano');
    expect(s.settings.fcMax).toBe(192);
    expect(s.settings.tema).toBe('auto');
    expect(s.settings.voz).toBe(false);
    expect(s.settings.som).toBe(true);
    expect(s.settings.descansoPadrao).toBe(90);
    expect(s.settings.pesoMeta).toBe(78.5);
    expect(s.settings.plano[1]).toEqual({ tipo: 'corrida' });
    expect(s.settings.plano[2]).toEqual({ tipo: 'descanso' });
    expect(s.settings.plano[6]).toEqual({ tipo: 'ambos', ficha: 'C' });
    expect(s.settings.plano[0]).toEqual({ tipo: 'corrida' });
    expect(s.settings.zonas).toEqual([{ id: 'leve', label: 'Leve', min: 120, max: 140, feel: ZONES[0]?.feel }]);
    expect(s.runs).toHaveLength(1);
    expect(typeof s.runs[0]?.id).toBe('string');
    expect(s.runs[0]?.id).not.toBe('');
    expect(s.weights).toEqual([]);
    expect(s.lifts).toEqual([]);
    expect(s.mob).toEqual([]);
    expect(s.marcas).toEqual({ a: 'feito', c: 'pulado' });
    expect(s.ultimoBackup).toBe(999);
  });

  it('valor que não é objeto vira o estado inicial', async () => {
    const store = await abrir();
    for (const lixo of [null, undefined, 'texto', 42, []]) {
      expect(store.normalizarEstado(lixo).settings.nome).toBe('Filipe');
    }
  });

  it('estado antigo no disco é completado ao carregar', async () => {
    ls.setItem('prumo-treino:state', JSON.stringify({ v: 0, settings: { nome: 'Antigo' }, weights: [{ id: 'w', data: '2026-10-01', kg: 84 }] }));
    const store = await abrir();
    await store.loadState();
    expect(store.getState().settings.nome).toBe('Antigo');
    expect(store.getState().settings.zonas).toEqual(ZONES);
    expect(store.getState().weights).toEqual([{ id: 'w', data: '2026-10-01', kg: 84 }]);
    expect(store.getState().mob).toEqual([]);
  });
});

describe('auxiliares', () => {
  it('uid devolve ids diferentes', async () => {
    const store = await abrir();
    const ids = new Set(Array.from({ length: 500 }, () => store.uid()));
    expect(ids.size).toBe(500);
    for (const id of ids) expect(id).toMatch(/^[0-9a-z]{10,}$/);
  });

  it('igualRaso', async () => {
    const { igualRaso } = await abrir();
    const x = { n: 1 };
    expect(igualRaso({ a: 1, b: x }, { a: 1, b: x })).toBe(true);
    expect(igualRaso({ a: 1, b: { n: 1 } }, { a: 1, b: { n: 1 } })).toBe(false);
    expect(igualRaso([1, 2, x], [1, 2, x])).toBe(true);
    expect(igualRaso([1, 2], [1, 2, 3])).toBe(false);
    expect(igualRaso({ a: 1 }, { a: 1, b: undefined })).toBe(false);
    expect(igualRaso(null, {})).toBe(false);
    expect(igualRaso(3, 3)).toBe(true);
  });
});
