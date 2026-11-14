import { describe, expect, it } from 'vitest';
import {
  DIAS_CURTOS, DIAS_LETRA, DIAS_LONGOS, MESES_CURTOS, addDias, agoraHM, diaSemana, diffDias, ehISO, fmtData, fmtDiaMes,
  fmtRelativa, fromISO, hoje, idade, inicioSemana, saudacao, semanaDe, toISO,
} from '../../src/lib/dates.ts';

describe('constantes', () => {
  it('começam no domingo e em janeiro', () => {
    expect(DIAS_CURTOS).toEqual(['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb']);
    expect(DIAS_LETRA).toEqual(['D', 'S', 'T', 'Q', 'Q', 'S', 'S']);
    expect(DIAS_LONGOS[3]).toBe('quarta');
    expect(MESES_CURTOS).toHaveLength(12);
    expect(MESES_CURTOS[10]).toBe('nov');
  });
});

describe('toISO e fromISO', () => {
  it('usam a data local, mesmo perto da meia-noite', () => {
    expect(toISO(new Date(2026, 10, 18, 23, 59, 59))).toBe('2026-11-18');
    expect(toISO(new Date(2026, 10, 18, 0, 0, 1))).toBe('2026-11-18');
    expect(toISO(new Date(2026, 0, 5))).toBe('2026-01-05');
  });

  it('fromISO devolve a meia-noite local', () => {
    const d = fromISO('2026-11-18');
    expect([d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes()]).toEqual([2026, 10, 18, 0, 0]);
    expect(toISO(fromISO('2024-02-29'))).toBe('2024-02-29');
  });

  it('hoje é a data local de agora', () => {
    expect(hoje()).toBe(toISO(new Date()));
    expect(ehISO(hoje())).toBe(true);
  });

  it('ehISO recusa datas que não existem', () => {
    expect(ehISO('2026-02-30')).toBe(false);
    expect(ehISO('2026-2-3')).toBe(false);
    expect(ehISO('18/11/2026')).toBe(false);
    expect(ehISO(20261118)).toBe(false);
  });
});

describe('addDias e diffDias', () => {
  it('viram mês e ano', () => {
    expect(addDias('2026-11-30', 1)).toBe('2026-12-01');
    expect(addDias('2026-12-31', 1)).toBe('2027-01-01');
    expect(addDias('2027-01-01', -1)).toBe('2026-12-31');
    expect(addDias('2026-03-01', -1)).toBe('2026-02-28');
    expect(addDias('2024-02-28', 1)).toBe('2024-02-29');
    expect(addDias('2026-11-18', 0)).toBe('2026-11-18');
    expect(addDias('2026-11-18', 365)).toBe('2027-11-18');
  });

  it('andam um dia de cada vez por mais de dois anos (sem pular nem repetir em troca de horário de verão)', () => {
    let d = '2025-01-01';
    const vistos = new Set<string>([d]);
    for (let i = 1; i <= 800; i++) {
      const prox = addDias(d, 1);
      expect(diffDias(d, prox)).toBe(1);
      expect(prox > d).toBe(true);
      expect(addDias('2025-01-01', i)).toBe(prox);
      vistos.add(prox);
      d = prox;
    }
    expect(vistos.size).toBe(801);
    expect(d).toBe('2027-03-12');
  });

  it('diffDias é b − a em dias inteiros', () => {
    expect(diffDias('2026-11-18', '2026-11-21')).toBe(3);
    expect(diffDias('2026-11-21', '2026-11-18')).toBe(-3);
    expect(diffDias('2026-12-31', '2027-01-01')).toBe(1);
    expect(diffDias('2026-01-01', '2027-01-01')).toBe(365);
    expect(diffDias('2026-11-18', '2026-11-18')).toBe(0);
  });
});

describe('semana começando na segunda', () => {
  it('diaSemana segue Date.getDay()', () => {
    expect(diaSemana('2026-11-18')).toBe(3); // quarta
    expect(diaSemana('2026-11-15')).toBe(0); // domingo
    expect(diaSemana('2026-11-16')).toBe(1); // segunda
  });

  it('inicioSemana devolve a segunda-feira', () => {
    expect(inicioSemana('2026-11-18')).toBe('2026-11-16');
    expect(inicioSemana('2026-11-16')).toBe('2026-11-16');
    expect(inicioSemana('2026-11-22')).toBe('2026-11-16'); // o domingo fecha a semana
    expect(inicioSemana('2026-11-15')).toBe('2026-11-09');
    expect(inicioSemana('2026-11-01')).toBe('2026-10-26'); // vira o mês
    expect(inicioSemana('2027-01-01')).toBe('2026-12-28'); // vira o ano
  });

  it('semanaDe devolve 7 datas, de segunda a domingo', () => {
    const s = semanaDe('2026-12-31');
    expect(s).toEqual(['2026-12-28', '2026-12-29', '2026-12-30', '2026-12-31', '2027-01-01', '2027-01-02', '2027-01-03']);
    expect(diaSemana(s[0] ?? '')).toBe(1);
    expect(diaSemana(s[6] ?? '')).toBe(0);
  });
});

describe('formatos em português', () => {
  it('fmtData', () => {
    expect(fmtData('2026-11-18')).toBe('qua 18 nov');
    expect(fmtData('2026-11-18', 'curta')).toBe('qua 18 nov');
    expect(fmtData('2026-11-18', 'media')).toBe('18 de novembro');
    expect(fmtData('2026-11-18', 'longa')).toBe('quarta, 18 de novembro');
    expect(fmtData('2026-11-14')).toBe('sáb 14 nov');
    expect(fmtData('2026-03-03', 'longa')).toBe('terça, 3 de março');
    expect(fmtData('2026-03-01', 'media')).toBe('1 de março');
  });

  it('fmtDiaMes', () => {
    expect(fmtDiaMes('2026-11-18')).toBe('18/11');
    expect(fmtDiaMes('2026-01-05')).toBe('05/01');
  });

  it('fmtRelativa', () => {
    const ref = '2026-11-18';
    expect(fmtRelativa('2026-11-18', ref)).toBe('hoje');
    expect(fmtRelativa('2026-11-17', ref)).toBe('ontem');
    expect(fmtRelativa('2026-11-19', ref)).toBe('amanhã');
    expect(fmtRelativa('2026-11-15', ref)).toBe('há 3 dias');
    expect(fmtRelativa('2026-11-12', ref)).toBe('há 6 dias');
    expect(fmtRelativa('2026-11-04', ref)).toBe('qua 4 nov');
    expect(fmtRelativa('2026-11-25', ref)).toBe('qua 25 nov');
    expect(fmtRelativa(hoje())).toBe('hoje');
  });

  it('agoraHM e saudacao', () => {
    expect(agoraHM(new Date(2026, 10, 18, 7, 5))).toBe('07:05');
    expect(agoraHM(new Date(2026, 10, 18, 23, 59))).toBe('23:59');
    expect(agoraHM()).toMatch(/^\d{2}:\d{2}$/);
    expect(saudacao(new Date(2026, 10, 18, 0, 0))).toBe('Bom dia');
    expect(saudacao(new Date(2026, 10, 18, 11, 59))).toBe('Bom dia');
    expect(saudacao(new Date(2026, 10, 18, 12, 0))).toBe('Boa tarde');
    expect(saudacao(new Date(2026, 10, 18, 17, 59))).toBe('Boa tarde');
    expect(saudacao(new Date(2026, 10, 18, 18, 0))).toBe('Boa noite');
  });

  it('idade em anos completos', () => {
    expect(idade('1990-11-18', '2026-11-18')).toBe(36);
    expect(idade('1990-11-19', '2026-11-18')).toBe(35);
    expect(idade('1990-01-01', '2026-11-18')).toBe(36);
    expect(idade('1990-12-31', '2026-11-18')).toBe(35);
  });
});
