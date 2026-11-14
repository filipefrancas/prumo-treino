/**
 * Ponto de entrada: estilos, estado, tema, service worker e a casca do app.
 */
import { render } from 'preact';
import { registerSW } from 'virtual:pwa-register';
import './styles/fonts.css';
import './styles/tokens.css';
import './styles/base.css';
import './styles/ui.css';
import './styles/viz.css';
import './styles/figure.css';
import './styles/media.css';
import { App } from './app.tsx';
import { carregarMidia } from './lib/midia.ts';
import { marcarOfflineReady, observarServiceWorker } from './lib/pwa.ts';
import { getState, loadState, subscribe } from './lib/store.ts';
import type { Settings } from './types.ts';

type Tema = Settings['tema'];

/** As metas theme-color do index.html (uma por esquema de cores) e o valor original de cada uma. */
const metasDeCor: { el: HTMLMetaElement; original: string }[] = Array.from(
  document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]'),
).map((el) => ({ el, original: el.content }));

let temaAplicado: Tema | undefined;

/**
 * 'escuro' → data-theme="dark"; 'claro' → "light"; 'auto' → sem atributo (vale o esquema do aparelho).
 * A cor da barra de status acompanha: com tema fixo, as duas metas recebem o fundo em uso (--bg);
 * no automático, voltam aos valores do index.html.
 */
function aplicarTema(tema: Tema): void {
  if (tema === temaAplicado) return;
  temaAplicado = tema;
  const raiz = document.documentElement;
  if (tema === 'escuro') raiz.setAttribute('data-theme', 'dark');
  else if (tema === 'claro') raiz.setAttribute('data-theme', 'light');
  else raiz.removeAttribute('data-theme');

  if (tema === 'auto') {
    for (const m of metasDeCor) m.el.content = m.original;
    return;
  }
  const fundo = getComputedStyle(raiz).getPropertyValue('--bg').trim();
  if (fundo === '') return;
  for (const m of metasDeCor) m.el.content = fundo;
}

function registrarServiceWorker(): void {
  try {
    registerSW({
      immediate: true,
      onOfflineReady() {
        marcarOfflineReady();
      },
      // No iPhone, o app aberto pela Tela de Início costuma voltar da memória sem recarregar a página, e aí o
      // navegador não procura versão nova. Por isso a busca é refeita toda vez que o app volta para a frente
      // e, com ele aberto, a cada meia hora. Achando versão nova, o autoUpdate recarrega a página sozinho.
      onRegisteredSW(_url, reg) {
        if (!reg) return;
        const procurar = (): void => {
          if (document.visibilityState !== 'visible' || navigator.onLine === false) return;
          void reg.update().catch(() => {
            /* sem rede: tenta na próxima */
          });
        };
        document.addEventListener('visibilitychange', procurar);
        window.addEventListener('online', procurar);
        window.setInterval(procurar, 30 * 60 * 1000);
      },
    });
  } catch {
    /* sem service worker: o app segue funcionando com internet */
  }
  observarServiceWorker();
}

async function iniciar(): Promise<void> {
  try {
    await loadState();
  } catch {
    /* o store já cai no estado inicial quando o disco falha */
  }
  await carregarMidia(); // quais exercícios têm foto no aparelho (nunca rejeita)
  aplicarTema(getState().settings.tema);
  subscribe(() => aplicarTema(getState().settings.tema));
  registrarServiceWorker();
  const raiz = document.getElementById('app');
  if (raiz) render(<App />, raiz);
}

void iniciar();
