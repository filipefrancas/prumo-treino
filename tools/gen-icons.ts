/**
 * Ícones do app, gerados a partir de um desenho em SVG.
 *
 * Uso (a partir da raiz do projeto):  npm run icons
 *
 * Saída em public/:
 *   icons/icon-192.png, icons/icon-512.png   ícone comum (quadrado cheio; o sistema arredonda os cantos)
 *   icons/maskable-512.png                   desenho dentro da área segura (20% de margem em cada lado)
 *   icons/apple-touch-icon.png               180 px, sem transparência (Tela de Início do iPhone)
 *   favicon.svg                              aba do navegador (cantos arredondados)
 *
 * Desenho: fundo escuro do app, anel de progresso âmbar de cerca de 270 graus com a abertura em cima e, pela
 * abertura, um fio de prumo que desce do topo até o peso no centro.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Resvg } from '@resvg/resvg-js';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const pub = join(root, 'public');
const iconsDir = join(pub, 'icons');

// As duas cores do ícone (as mesmas de --bg e --accent do tema escuro, em styles/tokens.css).
const FUNDO = '#0d1015';
const AMBAR = '#e2a93b';

/** Lado da prancheta. */
const L = 512;
const C = L / 2;

const n = (v: number): string => String(Math.round(v * 100) / 100);

/** O desenho (anel + prumo) em uma prancheta de 512, ocupando-a quase toda. */
function desenho(): string {
  const raio = 172;
  const traco = 50;
  // Abertura de 90 graus centrada no topo: o arco vai de 45° à direita do topo até 45° à esquerda, por baixo.
  const meia = (45 * Math.PI) / 180;
  const x1 = C + raio * Math.sin(meia);
  const x2 = C - raio * Math.sin(meia);
  const y = C - raio * Math.cos(meia);
  const anel = `<path d="M${n(x1)} ${n(y)} A${raio} ${raio} 0 1 1 ${n(x2)} ${n(y)}" fill="none" stroke="${AMBAR}" stroke-width="${traco}" stroke-linecap="round"/>`;

  // Fio: do topo até o peso. Peso: losango de ombros arredondados com a ponta para baixo.
  const topoFio = 58;
  const topoPeso = 214;
  const ombro = 262;
  const ponta = 352;
  const meiaLargura = 46;
  const fio = `<path d="M${C} ${topoFio} V${topoPeso + 6}" fill="none" stroke="${AMBAR}" stroke-width="14" stroke-linecap="round"/>`;
  const peso = `<path d="M${C} ${topoPeso} L${C + meiaLargura} ${ombro} L${C} ${ponta} L${C - meiaLargura} ${ombro} Z" fill="${AMBAR}" stroke="${AMBAR}" stroke-width="16" stroke-linejoin="round"/>`;
  return anel + fio + peso;
}

/**
 * SVG do ícone. `escala` encolhe o desenho em torno do centro (1 = prancheta toda);
 * `raioCanto` arredonda o fundo (0 = quadrado cheio).
 */
function svg(escala: number, raioCanto = 0): string {
  const t = `translate(${C} ${C}) scale(${escala}) translate(${-C} ${-C})`;
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${L} ${L}" width="${L}" height="${L}">` +
    `<rect width="${L}" height="${L}" rx="${raioCanto}" fill="${FUNDO}"/>` +
    `<g transform="${t}">${desenho()}</g>` +
    `</svg>`
  );
}

function png(fonte: string, lado: number, arquivo: string, fundo?: string): void {
  const r = new Resvg(fonte, { fitTo: { mode: 'width', value: lado }, ...(fundo ? { background: fundo } : {}) });
  writeFileSync(arquivo, r.render().asPng());
  console.log(`ok → ${arquivo}`);
}

mkdirSync(iconsDir, { recursive: true });

// Ícone comum: o desenho com um respiro de 9% em cada lado.
const comum = svg(0.82);
png(comum, 192, join(iconsDir, 'icon-192.png'), FUNDO);
png(comum, 512, join(iconsDir, 'icon-512.png'), FUNDO);
// iPhone: sem transparência; o sistema recorta os cantos.
png(comum, 180, join(iconsDir, 'apple-touch-icon.png'), FUNDO);
// Maskable: o desenho inteiro cabe nos 60% centrais (20% de margem de segurança em cada lado).
png(svg(0.72), 512, join(iconsDir, 'maskable-512.png'), FUNDO);
// Favicon: mesmo desenho, com os cantos arredondados.
const favicon = join(pub, 'favicon.svg');
writeFileSync(favicon, `${svg(0.82, 112)}\n`);
console.log(`ok → ${favicon}`);
