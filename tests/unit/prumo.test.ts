import { describe, expect, it } from 'vitest';
import { fromPrumoBackup, toPrumoBackup } from '../../src/lib/prumo.ts';
import type { AppState, Lift, RunLog, WeightLog } from '../../src/types.ts';

function estado(over: Partial<AppState> = {}): AppState {
  return {
    v: 1, criadoEm: 0,
    settings: {
      nome: 'Filipe', tema: 'auto', som: true, voz: true, vibrar: true, telaLigada: true, descansoPadrao: 90, alongamentoSeg: 60,
      fcMax: 192, zonas: [], programa: 'hibrido', plano: {},
    },
    runs: [], lifts: [], weights: [], mob: [], marcas: {},
    ...over,
  };
}

const pesos: WeightLog[] = [
  { id: 'w1', data: '2026-11-10', kg: 82.4, obs: 'em jejum' },
  { id: 'w2', data: '2026-11-14', kg: 82.1 },
];
const corridas: RunLog[] = [
  { id: 'r1', data: '2026-11-11', tipo: 'Rodagem', km: 6.2, min: 40, fc: 148, pse: 7, sensacao: 4, local: 'rua', fonte: 'treino', treinoId: 't-01', titulo: 'Contínuo leve', fcMax: 171 },
  { id: 'r2', data: '2026-11-13', tipo: 'Intervalado', min: 35, pse: 8, fonte: 'treino', local: 'esteira' }, // sem km: não vai
  { id: 'r3', data: '2026-11-08', tipo: 'Longão', km: 12, min: 80, rpe: 2, pse: 9, elev: 110, cad: 168, obs: 'Ibira', fonte: 'garmin' },
  { id: 'r4', data: '2025-06-01', tipo: 'Prova', km: 21.1, min: 118, fonte: 'historico' },
];
const treinos: Lift[] = [
  {
    id: 'l1', data: '2026-11-12', ficha: 'C', treino: 'Peito, ombro e braço', programa: 'hibrido', inicio: '18:00', fim: '18:52',
    emAndamento: false, concluido: true, min: 52.3, volume: 6120.5, intensidade: 4, obs: 'bom', inicioMs: 1_763_000_000_000,
    trocas: { 'h-C-05': 'crucifixo-inverso' }, pulados: ['h-C-08'], obsEx: { 'h-C-03': 'subir na próxima' },
    sets: { 'h-C-03': { '1': { reps: 15, carga: 30, feito: true, t: '18:05' }, '3': { reps: 12, carga: 80, feito: true, t: '18:12' }, '4': { reps: 10, carga: 80, feito: false } } },
    prs: [{ exId: 'h-C-03', nome: 'Supino Reto Máquina', e1rm: 112, carga: 80, reps: 12, anterior: 106.7, medida: 'e1rm' }],
  },
  { id: 'l2', data: '2026-11-14', ficha: 'A', treino: 'Costas e bíceps', programa: 'hibrido', inicio: '09:00', emAndamento: true, concluido: false, sets: {} },
  { id: 'l3', data: '2026-11-09', ficha: 'B', treino: 'Inferiores', programa: 'hibrido', concluido: false, emAndamento: false }, // descartado
  { id: 'l4', data: '2026-11-05', ficha: 'B', treino: 'Inferiores', programa: 'hibrido', min: 60, cardio: 10, hora: '19:00' }, // registro manual antigo
];
const cheio = estado({ weights: pesos, runs: corridas, lifts: treinos });
const agora = new Date('2026-11-14T16:00:00.000Z');

interface Backup { app: string; versao: number; exportadoEm: string; settings: object; data: { weights: Record<string, unknown>[]; runs: Record<string, unknown>[]; lifts: Record<string, unknown>[] } }
const ler = (json: string): Backup => JSON.parse(json) as Backup;

describe('toPrumoBackup', () => {
  const b = ler(toPrumoBackup(cheio, agora));

  it('tem o envelope do Prumo', () => {
    expect(b).toMatchObject({ app: 'prumo', versao: 2, exportadoEm: '2026-11-14T16:00:00.000Z', settings: {} });
    expect(Object.keys(b)).toEqual(['app', 'versao', 'exportadoEm', 'settings', 'data']);
    expect(Object.keys(b.data)).toEqual(['weights', 'runs', 'lifts']);
  });

  it('pesos vão todos', () => {
    expect(b.data.weights).toEqual([{ id: 'w1', data: '2026-11-10', kg: 82.4, obs: 'em jejum' }, { id: 'w2', data: '2026-11-14', kg: 82.1 }]);
  });

  it('corridas: só as que têm km, só os campos do Prumo, rpe derivado de pse', () => {
    expect(b.data.runs).toEqual([
      { id: 'r1', data: '2026-11-11', tipo: 'Rodagem', km: 6.2, min: 40, fc: 148, rpe: 4, fonte: 'manual' },
      { id: 'r3', data: '2026-11-08', tipo: 'Longão', km: 12, min: 80, elev: 110, cad: 168, rpe: 2, obs: 'Ibira', fonte: 'garmin' },
      { id: 'r4', data: '2025-06-01', tipo: 'Prova', km: 21.1, min: 118, fonte: 'manual' },
    ]);
    for (const r of b.data.runs) for (const k of ['pse', 'sensacao', 'local', 'treinoId', 'titulo', 'fcMax']) expect(r).not.toHaveProperty(k);
  });

  it('rpe = clamp(round(pse / 2), 1, 5)', () => {
    const rpe = (pse: number) => ler(toPrumoBackup(estado({ runs: [{ id: 'x', data: '2026-11-01', tipo: 'Rodagem', km: 5, pse, fonte: 'manual' }] }), agora)).data.runs[0]?.rpe;
    expect([1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(rpe)).toEqual([1, 1, 2, 2, 3, 3, 4, 4, 5, 5]);
    expect(rpe(0)).toBe(1);
    expect(rpe(14)).toBe(5);
    const semEsforco = ler(toPrumoBackup(estado({ runs: [{ id: 'x', data: '2026-11-01', tipo: 'Rodagem', km: 5, fonte: 'manual' }] }), agora));
    expect(semEsforco.data.runs[0]).not.toHaveProperty('rpe');
  });

  it('musculação: só treinos feitos, sem os campos extras deste app', () => {
    expect(b.data.lifts.map((l) => l.id)).toEqual(['l1', 'l4']);
    const l1 = b.data.lifts[0];
    expect(l1).not.toHaveProperty('inicioMs');
    expect(l1).not.toHaveProperty('trocas');
    const { inicioMs: _i, trocas: _t, ...esperado } = treinos[0] as Lift;
    expect(l1).toEqual(esperado);
    expect(b.data.lifts[1]).toEqual(treinos[3]);
  });

  it('estado vazio gera coleções vazias e não altera o estado', () => {
    const copia = structuredClone(cheio);
    toPrumoBackup(cheio, agora);
    expect(cheio).toEqual(copia);
    expect(ler(toPrumoBackup(estado(), agora)).data).toEqual({ weights: [], runs: [], lifts: [] });
  });
});

describe('fromPrumoBackup', () => {
  it('ida e volta: o que saiu entra igual num app vazio', () => {
    const json = toPrumoBackup(cheio, agora);
    const vazio = estado();
    const res = fromPrumoBackup(json, vazio);
    expect(res.ok).toBe(true);
    expect(res.error).toBeUndefined();
    expect(res.added).toBe(2 + 3 + 2);
    expect(vazio).toEqual(estado()); // o argumento não muda
    const novo = res.state as AppState;
    expect(novo.weights).toEqual(pesos);
    expect(novo.runs).toEqual([
      { id: 'r1', data: '2026-11-11', tipo: 'Rodagem', km: 6.2, min: 40, fc: 148, rpe: 4, fonte: 'manual' },
      { id: 'r3', data: '2026-11-08', tipo: 'Longão', km: 12, min: 80, elev: 110, cad: 168, rpe: 2, obs: 'Ibira', fonte: 'garmin' },
      { id: 'r4', data: '2025-06-01', tipo: 'Prova', km: 21.1, min: 118, fonte: 'manual' },
    ]);
    const { inicioMs: _i, trocas: _t, ...l1 } = treinos[0] as Lift;
    expect(novo.lifts).toEqual([l1, treinos[3]]);
    expect(novo.settings).toEqual(vazio.settings);
    // exportar de novo dá o mesmo backup
    expect(toPrumoBackup(novo, agora)).toBe(json);
  });

  it('ids repetidos são ignorados: importar duas vezes não duplica', () => {
    const json = toPrumoBackup(cheio, agora);
    const primeira = fromPrumoBackup(json, estado());
    const segunda = fromPrumoBackup(json, primeira.state as AppState);
    expect(segunda).toMatchObject({ ok: true, added: 0 });
    expect(segunda.state?.lifts).toHaveLength(2);
    // no próprio app de origem só não entra nada: tudo já existe
    const naOrigem = fromPrumoBackup(json, cheio);
    expect(naOrigem.added).toBe(0);
    expect(naOrigem.state?.runs).toEqual(corridas);
    expect(naOrigem.state?.lifts).toEqual(treinos);
  });

  it('mantém o que já existe e junta o que é novo', () => {
    const local = estado({ weights: [{ id: 'w1', data: '2026-11-10', kg: 99 }], runs: [{ id: 'meu', data: '2026-11-01', tipo: 'Rodagem', min: 30, fonte: 'treino' }] });
    const res = fromPrumoBackup(toPrumoBackup(cheio, agora), local);
    expect(res.added).toBe(1 + 3 + 2);
    expect(res.state?.weights).toEqual([{ id: 'w1', data: '2026-11-10', kg: 99 }, pesos[1]]); // o w1 local vence
    expect(res.state?.runs.map((r) => r.id)).toEqual(['meu', 'r1', 'r3', 'r4']);
  });

  it('lê um backup real do Prumo: coleções extras, números em texto e sessão guiada', () => {
    const json = JSON.stringify({
      app: 'prumo', versao: 2, exportadoEm: '2026-11-01T10:00:00.000Z',
      settings: { nome: 'Filipe', plano: { 0: { tipo: 'musc' } } },
      data: {
        weights: [{ id: 'a', data: '2026-10-30', kg: '82,5' }, { id: 'b', data: '2026-10-31' }, { id: 'a', data: '2026-11-01', kg: 82 }],
        runs: [
          { id: 'c', data: '2026-10-29', tipo: 'Tempo run', km: 8.2, min: 45, rpe: 4, jejum: true, gel: 1, fonte: 'garmin', detalhe: { splits: [] } },
          { id: 'd', data: '2026-10-30', tipo: 'Trote', km: '5', fonte: 'outra' },
          { id: 'e', data: '30/10/2026', tipo: 'Rodagem', km: 5 },
          { data: '2026-10-30', tipo: 'Rodagem', km: 5 },
          'lixo',
        ],
        lifts: [
          { id: 'f', data: '2026-10-28', ficha: 'A', treino: 'Costas e bíceps', programa: 'hibrido', inicio: '18:00', fim: '18:50', emAndamento: false, concluido: true, min: 50, volume: 5000, intensidade: 4, obs: '', sets: { 'h-A-07': { '1': { reps: 12, carga: 25, feito: true, t: '18:05' }, '2': { reps: '10', carga: '42,5', feito: true } } }, prs: [{ exId: 'h-A-07', nome: null, e1rm: 56.7, carga: 42.5, reps: 10, anterior: 53.3, medida: 'e1rm' }] },
          { id: 'g', data: '2026-10-20', ficha: 'B', treino: 'Inferiores', programa: 'hibrido', min: 55, concluido: true },
        ],
        diet: [{ id: '2026-10-30', nota: 8 }],
        habits: [{ id: 'h', nome: 'Leitura' }],
      },
    });
    const res = fromPrumoBackup(json, estado());
    expect(res).toMatchObject({ ok: true, added: 1 + 2 + 2 });
    expect(res.state?.weights).toEqual([{ id: 'a', data: '2026-10-30', kg: 82.5 }]);
    expect(res.state?.runs).toEqual([
      { id: 'c', data: '2026-10-29', tipo: 'Tempo run', km: 8.2, min: 45, rpe: 4, fonte: 'garmin' },
      { id: 'd', data: '2026-10-30', tipo: 'Rodagem', km: 5, fonte: 'manual' },
    ]);
    expect(res.state?.lifts[0]?.sets).toEqual({ 'h-A-07': { '1': { reps: 12, carga: 25, feito: true, t: '18:05' }, '2': { reps: 10, carga: 42.5, feito: true } } });
    expect(res.state?.lifts[0]?.prs?.[0]).toMatchObject({ nome: 'h-A-07', e1rm: 56.7 });
    expect(res.state?.lifts[1]).toEqual({ id: 'g', data: '2026-10-20', ficha: 'B', treino: 'Inferiores', programa: 'hibrido', min: 55, concluido: true });
    expect(res.state?.settings.plano).toEqual({}); // os ajustes do Prumo não entram
  });

  it('coleção ausente conta como vazia', () => {
    expect(fromPrumoBackup(JSON.stringify({ app: 'prumo', versao: 2, data: { runs: [] } }), estado())).toMatchObject({ ok: true, added: 0 });
  });

  it('erros com mensagem clara', () => {
    const erro = (json: string) => {
      const res = fromPrumoBackup(json, cheio);
      expect(res.ok).toBe(false);
      expect(res.added).toBe(0);
      expect(res.state).toBeUndefined();
      return res.error;
    };
    expect(erro('   ')).toBe('Cole aqui o backup do Prumo: o texto está vazio.');
    expect(erro('{ "app": "prumo", ')).toContain('não é um JSON válido');
    expect(erro('[1, 2]')).toBe('Este arquivo não é um backup do Prumo.');
    expect(erro('null')).toBe('Este arquivo não é um backup do Prumo.');
    expect(erro('{"app":"outro","data":{}}')).toBe('Este arquivo não é um backup do Prumo.');
    expect(erro('{"app":"prumo-treino","versao":1,"state":{}}')).toContain('backup do Prumo Treino');
    expect(erro('{"app":"prumo","versao":2}')).toContain('sem os dados');
    expect(erro('{"app":"prumo","versao":2,"data":{"runs":{"a":1}}}')).toContain('coleção "runs"');
  });
});
