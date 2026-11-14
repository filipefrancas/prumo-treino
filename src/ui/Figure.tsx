import { useEffect, useRef } from 'preact/hooks';
import { animById } from '../data/anim/_index.ts';
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
    return (
      <div class={`ui-fig ui-fig--empty ui-fig--${tone} ${cls ?? ''}`} {...a11y}>
        <svg viewBox="0 0 240 180" aria-hidden="true">
          <circle cx="120" cy="62" r="13" class="f-far" fill="currentColor" />
          <path d="M120 80v44M96 96h48M120 124l-18 34M120 124l18 34" class="f-far" stroke="currentColor" stroke-width="9" stroke-linecap="round" fill="none" />
        </svg>
      </div>
    );
  }
  return (
    <div class={`ui-fig ui-fig--${tone} ${cls ?? ''}`} {...a11y}>
      <svg ref={svgRef} aria-hidden="true" focusable="false" />
    </div>
  );
}
