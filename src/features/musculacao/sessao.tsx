/* Musculação: o treino em andamento (SPEC 8.3, #/musculacao/sessao). A sessão é o Lift com emAndamento em
   state.lifts, gravado a cada mudança (inclusive o rascunho de carga e repetições de cada série, com feito: false). */
import { useEffect, useMemo, useState } from 'preact/hooks';
import { recadoForca, type RecadoForca } from '../../data/coach.ts';
import { exById, exName } from '../../data/ex/_index.ts';
import {
  METODO_ROTULO,
  blocosDaFicha,
  concluirSessao,
  contaComoFeito,
  descansoDe,
  desmarcarSerie,
  ehPrincipal,
  exerciciosPreparacao,
  fichaDoDia,
  fichaPorLetra,
  iniciarSessao,
  marcarSerie,
  metodoTexto,
  proximaFicha,
  prsDoLift,
  pularExercicio,
  seriesDeTrabalho,
  seriesFeitas,
  seriesPlanejadas,
  sessaoAberta,
  sugestao,
  ultimaVez,
  volumeDoLift,
  type PrDaSessao,
  type SeriePlanejada,
  type Sugestao,
} from '../../lib/academia.ts';
import { fmtData, hoje, inicioSemana } from '../../lib/dates.ts';
import { bip, destravarAudio, useAgora, useTelaLigada, vibrar } from '../../lib/feedback.ts';
import { fmtDur, fmtMin, num, plural } from '../../lib/format.ts';
import { go, useRoute } from '../../lib/router.ts';
import { update, useStore } from '../../lib/store.ts';
import type { Ficha, FichaExercicio, Lift, Metodo, SerieFeita, Settings } from '../../types.ts';
import {
  Button,
  Empty,
  Field,
  ExMedia,
  Icon,
  List,
  Pill,
  Row,
  Scale,
  Screen,
  Sheet,
  Stat,
  StatRow,
  Stepper,
  TextArea,
  cx,
  toast,
} from '../../ui/index.ts';
import {
  Mini,
  Nota,
  alvoDoBloco,
  apagarLift,
  fmtVolume,
  fraseDaSugestao,
  gravarLift,
  metaDoEx,
  nomeEmUso,
  resumoDasSeries,
  serieCurta,
  tomDaFicha,
  tomDoTipo,
  ultimoDaFicha,
} from './comum.tsx';
import {
  SOME_DEPOIS_MS,
  encerrarDescanso,
  estenderDescanso,
  iniciarDescanso,
  marcarAvisado,
  useDescanso,
} from './descanso.ts';

/* ------------------------------------------------------------------ */
/* Modelo da tela                                                      */
/* ------------------------------------------------------------------ */

/** Métodos de intensidade que o recado da semana pode suspender. */
const METODOS_DE_INTENSIDADE: readonly Metodo[] = ['drop-set', 'rest-pause', 'cluster-set', 'dead-stop'];

interface Linha {
  ex: FichaExercicio;
  n: number;
  plan: SeriePlanejada | undefined;
  /** Lado no par combinado (A ou B); null em exercício sozinho. */
  lado: 'a' | 'b' | null;
  rotulo: string;
  feita: boolean;
  /** Séries do exercício na sessão (planejadas + acrescentadas). */
  total: number;
}

interface InfoEx {
  sug: Sugestao;
  ult: { data: string; sets: { n: number; reps: number; carga: number }[] } | undefined;
}

interface Valores {
  carga: number;
  reps: number;
  /** A série tem campo de carga (a ficha traz carga numérica ou já foi gravada uma). */
  temCarga: boolean;
  /** Série por tempo (segundos): sem campo de repetições. */
  tempo: number | null;
}

const chaveDoBloco = (bloco: FichaExercicio[]): string => bloco.map((e) => e.id).join('+');

function serieGravada(l: Lift, exId: string, n: number): SerieFeita | undefined {
  return l.sets?.[exId]?.[String(n)];
}

/** Séries do exercício na sessão: as planejadas ou, se houver mais, até a última gravada. */
function numSeries(l: Lift, ex: FichaExercicio): number {
  let max = 0;
  for (const k of Object.keys(l.sets?.[ex.id] ?? {})) {
    const n = Number(k);
    if (Number.isInteger(n) && n > max) max = n;
  }
  return Math.max(seriesPlanejadas(ex).length, max);
}

/** A série planejada n; além do total, vale a última (série acrescentada). */
function planoDe(ex: FichaExercicio, n: number): SeriePlanejada | undefined {
  const p = seriesPlanejadas(ex);
  return p[n - 1] ?? p[p.length - 1];
}

/** Linhas do bloco na ordem de execução: 1, 2, 3 ou, no par, A1, B1, A2, B2. Exercício pulado fica fora. */
function linhasDoBloco(l: Lift, bloco: FichaExercicio[]): Linha[] {
  const pulados = new Set(l.pulados ?? []);
  const ativos = bloco.filter((e) => !pulados.has(e.id));
  const par = bloco.length > 1;
  const totais = ativos.map((e) => numSeries(l, e));
  const rodadas = Math.max(0, ...totais);
  const out: Linha[] = [];
  for (let n = 1; n <= rodadas; n++) {
    ativos.forEach((ex, i) => {
      const total = totais[i] ?? 0;
      if (n > total) return;
      const lado = par ? (bloco.indexOf(ex) === 0 ? 'a' : 'b') : null;
      out.push({
        ex, n, plan: planoDe(ex, n), lado, total,
        rotulo: lado ? `${lado.toUpperCase()}${n}` : String(n),
        feita: serieGravada(l, ex.id, n)?.feito === true,
      });
    });
  }
  return out;
}

/** O que preencher na série n: já gravado → série anterior do mesmo bloco → sugestão → ficha. */
function valoresDe(l: Lift, ex: FichaExercicio, n: number, info: InfoEx | undefined): Valores {
  const plan = planoDe(ex, n);
  const g = serieGravada(l, ex.id, n);
  const ant = n > 1 ? serieGravada(l, ex.id, n - 1) : undefined;
  const anterior = ant?.feito && planoDe(ex, n - 1)?.bloco === plan?.bloco ? ant : undefined;
  const series = info?.sug.series ?? [];
  const sug = series.find((s) => s.n === n) ?? series[series.length - 1];
  const cargaSug = sug?.carga ?? plan?.carga ?? null;
  const tempo = plan?.segundos ?? null;
  return {
    carga: g?.carga ?? anterior?.carga ?? cargaSug ?? 0,
    reps: tempo !== null ? 0 : (g?.reps ?? anterior?.reps ?? sug?.reps ?? plan?.faixa?.[0] ?? 0),
    temCarga: (plan !== undefined && plan.carga !== null) || g?.carga !== undefined,
    tempo,
  };
}

/** Grava (ou cria) a série n com os valores dados, sem mudar se está feita. */
function comValores(l: Lift, exId: string, n: number, v: { carga?: number; reps?: number }): Lift {
  const atual = serieGravada(l, exId, n);
  const serie: SerieFeita = { ...(atual ?? {}), feito: atual?.feito ?? false };
  if (v.carga !== undefined) serie.carga = v.carga;
  if (v.reps !== undefined) serie.reps = v.reps;
  return { ...l, sets: { ...(l.sets ?? {}), [exId]: { ...(l.sets?.[exId] ?? {}), [String(n)]: serie } } };
}

/** Tira a série n do registro (série acrescentada que não vai ser feita). */
function semSerie(l: Lift, exId: string, n: number): Lift {
  const doEx = { ...(l.sets?.[exId] ?? {}) };
  delete doEx[String(n)];
  return { ...l, sets: { ...(l.sets ?? {}), [exId]: doEx } };
}

/** Antes de concluir: os rascunhos (séries não feitas) saem do registro. */
function semRascunhos(l: Lift): Lift {
  const sets: NonNullable<Lift['sets']> = {};
  for (const [exId, m] of Object.entries(l.sets ?? {})) {
    const feitas = Object.entries(m).filter(([, s]) => s.feito);
    if (feitas.length > 0) sets[exId] = Object.fromEntries(feitas);
  }
  return { ...l, sets };
}

function minutosDecorridos(l: Lift, agora: number): number {
  if (l.inicioMs === undefined) return 0;
  return Math.max(0, (agora - l.inicioMs) / 60000);
}

/* ------------------------------------------------------------------ */
/* Tela (roteia entre: começar, sessão esquecida, em andamento, concluído) */
/* ------------------------------------------------------------------ */

export function SessaoScreen() {
  const route = useRoute();
  const lifts = useStore((s) => s.lifts);
  const settings = useStore((s) => s.settings);
  const [concluido, setConcluido] = useState<Lift | null>(null);
  const dia = hoje();
  const aberta = sessaoAberta(lifts);
  const pedida = (route.query.ficha ?? '').trim().toUpperCase();
  const fichaPedida = pedida ? fichaPorLetra(settings, pedida) : undefined;

  // ?ficha=LETRA começa a sessão; se já existe uma aberta, é ela que continua.
  useEffect(() => {
    if (aberta || concluido || !fichaPedida) return;
    const nova = iniciarSessao(settings, fichaPedida);
    update((d) => {
      d.lifts.push(nova);
    });
    go('/musculacao/sessao', { replace: true });
  }, [aberta?.id, concluido, fichaPedida?.id]);

  if (concluido) return <TreinoConcluido lift={concluido} lifts={lifts} />;

  if (!aberta) {
    if (fichaPedida) return <div class="mu-ss" />;
    const sugerida = fichaDoDia(settings, lifts, dia) ?? proximaFicha(settings, lifts);
    return (
      <Screen title="Treino" eyebrow="Musculação" back="/musculacao" tabs={false}>
        <Empty
          icon="musculacao"
          title="Nenhum treino em andamento"
          text={`A ficha da vez é a ${sugerida.id} · ${sugerida.nome}.`}
          action={
            <Button
              variant="primary"
              icon="play"
              onClick={() => {
                destravarAudio();
                go(`/musculacao/sessao?ficha=${sugerida.id}`, { replace: true });
              }}
            >
              Começar ficha {sugerida.id}
            </Button>
          }
        />
      </Screen>
    );
  }

  const ficha = fichaPorLetra(settings, aberta.ficha);
  const concluir = (v: { intensidade?: number; obs?: string }): void => {
    const final = concluirSessao(lifts.filter((l) => l.id !== aberta.id), semRascunhos(aberta), v);
    gravarLift(aberta.id, () => final);
    encerrarDescanso();
    setConcluido(final);
  };
  const descartar = (): void => {
    apagarLift(aberta.id);
    encerrarDescanso();
    toast('Treino descartado');
    if (!fichaPedida) go('/musculacao', { replace: true });
  };

  if (aberta.data !== dia || !ficha) {
    return <SessaoEsquecida lift={aberta} ficha={ficha} onConcluir={() => concluir({})} onDescartar={descartar} />;
  }
  return <Sessao lift={aberta} ficha={ficha} lifts={lifts} settings={settings} onConcluir={concluir} onDescartar={descartar} />;
}

/* ------------------------------------------------------------------ */
/* Sessão de outro dia que ficou aberta                                */
/* ------------------------------------------------------------------ */

function SessaoEsquecida({ lift, ficha, onConcluir, onDescartar }: { lift: Lift; ficha: Ficha | undefined; onConcluir: () => void; onDescartar: () => void }) {
  const [confirma, setConfirma] = useState(false);
  const feitas = seriesFeitas(lift);
  return (
    <Screen title="Treino ficou aberto" eyebrow={fmtData(lift.data)} back="/musculacao" tabs={false}>
      <div class="ui-card mu-esq">
        <Icon name="alerta" size={24} />
        <h2 class="mu-esq-t">
          Ficha {lift.ficha}
          {ficha ? ` · ${ficha.nome}` : lift.treino ? ` · ${lift.treino}` : ''}
        </h2>
        <p class="ui-muted">
          O treino de {fmtData(lift.data, 'longa')} não foi concluído.{' '}
          {feitas > 0
            ? `Ele tem ${plural(feitas, 'série marcada', 'séries marcadas')}: conclua para guardar no histórico ou descarte.`
            : 'Nenhuma série foi marcada: o mais simples é descartar.'}
        </p>
        <div class="mu-esq-acoes">
          {feitas > 0 ? (
            <Button variant="primary" icon="check" block onClick={onConcluir}>
              Concluir como está
            </Button>
          ) : null}
          <Button variant="danger" icon="lixeira" block onClick={() => setConfirma(true)}>
            Descartar treino
          </Button>
        </div>
      </div>
      <FolhaDescartar open={confirma} onClose={() => setConfirma(false)} onDescartar={onDescartar} />
    </Screen>
  );
}

function FolhaDescartar({ open, onClose, onDescartar }: { open: boolean; onClose: () => void; onDescartar: () => void }) {
  return (
    <Sheet
      open={open}
      onClose={onClose}
      title="Descartar este treino?"
      footer={
        <>
          <Button onClick={onClose}>Cancelar</Button>
          <Button
            variant="danger"
            icon="lixeira"
            onClick={() => {
              onClose();
              onDescartar();
            }}
          >
            Descartar
          </Button>
        </>
      }
    >
      <p class="ui-muted">As séries marcadas neste treino são apagadas e ele não entra no histórico.</p>
    </Sheet>
  );
}

/* ------------------------------------------------------------------ */
/* Sessão em andamento                                                 */
/* ------------------------------------------------------------------ */

type Folha =
  | { t: 'metodo'; ex: FichaExercicio }
  | { t: 'obs'; ex: FichaExercicio }
  | { t: 'trocar'; ex: FichaExercicio }
  | { t: 'como'; ex: FichaExercicio }
  | { t: 'escolher'; acao: 'obs' | 'trocar' | 'como'; exs: FichaExercicio[] }
  | { t: 'concluir' }
  | { t: 'descartar' };

interface SessaoProps {
  lift: Lift;
  ficha: Ficha;
  lifts: Lift[];
  settings: Settings;
  onConcluir: (v: { intensidade?: number; obs?: string }) => void;
  onDescartar: () => void;
}

function Sessao({ lift, ficha, lifts, settings, onConcluir, onDescartar }: SessaoProps) {
  useTelaLigada(true);
  const [folha, setFolha] = useState<Folha | null>(null);
  const [ativas, setAtivas] = useState<Record<string, string>>({});
  const [recadoAberto, setRecadoAberto] = useState(false);
  const descanso = useDescanso(lift.id);

  // O som só toca depois de um toque: o primeiro toque na tela libera os bipes do descanso.
  useEffect(() => {
    const liberar = (): void => destravarAudio();
    document.addEventListener('pointerdown', liberar, { once: true });
    document.documentElement.classList.add('mu-em-sessao');
    return () => {
      document.removeEventListener('pointerdown', liberar);
      document.documentElement.classList.remove('mu-em-sessao');
    };
  }, []);

  const preparo = useMemo(() => exerciciosPreparacao(ficha), [ficha]);
  const blocos = useMemo(() => blocosDaFicha(ficha), [ficha]);
  const recado = recadoForca(inicioSemana(lift.data));

  // Sugestão e última vez só mudam quando muda o histórico de treinos feitos.
  const chaveFeitos = lifts.filter(contaComoFeito).map((l) => l.id).join(',');
  const infos = useMemo(() => {
    const m = new Map<string, InfoEx>();
    for (const bloco of blocos) for (const ex of bloco) m.set(ex.id, { sug: sugestao(settings, lifts, ex), ult: ultimaVez(lifts, ex.id, lift) });
    return m;
  }, [chaveFeitos, blocos, settings]);

  const pulados = new Set(lift.pulados ?? []);
  const linhasPorBloco = blocos.map((b) => linhasDoBloco(lift, b));
  const todas = linhasPorBloco.flat();
  const proxima = todas.find((l) => !l.feita);

  const principais = blocos.flat().filter((e) => ehPrincipal(e) && !pulados.has(e.id));
  const exFeitos = principais.filter((e) => {
    const total = numSeries(lift, e);
    for (let n = 1; n <= total; n++) if (serieGravada(lift, e.id, n)?.feito !== true) return false;
    return total > 0;
  }).length;
  const seriesPlan = principais.reduce((s, e) => s + seriesDeTrabalho(e), 0);
  const seriesOk = seriesFeitas(lift);
  const progresso = seriesPlan > 0 ? Math.min(1, seriesOk / seriesPlan) : 0;
  const tudoFeito = todas.length > 0 && !proxima;

  const valores = (ex: FichaExercicio, n: number): Valores => valoresDe(lift, ex, n, infos.get(ex.id));

  const editar = (ex: FichaExercicio, n: number, v: { carga?: number; reps?: number }): void => {
    const base = valores(ex, n);
    gravarLift(lift.id, (l) => comValores(l, ex.id, n, { carga: base.temCarga ? base.carga : undefined, reps: base.tempo === null ? base.reps : undefined, ...v }));
  };

  const marcar = (linha: Linha, bloco: FichaExercicio[]): void => {
    const { ex, n } = linha;
    const v = valores(ex, n);
    gravarLift(lift.id, (l) => marcarSerie(l, ex.id, n, { carga: v.temCarga ? v.carga : undefined, reps: v.tempo === null ? v.reps : undefined }));
    setAtivas((a) => ({ ...a, [chaveDoBloco(bloco)]: '' }));
    vibrar(30);
    const falta = todas.some((l) => !l.feita && !(l.ex.id === ex.id && l.n === n));
    if (!falta) {
      encerrarDescanso();
      toast('Última série feita. Conclua o treino quando quiser.', { tone: 'ok' });
      return;
    }
    // No par, o descanso só começa depois que os dois fizeram a série n.
    const par = bloco.find((e) => e.id !== ex.id && !pulados.has(e.id));
    if (par && n <= numSeries(lift, par) && serieGravada(lift, par.id, n)?.feito !== true) {
      encerrarDescanso();
      return;
    }
    const seg = descansoDe(settings, ex, n, par);
    if (seg > 0) iniciarDescanso(lift.id, seg);
    else encerrarDescanso();
  };

  const desmarcar = (linha: Linha): void => {
    gravarLift(lift.id, (l) => desmarcarSerie(l, linha.ex.id, linha.n));
    encerrarDescanso();
  };

  const maisSerie = (bloco: FichaExercicio[]): void => {
    const alvo = bloco.filter((e) => !pulados.has(e.id));
    gravarLift(lift.id, (l) => {
      let out = l;
      for (const ex of alvo) {
        const n = numSeries(out, ex) + 1;
        const v = valoresDe(out, ex, n, infos.get(ex.id));
        out = comValores(out, ex.id, n, { carga: v.temCarga ? v.carga : undefined, reps: v.tempo === null ? v.reps : undefined });
      }
      return out;
    });
  };

  /** Dá para tirar a última série do bloco? Só a que foi acrescentada e ainda não foi feita. */
  const podeTirar = (bloco: FichaExercicio[]): boolean =>
    bloco.some((ex) => {
      const total = numSeries(lift, ex);
      return !pulados.has(ex.id) && total > seriesPlanejadas(ex).length && serieGravada(lift, ex.id, total)?.feito !== true;
    });

  const menosSerie = (bloco: FichaExercicio[]): void => {
    gravarLift(lift.id, (l) => {
      let out = l;
      for (const ex of bloco) {
        const total = numSeries(out, ex);
        if (total > seriesPlanejadas(ex).length && serieGravada(out, ex.id, total)?.feito !== true) out = semSerie(out, ex.id, total);
      }
      return out;
    });
  };

  const pular = (bloco: FichaExercicio[], sim: boolean): void => {
    gravarLift(lift.id, (l) => bloco.reduce((acc, ex) => pularExercicio(acc, ex.id, sim), l));
    if (sim) encerrarDescanso();
  };

  const abrir = (acao: 'obs' | 'trocar' | 'como', bloco: FichaExercicio[]): void => {
    const [unico] = bloco;
    if (bloco.length === 1 && unico) setFolha({ t: acao, ex: unico });
    else setFolha({ t: 'escolher', acao, exs: bloco });
  };

  const irPara = (exId: string): void => {
    const el = document.getElementById(`mu-ex-${exId}`);
    if (!el) return;
    const suave = !matchMedia('(prefers-reduced-motion:reduce)').matches;
    el.scrollIntoView({ block: 'center', behavior: suave ? 'smooth' : 'auto' });
  };

  const proximaTxt = proxima
    ? `${nomeEmUso(proxima.ex, lift.trocas?.[proxima.ex.id])} · série ${proxima.lado ? proxima.rotulo : proxima.n}`
    : undefined;

  return (
    <div class={cx('mu-ss', descanso && 'tem-descanso')}>
      <header class="mu-top">
        <div class="mu-top-in">
          <Button size="sm" variant="ghost" icon="voltar" class="mu-sair" onClick={() => go('/musculacao')}>
            Sair
          </Button>
          <div class="mu-top-tt">
            <div class="ui-eyebrow">
              Ficha {ficha.id} · {fmtData(lift.data)}
            </div>
            <h1 class="mu-h1">{ficha.nome}</h1>
          </div>
          <Button size="sm" variant={tudoFeito ? 'primary' : 'soft'} icon="check" onClick={() => setFolha({ t: 'concluir' })}>
            Concluir
          </Button>
          <div class="mu-prog">
            <Relogio lift={lift} />
            <span class="mu-prog-x num">
              <b>
                {exFeitos}/{principais.length}
              </b>{' '}
              exercícios
            </span>
            <span class="mu-bar" role="progressbar" aria-label="Séries de trabalho feitas" aria-valuemin={0} aria-valuemax={seriesPlan} aria-valuenow={Math.min(seriesOk, seriesPlan)}>
              <i style={{ width: `${Math.round(progresso * 100)}%` }} />
            </span>
            <span class="mu-prog-x num">
              <b>
                {seriesOk}/{seriesPlan}
              </b>{' '}
              séries
            </span>
          </div>
        </div>
      </header>

      <main class="mu-body">
        {recado ? <RecadoDaSessao recado={recado} aberto={recadoAberto} onToggle={() => setRecadoAberto((v) => !v)} /> : null}

        {preparo.length > 0 ? <Preparacao lift={lift} itens={preparo} /> : null}

        <div class="mu-sec">
          <h2 class="ui-eyebrow">Treino principal</h2>
          <i class="mu-sec-line" />
        </div>

        {blocos.map((bloco, i) => {
          const chave = chaveDoBloco(bloco);
          const linhas = linhasPorBloco[i] ?? [];
          const todosPulados = bloco.every((e) => pulados.has(e.id));
          if (todosPulados) {
            return (
              <section key={chave} class="ui-card mu-ex is-pulado">
                <div class="mu-pulado">
                  <Icon name="pular" size={18} />
                  <span class="ui-grow">
                    <b>{bloco.map((e) => nomeEmUso(e, lift.trocas?.[e.id])).join(' + ')}</b>
                    <br />
                    Pulado neste treino
                  </span>
                  <Button size="sm" onClick={() => pular(bloco, false)}>
                    Retomar
                  </Button>
                </div>
              </section>
            );
          }
          const escolhida = ativas[chave];
          const ativa = linhas.find((l) => `${l.ex.id}:${l.n}` === escolhida) ?? linhas.find((l) => !l.feita);
          const feito = linhas.length > 0 && linhas.every((l) => l.feita);
          const par = bloco.length > 1;
          const ehDaVez = proxima !== undefined && bloco.some((e) => e.id === proxima.ex.id);
          return (
            <section key={chave} class={cx('ui-card mu-ex', feito && 'is-feito', par && 'is-par', ehDaVez && 'is-vez')}>
              {bloco.map((ex) => {
                const troca = lift.trocas?.[ex.id];
                const info = infos.get(ex.id);
                const frase = info ? fraseDaSugestao(info.sug, !info.ult, ex) : undefined;
                const suspenso = recado !== undefined && !recado.metodos && ex.metodo !== undefined && METODOS_DE_INTENSIDADE.includes(ex.metodo);
                const anim = troca ?? ex.anim;
                const nome = nomeEmUso(ex, troca);
                const lado = par ? (bloco.indexOf(ex) === 0 ? 'a' : 'b') : null;
                const obs = lift.obsEx?.[ex.id];
                return (
                  <div key={ex.id} id={`mu-ex-${ex.id}`} class={cx('mu-exh', pulados.has(ex.id) && 'is-fora')}>
                    <button type="button" class="mu-exfig" aria-label={`Como fazer: ${nome}`} onClick={() => setFolha({ t: 'como', ex })}>
                      <Mini anim={anim} tone={troca ? tomDoTipo(exById(troca)?.kind) : tomDaFicha(ex)} play="visible" size="lg" />
                    </button>
                    <div class="mu-exi">
                      <div class="mu-exn">
                        {lado ? <span class={cx('mu-tag', `is-${lado}`)}>{lado.toUpperCase()}</span> : null}
                        <h3 class="mu-nome">{nome}</h3>
                      </div>
                      <p class="mu-meta">
                        {metaDoEx(ex)}
                        {troca ? ` · no lugar de ${ex.nome}` : ''}
                      </p>
                      {ex.metodo || feito ? (
                        <div class="ui-inline mu-pills">
                          {ex.metodo ? (
                            <button type="button" class="mu-met" aria-label={`${METODO_ROTULO[ex.metodo]}: como fazer`} onClick={() => setFolha({ t: 'metodo', ex })}>
                              <Pill tone="musc" icon="info">
                                {METODO_ROTULO[ex.metodo].toLowerCase()}
                              </Pill>
                            </button>
                          ) : null}
                          {feito && lado !== 'b' ? <Pill tone="good">feito</Pill> : null}
                        </div>
                      ) : null}
                      {ex.series.map((b, k) => (
                        <p key={k} class="mu-alvo num">
                          {alvoDoBloco(b)}
                          {b.nota ? <span> · {b.nota}</span> : null}
                        </p>
                      ))}
                      {suspenso ? (
                        <Nota icon="alerta" tom="warn">
                          Nesta semana, faça séries normais
                        </Nota>
                      ) : null}
                      {info?.ult ? (
                        <p class="mu-ult">
                          Última vez ({fmtData(info.ult.data)}): <b>{resumoDasSeries(info.ult.sets)}</b>
                        </p>
                      ) : ehPrincipal(ex) ? null : (
                        <p class="mu-ult">Aquecimento: não conta em séries nem em volume</p>
                      )}
                      {frase ? (
                        <Nota icon={frase.tom === 'good' ? 'subir' : frase.tom === 'accent' ? 'alvo' : 'repetir'} tom={frase.tom}>
                          {frase.texto}
                        </Nota>
                      ) : null}
                      {obs ? (
                        <Nota icon="nota">{obs}</Nota>
                      ) : null}
                    </div>
                  </div>
                );
              })}

              {par ? (
                <p class="mu-par-dica">
                  <Icon name="repetir" size={14} />
                  <span>
                    Alterne <b>A</b> e <b>B</b>: uma série de cada, e descanse só depois do par.
                  </span>
                </p>
              ) : null}

              <div class="mu-sets">
                {linhas.map((l) => {
                  const v = valores(l.ex, l.n);
                  const ult = infos.get(l.ex.id)?.ult?.sets.find((s) => s.n === l.n);
                  const ehAtiva = ativa !== undefined && ativa.ex.id === l.ex.id && ativa.n === l.n;
                  const ehProxima = proxima !== undefined && proxima.ex.id === l.ex.id && proxima.n === l.n;
                  return (
                    <LinhaDeSerie
                      key={`${l.ex.id}:${l.n}`}
                      linha={l}
                      v={v}
                      ultima={ult ? serieCurta(ult.carga, ult.reps) : undefined}
                      ativa={ehAtiva}
                      proxima={ehProxima}
                      onAtivar={() => setAtivas((a) => ({ ...a, [chave]: ehAtiva ? '' : `${l.ex.id}:${l.n}` }))}
                      onEditar={(p) => editar(l.ex, l.n, p)}
                      onOk={() => (l.feita ? desmarcar(l) : marcar(l, bloco))}
                    />
                  );
                })}
              </div>

              <div class="mu-exf">
                <button type="button" class="mu-lnk" onClick={() => maisSerie(bloco)}>
                  {par ? '+ rodada' : '+ série'}
                </button>
                {podeTirar(bloco) ? (
                  <button type="button" class="mu-lnk" onClick={() => menosSerie(bloco)}>
                    {par ? '− rodada' : '− série'}
                  </button>
                ) : null}
                <button type="button" class="mu-lnk" onClick={() => abrir('obs', bloco)}>
                  observação
                </button>
                <button type="button" class="mu-lnk" aria-label="Trocar exercício" onClick={() => abrir('trocar', bloco)}>
                  trocar
                </button>
                <button type="button" class="mu-lnk" onClick={() => abrir('como', bloco)}>
                  como fazer
                </button>
                <button type="button" class="mu-lnk is-fim" aria-label={par ? 'Pular o par' : 'Pular exercício'} onClick={() => pular(bloco, true)}>
                  pular
                </button>
              </div>
            </section>
          );
        })}

        <div class="mu-fim">
          {tudoFeito ? (
            <p class="mu-fimtxt">
              <Icon name="check" size={18} />
              <span>Todas as séries feitas. Bom trabalho.</span>
            </p>
          ) : null}
          <Button variant={tudoFeito ? 'primary' : 'soft'} size="lg" block icon="check" onClick={() => setFolha({ t: 'concluir' })}>
            Concluir treino
          </Button>
          <div class="mu-fim2">
            <button type="button" class="mu-lnk" onClick={() => go('/musculacao')}>
              sair e continuar depois
            </button>
            <button type="button" class="mu-lnk is-crit" onClick={() => setFolha({ t: 'descartar' })}>
              descartar treino
            </button>
          </div>
        </div>
      </main>

      {descanso ? <BarraDescanso fim={descanso.fim} inicio={descanso.inicio} avisado={descanso.avisado} proxima={proximaTxt} onIr={proxima ? () => irPara(proxima.ex.id) : undefined} /> : null}

      <FolhaMetodo ex={folha?.t === 'metodo' ? folha.ex : undefined} recado={recado} onClose={() => setFolha(null)} />
      <FolhaObs lift={lift} ex={folha?.t === 'obs' ? folha.ex : undefined} onClose={() => setFolha(null)} />
      <FolhaTrocar lift={lift} ex={folha?.t === 'trocar' ? folha.ex : undefined} onClose={() => setFolha(null)} />
      <FolhaComo lift={lift} ex={folha?.t === 'como' ? folha.ex : undefined} onClose={() => setFolha(null)} />
      <Sheet open={folha?.t === 'escolher'} onClose={() => setFolha(null)} title="Qual exercício?">
        {folha?.t === 'escolher' ? (
          <List>
            {folha.exs.map((ex, i) => (
              <Row
                key={ex.id}
                leading={<span class={cx('mu-tag', i === 0 ? 'is-a' : 'is-b')}>{i === 0 ? 'A' : 'B'}</span>}
                title={nomeEmUso(ex, lift.trocas?.[ex.id])}
                sub={metaDoEx(ex)}
                chevron
                onClick={() => setFolha({ t: folha.acao, ex })}
              />
            ))}
          </List>
        ) : null}
      </Sheet>
      <FolhaConcluir
        open={folha?.t === 'concluir'}
        lift={lift}
        lifts={lifts}
        seriesPlan={seriesPlan}
        onClose={() => setFolha(null)}
        onConcluir={onConcluir}
        onDescartar={() => setFolha({ t: 'descartar' })}
      />
      <FolhaDescartar open={folha?.t === 'descartar'} onClose={() => setFolha(null)} onDescartar={onDescartar} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Cabeçalho: cronômetro e recado                                      */
/* ------------------------------------------------------------------ */

function Relogio({ lift }: { lift: Lift }) {
  const agora = useAgora(1000);
  const seg = lift.inicioMs !== undefined ? Math.max(0, (agora - lift.inicioMs) / 1000) : 0;
  return (
    <span class="mu-clock num" role="timer" aria-label="Tempo de treino">
      {fmtDur(seg)}
    </span>
  );
}

function RecadoDaSessao({ recado, aberto, onToggle }: { recado: RecadoForca; aberto: boolean; onToggle: () => void }) {
  return (
    <div class={cx('mu-recado', aberto && 'is-aberto')}>
      <button type="button" class="mu-recado-b" aria-expanded={aberto} onClick={onToggle}>
        <Icon name="nota" size={16} />
        <span class="ui-grow">
          <b>Semana: {recado.titulo.toLowerCase()}</b>
          <span>
            {' '}
            · folga de {recado.rir} reps{recado.metodos ? '' : ' · séries normais'}
          </span>
        </span>
        <i class="mu-chev" aria-hidden="true" />
      </button>
      {aberto ? <p class="mu-recado-t">{recado.texto}</p> : null}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Preparação (alongamento, mobilidade e aquecimento)                  */
/* ------------------------------------------------------------------ */

function feitasDoItem(l: Lift, ex: FichaExercicio): number {
  return Object.values(l.sets?.[ex.id] ?? {}).filter((s) => s.feito).length;
}

function Preparacao({ lift, itens }: { lift: Lift; itens: FichaExercicio[] }) {
  const [aberto, setAberto] = useState(false);
  const [timer, setTimer] = useState<{ exId: string; inicio: number; fim: number } | null>(null);

  const total = (ex: FichaExercicio): number => Math.max(1, seriesPlanejadas(ex).length);
  const completo = (ex: FichaExercicio): boolean => feitasDoItem(lift, ex) >= total(ex);
  const feitos = itens.filter(completo).length;
  const tudo = feitos === itens.length;

  const marcarTudoDe = (l: Lift, ex: FichaExercicio): Lift => {
    let out = l;
    for (let n = 1; n <= total(ex); n++) if (serieGravada(out, ex.id, n)?.feito !== true) out = marcarSerie(out, ex.id, n, {});
    return out;
  };
  const alternar = (ex: FichaExercicio): void => {
    const jaFeito = completo(ex);
    gravarLift(lift.id, (l) => {
      if (!jaFeito) return marcarTudoDe(l, ex);
      let out = l;
      for (let n = 1; n <= total(ex); n++) out = desmarcarSerie(out, ex.id, n);
      return out;
    });
    if (timer?.exId === ex.id) setTimer(null);
  };
  const marcarTudo = (): void => {
    gravarLift(lift.id, (l) => itens.reduce((acc, ex) => marcarTudoDe(acc, ex), l));
    setTimer(null);
  };
  /** Fim do cronômetro: conta mais uma série do item. */
  const fimDoTempo = (ex: FichaExercicio): void => {
    setTimer(null);
    bip('fim');
    vibrar([120, 60, 120]);
    gravarLift(lift.id, (l) => {
      for (let n = 1; n <= total(ex); n++) if (serieGravada(l, ex.id, n)?.feito !== true) return marcarSerie(l, ex.id, n, {});
      return l;
    });
  };

  return (
    <section class={cx('ui-card mu-prep', tudo && 'is-feito')}>
      <div class="mu-prep-h">
        <button type="button" class="mu-prep-b" aria-expanded={aberto} onClick={() => setAberto((v) => !v)}>
          <span class="mu-prep-t">Preparação</span>
          <span class="mu-prep-s">
            {tudo ? 'Tudo feito' : `${feitos} de ${itens.length} feitos`} · alongamento, mobilidade e aquecimento
          </span>
          <i class="mu-chev" aria-hidden="true" />
        </button>
        {!tudo ? (
          <Button size="sm" onClick={marcarTudo}>
            Marcar tudo
          </Button>
        ) : (
          <Pill tone="good">feito</Pill>
        )}
      </div>
      {aberto ? (
        <div class="mu-prep-l">
          {itens.map((ex) => {
            const plan = seriesPlanejadas(ex)[0];
            const ok = completo(ex);
            const n = feitasDoItem(lift, ex);
            const seg = plan?.segundos ?? null;
            const rodando = timer?.exId === ex.id ? timer : null;
            const bloco = ex.series[0];
            return (
              <div key={ex.id} class={cx('mu-prep-i', ok && 'is-ok')}>
                <a class="mu-prep-fig" href={`#/exercicio/${ex.anim}`} aria-label={`Como fazer: ${ex.nome}`}>
                  <Mini anim={ex.anim} tone="mob" size="sm" />
                </a>
                <div class="mu-prep-tx">
                  <b>{ex.nome}</b>
                  <span class="num">
                    {bloco ? alvoDoBloco(bloco) : ''}
                    {bloco?.nota ? ` · ${bloco.nota}` : ''}
                    {total(ex) > 1 && n > 0 && !ok ? ` · ${n}/${total(ex)}` : ''}
                  </span>
                </div>
                {seg !== null && !ok ? (
                  rodando ? (
                    <Contagem inicio={rodando.inicio} fim={rodando.fim} onFim={() => fimDoTempo(ex)} onParar={() => setTimer(null)} />
                  ) : (
                    <button
                      type="button"
                      class="mu-tempo"
                      aria-label={`Cronômetro de ${seg} segundos: ${ex.nome}`}
                      onClick={() => {
                        destravarAudio();
                        const agora = Date.now();
                        setTimer({ exId: ex.id, inicio: agora, fim: agora + seg * 1000 });
                      }}
                    >
                      <Icon name="cronometro" size={16} />
                      <span class="num">{seg} s</span>
                    </button>
                  )
                ) : null}
                <button type="button" class="mu-ok" aria-pressed={ok} aria-label={ok ? `Desmarcar ${ex.nome}` : `Marcar ${ex.nome} como feito`} onClick={() => alternar(ex)}>
                  <Icon name="check" size={22} />
                </button>
              </div>
            );
          })}
        </div>
      ) : null}
    </section>
  );
}

/** Contagem regressiva de um item por tempo (pelo relógio). Tocar para parar. */
function Contagem({ inicio, fim, onFim, onParar }: { inicio: number; fim: number; onFim: () => void; onParar: () => void }) {
  const agora = useAgora(200);
  const restam = Math.max(0, (fim - agora) / 1000);
  const acabou = agora >= fim;
  useEffect(() => {
    if (acabou) onFim();
  }, [acabou]);
  const fracao = fim > inicio ? Math.min(1, Math.max(0, (agora - inicio) / (fim - inicio))) : 1;
  return (
    <button type="button" class="mu-tempo is-rodando" aria-label="Parar o cronômetro" onClick={onParar}>
      <i class="mu-tempo-bar" style={{ width: `${Math.round(fracao * 100)}%` }} />
      <span class="num" role="timer">
        {fmtDur(Math.ceil(restam))}
      </span>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Linha de série                                                      */
/* ------------------------------------------------------------------ */

interface LinhaProps {
  linha: Linha;
  v: Valores;
  /** O que fez nesta série na última vez ("40 kg × 10"). */
  ultima: string | undefined;
  ativa: boolean;
  proxima: boolean;
  onAtivar: () => void;
  onEditar: (v: { carga?: number; reps?: number }) => void;
  onOk: () => void;
}

function LinhaDeSerie({ linha, v, ultima, ativa, proxima, onAtivar, onEditar, onOk }: LinhaProps) {
  const { n, plan, lado, rotulo, feita, total } = linha;
  const aq = plan?.aquecimento === true && ehPrincipal(linha.ex);
  const valor = v.tempo !== null ? `${plan?.reps ?? `${v.tempo} s`}${v.temCarga && v.carga > 0 ? ` · ${num(v.carga, 2)} kg` : ''}` : serieCurta(v.temCarga ? v.carga : 0, v.reps);
  const numero = (
    <span class="mu-set-n num">
      {rotulo}
      {aq ? <small>aq</small> : null}
    </span>
  );
  const rotuloOk = feita ? `Desmarcar a série ${rotulo}` : `Concluir a série ${rotulo}: ${valor}`;

  if (!ativa) {
    return (
      <div class={cx('mu-set', feita && 'is-ok', lado && `is-${lado}`)}>
        {numero}
        <button type="button" class="mu-set-main" aria-label={`Série ${rotulo}: ${valor}. Toque para ajustar`} onClick={onAtivar}>
          <span class="mu-set-prev num">
            {ultima ? (
              <>
                <span class="mu-set-pre">última </span>
                {ultima}
              </>
            ) : aq ? 'aquecimento' : plan ? `alvo ${plan.reps}` : ''}
          </span>
          <span class="mu-set-val num">{valor}</span>
        </button>
        <button type="button" class="mu-ok" aria-pressed={feita} aria-label={rotuloOk} onClick={onOk}>
          <Icon name="check" size={22} />
        </button>
      </div>
    );
  }

  const passoCarga = (delta: number): void => onEditar({ carga: Math.max(0, Math.round((v.carga + delta) * 2) / 2) });
  return (
    <div class={cx('mu-set is-ativa', feita && 'is-ok', proxima && 'is-next', lado && `is-${lado}`)}>
      <div class="mu-set-top">
        {numero}
        <button type="button" class="mu-set-tt" aria-label={`Recolher a série ${rotulo}`} onClick={onAtivar}>
          <b>
            {aq ? 'Aquecimento' : 'Série'} {n} de {total}
          </b>
          <span class="num">
            {plan ? `alvo ${plan.reps}` : ''}
            {ultima ? ` · última ${ultima}` : ''}
          </span>
        </button>
      </div>
      <div class={cx('mu-set-ctl', (!v.temCarga || v.tempo !== null) && 'is-um')}>
        {v.temCarga ? (
          <div class="mu-set-col">
            <Stepper label="Carga" unit="kg" step={0.5} min={0} max={999} value={v.carga} onChange={(carga) => onEditar({ carga })} />
            <div class="mu-rapido">
              <button type="button" class="mu-rap num" aria-label="Carga: menos 2,5 kg" disabled={v.carga <= 0} onClick={() => passoCarga(-2.5)}>
                −2,5
              </button>
              <button type="button" class="mu-rap num" aria-label="Carga: mais 2,5 kg" onClick={() => passoCarga(2.5)}>
                +2,5
              </button>
            </div>
          </div>
        ) : null}
        <div class="mu-set-col">
          {v.tempo === null ? (
            <Stepper label="Repetições" step={1} min={0} max={999} value={v.reps} onChange={(reps) => onEditar({ reps })} />
          ) : (
            <p class="mu-set-tempo num">{plan?.reps ?? `${v.tempo} s`}</p>
          )}
          <button type="button" class="mu-feito" aria-pressed={feita} aria-label={rotuloOk} onClick={onOk}>
            <Icon name="check" size={20} />
            <span>{feita ? 'Feita' : 'Concluir série'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Barra de descanso                                                   */
/* ------------------------------------------------------------------ */

function BarraDescanso({ inicio, fim, avisado, proxima, onIr }: { inicio: number; fim: number; avisado: boolean; proxima: string | undefined; onIr: (() => void) | undefined }) {
  const agora = useAgora(250);
  const restam = (fim - agora) / 1000;
  const acabou = restam <= 0;
  const passou = Math.max(0, -restam);

  useEffect(() => {
    if (!acabou) return;
    if (!avisado) {
      // Só avisa se o fim acabou de acontecer (ao reabrir o app muito depois, a barra já aparece em "Bora").
      if (Date.now() - fim < 4000) {
        bip('fim');
        vibrar([160, 80, 160]);
      }
      marcarAvisado();
    }
  }, [acabou, avisado, fim]);

  useEffect(() => {
    if (agora - fim > SOME_DEPOIS_MS) encerrarDescanso();
  }, [agora, fim]);

  const fracao = fim > inicio ? Math.min(1, Math.max(0, restam / ((fim - inicio) / 1000))) : 0;
  const prox = proxima ? (
    <button type="button" class="mu-prox" onClick={onIr}>
      <span>
        Próximo: <b>{proxima}</b>
      </span>
    </button>
  ) : null;

  return (
    <div class={cx('mu-rest', acabou && 'is-fim')} role="region" aria-label="Descanso">
      <i class="mu-rest-bar" style={{ width: `${(fracao * 100).toFixed(1)}%` }} />
      <div class="mu-rest-in">
        {acabou ? (
          <>
            <span class="mu-rest-n">Bora</span>
            <div class="mu-rest-l">
              <span class="num" role="timer">
                Descanso acabou · +{fmtDur(passou)}
              </span>
              {prox}
            </div>
            <Button size="sm" icon="fechar" aria-label="Fechar o aviso de descanso" onClick={encerrarDescanso} />
          </>
        ) : (
          <>
            <span class="mu-rest-n num" role="timer" aria-label={`Descanso: faltam ${Math.ceil(restam)} segundos`}>
              {fmtDur(Math.ceil(restam))}
            </span>
            <div class="mu-rest-l">
              <span>Descanso</span>
              {prox}
            </div>
            <Button size="sm" onClick={() => estenderDescanso(30)}>
              +30 s
            </Button>
            <Button size="sm" icon="pular" onClick={encerrarDescanso}>
              Pular
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Folhas                                                              */
/* ------------------------------------------------------------------ */

function FolhaMetodo({ ex, recado, onClose }: { ex: FichaExercicio | undefined; recado: RecadoForca | undefined; onClose: () => void }) {
  const suspenso = ex?.metodo !== undefined && recado !== undefined && !recado.metodos && METODOS_DE_INTENSIDADE.includes(ex.metodo);
  return (
    <Sheet open={ex !== undefined} onClose={onClose} title={ex?.metodo ? METODO_ROTULO[ex.metodo] : 'Método'}>
      {ex ? (
        <>
          <p class="ui-eyebrow">{ex.nome}</p>
          <p>{metodoTexto(ex)}</p>
          {ex.instrucoes ? (
            <div class="mu-bloco">
              <p class="ui-eyebrow">Instruções da ficha</p>
              <p class="ui-muted">{ex.instrucoes}</p>
            </div>
          ) : null}
          {suspenso && recado ? (
            <div class="ui-banner">
              <Icon name="alerta" />
              <span class="ui-grow">
                <b>Nesta semana, faça séries normais.</b> {recado.texto}
              </span>
            </div>
          ) : null}
        </>
      ) : null}
    </Sheet>
  );
}

function FolhaObs({ lift, ex, onClose }: { lift: Lift; ex: FichaExercicio | undefined; onClose: () => void }) {
  const [texto, setTexto] = useState('');
  useEffect(() => {
    if (ex) setTexto(lift.obsEx?.[ex.id] ?? '');
  }, [ex?.id]);
  const salvar = (): void => {
    if (!ex) return;
    const limpo = texto.trim();
    gravarLift(lift.id, (l) => {
      const obsEx = { ...(l.obsEx ?? {}) };
      if (limpo) obsEx[ex.id] = limpo;
      else delete obsEx[ex.id];
      return { ...l, obsEx };
    });
    onClose();
  };
  return (
    <Sheet
      open={ex !== undefined}
      onClose={onClose}
      title="Observação"
      footer={
        <>
          <Button onClick={onClose}>Cancelar</Button>
          <Button variant="primary" icon="check" onClick={salvar}>
            Salvar
          </Button>
        </>
      }
    >
      {ex ? (
        <Field label={ex.nome} hint="Fica guardada com o treino: ajuste do banco, dor, aparelho usado.">
          <TextArea value={texto} onChange={setTexto} rows={3} maxLength={300} placeholder="Ex.: banco no furo 4" />
        </Field>
      ) : null}
    </Sheet>
  );
}

function FolhaTrocar({ lift, ex, onClose }: { lift: Lift; ex: FichaExercicio | undefined; onClose: () => void }) {
  const atual = ex ? lift.trocas?.[ex.id] : undefined;
  const opcoes = ex ? (exById(ex.anim)?.swap ?? []).filter((id) => id !== ex.anim) : [];
  const trocar = (id: string | undefined): void => {
    if (!ex) return;
    gravarLift(lift.id, (l) => {
      const trocas = { ...(l.trocas ?? {}) };
      if (id) trocas[ex.id] = id;
      else delete trocas[ex.id];
      return { ...l, trocas };
    });
    toast(id ? `Trocado por ${exName(id)}` : 'Voltou o exercício da ficha');
    onClose();
  };
  return (
    <Sheet open={ex !== undefined} onClose={onClose} title="Trocar exercício">
      {ex ? (
        <>
          <p class="ui-muted">Aparelho ocupado? Escolha um substituto para hoje. As séries continuam contando para {ex.nome}.</p>
          {opcoes.length === 0 ? (
            <Empty icon="trocar" title="Sem substituto cadastrado" text="Este exercício não tem alternativa cadastrada. Se precisar, pule e anote na observação." />
          ) : (
            <List>
              {opcoes.map((id) => {
                const e = exById(id);
                return (
                  <Row
                    key={id}
                    leading={<Mini anim={id} tone={tomDoTipo(e?.kind)} size="sm" />}
                    title={exName(id)}
                    sub={e ? e.equipment.join(', ') : undefined}
                    right={atual === id ? <Pill tone="accent">em uso</Pill> : undefined}
                    onClick={() => trocar(id)}
                  />
                );
              })}
            </List>
          )}
          {atual ? (
            <Button icon="repetir" block onClick={() => trocar(undefined)}>
              Voltar para {ex.nome}
            </Button>
          ) : null}
        </>
      ) : null}
    </Sheet>
  );
}

function FolhaComo({ lift, ex, onClose }: { lift: Lift; ex: FichaExercicio | undefined; onClose: () => void }) {
  const id = ex ? (lift.trocas?.[ex.id] ?? ex.anim) : undefined;
  const e = id ? exById(id) : undefined;
  return (
    <Sheet
      open={ex !== undefined}
      onClose={onClose}
      title={ex ? nomeEmUso(ex, lift.trocas?.[ex.id]) : 'Como fazer'}
      footer={
        id ? (
          <Button icon="info" href={`/exercicio/${id}`}>
            Ver tudo sobre o exercício
          </Button>
        ) : undefined
      }
    >
      {ex && id ? (
        <>
          <ExMedia id={id} tone={e ? tomDoTipo(e.kind) : tomDaFicha(ex)} play="always" label={`Animação: ${exName(id)}`} />
          {e ? (
            <>
              <div class="mu-bloco">
                <p class="ui-eyebrow">Execução</p>
                <ol class="mu-passos">
                  {e.how.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ol>
              </div>
              <div class="mu-bloco">
                <p class="ui-eyebrow">Dicas</p>
                <ul class="mu-lista">
                  {e.cues.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              </div>
              {e.breath ? (
                <div class="mu-bloco">
                  <p class="ui-eyebrow">Respiração</p>
                  <p>{e.breath}</p>
                </div>
              ) : null}
            </>
          ) : null}
          {ex.instrucoes && !lift.trocas?.[ex.id] ? (
            <div class="mu-bloco">
              <p class="ui-eyebrow">Instruções da ficha</p>
              <p class="ui-muted">{ex.instrucoes}</p>
            </div>
          ) : null}
        </>
      ) : null}
    </Sheet>
  );
}

function textoDoPr(p: PrDaSessao): string {
  if (p.medida === 'reps') return `${p.reps} repetições${p.repsAnterior ? ` (antes, ${p.repsAnterior})` : ''}`;
  return `${num(p.carga, 2)} kg × ${p.reps} · 1RM estimado ${num(p.e1rm)} kg (antes, ${num(p.anterior)})`;
}

function ListaDePrs({ prs }: { prs: PrDaSessao[] }) {
  if (prs.length === 0) return null;
  return (
    <div class="mu-prs">
      <p class="ui-eyebrow">{prs.length === 1 ? 'Recorde da sessão' : 'Recordes da sessão'}</p>
      {prs.map((p) => (
        <p key={p.exId} class="mu-pr">
          <Icon name="trofeu" size={16} />
          <span>
            <b>{p.nome}</b>
            <br />
            <span class="num">{textoDoPr(p)}</span>
          </span>
        </p>
      ))}
    </div>
  );
}

interface FolhaConcluirProps {
  open: boolean;
  lift: Lift;
  lifts: Lift[];
  seriesPlan: number;
  onClose: () => void;
  onConcluir: (v: { intensidade?: number; obs?: string }) => void;
  onDescartar: () => void;
}

function FolhaConcluir({ open, lift, lifts, seriesPlan, onClose, onConcluir, onDescartar }: FolhaConcluirProps) {
  const [intensidade, setIntensidade] = useState<number | undefined>(undefined);
  const [obs, setObs] = useState('');
  if (!open) return null;
  return (
    <FolhaConcluirAberta
      lift={lift} lifts={lifts} seriesPlan={seriesPlan} intensidade={intensidade} obs={obs}
      setIntensidade={setIntensidade} setObs={setObs} onClose={onClose} onConcluir={onConcluir} onDescartar={onDescartar}
    />
  );
}

function FolhaConcluirAberta(p: Omit<FolhaConcluirProps, 'open'> & { intensidade: number | undefined; obs: string; setIntensidade: (v: number) => void; setObs: (v: string) => void }) {
  const { lift, lifts, seriesPlan } = p;
  const agora = useAgora(5000);
  const series = seriesFeitas(lift);
  const marcadas = Object.values(lift.sets ?? {}).reduce((s, m) => s + Object.values(m).filter((x) => x.feito).length, 0);
  const prs = prsDoLift(lifts, lift);
  const faltam = Math.max(0, seriesPlan - series);
  return (
    <Sheet
      open
      onClose={p.onClose}
      title="Concluir treino"
      footer={
        marcadas === 0 ? (
          <>
            <Button onClick={p.onClose}>Voltar ao treino</Button>
            <Button variant="danger" icon="lixeira" onClick={p.onDescartar}>
              Descartar
            </Button>
          </>
        ) : (
          <>
            <Button onClick={p.onClose}>Voltar</Button>
            <Button variant="primary" icon="check" onClick={() => p.onConcluir({ intensidade: p.intensidade, obs: p.obs })}>
              Concluir
            </Button>
          </>
        )
      }
    >
      <StatRow>
        <Stat label="Duração" value={fmtMin(minutosDecorridos(lift, agora)).replace(' min', '')} unit={minutosDecorridos(lift, agora) < 59.5 ? 'min' : undefined} />
        <Stat label="Volume" tone="musc" value={fmtVolume(volumeDoLift(lift))} unit="kg" />
        <Stat label="Séries" value={`${series}/${seriesPlan}`} />
      </StatRow>
      {marcadas === 0 ? (
        <div class="ui-banner">
          <Icon name="alerta" />
          <span class="ui-grow">Nenhuma série foi marcada. Volte ao treino ou descarte: um treino vazio não entra no histórico.</span>
        </div>
      ) : (
        <>
          {faltam > 0 ? <p class="ui-note">Faltam {plural(faltam, 'série', 'séries')} da ficha. Dá para concluir assim mesmo.</p> : null}
          <ListaDePrs prs={prs} />
          <Scale label="Intensidade do treino" min={1} max={5} value={p.intensidade} onChange={p.setIntensidade} left="leve" right="máxima" />
          <Field label="Observação" hint="Opcional. Vai junto no resumo para o treinador.">
            <TextArea value={p.obs} onChange={p.setObs} rows={2} maxLength={400} />
          </Field>
        </>
      )}
    </Sheet>
  );
}

/* ------------------------------------------------------------------ */
/* Treino concluído                                                    */
/* ------------------------------------------------------------------ */

function TreinoConcluido({ lift, lifts }: { lift: Lift; lifts: Lift[] }) {
  const volume = volumeDoLift(lift);
  const anterior = ultimoDaFicha(lifts.filter((l) => l.data <= lift.data), lift.ficha, lift.programa, lift);
  const volAnt = anterior ? volumeDoLift(anterior) : 0;
  const delta = anterior && volAnt > 0 ? (volume - volAnt) / volAnt : undefined;
  const prs: PrDaSessao[] = (lift.prs ?? []).map((p) => ({ ...p }));
  const pct = delta !== undefined ? Math.round(Math.abs(delta) * 100) : 0;
  return (
    <Screen
      title="Treino concluído"
      eyebrow={`Ficha ${lift.ficha} · ${lift.treino}`}
      tabs={false}
      footer={
        <>
          <Button href="/mobilidade" icon="mobilidade">
            Alongar
          </Button>
          <Button variant="primary" icon="check" onClick={() => go('/musculacao', { replace: true })}>
            Fechar
          </Button>
        </>
      }
    >
      <div class="ui-card mu-done">
        <span class="mu-done-ic">
          <Icon name="check" size={28} />
        </span>
        <p class="mu-done-t">Boa, treino guardado.</p>
        <StatRow>
          <Stat label="Duração" value={lift.min !== undefined ? fmtMin(lift.min).replace(' min', '') : null} unit={lift.min !== undefined && lift.min < 59.5 ? 'min' : undefined} />
          <Stat label="Volume" tone="musc" value={fmtVolume(volume)} unit="kg" />
          <Stat label="Séries" value={seriesFeitas(lift)} />
        </StatRow>
        {anterior ? (
          <p class="mu-done-cmp">
            {delta === undefined
              ? `Na última vez desta ficha (${fmtData(anterior.data)}) não houve volume registrado.`
              : pct === 0
                ? `Mesmo volume da última vez desta ficha (${fmtData(anterior.data)}: ${fmtVolume(volAnt)} kg).`
                : `Volume ${pct}% ${delta > 0 ? 'acima' : 'abaixo'} da última vez desta ficha (${fmtData(anterior.data)}: ${fmtVolume(volAnt)} kg).`}
          </p>
        ) : (
          <p class="mu-done-cmp">Primeira vez desta ficha no app: este treino vira a referência para os próximos.</p>
        )}
      </div>
      {prs.length > 0 ? (
        <div class="ui-card">
          <ListaDePrs prs={prs} />
        </div>
      ) : null}
      {lift.obs ? (
        <div class="ui-card">
          <p class="ui-eyebrow">Observação</p>
          <p class="ui-mt-sm">{lift.obs}</p>
        </div>
      ) : null}
    </Screen>
  );
}
