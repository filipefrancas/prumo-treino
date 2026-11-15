import 'fake-indexeddb/auto';
import { IDBFactory } from 'fake-indexeddb';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  GARMIN_KEY, FalhaGarmin, corridaDaAtividade, desconectar, juntarAtividades, lerConfig, sincronizar, type Atividade,
} from '../../src/lib/garmin.ts';
import { flush, getState, initialState, replaceState } from '../../src/lib/store.ts';
import type { AppState } from '../../src/types.ts';

class MemStorage {
  private m = new Map<string, string>();
  get length(): number { return this.m.size; }
  key(i: number): string | null { return [...this.m.keys()][i] ?? null; }
  getItem(k: string): string | null { return this.m.get(k) ?? null; }
  setItem(k: string, v: string): void { this.m.set(k, String(v)); }
  removeItem(k: string): void { this.m.delete(k); }
  clear(): void { this.m.clear(); }
}
function definir(nome: string, value: unknown): void {
  Object.defineProperty(globalThis, nome, { value, configurable: true, writable: true });
}

let ls = new MemStorage();
beforeEach(() => {
  ls = new MemStorage();
  definir('localStorage', ls);
  definir('indexedDB', new IDBFactory());
  replaceState(initialState());
});
afterEach(async () => {
  await flush();
});

/** A corrida de 15/11/2026 como o intervals.icu devolve (números do Garmin). */
const LONGO_15: Atividade = {
  id: 'i1001',
  start_date_local: '2026-11-15T07:12:00',
  type: 'Run',
  name: 'São Paulo Corrida',
  distance: 3190,
  moving_time: 1200,
  elapsed_time: 1260,
  total_elevation_gain: 21.4,
  average_heartrate: 153.4,
  max_heartrate: 178,
  average_cadence: 79.5,
};
const CAMINHADA: Atividade = { id: 'i1002', start_date_local: '2026-11-15T07:35:00', type: 'Walk', distance: 2340, moving_time: 1800 };

describe('corridaDaAtividade', () => {
  it('converte metros, segundos, FC e cadência', () => {
    const r = corridaDaAtividade(LONGO_15);
    expect(r).toMatchObject({ data: '2026-11-15', km: 3.19, min: 20, fc: 153, fcMax: 178, elev: 21, cad: 159, fonte: 'garmin', garminId: 'i1001', local: 'rua' });
  });
  it('ignora o que não é corrida ou não tem dados', () => {
    expect(corridaDaAtividade(CAMINHADA)).toBeUndefined();
    expect(corridaDaAtividade({ id: 3, type: 'Run', start_date_local: '2026-11-15T07:00:00' })).toBeUndefined();
    expect(corridaDaAtividade({ id: 4, type: 'Run' })).toBeUndefined();
  });
  it('esteira vira local esteira', () => {
    expect(corridaDaAtividade({ ...LONGO_15, type: 'VirtualRun' })?.local).toBe('esteira');
    expect(corridaDaAtividade({ ...LONGO_15, trainer: true })?.local).toBe('esteira');
  });
});

describe('juntarAtividades', () => {
  const novo = (): AppState => structuredClone(initialState());

  it('liga a corrida ao treino do plano do dia e marca como feito', () => {
    const s = novo();
    const r = juntarAtividades(s, [LONGO_15, CAMINHADA]);
    expect(r).toEqual({ novas: 1, completadas: 0 });
    expect(s.runs).toHaveLength(1);
    expect(s.runs[0]?.treinoId).toBe('c-2026-11-15');
    expect(s.runs[0]?.tipo).toBe('Longão');
    expect(s.marcas['c-2026-11-15']).toBe('feito');
  });

  it('não duplica na segunda busca', () => {
    const s = novo();
    juntarAtividades(s, [LONGO_15]);
    expect(juntarAtividades(s, [LONGO_15])).toEqual({ novas: 0, completadas: 0 });
    expect(s.runs).toHaveLength(1);
  });

  it('completa o registro manual do mesmo dia sem perder PSE e nota', () => {
    const s = novo();
    s.runs.push({ id: 'm1', data: '2026-11-15', tipo: 'Longão', fonte: 'treino', min: 21, pse: 7, obs: 'quente', treinoId: 'c-2026-11-15' });
    s.marcas['c-2026-11-15'] = 'feito';
    expect(juntarAtividades(s, [LONGO_15])).toEqual({ novas: 0, completadas: 1 });
    expect(s.runs).toHaveLength(1);
    expect(s.runs[0]).toMatchObject({ id: 'm1', min: 20, km: 3.19, fc: 153, pse: 7, obs: 'quente', garminId: 'i1001', treinoId: 'c-2026-11-15' });
  });

  it('segunda corrida no mesmo dia entra avulsa', () => {
    const s = novo();
    juntarAtividades(s, [LONGO_15, { ...LONGO_15, id: 'i2000', start_date_local: '2026-11-15T18:00:00', moving_time: 3000, distance: 8000 }]);
    expect(s.runs).toHaveLength(2);
    expect(s.runs.filter((r) => r.treinoId === 'c-2026-11-15')).toHaveLength(1);
  });
});

describe('sincronizar', () => {
  const resposta = (status: number, corpo: unknown): typeof fetch =>
    (async () => new Response(JSON.stringify(corpo), { status })) as typeof fetch;

  it('guarda a chave só depois de uma busca que deu certo e manda Basic API_KEY', async () => {
    let auth = '';
    let url = '';
    const f = (async (u: string, init?: RequestInit) => {
      url = u;
      auth = String((init?.headers as Record<string, string>).Authorization);
      return new Response(JSON.stringify([LONGO_15]), { status: 200 });
    }) as unknown as typeof fetch;
    const r = await sincronizar({ chaveNova: '  abc123chave456  ', f });
    expect(r.novas).toBe(1);
    expect(auth).toBe('Basic ' + btoa('API_KEY:abc123chave456'));
    expect(url).toMatch(/^https:\/\/intervals\.icu\/api\/v1\/athlete\/0\/activities\?oldest=\d{4}-\d{2}-\d{2}&newest=\d{4}-\d{2}-\d{2}$/);
    expect(lerConfig()?.chave).toBe('abc123chave456');
    expect(getState().runs).toHaveLength(1);
    // a chave não vai para o estado (nem para o backup)
    expect(JSON.stringify(getState())).not.toContain('abc123chave456');
  });

  it('chave recusada não é guardada', async () => {
    await expect(sincronizar({ chaveNova: 'errada-errada', f: resposta(401, {}) })).rejects.toBeInstanceOf(FalhaGarmin);
    expect(ls.getItem(GARMIN_KEY)).toBeNull();
  });

  it('sem rede vira erro de rede', async () => {
    const f = (async () => { throw new TypeError('Failed to fetch'); }) as typeof fetch;
    await expect(sincronizar({ chaveNova: 'abc123chave456', f })).rejects.toMatchObject({ tipo: 'rede' });
  });

  it('desconectar esquece a chave e mantém as corridas', async () => {
    await sincronizar({ chaveNova: 'abc123chave456', f: resposta(200, [LONGO_15]) });
    desconectar();
    expect(lerConfig()).toBeUndefined();
    expect(getState().runs).toHaveLength(1);
  });
});
