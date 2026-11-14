/**
 * Apoio dos componentes de números e gráficos (Stat, Ring, Meter, Bars, LineChart…): tons, medida de largura,
 * marcas "redondas" de eixo e formatação curta de número. Os gráficos são desenhados na largura real do
 * contêiner (como no Prumo), para que o texto dos eixos tenha sempre 11 px de verdade.
 */
import type { RefObject } from 'preact';
import { useLayoutEffect, useRef, useState } from 'preact/hooks';

/** Tons aceitos pelo kit: as quatro áreas do app, o acento e os estados. */
export type Tone = 'corrida' | 'musc' | 'mob' | 'peso' | 'accent' | 'good' | 'warn' | 'crit' | 'muted';
/** Tons de área (usados em marcadores de treino). */
export type AreaTone = 'corrida' | 'musc' | 'mob';

const TONE_VAR: Record<Tone, string> = {
  corrida: 'var(--c-corrida)',
  musc: 'var(--c-musc)',
  mob: 'var(--c-mob)',
  peso: 'var(--c-peso)',
  accent: 'var(--accent)',
  good: 'var(--good)',
  warn: 'var(--warn)',
  crit: 'var(--crit)',
  muted: 'var(--muted)',
};

/** Cor (variável CSS) de um tom. */
export const toneColor = (tone: Tone = 'accent'): string => TONE_VAR[tone];

/** Verdadeiro para os tons que são área do app (levam o quadradinho colorido no rótulo). */
export const isAreaTone = (tone: Tone | undefined): boolean => tone === 'corrida' || tone === 'musc' || tone === 'mob' || tone === 'peso';

export const clamp01 = (v: number): number => (Number.isFinite(v) ? Math.min(1, Math.max(0, v)) : 0);

/** Largura média de um caractere do mono de 11 px dos eixos. */
export const CH_CHAR = 6.6;
export const txtW = (s: string): number => s.length * CH_CHAR;

/**
 * Número curto em pt-BR: vírgula decimal e sem zeros à direita (82.5 → "82,5"; 40 → "40"; 1240 → "1.240").
 * `casas` é o máximo de casas decimais (padrão 1).
 */
export function fmtNum(v: number, casas = 1): string {
  if (!Number.isFinite(v)) return '—';
  const f = 10 ** casas;
  const r = Math.round(v * f) / f;
  const [int = '0', dec] = Math.abs(r).toString().split('.');
  const milhar = int.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${r < 0 ? '−' : ''}${milhar}${dec ? `,${dec}` : ''}`;
}

/** Casas decimais necessárias para escrever marcas com esse passo. */
export const tickDigits = (step: number): number => (Number.isInteger(step) ? 0 : step >= 0.1 ? 1 : 2);

/** Cerca de `n` marcas "redondas" entre a e b (passos 1 / 2 / 2,5 / 5 / 10 × 10ⁿ; só inteiros com `int`). */
export function niceTicks(a: number, b: number, n: number, int = false): number[] {
  const span = b - a || 1;
  const step0 = span / Math.max(1, n);
  let mag = 10 ** Math.floor(Math.log10(step0));
  let cands = [1, 2, 2.5, 5, 10].map((m) => m * mag);
  if (int) {
    mag = Math.max(1, mag);
    cands = [1, 2, 5, 10].map((m) => m * mag);
  }
  const last = cands[cands.length - 1] ?? 1;
  const step = int
    ? (cands.find((s) => s >= step0) ?? last)
    : cands.reduce((best, s) => (Math.abs(Math.log(s / step0)) < Math.abs(Math.log(best / step0)) ? s : best), last);
  const out: number[] = [];
  for (let v = Math.ceil(a / step - 1e-9) * step; v <= b + 1e-9; v += step) out.push(Number(v.toFixed(6)));
  return out;
}

/**
 * Mede a largura útil de um elemento e acompanha as mudanças (ResizeObserver). Antes da primeira medida
 * devolve `inicial` (a largura de um cartão em um iPhone de 390 px).
 */
export function useWidth<T extends HTMLElement>(inicial = 326): [RefObject<T | null>, number] {
  const ref = useRef<T>(null);
  const [w, setW] = useState(inicial);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const medir = () => {
      const v = Math.round(el.clientWidth);
      if (v > 0) setW((old) => (old === v ? old : v));
    };
    medir();
    if (typeof ResizeObserver !== 'function') return;
    // a nova medida entra no quadro seguinte: redesenhar dentro do aviso do observador gera o erro de "loop"
    let raf = 0;
    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(medir);
    });
    ro.observe(el);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);
  return [ref, w];
}

/** Barra de topo arredondado e base reta (o desenho de barra do Prumo). */
export function barPath(x: number, y: number, w: number, h: number, r = 2): string {
  if (h <= 0 || w <= 0) return '';
  const rr = Math.min(r, h, w / 2);
  const f = (v: number) => v.toFixed(1);
  return `M${f(x)},${f(y + h)}V${f(y + rr)}Q${f(x)},${f(y)} ${f(x + rr)},${f(y)}H${f(x + w - rr)}Q${f(x + w)},${f(y)} ${f(x + w)},${f(y + rr)}V${f(y + h)}Z`;
}

const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'] as const;
const ISO_RE = /^(\d{4})-(\d{2})-(\d{2})$/;

/** Decompõe uma data "AAAA-MM-DD"; `null` se o texto não for uma data. */
export function parteISO(s: string): { y: number; m: number; d: number; t: number } | null {
  const hit = ISO_RE.exec(s);
  if (!hit) return null;
  const y = Number(hit[1]);
  const m = Number(hit[2]);
  const d = Number(hit[3]);
  return { y, m, d, t: new Date(y, m - 1, d).getTime() };
}

/** "2026-11-14" → "14 nov"; outros textos voltam como vieram. */
export function rotuloData(s: string): string {
  const p = parteISO(s);
  return p ? `${p.d} ${MESES[p.m - 1] ?? ''}` : s;
}

/** Nome curto do mês (1 a 12). */
export const mesCurto = (m: number): string => MESES[m - 1] ?? '';
