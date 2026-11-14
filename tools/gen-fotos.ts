/**
 * FERRAMENTA ANTIGA: servia à ficha usada até nov/2026 (programa "hibrido"), que saiu do app. As fotos agora são
 * embutidas (src/assets/fotos, ver src/lib/fotos.ts). Fica aqui só como referência do formato do pacote de fotos.
 *
 * Pacote PRIVADO de fotos dos exercícios, montado com as miniaturas da ficha do treinador.
 *
 * Uso (a partir da raiz do projeto):  npx tsx tools/gen-fotos.ts [--dados <pasta>] [--saida <arquivo>]
 *
 * As fotos não podem entrar no repositório (ele é público): a entrada e a saída ficam FORA dele, por padrão na
 * pasta irmã `../prumo-treino-dados`:
 *   entrada  derivados/ficha-fabiano-hibrido.json              ordem e nome dos cartões de cada treino
 *            derivados/ficha-fabiano-hibrido-imagens/*.jpeg    "<treino>-<NN>.jpeg", NN = ordem do cartão
 *   saída    fotos-prumo-treino.json                           importar em Ajustes › Dados › Importar fotos
 *
 * Mapa imagem → id do catálogo: os cartões de cada treino seguem a ordem dos exercícios da ficha em
 * src/data/fichas.ts (h-A-01…), e o id da foto é o campo `anim` do exercício. Um exercício que ocupa dois cartões
 * seguidos (Remada Cavalinho, Supino Reto) repete a imagem: vale a primeira. O nome de cada cartão é conferido
 * com o nome na ficha; se não bater, o script para. Um id que aparece em mais de uma ficha fica com a primeira foto.
 *
 * As imagens são reduzidas para no máximo 900 px de largura (JPEG, qualidade 80) quando o `sharp` está instalado;
 * sem ele, entram como estão (as miniaturas da ficha têm 270 × 480).
 */
import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { PROGRAMAS } from '../src/data/fichas.ts';
import type { Exercise } from '../src/types.ts';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const take = (flag: string): string | undefined => {
  const i = args.indexOf(flag);
  return i >= 0 ? args[i + 1] : undefined;
};

const dados = resolve(take('--dados') ?? join(root, '..', 'prumo-treino-dados'));
const saida = resolve(take('--saida') ?? join(dados, 'fotos-prumo-treino.json'));
const fichaJson = join(dados, 'derivados', 'ficha-fabiano-hibrido.json');
const pastaImagens = join(dados, 'derivados', 'ficha-fabiano-hibrido-imagens');

const LARGURA_MAX = 900;
const QUALIDADE = 80;
const CREDITO = 'Ficha do treinador (app MFIT Personal)';

/** Treino do PDF → ficha do app e prefixo dos arquivos de imagem. */
const TREINOS: { titulo: string; ficha: string; prefixo: string }[] = [
  { titulo: 'Costas e bíceps', ficha: 'A', prefixo: 'costas-e-biceps' },
  { titulo: 'Inferiores', ficha: 'B', prefixo: 'inferiores' },
  { titulo: 'Peito, ombro e braço', ficha: 'C', prefixo: 'peito-ombro-e-braco' },
];

/**
 * Correções manuais: "<arquivo sem extensão>" → id do catálogo (ou null para descartar a imagem). Use se alguma
 * miniatura não corresponder ao cartão da mesma ordem. Conferido em nov/2026: a numeração bate, nada a corrigir.
 */
const CORRECOES: Record<string, string | null> = {};

interface CartaoJson {
  order: number;
  name: string;
}
interface TreinoJson {
  title: string;
  exercises: CartaoJson[];
}

const norm = (s: string): string =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

function falhar(msg: string): never {
  console.error(`gen-fotos: ${msg}`);
  process.exit(1);
}

/** O catálogo, lido arquivo por arquivo (o índice de src/data/ex usa import.meta.glob, que só existe no Vite). */
async function lerCatalogo(): Promise<Exercise[]> {
  const pasta = join(root, 'src', 'data', 'ex');
  const arquivos = readdirSync(pasta).filter((f) => f.endsWith('.ts') && !f.startsWith('_'));
  const lista: Exercise[] = [];
  for (const f of arquivos) {
    const mod = (await import(pathToFileURL(join(pasta, f)).href)) as { default: Exercise };
    lista.push(mod.default);
  }
  return lista.sort((a, b) => a.id.localeCompare(b.id));
}

type Redutor = (entrada: Buffer) => Promise<Buffer>;

/** Carrega o sharp só se já estiver em node_modules (nada é instalado por este script). */
async function carregarRedutor(): Promise<Redutor | undefined> {
  try {
    const nome = 'sharp';
    const mod = (await import(nome)) as { default: (b: Buffer) => { rotate(): { resize(o: object): { jpeg(o: object): { toBuffer(): Promise<Buffer> } } } } };
    const sharp = mod.default;
    return (entrada) => sharp(entrada).rotate().resize({ width: LARGURA_MAX, withoutEnlargement: true }).jpeg({ quality: QUALIDADE, mozjpeg: true }).toBuffer();
  } catch {
    return undefined;
  }
}

async function main(): Promise<void> {
  if (saida.startsWith(root + '\\') || saida.startsWith(root + '/')) falhar('a saída não pode ficar dentro do repositório (ele é público).');
  if (!existsSync(fichaJson)) falhar(`não achei ${fichaJson}`);
  const ficha = JSON.parse(readFileSync(fichaJson, 'utf8')) as { workouts: TreinoJson[] };
  const hibrido = PROGRAMAS.find((p) => p.id === 'hibrido');
  if (!hibrido) falhar('programa "hibrido" não encontrado em src/data/fichas.ts');

  const redutor = await carregarRedutor();
  const fotos: { id: string; mime: string; data: string; credito: string }[] = [];
  const usados = new Set<string>();
  const mapa: string[] = [];
  let lidas = 0;

  for (const t of TREINOS) {
    const treino = ficha.workouts.find((w) => norm(w.title) === norm(t.titulo));
    const exs = hibrido.fichas.find((f) => f.id === t.ficha)?.exercicios;
    if (!treino || !exs) falhar(`treino "${t.titulo}" (ficha ${t.ficha}) não encontrado`);
    const cartoes = [...treino.exercises].sort((a, b) => a.order - b.order);
    let i = -1; // índice do exercício na ficha do app
    let anterior = '';
    for (const c of cartoes) {
      const repetido = norm(c.name) === anterior;
      if (!repetido) i += 1;
      anterior = norm(c.name);
      const ex = exs[i];
      if (!ex) falhar(`${t.titulo}: o cartão ${c.order} ("${c.name}") não tem exercício correspondente na ficha ${t.ficha}`);
      if (norm(ex.nome) !== norm(c.name)) falhar(`${t.titulo}: o cartão ${c.order} é "${c.name}", mas a ficha ${t.ficha} tem "${ex.nome}" (${ex.id}) nessa posição`);

      const base = `${t.prefixo}-${String(c.order).padStart(2, '0')}`;
      const arquivo = join(pastaImagens, `${base}.jpeg`);
      const corrigido = CORRECOES[base];
      const id = corrigido === undefined ? ex.anim : corrigido;
      if (!existsSync(arquivo)) {
        mapa.push(`${base}  →  (sem arquivo)  ${ex.id} ${ex.anim}`);
        continue;
      }
      lidas += 1;
      if (id === null) {
        mapa.push(`${base}  →  descartada (correção manual)`);
        continue;
      }
      if (repetido && corrigido === undefined) {
        mapa.push(`${base}  →  ${id}  (${ex.id}; segundo cartão do mesmo exercício, ignorada)`);
        continue;
      }
      if (usados.has(id)) {
        mapa.push(`${base}  →  ${id}  (${ex.id}; id já tem foto, ignorada)`);
        continue;
      }
      const original = readFileSync(arquivo);
      const bytes = redutor ? await redutor(original) : original;
      usados.add(id);
      fotos.push({ id, mime: 'image/jpeg', data: bytes.toString('base64'), credito: CREDITO });
      mapa.push(`${base}  →  ${id}  (${ex.id})`);
    }
  }

  const catalogo = await lerCatalogo();
  const idsCatalogo = new Set(catalogo.map((e) => e.id));
  const fora = fotos.filter((f) => !idsCatalogo.has(f.id)).map((f) => f.id);
  if (fora.length > 0) falhar(`ids fora do catálogo: ${fora.join(', ')}`);

  writeFileSync(saida, JSON.stringify({ kind: 'prumo-treino-fotos', version: 1, fotos }));

  const semFoto = catalogo.filter((e) => !usados.has(e.id));
  console.log(mapa.join('\n'));
  console.log('');
  console.log(redutor ? `Imagens reduzidas com sharp (máx. ${LARGURA_MAX} px, JPEG ${QUALIDADE}).` : 'sharp não está instalado: imagens gravadas como vieram, sem redimensionar.');
  console.log(`${lidas} imagens lidas, ${fotos.length} fotos no pacote.`);
  console.log(`Arquivo: ${saida} (${(statSync(saida).size / 1024).toFixed(0)} KB)`);
  console.log(`Catálogo: ${catalogo.length} exercícios, ${semFoto.length} sem foto:`);
  const porTipo = new Map<string, string[]>();
  for (const e of semFoto) porTipo.set(e.kind, [...(porTipo.get(e.kind) ?? []), e.id]);
  for (const [tipo, lista] of porTipo) console.log(`  ${tipo} (${lista.length}): ${lista.join(', ')}`);
}

void main();
