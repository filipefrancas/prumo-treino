/**
 * Capturas de tela do app no formato de celular, para conferência visual.
 *
 * Uso (a partir da raiz do projeto):
 *   npm run shots -- hoje corrida                     → rotas #/hoje e #/corrida → .out/shots/hoje-escuro.png, hoje-claro.png, …
 *   npm run shots -- corrida/treino/c-2026-11-18      → rota com parâmetros
 *   npm run shots -- kit-base.html                    → página avulsa do projeto
 *   npm run shots -- --full progresso                 → página inteira (com rolagem)
 *   npm run shots -- --dark hoje                      → só o tema escuro (--light: só o claro)
 *   npm run shots -- --size 430x932 hoje              → outro tamanho (padrão 390x844, o iPhone 14)
 *   npm run shots -- --date 2026-11-18 hoje           → congela o relógio do navegador nesse dia (12h)
 *   npm run shots -- --seed tests/fixtures/estado.json hoje   → carrega esse estado antes de abrir
 *   npm run shots -- --wait 800 hoje                  → espera extra (ms) antes de capturar
 *   npm run shots -- --name sessao-descanso musculacao/sessao     → nome do arquivo de saída
 *
 * As rotas vão SEM "#/" (o Git Bash do Windows converteria o argumento em caminho de arquivo).
 *
 * Sobe um servidor de desenvolvimento do Vite em uma porta livre e usa o Chrome instalado na máquina.
 * Erros de console e de página aparecem na saída: trate-os como defeitos.
 */
import { mkdirSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';
import { createServer } from 'vite';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, '.out', 'shots');

const args = process.argv.slice(2);
const take = (flag: string): string | undefined => {
  const i = args.indexOf(flag);
  if (i < 0) return undefined;
  const v = args[i + 1];
  args.splice(i, 2);
  return v;
};
const has = (flag: string): boolean => {
  const i = args.indexOf(flag);
  if (i < 0) return false;
  args.splice(i, 1);
  return true;
};

const size = (take('--size') ?? '390x844').split('x').map(Number);
const date = take('--date');
const seed = take('--seed');
const wait = Number(take('--wait') ?? 350);
const name = take('--name');
const full = has('--full');
const onlyDark = has('--dark');
const onlyLight = has('--light');
const targets = args.filter((a: string) => !a.startsWith('--'));

const isPage = (t: string): boolean => t.endsWith('.html');
const routeOf = (t: string): string => t.replace(/^#?\/?/, '');
const slug = (t: string): string =>
  name ?? (routeOf(t).replace(/\.html$/, '').replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-|-$/g, '') || 'inicio');

async function main() {
  if (!targets.length) {
    console.error('Informe ao menos uma rota (hoje) ou página (kit-base.html).');
    process.exit(2);
  }
  mkdirSync(outDir, { recursive: true });
  const server = await createServer({ root, logLevel: 'error', server: { port: 5600 + Math.floor(Math.random() * 300), strictPort: false, host: '127.0.0.1' } });
  await server.listen();
  const addr = server.httpServer?.address();
  const port = typeof addr === 'object' && addr ? addr.port : 5173;
  const base = `http://127.0.0.1:${port}/`;
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  let problems = 0;
  try {
    const schemes = onlyDark ? (['dark'] as const) : onlyLight ? (['light'] as const) : (['dark', 'light'] as const);
    for (const scheme of schemes) {
      const context = await browser.newContext({
        viewport: { width: size[0] ?? 390, height: size[1] ?? 844 },
        deviceScaleFactor: 2,
        colorScheme: scheme,
        locale: 'pt-BR',
        timezoneId: 'America/Sao_Paulo',
        hasTouch: true,
        isMobile: true,
        reducedMotion: 'reduce',
      });
      if (date) await context.clock.setFixedTime(new Date(`${date}T12:00:00-03:00`));
      if (seed) {
        const json = readFileSync(resolve(root, seed), 'utf8');
        await context.addInitScript((value: string) => {
          try {
            localStorage.setItem('prumo-treino:state', value);
            localStorage.setItem('prumo-treino:seed', '1');
          } catch {
            /* sem armazenamento */
          }
        }, json);
      }
      for (const target of targets) {
        const page = await context.newPage();
        page.on('console', (m) => {
          if (m.type() === 'error') {
            problems++;
            console.log(`[console.error] ${target}: ${m.text()}`);
          }
        });
        page.on('pageerror', (e) => {
          problems++;
          console.log(`[pageerror] ${target}: ${e.message}`);
        });
        const url = isPage(target) ? `${base}${target}` : `${base}#/${routeOf(target)}`;
        await page.goto(url, { waitUntil: 'networkidle' });
        await page.evaluate(() => document.fonts.ready);
        await page.waitForTimeout(wait);
        const file = join(outDir, `${slug(target)}-${scheme === 'dark' ? 'escuro' : 'claro'}.png`);
        await page.screenshot({ path: file, fullPage: full });
        console.log(`ok → ${file}`);
        await page.close();
      }
      await context.close();
    }
  } finally {
    await browser.close();
    await server.close();
  }
  if (problems) console.log(`ATENÇÃO: ${problems} erro(s) de console/página.`);
  process.exit(0);
}

void main();
