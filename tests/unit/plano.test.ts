import 'fake-indexeddb/auto';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { PROFILE } from '../../src/data/profile.ts';
import { routineById } from '../../src/data/routines.ts';
import { PORQUE_ALONGAMENTO, agendaDaSemana, agendaDoDia, agendaDoDiaEm, alongamentoDoDia, resumoDaSemana } from '../../src/lib/plano.ts';
import { initialState } from '../../src/lib/store.ts';
import type { AppState, Lift, MobilityLog, RunLog } from '../../src/types.ts';

/* ---------------- apoio ---------------- */

let seq = 0;
const novoId = (p: string): string => `${p}${++seq}`;

function corrida(data: string, over: Partial<RunLog> = {}): RunLog {
  return { id: novoId('r'), data, tipo: 'Rodagem', fonte: 'manual', ...over };
}
function lift(data: string, ficha = 'A', over: Partial<Lift> = {}): Lift {
  return { id: novoId('l'), data, ficha, treino: `Ficha ${ficha}`, programa: 'maromba', min: 60, volume: 5000, ...over };
}
function mob(data: string, seg: number): MobilityLog {
  return { id: novoId('m'), data, rotina: 'pos-corrida', nome: 'Alongamento pós-corrida', seg, completo: true };
}
function estado(over: Partial<AppState> = {}): AppState {
  return { ...initialState(), ...over };
}

/** "Hoje" dos testes: sábado, 14 de novembro de 2026 (semana de 09/11 a 15/11, a primeira do plano). */
function hojeEh(data: string): void {
  const [a, m, d] = data.split('-').map(Number);
  vi.setSystemTime(new Date(a ?? 2026, (m ?? 1) - 1, d ?? 1, 12, 0, 0));
}

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['Date'] });
  hojeEh('2026-11-14');
});

afterEach(() => {
  vi.useRealTimers();
});

/* ---------------- agenda ---------------- */

describe('agendaDoDia', () => {
  it('dia de corrida do plano: treino e situação', () => {
    const sexta = agendaDoDia(estado(), '2026-11-13');
    expect(sexta).toHaveLength(1);
    expect(sexta[0]).toMatchObject({ tipo: 'corrida', situacao: 'perdido', feito: false });
    expect(sexta[0]?.corrida?.id).toBe('c-2026-11-13');
    expect(sexta[0]?.ficha).toBeUndefined();
    expect(agendaDoDia(estado(), '2026-11-15')[0]).toMatchObject({ tipo: 'corrida', situacao: 'futuro', feito: false });
  });

  it('a situação da corrida acompanha o dia de hoje', () => {
    hojeEh('2026-11-15');
    expect(agendaDoDia(estado(), '2026-11-15')[0]?.situacao).toBe('hoje');
    hojeEh('2026-11-16');
    expect(agendaDoDia(estado(), '2026-11-15')[0]?.situacao).toBe('perdido');
  });

  it('corrida feita por registro ou marca, e pulada', () => {
    const feita = estado({ runs: [corrida('2026-11-13', { treinoId: 'c-2026-11-13' })] });
    expect(agendaDoDia(feita, '2026-11-13')[0]).toMatchObject({ situacao: 'feito', feito: true });
    const marcada = estado({ marcas: { 'c-2026-11-15': 'feito' } });
    expect(agendaDoDia(marcada, '2026-11-15')[0]).toMatchObject({ situacao: 'feito', feito: true });
    const pulada = estado({ marcas: { 'c-2026-11-13': 'pulado' } });
    expect(agendaDoDia(pulada, '2026-11-13')[0]).toMatchObject({ situacao: 'pulado', feito: false });
  });

  it('dia de musculação: ficha fixa do plano da semana (0 = domingo)', () => {
    const s = estado();
    const seg = agendaDoDia(s, '2026-11-09');
    expect(seg).toHaveLength(1);
    expect(seg[0]).toMatchObject({ tipo: 'musc', feito: false });
    expect(seg[0]?.ficha).toMatchObject({ id: 'A', nome: 'Pernas' }); // segunda
    expect(seg[0]?.ficha?.porque).toMatch(/^Segunda é o dia mais longe do longo de domingo/);
    expect(seg[0]?.corrida).toBeUndefined();
    expect(seg[0]?.situacao).toBeUndefined();
    expect(agendaDoDia(s, '2026-11-12')[0]?.ficha).toMatchObject({ id: 'B', nome: 'Peito e costas' }); // quinta
    expect(agendaDoDia(s, '2026-11-14')[0]?.ficha).toMatchObject({ id: 'C', nome: 'Braços e ombros' }); // sábado
  });

  it('terça é dia de alongamento: a rotina completa é o treino do dia', () => {
    expect(PROFILE.stretchDays).toEqual([2]);
    expect(routineById(PROFILE.stretchRoutine)?.id).toBe('alongamento-completo');
    const s = estado();
    const terca = agendaDoDia(s, '2026-11-17');
    expect(terca).toHaveLength(1);
    expect(terca[0]).toMatchObject({ tipo: 'mob', feito: false });
    expect(terca[0]?.rotina).toMatchObject({ id: 'alongamento-completo', minutes: 24 });
    expect(terca[0]?.ficha).toBeUndefined();
    expect(terca[0]?.corrida).toBeUndefined();
    expect(alongamentoDoDia(s, '2026-11-17')?.id).toBe('alongamento-completo');
    expect(PORQUE_ALONGAMENTO).toBe('É o único dia sem corrida nem musculação. São as posições no chão, cerca de 24 minutos, com o timer do app. Solta a perna de segunda antes da corrida de quarta.');
  });

  it('alongamento feito = a rotina do dia registrada na data (outra rotina não vale)', () => {
    const completo: MobilityLog = { id: 'm-ok', data: '2026-11-17', rotina: 'alongamento-completo', nome: 'Alongamento completo', seg: 1440, completo: true };
    expect(agendaDoDia(estado({ mob: [completo] }), '2026-11-17')[0]?.feito).toBe(true);
    expect(agendaDoDia(estado({ mob: [mob('2026-11-17', 480)] }), '2026-11-17')[0]?.feito).toBe(false);
    expect(agendaDoDia(estado({ mob: [{ ...completo, data: '2026-11-16' }] }), '2026-11-17')[0]?.feito).toBe(false);
  });

  it('em dia de corrida ou de musculação não há alongamento na agenda', () => {
    const s = estado();
    for (const data of ['2026-11-16', '2026-11-18', '2026-11-19', '2026-11-20', '2026-11-21', '2026-11-22']) {
      expect(alongamentoDoDia(s, data), data).toBeUndefined();
      expect(agendaDoDia(s, data).some((i) => i.tipo === 'mob'), data).toBe(false);
    }
    // se a terça ganhar musculação ou corrida no plano, o alongamento sai
    s.settings.plano[2] = { tipo: 'musc', ficha: 'B' };
    expect(agendaDoDia(s, '2026-11-17').map((i) => i.tipo)).toEqual(['musc']);
    expect(alongamentoDoDia(s, '2026-11-17')).toBeUndefined();
  });

  it('dia sem treino que não é de alongamento continua com a agenda vazia', () => {
    const s = estado();
    s.settings.plano[4] = { tipo: 'descanso' }; // quinta sem musculação
    expect(agendaDoDia(s, '2026-11-12')).toEqual([]);
    // quarta antes do começo do plano de corrida: nada no dia
    expect(agendaDoDia(s, '2026-11-11')).toEqual([]);
  });

  it('musculação feita = existe treino concluído na data', () => {
    expect(agendaDoDia(estado({ lifts: [lift('2026-11-14')] }), '2026-11-14')[0]?.feito).toBe(true);
    expect(agendaDoDia(estado({ lifts: [lift('2026-11-13')] }), '2026-11-14')[0]?.feito).toBe(false);
    expect(agendaDoDia(estado({ lifts: [lift('2026-11-14', 'A', { emAndamento: true })] }), '2026-11-14')[0]?.feito).toBe(false);
    expect(agendaDoDia(estado({ lifts: [lift('2026-11-14', 'A', { concluido: false })] }), '2026-11-14')[0]?.feito).toBe(false);
  });

  it('em dia feito, mostra a ficha que foi feita de fato', () => {
    const item = agendaDoDia(estado({ lifts: [lift('2026-11-14', 'B')] }), '2026-11-14')[0];
    expect(item?.feito).toBe(true);
    expect(item?.ficha?.id).toBe('B');
  });

  it('sem ficha fixa, vale a próxima da rotação', () => {
    const s = estado();
    s.settings.plano[6] = { tipo: 'musc' };
    expect(agendaDoDia(s, '2026-11-14')[0]?.ficha?.id).toBe('A');
    s.lifts = [lift('2026-11-09', 'A')];
    expect(agendaDoDia(s, '2026-11-14')[0]?.ficha?.id).toBe('B');
    // treino da ficha antiga não entra na rotação da nova
    s.lifts = [lift('2026-11-09', 'A', { programa: 'hibrido' })];
    expect(agendaDoDia(s, '2026-11-14')[0]?.ficha?.id).toBe('A');
  });

  it('dia "ambos": corrida e musculação, nessa ordem', () => {
    const s = estado();
    s.settings.plano[5] = { tipo: 'ambos', ficha: 'C' };
    const sexta = agendaDoDia(s, '2026-11-13');
    expect(sexta.map((i) => i.tipo)).toEqual(['corrida', 'musc']);
    expect(sexta[1]?.ficha?.id).toBe('C');
    // "ambos" em dia sem treino de corrida no plano: só a musculação
    expect(agendaDoDia(s, '2026-11-06').map((i) => i.tipo)).toEqual(['musc']);
  });

  it('a corrida do plano aparece mesmo em dia marcado como musculação ou descanso', () => {
    const s = estado();
    s.settings.plano[5] = { tipo: 'musc', ficha: 'A' };
    s.settings.plano[0] = { tipo: 'descanso' };
    expect(agendaDoDia(s, '2026-11-13').map((i) => i.tipo)).toEqual(['corrida', 'musc']);
    expect(agendaDoDia(s, '2026-11-15').map((i) => i.tipo)).toEqual(['corrida']);
  });

  it('agendaDoDiaEm usa a data de referência informada', () => {
    expect(agendaDoDiaEm(estado(), '2026-11-13', '2026-11-12')[0]?.situacao).toBe('futuro');
    expect(agendaDoDiaEm(estado(), '2026-11-13', '2026-11-13')[0]?.situacao).toBe('hoje');
  });
});

describe('agendaDaSemana', () => {
  it('sete dias, de segunda a domingo, a partir de qualquer dia da semana', () => {
    const sem = agendaDaSemana(estado(), '2026-11-14');
    expect(sem.map((d) => d.data)).toEqual([
      '2026-11-09', '2026-11-10', '2026-11-11', '2026-11-12', '2026-11-13', '2026-11-14', '2026-11-15',
    ]);
    expect(sem.map((d) => d.itens.map((i) => i.tipo).join('+'))).toEqual(['musc', 'mob', '', 'musc', 'corrida', 'musc', 'corrida']);
    expect(sem.map((d) => d.itens[0]?.ficha?.id ?? '')).toEqual(['A', '', '', 'B', '', 'C', '']);
    expect(agendaDaSemana(estado(), '2026-11-09')).toEqual(sem);
    expect(agendaDaSemana(estado(), '2026-11-15')).toEqual(sem);
  });

  it('vira o ano dentro da semana', () => {
    const sem = agendaDaSemana(estado(), '2027-01-01');
    expect(sem[0]?.data).toBe('2026-12-28');
    expect(sem[4]?.data).toBe('2027-01-01');
    expect(sem[6]?.data).toBe('2027-01-03');
    // o plano de corrida acabou em 27/12: sobram os três dias de musculação e o alongamento da terça
    expect(sem.flatMap((d) => d.itens).map((i) => i.tipo)).toEqual(['musc', 'mob', 'musc', 'musc']);
  });
});

/* ---------------- resumo ---------------- */

describe('resumoDaSemana', () => {
  it('estado vazio: só os planejados', () => {
    expect(resumoDaSemana(estado(), '2026-11-14')).toEqual({ feitos: 0, planejados: 5, corridas: 0, musc: 0, mobMin: 0 });
    // semana cheia do plano: três corridas e três de musculação (o alongamento da terça não entra na conta de treinos)
    expect(resumoDaSemana(estado(), '2026-11-18').planejados).toBe(6);
    const comAlongamento = estado({ mob: [{ id: 'm-t', data: '2026-11-17', rotina: 'alongamento-completo', nome: 'Alongamento completo', seg: 1440, completo: true }] });
    expect(resumoDaSemana(comAlongamento, '2026-11-18')).toEqual({ feitos: 0, planejados: 6, corridas: 0, musc: 0, mobMin: 24 });
  });

  it('conta corridas (do plano, avulsas e marcadas), musculação e mobilidade', () => {
    const s = estado({
      runs: [
        corrida('2026-11-13', { treinoId: 'c-2026-11-13' }),
        corrida('2026-11-11'),                    // avulsa, em dia sem treino do plano
        corrida('2026-11-08'),                    // domingo da semana anterior
        corrida('2026-11-16'),                    // segunda da semana seguinte
      ],
      marcas: { 'c-2026-11-13': 'feito', 'c-2026-11-15': 'feito' },
      lifts: [lift('2026-11-09', 'B'), lift('2026-11-12', 'C', { emAndamento: true }), lift('2026-11-02', 'B')],
      mob: [mob('2026-11-13', 600), mob('2026-11-15', 330), mob('2026-11-16', 900)],
    });
    expect(resumoDaSemana(s, '2026-11-14')).toEqual({ feitos: 4, planejados: 5, corridas: 3, musc: 1, mobMin: 16 });
    expect(resumoDaSemana(s, '2026-11-09')).toEqual(resumoDaSemana(s, '2026-11-15'));
  });

  it('vira o ano dentro da semana', () => {
    const s = estado({
      runs: [corrida('2026-12-27'), corrida('2026-12-28'), corrida('2027-01-03'), corrida('2027-01-04')],
      lifts: [lift('2026-12-31', 'C'), lift('2027-01-02', 'A')],
      mob: [mob('2027-01-01', 480)],
    });
    expect(resumoDaSemana(s, '2027-01-01')).toEqual({ feitos: 4, planejados: 3, corridas: 2, musc: 2, mobMin: 8 });
    expect(resumoDaSemana(s, '2026-12-28')).toEqual(resumoDaSemana(s, '2027-01-03'));
  });
});
