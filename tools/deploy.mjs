/**
 * Publica o app no GitHub Pages (branch gh-pages do repositório origin).
 *
 * Uso: node tools/deploy.mjs            → usa a pasta dist/ já gerada por "npm run build"
 *      node tools/deploy.mjs --build    → roda o build antes
 *
 * O site é servido em https://filipefrancas.github.io/prumo-treino/. A publicação é um commit único
 * (sem histórico) com o conteúdo de dist/, mais .nojekyll e robots.txt.
 */
import { execFileSync } from 'node:child_process';
import { cpSync, existsSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const REMOTE = 'https://github.com/filipefrancas/prumo-treino.git';
const run = (cmd, args, cwd) => execFileSync(cmd, args, { cwd, stdio: 'pipe', encoding: 'utf8', env: { ...process.env, GIT_TERMINAL_PROMPT: '0', GCM_INTERACTIVE: 'never' } });

if (process.argv.includes('--build')) {
  console.log('build…');
  execFileSync(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['run', 'build'], { cwd: root, stdio: 'inherit', shell: process.platform === 'win32' });
}

const dist = join(root, 'dist');
if (!existsSync(join(dist, 'index.html')) || !existsSync(join(dist, 'sw.js'))) {
  console.error('dist/ incompleto: rode "npm run build" antes (faltam index.html ou sw.js).');
  process.exit(1);
}

const version = run('git', ['rev-parse', '--short', 'HEAD'], root).trim();
const work = mkdtempSync(join(tmpdir(), 'prumo-treino-pages-'));
try {
  cpSync(dist, work, { recursive: true });
  writeFileSync(join(work, '.nojekyll'), '');
  writeFileSync(join(work, 'robots.txt'), 'User-agent: *\nDisallow: /\n');
  run('git', ['init', '-q', '-b', 'gh-pages'], work);
  run('git', ['config', 'user.name', 'filipefrancas'], work);
  run('git', ['config', 'user.email', '347019141+filipefrancas@users.noreply.github.com'], work);
  run('git', ['config', 'core.autocrlf', 'false'], work);
  run('git', ['add', '-A'], work);
  run('git', ['commit', '-q', '-m', `Publicação ${version}`], work);
  run('git', ['remote', 'add', 'origin', REMOTE], work);
  console.log(run('git', ['push', '-f', 'origin', 'gh-pages'], work) || 'enviado');
  console.log(`Publicado (${version}): https://filipefrancas.github.io/prumo-treino/`);
} finally {
  rmSync(work, { recursive: true, force: true });
}
