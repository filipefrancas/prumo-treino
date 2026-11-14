/**
 * Confere a biblioteca de exercícios (src/data/ex), as animações (src/data/anim), as fotos embutidas
 * (src/assets/fotos) e as fichas de musculação contra docs/CATALOGO.md.
 *
 * Todo id do catálogo precisa do texto. A imagem pode ser a foto embutida (`<id>-0.jpg`, com `<id>-1.jpg` opcional)
 * OU a animação: ter as duas é permitido, não ter nenhuma é só um aviso (o app mostra um quadro neutro com as
 * iniciais), exceto nos exercícios das fichas de musculação e do alongamento do dia, em que é um problema.
 *
 * Uso: npx tsx tools/check-content.ts
 */
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { PROGRAMAS } from '../src/data/fichas.ts';
import { PROFILE } from '../src/data/profile.ts';
import { ROUTINES } from '../src/data/routines.ts';
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

const avisos: string[] = [];

const exIds = new Set(files('ex'));
const animIds = new Set(files('anim'));

/* fotos embutidas: <id>-0.jpg (início) e <id>-1.jpg (fim), ou <id>.jpg */
const pastaFotos = join(root, 'src', 'assets', 'fotos');
const fotoIds = new Map<string, Set<number>>();
if (existsSync(pastaFotos)) {
  for (const f of readdirSync(pastaFotos)) {
    const m = /^(.+?)(?:-([01]))?\.(?:jpe?g|webp|png)$/i.exec(f);
    if (!m || !m[1]) {
      if (f !== '.gitkeep') warn(`[foto] ${f}: nome fora do padrão (<id>-0.jpg, <id>-1.jpg)`);
      continue;
    }
    const quadros = fotoIds.get(m[1]) ?? new Set<number>();
    quadros.add(m[2] === '1' ? 1 : 0);
    fotoIds.set(m[1], quadros);
  }
}
for (const [id, quadros] of fotoIds) {
  if (!ids.has(id)) warn(`[foto] ${id}: não está no catálogo`);
  if (!quadros.has(0)) warn(`[foto] ${id}: tem o quadro 1 e falta o quadro 0`);
}
const temImagem = (id: string): boolean => fotoIds.has(id) || animIds.has(id);

for (const row of rows) {
  if (!exIds.has(row.id)) warn(`[ex] falta o texto de ${row.id}`);
  if (!temImagem(row.id)) avisos.push(`[imagem] ${row.id}: sem foto e sem animação (o app mostra as iniciais)`);
}

/* fichas de musculação: todo exercício aponta para um id do catálogo, com texto e imagem */
const exFicha = new Set<string>();
for (const p of PROGRAMAS) {
  for (const f of p.fichas) {
    if (!f.porque) warn(`[ficha] ${p.id} ${f.id}: sem o texto "Por que assim"`);
    for (const e of f.exercicios) {
      if (exFicha.has(e.id)) warn(`[ficha] ${e.id}: id repetido`);
      exFicha.add(e.id);
      if (!ids.has(e.anim)) warn(`[ficha] ${e.id}: "${e.anim}" não está no catálogo`);
      else if (!temImagem(e.anim)) warn(`[ficha] ${e.id}: ${e.anim} sem foto e sem animação`);
    }
  }
}

/* rotinas: todo passo aponta para o catálogo; as posições do alongamento do dia precisam de imagem */
for (const r of ROUTINES) {
  for (const passo of r.steps) {
    if (!ids.has(passo.ex)) warn(`[rotina] ${r.id}: "${passo.ex}" não está no catálogo`);
    else if (r.id === PROFILE.stretchRoutine && !temImagem(passo.ex)) warn(`[rotina] ${r.id}: ${passo.ex} sem foto e sem animação`);
  }
}
if (!ROUTINES.some((r) => r.id === PROFILE.stretchRoutine)) warn(`[perfil] a rotina de alongamento "${PROFILE.stretchRoutine}" não existe`);

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

console.log(`catálogo: ${rows.length} · textos: ${exIds.size} · animações: ${animIds.size} · com foto: ${fotoIds.size}`);
if (avisos.length) console.log(avisos.join('\n'));
if (problems.length) {
  console.log(problems.join('\n'));
  console.log(`\n${problems.length} problema(s).`);
  process.exitCode = 1;
} else console.log('Tudo certo.');
