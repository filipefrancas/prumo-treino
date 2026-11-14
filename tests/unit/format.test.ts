import { describe, expect, it } from 'vitest';
import { fmtAlvo, fmtDur, fmtMin, fmtPace, kg, num, pace, parseNum, plural } from '../../src/lib/format.ts';

describe('num e kg', () => {
  it('usa vírgula e corta zeros à direita', () => {
    expect(num(82.5)).toBe('82,5');
    expect(num(80)).toBe('80');
    expect(num(80.04)).toBe('80');
    expect(num(7.25, 2)).toBe('7,25');
    expect(num(7.2, 2)).toBe('7,2');
    expect(num(1234.56, 1)).toBe('1234,6');
    expect(num(-0.04)).toBe('0');
    expect(num(-2.5)).toBe('-2,5');
    expect(num(10.6, 0)).toBe('11');
    expect(num(Number.NaN)).toBe('—');
  });

  it('kg', () => {
    expect(kg(82.5)).toBe('82,5 kg');
    expect(kg(40)).toBe('40 kg');
    expect(kg(42.25)).toBe('42,25 kg');
  });
});

describe('durações', () => {
  it('fmtDur', () => {
    expect(fmtDur(45)).toBe('0:45');
    expect(fmtDur(0)).toBe('0:00');
    expect(fmtDur(725)).toBe('12:05');
    expect(fmtDur(3723)).toBe('1:02:03');
    expect(fmtDur(3600)).toBe('1:00:00');
    expect(fmtDur(59.6)).toBe('1:00');
    expect(fmtDur(-5)).toBe('0:00');
  });

  it('fmtMin', () => {
    expect(fmtMin(45)).toBe('45 min');
    expect(fmtMin(0)).toBe('0 min');
    expect(fmtMin(65)).toBe('1 h 05');
    expect(fmtMin(60)).toBe('1 h');
    expect(fmtMin(135)).toBe('2 h 15');
    expect(fmtMin(59.6)).toBe('1 h');
  });
});

describe('pace', () => {
  it('calcula minutos por km', () => {
    expect(pace(10, 60)).toBe(6);
    expect(pace(5, 30.5)).toBeCloseTo(6.1, 5);
    expect(pace(undefined, 60)).toBeUndefined();
    expect(pace(10, undefined)).toBeUndefined();
    expect(pace(0, 60)).toBeUndefined();
    expect(pace(10, 0)).toBeUndefined();
  });

  it('fmtPace', () => {
    expect(fmtPace(pace(10, 60.8333333))).toBe('6:05/km');
    expect(fmtPace(6)).toBe('6:00/km');
    expect(fmtPace(5.999)).toBe('6:00/km');
    expect(fmtPace(4.5)).toBe('4:30/km');
    expect(fmtPace(undefined)).toBe('—');
    expect(fmtPace(0)).toBe('—');
  });
});

describe('alvos', () => {
  it('fmtAlvo', () => {
    expect(fmtAlvo({ kind: 'fc', min: 130, max: 152 })).toBe('FC 130 a 152 bpm');
    expect(fmtAlvo({ kind: 'pse', min: 7, max: 8 })).toBe('PSE 7 a 8');
    expect(fmtAlvo({ kind: 'pse', min: 7, max: 7 })).toBe('PSE 7');
    expect(fmtAlvo({ kind: 'pse', min: 6.5, max: 7 })).toBe('PSE 6,5 a 7');
    expect(fmtAlvo({ kind: 'livre' })).toBe('Livre');
  });
});

describe('plural e parseNum', () => {
  it('plural', () => {
    expect(plural(2, 'treino', 'treinos')).toBe('2 treinos');
    expect(plural(1, 'treino', 'treinos')).toBe('1 treino');
    expect(plural(0, 'treino', 'treinos')).toBe('0 treinos');
    expect(plural(1.5, 'km', 'km')).toBe('1,5 km');
  });

  it('parseNum aceita vírgula', () => {
    expect(parseNum('82,5')).toBe(82.5);
    expect(parseNum('82.5')).toBe(82.5);
    expect(parseNum(' 80 ')).toBe(80);
    expect(parseNum('1.234,5')).toBe(1234.5);
    expect(parseNum('-3,25')).toBe(-3.25);
    expect(parseNum('82,')).toBe(82);
    expect(parseNum('')).toBeUndefined();
    expect(parseNum('abc')).toBeUndefined();
    expect(parseNum('8 kg')).toBeUndefined();
    expect(parseNum('1,2,3')).toBeUndefined();
  });
});
