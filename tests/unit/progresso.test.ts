import 'fake-indexeddb/auto';
import { IDBFactory } from 'fake-indexeddb';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { hoje, inicioSemana } from '../../src/lib/dates.ts';
import {
  mapaDeTreinos, mobPorSemana, pesoComMedia, resumoParaTreinador, salvarPeso, sequenciaDeSemanas,
} from '../../src/lib/progresso.ts';
import { STATE_KEY, flush, getState, initialState, replaceState } from '../../src/lib/store.ts';
import type { AppState, Lift, MobilityLog, RunLog, WeightLog } from '../../src/types.ts';

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
const novoId = (p: string): string => `${p}${++seq}`;

function corrida(data: string, over: Partial<RunLog> = {}): RunLog {
  return { id: novoId('r'), data, tipo: 'Rodagem', fonte: 'manual', ...over };
}
function lift(data: string, ficha = 'A', over: Partial<Lift> = {}): Lift {
  return { id: novoId('l'), data, ficha, treino: '', programa: 'hibrido', ...over };
}
function mob(data: string, seg: number, nome = 'Alongamento pós-corrida'): MobilityLog {
  return { id: novoId('m'), data, rotina: 'pos-corrida', nome, seg, completo: true };
}
function peso(data: string, kg: number): WeightLog {
  return { id: novoId('w'), data, kg };
}
function estado(over: Partial<AppState> = {}): AppState {
  return { ...initialState(), ...over };
}

/* ---------------- mapa e sequência ---------------- */

describe('mapaDeTreinos', () => {
  it('monta [semana][dia], de segunda a domingo, virando o ano', () => {
    const s = estado({
      runs: [corrida('2026-12-27'), corrida('2027-01-01')],
      lifts: [lift('2026-12-28'), lift('2027-01-01'), lift('2027-01-02', 'B', { emAndamento: true })],
      mob: [mob('2027-01-03', 300)],
    });
    const m = mapaDeTreinos(s, 2, '2027-01-01');
    expect(m).toHaveLength(2);
    expect(m.every((sem) => sem.length === 7)).toBe(true);
    expect(m[0]?.[0]?.data).toBe('2026-12-21');
    expect(m[0]?.[6]).toEqual({ data: '2026-12-27', corrida: true, musc: false, mob: false });
    expect(m[1]?.[0]).toEqual({ data: '2026-12-28', corrida: false, musc: true, mob: false });
    expect(m[1]?.[4]).toEqual({ data: '2027-01-01', corrida: true, musc: true, mob: false });
    expect(m[1]?.[5]).toEqual({ data: '2027-01-02', corrida: false, musc: false, mob: false });
    expect(m[1]?.[6]).toEqual({ data: '2027-01-03', corrida: false, musc: false, mob: true });
  });

  it('treino do plano marcado como feito sem registro conta como corrida', () => {
    const m = mapaDeTreinos(estado({ marcas: { 'c-2026-11-13': 'feito', 'c-2026-11-15': 'pulado' } }), 1, '2026-11-14');
    expect(m[0]?.[4]).toEqual({ data: '2026-11-13', corrida: true, musc: false, mob: false });
    expect(m[0]?.[6]?.corrida).toBe(false);
  });

  it('estado vazio: tudo falso; sem "ate", termina na semana de hoje', () => {
    const m = mapaDeTreinos(estado(), 12);
    expect(m).toHaveLength(12);
    expect(m[11]?.[0]?.data).toBe(inicioSemana(hoje()));
    expect(m.flat().some((d) => d.corrida || d.musc || d.mob)).toBe(false);
    expect(mapaDeTreinos(estado(), 0, '2026-11-14')).toEqual([]);
  });
});

describe('sequenciaDeSemanas', () => {
  /** Três treinos (duas corridas e uma musculação) na semana que começa em `seg`. */
  const semanaCheia = (seg: string): { runs: RunLog[]; lifts: Lift[] } => {
    const dia = (n: number): string => {
      const d = new Date(Number(seg.slice(0, 4)), Number(seg.slice(5, 7)) - 1, Number(seg.slice(8, 10)) + n);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    };
    return { runs: [corrida(dia(2)), corrida(dia(6))], lifts: [lift(dia(0))] };
  };
  const juntar = (...segs: string[]): AppState => {
    const partes = segs.map(semanaCheia);
    return estado({ runs: partes.flatMap((p) => p.runs), lifts: partes.flatMap((p) => p.lifts) });
  };

  it('estado vazio: zero', () => {
    expect(sequenciaDeSemanas(estado(), 3, '2026-11-14')).toBe(0);
    expect(sequenciaDeSemanas(estado())).toBe(0);
  });

  it('conta as semanas seguidas terminando na atual', () => {
    expect(sequenciaDeSemanas(juntar('2026-11-09', '2026-11-16', '2026-11-23'), 3, '2026-11-29')).toBe(3);
  });

  it('semana atual ainda abaixo do mínimo não quebra a sequência', () => {
    const s = juntar('2026-11-09', '2026-11-16');
    s.runs.push(corrida('2026-11-23'));
    expect(sequenciaDeSemanas(s, 3, '2026-11-25')).toBe(2);
  });

  it('duas semanas fracas seguidas zeram', () => {
    expect(sequenciaDeSemanas(juntar('2026-11-09', '2026-11-16'), 3, '2026-12-02')).toBe(0);
  });

  it('um buraco no meio interrompe a contagem', () => {
    expect(sequenciaDeSemanas(juntar('2026-11-02', '2026-11-16', '2026-11-23'), 3, '2026-11-25')).toBe(2);
  });

  it('atravessa a virada do ano', () => {
    const s = juntar('2026-12-14', '2026-12-21', '2026-12-28', '2027-01-04');
    expect(sequenciaDeSemanas(s, 3, '2027-01-10')).toBe(4);
    expect(sequenciaDeSemanas(s, 3, '2027-01-03')).toBe(3);
    expect(sequenciaDeSemanas(s, 3, '2027-01-01')).toBe(3);   // 1º de janeiro cai na semana de 28/12, que conta inteira
  });

  it('respeita o mínimo pedido e ignora musculação não concluída', () => {
    const s = juntar('2026-11-09', '2026-11-16');
    expect(sequenciaDeSemanas(s, 4, '2026-11-22')).toBe(0);
    expect(sequenciaDeSemanas(s, 2, '2026-11-22')).toBe(2);
    s.lifts.push(lift('2026-11-17', 'B', { emAndamento: true }));
    expect(sequenciaDeSemanas(s, 4, '2026-11-22')).toBe(0);
    s.lifts.push(lift('2026-11-18', 'B'));
    expect(sequenciaDeSemanas(s, 4, '2026-11-22')).toBe(1);
  });

  it('treino do plano marcado como feito conta', () => {
    const s = estado({ marcas: { 'c-2026-11-18': 'feito', 'c-2026-11-20': 'feito', 'c-2026-11-22': 'feito' } });
    expect(sequenciaDeSemanas(s, 3, '2026-11-22')).toBe(1);
  });
});

/* ---------------- peso ---------------- */

describe('pesoComMedia', () => {
  it('lista vazia', () => {
    expect(pesoComMedia([])).toEqual([]);
  });

  it('ordena por data e calcula a média móvel dos últimos 7 registros', () => {
    const w = [
      peso('2027-01-02', 80), peso('2026-12-26', 84), peso('2026-12-27', 83), peso('2026-12-28', 82),
      peso('2026-12-29', 82), peso('2026-12-30', 81), peso('2026-12-31', 81), peso('2027-01-01', 80.5),
    ];
    const r = pesoComMedia(w);
    expect(r.map((x) => x.data)).toEqual([
      '2026-12-26', '2026-12-27', '2026-12-28', '2026-12-29', '2026-12-30', '2026-12-31', '2027-01-01', '2027-01-02',
    ]);
    expect(r[0]).toEqual({ data: '2026-12-26', kg: 84, media: 84 });
    expect(r[1]?.media).toBe(83.5);
    expect(r[2]?.media).toBe(83);
    expect(r[6]?.media).toBeCloseTo((84 + 83 + 82 + 82 + 81 + 81 + 80.5) / 7, 2);
    expect(r[7]?.media).toBeCloseTo((83 + 82 + 82 + 81 + 81 + 80.5 + 80) / 7, 2);
    expect(w[0]?.data).toBe('2027-01-02');   // não mexe na lista recebida
  });
});

describe('salvarPeso', () => {
  it('cria o registro', () => {
    salvarPeso('2026-11-14', 83.4, 'em jejum');
    const w = getState().weights;
    expect(w).toHaveLength(1);
    expect(w[0]).toMatchObject({ data: '2026-11-14', kg: 83.4, obs: 'em jejum' });
    expect(w[0]?.id).not.toBe('');
  });

  it('substitui o registro da mesma data e mantém os outros em ordem', () => {
    salvarPeso('2026-11-14', 83.4, 'em jejum');
    salvarPeso('2026-11-10', 84);
    const id = getState().weights.find((x) => x.data === '2026-11-14')?.id;
    salvarPeso('2026-11-14', 83.1);
    const w = getState().weights;
    expect(w.map((x) => [x.data, x.kg])).toEqual([['2026-11-10', 84], ['2026-11-14', 83.1]]);
    expect(w[1]?.id).toBe(id);
    expect(w[1]?.obs).toBeUndefined();
  });

  it('grava no disco', async () => {
    salvarPeso('2026-11-14', 83.4);
    await flush();
    const salvo = JSON.parse(ls.getItem(STATE_KEY) ?? '{}') as AppState;
    expect(salvo.weights[0]).toMatchObject({ data: '2026-11-14', kg: 83.4 });
  });
});

/* ---------------- mobilidade ---------------- */

describe('mobPorSemana', () => {
  it('soma os minutos por semana, com semanas zeradas e virada de ano', () => {
    const m = [mob('2026-12-27', 480), mob('2026-12-28', 300), mob('2027-01-03', 330), mob('2027-01-04', 600)];
    expect(mobPorSemana(m, 3, '2027-01-01')).toEqual([
      { semana: '2026-12-14', min: 0 },
      { semana: '2026-12-21', min: 8 },
      { semana: '2026-12-28', min: 11 },
    ]);
  });

  it('lista vazia; sem "ate", termina na semana de hoje', () => {
    const r = mobPorSemana([], 2);
    expect(r.map((x) => x.min)).toEqual([0, 0]);
    expect(r[1]?.semana).toBe(inicioSemana(hoje()));
  });
});

/* ---------------- resumo para o treinador ---------------- */

describe('resumoParaTreinador', () => {
  function cheio(): AppState {
    return estado({
      runs: [
        corrida('2026-11-20', { treinoId: 'c-2026-11-20', titulo: "Contínuo leve 25'", min: 25, local: 'esteira' }),
        corrida('2026-11-13', {
          treinoId: 'c-2026-11-13', titulo: "Fartlek 2M .79 25'", min: 26, km: 3.9, fc: 151, pse: 7, sensacao: 4,
          obs: 'Pernas pesadas no fim',
        }),
        corrida('2026-11-08', { titulo: 'Fora do período', min: 40, km: 6 }),
      ],
      marcas: { 'c-2026-11-13': 'feito', 'c-2026-11-20': 'feito', 'c-2026-11-15': 'pulado' },
      lifts: [
        lift('2026-11-09', 'B', {
          treino: 'Inferiores', min: 62, volume: 8450, intensidade: 4,
          prs: [{ exId: 'h-B-05', nome: 'Agachamento', e1rm: 101.3, carga: 80, reps: 8, anterior: 96, medida: 'e1rm' }],
        }),
        lift('2026-11-12', 'C', { treino: 'Peito, ombro e braço', emAndamento: true }),
        lift('2026-11-02', 'A', { treino: 'Costas e bíceps', min: 50 }),
      ],
      mob: [mob('2026-11-13', 480), mob('2026-11-20', 480), mob('2026-11-21', 360, 'Educativos'), mob('2026-11-01', 999)],
      weights: [peso('2026-11-21', 82.6), peso('2026-11-10', 83.4), peso('2026-11-15', 83), peso('2026-11-01', 85)],
    });
  }

  it('monta o texto das duas últimas semanas', () => {
    const t = resumoParaTreinador(cheio(), 14, '2026-11-22');
    expect(t.split('\n')).toEqual([
      'Resumo de treino de Filipe · seg 9 nov a dom 22 nov (14 dias)',
      '',
      'CORRIDA: 2 corridas · 51 min · 3,9 km',
      "sex 13 nov · Fartlek 2M .79 25' · 26 min · 3,9 km · 6:40/km · FC média 151 · PSE 7 · sensação 4 de 5 · nota: Pernas pesadas no fim",
      "sex 20 nov · Contínuo leve 25' · 25 min · esteira",
      "dom 15 nov · Longo 35' (PSE) · pulou",
      "qua 18 nov · Regenerativo 25' · não fez",
      '',
      'MUSCULAÇÃO: 1 treino',
      'seg 9 nov · Ficha B: Inferiores · 1 h 02 · volume 8450 kg · intensidade 4 de 5 · recordes: Agachamento (80 kg × 8)',
      '',
      'MOBILIDADE: 3 rotinas · 22 min',
      'Alongamento pós-corrida · 2× · 16 min',
      'Educativos · 1× · 6 min',
      '',
      'PESO: 83,4 kg (ter 10 nov) → 82,6 kg (sáb 21 nov) · −0,8 kg',
      '',
      'Aderência: 3 de 11 treinos planejados',
    ]);
  });

  it('o padrão é 14 dias', () => {
    expect(resumoParaTreinador(cheio(), undefined, '2026-11-22')).toBe(resumoParaTreinador(cheio(), 14, '2026-11-22'));
  });

  it('período menor recorta os registros e a aderência', () => {
    const t = resumoParaTreinador(cheio(), 7, '2026-11-22');
    expect(t).toContain('seg 16 nov a dom 22 nov (7 dias)');
    expect(t).toContain('CORRIDA: 1 corrida · 25 min');
    expect(t).not.toContain('Fartlek');
    expect(t).not.toContain('pulou');
    expect(t).toContain('MUSCULAÇÃO: nenhum treino registrado');
    expect(t).toContain('PESO: 82,6 kg (sáb 21 nov)');
    expect(t.endsWith('Aderência: 1 de 6 treinos planejados')).toBe(true);
  });

  it('estado vazio', () => {
    const t = resumoParaTreinador(estado(), 14, '2026-11-22');
    expect(t).toContain('CORRIDA: nenhuma corrida registrada');
    expect(t).toContain("sex 13 nov · Fartlek 2M .79 25' · não fez");
    expect(t).toContain('MUSCULAÇÃO: nenhum treino registrado');
    expect(t).toContain('MOBILIDADE: nenhuma rotina registrada');
    expect(t).toContain('PESO: sem registro no período');
    expect(t.endsWith('Aderência: 0 de 11 treinos planejados')).toBe(true);
    // o treino do dia de referência ainda está pendente: não entra como perdido
    expect(t).not.toContain('dom 22 nov · Longo');
  });

  it('atravessa a virada do ano', () => {
    const s = estado({
      runs: [corrida('2026-12-27', { treinoId: 'c-2026-12-27', titulo: "Longo 50' (PSE)", min: 51, km: 7.5 }), corrida('2027-01-02', { min: 30, km: 5 })],
      weights: [peso('2026-12-30', 82), peso('2027-01-03', 82.5)],
    });
    const t = resumoParaTreinador(s, 14, '2027-01-05');
    expect(t).toContain('qua 23 dez a ter 5 jan (14 dias)');
    expect(t).toContain('CORRIDA: 2 corridas · 1 h 21 · 12,5 km');
    expect(t).toContain('sáb 2 jan · Rodagem · 30 min · 5 km · 6:00/km');
    expect(t).toContain("qua 23 dez · Contínuo .83 40' · não fez");
    expect(t).toContain('PESO: 82 kg (qua 30 dez) → 82,5 kg (dom 3 jan) · +0,5 kg');
    // corridas de 23, 25 e 27/12 e seis dias de musculação (24, 26, 28, 31/12, 2 e 4/1)
    expect(t.endsWith('Aderência: 1 de 9 treinos planejados')).toBe(true);
  });

  it('sem "ate", termina hoje, e não usa markdown', () => {
    const t = resumoParaTreinador(estado());
    expect(t.split('\n')[0]).toContain('(14 dias)');
    expect(t).not.toMatch(/[*#_`]/);
  });
});
