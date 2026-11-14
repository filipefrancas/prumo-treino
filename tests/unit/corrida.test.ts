import 'fake-indexeddb/auto';
import { IDBFactory } from 'fake-indexeddb';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ALL_RUNS, RUN_PLAN, runById } from '../../src/data/runs.ts';
import {
  apagarCorrida, corridasPorData, logDoTreino, marcarTreino, passos, planejadoPorSemana, porSemana, recordes, rpeDaPse,
  salvarCorrida, semanaDoPlano, situacaoDoTreino, tipoDaFamilia, totais, treinoDoDia, ultimasSemanas,
} from '../../src/lib/corrida.ts';
import { hoje, inicioSemana } from '../../src/lib/dates.ts';
import { STATE_KEY, flush, getState, initialState, replaceState } from '../../src/lib/store.ts';
import type { AppState, RunLog, RunWorkout } from '../../src/types.ts';

/* ---------------- apoio ---------------- */

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

let seq = 0;
function corrida(data: string, over: Partial<RunLog> = {}): RunLog {
  seq += 1;
  return { id: `r${seq}`, data, tipo: 'Rodagem', fonte: 'manual', ...over };
}

function estado(over: Partial<AppState> = {}): AppState {
  return { ...initialState(), ...over };
}

function treino(id: string): RunWorkout {
  const w = runById(id);
  if (!w) throw new Error(`treino ${id} não existe`);
  return w;
}

const FARTLEK = 'c-2026-11-13';
const LONGO = 'c-2026-11-15';

/* ---------------- plano ---------------- */

describe('treinoDoDia e semanaDoPlano', () => {
  it('acha o treino da data', () => {
    expect(treinoDoDia('2026-11-13')?.id).toBe(FARTLEK);
    expect(treinoDoDia('2026-11-14')).toBeUndefined();
    expect(treinoDoDia('2027-01-01')).toBeUndefined();
  });

  it('acha a semana do plano, de segunda a domingo', () => {
    expect(semanaDoPlano('2026-11-09')?.index).toBe(0);
    expect(semanaDoPlano('2026-11-15')?.index).toBe(0);
    expect(semanaDoPlano('2026-11-16')?.index).toBe(1);
    expect(semanaDoPlano('2026-12-27')?.index).toBe(RUN_PLAN.weeks.length - 1);
  });

  it('fora do plano não há semana', () => {
    expect(semanaDoPlano('2026-11-08')).toBeUndefined();
    expect(semanaDoPlano('2026-12-28')).toBeUndefined();
    expect(semanaDoPlano('2027-01-01')).toBeUndefined();
  });
});

describe('logDoTreino', () => {
  it('devolve o registro ligado ao treino', () => {
    const a = corrida('2026-11-13', { treinoId: FARTLEK });
    const s = estado({ runs: [corrida('2026-11-12'), a] });
    expect(logDoTreino(s, FARTLEK)).toBe(a);
    expect(logDoTreino(s, LONGO)).toBeUndefined();
    expect(logDoTreino(estado(), FARTLEK)).toBeUndefined();
  });

  it('com dois registros, vale o mais recente', () => {
    const a = corrida('2026-11-13', { treinoId: FARTLEK });
    const b = corrida('2026-11-14', { treinoId: FARTLEK });
    expect(logDoTreino(estado({ runs: [b, a] }), FARTLEK)).toBe(b);
  });
});

describe('situacaoDoTreino', () => {
  const w = treino(FARTLEK);

  it('sem registro nem marca, vale a data', () => {
    const s = estado();
    expect(situacaoDoTreino(s, w, '2026-11-13')).toBe('hoje');
    expect(situacaoDoTreino(s, w, '2026-11-14')).toBe('perdido');
    expect(situacaoDoTreino(s, w, '2026-11-12')).toBe('futuro');
    expect(situacaoDoTreino(s, w, '2027-01-01')).toBe('perdido');
  });

  it('feito por registro ou por marca', () => {
    expect(situacaoDoTreino(estado({ runs: [corrida('2026-11-14', { treinoId: FARTLEK })] }), w, '2026-11-20')).toBe('feito');
    expect(situacaoDoTreino(estado({ marcas: { [FARTLEK]: 'feito' } }), w, '2026-11-10')).toBe('feito');
  });

  it('pulado pela marca; registro vence a marca de pulado', () => {
    expect(situacaoDoTreino(estado({ marcas: { [FARTLEK]: 'pulado' } }), w, '2026-11-13')).toBe('pulado');
    const s = estado({ marcas: { [FARTLEK]: 'pulado' }, runs: [corrida('2026-11-13', { treinoId: FARTLEK })] });
    expect(situacaoDoTreino(s, w, '2026-11-13')).toBe('feito');
  });

  it('sem ref, usa hoje', () => {
    const esperado = w.date === hoje() ? 'hoje' : w.date < hoje() ? 'perdido' : 'futuro';
    expect(situacaoDoTreino(estado(), w)).toBe(esperado);
  });
});

describe('tipoDaFamilia', () => {
  it('mapeia as famílias para os tipos do Prumo', () => {
    expect(tipoDaFamilia('regenerativo')).toBe('Regenerativo');
    expect(tipoDaFamilia('continuo')).toBe('Rodagem');
    expect(tipoDaFamilia('longo')).toBe('Longão');
    expect(tipoDaFamilia('fartlek')).toBe('Intervalado');
    expect(tipoDaFamilia('intervalado')).toBe('Intervalado');
    expect(tipoDaFamilia('progressivo')).toBe('Tempo run');
    expect(tipoDaFamilia('regressivo')).toBe('Tempo run');
  });
});

describe('passos', () => {
  it('achata o treino com início e fim acumulados e a repetição', () => {
    const p = passos(treino(FARTLEK));
    expect(p).toHaveLength(13);
    expect(p[0]).toMatchObject({ kind: 'aquecimento', inicio: 0, fim: 300 });
    expect(p[0]?.rep).toBeUndefined();
    expect(p[1]).toMatchObject({ kind: 'ritmo', inicio: 300, fim: 330, rep: [1, 4] });
    expect(p[2]).toMatchObject({ kind: 'recuperacao', inicio: 330, fim: 390, rep: [1, 4] });
    expect(p[8]).toMatchObject({ inicio: 600, fim: 660, rep: [4, 4] });
    expect(p[9]?.rep).toBeUndefined();
    expect(p[12]).toMatchObject({ kind: 'desaquecimento', inicio: 1200, fim: 1500 });
  });

  it('em todos os treinos do plano a linha do tempo é contínua e fecha com os minutos', () => {
    for (const w of ALL_RUNS) {
      const p = passos(w);
      let t = 0;
      for (const x of p) {
        expect(x.inicio).toBe(t);
        expect(x.fim).toBe(t + x.sec);
        t = x.fim;
      }
      expect(Math.round(t / 60)).toBe(w.minutes);
    }
  });

  it('treino sem blocos não tem passos', () => {
    expect(passos({ ...treino(LONGO), blocks: [] })).toEqual([]);
  });
});

/* ---------------- gravação ---------------- */

describe('salvarCorrida', () => {
  it('cria o registro, preenche o tipo pela família, deriva o rpe e marca o treino', () => {
    const id = salvarCorrida({ data: '2026-11-13', tipo: 'Rodagem', fonte: 'treino', treinoId: FARTLEK, min: 26, km: 3.9, pse: 7 });
    const s = getState();
    expect(s.runs).toHaveLength(1);
    expect(s.runs[0]).toMatchObject({ id, data: '2026-11-13', tipo: 'Intervalado', treinoId: FARTLEK, min: 26, km: 3.9, pse: 7, rpe: 4 });
    expect(s.marcas[FARTLEK]).toBe('feito');
    expect(id).not.toBe('');
  });

  it('sem treino do plano, mantém o tipo informado e não cria marca', () => {
    salvarCorrida({ data: '2026-11-11', tipo: 'Prova', fonte: 'manual', km: 10, min: 55 });
    const s = getState();
    expect(s.runs[0]?.tipo).toBe('Prova');
    expect(s.runs[0]?.rpe).toBeUndefined();
    expect(s.marcas).toEqual({});
  });

  it('edita pelo id sem duplicar', () => {
    const id = salvarCorrida({ data: '2026-11-13', tipo: 'Rodagem', fonte: 'treino', treinoId: FARTLEK, min: 26, pse: 7 });
    const de_novo = salvarCorrida({ id, data: '2026-11-13', tipo: 'Rodagem', fonte: 'treino', treinoId: FARTLEK, min: 28, pse: 9 });
    expect(de_novo).toBe(id);
    const s = getState();
    expect(s.runs).toHaveLength(1);
    expect(s.runs[0]).toMatchObject({ id, min: 28, pse: 9, rpe: 5 });
  });

  it('ao trocar o treino de um registro, a marca do treino antigo sai', () => {
    const id = salvarCorrida({ data: '2026-11-13', tipo: 'Rodagem', fonte: 'treino', treinoId: FARTLEK });
    salvarCorrida({ id, data: '2026-11-15', tipo: 'Rodagem', fonte: 'treino', treinoId: LONGO });
    const s = getState();
    expect(s.marcas[FARTLEK]).toBeUndefined();
    expect(s.marcas[LONGO]).toBe('feito');
    expect(s.runs[0]?.tipo).toBe('Longão');
  });

  it('ids novos não se repetem', () => {
    const a = salvarCorrida({ data: '2026-11-11', tipo: 'Rodagem', fonte: 'manual' });
    const b = salvarCorrida({ data: '2026-11-11', tipo: 'Rodagem', fonte: 'manual' });
    expect(a).not.toBe(b);
    expect(getState().runs).toHaveLength(2);
  });

  it('o rpe vem da pse, entre 1 e 5', () => {
    expect(rpeDaPse(1)).toBe(1);
    expect(rpeDaPse(2)).toBe(1);
    expect(rpeDaPse(5)).toBe(3);
    expect(rpeDaPse(6)).toBe(3);
    expect(rpeDaPse(7)).toBe(4);
    expect(rpeDaPse(10)).toBe(5);
    expect(rpeDaPse(0)).toBe(1);
    expect(rpeDaPse(14)).toBe(5);
  });

  it('grava no disco', async () => {
    const id = salvarCorrida({ data: '2026-11-13', tipo: 'Rodagem', fonte: 'treino', treinoId: FARTLEK, min: 26 });
    await flush();
    const salvo = JSON.parse(ls.getItem(STATE_KEY) ?? '{}') as AppState;
    expect(salvo.runs[0]?.id).toBe(id);
    expect(salvo.marcas[FARTLEK]).toBe('feito');
  });
});

describe('apagarCorrida', () => {
  it('remove o registro e a marca do treino', () => {
    const id = salvarCorrida({ data: '2026-11-13', tipo: 'Rodagem', fonte: 'treino', treinoId: FARTLEK });
    const outro = salvarCorrida({ data: '2026-11-11', tipo: 'Rodagem', fonte: 'manual' });
    apagarCorrida(id);
    const s = getState();
    expect(s.runs.map((r) => r.id)).toEqual([outro]);
    expect(s.marcas[FARTLEK]).toBeUndefined();
    expect(situacaoDoTreino(s, treino(FARTLEK), '2026-11-14')).toBe('perdido');
  });

  it('mantém a marca enquanto houver outro registro do mesmo treino', () => {
    const a = salvarCorrida({ data: '2026-11-13', tipo: 'Rodagem', fonte: 'treino', treinoId: FARTLEK });
    salvarCorrida({ data: '2026-11-14', tipo: 'Rodagem', fonte: 'treino', treinoId: FARTLEK });
    apagarCorrida(a);
    expect(getState().marcas[FARTLEK]).toBe('feito');
  });

  it('id que não existe não muda nada', () => {
    salvarCorrida({ data: '2026-11-11', tipo: 'Rodagem', fonte: 'manual' });
    marcarTreino(LONGO, 'pulado');
    apagarCorrida('nao-existe');
    expect(getState().runs).toHaveLength(1);
    expect(getState().marcas[LONGO]).toBe('pulado');
  });
});

describe('marcarTreino', () => {
  it('marca, troca e limpa', () => {
    marcarTreino(LONGO, 'pulado');
    expect(getState().marcas[LONGO]).toBe('pulado');
    marcarTreino(LONGO, 'feito');
    expect(getState().marcas[LONGO]).toBe('feito');
    marcarTreino(LONGO, null);
    expect(LONGO in getState().marcas).toBe(false);
    marcarTreino(LONGO, null);
    expect(getState().marcas).toEqual({});
  });
});

/* ---------------- números ---------------- */

describe('ultimasSemanas e porSemana', () => {
  it('lista as segundas-feiras, da mais antiga para a mais nova', () => {
    expect(ultimasSemanas(3, '2026-11-14')).toEqual(['2026-10-26', '2026-11-02', '2026-11-09']);
    expect(ultimasSemanas(2, '2027-01-03')).toEqual(['2026-12-21', '2026-12-28']);
    expect(ultimasSemanas(0, '2026-11-14')).toEqual([]);
  });

  it('soma por semana, de segunda a domingo, com semanas zeradas', () => {
    const runs = [
      corrida('2026-11-01', { min: 99, km: 9 }),            // domingo da semana de 26/10: fora
      corrida('2026-11-02', { min: 30, km: 4.5 }),          // segunda
      corrida('2026-11-08', { min: 40.5, km: 6.25 }),       // domingo da mesma semana
      corrida('2026-11-19', { min: 25 }),                   // sem km
      corrida('2026-11-23', { min: 50, km: 8 }),            // semana seguinte à de "ate": fora
    ];
    expect(porSemana(runs, 3, '2026-11-22')).toEqual([
      { semana: '2026-11-02', min: 70.5, km: 10.75, n: 2 },
      { semana: '2026-11-09', min: 0, km: 0, n: 0 },
      { semana: '2026-11-16', min: 25, km: 0, n: 1 },
    ]);
  });

  it('vira o ano dentro da mesma semana', () => {
    const runs = [
      corrida('2026-12-27', { min: 50, km: 8 }),
      corrida('2026-12-28', { min: 30, km: 5 }),
      corrida('2027-01-03', { min: 20, km: 3 }),
      corrida('2027-01-04', { min: 10, km: 1 }),
    ];
    expect(porSemana(runs, 2, '2027-01-02')).toEqual([
      { semana: '2026-12-21', min: 50, km: 8, n: 1 },
      { semana: '2026-12-28', min: 50, km: 8, n: 2 },
    ]);
  });

  it('sem corridas, devolve as semanas zeradas; sem "ate", termina na semana de hoje', () => {
    const vazio = porSemana([], 4);
    expect(vazio).toHaveLength(4);
    expect(vazio[3]?.semana).toBe(inicioSemana(hoje()));
    expect(vazio.every((l) => l.min === 0 && l.km === 0 && l.n === 0)).toBe(true);
    expect(porSemana([], 0, '2026-11-14')).toEqual([]);
  });
});

describe('planejadoPorSemana', () => {
  it('soma os minutos e conta os treinos de cada semana do plano', () => {
    const p = planejadoPorSemana();
    expect(p).toHaveLength(RUN_PLAN.weeks.length);
    expect(p[0]).toEqual({ semana: '2026-11-09', min: 60, n: 2 });
    expect(p.reduce((s, x) => s + x.n, 0)).toBe(ALL_RUNS.length);
    expect(p.reduce((s, x) => s + x.min, 0)).toBe(ALL_RUNS.reduce((s, w) => s + w.minutes, 0));
    expect(p.every((x) => x.semana === inicioSemana(x.semana))).toBe(true);
  });
});

describe('totais', () => {
  const runs = [
    corrida('2026-10-30', { min: 30, km: 5 }),
    corrida('2026-11-13', { min: 25.5, km: 3.91 }),
    corrida('2026-11-15', { min: 35 }),
  ];

  it('soma tudo', () => {
    expect(totais(runs)).toEqual({ n: 3, km: 8.91, min: 90.5 });
  });

  it('com "desde", só dali em diante (inclusive)', () => {
    expect(totais(runs, '2026-11-13')).toEqual({ n: 2, km: 3.91, min: 60.5 });
    expect(totais(runs, '2027-01-01')).toEqual({ n: 0, km: 0, min: 0 });
  });

  it('lista vazia', () => {
    expect(totais([])).toEqual({ n: 0, km: 0, min: 0 });
  });
});

describe('recordes', () => {
  it('sem corridas não há recordes', () => {
    expect(recordes([])).toEqual({});
  });

  it('mais longa por km e melhores marcas pelo menor ritmo em cada faixa', () => {
    const longa = corrida('2025-06-01', { km: 21.1, min: 125 });
    const meia2 = corrida('2025-03-01', { km: 21.3, min: 130 });
    const dez = corrida('2025-05-01', { km: 10, min: 55 });
    const dezLento = corrida('2025-05-08', { km: 10.8, min: 65 });
    const cinco = corrida('2025-04-01', { km: 5.2, min: 26 });
    const cincoRapidoForaDaFaixa = corrida('2025-04-02', { km: 4.8, min: 20 });
    const cincoLento = corrida('2025-04-03', { km: 4.9, min: 30 });
    const semTempo = corrida('2025-04-04', { km: 5 });
    const r = recordes([dezLento, cincoLento, longa, cinco, meia2, dez, cincoRapidoForaDaFaixa, semTempo]);
    expect(r.maisLonga).toBe(meia2);
    expect(r.melhor21k).toBe(longa);
    expect(r.melhor10k).toBe(dez);
    expect(r.melhor5k).toBe(cinco);
  });

  it('respeita os limites das faixas', () => {
    const a = corrida('2025-01-01', { km: 5.5, min: 30 });
    const b = corrida('2025-01-02', { km: 5.6, min: 20 });
    const c = corrida('2025-01-03', { km: 9.8, min: 60 });
    const d = corrida('2025-01-04', { km: 21.8, min: 100 });
    const r = recordes([a, b, c, d]);
    expect(r.melhor5k).toBe(a);
    expect(r.melhor10k).toBe(c);
    expect(r.melhor21k).toBeUndefined();
    expect(r.maisLonga).toBe(d);
  });

  it('sem km em nenhum registro, a mais longa é a de mais minutos', () => {
    const a = corrida('2026-11-13', { min: 25 });
    const b = corrida('2026-11-15', { min: 35 });
    const r = recordes([a, b, corrida('2026-11-16')]);
    expect(r.maisLonga).toBe(b);
    expect(r.melhor5k).toBeUndefined();
  });
});

describe('corridasPorData', () => {
  it('conta registros e treinos marcados como feitos sem registro', () => {
    const s = estado({
      runs: [corrida('2026-11-13', { treinoId: FARTLEK }), corrida('2026-11-13'), corrida('2026-11-11')],
      marcas: { [FARTLEK]: 'feito', [LONGO]: 'feito', 'c-2026-11-18': 'pulado' },
    });
    const m = corridasPorData(s);
    expect(m.get('2026-11-13')).toBe(2);
    expect(m.get('2026-11-11')).toBe(1);
    expect(m.get('2026-11-15')).toBe(1);
    expect(m.has('2026-11-18')).toBe(false);
    expect(corridasPorData(estado()).size).toBe(0);
  });
});
