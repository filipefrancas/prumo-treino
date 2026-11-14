import type { ComponentChildren } from 'preact';
import { useLayoutEffect, useRef } from 'preact/hooks';
import { back as voltar, go } from '../lib/router.ts';
import { cx, IconButton } from './Button.tsx';

export interface ScreenProps {
  title: string;
  /** Rótulo mono em caixa alta acima do título (a caixa alta é do CSS: escreva em caixa normal). */
  eyebrow?: string;
  /** true: volta no histórico (sem histórico, vai para Hoje). Texto: vai para essa rota ('/corrida'). */
  back?: boolean | string;
  /** Ações à direita do título (IconButton). */
  actions?: ComponentChildren;
  /** Rodapé fixo com as ações principais, acima da barra de abas. */
  footer?: ComponentChildren;
  /** Reserva espaço para a barra de abas (padrão true). Use false nas telas de tocar, que escondem a barra. */
  tabs?: boolean;
  /** Conteúdo sem o respiro lateral (para faixas e listas de ponta a ponta). */
  flush?: boolean;
  children?: ComponentChildren;
}

// O roteador sabe se há tela anterior DENTRO do app (history.length também conta páginas de fora).
function goBack(back: boolean | string): void {
  if (typeof back === 'string') go(back);
  else voltar();
}

/** Tela: cabeçalho (rótulo, título, voltar, ações), conteúdo que rola com a página e rodapé fixo opcional. */
export function Screen({ title, eyebrow, back, actions, footer, tabs = true, flush = false, children }: ScreenProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const footRef = useRef<HTMLDivElement>(null);
  const hasFooter = footer != null && footer !== false;

  // o conteúdo ganha, no fim, a altura real do rodapé fixo (ela muda com o texto e com a quantidade de botões)
  useLayoutEffect(() => {
    const root = rootRef.current;
    const foot = footRef.current;
    if (!root) return;
    if (!foot) {
      root.style.removeProperty('--ui-foot-h');
      return;
    }
    const sync = () => root.style.setProperty('--ui-foot-h', `${Math.round(foot.getBoundingClientRect().height)}px`);
    sync();
    if (typeof ResizeObserver !== 'function') return;
    const ro = new ResizeObserver(sync);
    ro.observe(foot);
    return () => ro.disconnect();
  }, [hasFooter]);

  return (
    <div ref={rootRef} class={cx('ui-screen', tabs && 'has-tabs', flush && 'is-flush')}>
      <header class="ui-screen-head">
        {back !== undefined && back !== false ? (
          <IconButton class="ui-screen-back" icon="voltar" label="Voltar" size="lg" onClick={() => goBack(back)} />
        ) : null}
        <div class="ui-screen-titles">
          {eyebrow ? <div class="ui-eyebrow">{eyebrow}</div> : null}
          <h1 class="ui-screen-title">{title}</h1>
        </div>
        {actions != null && actions !== false ? <div class="ui-screen-actions">{actions}</div> : null}
      </header>
      <main class="ui-screen-body">{children}</main>
      {hasFooter ? (
        <div ref={footRef} class="ui-screen-foot">
          <div class="ui-screen-foot-in">{footer}</div>
        </div>
      ) : null}
    </div>
  );
}
