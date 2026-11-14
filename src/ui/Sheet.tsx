import { createPortal, type ComponentChildren } from 'preact';
import { useEffect, useId, useRef } from 'preact/hooks';
import { cx, IconButton } from './Button.tsx';

export interface SheetProps {
  open: boolean;
  /** Chamado quando o usuário pede para fechar: Esc, toque no fundo, arrastar para baixo ou o botão de fechar. */
  onClose: () => void;
  title: string;
  children?: ComponentChildren;
  /** Rodapé fixo da folha, com as ações (Cancelar, Salvar). */
  footer?: ComponentChildren;
}

/* ---- trava da página enquanto houver folha aberta (conta folhas empilhadas) ---- */
let abertas = 0;
let inertes: HTMLElement[] = [];
let overflowAntes = '';
let kbWatch: (() => void) | null = null;

function travar(): void {
  if (abertas++ > 0) return;
  // tudo que não é camada do kit (folha, toasts) fica inerte para toque, teclado e leitor de tela
  for (const el of Array.from(document.body.children)) {
    if (el instanceof HTMLElement && !el.hasAttribute('data-ui-layer') && !el.inert) {
      el.inert = true;
      inertes.push(el);
    }
  }
  overflowAntes = document.body.style.overflow;
  document.body.style.overflow = 'hidden';
  document.documentElement.setAttribute('data-ui-sheet', '');
  const vv = window.visualViewport;
  if (vv) {
    // altura do teclado virtual: a folha sobe junto (o iPhone não encolhe a página quando o teclado abre)
    kbWatch = () => document.documentElement.style.setProperty('--kb', `${Math.max(0, Math.round(window.innerHeight - vv.height))}px`);
    vv.addEventListener('resize', kbWatch);
    kbWatch();
  }
}

function destravar(): void {
  if (--abertas > 0) return;
  abertas = 0;
  for (const el of inertes) el.inert = false;
  inertes = [];
  document.body.style.overflow = overflowAntes;
  document.documentElement.removeAttribute('data-ui-sheet');
  if (kbWatch) window.visualViewport?.removeEventListener('resize', kbWatch);
  kbWatch = null;
  document.documentElement.style.setProperty('--kb', '0px');
}

const FOCAVEIS =
  'a[href],button:not([disabled]),input:not([type=hidden]):not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';
const focaveis = (root: HTMLElement): HTMLElement[] =>
  Array.from(root.querySelectorAll<HTMLElement>(FOCAVEIS)).filter((el) => !el.closest('[hidden]') && el.getClientRects().length > 0);

const ARRASTO_FECHA = 80; // px para baixo

/**
 * Folha de baixo (bottom sheet). Renderiza num portal em document.body. Enquanto aberta: o resto da página
 * fica inerte e sem rolagem, o foco fica preso nela e volta para quem abriu ao fechar.
 * Fecha por Esc, toque no fundo, arrastar o topo para baixo ou pelo botão de fechar (sempre via onClose).
 */
export function Sheet({ open, onClose, title, children, footer }: SheetProps) {
  const titleId = useId();
  const overlayRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!open) return;
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    travar();
    sheetRef.current?.focus({ preventScroll: true });

    const onKey = (e: KeyboardEvent): void => {
      const overlay = overlayRef.current;
      if (!overlay) return;
      // só a folha de cima responde
      const camadas = document.querySelectorAll('.ui-overlay');
      if (camadas[camadas.length - 1] !== overlay) return;
      if (e.key === 'Escape') {
        e.preventDefault();
        onCloseRef.current();
        return;
      }
      if (e.key !== 'Tab') return;
      const els = focaveis(overlay);
      const first = els[0];
      const last = els[els.length - 1];
      if (!first || !last) {
        e.preventDefault();
        return;
      }
      const a = document.activeElement;
      const dentro = a instanceof Node && overlay.contains(a) && a !== sheetRef.current;
      if (e.shiftKey && (a === first || !dentro)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (a === last || !dentro)) {
        e.preventDefault();
        first.focus();
      }
    };
    // campo focado no celular: depois que o teclado sobe, o campo vai para o meio da folha
    const onFocusIn = (e: FocusEvent): void => {
      const el = e.target;
      if (!(el instanceof HTMLElement) || !/^(INPUT|SELECT|TEXTAREA)$/.test(el.tagName)) return;
      if (!overlayRef.current?.contains(el) || !matchMedia('(pointer:coarse)').matches) return;
      window.setTimeout(() => {
        if (document.activeElement === el) {
          el.scrollIntoView({ block: 'center', behavior: matchMedia('(prefers-reduced-motion:reduce)').matches ? 'auto' : 'smooth' });
        }
      }, 250);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('focusin', onFocusIn);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('focusin', onFocusIn);
      destravar();
      if (opener && opener.isConnected && opener !== document.body) opener.focus({ preventScroll: true });
    };
  }, [open]);

  if (!open || typeof document === 'undefined') return null;

  // arrastar o topo (alça e título) para baixo: passou de 80 px, fecha; senão, volta
  const onGrab = (e: PointerEvent): void => {
    const sheet = sheetRef.current;
    const grab = e.currentTarget;
    if (!sheet || !(grab instanceof HTMLElement)) return;
    if (e.target instanceof Element && e.target.closest('button,a,input')) return;
    const y0 = e.clientY;
    let dy = 0;
    try {
      grab.setPointerCapture(e.pointerId);
    } catch {
      /* ponteiro já solto */
    }
    sheet.classList.add('is-dragging');
    const move = (ev: PointerEvent): void => {
      dy = Math.max(0, ev.clientY - y0);
      sheet.style.transform = `translateY(${dy}px)`;
    };
    const up = (): void => {
      grab.removeEventListener('pointermove', move);
      grab.removeEventListener('pointerup', up);
      grab.removeEventListener('pointercancel', up);
      sheet.classList.remove('is-dragging');
      sheet.style.transform = '';
      if (dy > ARRASTO_FECHA) onCloseRef.current();
    };
    grab.addEventListener('pointermove', move);
    grab.addEventListener('pointerup', up);
    grab.addEventListener('pointercancel', up);
  };

  const hasFooter = footer != null && footer !== false;
  return createPortal(
    <div
      ref={overlayRef}
      class="ui-overlay"
      data-ui-layer=""
      onClick={(e) => {
        if (e.target === e.currentTarget) onCloseRef.current();
      }}
    >
      <div ref={sheetRef} class={cx('ui-sheet', hasFooter && 'has-foot')} role="dialog" aria-modal="true" aria-labelledby={titleId} tabIndex={-1}>
        <div class="ui-sheet-grab" onPointerDown={onGrab}>
          <div class="ui-sheet-handle" aria-hidden="true" />
          <div class="ui-sheet-head">
            <h2 class="ui-sheet-title" id={titleId}>
              {title}
            </h2>
            <IconButton icon="fechar" label="Fechar" onClick={() => onCloseRef.current()} />
          </div>
        </div>
        <div class="ui-sheet-body">{children}</div>
        {hasFooter ? <div class="ui-sheet-foot">{footer}</div> : null}
      </div>
    </div>,
    document.body,
  );
}
