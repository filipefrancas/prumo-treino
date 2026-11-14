import type { ComponentChildren } from 'preact';
import { clamp01, toneColor, type Tone } from './viz-util.ts';

export interface TimerRingProps {
  /** Duração total, em segundos. */
  total: number;
  /** Quanto falta, em segundos (pode ser fracionado). */
  left: number;
  /** Diâmetro máximo em px (padrão 240). Encolhe se o contêiner for menor. */
  size?: number;
  tone?: Tone;
  /** Conteúdo do centro: o tempo, o nome do passo… */
  children?: ComponentChildren;
  class?: string;
}

/** Anel grande de contagem regressiva: começa cheio e esvazia até zero. O conteúdo do centro vem em children. */
export function TimerRing({ total, left, size = 240, tone = 'accent', children, class: cls }: TimerRingProps) {
  const sw = 10;
  const box = 240;
  const r = (box - sw) / 2;
  const c = 2 * Math.PI * r;
  const frac = total > 0 ? clamp01(left / total) : 0;
  return (
    <div class={`ui-timer${cls ? ` ${cls}` : ''}`} style={{ '--size': `${size}px`, '--tone': toneColor(tone) }}>
      <svg viewBox={`0 0 ${box} ${box}`} aria-hidden="true">
        <circle class="ui-timer-track" cx={box / 2} cy={box / 2} r={r} fill="none" stroke-width={sw} />
        <circle
          class="ui-timer-fill"
          cx={box / 2}
          cy={box / 2}
          r={r}
          fill="none"
          stroke-width={sw}
          stroke-linecap="round"
          stroke-dasharray={c.toFixed(2)}
          stroke-dashoffset={(c * (1 - frac)).toFixed(2)}
          opacity={frac > 0 ? 1 : 0}
        />
      </svg>
      <div class="ui-timer-center">{children}</div>
    </div>
  );
}
