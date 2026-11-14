import { fmtNum, niceTicks, parteISO, rotuloData, tickDigits, toneColor, txtW, useWidth, type Tone } from './viz-util.ts';

export interface LinePoint {
  /** Data "AAAA-MM-DD" (eixo de tempo) ou um rótulo qualquer (eixo por posição). */
  x: string;
  y: number;
}

export interface LineSeries {
  points: LinePoint[];
  tone?: Tone;
  /** Linha tracejada e sem pontos (média, tendência, planejado). */
  dashed?: boolean;
  /** Preenche a área sob a linha. */
  area?: boolean;
  /** Nome da série: aparece na legenda (com 2 ou mais séries nomeadas) e na descrição. */
  label?: string;
}

export interface LineChartProps {
  series: LineSeries[];
  /** Linha de meta tracejada, com o rótulo "meta ‹valor›". */
  target?: number;
  /** Altura em px (padrão 170). */
  height?: number;
  yFormat?: (v: number) => string;
  /** Formata os rótulos do eixo X (padrão: "14 nov" para datas). */
  xFormat?: (x: string) => string;
  /** Descrição para leitor de tela (padrão: resumo automático). */
  ariaLabel?: string;
  class?: string;
}

export interface LegendItem {
  label: string;
  tone?: Tone;
  /** 'line' (traço, padrão), 'dash' (tracejado), 'box' (quadradinho cheio) ou 'soft' (quadradinho claro). */
  kind?: 'line' | 'dash' | 'box' | 'soft';
}

/** Legenda dos gráficos: chave na cor da série e nome. */
export function Legend({ items, class: cls }: { items: LegendItem[]; class?: string }) {
  return (
    <div class={`ui-legend${cls ? ` ${cls}` : ''}`}>
      {items.map((it) => (
        <span key={it.label}>
          <i class={`ui-legend-key ui-legend-key--${it.kind ?? 'line'}`} style={{ '--tone': toneColor(it.tone) }} aria-hidden="true" />
          {it.label}
        </span>
      ))}
    </div>
  );
}

interface Serie extends LineSeries {
  pts: { x: string; y: number; v: number }[];
  cor: string;
}

/** Linha do Prumo: pontos, área opcional, meta tracejada e o último ponto em destaque. */
export function LineChart({ series, target, height = 170, yFormat, xFormat, ariaLabel, class: cls }: LineChartProps) {
  const [ref, W] = useWidth<HTMLDivElement>();
  const validas = series.map((s) => ({ ...s, points: s.points.filter((p) => Number.isFinite(p.y)) })).filter((s) => s.points.length > 0);
  const total = validas.reduce((acc, s) => Math.max(acc, s.points.length), 0);
  if (total < 2) {
    return (
      <div class="ui-chart-empty">
        <b>Poucos pontos ainda</b>Registre pelo menos dois para ver a linha.
      </div>
    );
  }

  // eixo X: tempo quando todos os x são datas; senão, a posição do rótulo na ordem em que aparece
  const porData = validas.every((s) => s.points.every((p) => parteISO(p.x) !== null));
  const ordem: string[] = [];
  if (!porData) for (const s of validas) for (const p of s.points) if (!ordem.includes(p.x)) ordem.push(p.x);
  const xv = (x: string): number => (porData ? (parteISO(x)?.t ?? 0) : ordem.indexOf(x));
  const sers: Serie[] = validas.map((s) => ({
    ...s,
    cor: toneColor(s.tone),
    pts: s.points.map((p) => ({ x: p.x, y: p.y, v: xv(p.x) })).sort((a, b) => a.v - b.v),
  }));
  const todosV = sers.flatMap((s) => s.pts.map((p) => p.v));
  const x0 = Math.min(...todosV);
  const x1 = Math.max(...todosV);
  const ys = sers.flatMap((s) => s.pts.map((p) => p.y)).concat(target !== undefined ? [target] : []);
  let y0 = Math.min(...ys);
  let y1 = Math.max(...ys);
  const padY = (y1 - y0) * 0.15 || 1;
  y0 -= padY;
  y1 += padY;

  const H = height;
  const T = 14;
  const B = 24;
  const R = 14;
  const ticks = niceTicks(y0, y1, W < 480 ? 3 : 4);
  const td = tickDigits((ticks[1] ?? 1) - (ticks[0] ?? 0) || 1);
  const fy = yFormat ?? ((v: number) => fmtNum(v, td));
  const fx = xFormat ?? rotuloData;
  const L = Math.ceil(Math.max(0, ...ticks.map((v) => txtW(fy(v)))) + 12);
  const X = (v: number) => L + ((v - x0) / (x1 - x0 || 1)) * (W - L - R);
  const Y = (v: number) => T + (1 - (v - y0) / (y1 - y0 || 1)) * (H - T - B);
  const caminho = (s: Serie) => s.pts.map((p, i) => `${i ? 'L' : 'M'}${X(p.v).toFixed(1)},${Y(p.y).toFixed(1)}`).join('');

  // rótulos do eixo X: primeiro à esquerda, último à direita
  const eixo: { x: string; v: number }[] = porData
    ? (sers.reduce<Serie | undefined>((a, s) => (!a || s.pts.length > a.pts.length ? s : a), undefined)?.pts ?? [])
    : ordem.map((x, i) => ({ x, v: i }));
  const kx = Math.min(eixo.length, W < 480 ? 3 : 5);
  const idx = [...new Set(Array.from({ length: kx }, (_, j) => Math.round((j * (eixo.length - 1)) / Math.max(1, kx - 1))))];

  const principal = sers.find((s) => !s.dashed) ?? sers[0];
  const ultimo = principal?.pts[principal.pts.length - 1];
  const nomeadas = sers.filter((s) => s.label);
  const resumo =
    ariaLabel ??
    (nomeadas.length > 1
      ? `Gráfico de linhas: ${nomeadas.map((s) => `${s.label} ${fy(s.pts[s.pts.length - 1]?.y ?? 0)}`).join(', ')}`
      : `Gráfico de linha, ${principal?.pts.length ?? 0} pontos, último ${ultimo ? fy(ultimo.y) : '—'}`);
  const metaTxt = target !== undefined ? `meta ${fy(target)}` : '';
  const ty = target !== undefined ? Y(target) : 0;
  const tyTxt = ty < T + 14 ? ty + 13 : ty - 5;

  return (
    <>
      {nomeadas.length > 1 && <Legend items={nomeadas.map((s) => ({ label: s.label ?? '', tone: s.tone, kind: s.dashed ? 'dash' : 'line' }))} />}
      <div ref={ref} class={`ui-chart ui-line${cls ? ` ${cls}` : ''}`} role="img" aria-label={resumo}>
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
          {ticks.map((v) => (
            <g key={v}>
              <line class="ui-ch-grid" x1={L} x2={W - R} y1={Y(v).toFixed(1)} y2={Y(v).toFixed(1)} />
              <text class="ui-ch-ax" x={L - 8} y={(Y(v) + 3.5).toFixed(1)} text-anchor="end">
                {fy(v)}
              </text>
            </g>
          ))}
          {target !== undefined && (
            <g>
              <line class="ui-ch-target" stroke={principal?.cor} x1={L} x2={W - R} y1={ty.toFixed(1)} y2={ty.toFixed(1)} />
              <rect class="ui-ch-anno-bg" x={L + 1} y={tyTxt - 10} width={(txtW(metaTxt) + 6).toFixed(1)} height="13" rx="2" />
              <text class="ui-ch-ax" x={L + 4} y={tyTxt} text-anchor="start">
                {metaTxt}
              </text>
            </g>
          )}
          {sers.map((s, i) => {
            const d = caminho(s);
            const a = s.pts[0];
            const z = s.pts[s.pts.length - 1];
            if (!a || !z) return null;
            const pontos = !s.dashed && s.pts.length <= 24;
            return (
              <g key={i}>
                {s.area && s.pts.length > 1 && <path class="ui-ch-area" d={`${d}L${X(z.v).toFixed(1)},${H - B}L${X(a.v).toFixed(1)},${H - B}Z`} fill={s.cor} />}
                {s.pts.length > 1 && <path class={`ui-ch-ln${s.dashed ? ' is-dashed' : ''}`} d={d} stroke={s.cor} />}
                {pontos && s.pts.map((p, j) => <circle key={j} class="ui-ch-pt" cx={X(p.v).toFixed(1)} cy={Y(p.y).toFixed(1)} r="3" fill={s.cor} />)}
                {!s.dashed && (
                  <>
                    <circle class="ui-ch-halo" cx={X(z.v).toFixed(1)} cy={Y(z.y).toFixed(1)} r="8" fill={s.cor} />
                    <circle class="ui-ch-pt" cx={X(z.v).toFixed(1)} cy={Y(z.y).toFixed(1)} r="4" fill={s.cor} />
                  </>
                )}
              </g>
            );
          })}
          {idx.map((i) => {
            const p = eixo[i];
            if (!p) return null;
            return (
              <text key={i} class="ui-ch-ax" x={X(p.v).toFixed(1)} y={H - 7} text-anchor={i === 0 ? 'start' : i === eixo.length - 1 ? 'end' : 'middle'}>
                {fx(p.x)}
              </text>
            );
          })}
        </svg>
      </div>
    </>
  );
}
