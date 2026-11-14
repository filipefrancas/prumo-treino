import type { ComponentChildren } from 'preact';
import { toChildArray } from 'preact';
import { isAreaTone, toneColor, type Tone } from './viz-util.ts';

export interface StatDelta {
  /** Texto já formatado: "+2,5 kg", "−12%". */
  text: string;
  /** Direção da seta. Sem ela, só o texto. */
  dir?: 'up' | 'down' | 'flat';
  /** Cor da variação (padrão: neutra). Subir nem sempre é bom: quem decide é a tela. */
  tone?: 'good' | 'warn' | 'crit' | 'muted';
}

export interface StatProps {
  label: string;
  /** Valor já formatado (ou número). `null`, `undefined` ou vazio mostram "—". */
  value?: string | number | null;
  unit?: string;
  /** Linha de apoio abaixo do valor. */
  sub?: ComponentChildren;
  /** Tom de área (corrida, musc, mob, peso): quadradinho no rótulo. Tom de estado (good, warn, crit, accent): cor do número. */
  tone?: Tone;
  delta?: StatDelta;
  class?: string;
}

const SETA: Record<'up' | 'down' | 'flat', string> = {
  up: 'M5 1.5 9 8H1z',
  down: 'M5 8.5 1 2h8z',
  flat: 'M1 4h8v2H1z',
};

/** KPI do Prumo: rótulo, valor em display 600 com unidade pequena e uma linha de apoio. */
export function Stat({ label, value, unit, sub, tone, delta, class: cls }: StatProps) {
  const vazio = value === null || value === undefined || value === '';
  const area = isAreaTone(tone);
  const txt = typeof value === 'number' ? String(value).replace('.', ',') : value;
  return (
    <div class={`ui-stat${tone && !area ? ' ui-stat--tinted' : ''}${cls ? ` ${cls}` : ''}`} style={tone ? { '--tone': toneColor(tone) } : undefined}>
      <div class="ui-stat-lab">
        {area && <i class="ui-stat-dot" aria-hidden="true" />}
        <span>{label}</span>
      </div>
      <div class="ui-stat-val num">
        {vazio ? '—' : txt}
        {!vazio && unit ? <small>{unit}</small> : null}
      </div>
      {(sub || delta) && (
        <div class="ui-stat-foot">
          {delta && (
            <span class={`ui-stat-delta num ui-stat-delta--${delta.tone ?? 'muted'}`}>
              {delta.dir && (
                <svg viewBox="0 0 10 10" width="8" height="8" aria-hidden="true">
                  <path d={SETA[delta.dir]} fill="currentColor" />
                </svg>
              )}
              {delta.text}
            </span>
          )}
          {sub && <span class="ui-stat-sub">{sub}</span>}
        </div>
      )}
    </div>
  );
}

/** Grade de KPIs lado a lado: de 2 a 4 colunas, conforme a quantidade de filhos. */
export function StatRow({ children, class: cls }: { children: ComponentChildren; class?: string }) {
  const n = Math.min(4, Math.max(2, toChildArray(children).length));
  return <div class={`ui-stat-row ui-stat-row--${n}${cls ? ` ${cls}` : ''}`}>{children}</div>;
}
