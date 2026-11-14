import { createContext, type ComponentChildren } from 'preact';
import { useContext, useEffect, useId, useState } from 'preact/hooks';
import { cx } from './Button.tsx';
import { fmtNum, parseNum } from './Stepper.tsx';

interface FieldInfo {
  id: string;
  describedBy?: string;
  invalid: boolean;
}
const FieldCtx = createContext<FieldInfo | null>(null);

export interface FieldProps {
  label: string;
  /** Dica curta abaixo do campo. */
  hint?: string;
  /** Mensagem de erro (diz o que fazer). Com ela o campo fica com a borda vermelha. */
  error?: string;
  /** Use quando o conteúdo não é um campo de texto, e sim um grupo de botões (Chips, Segmented…). */
  group?: boolean;
  children?: ComponentChildren;
}

/** Rótulo + controle + dica ou erro. Os campos do kit postos dentro dele já saem ligados ao rótulo. */
export function Field({ label, hint, error, group = false, children }: FieldProps) {
  const id = useId();
  const hintId = `${id}-d`;
  const errId = `${id}-e`;
  const describedBy = [error ? errId : '', hint ? hintId : ''].filter(Boolean).join(' ') || undefined;
  const labelId = `${id}-l`;
  return (
    <div class={cx('ui-field', error && 'has-error')} role={group ? 'group' : undefined} aria-labelledby={group ? labelId : undefined}>
      {group ? (
        <span class="ui-label" id={labelId}>
          {label}
        </span>
      ) : (
        <label class="ui-label" for={id}>
          {label}
        </label>
      )}
      <FieldCtx.Provider value={{ id, describedBy, invalid: Boolean(error) }}>{children}</FieldCtx.Provider>
      {error ? (
        <p class="ui-err" id={errId} role="alert">
          {error}
        </p>
      ) : null}
      {hint ? (
        <p class="ui-hint" id={hintId}>
          {hint}
        </p>
      ) : null}
    </div>
  );
}

interface InputBase {
  /** Sem Field em volta, informe id ou aria-label. */
  id?: string;
  'aria-label'?: string;
  placeholder?: string;
  disabled?: boolean;
  name?: string;
}

function useFieldAttrs(p: InputBase) {
  const f = useContext(FieldCtx);
  return {
    id: p.id ?? f?.id,
    name: p.name,
    placeholder: p.placeholder,
    disabled: p.disabled,
    'aria-label': p['aria-label'],
    'aria-describedby': f?.describedBy,
    'aria-invalid': f?.invalid ? ('true' as const) : undefined,
  };
}

export interface TextInputProps extends InputBase {
  value: string;
  onChange: (v: string) => void;
  /** 'search' ganha o teclado com a tecla de buscar. */
  type?: 'text' | 'search';
  /** Teclado do celular para e-mail ou endereço, sem mudar o tipo do campo. */
  inputMode?: 'text' | 'email' | 'url';
  maxLength?: number;
  autocomplete?: string;
}

export function TextInput({ value, onChange, type = 'text', inputMode, maxLength, autocomplete = 'off', ...rest }: TextInputProps) {
  const attrs = useFieldAttrs(rest);
  const common = {
    ...attrs,
    class: 'ui-input',
    inputMode,
    maxLength,
    autocomplete,
    value,
    onInput: (e: InputEvent) => {
      if (e.currentTarget instanceof HTMLInputElement) onChange(e.currentTarget.value);
    },
  };
  return type === 'search' ? <input {...common} type="search" enterkeyhint="search" /> : <input {...common} type="text" />;
}

export interface NumberInputProps extends InputBase {
  value: number | undefined;
  onChange: (v: number | undefined) => void;
  /** Só inteiros (teclado numérico sem vírgula). */
  int?: boolean;
  /** Unidade mostrada à direita, dentro do campo: "kg", "bpm", "min". */
  unit?: string;
  min?: number;
  max?: number;
}

/**
 * Campo de número em texto (inputmode decimal), que aceita vírgula. Campo vazio ou inválido vale undefined.
 * min e max são aplicados ao sair do campo.
 */
export function NumberInput({ value, onChange, int = false, unit, min, max, ...rest }: NumberInputProps) {
  const attrs = useFieldAttrs(rest);
  const [text, setText] = useState(value === undefined ? '' : fmtNum(value));
  // valor mudado por fora (outro controle, restauração): o texto acompanha, sem atrapalhar quem está digitando "82,"
  useEffect(() => {
    setText((t) => (parseNum(t) === value ? t : value === undefined ? '' : fmtNum(value)));
  }, [value]);

  const read = (t: string): number | undefined => {
    const n = parseNum(t);
    return n === undefined ? undefined : int ? Math.round(n) : n;
  };
  const input = (
    <input
      {...attrs}
      class={cx('ui-input num', unit && 'has-unit')}
      type="text"
      inputMode={int ? 'numeric' : 'decimal'}
      autocomplete="off"
      value={text}
      onInput={(e) => {
        const t = e.currentTarget.value;
        setText(t);
        const n = read(t);
        if (n !== value) onChange(n);
      }}
      onBlur={() => {
        const n = read(text);
        if (n === undefined) {
          if (text.trim()) setText('');
          return;
        }
        const c = Math.min(max ?? Infinity, Math.max(min ?? -Infinity, n));
        setText(fmtNum(c));
        if (c !== value) onChange(c);
      }}
    />
  );
  if (!unit) return input;
  return (
    <span class="ui-input-wrap">
      {input}
      <span class="ui-input-unit" aria-hidden="true">
        {unit}
      </span>
    </span>
  );
}

export interface TextAreaProps extends InputBase {
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  maxLength?: number;
}

export function TextArea({ value, onChange, rows = 3, maxLength, ...rest }: TextAreaProps) {
  const attrs = useFieldAttrs(rest);
  return <textarea {...attrs} class="ui-input" rows={rows} maxLength={maxLength} value={value} onInput={(e) => onChange(e.currentTarget.value)} />;
}

export interface DateInputProps extends InputBase {
  /** Data local 'AAAA-MM-DD' ('' = vazio). */
  value: string;
  onChange: (v: string) => void;
  min?: string;
  max?: string;
}

/** Campo de data nativo (no iPhone abre o seletor do sistema). */
export function DateInput({ value, onChange, min, max, ...rest }: DateInputProps) {
  const attrs = useFieldAttrs(rest);
  return <input {...attrs} class="ui-input num" type="date" min={min} max={max} value={value} onInput={(e) => onChange(e.currentTarget.value)} />;
}
