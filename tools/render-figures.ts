/**
 * Pré-visualização das animações do boneco em PNG (folha de contato).
 *
 * Uso:
 *   npm run fig -- agachamento-livre prancha        → .out/fig/<id>.png
 *   npm run fig -- --all                             → todas as animações de src/data/anim
 *   npm run fig -- --light agachamento-livre         → tema claro
 *   npm run fig -- --frames 8 agachamento-livre      → mais quadros intermediários
 *
 * Cada folha mostra as keys (rotuladas K0, K1, …) e os quadros intermediários, na ordem do ciclo.
 * A ferramenta também imprime os avisos de validação (alvo fora de alcance, articulação abaixo do chão etc.).
 */
import { mkdirSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { Resvg } from '@resvg/resvg-js';
import { STAGE, fitView, frame, loopDuration, timeOfKey, validate } from '../src/rig/core.ts';
import { THEME_DARK, THEME_LIGHT, primsToMarkup, viewBoxAttr } from '../src/rig/svg.ts';
import type { RigDef } from '../src/rig/types.ts';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const animDir = join(root, 'src', 'data', 'anim');
const outDir = join(root, '.out', 'fig');

const args = process.argv.slice(2);
const light = args.includes('--light');
const all = args.includes('--all');
const framesIdx = args.indexOf('--frames');
const between = framesIdx >= 0 ? Math.max(0, Number(args[framesIdx + 1]) || 1) : 1;
const ids = args.filter((a: string, i: number) => !a.startsWith('--') && !(framesIdx >= 0 && i === framesIdx + 1));

const theme = light ? THEME_LIGHT : THEME_DARK;
const bg = light ? '#ffffff' : '#141920';
const ink = light ? '#5b6574' : '#909bab';

async function load(id: string): Promise<RigDef> {
  const mod = await import(pathToFileURL(join(animDir, `${id}.ts`)).href);
  const def: RigDef | undefined = mod.default ?? Object.values(mod).find((v) => v && typeof v === 'object' && 'keys' in (v as object));
  if (!def) throw new Error(`${id}: o arquivo não exporta um RigDef (use export default)`);
  return def as RigDef;
}

function sheet(def: RigDef): string {
  const nKeys = def.keys.length;
  const shots: { t: number; label: string }[] = [];
  if (nKeys < 2) shots.push({ t: 0, label: 'pose única' });
  else {
    const total = loopDuration(def);
    for (let i = 0; i < nKeys; i++) {
      const t0 = timeOfKey(def, i);
      shots.push({ t: t0, label: `K${i}` });
      const hold = def.keys[i]?.hold ?? 0;
      const j = (i + 1) % nKeys;
      const d = def.keys[j]?.dur ?? 0;
      for (let b = 1; b <= between; b++) {
        const t = (t0 + hold + (d * b) / (between + 1)) % total;
        shots.push({ t, label: `K${i}→K${j} ${Math.round((100 * b) / (between + 1))}%` });
      }
    }
  }
  const cols = shots.length <= 4 ? 2 : shots.length <= 9 ? 3 : 4;
  const rows = Math.ceil(shots.length / cols);
  const cw = STAGE.w;
  const ch = STAGE.h + 14;
  const cells = shots
    .map((s, i) => {
      const x = (i % cols) * cw;
      const y = Math.floor(i / cols) * ch;
      return (
        `<g transform="translate(${x} ${y})">` +
        `<rect x="1" y="1" width="${cw - 2}" height="${ch - 2}" rx="6" fill="${bg}"/>` +
        `<svg x="0" y="12" width="${cw}" height="${STAGE.h}" viewBox="${viewBoxAttr(fitView(def))}">${primsToMarkup(frame(def, s.t), theme)}</svg>` +
        `<text x="8" y="12" font-family="Consolas, monospace" font-size="7" fill="${ink}">${def.id} · ${s.label} · t=${s.t.toFixed(2)}s</text>` +
        `</g>`
      );
    })
    .join('');
  const w = cols * cw;
  const h = rows * ch;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w * 2}" height="${h * 2}"><rect width="${w}" height="${h}" fill="${light ? '#e9ecf0' : '#0d1015'}"/>${cells}</svg>`;
}

async function main() {
  const list = all ? readdirSync(animDir).filter((f: string) => f.endsWith('.ts') && !f.startsWith('_')).map((f: string) => f.replace(/\.ts$/, '')) : ids;
  if (!list.length) {
    console.error('Informe os ids das animações ou --all');
    process.exit(2);
  }
  mkdirSync(outDir, { recursive: true });
  let errors = 0;
  for (const id of list) {
    try {
      const def = await load(id);
      if (def.id !== id) console.log(`[${id}] AVISO: def.id é "${def.id}", deveria ser "${id}"`);
      const issues = validate(def);
      for (const it of issues) console.log(`[${id}] ${it.level === 'error' ? 'ERRO' : 'aviso'}: ${it.msg}`);
      errors += issues.filter((i) => i.level === 'error').length;
      const png = new Resvg(sheet(def), { font: { loadSystemFonts: true } }).render().asPng();
      const file = join(outDir, `${id}${light ? '-claro' : ''}.png`);
      writeFileSync(file, png);
      console.log(`[${id}] ok → ${file} (${def.keys.length} keys, ciclo ${loopDuration(def).toFixed(1)} s)`);
    } catch (e) {
      errors++;
      console.log(`[${id}] ERRO ao carregar/desenhar: ${(e as Error).message}`);
    }
  }
  process.exit(errors ? 1 : 0);
}

void main();
