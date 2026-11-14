/**
 * Confere a biblioteca de exercícios (src/data/ex) e as animações (src/data/anim) contra docs/CATALOGO.md.
 * Uso: npx tsx tools/check-content.ts
 */
import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { validate } from '../src/rig/core.ts';
import type { RigDef } from '../src/rig/types.ts';
import type { Exercise } from '../src/types.ts';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const catalog = readFileSync(join(root, 'docs', 'CATALOGO.md'), 'utf8');
const rows = [...catalog.matchAll(/^\| `([a-z0-9-]+)` \| ([^|]+) \| ([a-z]+) \| ([a-z-]+) \|/gm)].map((m) => ({
  id: m[1] as string,
  name: (m[2] as string).trim(),
  kind: m[3] as string,
  group: m[4] as string,
}));
const ids = new Set(rows.map((r) => r.id));
const files = (dir: string): string[] =>
  readdirSync(join(root, 'src', 'data', dir)).filter((f: string) => f.endsWith('.ts') && !f.startsWith('_')).map((f: string) => f.replace(/\.ts$/, ''));
const load = async <T>(dir: string, id: string): Promise<T> => (await import(pathToFileURL(join(root, 'src', 'data', dir, `${id}.ts`)).href)).default as T;

const problems: string[] = [];
const warn = (msg: string) => problems.push(msg);

const exIds = new Set(files('ex'));
const animIds = new Set(files('anim'));

for (const row of rows) {
  if (!exIds.has(row.id)) warn(`[ex] falta o texto de ${row.id}`);
  if (!animIds.has(row.id)) warn(`[anim] falta a animação de ${row.id}`);
}

for (const id of exIds) {
  const row = rows.find((r) => r.id === id);
  if (!row) {
    warn(`[ex] ${id} não está no catálogo`);
    continue;
  }
  try {
    const ex = await load<Exercise>('ex', id);
    if (ex.id !== id) warn(`[ex] ${id}: id interno "${ex.id}"`);
    if (ex.name !== row.name) warn(`[ex] ${id}: nome "${ex.name}" ≠ catálogo "${row.name}"`);
    if (ex.kind !== row.kind) warn(`[ex] ${id}: kind "${ex.kind}" ≠ catálogo "${row.kind}"`);
    if (ex.group !== row.group) warn(`[ex] ${id}: group "${ex.group}" ≠ catálogo "${row.group}"`);
    if (!ex.how || ex.how.length < 3 || ex.how.length > 5) warn(`[ex] ${id}: how com ${ex.how?.length ?? 0} passos`);
    if (!ex.cues || ex.cues.length < 2 || ex.cues.length > 3) warn(`[ex] ${id}: cues com ${ex.cues?.length ?? 0}`);
    if (!ex.mistakes || ex.mistakes.length < 2 || ex.mistakes.length > 3) warn(`[ex] ${id}: mistakes com ${ex.mistakes?.length ?? 0}`);
    for (const s of ex.how ?? []) if (s.length > 130) warn(`[ex] ${id}: passo longo (${s.length})`);
    for (const s of [...(ex.cues ?? []), ...(ex.mistakes ?? [])]) if (s.length > 110) warn(`[ex] ${id}: dica/erro longo (${s.length})`);
    if (!ex.muscles?.primary?.length) warn(`[ex] ${id}: sem músculo principal`);
    if (!ex.equipment?.length) warn(`[ex] ${id}: sem equipamento`);
    if (!ex.yt) warn(`[ex] ${id}: sem termos de busca`);
    for (const s of ex.swap ?? []) if (!ids.has(s)) warn(`[ex] ${id}: swap "${s}" não existe no catálogo`);
  } catch (e) {
    warn(`[ex] ${id}: erro ao carregar: ${(e as Error).message}`);
  }
}

for (const id of animIds) {
  try {
    const def = await load<RigDef>('anim', id);
    if (def.id !== id) warn(`[anim] ${id}: id interno "${def.id}"`);
    for (const issue of validate(def)) if (issue.level === 'error') warn(`[anim] ${id}: ${issue.msg}`);
  } catch (e) {
    warn(`[anim] ${id}: erro ao carregar: ${(e as Error).message}`);
  }
}

console.log(`catálogo: ${rows.length} · textos: ${exIds.size} · animações: ${animIds.size}`);
if (problems.length) {
  console.log(problems.join('\n'));
  console.log(`\n${problems.length} problema(s).`);
} else console.log('Tudo certo.');
