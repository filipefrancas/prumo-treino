import { cx } from './Button.tsx';

export interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  /** Linha menor abaixo do rótulo. */
  hint?: string;
  disabled?: boolean;
  /** Sem caixa nem borda, para usar como linha dentro de um card ou de uma lista. */
  bare?: boolean;
}

/** Interruptor em linha inteira: o toque em qualquer ponto da linha alterna. */
export function Toggle({ checked, onChange, label, hint, disabled = false, bare = false }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      class={cx('ui-toggle', bare && 'is-bare')}
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
    >
      <span class="ui-toggle-t">
        <b>{label}</b>
        {hint ? <small>{hint}</small> : null}
      </span>
      <span class="ui-sw" aria-hidden="true" />
    </button>
  );
}
