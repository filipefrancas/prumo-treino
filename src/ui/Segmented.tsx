import { cx } from './Button.tsx';

export interface SegmentedProps<T extends string> {
  options: { v: T; l: string }[];
  value: T;
  onChange: (v: T) => void;
  /** Nome do grupo para leitores de tela (não aparece). */
  label: string;
  /** sm: seletor compacto que não ocupa a largura toda (período de um gráfico, no canto de um card). */
  size?: 'sm' | 'md';
}

/** Controle segmentado: um trilho com a opção ativa em pastilha. Escolha única, sempre com um valor. */
export function Segmented<T extends string>({ options, value, onChange, label, size = 'md' }: SegmentedProps<T>) {
  return (
    <div class={cx('ui-seg', size === 'sm' && 'is-sm')} role="group" aria-label={label}>
      {options.map((o) => (
        <button
          key={o.v}
          type="button"
          aria-pressed={o.v === value}
          onClick={() => {
            if (o.v !== value) onChange(o.v);
          }}
        >
          {o.l}
        </button>
      ))}
    </div>
  );
}
