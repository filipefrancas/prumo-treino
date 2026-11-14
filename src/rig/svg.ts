import { FULL_VIEW, type ViewBox } from './core.ts';
import type { Prim } from './types.ts';

/** Cores do boneco. No app elas vêm de variáveis CSS (ver styles/figure.css); aqui servem para gerar SVG estático e PNG. */
export interface FigTheme {
  near: string;
  far: string;
  torso: string;
  head: string;
  short: string;
  shortFar: string;
  shoe: string;
  shoeFar: string;
  hl: string;
  /** Cor do fundo do cartão, usada nos recortes que separam partes sobrepostas. */
  cut: string;
  eq: string;
  eq2: string;
  soft: string;
  ground: string;
  shadow: string;
  arrow: string;
}

export const THEME_DARK: FigTheme = {
  near: '#e8ecf1',
  far: '#7d8898',
  torso: '#cfd6df',
  head: '#e8ecf1',
  short: '#3d4a5c',
  shortFar: '#313b49',
  shoe: '#e2a93b',
  shoeFar: '#9a7631',
  hl: '#9085e9',
  cut: '#141920',
  eq: '#566273',
  eq2: '#3a4452',
  soft: '#2a323d',
  ground: '#313b48',
  shadow: 'rgba(0,0,0,0.35)',
  arrow: '#e2a93b',
};

export const THEME_LIGHT: FigTheme = {
  near: '#1f2630',
  far: '#8d97a5',
  torso: '#36404d',
  head: '#1f2630',
  short: '#5b6b80',
  shortFar: '#93a0b1',
  shoe: '#b97c00',
  shoeFar: '#d3aa5c',
  hl: '#4a3aa7',
  cut: '#ffffff',
  eq: '#9aa4b2',
  eq2: '#c3cad4',
  soft: '#dde1e7',
  ground: '#cfd5dd',
  shadow: 'rgba(16,24,40,0.14)',
  arrow: '#946200',
};

const CLASS_TO_KEY: Record<string, keyof FigTheme> = {
  'f-near': 'near',
  'f-far': 'far',
  'f-torso': 'torso',
  'f-head': 'head',
  'f-short': 'short',
  'f-short-far': 'shortFar',
  'f-shoe': 'shoe',
  'f-shoe-far': 'shoeFar',
  'f-hl': 'hl',
  'f-cut': 'cut',
  'f-ground': 'ground',
  'f-shadow': 'shadow',
  'f-arrow': 'arrow',
  'p-eq': 'eq',
  'p-eq2': 'eq2',
  'p-hl': 'hl',
  'p-soft': 'soft',
};

const n = (v: number): string => (Math.round(v * 100) / 100).toString();

/** Atributos geométricos de cada primitiva (compartilhado entre o SVG em texto e o renderizador de DOM). */
export function primAttrs(p: Prim): { tag: string; attrs: Record<string, string> } {
  switch (p.k) {
    case 'line':
      return {
        tag: 'line',
        attrs: { x1: n(p.a[0]), y1: n(p.a[1]), x2: n(p.b[0]), y2: n(p.b[1]), 'stroke-width': n(p.w), stroke: 'currentColor', 'stroke-linecap': 'round', fill: 'none' },
      };
    case 'circle':
      return p.ring
        ? { tag: 'circle', attrs: { cx: n(p.c[0]), cy: n(p.c[1]), r: n(p.r), stroke: 'currentColor', 'stroke-width': n(p.ring), fill: 'none' } }
        : { tag: 'circle', attrs: { cx: n(p.c[0]), cy: n(p.c[1]), r: n(p.r), fill: 'currentColor' } };
    case 'ellipse':
      return { tag: 'ellipse', attrs: { cx: n(p.c[0]), cy: n(p.c[1]), rx: n(p.rx), ry: n(p.ry), fill: 'currentColor' } };
    case 'poly':
      return {
        tag: 'polygon',
        attrs: { points: p.pts.map((q) => `${n(q[0])},${n(q[1])}`).join(' '), fill: 'currentColor', stroke: 'currentColor', 'stroke-width': n(p.w), 'stroke-linejoin': 'round' },
      };
    case 'rect':
      return {
        tag: 'rect',
        attrs: {
          x: n(p.c[0] - p.w / 2), y: n(p.c[1] - p.h / 2), width: n(p.w), height: n(p.h), rx: n(p.r), fill: 'currentColor',
          transform: `rotate(${n(p.rot)} ${n(p.c[0])} ${n(p.c[1])})`,
        },
      };
    case 'path':
      return { tag: 'path', attrs: { d: p.d, stroke: 'currentColor', 'stroke-width': n(p.w), 'stroke-linecap': 'round', 'stroke-linejoin': 'round', fill: 'none' } };
  }
}

export function primsToMarkup(prims: Prim[], theme?: FigTheme): string {
  return prims
    .map((p) => {
      const { tag, attrs } = primAttrs(p);
      const key = CLASS_TO_KEY[p.cls];
      const color = theme && key ? ` color="${theme[key]}"` : '';
      const a = Object.entries(attrs).map(([k, v]) => `${k}="${v}"`).join(' ');
      return `<${tag} class="${p.cls}"${color} ${a}/>`;
    })
    .join('');
}

/** SVG completo e autossuficiente (para miniaturas estáticas e para a ferramenta de pré-visualização). */
export const viewBoxAttr = (v: ViewBox): string => [v.x, v.y, v.w, v.h].map(n).join(' ');

export function primsToSvg(prims: Prim[], opts: { theme?: FigTheme; view?: ViewBox; width?: number; height?: number; bg?: string } = {}): string {
  const v = opts.view ?? FULL_VIEW;
  const size = opts.width ? ` width="${opts.width}" height="${opts.height ?? Math.round((opts.width * v.h) / v.w)}"` : '';
  const bg = opts.bg ? `<rect x="${n(v.x)}" y="${n(v.y)}" width="${n(v.w)}" height="${n(v.h)}" fill="${opts.bg}"/>` : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBoxAttr(v)}"${size}>${bg}${primsToMarkup(prims, opts.theme)}</svg>`;
}
