import { barPath, fmtNum, niceTicks, tickDigits, toneColor, txtW, useWidth, type Tone } from './viz-util.ts';

export interface BarDatum {
  /** Rótulo do eixo X ("9/11", "S3"). */
  label: string;
  /** Valor principal. Quando há value2 no conjunto, é o planejado (barra larga e clara). */
  value: number;
  /** Segundo valor, desenhado como barra interna sólida (o realizado). */
  value2?: number;
  /** Destaca a barra (semana atual): as outras ficam mais apagadas. */
  highlight?: boolean;
}

export interface BarsProps {
  data: BarDatum[];
  /** Unidade, usada na descrição e no rótulo da meta ("min", "km"). */
  unit?: string;
  tone?: Tone;
  /** Tom da barra interna (padrão: o mesmo de tone). */
  tone2?: Tone;
  /** Linha de meta tracejada. */
  target?: number;
  /** Altura em px (padrão 160). */
  height?: number;
  /** Formata os números do eixo Y e da meta. */
  format?: (v: number) => string;
  /** Descrição para leitor de tela (padrão: resumo automático). */
  ariaLabel?: string;
  class?: string;
}

/** Barras verticais do Prumo: eixo e grade discretos, topo arredondado, meta tracejada e planejado × feito. */
export function Bars({ data, unit = '', tone = 'accent', tone2, target, height = 160, format, ariaLabel, class: cls }: BarsProps) {
  const [ref, W] = useWidth<HTMLDivElement>();
  if (!data.length) {
    return (
      <div class="ui-chart-empty">
        <b>Sem dados ainda</b>O gráfico aparece com o primeiro registro.
      </div>
    );
  }
  const H = height;
  const T = 14;
  const B = 24;
  const n = data.length;
  const dual = data.some((d) => d.value2 !== undefined);
  const anyHl = data.some((d) => d.highlight);
  const top = Math.max(0, ...data.map((d) => Math.max(d.value, d.value2 ?? 0)), target ?? 0);
  const max = (top || 1) * 1.12;
  const ticks = niceTicks(0, max, 3);
  const td = tickDigits((ticks[1] ?? 1) - (ticks[0] ?? 0) || 1);
  const fmt = format ?? ((v: number) => fmtNum(v, td));
  const L = Math.ceil(Math.max(...ticks.map((v) => txtW(fmt(v)))) + 12);
  const R = 4;
  const slot = (W - L - R) / n;
  const bw = Math.min(26, slot * 0.64);
  const iw = dual ? Math.max(3, Math.min(bw - 6, bw * 0.56)) : bw;
  const base = H - B;
  const Y = (v: number) => T + (1 - v / max) * (H - T - B);
  const cor = toneColor(tone);
  const cor2 = toneColor(tone2 ?? tone);
  const maxLab = Math.max(...data.map((d) => txtW(d.label))) + 4;
  const k = Math.max(1, Math.ceil(maxLab / slot));
  const last = data[n - 1];
  const sufixo = unit ? ` ${unit}` : '';
  const resumo =
    ariaLabel ??
    (last
      ? `Gráfico de barras, ${n} ${n === 1 ? 'barra' : 'barras'}. ${last.label}: ${fmt(last.value2 ?? last.value)}${sufixo}${dual ? ` de ${fmt(last.value)}${sufixo} planejados` : ''}.`
      : 'Gráfico de barras');
  const metaTxt = target !== undefined ? `meta ${fmt(target)}${sufixo}` : '';
  const ty = target !== undefined ? Y(target) : 0;
  const tyTxt = ty < T + 14 ? ty + 13 : ty - 5;

  return (
    <div ref={ref} class={`ui-chart ui-bars${cls ? ` ${cls}` : ''}`} role="img" aria-label={resumo}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
        {ticks.map((v) => (
          <g key={v}>
            <line class="ui-ch-grid" x1={L} x2={W - R} y1={Y(v).toFixed(1)} y2={Y(v).toFixed(1)} />
            <text class="ui-ch-ax" x={L - 7} y={(Y(v) + 3.5).toFixed(1)} text-anchor="end">
              {fmt(v)}
            </text>
          </g>
        ))}
        {data.map((d, i) => {
          const cx = L + slot * i + slot / 2;
          const apagada = anyHl && !d.highlight;
          return (
            <g key={i} class={`ui-ch-bar${apagada ? ' is-dim' : ''}`}>
              {d.value > 0 && <path d={barPath(cx - bw / 2, Y(d.value), bw, base - Y(d.value), 3)} fill={cor} opacity={dual ? 0.26 : 1} />}
              {dual && (d.value2 ?? 0) > 0 && <path d={barPath(cx - iw / 2, Y(d.value2 ?? 0), iw, base - Y(d.value2 ?? 0), 2)} fill={cor2} />}
            </g>
          );
        })}
        {target !== undefined && (
          <g>
            <line class="ui-ch-target" stroke={cor} x1={L} x2={W - R} y1={ty.toFixed(1)} y2={ty.toFixed(1)} />
            <rect class="ui-ch-anno-bg" x={L + 1} y={tyTxt - 10} width={(txtW(metaTxt) + 6).toFixed(1)} height="13" rx="2" />
            <text class="ui-ch-ax" x={L + 4} y={tyTxt} text-anchor="start">
              {metaTxt}
            </text>
          </g>
        )}
        <line class="ui-ch-base" x1={L} x2={W - R} y1={base} y2={base} />
        {data.map((d, i) =>
          (n - 1 - i) % k === 0 ? (
            <text key={i} class={`ui-ch-ax${d.highlight ? ' is-hl' : ''}`} x={(L + slot * i + slot / 2).toFixed(1)} y={H - 7} text-anchor="middle">
              {d.label}
            </text>
          ) : null,
        )}
      </svg>
    </div>
  );
}
