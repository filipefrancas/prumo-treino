import { fitView, frame, loopDuration, timeOfKey } from './core.ts';
import { primAttrs, viewBoxAttr } from './svg.ts';
import type { RigDef } from './types.ts';

const NS = 'http://www.w3.org/2000/svg';

/**
 * Toca uma animação do boneco dentro de um <svg>. Os elementos são criados uma vez e, a cada quadro,
 * só os atributos mudam (sem recriar o DOM), o que mantém a animação leve mesmo em celulares modestos.
 */
export class FigurePlayer {
  private readonly els = new Map<string, { tag: string; el: SVGElement }>();
  private raf = 0;
  private startedAt = 0;
  private elapsed = 0;
  private running = false;

  constructor(
    private readonly svg: SVGSVGElement,
    private readonly def: RigDef,
  ) {
    svg.setAttribute('viewBox', viewBoxAttr(fitView(def)));
    this.elapsed = this.restTime();
    this.draw(this.elapsed);
  }

  /** Instante da pose "de capa" (a key mais representativa do exercício). */
  restTime(): number {
    const n = this.def.keys.length;
    return timeOfKey(this.def, Math.min(n - 1, this.def.thumb ?? (n > 1 ? 1 : 0)));
  }

  get animated(): boolean {
    return loopDuration(this.def) > 0;
  }

  get playing(): boolean {
    return this.running;
  }

  draw(t: number): void {
    const prims = frame(this.def, t);
    let rebuild = prims.length !== this.els.size;
    if (!rebuild) {
      for (const p of prims) {
        const hit = this.els.get(p.id);
        if (!hit || hit.tag !== primAttrs(p).tag) {
          rebuild = true;
          break;
        }
      }
    }
    if (rebuild) {
      this.svg.replaceChildren();
      this.els.clear();
    }
    for (const p of prims) {
      const { tag, attrs } = primAttrs(p);
      let hit = this.els.get(p.id);
      if (!hit) {
        const el = document.createElementNS(NS, tag);
        el.setAttribute('class', p.cls);
        this.svg.appendChild(el);
        hit = { tag, el };
        this.els.set(p.id, hit);
      }
      for (const k in attrs) hit.el.setAttribute(k, attrs[k] as string);
    }
  }

  play(): void {
    if (this.running || !this.animated) return;
    this.running = true;
    this.startedAt = performance.now() - this.elapsed * 1000;
    const tick = (now: number) => {
      if (!this.running) return;
      this.elapsed = (now - this.startedAt) / 1000;
      this.draw(this.elapsed);
      this.raf = requestAnimationFrame(tick);
    };
    this.raf = requestAnimationFrame(tick);
  }

  pause(): void {
    this.running = false;
    cancelAnimationFrame(this.raf);
  }

  /** Volta para a pose de capa e para. */
  reset(): void {
    this.pause();
    this.elapsed = this.restTime();
    this.draw(this.elapsed);
  }

  destroy(): void {
    this.pause();
    this.svg.replaceChildren();
    this.els.clear();
  }
}
