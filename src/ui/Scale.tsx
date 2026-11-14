import { useId } from 'preact/hooks';

export interface ScaleProps {
  min: number;
  max: number;
  value: number | undefined;
  onChange: (v: number) => void;
  label: string;
  /** Rótulo da ponta de baixo da escala ("muito leve"). */
  left?: string;
  /** Rótulo da ponta de cima ("máximo"). */
  right?: string;
}

/** Escala de nota (1 a 5, 1 a 10): botões grandes. Até 6 valores ficam em uma linha; acima disso, em duas. */
export function Scale({ min, max, value, onChange, label, left, right }: ScaleProps) {
  const id = useId();
  const values: number[] = [];
  for (let i = min; i <= max; i++) values.push(i);
  const cols = values.length <= 6 ? values.length : Math.ceil(values.length / 2);
  return (
    <div class="ui-scale">
      <span class="ui-label" id={id}>
        {label}
      </span>
      <div class="ui-scale-opts" role="group" aria-labelledby={id} style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
        {values.map((n) => (
          <button
            key={n}
            type="button"
            class="num"
            aria-pressed={n === value}
            aria-label={n === min && left ? `${n}, ${left}` : n === max && right ? `${n}, ${right}` : undefined}
            onClick={() => onChange(n)}
          >
            {n}
          </button>
        ))}
      </div>
      {left || right ? (
        <div class="ui-scale-ends" aria-hidden="true">
          <span>{left ? `${min} · ${left}` : ''}</span>
          <span>{right ? `${max} · ${right}` : ''}</span>
        </div>
      ) : null}
    </div>
  );
}
