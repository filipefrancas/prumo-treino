import { createPortal } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { cx } from './Button.tsx';

export interface ToastOptions {
  /** ok: deu certo (faixa verde). erro: não deu (faixa vermelha). info: aviso neutro (faixa âmbar). */
  tone?: 'ok' | 'erro' | 'info';
  /** Uma ação dentro do aviso, como "Desfazer". Com ação o aviso fica 5 s por padrão. */
  action?: { label: string; onClick: () => void };
  /** Quanto tempo fica na tela (padrão 2200 ms). */
  ms?: number;
}

interface ToastState extends ToastOptions {
  id: number;
  msg: string;
}

let atual: ToastState | null = null;
let seq = 0;
let timer: number | undefined;
const ouvintes = new Set<() => void>();

function publicar(next: ToastState | null): void {
  atual = next;
  for (const fn of ouvintes) fn();
}

/** Mostra um aviso curto (um por vez: o novo substitui o anterior). Precisa de um <ToastHost/> montado no app. */
export function toast(msg: string, opts: ToastOptions = {}): void {
  if (timer !== undefined) clearTimeout(timer);
  const ms = opts.ms !== undefined && opts.ms > 0 ? opts.ms : opts.action ? 5000 : 2200;
  publicar({ ...opts, id: ++seq, msg });
  timer = window.setTimeout(() => publicar(null), ms);
}

/** Fecha o aviso que estiver na tela. */
export function dismissToast(): void {
  if (timer !== undefined) clearTimeout(timer);
  publicar(null);
}

/** Região dos avisos: uma por app. Fica acima da barra de abas; com uma folha aberta, sobe para o topo. */
export function ToastHost() {
  const [t, setT] = useState<ToastState | null>(atual);
  useEffect(() => {
    const fn = (): void => setT(atual);
    ouvintes.add(fn);
    fn();
    return () => {
      ouvintes.delete(fn);
    };
  }, []);
  if (typeof document === 'undefined') return null;
  return createPortal(
    <div class="ui-toast-host" data-ui-layer="" role="status" aria-live="polite" aria-atomic="true">
      {t ? (
        <div key={t.id} class={cx('ui-toast', t.tone && `is-${t.tone}`)}>
          <span>{t.msg}</span>
          {t.action ? (
            <button
              type="button"
              class="ui-toast-act"
              onClick={() => {
                const act = t.action;
                dismissToast();
                act?.onClick();
              }}
            >
              {t.action.label}
            </button>
          ) : null}
        </div>
      ) : null}
    </div>,
    document.body,
  );
}
