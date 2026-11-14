import type { ComponentChildren } from 'preact';
import { clamp01, toneColor, type Tone } from './viz-util.ts';

export interface ProgressBarProps {
  /** Fração preenchida, de 0 a 1. */
  value: number;
  tone?: Tone;
  /** Fio vertical em uma fração da barra (0 a 1): ritmo esperado ou meta. */
  mark?: number;
  /** Descrição para leitor de tela ("Semana 2 de 6"). */
  label?: string;
  class?: string;
}

/** Barra de progresso do Prumo: trilho de 6 px e preenchimento na cor do tom. */
export function ProgressBar({ value, tone = 'accent', mark, label, class: cls }: ProgressBarProps) {
  const v = clamp01(value);
  const style: Record<string, string> = { '--tone': toneColor(tone) };
  if (mark !== undefined) style['--mark'] = `${(clamp01(mark) * 100).toFixed(1)}%`;
  return (
    <div
      class={`ui-bar${mark !== undefined ? ' ui-bar--marked' : ''}${cls ? ` ${cls}` : ''}`}
      style={style}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(v * 100)}
      aria-label={label ?? 'Progresso'}
    >
      <i style={{ width: `${(v * 100).toFixed(1)}%` }} />
    </div>
  );
}

export interface MeterProps {
  value: number;
  max: number;
  tone?: Tone;
  /** Nome da medida, à esquerda. */
  label?: string;
  /** Texto à direita ("92 de 120 min"). */
  right?: ComponentChildren;
  class?: string;
}

/** Medidor com rótulo: nome à esquerda, valor à direita e a barra embaixo. */
export function Meter({ value, max, tone = 'accent', label, right, class: cls }: MeterProps) {
  const frac = max > 0 ? value / max : 0;
  return (
    <div class={`ui-meter${cls ? ` ${cls}` : ''}`}>
      {(label || right) && (
        <div class="ui-meter-head">
          <span class="ui-meter-lab">{label}</span>
          {right && <span class="ui-meter-right num">{right}</span>}
        </div>
      )}
      <ProgressBar value={frac} tone={tone} label={label} />
    </div>
  );
}
