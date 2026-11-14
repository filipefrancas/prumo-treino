/**
 * Fotos embutidas dos exercícios: arquivos em `src/assets/fotos/`, que entram no pacote do app (e no cache
 * offline) no build. Elas têm prioridade sobre as fotos importadas no aparelho (lib/midia) e sobre o boneco.
 *
 * Nome do arquivo: `<id do catálogo>-0.jpg` (início do movimento) e, quando existe, `<id>-1.jpg` (fim). Um arquivo
 * `<id>.jpg`, sem número, vale como quadro 0. Exercício de posição parada (alongamento) tem só o quadro 0.
 *
 * Crédito: Free Exercise DB (domínio público).
 */

const ARQUIVOS = import.meta.glob<string>('../assets/fotos/*.{jpg,jpeg,webp,png}', { eager: true, query: '?url', import: 'default' });

/**
 * Monta o índice id → [quadro 0, quadro 1?] a partir de um mapa caminho → endereço. Um id que só tem o quadro 1
 * usa esse quadro como único; arquivos com nome fora do padrão são ignorados.
 */
export function indexarFotos(arquivos: Record<string, string>): Map<string, string[]> {
  const quadros = new Map<string, [string | undefined, string | undefined]>();
  for (const caminho of Object.keys(arquivos).sort()) {
    const url = arquivos[caminho];
    const m = /([^/\\]+)\.(?:jpe?g|webp|png)$/i.exec(caminho);
    if (!m || !m[1] || typeof url !== 'string' || url === '') continue;
    const nome = m[1];
    const q = /^(.+)-([01])$/.exec(nome);
    const id = q?.[1] ?? nome;
    const n = q?.[2] === '1' ? 1 : 0;
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)) continue;
    const par = quadros.get(id) ?? [undefined, undefined];
    // "<id>-0" vence "<id>" (sem número) quando os dois existem
    if (q || par[n] === undefined) par[n] = url;
    quadros.set(id, par);
  }
  const indice = new Map<string, string[]>();
  for (const [id, par] of quadros) indice.set(id, par.filter((u): u is string => u !== undefined));
  return indice;
}

const INDICE = indexarFotos(ARQUIVOS);
const VAZIO: string[] = [];

/** Endereços das fotos embutidas do exercício: [] sem foto, [início] ou [início, fim]. */
export function fotosEmbutidas(id: string | undefined): string[] {
  return (id !== undefined ? INDICE.get(id) : undefined) ?? VAZIO;
}

/** Há foto embutida para este id? */
export function temFotoEmbutida(id: string | undefined): boolean {
  return fotosEmbutidas(id).length > 0;
}

/** ids do catálogo que têm foto embutida, em ordem alfabética. */
export function idsComFotoEmbutida(): string[] {
  return [...INDICE.keys()].sort();
}
