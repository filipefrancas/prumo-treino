import { useEffect, useLayoutEffect, useRef, useState } from 'preact/hooks';
import { fotosEmbutidas } from '../lib/fotos.ts';
import { temFoto, useFoto } from '../lib/midia.ts';
import { Figure, type FigureProps } from './Figure.tsx';

/** As mesmas props de `Figure`. */
export type ExMediaProps = FigureProps;

/** Largura a partir da qual o bloco conta como "grande"; abaixo disso é miniatura. */
const LARGURA_GRANDE = 150;
/** Tempo de cada quadro (início, fim) quando a foto tem os dois. */
const TROCA_MS = 1200;

const movimentoReduzido = (): boolean => typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Imagem de um exercício, nesta ordem de prioridade: a foto embutida no app (`src/assets/fotos`), a foto importada
 * no aparelho (Ajustes › Dados), o boneco animado e, sem nenhum deles, um quadro neutro com as iniciais do nome.
 *
 * Miniatura (`play="never"` ou bloco estreito): o quadro inicial, preenchendo o espaço. Bloco grande: a foto
 * inteira, sobre uma cópia desfocada dela mesma; se o exercício tem os quadros de início e fim, eles se alternam
 * a cada 1,2 s (com "reduzir movimento" ligado, fica o início e o toque no indicador troca o quadro).
 */
export function ExMedia(props: ExMediaProps) {
  const { id, play = 'visible', paused = false, tone = 'musc', label, class: cls } = props;
  const embutidas = fotosEmbutidas(id);
  const doAparelho = useFoto(embutidas.length > 0 ? undefined : id);
  const [falhou, setFalhou] = useState<string | undefined>(undefined);
  const [quadro, setQuadro] = useState<{ id: string | undefined; n: number }>({ id, n: 0 });
  const caixa = useRef<HTMLDivElement>(null);
  const [largo, setLargo] = useState(false);

  const quadros = (embutidas.length > 0 ? embutidas : doAparelho !== undefined && temFoto(id) ? [doAparelho] : []).filter((u) => u !== falhou);
  const comFoto = quadros.length > 0;
  const grande = play !== 'never' && largo;
  const doisQuadros = grande && quadros.length > 1;
  const alterna = doisQuadros && !paused;

  useLayoutEffect(() => {
    const el = caixa.current;
    if (!el || play === 'never') return undefined;
    const medir = (): void => setLargo(el.clientWidth >= LARGURA_GRANDE);
    medir();
    if (typeof ResizeObserver !== 'function') return undefined;
    const ro = new ResizeObserver(medir);
    ro.observe(el);
    return () => ro.disconnect();
  }, [comFoto, play]);

  useEffect(() => {
    if (!alterna || movimentoReduzido()) return undefined;
    const t = setInterval(() => {
      if (typeof document !== 'undefined' && document.hidden) return;
      setQuadro((q) => ({ id, n: q.id === id ? 1 - q.n : 1 }));
    }, TROCA_MS);
    return () => clearInterval(t);
  }, [alterna, id]);

  if (!comFoto) return <Figure {...props} />;

  const atual = doisQuadros && quadro.id === id ? quadro.n : 0;
  const texto = label?.replace(/^Animação:\s*/, 'Foto: ');
  const fundo = quadros[atual] ?? quadros[0];

  return (
    <div class={`ui-fig ui-media ui-fig--${tone}${grande ? ' is-inteira' : ''} ${cls ?? ''}`} ref={caixa}>
      {grande && fundo !== undefined ? <img class="ui-media-fundo" src={fundo} alt="" aria-hidden="true" /> : null}
      {(doisQuadros ? quadros : quadros.slice(0, 1)).map((url, i) => (
        <img
          key={url}
          class={`ui-media-img${i === atual ? ' is-on' : ''}`}
          src={url}
          alt={i === 0 ? (texto ?? '') : ''}
          aria-hidden={i === 0 ? undefined : true}
          draggable={false}
          onError={() => setFalhou(url)}
        />
      ))}
      {doisQuadros ? (
        <button
          type="button"
          class="ui-media-passo"
          aria-label={atual === 0 ? 'Mostrando o início do movimento. Toque para ver o fim.' : 'Mostrando o fim do movimento. Toque para ver o início.'}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setQuadro({ id, n: 1 - atual });
          }}
        >
          <i class={atual === 0 ? 'is-on' : ''} />
          <i class={atual === 1 ? 'is-on' : ''} />
          <span>{atual === 0 ? 'início' : 'fim'}</span>
        </button>
      ) : null}
    </div>
  );
}
