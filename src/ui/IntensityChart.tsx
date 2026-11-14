import { useId } from 'preact/hooks';
import type { RunBlock, RunStep } from '../types.ts';
import { barPath, fmtNum, useWidth } from './viz-util.ts';

export interface IntensityChartProps {
  blocks: RunBlock[];
  /** Altura das barras em px (padrão 120; 36 na versão compacta). O eixo de tempo soma 20 px. */
  height?: number;
  /** Versão para cartões: baixa e sem eixo. */
  compact?: boolean;
  /** Segundos já corridos: desenha a linha de progresso e apaga o que já passou. */
  cursorSec?: number;
  /** Descrição para leitor de tela (padrão: resumo automático). */
  label?: string;
  class?: string;
}

/** Repetições expandidas, na ordem em que são corridas. */
function expandir(blocks: RunBlock[]): RunStep[] {
  const out: RunStep[] = [];
  for (const b of blocks) {
    if ('times' in b) for (let i = 0; i < b.times; i++) out.push(...b.steps);
    else out.push(b);
  }
  return out;
}

/** Altura da barra por nível: 1 → 30%, 5 → 100%. */
const alturaDoNivel = (lv: number): number => 0.3 + (lv - 1) * 0.175;

/** Perfil de um treino de corrida: uma barra por passo, largura pelo tempo, altura e cor pela intensidade. */
export function IntensityChart({ blocks, height, compact = false, cursorSec, label, class: cls }: IntensityChartProps) {
  const [ref, W] = useWidth<HTMLDivElement>();
  const uid = useId();
  const steps = expandir(blocks).filter((s) => s.sec > 0);
  const total = steps.reduce((s, p) => s + p.sec, 0);
  if (!total) return null;

  const plotH = height ?? (compact ? 36 : 120);
  const H = plotH + (compact ? 0 : 20);
  const gap = 1;
  const raio = compact ? 2 : 3;
  let acc = 0;
  const barras = steps.map((s, i) => {
    const x = (acc / total) * W;
    acc += s.sec;
    const w = Math.max(1, (acc / total) * W - x - (i < steps.length - 1 ? gap : 0));
    const h = Math.max(2, Math.round(plotH * alturaDoNivel(s.level)));
    return <path key={i} d={barPath(x, plotH - h, w, h, raio)} fill={`var(--lv-${s.level})`} />;
  });

  const comCursor = cursorSec !== undefined;
  const cx = comCursor ? Math.min(W, Math.max(0, (cursorSec / total) * W)) : 0;
  const pico = steps.reduce((m, s) => Math.max(m, s.level), 1);
  const min = total / 60;
  const resumo = label ?? `Perfil do treino: ${fmtNum(min)} min em ${steps.length} ${steps.length === 1 ? 'passo' : 'passos'}, intensidade máxima ${pico} de 5`;

  return (
    <div ref={ref} class={`ui-chart ui-intensity${compact ? ' ui-intensity--compact' : ''}${cls ? ` ${cls}` : ''}`} role="img" aria-label={resumo}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
        {comCursor ? (
          <>
            <defs>
              <clipPath id={`${uid}a`}>
                <rect x="0" y="0" width={cx.toFixed(1)} height={plotH} />
              </clipPath>
              <clipPath id={`${uid}b`}>
                <rect x={cx.toFixed(1)} y="0" width={Math.max(0, W - cx).toFixed(1)} height={plotH} />
              </clipPath>
            </defs>
            <g class="ui-int-past" clip-path={`url(#${uid}a)`}>
              {barras}
            </g>
            <g clip-path={`url(#${uid}b)`}>{barras}</g>
            <line class="ui-int-cursor" x1={Math.min(W - 1, Math.max(1, cx)).toFixed(1)} x2={Math.min(W - 1, Math.max(1, cx)).toFixed(1)} y1="0" y2={plotH} />
          </>
        ) : (
          barras
        )}
        {!compact && (
          <>
            <line class="ui-ch-base" x1="0" x2={W} y1={plotH + 0.5} y2={plotH + 0.5} />
            <text class="ui-ch-ax" x="0" y={H - 5} text-anchor="start">
              0
            </text>
            <text class="ui-ch-ax" x={W / 2} y={H - 5} text-anchor="middle">
              {fmtNum(min / 2)}
            </text>
            <text class="ui-ch-ax" x={W} y={H - 5} text-anchor="end">
              {`${fmtNum(min)} min`}
            </text>
          </>
        )}
      </svg>
    </div>
  );
}
