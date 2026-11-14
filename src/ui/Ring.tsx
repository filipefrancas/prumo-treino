import type { ComponentChildren } from 'preact';
import { clamp01, toneColor, type Tone } from './viz-util.ts';

export interface RingProps {
  /** Fração preenchida, de 0 a 1. */
  value: number;
  /** Diâmetro em px (padrão 124). */
  size?: number;
  /** Espessura do traço em px (padrão: proporcional ao tamanho). */
  stroke?: number;
  tone?: Tone;
  /** Número ou texto grande do centro ("3/6", "72%"). */
  label?: string;
  /** Legenda mono abaixo do número ("treinos"). */
  sub?: string;
  /** Conteúdo livre no centro, no lugar de label e sub. */
  children?: ComponentChildren;
  /** Descrição para leitor de tela. Sem ela, usa label e sub. */
  ariaLabel?: string;
  class?: string;
}

/** Anel de progresso do Prumo: trilho, arco na cor do tom e conteúdo no centro. */
export function Ring({ value, size = 124, stroke, tone = 'accent', label, sub, children, ariaLabel, class: cls }: RingProps) {
  const sw = stroke ?? Math.max(4, Math.round(size * 0.085));
  const r = (size - sw) / 2;
  const c = 2 * Math.PI * r;
  const v = clamp01(value);
  const desc = ariaLabel ?? ([label, sub].filter(Boolean).join(' ') || `${Math.round(v * 100)}%`);
  return (
    <div class={`ui-ring${cls ? ` ${cls}` : ''}`} style={{ '--size': `${size}px`, '--tone': toneColor(tone) }} role="img" aria-label={desc}>
      <svg viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        <circle class="ui-ring-track" cx={size / 2} cy={size / 2} r={r} fill="none" stroke-width={sw} />
        {v > 0 && (
          <circle
            class="ui-ring-fill"
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke-width={sw}
            stroke-linecap="round"
            stroke-dasharray={`${(c * v).toFixed(2)} ${c.toFixed(2)}`}
          />
        )}
      </svg>
      <div class="ui-ring-center" aria-hidden="true">
        {children ?? (
          <>
            {label !== undefined && <b class="num">{label}</b>}
            {sub && <span>{sub}</span>}
          </>
        )}
      </div>
    </div>
  );
}
