import { toneColor, type Tone } from './viz-util.ts';

export interface SparkProps {
  values: number[];
  tone?: Tone;
  /** Largura em px (padrão 120). */
  width?: number;
  /** Altura em px (padrão 30). */
  height?: number;
  class?: string;
}

/** Sparkline do Prumo: linha de 1,5 px com o último ponto marcado. Decorativa (o valor fica no texto ao lado). */
export function Spark({ values, tone = 'accent', width = 120, height = 30, class: cls }: SparkProps) {
  const ys = values.filter((v) => Number.isFinite(v));
  if (ys.length < 2) return null;
  const lo = Math.min(...ys);
  const hi = Math.max(...ys);
  const pad = 3;
  const n = ys.length;
  const span = hi - lo || 1;
  const X = (i: number) => pad + (i / (n - 1)) * (width - 2 * pad);
  const Y = (v: number) => pad + (1 - (v - lo) / span) * (height - 2 * pad);
  const d = ys.map((v, i) => `${i ? 'L' : 'M'}${X(i).toFixed(1)},${Y(v).toFixed(1)}`).join('');
  const cor = toneColor(tone);
  return (
    <svg class={`ui-spark${cls ? ` ${cls}` : ''}`} width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden="true">
      <path d={d} fill="none" stroke={cor} stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round" opacity=".85" />
      <circle class="ui-spark-pt" cx={X(n - 1).toFixed(1)} cy={Y(ys[n - 1] ?? lo).toFixed(1)} r="2.5" fill={cor} stroke-width="1.5" />
    </svg>
  );
}
