/**
 * Rotas por hash ("#/corrida/treino/x?a=1"). Rota vazia ou desconhecida leva a "/hoje".
 * Cada entrada do histórico leva um índice em history.state, para `back` saber se há para onde voltar
 * dentro do app. Tudo confere a existência de `window` (o módulo também roda em testes sem DOM).
 */
import { useEffect, useState } from 'preact/hooks';

export interface Route { path: string; parts: string[]; query: Record<string, string> }

/** Rota padrão. */
export const ROTA_INICIAL = '/hoje';

/** As rotas do app (SPEC, seção 3). */
export const ROTAS: readonly string[] = [
  '/hoje',
  '/corrida',
  '/corrida/treino/:id',
  '/corrida/guiada/:id',
  '/musculacao',
  '/musculacao/ficha/:id',
  '/musculacao/sessao',
  '/musculacao/historico',
  '/exercicios',
  '/exercicio/:id',
  '/mobilidade',
  '/mobilidade/rotina/:id',
  '/mobilidade/tocar/:id',
  '/progresso',
  '/ajustes',
  // só para desenvolvimento: galeria do kit de interface dentro do app
  '/kit',
];

function decodificar(s: string): string {
  try {
    return decodeURIComponent(s);
  } catch {
    return s;
  }
}

/**
 * Interpreta um hash (com ou sem "#"): '#/corrida/treino/x?a=1' → path '/corrida/treino/x', parts
 * ['corrida', 'treino', 'x'], query { a: '1' }. Hash vazio vira '/hoje'. Não confere se a rota existe.
 */
export function parseHash(hash: string): Route {
  let h = hash.trim();
  if (h.startsWith('#')) h = h.slice(1);
  const iq = h.indexOf('?');
  const caminho = iq >= 0 ? h.slice(0, iq) : h;
  const busca = iq >= 0 ? h.slice(iq + 1) : '';
  const parts = caminho.split('/').filter((p) => p !== '').map(decodificar);
  const query: Record<string, string> = {};
  if (busca !== '') {
    for (const [k, v] of new URLSearchParams(busca)) query[k] = v;
  }
  if (parts.length === 0) return { path: ROTA_INICIAL, parts: ROTA_INICIAL.split('/').filter((p) => p !== ''), query };
  return { path: `/${parts.join('/')}`, parts, query };
}

/** match(r, '/corrida/treino/:id') → { id: 'x' }; sem parâmetros → {}; não casou → null. */
export function match(route: Route, pattern: string): Record<string, string> | null {
  const molde = pattern.split('/').filter((p) => p !== '');
  if (molde.length !== route.parts.length) return null;
  const params: Record<string, string> = {};
  for (let i = 0; i < molde.length; i++) {
    const m = molde[i];
    const p = route.parts[i];
    if (m === undefined || p === undefined) return null;
    if (m.startsWith(':')) params[m.slice(1)] = p;
    else if (m !== p) return null;
  }
  return params;
}

/** A rota existe na tabela do app? */
export function rotaConhecida(route: Route): boolean {
  return ROTAS.some((r) => match(route, r) !== null);
}

/** Como `parseHash`, mas uma rota desconhecida também vira '/hoje'. */
export function resolverHash(hash: string): Route {
  const r = parseHash(hash);
  return rotaConhecida(r) ? r : parseHash(ROTA_INICIAL);
}

/** '#/corrida'. */
export function href(path: string): string {
  const p = path.startsWith('#') ? path.slice(1) : path;
  return `#${p.startsWith('/') ? p : `/${p}`}`;
}

/* ------------------------------------------------------------------ */
/* Navegador                                                           */
/* ------------------------------------------------------------------ */

const temJanela = (): boolean => typeof window !== 'undefined' && typeof window.location !== 'undefined';

const ouvintes = new Set<() => void>();
let ligado = false;
/** Posição da entrada atual no histórico do app (0 = entrada por onde o app abriu). */
let indice = 0;

function indiceDe(estado: unknown): number | undefined {
  if (typeof estado !== 'object' || estado === null) return undefined;
  const i = (estado as { i?: unknown }).i;
  return typeof i === 'number' && Number.isFinite(i) ? i : undefined;
}

function avisar(): void {
  for (const fn of [...ouvintes]) fn();
}

/** Lê o índice da entrada atual; entrada nova sem índice (link `<a href="#/…">`) recebe o próximo. */
function sincronizar(inicial: boolean): void {
  try {
    const i = indiceDe(window.history.state);
    if (i !== undefined) {
      indice = i;
      return;
    }
    indice = inicial ? 0 : indice + 1;
    window.history.replaceState({ i: indice }, '');
  } catch {
    /* histórico indisponível */
  }
}

function ligar(): void {
  if (ligado || !temJanela()) return;
  ligado = true;
  sincronizar(true);
  const aoMudar = (): void => {
    sincronizar(false);
    avisar();
  };
  try {
    window.addEventListener('hashchange', aoMudar);
    window.addEventListener('popstate', aoMudar);
  } catch {
    /* sem eventos */
  }
}

/** A rota atual: '#/corrida/treino/x?a=1' → path '/corrida/treino/x'. Sem janela (testes), devolve '/hoje'. */
export function currentRoute(): Route {
  if (!temJanela()) return parseHash('');
  ligar();
  return resolverHash(window.location.hash);
}

/** Vai para uma rota: go('/corrida'). Com `replace`, troca a entrada atual do histórico em vez de criar outra. */
export function go(path: string, opts?: { replace?: boolean }): void {
  if (!temJanela()) return;
  ligar();
  const destino = href(path);
  try {
    if (opts?.replace) {
      window.history.replaceState({ i: indice }, '', destino);
    } else {
      if (window.location.hash === destino) return;
      window.history.pushState({ i: indice + 1 }, '', destino);
      indice += 1;
    }
    avisar();
  } catch {
    // Sem a API de histórico: o hashchange avisa os ouvintes.
    try {
      if (opts?.replace) window.location.replace(destino);
      else window.location.hash = destino;
    } catch {
      /* nada a fazer */
    }
  }
}

/** Volta uma tela (history.back()); se o app abriu direto nesta tela, vai para `fallback` (padrão: '/hoje'). */
export function back(fallback: string = ROTA_INICIAL): void {
  if (!temJanela()) return;
  ligar();
  if (indice > 0) {
    try {
      window.history.back();
      return;
    } catch {
      /* cai no fallback */
    }
  }
  go(fallback, { replace: true });
}

const chave = (r: Route): string => `${r.path}?${new URLSearchParams(r.query).toString()}`;

/** Hook: a rota atual; redesenha em hashchange, popstate, `go` e `back`. Corrige o endereço de rota desconhecida. */
export function useRoute(): Route {
  const [rota, setRota] = useState<Route>(currentRoute);
  useEffect(() => {
    if (!temJanela()) return undefined;
    ligar();
    const conferir = (): void => {
      const bruta = parseHash(window.location.hash);
      if (!rotaConhecida(bruta) || window.location.hash === '' || window.location.hash === '#') {
        // Rota vazia ou desconhecida: acerta o endereço para '#/hoje' sem criar entrada no histórico.
        try {
          window.history.replaceState({ i: indice }, '', href(ROTA_INICIAL));
        } catch {
          /* segue só com a tela certa */
        }
      }
      const nova = currentRoute();
      setRota((antiga) => (chave(antiga) === chave(nova) ? antiga : nova));
    };
    conferir();
    ouvintes.add(conferir);
    return () => {
      ouvintes.delete(conferir);
    };
  }, []);
  return rota;
}
