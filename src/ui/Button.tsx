import type { ComponentChildren } from 'preact';
import { Icon, type IconName } from './Icon.tsx';

/** Aceita '/corrida' (rota do app, vira '#/corrida') ou um endereço completo ('#/x', 'https://…'), usado como veio. */
export function toHref(href: string): string {
  return href.startsWith('/') ? `#${href}` : href;
}

/** Junta nomes de classe, ignorando os vazios. */
export function cx(...parts: (string | false | null | undefined)[]): string {
  return parts.filter(Boolean).join(' ');
}

export interface ButtonProps {
  /** primary: a ação principal da tela (uma só). soft (padrão): ação comum. ghost: terciária. danger: destrutiva. */
  variant?: 'primary' | 'soft' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  /** Ocupa a largura toda. */
  block?: boolean;
  icon?: IconName;
  /** Com href o botão é um link (<a>). */
  href?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onClick?: (e: MouseEvent) => void;
  children?: ComponentChildren;
  'aria-label'?: string;
  class?: string;
}

export function Button({
  variant = 'soft',
  size = 'md',
  block = false,
  icon,
  href,
  disabled = false,
  type = 'button',
  onClick,
  children,
  'aria-label': ariaLabel,
  class: cls,
}: ButtonProps) {
  const klass = cx('ui-btn', `is-${variant}`, size !== 'md' && `is-${size}`, block && 'is-block', cls);
  const inner = (
    <>
      {icon ? <Icon name={icon} size={size === 'lg' ? 20 : size === 'sm' ? 16 : 18} /> : null}
      {children != null && children !== false ? <span class="ui-btn-t">{children}</span> : null}
    </>
  );
  if (href !== undefined) {
    const external = /^https?:/.test(href);
    return (
      <a
        class={klass}
        href={disabled ? undefined : toHref(href)}
        aria-disabled={disabled ? 'true' : undefined}
        aria-label={ariaLabel}
        onClick={disabled ? undefined : onClick}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
      >
        {inner}
      </a>
    );
  }
  return (
    <button type={type} class={klass} disabled={disabled} aria-label={ariaLabel} onClick={onClick}>
      {inner}
    </button>
  );
}

export interface IconButtonProps {
  icon: IconName;
  /** Rótulo acessível (obrigatório: o botão não tem texto). */
  label: string;
  onClick?: (e: MouseEvent) => void;
  href?: string;
  /** sm 40 px, md 44 px (padrão), lg 52 px. O alvo de toque nunca fica abaixo de 44 px. */
  size?: 'sm' | 'md' | 'lg';
  /** Para botões de liga/desliga: vira aria-pressed e pinta o ativo de âmbar. */
  pressed?: boolean;
  disabled?: boolean;
  class?: string;
}

export function IconButton({ icon, label, onClick, href, size = 'md', pressed, disabled = false, class: cls }: IconButtonProps) {
  const klass = cx('ui-iconbtn', size !== 'md' && `is-${size}`, cls);
  const glyph = <Icon name={icon} size={size === 'lg' ? 24 : size === 'sm' ? 18 : 20} />;
  if (href !== undefined) {
    return (
      <a class={klass} href={toHref(href)} aria-label={label} onClick={onClick}>
        {glyph}
      </a>
    );
  }
  return (
    <button type="button" class={klass} aria-label={label} aria-pressed={pressed} disabled={disabled} onClick={onClick}>
      {glyph}
    </button>
  );
}
