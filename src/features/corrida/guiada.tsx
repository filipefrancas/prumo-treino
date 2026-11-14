/* Corrida guiada pelo celular (#/corrida/guiada/:id): tela cheia, para a esteira ou para quem corre sem relógio. */
import { useEffect, useRef, useState } from 'preact/hooks';
import { runById } from '../../data/runs.ts';
import { passos, type Passo } from '../../lib/corrida.ts';
import { hoje } from '../../lib/dates.ts';
import { bip, calar, contagem, destravarAudio, falar, useAgora, useTelaLigada, vibrar } from '../../lib/feedback.ts';
import { fmtDur, fmtMin } from '../../lib/format.ts';
import { go } from '../../lib/router.ts';
import type { ISODate } from '../../types.ts';
import { Button, Empty, Icon, IntensityChart, Screen, TimerRing } from '../../ui/index.ts';
import { PASSO_ROTULO, alvo, contarPassos, corDoNivel, falaAlvo, falaDuracao, fmtPasso } from './comum.tsx';
import { RegistroSheet } from './registro.tsx';

/**
 * Estado da corrida guiada. O tempo nunca é contado por intervalos: a posição no treino é
 * `base` + (agora − `ancora`), e pausar só troca a âncora por null guardando a posição em `base`.
 */
interface Sessao {
  id: string;
  /** Dia em que começou: sessão de outro dia é descartada. */
  dia: ISODate;
  /** Posição no treino (segundos) no instante da âncora. */
  base: number;
  /** Date.now() de quando o relógio foi solto; null = pausado (ou ainda não começou). */
  ancora: number | null;
  /** Tempo realmente corrido (ms) até a âncora: não conta pausas nem o que foi pulado. */
  ativoMs: number;
  comecou: boolean;
}

const CHAVE = 'prumo-treino:guiada';

function ler(): Sessao | undefined {
  try {
    const bruto = localStorage.getItem(CHAVE);
    if (!bruto) return undefined;
    const s = JSON.parse(bruto) as Partial<Sessao> | null;
    if (!s || typeof s.id !== 'string' || typeof s.base !== 'number' || typeof s.ativoMs !== 'number' || s.dia !== hoje()) return undefined;
    return { id: s.id, dia: s.dia, base: s.base, ancora: typeof s.ancora === 'number' ? s.ancora : null, ativoMs: s.ativoMs, comecou: s.comecou === true };
  } catch {
    return undefined;
  }
}

function gravar(s: Sessao | null): void {
  try {
    if (s && s.comecou) localStorage.setItem(CHAVE, JSON.stringify(s));
    else localStorage.removeItem(CHAVE);
  } catch {
    /* sem armazenamento: a sessão vale só enquanto a tela estiver aberta */
  }
}

/** Corrida guiada de hoje em andamento para este treino (para o detalhe oferecer "Continuar"). */
export function sessaoGuiada(treinoId: string): { ativoMs: number } | undefined {
  const s = ler();
  return s && s.id === treinoId && s.comecou ? { ativoMs: s.ativoMs } : undefined;
}

const nova = (id: string): Sessao => ({ id, dia: hoje(), base: 0, ancora: null, ativoMs: 0, comecou: false });

function fraseDoPasso(p: Passo, primeiro: boolean): string {
  const rep = p.rep && p.kind === 'ritmo' ? `Repetição ${p.rep[0]} de ${p.rep[1]}. ` : '';
  return `${primeiro ? 'Começando. ' : ''}${rep}${p.label}, ${falaDuracao(p.sec)}, ${falaAlvo(p.target)}.`;
}

export function RunPlayerScreen({ id }: { id: string }) {
  const w = runById(id);
  const linha = w ? passos(w) : [];
  const total = linha[linha.length - 1]?.fim ?? 0;

  const [s, setS] = useState<Sessao>(() => {
    const salva = ler();
    return salva && salva.id === id ? salva : nova(id);
  });
  const [registrando, setRegistrando] = useState(false);
  const agora = useAgora(200);

  const correndo = s.ancora !== null;
  const corrido = s.ancora !== null ? Math.max(0, agora - s.ancora) : 0;
  const pos = Math.min(total, s.base + corrido / 1000);
  const ativoMs = s.ativoMs + (s.ancora !== null ? Math.min(corrido, Math.max(0, total - s.base) * 1000) : 0);
  const acabou = s.comecou && total > 0 && pos >= total;
  const idxAchado = linha.findIndex((p) => pos < p.fim);
  const idx = idxAchado < 0 ? linha.length - 1 : idxAchado;
  const passo = linha[idx];
  const proximo = linha[idx + 1];
  const restam = passo ? Math.max(0, passo.fim - pos) : 0;
  const segundos = Math.ceil(restam);

  useTelaLigada(s.comecou && !acabou);

  // A posição congelada no instante dado (para pausar, pular e encerrar).
  const congelar = (a: Sessao, t: number): Sessao => {
    if (a.ancora === null) return a;
    const d = Math.max(0, t - a.ancora);
    return { ...a, base: Math.min(total, a.base + d / 1000), ativoMs: a.ativoMs + Math.min(d, Math.max(0, total - a.base) * 1000), ancora: null };
  };

  useEffect(() => {
    gravar(s);
  }, [s]);

  // Sair da tela pausa a corrida (os avisos sonoros só existem aqui); a sessão fica guardada para continuar.
  const atual = useRef(s);
  atual.current = s;
  useEffect(
    () => () => {
      calar();
      const fim = atual.current;
      if (fim.comecou && fim.ancora !== null) gravar(congelar(fim, Date.now()));
    },
    [],
  );

  // Sem barra de abas, os avisos descem para perto do rodapé.
  useEffect(() => {
    const raiz = document.documentElement;
    raiz.classList.add('co-tela-cheia');
    return () => raiz.classList.remove('co-tela-cheia');
  }, []);

  // Troca de passo: dois bipes e a voz dizendo o que vem. Retomar depois de uma pausa não repete o aviso.
  const anunciado = useRef<number>(s.comecou ? idx : -1);
  useEffect(() => {
    if (!correndo || acabou || !passo) return;
    if (anunciado.current === idx) return;
    const primeiro = anunciado.current < 0;
    anunciado.current = idx;
    bip(primeiro ? 'longo' : 'duplo');
    vibrar([80, 60, 80]);
    falar(fraseDoPasso(passo, primeiro));
  }, [idx, correndo, acabou]);

  // Contagem 3, 2, 1 no fim de cada passo.
  const contado = useRef('');
  useEffect(() => {
    if (!correndo || acabou || !passo || passo.sec < 8) return;
    if (segundos < 1 || segundos > 3) return;
    const chave = `${idx}:${segundos}`;
    if (contado.current === chave) return;
    contado.current = chave;
    contagem(segundos);
  }, [segundos, idx, correndo, acabou]);

  // Fim do treino: para o relógio e avisa.
  useEffect(() => {
    if (!acabou || s.ancora === null) return;
    setS((a) => congelar(a, Date.now()));
    bip('fim');
    vibrar([120, 80, 120, 80, 240]);
    falar('Treino concluído. Bom trabalho.');
  }, [acabou, s.ancora]);

  if (!w || !passo) {
    return (
      <Screen title="Corrida guiada" back="/corrida" tabs={false}>
        <Empty
          icon="corrida"
          title="Treino não encontrado"
          text="Este treino não está mais no plano."
          action={
            <Button size="sm" href="/corrida">
              Ver o plano
            </Button>
          }
        />
      </Screen>
    );
  }

  function comecar(): void {
    destravarAudio();
    setS((a) => ({ ...a, comecou: true, dia: hoje(), ancora: Date.now() }));
  }
  function pausar(): void {
    calar();
    setS((a) => congelar(a, Date.now()));
  }
  function continuar(): void {
    destravarAudio();
    setS((a) => (a.ancora === null ? { ...a, ancora: Date.now() } : a));
  }
  function pular(): void {
    if (!passo) return;
    const t = Date.now();
    setS((a) => {
      const parado = congelar(a, t);
      return { ...parado, base: passo.fim, ancora: a.ancora !== null && passo.fim < total ? t : null };
    });
    if (passo.fim >= total) {
      bip('fim');
      falar('Treino concluído. Bom trabalho.');
    }
  }
  function encerrar(): void {
    pausar();
    setRegistrando(true);
  }
  function sairSemRegistrar(): void {
    gravar(null);
    setS(nova(id));
    go(`/corrida/treino/${id}`, { replace: true });
  }
  function aoSalvar(): void {
    gravar(null);
    setS(nova(id));
    go(`/corrida/treino/${id}`, { replace: true });
  }

  const minutosFeitos = Math.max(1, Math.round(ativoMs / 60000));
  const nPassos = contarPassos(w.blocks);
  const folha = (
    <RegistroSheet open={registrando} onClose={() => setRegistrando(false)} treino={w} minInicial={minutosFeitos} localInicial="esteira" onSaved={aoSalvar} />
  );
  const voltar = `/corrida/treino/${w.id}`;

  /* ---------- antes de começar ---------- */
  if (!s.comecou) {
    return (
      <div class="co-guiada">
        <Screen
          eyebrow="Corrida guiada"
          title={w.title}
          back={voltar}
          tabs={false}
          footer={
            <Button variant="primary" size="lg" icon="play" onClick={comecar}>
              Começar
            </Button>
          }
        >
          <div class="ui-banner is-accent">
            <Icon name="relogio" />
            <span class="ui-grow">
              <b>Na rua, use o relógio.</b> Este treino já está no Garmin. A corrida guiada é para a esteira ou para um dia sem o relógio.
            </span>
          </div>
          <div class="co-g-previa">
            <div class="ui-split">
              <span class="ui-val num">
                {w.minutes}
                <small>min</small>
              </span>
              <span class="ui-tag">{nPassos === 1 ? '1 passo' : `${nPassos} passos`}</span>
            </div>
            <IntensityChart blocks={w.blocks} height={96} />
          </div>
          <div class="co-g-prox" style={corDoNivel(passo.level)}>
            <span class="ui-eyebrow">Primeiro passo</span>
            <div class="co-g-prox-linha">
              <i class="co-g-prox-nv" aria-hidden="true" />
              <b>{passo.label}</b>
              <span class="num">
                {fmtPasso(passo.sec)} · {alvo(passo.target)}
              </span>
            </div>
          </div>
          <ul class="co-g-como">
            <li>
              <Icon name="voz" size={18} />
              <span>A voz diz cada passo e dois bipes marcam a troca, com contagem nos 3 segundos finais.</span>
            </li>
            <li>
              <Icon name="tela" size={18} />
              <span>A tela fica ligada. Se você bloquear o iPhone, o tempo continua certo, mas os avisos param.</span>
            </li>
          </ul>
        </Screen>
      </div>
    );
  }

  /* ---------- treino concluído ---------- */
  if (acabou) {
    return (
      <div class="co-guiada">
        <Screen
          eyebrow="Corrida guiada"
          title={w.title}
          back={voltar}
          tabs={false}
          footer={
            <Button variant="primary" size="lg" icon="check" onClick={() => setRegistrando(true)}>
              Registrar treino
            </Button>
          }
        >
          <div class="co-g-palco">
            <TimerRing total={1} left={1} tone="good" class="co-g-anel">
              <Icon name="check" size={40} class="co-g-fim-ic" />
              <b class="co-g-fim-t">Treino concluído</b>
              <span class="co-g-sub num">{fmtMin(minutosFeitos)} de corrida</span>
            </TimerRing>
            <p class="co-g-fim-p">Registre como foi enquanto está fresco: esforço, sensação e uma nota para o treinador.</p>
            <button type="button" class="ui-link" onClick={sairSemRegistrar}>
              sair sem registrar
            </button>
          </div>
          <div class="co-g-grafico">
            <IntensityChart blocks={w.blocks} compact height={44} cursorSec={total} />
          </div>
          {folha}
        </Screen>
      </div>
    );
  }

  /* ---------- correndo ou pausado ---------- */
  return (
    <div class={`co-guiada${correndo ? '' : ' is-pausada'}`}>
      <Screen
        eyebrow="Corrida guiada"
        title={w.title}
        back={voltar}
        tabs={false}
        footer={
          <>
            {correndo ? (
              <Button icon="pause" onClick={pausar}>
                Pausar
              </Button>
            ) : (
              <Button variant="primary" icon="play" onClick={continuar}>
                Retomar
              </Button>
            )}
            <Button icon="pular" onClick={pular}>
              Pular
            </Button>
            <Button onClick={encerrar}>
              Encerrar
            </Button>
          </>
        }
      >
        <div class="co-g-palco" style={corDoNivel(passo.level)}>
          <div class="co-g-meta">
            <span class="ui-tag">
              Passo {idx + 1} de {linha.length}
            </span>
            <span class="ui-tag">{passo.rep ? `Repetição ${passo.rep[0]} de ${passo.rep[1]}` : PASSO_ROTULO[passo.kind]}</span>
          </div>
          <div class="co-g-passo" aria-live="polite">
            <h2 class="co-g-nome">{passo.label}</h2>
            <span class="co-g-alvo">
              <i aria-hidden="true" />
              {alvo(passo.target)}
            </span>
          </div>
          <TimerRing total={passo.sec} left={restam} tone={correndo ? 'corrida' : 'muted'} class="co-g-anel">
            <span class="ui-eyebrow">{correndo ? 'Restam' : 'Pausado'}</span>
            <b class="co-g-tempo num" role="timer" aria-label={`Restam ${falaDuracao(segundos)}`}>
              {fmtDur(segundos)}
            </b>
            <span class="co-g-sub num">de {fmtDur(passo.sec)}</span>
          </TimerRing>
          {proximo ? (
            <div class="co-g-prox" style={corDoNivel(proximo.level)}>
              <span class="ui-eyebrow">A seguir</span>
              <div class="co-g-prox-linha">
                <i class="co-g-prox-nv" aria-hidden="true" />
                <b>{proximo.label}</b>
                <span class="num">
                  {fmtPasso(proximo.sec)} · {alvo(proximo.target)}
                </span>
              </div>
            </div>
          ) : (
            <div class="co-g-prox">
              <span class="ui-eyebrow">A seguir</span>
              <div class="co-g-prox-linha">
                <b>Fim do treino</b>
                <span>este é o último passo</span>
              </div>
            </div>
          )}
        </div>
        <div class="co-g-grafico">
          <IntensityChart blocks={w.blocks} compact height={44} cursorSec={pos} label={`Andamento do treino: ${fmtDur(pos)} de ${fmtDur(total)}`} />
          <div class="co-g-tempos num">
            <span>{fmtDur(pos)}</span>
            <span>{fmtDur(total)}</span>
          </div>
        </div>
        {folha}
      </Screen>
    </div>
  );
}
