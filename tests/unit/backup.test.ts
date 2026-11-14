import 'fake-indexeddb/auto';
import { IDBFactory } from 'fake-indexeddb';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

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
/** Instâncias do store abertas no teste atual, para gravar o que ficou pendente antes do teste seguinte. */
let abertos: { flush: () => Promise<void> }[] = [];

function definir(nome: string, value: unknown): void {
  Object.defineProperty(globalThis, nome, { value, configurable: true, writable: true });
}

/** App aberto do zero: módulos novos, com o backup usando a mesma instância do store. */
async function abrir(): Promise<{
  store: typeof import('../../src/lib/store.ts');
  backup: typeof import('../../src/lib/backup.ts');
}> {
  vi.resetModules();
  const store = await import('../../src/lib/store.ts');
  const backup = await import('../../src/lib/backup.ts');
  await store.loadState();
  abertos.push(store);
  return { store, backup };
}

function contarNoBanco(): Promise<number> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open('prumo-treino', 1);
    req.onupgradeneeded = () => req.result.createObjectStore('kv');
    req.onerror = () => reject(req.error);
    req.onsuccess = () => {
      const db = req.result;
      const n = db.transaction('kv', 'readonly').objectStore('kv').count();
      n.onsuccess = () => {
        db.close();
        resolve(n.result);
      };
      n.onerror = () => reject(n.error);
    };
  });
}

beforeEach(() => {
  ls = new MemStorage();
  definir('localStorage', ls);
  definir('indexedDB', new IDBFactory());
});

afterEach(async () => {
  // Sem isto, o debounce de um teste gravaria no localStorage do teste seguinte.
  for (const s of abertos) await s.flush();
  abertos = [];
});

describe('backup: ida e volta', () => {
  it('exporta no formato do contrato e restaura em um app vazio', async () => {
    const a = await abrir();
    a.store.update((d) => {
      d.settings.nome = 'Filipe F.';
      d.settings.pesoMeta = 80;
      d.runs.push({ id: 'r1', data: '2026-11-18', tipo: 'Rodagem', km: 6.2, min: 38, pse: 5, fonte: 'treino', treinoId: 's01-qua' });
      d.lifts.push({ id: 'l1', data: '2026-11-16', ficha: 'B', treino: 'Inferiores', programa: 'hibrido', sets: { 'h-B-05': { '1': { reps: 10, carga: 40, feito: true } } } });
      d.weights.push({ id: 'w1', data: '2026-11-17', kg: 82.5 });
      d.mob.push({ id: 'm1', data: '2026-11-18', rotina: 'pos-corrida', nome: 'Pós-corrida', seg: 480, completo: true });
      d.marcas['s01-qua'] = 'feito';
    });
    const json = a.backup.exportBackup();
    const obj = JSON.parse(json) as { app: string; versao: number; exportadoEm: string; state: unknown };
    expect(obj.app).toBe('prumo-treino');
    expect(obj.versao).toBe(1);
    expect(Number.isNaN(Date.parse(obj.exportadoEm))).toBe(false);
    expect(obj.state).toEqual(a.store.getState());
    await a.store.flush();

    // Outro aparelho, vazio.
    ls.clear();
    definir('indexedDB', new IDBFactory());
    const b = await abrir();
    expect(b.store.getState().runs).toEqual([]);
    expect(b.backup.importBackup(json)).toEqual({ ok: true });
    expect(b.store.getState()).toEqual(a.store.getState());
    await b.store.flush();

    // E continua lá depois de reabrir.
    const c = await abrir();
    expect(c.store.getState()).toEqual(a.store.getState());
  });

  it('backup com campos faltando é completado com os valores iniciais', async () => {
    const { store, backup } = await abrir();
    const r = backup.importBackup(JSON.stringify({ app: 'prumo-treino', versao: 1, exportadoEm: 'x', state: { settings: { nome: 'Parcial' } } }));
    expect(r.ok).toBe(true);
    expect(store.getState().settings.nome).toBe('Parcial');
    expect(store.getState().settings.fcMax).toBe(192);
    expect(store.getState().runs).toEqual([]);
  });

  it('marcarBackupFeito registra a hora', async () => {
    const { store, backup } = await abrir();
    expect(store.getState().ultimoBackup).toBeUndefined();
    backup.marcarBackupFeito(1234);
    expect(store.getState().ultimoBackup).toBe(1234);
  });
});

describe('backup: arquivo inválido', () => {
  it('recusa com mensagem clara e não altera o estado', async () => {
    const { store, backup } = await abrir();
    store.update((d) => {
      d.settings.nome = 'Intacto';
    });
    const antes = store.getState();
    const casos: [string, RegExp][] = [
      ['isto não é json', /JSON válido/],
      ['', /JSON válido/],
      ['[1, 2, 3]', /não é um backup do Prumo Treino/],
      ['"texto"', /não é um backup do Prumo Treino/],
      ['{}', /não é um backup do Prumo Treino/],
      [JSON.stringify({ app: 'outro-app', versao: 1, state: {} }), /não é um backup do Prumo Treino/],
      [JSON.stringify({ app: 'prumo', versao: 2, settings: {}, data: {} }), /backup do Prumo\. Use/],
      [JSON.stringify({ kind: 'prumo-treino-historico', version: 1, runs: [] }), /Importar histórico/],
      [JSON.stringify({ app: 'prumo-treino', versao: 2, state: { settings: {} } }), /versão mais nova/],
      [JSON.stringify({ app: 'prumo-treino', versao: 1 }), /incompleto/],
      [JSON.stringify({ app: 'prumo-treino', versao: 1, state: { runs: [] } }), /incompleto/],
      [JSON.stringify({ app: 'prumo-treino', versao: 1, state: { settings: {}, runs: 'x' } }), /danificado/],
    ];
    for (const [json, esperado] of casos) {
      const r = backup.importBackup(json);
      expect(r.ok).toBe(false);
      expect(r.error ?? '').toMatch(esperado);
      expect(store.getState()).toBe(antes);
    }
    expect(backup.importBackup('{}').error).toBe('Este arquivo não é um backup do Prumo Treino.');
  });
});

describe('histórico de corridas', () => {
  const historico = (runs: unknown[], weights?: unknown[]): string =>
    JSON.stringify({ kind: 'prumo-treino-historico', version: 1, runs, ...(weights ? { weights } : {}) });

  it('importa com fonte historico e não duplica ao importar de novo', async () => {
    const { store, backup } = await abrir();
    const arquivo = historico(
      [
        { id: 'h1', data: '2025-06-01', tipo: 'Longão', km: 21.1, min: 128, fc: 158, fonte: 'garmin' },
        { id: 'h2', data: '2025-06-03', tipo: 'Rodagem', km: 8, min: 49.6 },
        { data: '2025-06-05', tipo: 'Desconhecido', km: 5, min: 30 },
      ],
      [{ id: 'p1', data: '2025-06-01', kg: 84.2 }, { data: '2025-06-08', kg: 83.9, obs: 'em jejum' }],
    );
    const r1 = backup.importHistory(arquivo);
    expect(r1).toEqual({ ok: true, added: 3, pesos: 2 });
    const s = store.getState();
    expect(s.runs).toHaveLength(3);
    expect(s.runs.every((r) => r.fonte === 'historico')).toBe(true);
    expect(s.runs[0]).toEqual({ id: 'h1', data: '2025-06-01', tipo: 'Longão', km: 21.1, min: 128, fc: 158, fonte: 'historico' });
    expect(s.runs[2]?.tipo).toBe('Rodagem');
    expect(new Set(s.runs.map((r) => r.id)).size).toBe(3);
    expect(s.weights).toHaveLength(2);
    expect(s.weights[1]?.obs).toBe('em jejum');
    expect(typeof s.historicoEm).toBe('number');

    const r2 = backup.importHistory(arquivo);
    expect(r2).toEqual({ ok: true, added: 0, pesos: 0 });
    expect(store.getState().runs).toHaveLength(3);
    expect(store.getState().weights).toHaveLength(2);
  });

  it('duplicata é mesma data e mesma duração em minutos; peso, mesma data', async () => {
    const { store, backup } = await abrir();
    store.update((d) => {
      d.runs.push({ id: 'h1', data: '2025-06-01', tipo: 'Rodagem', km: 10, min: 60, fonte: 'manual' });
      d.weights.push({ id: 'w', data: '2025-06-01', kg: 84 });
    });
    const r = backup.importHistory(historico(
      [
        { id: 'a', data: '2025-06-01', km: 10.1, min: 60.3 }, // mesma data, 60 min: duplicata
        { id: 'h1', data: '2025-06-01', km: 5, min: 31 }, // mesma data, outra duração (e id repetido): entra com id novo
        { id: 'b', data: '2025-06-02', km: 10, min: 60 }, // outra data: entra
        { id: 'c', data: '2025-06-02', km: 10, min: 60 }, // repetida dentro do arquivo
        { id: 'd', data: '02/06/2025', km: 10, min: 55 }, // data inválida
        { id: 'e', data: '2025-06-04' }, // sem distância nem duração
        'lixo',
      ],
      [{ data: '2025-06-01', kg: 99 }, { data: '2025-06-02', kg: 83.5 }, { data: '2025-06-03', kg: 'x' }],
    ));
    expect(r).toEqual({ ok: true, added: 2, pesos: 1 });
    const s = store.getState();
    expect(s.runs).toHaveLength(3);
    expect(s.runs[0]?.fonte).toBe('manual');
    expect(new Set(s.runs.map((x) => x.id)).size).toBe(3);
    expect(s.runs.filter((x) => x.data === '2025-06-01').map((x) => x.min)).toEqual([60, 31]);
    expect(s.weights.map((w) => w.kg)).toEqual([84, 83.5]);
  });

  it('recusa arquivo que não é histórico', async () => {
    const { store, backup } = await abrir();
    const antes = store.getState();
    const ruim = backup.importHistory('{{{');
    expect(ruim.ok).toBe(false);
    expect(ruim.added).toBe(0);
    expect(ruim.error ?? '').toMatch(/JSON válido/);
    expect(backup.importHistory('{}').error).toBe('Este arquivo não é um histórico de corridas do Prumo Treino.');
    expect(backup.importHistory(backup.exportBackup()).error).toMatch(/Restaurar backup/);
    expect(backup.importHistory(JSON.stringify({ kind: 'prumo-treino-historico', version: 1 })).error).toMatch(/incompleto/);
    expect(backup.importHistory(JSON.stringify({ kind: 'prumo-treino-historico', version: 2, runs: [] })).error).toMatch(/formato mais novo/);
    expect(store.getState()).toBe(antes);
  });
});

describe('resetAll', () => {
  it('volta ao estado inicial e limpa o IndexedDB e o espelho', async () => {
    const a = await abrir();
    a.store.update((d) => {
      d.settings.nome = 'Vai sumir';
      d.weights.push({ id: 'w', data: '2026-11-17', kg: 82 });
    });
    await a.store.flush();
    expect(await contarNoBanco()).toBeGreaterThan(0);
    expect(ls.getItem('prumo-treino:state')).toContain('Vai sumir');

    let avisos = 0;
    a.store.subscribe(() => {
      avisos += 1;
    });
    await a.backup.resetAll();
    expect(avisos).toBe(1);
    expect(a.store.getState().settings.nome).toBe('Filipe');
    expect(a.store.getState().weights).toEqual([]);
    expect(await contarNoBanco()).toBe(0);
    expect(ls.getItem('prumo-treino:state')).toBeNull();

    vi.resetModules();
    const depois = await import('../../src/lib/store.ts');
    await depois.loadState();
    expect(depois.getState().settings.nome).toBe('Filipe');
    expect(depois.getState().weights).toEqual([]);
  });

  it('uma gravação pendente não ressuscita os dados apagados', async () => {
    const a = await abrir();
    a.store.update((d) => {
      d.settings.nome = 'Pendente';
    });
    await a.backup.resetAll(); // sem flush antes
    await new Promise((r) => setTimeout(r, 400));
    await a.store.flush();
    expect(ls.getItem('prumo-treino:state')).toBeNull();
    expect(await contarNoBanco()).toBe(0);
  });
});
