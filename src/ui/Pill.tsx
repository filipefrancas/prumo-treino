import type { ComponentChildren } from 'preact';
import { cx } from './Button.tsx';
import { Icon, type IconName } from './Icon.tsx';

export type PillTone = 'good' | 'warn' | 'crit' | 'muted' | 'accent' | 'corrida' | 'musc' | 'mob' | 'peso';

export interface PillProps {
  /** Estado (good, warn, crit), neutro (muted, padrão), destaque (accent) ou a cor de uma área. */
  tone?: PillTone;
  /** Ícone à esquerda. Sem ele, 'good' leva o check e 'crit' o alerta (a cor nunca vai sozinha). */
  icon?: IconName | false;
  children?: ComponentChildren;
}

/** Selo de estado, não clicável. Texto em minúsculas: "feito", "pendente", "no relógio". */
export function Pill({ tone = 'muted', icon, children }: PillProps) {
  const glyph: IconName | false = icon ?? (tone === 'good' ? 'check' : tone === 'crit' ? 'alerta' : false);
  return (
    <span class={cx('ui-pill', `is-${tone}`)}>
      {glyph ? <Icon name={glyph} size={12} /> : null}
      {children}
    </span>
  );
}

/** Etiqueta mono em caixa alta (a caixa alta é do CSS): "pré", "aquecimento", "descanso". */
export function Tag({ children }: { children?: ComponentChildren }) {
  return <span class="ui-tag">{children}</span>;
}
