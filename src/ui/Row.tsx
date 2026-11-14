import type { ComponentChildren } from 'preact';
import { cx, toHref } from './Button.tsx';
import { Icon } from './Icon.tsx';

/** Lista: pilha de linhas separadas por um fio. */
export function List({ children }: { children?: ComponentChildren }) {
  return <div class="ui-list">{children}</div>;
}

export interface RowProps {
  title: ComponentChildren;
  /** Segunda linha, menor: fatos separados por " · ". */
  sub?: ComponentChildren;
  /** À esquerda: ícone, miniatura, número da série. */
  leading?: ComponentChildren;
  /** À direita: valor em destaque ou pill. Numa linha clicável, não ponha botões aqui (a linha já é o botão). */
  right?: ComponentChildren;
  /** Com href a linha inteira é um link; com onClick, um botão. */
  href?: string;
  onClick?: (e: MouseEvent) => void;
  /** Cor do valor à direita. 'muted' apaga a linha toda (item pulado, fora do plano). */
  tone?: 'default' | 'muted' | 'good' | 'warn' | 'crit' | 'accent';
  /** Seta à direita. Padrão: aparece nas linhas com href. */
  chevron?: boolean;
}

/** Linha de lista com 52 px ou mais. A linha inteira é o alvo de toque. */
export function Row({ title, sub, leading, right, href, onClick, tone = 'default', chevron = href !== undefined }: RowProps) {
  const klass = cx('ui-row', tone !== 'default' && `is-${tone}`);
  const inner = (
    <>
      {leading != null && leading !== false ? <span class="ui-row-lead">{leading}</span> : null}
      <span class="ui-row-main">
        <span class="ui-row-t">{title}</span>
        {sub != null && sub !== false ? <span class="ui-row-s">{sub}</span> : null}
      </span>
      {right != null && right !== false ? <span class="ui-row-r num">{right}</span> : null}
      {chevron ? <Icon name="avancar" size={16} class="ui-row-chev" /> : null}
    </>
  );
  if (href !== undefined) {
    return (
      <a class={klass} href={toHref(href)} onClick={onClick}>
        {inner}
      </a>
    );
  }
  if (onClick) {
    return (
      <button type="button" class={klass} onClick={onClick}>
        {inner}
      </button>
    );
  }
  return <div class={klass}>{inner}</div>;
}
