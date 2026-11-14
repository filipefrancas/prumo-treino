import { useEffect, useId, useRef, useState } from 'preact/hooks';
import { cx } from './Button.tsx';
import { Icon } from './Icon.tsx';

/** Número com vírgula decimal e sem zeros à direita: 82.5 → "82,5". */
export function fmtNum(v: number, casas = 2): string {
  const f = 10 ** casas;
  return String(Math.round(v * f) / f).replace('.', ',');
}

/** Lê um número digitado à brasileira ("82,5"). Vazio ou inválido → undefined. */
export function parseNum(texto: string): number | undefined {
  const s = texto.replace(/\s/g, '').replace(',', '.');
  if (!s) return undefined;
  const n = Number(s);
  return Number.isFinite(n) ? n : undefined;
}

const casasDe = (n: number): number => (String(n).split('.')[1] ?? '').length;

export interface StepperProps {
  value: number;
  onChange: (v: number) => void;
  /** Quanto cada toque em − ou + muda. */
  step: number;
  min?: number;
  max?: number;
  /** Unidade ao lado do valor: "kg", "reps", "s". */
  unit?: string;
  label: string;
  /** Versão grande, para a tela de treino (botões de 60 px, número de 36 px). */
  big?: boolean;
  /** Como mostrar o valor (padrão: vírgula decimal, sem zeros à direita). */
  format?: (v: number) => string;
  /** Esconde o rótulo (ele continua valendo para leitores de tela). */
  hideLabel?: boolean;
}

const ESPERA_MS = 420; // toque longo: depois disso começa a repetir
const REPETE_MS = 90;

/**
 * Número com botões − e +. Toque longo em um botão repete; tocar no valor abre a digitação (aceita vírgula).
 * O valor nunca sai da faixa min..max.
 */
export function Stepper({ value, onChange, step, min, max, unit, label, big = false, format = fmtNum, hideLabel = false }: StepperProps) {
  const id = useId();
  const [text, setText] = useState<string | null>(null); // não nulo = digitando
  const inputRef = useRef<HTMLInputElement>(null);
  const valueRef = useRef(value);
  valueRef.current = value;
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  const timers = useRef<{ wait?: number; rep?: number; repeated: boolean }>({ repeated: false });

  const clamp = (v: number): number => Math.min(max ?? Infinity, Math.max(min ?? -Infinity, v));

  const bump = (dir: 1 | -1): void => {
    const cur = valueRef.current;
    const next = clamp(Number((cur + dir * step).toFixed(Math.max(casasDe(step), casasDe(cur)))));
    if (next === cur) return;
    valueRef.current = next;
    onChangeRef.current(next);
  };

  const stop = (): void => {
    const t = timers.current;
    if (t.wait !== undefined) clearTimeout(t.wait);
    if (t.rep !== undefined) clearInterval(t.rep);
    t.wait = undefined;
    t.rep = undefined;
  };
  useEffect(() => stop, []);

  const hold = (dir: 1 | -1) => ({
    onPointerDown: (e: PointerEvent) => {
      if (e.button !== 0) return;
      stop();
      timers.current.repeated = false;
      timers.current.wait = window.setTimeout(() => {
        timers.current.repeated = true;
        bump(dir);
        timers.current.rep = window.setInterval(() => bump(dir), REPETE_MS);
      }, ESPERA_MS);
    },
    onPointerUp: stop,
    onPointerLeave: stop,
    onPointerCancel: stop,
    onContextMenu: (e: Event) => e.preventDefault(),
    // o clique (toque curto ou teclado) dá um passo; depois de uma repetição, o clique de soltar é ignorado
    onClick: () => {
      if (timers.current.repeated) {
        timers.current.repeated = false;
        return;
      }
      bump(dir);
    },
  });

  const editing = text !== null;
  useEffect(() => {
    if (!editing) return;
    const el = inputRef.current;
    if (!el) return;
    el.focus();
    el.select();
  }, [editing]);

  const commit = (): void => {
    if (text === null) return;
    const n = parseNum(text);
    setText(null);
    if (n === undefined) return;
    const next = clamp(n);
    if (next !== valueRef.current) onChangeRef.current(next);
  };

  const shown = format(value);
  return (
    <div class={cx('ui-stepper', big && 'is-big')}>
      <span class={hideLabel ? 'sr-only' : 'ui-label'} id={id}>
        {label}
      </span>
      <div class={cx('ui-stepper-ctl', editing && 'is-editing')} role="group" aria-labelledby={id}>
        <button
          type="button"
          class="ui-stepper-btn"
          aria-label={`${label}: menos ${fmtNum(step)}`}
          disabled={min !== undefined && value <= min}
          {...hold(-1)}
        >
          <Icon name="menos" size={big ? 24 : 20} />
        </button>
        {editing ? (
          <input
            ref={inputRef}
            class="ui-stepper-input num"
            type="text"
            inputMode={casasDe(step) > 0 ? 'decimal' : 'numeric'}
            autocomplete="off"
            enterkeyhint="done"
            aria-label={label}
            value={text}
            onInput={(e) => setText(e.currentTarget.value)}
            onBlur={commit}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                commit();
              } else if (e.key === 'Escape') {
                e.stopPropagation();
                setText(null);
              }
            }}
          />
        ) : (
          <button
            type="button"
            class="ui-stepper-val num"
            aria-label={`${label}: ${shown}${unit ? ` ${unit}` : ''}. Toque para digitar`}
            onClick={() => setText(fmtNum(value))}
          >
            <span class="ui-stepper-num">
              <b>{shown}</b>
              {unit ? <small>{unit}</small> : null}
            </span>
          </button>
        )}
        <button
          type="button"
          class="ui-stepper-btn"
          aria-label={`${label}: mais ${fmtNum(step)}`}
          disabled={max !== undefined && value >= max}
          {...hold(1)}
        >
          <Icon name="mais" size={big ? 24 : 20} />
        </button>
      </div>
    </div>
  );
}
