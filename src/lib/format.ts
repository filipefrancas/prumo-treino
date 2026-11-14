/** Formatação de números, durações e alvos em português do Brasil (vírgula decimal). Funções puras. */
import type { Target } from '../types.ts';

const p2 = (n: number): string => String(n).padStart(2, '0');

/** Vírgula decimal, sem zeros à direita: num(82.5) → "82,5"; num(80) → "80"; num(7.25, 2) → "7,25". Padrão: 1 casa. */
export function num(v: number, casas = 1): string {
  if (!Number.isFinite(v)) return '—';
  const c = Math.max(0, Math.min(6, Math.trunc(casas)));
  let t = v.toFixed(c);
  if (t.includes('.')) t = t.replace(/0+$/, '').replace(/\.$/, '');
  if (t === '-0') t = '0';
  return t.replace('.', ',');
}

/** "82,5 kg". */
export function kg(v: number): string {
  return `${num(v, 2)} kg`;
}

/** Duração de relógio a partir de segundos: "0:45", "12:05", "1:02:03". */
export function fmtDur(seg: number): string {
  const total = Number.isFinite(seg) ? Math.max(0, Math.round(seg)) : 0;
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return h > 0 ? `${h}:${p2(m)}:${p2(s)}` : `${m}:${p2(s)}`;
}

/** Duração em minutos, por extenso: "45 min", "1 h", "1 h 05". */
export function fmtMin(min: number): string {
  const total = Number.isFinite(min) ? Math.max(0, Math.round(min)) : 0;
  if (total < 60) return `${total} min`;
  const h = Math.floor(total / 60);
  const m = total % 60;
  return m === 0 ? `${h} h` : `${h} h ${p2(m)}`;
}

/** Ritmo em minutos por km; undefined quando falta distância ou tempo. */
export function pace(km: number | undefined, min: number | undefined): number | undefined {
  if (km === undefined || min === undefined) return undefined;
  if (!Number.isFinite(km) || !Number.isFinite(min) || km <= 0 || min <= 0) return undefined;
  return min / km;
}

/** "6:05/km" ou "—". */
export function fmtPace(minPorKm: number | undefined): string {
  if (minPorKm === undefined || !Number.isFinite(minPorKm) || minPorKm <= 0) return '—';
  const total = Math.round(minPorKm * 60);
  return `${Math.floor(total / 60)}:${p2(total % 60)}/km`;
}

/** "FC 130 a 152 bpm" · "PSE 7 a 8" · "PSE 7" · "Livre". */
export function fmtAlvo(t: Target): string {
  if (t.kind === 'fc') return t.min === t.max ? `FC ${num(t.min, 0)} bpm` : `FC ${num(t.min, 0)} a ${num(t.max, 0)} bpm`;
  if (t.kind === 'pse') return t.min === t.max ? `PSE ${num(t.min)}` : `PSE ${num(t.min)} a ${num(t.max)}`;
  return 'Livre';
}

/** plural(2, 'treino', 'treinos') → "2 treinos"; plural(1, 'treino', 'treinos') → "1 treino". */
export function plural(n: number, um: string, varios: string): string {
  return `${num(n)} ${Math.abs(n) === 1 ? um : varios}`;
}

/** Lê um número digitado, aceitando vírgula: "82,5" → 82.5; "1.234,5" → 1234.5. Texto que não é número → undefined. */
export function parseNum(texto: string): number | undefined {
  let t = texto.trim().replace(/\s+/g, '');
  if (t === '') return undefined;
  if (t.includes(',')) t = t.replace(/\./g, '').replace(',', '.');
  if (!/^[+-]?(\d+\.?\d*|\.\d+)$/.test(t)) return undefined;
  const v = Number(t);
  return Number.isFinite(v) ? v : undefined;
}
