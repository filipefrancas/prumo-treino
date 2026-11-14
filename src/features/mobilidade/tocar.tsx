/* Mobilidade: a rotina guiada (#/mobilidade/tocar/:id). Tela cheia, sem barra de abas, com o tempo pelo relógio. */
import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import { routineById } from '../../data/routines.ts';
import { fmtData, hoje } from '../../lib/dates.ts';
import { bip, calar, contagem, destravarAudio, falar, useAgora, useTelaLigada, vibrar } from '../../lib/feedback.ts';
import { fmtDur, plural } from '../../lib/format.ts';
import { resumoDaSemana } from '../../lib/plano.ts';
import { back, go } from '../../lib/router.ts';
import { getState, uid, update, useStore } from '../../lib/store.ts';
import type { Routine } from '../../types.ts';
import { Button, cx, Empty, ExMedia, Icon, IconButton, Pill, Ring, Screen, Sheet, Stat, StatRow, Tag, TimerRing } from '../../ui/index.ts';
import { anuncio, LADO_ROTULO, montarPassos, tomDaRotina, type PassoTocar } from './rotina.ts';
import {
  avancar,
  comecarJa,
  concluir,
  decorridoMs,
  iniciar,
  pausar,
  prepSeg,
  pular,
  retomar,
  totalSeg,
  voltar,
  type Tocador,
} from './tocador.ts';

/** Abaixo disto, sair no meio não deixa registro. */
const MINIMO_PARA_REGISTRAR = 30;

export function RoutinePlayerScreen({ id }: { id: string }) {
  const routine = routineById(id);
  if (!routine) {
    return (
      <Screen title="Rotina guiada" back="/mobilidade" tabs={false}>
        <Empty icon="mobilidade" title="Rotina não encontrada" text="Volte para Mobilidade e escolha uma rotina da lista." />
      </Screen>
    );
  }
  return <Tocar routine={routine} />;
}

function gravar(routine: Routine, seg: number, completo: boolean): void {
  update((d) => {
    d.mob.push({ id: uid(), data: hoje(), rotina: routine.id, nome: routine.name, seg: Math.max(1, Math.round(seg)), completo });
  });
}

function Tocar({ routine }: { routine: Routine }) {
  const alongSeg = useStore((s) => s.settings.alongamentoSeg);
  const voz = useStore((s) => s.settings.voz);
  // o tempo por posição vale o do começo: mudar o ajuste no meio não reembaralha a rotina em andamento
  const segInicial = useRef(alongSeg).current;
  const passos = useMemo(() => montarPassos(routine, segInicial), [routine, segInicial]);
  const trans = routine.transition;
  const tom = tomDaRotina(routine);

  const [st, setSt] = useState<Tocador>(() => iniciar(Date.now()));
  const [sair, setSair] = useState(false);
  const agora = useAgora(200);
  // o que vale na tela já é o estado corrigido pelo relógio; o efeito abaixo só o guarda
  const e = avancar(st, passos, trans, agora);
  useEffect(() => {
    setSt((s) => avancar(s, passos, trans, agora));
  }, [agora, passos, trans]);

  const acabou = e.fase === 'fim';
  const pausado = e.pausa !== null;
  useTelaLigada(!acabou);

  // sem rolagem elástica do corpo enquanto a tela de tocar está aberta
  useEffect(() => {
    const raiz = document.documentElement;
    raiz.classList.add('mo-tela-cheia');
    return () => {
      raiz.classList.remove('mo-tela-cheia');
      calar();
    };
  }, []);

  /* ---- sinais: bipe e voz nas trocas de fase (só a fase em que o relógio parou, mesmo depois de um salto) ---- */
  const marca = `${e.idx}:${e.fase}`;
  const ultimaMarca = useRef<string | null>(null);
  useEffect(() => {
    if (ultimaMarca.current === marca) return;
    const primeira = ultimaMarca.current === null;
    ultimaMarca.current = marca;
    if (e.fase === 'prep') {
      if (!primeira) bip('duplo');
      falar(anuncio(passos, e.idx));
    } else if (e.fase === 'ativo') {
      bip('longo');
      vibrar(80);
    } else {
      bip('fim');
      vibrar([80, 60, 80]);
      falar('Rotina concluída. Bom trabalho.');
    }
  }, [marca]);

  const p: PassoTocar | undefined = passos[e.idx];
  const decorrido = decorridoMs(e, agora) / 1000;
  const totalFase = e.fase === 'prep' ? prepSeg(e.idx, trans) : (p?.seg ?? 0);
  const restam = Math.max(0, totalFase - decorrido);
  const segundos = Math.ceil(restam);

  /* ---- 3, 2, 1 no fim das posições por tempo ---- */
  const ultimoBip = useRef('');
  useEffect(() => {
    if (e.fase !== 'ativo' || pausado || p?.modo !== 'tempo') return;
    if (segundos < 1 || segundos > 3) return;
    const chave = `${marca}:${segundos}`;
    if (ultimoBip.current === chave) return;
    ultimoBip.current = chave;
    contagem(segundos);
  }, [segundos, marca, pausado]);

  /* ---- registro: uma vez por rotina concluída ---- */
  const gravado = useRef(false);
  useEffect(() => {
    if (!acabou || gravado.current) return;
    gravado.current = true;
    if (e.feitos.length > 0) gravar(routine, totalSeg(e, agora), e.pulados.length === 0);
  }, [acabou]);

  const agir = (fn: (s: Tocador, t: number) => Tocador): void => {
    const t = Date.now();
    setSt((s) => fn(avancar(s, passos, trans, t), t));
  };

  const alternarPausa = (): void => {
    if (pausado) {
      destravarAudio();
      agir(retomar);
    } else {
      calar();
      agir(pausar);
    }
  };
  const abrirSair = (): void => {
    calar();
    agir(pausar);
    setSair(true);
  };
  const continuar = (): void => {
    setSair(false);
    agir(retomar);
  };
  const encerrar = (): void => {
    const seg = totalSeg(e, agora);
    if (e.feitos.length > 0 && seg >= MINIMO_PARA_REGISTRAR && !gravado.current) {
      gravado.current = true;
      gravar(routine, seg, false);
    }
    setSair(false);
    back(`/mobilidade/rotina/${routine.id}`);
  };
  const repetir = (): void => {
    destravarAudio();
    gravado.current = false;
    ultimaMarca.current = null;
    setSt(iniciar(Date.now()));
  };
  const alternarVoz = (): void => {
    if (voz) calar();
    update((d) => {
      d.settings.voz = !voz;
    });
  };

  const area = tom === 'corrida' ? 'ui-area-corrida' : 'ui-area-mob';

  if (acabou || !p) {
    return <Resumo routine={routine} estado={e} total={passos.length} agora={agora} area={area} onRepetir={repetir} />;
  }

  const unidade = routine.kind === 'alongamento' ? 'Posição' : 'Exercício';
  const manual = p.modo !== 'tempo';
  const emPrep = e.fase === 'prep';
  const seg = totalSeg(e, agora);
  const vaiRegistrar = e.feitos.length > 0 && seg >= MINIMO_PARA_REGISTRAR;

  return (
    <div class={cx('mo-tocar', area, pausado && 'is-pausado', emPrep && 'is-prep')}>
      <header class="mo-tc-head">
        <IconButton icon="fechar" label="Sair da rotina" onClick={abrirSair} />
        <div class="mo-tc-titles">
          <div class="ui-eyebrow mo-tc-rotina">{routine.name}</div>
          <h1 class="mo-tc-pos num">
            {unidade} {e.idx + 1} de {passos.length}
          </h1>
        </div>
        <IconButton icon="voz" label="Voz" pressed={voz} onClick={alternarVoz} />
      </header>

      <div
        class="mo-tc-dots"
        role="progressbar"
        aria-label="Progresso da rotina"
        aria-valuemin={0}
        aria-valuemax={passos.length}
        aria-valuenow={e.idx}
      >
        {passos.map((_, i) => (
          <i
            key={i}
            class={cx(
              'mo-tc-dot',
              e.feitos.includes(i) && 'is-feito',
              e.pulados.includes(i) && 'is-pulado',
              i === e.idx && 'is-atual',
            )}
          />
        ))}
      </div>

      <main class="mo-tc-main">
        <div class="mo-tc-fig">
          <ExMedia key={p.ex} id={p.ex} play="always" paused={pausado} tone={tom} label={p.nome} />
        </div>

        <div class="mo-tc-info" aria-live="polite">
          <div class="mo-tc-tags">
            {emPrep ? <Pill tone="accent">{e.idx === 0 ? 'prepare-se' : 'a seguir'}</Pill> : null}
            {p.lado ? (
              <Pill tone={tom} icon="trocar">
                {LADO_ROTULO[p.lado]}
              </Pill>
            ) : null}
            {p.rodada ? (
              <Tag>
                Rodada {p.rodada[0]} de {p.rodada[1]}
              </Tag>
            ) : null}
          </div>
          <h2 class="mo-tc-nome">{p.nome}</h2>
          {p.frase ? <p class="mo-tc-frase">{p.frase}</p> : null}
          {p.nota ? <p class="mo-tc-nota">{p.nota}</p> : null}
        </div>

        <div class="mo-tc-clock">
          <div class="mo-tc-ring">
            {emPrep ? (
              <TimerRing total={totalFase} left={restam} tone="accent" size={200}>
                <span class="mo-tc-lab">{pausado ? 'Pausado' : 'Começa em'}</span>
                <b class="mo-tc-num num">{segundos}</b>
                <span class="mo-tc-sub num">{p.modo === 'reps' ? `${p.reps} repetições` : p.modo === 'livre' ? 'tempo livre' : `${p.seg} s`}</span>
              </TimerRing>
            ) : manual ? (
              <TimerRing total={1} left={1} tone={tom} size={200}>
                <span class="mo-tc-lab">{p.modo === 'reps' ? 'Repetições' : 'Tempo livre'}</span>
                <b class="mo-tc-num num">{p.modo === 'reps' ? p.reps : fmtDur(decorrido)}</b>
                <span class="mo-tc-sub num">{p.modo === 'reps' ? fmtDur(decorrido) : 'toque em Feito'}</span>
              </TimerRing>
            ) : (
              <TimerRing total={totalFase} left={restam} tone={tom} size={200}>
                <span class="mo-tc-lab">{pausado ? 'Pausado' : routine.kind === 'alongamento' ? 'Segure' : 'Faltam'}</span>
                <b class="mo-tc-num num">{fmtDur(segundos)}</b>
                <span class="mo-tc-sub num">de {fmtDur(totalFase)}</span>
              </TimerRing>
            )}
          </div>
          <div class="mo-tc-extra">
            {emPrep ? (
              <Button size="sm" variant="ghost" icon="play" onClick={() => { destravarAudio(); agir(comecarJa); }}>
                Começar já
              </Button>
            ) : (
              <span class="ui-note num">
                <Icon name="cronometro" size={14} class="mo-tc-ico" />
                Tempo de rotina <b>{fmtDur(seg)}</b>
              </span>
            )}
          </div>
        </div>
      </main>

      <footer class="mo-tc-ctl">
        <Button size="lg" icon="voltar" aria-label="Voltar uma posição" onClick={() => agir(voltar)}>
          Voltar
        </Button>
        {pausado ? (
          <Button size="lg" variant="primary" icon="play" onClick={alternarPausa}>
            Continuar
          </Button>
        ) : manual && !emPrep ? (
          <Button size="lg" variant="primary" icon="check" onClick={() => agir((s, t) => concluir(s, passos.length, t))}>
            Feito
          </Button>
        ) : (
          <Button size="lg" icon="pause" onClick={alternarPausa}>
            Pausar
          </Button>
        )}
        <Button size="lg" icon="pular" aria-label="Pular esta posição" onClick={() => agir((s, t) => pular(s, passos.length, t))}>
          Pular
        </Button>
      </footer>

      <Sheet
        open={sair}
        onClose={continuar}
        title="Sair da rotina?"
        footer={
          <>
            <Button onClick={continuar}>Continuar</Button>
            <Button variant="danger" onClick={encerrar}>
              Sair
            </Button>
          </>
        }
      >
        <p class="ui-muted">
          {vaiRegistrar
            ? `Você fez ${plural(e.feitos.length, 'passo', 'passos')} em ${fmtDur(seg)}. Esse tempo fica registrado em Mobilidade como rotina parcial.`
            : 'Ainda não deu tempo de registrar nada. Você pode recomeçar quando quiser.'}
        </p>
      </Sheet>
    </div>
  );
}

function Resumo({
  routine,
  estado,
  total,
  agora,
  area,
  onRepetir,
}: {
  routine: Routine;
  estado: Tocador;
  total: number;
  agora: number;
  area: string;
  onRepetir: () => void;
}) {
  const feitos = estado.feitos.length;
  const pulados = total - feitos;
  const seg = totalSeg(estado, agora);
  const semana = resumoDaSemana(getState(), hoje());
  const fem = routine.kind === 'alongamento';
  const unidade = fem ? 'Posições' : 'Exercícios';
  return (
    <div class={cx('mo-tocar', 'mo-fim', area)}>
      <main class="mo-fim-main">
        <Ring value={total > 0 ? feitos / total : 0} tone={routine.kind === 'educativos' ? 'corrida' : 'mob'} size={132} ariaLabel={`${feitos} de ${total} feitos`}>
          <Icon name="check" size={48} class="mo-fim-check" />
        </Ring>
        <div class="mo-fim-txt">
          <div class="ui-eyebrow">{fmtData(hoje())}</div>
          <h1 class="mo-fim-titulo">{feitos > 0 ? 'Rotina concluída' : 'Rotina encerrada'}</h1>
          <p class="ui-muted">{routine.name}</p>
        </div>
        <StatRow class="mo-fim-stats">
          <Stat label="Tempo" value={fmtDur(seg)} tone="mob" />
          <Stat label={unidade} value={`${feitos}/${total}`} sub={pulados > 0 ? `${pulados} ${fem ? 'pulada' : 'pulado'}${pulados === 1 ? '' : 's'}` : 'tudo feito'} />
          <Stat label="Na semana" value={String(semana.mobMin)} unit="min" sub="de mobilidade" />
        </StatRow>
        <p class="ui-note mo-fim-nota">
          {feitos > 0 ? (
            <>
              <Icon name="check" size={14} class="mo-tc-ico" />
              Registrado em Mobilidade{estado.pulados.length > 0 ? ' como rotina parcial' : ''}.
            </>
          ) : (
            'Nada foi registrado: todas as posições foram puladas.'
          )}
        </p>
      </main>
      <footer class="mo-fim-ctl">
        <Button size="lg" variant="primary" block icon="check" onClick={() => go('/mobilidade', { replace: true })}>
          Concluir
        </Button>
        <Button block variant="ghost" icon="repetir" onClick={onRepetir}>
          Fazer de novo
        </Button>
      </footer>
    </div>
  );
}
