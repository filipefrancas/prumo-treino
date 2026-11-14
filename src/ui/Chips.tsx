interface ChipsBase<T extends string> {
  options: { v: T; l: string }[];
  /** Nome do grupo para leitores de tela (não aparece). */
  label?: string;
}

export type ChipsProps<T extends string> = ChipsBase<T> &
  (
    | { multi?: false; value: T | undefined; onChange: (v: T) => void }
    | { multi: true; value: T[]; onChange: (v: T[]) => void }
  );

/**
 * Chips alternáveis de um toque. Sem `multi`, escolha única (tocar no ativo não desmarca).
 * Com `multi`, o valor é uma lista e cada toque liga ou desliga um chip.
 */
export function Chips<T extends string>(props: ChipsProps<T>) {
  const isOn = (v: T): boolean => (props.multi ? props.value.includes(v) : props.value === v);
  const toggle = (v: T): void => {
    if (props.multi) props.onChange(props.value.includes(v) ? props.value.filter((x) => x !== v) : [...props.value, v]);
    else if (props.value !== v) props.onChange(v);
  };
  return (
    <div class="ui-chips" role="group" aria-label={props.label}>
      {props.options.map((o) => (
        <button key={o.v} type="button" class="ui-chip" aria-pressed={isOn(o.v)} onClick={() => toggle(o.v)}>
          {o.l}
        </button>
      ))}
    </div>
  );
}
