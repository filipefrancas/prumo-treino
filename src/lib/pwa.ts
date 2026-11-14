/**
 * Situação do app instalado, para a tela de Ajustes: se já dá para usar sem internet e se está aberto pela
 * Tela de Início. Quem registra o service worker é `main.tsx`; aqui fica só o estado.
 */
import { useEffect, useState } from 'preact/hooks';

export interface PwaStatus {
  /** O service worker já guardou o app inteiro: "Pronto para usar sem internet". */
  offlineReady: boolean;
  /** Aberto como app (Tela de Início), não em uma aba do navegador. */
  standalone: boolean;
}

let offlineReady = false;
let observando = false;
const ouvintes = new Set<() => void>();

function avisar(): void {
  for (const fn of [...ouvintes]) fn();
}

/** Chamado pelo registro do service worker (onOfflineReady) quando o precache termina. */
export function marcarOfflineReady(): void {
  if (offlineReady) return;
  offlineReady = true;
  avisar();
}

/**
 * Nas aberturas seguintes o `onOfflineReady` não dispara de novo: um service worker ativo já significa que o
 * app está guardado. Sem service worker (desenvolvimento, navegador sem suporte), nada acontece.
 */
export function observarServiceWorker(): void {
  if (observando || typeof navigator === 'undefined' || !('serviceWorker' in navigator)) return;
  observando = true;
  try {
    void navigator.serviceWorker.ready
      .then((reg) => {
        if (reg.active) marcarOfflineReady();
      })
      .catch(() => {
        /* sem service worker */
      });
  } catch {
    /* sem service worker */
  }
}

/** O app está aberto pela Tela de Início? (iPhone: `navigator.standalone`; demais: display-mode.) */
export function emStandalone(): boolean {
  if (typeof window === 'undefined') return false;
  const nav = window.navigator as Navigator & { standalone?: boolean };
  if (nav.standalone === true) return true;
  try {
    return window.matchMedia('(display-mode: standalone)').matches;
  } catch {
    return false;
  }
}

/** Leitura fora de componentes. */
export function pwaStatus(): PwaStatus {
  return { offlineReady, standalone: emStandalone() };
}

/** Hook: redesenha quando o app fica pronto para uso sem internet ou muda o modo de exibição. */
export function usePwa(): PwaStatus {
  const [status, setStatus] = useState<PwaStatus>(pwaStatus);
  useEffect(() => {
    const atualizar = (): void => {
      const novo = pwaStatus();
      setStatus((antigo) => (antigo.offlineReady === novo.offlineReady && antigo.standalone === novo.standalone ? antigo : novo));
    };
    ouvintes.add(atualizar);
    observarServiceWorker();
    atualizar();
    let mq: MediaQueryList | undefined;
    try {
      mq = window.matchMedia('(display-mode: standalone)');
      mq.addEventListener('change', atualizar);
    } catch {
      mq = undefined;
    }
    return () => {
      ouvintes.delete(atualizar);
      mq?.removeEventListener('change', atualizar);
    };
  }, []);
  return status;
}
