import { useLayoutEffect, useRef, useState } from 'preact/hooks';
import { animById } from '../data/anim/_index.ts';
import { temFoto, useFoto } from '../lib/midia.ts';
import { Figure, type FigureProps } from './Figure.tsx';

/** As mesmas props de `Figure`. */
export type ExMediaProps = FigureProps;

/** Fotos bem mais altas que largas (as da ficha são 9:16) aparecem inteiras no bloco grande, sobre um fundo desfocado. */
const RETRATO_MIN = 1.2;
/** Largura a partir da qual o bloco conta como "grande" (cabe o botão de alternar); abaixo disso é miniatura. */
const LARGURA_GRANDE = 150;

/**
 * Imagem de um exercício: a foto real, quando o aparelho tem uma para o id (pacote importado em Ajustes › Dados),
 * ou o boneco animado (`Figure`) como reserva. Com foto e `play` diferente de 'never', um botão pequeno alterna
 * entre a foto e a animação.
 */
export function ExMedia(props: ExMediaProps) {
  const { id, def, play = 'visible', tone = 'musc', label, class: cls } = props;
  const url = useFoto(id);
  const [alt, setAlt] = useState<{ id: string | undefined; anim: boolean }>({ id, anim: false });
  const [forma, setForma] = useState<{ url: string; retrato: boolean } | undefined>(undefined);
  const [falhou, setFalhou] = useState<string | undefined>(undefined);
  const caixa = useRef<HTMLDivElement>(null);
  const [largo, setLargo] = useState(false);

  const comFoto = temFoto(id) && falhou !== url;

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

  if (!comFoto) return <Figure {...props} />;

  const grande = play !== 'never' && largo;
  const temAnim = def !== undefined || (id !== undefined && animById(id) !== undefined);
  const verAnim = grande && temAnim && alt.id === id && alt.anim;
  const retrato = grande && url !== undefined && forma?.url === url && forma.retrato;
  const texto = label?.replace(/^Animação:\s*/, 'Foto: ');
  const classes = `ui-fig ui-media ui-fig--${tone}${retrato && !verAnim ? ' is-retrato' : ''} ${cls ?? ''}`;

  return (
    <div class={classes} ref={caixa}>
      {verAnim ? (
        <Figure {...props} class="ui-media-fig" />
      ) : url !== undefined ? (
        <>
          {retrato ? <img class="ui-media-fundo" src={url} alt="" aria-hidden="true" /> : null}
          <img
            class="ui-media-img"
            src={url}
            alt={texto ?? ''}
            decoding="async"
            draggable={false}
            onLoad={(e) => {
              const img = e.currentTarget;
              setForma({ url, retrato: img.naturalWidth > 0 && img.naturalHeight / img.naturalWidth >= RETRATO_MIN });
            }}
            onError={() => setFalhou(url)}
          />
        </>
      ) : null}
      {grande && temAnim ? (
        <button type="button" class="ui-media-alt" aria-pressed={verAnim} onClick={() => setAlt({ id, anim: !verAnim })}>
          {verAnim ? 'ver foto' : 'ver animação'}
        </button>
      ) : null}
    </div>
  );
}
