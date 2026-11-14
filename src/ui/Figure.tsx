import { useEffect, useRef } from 'preact/hooks';
import { animById } from '../data/anim/_index.ts';
import { exById } from '../data/ex/_index.ts';
import { FigurePlayer } from '../rig/dom.ts';
import type { RigDef } from '../rig/types.ts';

export type FigureTone = 'musc' | 'corrida' | 'mob';

export interface FigureProps {
  /** id do exercício/animação (src/data/anim). */
  id?: string;
  /** Ou a definição direta, quando ela não vem do índice. */
  def?: RigDef;
  /**
   * 'visible' (padrão): anima enquanto estiver na tela. 'always': anima sempre. 'never': pose de capa parada
   * (use em listas e miniaturas). Com "reduzir movimento" ligado no sistema, fica parada.
   */
  play?: 'visible' | 'always' | 'never';
  /** Pausa a animação sem desmontar (por exemplo, quando o treino está pausado). */
  paused?: boolean;
  /** Cor do destaque muscular: musculação (lilás), corrida (laranja) ou mobilidade (verde-água). */
  tone?: FigureTone;
  /** Texto alternativo. Sem ele a figura é decorativa. */
  label?: string;
  class?: string;
}

const PALAVRAS_CURTAS = new Set(['a', 'o', 'e', 'de', 'da', 'do', 'das', 'dos', 'na', 'no', 'nas', 'nos', 'em', 'com', 'para', 'ao']);

/** Iniciais para o quadro neutro: as duas primeiras palavras que importam ("Remada curvada com barra" → "RC"). */
export function iniciais(nome: string): string {
  const palavras = nome
    .replace(/\([^)]*\)/g, ' ')
    .split(/[^\p{L}\p{N}]+/u)
    .filter((p) => p !== '' && !PALAVRAS_CURTAS.has(p.toLowerCase()));
  return palavras.slice(0, 2).map((p) => p.charAt(0).toUpperCase()).join('');
}

const reducedMotion = (): boolean => typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Boneco animado de um exercício. Ocupa a largura do contêiner em proporção 4:3. */
export function Figure({ id, def, play = 'visible', paused = false, tone = 'musc', label, class: cls }: FigureProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const playerRef = useRef<FigurePlayer | null>(null);
  const visibleRef = useRef(play === 'always');
  const rig = def ?? (id ? animById(id) : undefined);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg || !rig) return;
    const player = new FigurePlayer(svg, rig);
    playerRef.current = player;
    const wants = play !== 'never' && !reducedMotion();
    const sync = () => {
      if (wants && visibleRef.current && !pausedRef.current) player.play();
      else player.pause();
    };
    syncRef.current = sync;
    let io: IntersectionObserver | undefined;
    if (wants && play === 'visible' && typeof IntersectionObserver === 'function') {
      io = new IntersectionObserver(
        (entries) => {
          visibleRef.current = entries.some((e) => e.isIntersecting);
          sync();
        },
        { threshold: 0.15 },
      );
      io.observe(svg);
    } else {
      visibleRef.current = true;
    }
    const onVisibility = () => {
      if (document.hidden) player.pause();
      else sync();
    };
    document.addEventListener('visibilitychange', onVisibility);
    sync();
    return () => {
      io?.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      player.destroy();
      playerRef.current = null;
    };
  }, [rig, play]);

  const pausedRef = useRef(paused);
  const syncRef = useRef<() => void>(() => undefined);
  useEffect(() => {
    pausedRef.current = paused;
    syncRef.current();
  }, [paused]);

  const a11y = label ? ({ role: 'img', 'aria-label': label } as const) : ({ 'aria-hidden': true } as const);
  if (!rig) {
    // sem foto nem animação: quadro neutro com as iniciais do exercício (nunca um erro, nunca um boneco genérico)
    const nome = (id ? exById(id)?.name : undefined) ?? label?.replace(/^(Animação|Foto):\s*/, '') ?? id?.replace(/-/g, ' ') ?? '';
    return (
      <div class={`ui-fig ui-fig--empty ui-fig--${tone} ${cls ?? ''}`} {...a11y}>
        <span class="ui-fig-ini" aria-hidden="true">
          {iniciais(nome) || '·'}
        </span>
      </div>
    );
  }
  return (
    <div class={`ui-fig ui-fig--${tone} ${cls ?? ''}`} {...a11y}>
      <svg ref={svgRef} aria-hidden="true" focusable="false" />
    </div>
  );
}
