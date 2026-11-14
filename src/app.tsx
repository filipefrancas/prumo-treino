/**
 * Casca do app: escolhe a tela pela rota (tabela de docs/SPEC.md, seção 3), mostra a barra de abas e os avisos.
 *
 * Contrato com as features: cada `features/<nome>/index.tsx` exporta as telas com os nomes da tabela de rotas.
 * Telas de rota com parâmetro recebem `id: string` (o trecho `:id` da rota, já decodificado); as outras não
 * recebem props. Esta casca importa só dos `index.tsx`.
 */
import type { ComponentChildren } from 'preact';
import { useLayoutEffect } from 'preact/hooks';
import { AjustesScreen } from './features/ajustes/index.tsx';
import { CorridaScreen, RunDetailScreen, RunPlayerScreen } from './features/corrida/index.tsx';
import { HojeScreen } from './features/hoje/index.tsx';
import { KitBase } from './features/kit/base.tsx';
import { KitViz } from './features/kit/viz.tsx';
import { MobilidadeScreen, RoutinePlayerScreen, RoutineScreen } from './features/mobilidade/index.tsx';
import {
  ExerciseScreen,
  FichaScreen,
  LibraryScreen,
  LiftsScreen,
  MusculacaoScreen,
  SessaoScreen,
} from './features/musculacao/index.tsx';
import { ProgressoScreen } from './features/progresso/index.tsx';
import { match, useRoute, type Route } from './lib/router.ts';
import { TabBar, ToastHost, type TabItem } from './ui/index.ts';

type Aba = 'hoje' | 'corrida' | 'musculacao' | 'mobilidade' | 'progresso';

const ABAS: (TabItem & { id: Aba })[] = [
  { id: 'hoje', label: 'Hoje', icon: 'hoje', href: '/hoje' },
  { id: 'corrida', label: 'Corrida', icon: 'corrida', href: '/corrida' },
  { id: 'musculacao', label: 'Musculação', icon: 'musculacao', href: '/musculacao' },
  { id: 'mobilidade', label: 'Mobilidade', icon: 'mobilidade', href: '/mobilidade' },
  { id: 'progresso', label: 'Progresso', icon: 'progresso', href: '/progresso' },
];

/** Primeiro trecho da rota → aba. Exercícios moram em Musculação; Ajustes abre a partir de Hoje. */
const ABA_DO_TRECHO: Record<string, Aba> = {
  hoje: 'hoje',
  ajustes: 'hoje',
  corrida: 'corrida',
  musculacao: 'musculacao',
  exercicio: 'musculacao',
  exercicios: 'musculacao',
  mobilidade: 'mobilidade',
  progresso: 'progresso',
};

interface Tela {
  /** Molde da rota, como em `match`. */
  rota: string;
  /** Tela de tocar: ocupa a tela toda, sem a barra de abas. */
  cheia?: boolean;
  render: (p: Record<string, string>) => ComponentChildren;
}

/** A tabela de rotas da SPEC, mais a galeria do kit (só para desenvolvimento). */
const TELAS: Tela[] = [
  { rota: '/hoje', render: () => <HojeScreen /> },
  { rota: '/corrida', render: () => <CorridaScreen /> },
  { rota: '/corrida/treino/:id', render: (p) => <RunDetailScreen id={p.id ?? ''} /> },
  { rota: '/corrida/guiada/:id', cheia: true, render: (p) => <RunPlayerScreen id={p.id ?? ''} /> },
  { rota: '/musculacao', render: () => <MusculacaoScreen /> },
  { rota: '/musculacao/ficha/:id', render: (p) => <FichaScreen id={p.id ?? ''} /> },
  { rota: '/musculacao/sessao', cheia: true, render: () => <SessaoScreen /> },
  { rota: '/musculacao/historico', render: () => <LiftsScreen /> },
  { rota: '/exercicios', render: () => <LibraryScreen /> },
  { rota: '/exercicio/:id', render: (p) => <ExerciseScreen id={p.id ?? ''} /> },
  { rota: '/mobilidade', render: () => <MobilidadeScreen /> },
  { rota: '/mobilidade/rotina/:id', render: (p) => <RoutineScreen id={p.id ?? ''} /> },
  { rota: '/mobilidade/tocar/:id', cheia: true, render: (p) => <RoutinePlayerScreen id={p.id ?? ''} /> },
  { rota: '/progresso', render: () => <ProgressoScreen /> },
  { rota: '/ajustes', render: () => <AjustesScreen /> },
];

const ROTA_DO_KIT = '/kit';

function acharTela(route: Route): { tela: Tela; params: Record<string, string> } | undefined {
  for (const tela of TELAS) {
    const params = match(route, tela.rota);
    if (params) return { tela, params };
  }
  return undefined;
}

/**
 * Galeria do kit dentro do app (#/kit): as duas galerias em sequência. A da base já traz a própria barra de
 * abas e a própria região de avisos, por isso a casca não mostra as dela nesta rota.
 */
function KitScreen() {
  return (
    <div style={{ paddingBottom: 'calc(var(--tabs-h) + var(--safe-bottom))' }}>
      <KitBase />
      <KitViz />
    </div>
  );
}

export function App() {
  const route = useRoute();

  // Cada tela começa do topo: sem isto, a rolagem da tela anterior vale para a nova.
  useLayoutEffect(() => {
    try {
      if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual';
    } catch {
      /* segue com a restauração do navegador */
    }
  }, []);
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [route.path]);

  if (match(route, ROTA_DO_KIT)) return <KitScreen />;

  // O roteador já troca rota vazia ou desconhecida por /hoje; a reserva aqui é só por segurança.
  const achada = acharTela(route);
  const aba = ABA_DO_TRECHO[route.parts[0] ?? ''] ?? 'hoje';
  const cheia = achada?.tela.cheia === true;

  return (
    <>
      {/* a chave refaz a tela quando a rota muda (inclusive de um :id para outro) */}
      <div key={route.path}>
        {achada ? achada.tela.render(achada.params) : <HojeScreen />}
      </div>
      {cheia ? null : <TabBar items={ABAS} active={aba} />}
      <ToastHost />
    </>
  );
}
