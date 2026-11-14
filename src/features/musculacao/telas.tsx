/* Musculação: a aba (ficha da vez, semana, recordes, fichas), o detalhe da ficha e o histórico de treinos. */
import { useState } from 'preact/hooks';
import { PRINCIPIOS_HIBRIDO, recadoForca, type RecadoForca } from '../../data/coach.ts';
import {
  METODO_ROTULO,
  acharExercicio,
  blocosDaFicha,
  catalogoDoExercicio,
  duracaoDoLift,
  ehPreparacaoAntiga,
  ehPrincipal,
  exerciciosPreparacao,
  fichaDoDia,
  fichaPorLetra,
  fichasAtivas,
  liftsFeitos,
  nomeDoExercicio,
  programaAtivo,
  proximaFicha,
  resumoSemanaMusc,
  rotacaoFichas,
  seriesFeitas,
  sessaoAberta,
  sugestao,
  totalSeriesDeTrabalho,
  ultimaVez,
  volumeDoLift,
} from '../../lib/academia.ts';
import { addDias, fmtData, fmtRelativa, hoje, inicioSemana } from '../../lib/dates.ts';
import { destravarAudio, useAgora } from '../../lib/feedback.ts';
import { fmtMin, num, plural } from '../../lib/format.ts';
import { go } from '../../lib/router.ts';
import { update, useStore } from '../../lib/store.ts';
import type { Ficha, FichaExercicio, ISODate, Lift, Settings } from '../../types.ts';
import { Button, Card, Empty, Icon, List, Pill, PorQue, Row, Screen, Section, Sheet, Stat, StatRow, cx, toast } from '../../ui/index.ts';
import {
  Letra,
  Mini,
  Nota,
  alvoDoBloco,
  apagarLift,
  fmtVolume,
  fraseDaSugestao,
  metaDoEx,
  minutosEstimados,
  resumoDasSeries,
  tomDaFicha,
  ultimoDaFicha,
} from './comum.tsx';

/* ------------------------------------------------------------------ */
/* Peças comuns                                                        */
/* ------------------------------------------------------------------ */

/** Nome de um recorde gravado: o nome atual do exercício quando o app o conhece; senão, o que foi gravado. */
function nomeGravado(exId: string, gravado: string): string {
  if (acharExercicio(exId)) return nomeDoExercicio(exId);
  return gravado && gravado !== exId ? gravado : nomeDoExercicio(exId);
}

function comecar(letra: string): void {
  destravarAudio();
  go(`/musculacao/sessao?ficha=${encodeURIComponent(letra)}`);
}

function continuar(): void {
  destravarAudio();
  go('/musculacao/sessao');
}

function RecadoCard({ recado }: { recado: RecadoForca }) {
  return (
    <Card area="musc" eyebrow="Recado da semana" title={recado.titulo} action={<Icon name="nota" />}>
      <p class="mu-recado-txt">{recado.texto}</p>
      <div class="ui-inline ui-mt-sm">
        <Pill tone="musc" icon="alvo">
          folga de {recado.rir} repetições
        </Pill>
      </div>
    </Card>
  );
}

/** Aviso da sessão de outro dia que ficou aberta. */
function AvisoAberta({ lift, dia }: { lift: Lift; dia: ISODate }) {
  return (
    <div class="ui-banner">
      <Icon name="alerta" />
      <span class="ui-grow">
        <b>Treino de {fmtData(lift.data)} ficou aberto</b>
        <br />
        Ficha {lift.ficha} · {fmtRelativa(lift.data, dia)}. Conclua ou descarte antes de começar outro.
      </span>
      <Button size="sm" href="/musculacao/sessao">
        Resolver
      </Button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* #/musculacao                                                        */
/* ------------------------------------------------------------------ */

/** A ficha da vez: a de hoje (se hoje tem musculação e ela não foi feita) ou a do próximo dia de musculação. */
function fichaDaVez(s: Settings, lifts: Lift[], dia: ISODate): { ficha: Ficha; data: ISODate | undefined; ehHoje: boolean } {
  const feitoHoje = liftsFeitos(lifts).some((l) => l.data === dia);
  if (!feitoHoje) {
    const f = fichaDoDia(s, lifts, dia);
    if (f) return { ficha: f, data: dia, ehHoje: true };
  }
  for (let i = 1; i <= 7; i++) {
    const d = addDias(dia, i);
    const f = fichaDoDia(s, lifts, d);
    if (f) return { ficha: f, data: d, ehHoje: false };
  }
  return { ficha: proximaFicha(s, lifts), data: undefined, ehHoje: false };
}

export function MusculacaoScreen() {
  const lifts = useStore((s) => s.lifts);
  const settings = useStore((s) => s.settings);
  const agora = useAgora(30000);
  const dia = hoje();
  const aberta = sessaoAberta(lifts);
  const abertaHoje = aberta && aberta.data === dia ? aberta : undefined;
  const fichaAberta = abertaHoje ? fichaPorLetra(settings, abertaHoje.ficha) : undefined;
  const vez = fichaDaVez(settings, lifts, dia);
  const ficha = fichaAberta ?? vez.ficha;
  const emAndamento = fichaAberta !== undefined;
  const feitos = liftsFeitos(lifts);
  const feitoHoje = feitos.find((l) => l.data === dia);
  const recado = recadoForca(inicioSemana(dia));
  const semana = resumoSemanaMusc(settings, lifts, dia);
  const rot = rotacaoFichas(settings, lifts);
  const fichas = fichasAtivas(settings);
  const programa = programaAtivo(settings);
  const ultima = ultimoDaFicha(lifts, ficha.id, programa.id);
  const principais = ficha.exercicios.filter(ehPrincipal);
  const decorrido = abertaHoje?.inicioMs !== undefined ? Math.max(0, Math.floor((agora - abertaHoje.inicioMs) / 60000)) : undefined;

  const desde = addDias(dia, -30);
  const prs = feitos
    .filter((l) => l.data >= desde)
    .flatMap((l) => (l.prs ?? []).map((p) => ({ ...p, data: l.data })))
    .reverse()
    .slice(0, 5);

  const rotulo = emAndamento ? 'Treino em andamento' : vez.ehHoje ? 'Ficha de hoje' : vez.data ? `Próxima ficha · ${fmtData(vez.data)}` : 'Próxima ficha';

  return (
    <Screen title="Musculação" eyebrow={programa.nome}>
      {aberta && !abertaHoje ? <AvisoAberta lift={aberta} dia={dia} /> : null}

      {recado ? <RecadoCard recado={recado} /> : null}

      <div class="ui-card mu-vez">
        <div class="ui-card-head">
          <div class="ui-eyebrow ui-card-eyebrow ui-area-musc">
            <i class="ui-dot" />
            {rotulo}
          </div>
          {emAndamento ? (
            <Pill tone="accent" icon="cronometro">
              em andamento
            </Pill>
          ) : feitoHoje ? (
            <Pill tone="good">treino de hoje feito</Pill>
          ) : null}
        </div>
        <div class="mu-vez-top">
          <Letra size="lg">{ficha.id}</Letra>
          <div class="ui-grow">
            <h2 class="mu-vez-nome">
              <span class="sr-only">Ficha {ficha.id}: </span>
              {ficha.nome}
            </h2>
            <p class="mu-vez-sub">
              {plural(principais.length, 'exercício', 'exercícios')} · {plural(totalSeriesDeTrabalho(ficha), 'série', 'séries')} · cerca de {fmtMin(minutosEstimados(ficha, settings))}
            </p>
            <p class="mu-vez-sub">{ultima ? `Última vez: ${fmtRelativa(ultima.data, dia)}` : 'Primeira vez no app'}</p>
          </div>
        </div>
        <ul class="mu-thumbs">
          {principais.slice(0, 3).map((ex) => (
            <li key={ex.id}>
              <Mini anim={ex.anim} tone="musc" size="md" />
              <span>{ex.nome}</span>
            </li>
          ))}
        </ul>
        <div class="mu-vez-acoes">
          {emAndamento ? (
            <Button variant="primary" size="lg" block icon="play" onClick={continuar}>
              {decorrido !== undefined ? `Continuar treino · ${fmtMin(decorrido)}` : 'Continuar treino'}
            </Button>
          ) : (
            <Button variant="primary" size="lg" block icon="play" disabled={aberta !== undefined} onClick={() => comecar(ficha.id)}>
              Começar treino
            </Button>
          )}
          <a class="ui-link" href={`#/musculacao/ficha/${ficha.id}`}>
            ver a ficha
          </a>
        </div>
      </div>

      <Section title="Semana">
        <StatRow>
          <Stat label="Treinos" tone="musc" value={`${semana.treinos}/${semana.planejados}`} sub="feitos e planejados" />
          <Stat label="Volume" value={semana.volume > 0 ? fmtVolume(semana.volume) : null} unit="kg" />
          <Stat label="Séries" value={semana.series > 0 ? semana.series : null} sub="de trabalho" />
        </StatRow>
        {rot.ultimas.length > 0 ? (
          <p class="mu-rot">
            <span class="ui-note">Últimas fichas</span>
            <span class="mu-rot-l" aria-label={`Últimas fichas feitas: ${rot.ultimas.join(', ')}`}>
              {rot.ultimas.map((l, i) => (
                <i key={i}>{l}</i>
              ))}
            </span>
          </p>
        ) : null}
      </Section>

      <Section title="Recordes recentes">
        {prs.length === 0 ? (
          <Empty icon="trofeu" title="Nenhum recorde nos últimos 30 dias" text="Um recorde aparece quando uma série passa o seu melhor 1RM estimado no exercício." />
        ) : (
          <Card>
            <List>
              {prs.map((p) => {
                const anim = catalogoDoExercicio(p.exId);
                return (
                  <Row
                    key={`${p.exId}-${p.data}`}
                    leading={<Icon name="trofeu" />}
                    title={nomeGravado(p.exId, p.nome)}
                    sub={`${fmtData(p.data)} · ${p.medida === 'reps' ? `${p.reps} repetições` : `${num(p.carga, 2)} kg × ${p.reps}`}`}
                    right={
                      p.medida === 'reps' ? undefined : (
                        <>
                          {num(p.e1rm)}
                          <small>kg</small>
                        </>
                      )
                    }
                    tone="accent"
                    href={anim ? `/exercicio/${anim}` : undefined}
                  />
                );
              })}
            </List>
            <p class="ui-note ui-mt-sm">À direita, o 1RM estimado: a carga que você faria uma vez só.</p>
          </Card>
        )}
      </Section>

      <Section title="Fichas">
        <Card>
          <List>
            {fichas.map((f) => {
              const u = ultimoDaFicha(lifts, f.id, programa.id);
              return (
                <Row
                  key={f.id}
                  leading={<Letra size="sm">{f.id}</Letra>}
                  title={f.nome}
                  sub={`${plural(f.exercicios.filter(ehPrincipal).length, 'exercício', 'exercícios')} · ${u ? `última vez ${fmtRelativa(u.data, dia)}` : 'ainda não feita'}`}
                  right={f.id === ficha.id ? <Pill tone="musc">{emAndamento ? 'agora' : 'da vez'}</Pill> : undefined}
                  href={`/musculacao/ficha/${f.id}`}
                />
              );
            })}
          </List>
          <p class="ui-note ui-mt-sm">
            {programa.fonte}. Objetivo: {programa.objetivo.toLowerCase()}.
          </p>
        </Card>
        <Card>
          <List>
            <Row leading={<Icon name="calendario" />} title="Histórico" sub={feitos.length > 0 ? plural(feitos.length, 'treino feito', 'treinos feitos') : 'Nenhum treino feito ainda'} href="/musculacao/historico" />
            <Row leading={<Icon name="buscar" />} title="Exercícios" sub="Como fazer cada um, com foto e passo a passo" href="/exercicios" />
          </List>
        </Card>
      </Section>

      <Section title="Como este treino funciona">
        <Card>
          <ol class="mu-princ">
            {PRINCIPIOS_HIBRIDO.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ol>
        </Card>
      </Section>
    </Screen>
  );
}

/* ------------------------------------------------------------------ */
/* #/musculacao/ficha/:id                                              */
/* ------------------------------------------------------------------ */

/** Agrupa os itens da preparação que formam par entre si (mesmo código `combinado`). */
function gruposDaPreparacao(itens: FichaExercicio[]): FichaExercicio[][] {
  const out: FichaExercicio[][] = [];
  const vistos = new Set<string>();
  for (const ex of itens) {
    if (vistos.has(ex.id)) continue;
    const par = ex.combinado ? itens.filter((e) => e.combinado === ex.combinado) : [ex];
    const grupo = par.length === 2 ? par : [ex];
    grupo.forEach((e) => vistos.add(e.id));
    out.push(grupo);
  }
  return out;
}

function ItemDaFicha({ ex, lifts, settings, recado, lado }: { ex: FichaExercicio; lifts: Lift[]; settings: Settings; recado: RecadoForca | undefined; lado?: 'a' | 'b' }) {
  const principal = ehPrincipal(ex);
  const ult = principal ? ultimaVez(lifts, ex.id) : undefined;
  const frase = principal ? fraseDaSugestao(sugestao(settings, lifts, ex), !ult, ex) : undefined;
  const suspenso = recado !== undefined && !recado.metodos && (ex.metodo === 'drop-set' || ex.metodo === 'rest-pause' || ex.metodo === 'cluster-set' || ex.metodo === 'dead-stop');
  return (
    <a class="mu-item" href={`#/exercicio/${ex.anim}`}>
      <Mini anim={ex.anim} tone={tomDaFicha(ex)} play={principal ? 'visible' : 'never'} size={principal ? 'lg' : 'md'} />
      <span class="mu-item-tx">
        <span class="mu-exn">
          {lado ? <span class={cx('mu-tag', `is-${lado}`)}>{lado.toUpperCase()}</span> : null}
          <b class="mu-nome">{ex.nome}</b>
        </span>
        <span class="mu-meta">{metaDoEx(ex)}</span>
        {ex.series.map((b, k) => (
          <span key={k} class="mu-alvo num">
            {alvoDoBloco(b)}
            {b.nota ? <span> · {b.nota}</span> : null}
          </span>
        ))}
        {ex.metodo ? (
          <span class="ui-inline mu-pills">
            <Pill tone="musc">{METODO_ROTULO[ex.metodo].toLowerCase()}</Pill>
            {suspenso ? <span class="mu-ult">nesta semana, faça séries normais</span> : null}
          </span>
        ) : null}
        {ult ? (
          <span class="mu-ult">
            Última vez ({fmtData(ult.data)}): <b>{resumoDasSeries(ult.sets)}</b>
          </span>
        ) : null}
        {frase ? (
          <Nota icon={frase.tom === 'good' ? 'subir' : frase.tom === 'accent' ? 'alvo' : 'repetir'} tom={frase.tom}>
            {frase.texto}
          </Nota>
        ) : null}
      </span>
      <Icon name="avancar" size={16} class="mu-item-chev" />
    </a>
  );
}

function GrupoDaFicha({ grupo, ...resto }: { grupo: FichaExercicio[]; lifts: Lift[]; settings: Settings; recado: RecadoForca | undefined }) {
  const [a, b] = grupo;
  if (a && b) {
    return (
      <div class="mu-par">
        <span class="mu-par-t">Par combinado · alterne A e B</span>
        <ItemDaFicha ex={a} lado="a" {...resto} />
        <ItemDaFicha ex={b} lado="b" {...resto} />
      </div>
    );
  }
  return a ? <ItemDaFicha ex={a} {...resto} /> : null;
}

export function FichaScreen({ id }: { id: string }) {
  const lifts = useStore((s) => s.lifts);
  const settings = useStore((s) => s.settings);
  const dia = hoje();
  const ficha = fichaPorLetra(settings, id.toUpperCase());
  if (!ficha) {
    return (
      <Screen title="Ficha" back="/musculacao">
        <Empty icon="musculacao" title="Ficha não encontrada" text={`O programa em uso não tem a ficha ${id}.`} action={<Button size="sm" href="/musculacao">Ver as fichas</Button>} />
      </Screen>
    );
  }
  const programa = programaAtivo(settings);
  const aberta = sessaoAberta(lifts);
  const estaAberta = aberta !== undefined && aberta.ficha === ficha.id && aberta.data === dia;
  const recado = recadoForca(inicioSemana(dia));
  const preparo = gruposDaPreparacao(exerciciosPreparacao(ficha));
  const blocos = blocosDaFicha(ficha);
  const ultima = ultimoDaFicha(lifts, ficha.id, programa.id);
  const resto = { lifts, settings, recado };

  return (
    <Screen
      title={ficha.nome}
      eyebrow={`Ficha ${ficha.id} · ${programa.nome}`}
      back="/musculacao"
      footer={
        estaAberta ? (
          <Button variant="primary" size="lg" icon="play" onClick={continuar}>
            Continuar treino
          </Button>
        ) : aberta ? (
          <Button size="lg" icon="play" onClick={continuar}>
            Há um treino da ficha {aberta.ficha} aberto
          </Button>
        ) : (
          <Button variant="primary" size="lg" icon="play" onClick={() => comecar(ficha.id)}>
            Começar treino
          </Button>
        )
      }
    >
      <div class="mu-ficha-top">
        <Letra size="lg">{ficha.id}</Letra>
        <p class="ui-grow mu-vez-sub">
          {plural(ficha.exercicios.filter(ehPrincipal).length, 'exercício', 'exercícios')} · {plural(totalSeriesDeTrabalho(ficha), 'série', 'séries')} de trabalho · cerca de {fmtMin(minutosEstimados(ficha, settings))}
          <br />
          {ultima ? `Última vez: ${fmtRelativa(ultima.data, dia)}` : 'Ainda não feita no app'}
        </p>
      </div>

      {recado && !recado.metodos ? (
        <div class="ui-banner is-accent">
          <Icon name="nota" />
          <span class="ui-grow">
            <b>Semana de {recado.titulo.toLowerCase()}.</b> Folga de {recado.rir} repetições e séries normais, sem drop-set nem rest-pause.
          </span>
        </div>
      ) : null}

      <PorQue texto={ficha.porque} area="musc" />

      {preparo.length > 0 ? (
        <Section title="Preparação">
          <Card>
            <div class="mu-itens">
              {preparo.map((g) => (
                <GrupoDaFicha key={g.map((e) => e.id).join('+')} grupo={g} {...resto} />
              ))}
            </div>
            <p class="ui-note ui-mt-sm">Alongamento, mobilidade e aquecimento: não contam em séries nem em volume.</p>
          </Card>
        </Section>
      ) : null}

      <Section title="Treino principal">
        <Card>
          <div class="mu-itens">
            {blocos.map((g) => (
              <GrupoDaFicha key={g.map((e) => e.id).join('+')} grupo={g} {...resto} />
            ))}
          </div>
        </Card>
      </Section>
    </Screen>
  );
}

/* ------------------------------------------------------------------ */
/* #/musculacao/historico                                              */
/* ------------------------------------------------------------------ */


function TreinoFeito({ lift, aberto, onToggle, onApagar }: { lift: Lift; aberto: boolean; onToggle: () => void; onApagar: () => void }) {
  const dur = duracaoDoLift(lift);
  const volume = volumeDoLift(lift);
  const series = seriesFeitas(lift);
  const nPrs = lift.prs?.length ?? 0;
  const fatos: string[] = [];
  if (dur !== null) fatos.push(fmtMin(Math.round(dur)));
  if (series > 0) fatos.push(plural(series, 'série', 'séries'));
  if (volume > 0) fatos.push(`${fmtVolume(volume)} kg`);
  const exs = Object.entries(lift.sets ?? {})
    .map(([exId, m]) => ({
      exId,
      ex: acharExercicio(exId)?.ex,
      sets: Object.entries(m).filter(([, s]) => s.feito).sort((a, b) => Number(a[0]) - Number(b[0])).map(([, s]) => s),
    }))
    .filter((e) => e.sets.length > 0 && (e.ex ? ehPrincipal(e.ex) : !ehPreparacaoAntiga(e.exId)))
    .sort((a, b) => a.exId.localeCompare(b.exId));
  const prDe = new Set((lift.prs ?? []).map((p) => p.exId));
  return (
    <div class="ui-card mu-feito-card">
      <button type="button" class="mu-hist-b" aria-expanded={aberto} onClick={onToggle}>
        <Letra size="md">{lift.ficha || '·'}</Letra>
        <span class="ui-grow mu-hist-tx">
          <span class="ui-eyebrow">{fmtData(lift.data)}</span>
          <b>{lift.treino || `Ficha ${lift.ficha}`}</b>
          <span class="mu-meta num">{fatos.length > 0 ? fatos.join(' · ') : 'Sem séries registradas'}</span>
        </span>
        {nPrs > 0 ? (
          <Pill tone="accent" icon="trofeu">
            {nPrs}
          </Pill>
        ) : null}
        <i class="mu-chev" aria-hidden="true" />
      </button>
      {aberto ? (
        <div class="mu-hist-d">
          {exs.length === 0 ? <p class="ui-note">Treino registrado sem o detalhe das séries.</p> : null}
          {exs.map((e) => (
            <p key={e.exId} class="mu-hist-ex">
              <b>
                {nomeDoExercicio(e.exId)}
                {prDe.has(e.exId) ? <Icon name="trofeu" size={14} class="mu-hist-pr" /> : null}
              </b>
              <span class="num">{resumoDasSeries(e.sets)}</span>
              {lift.obsEx?.[e.exId] ? <span class="mu-ult">{lift.obsEx[e.exId]}</span> : null}
            </p>
          ))}
          {lift.intensidade ? <p class="ui-note">Intensidade: <b>{lift.intensidade} de 5</b></p> : null}
          {lift.obs ? <p class="ui-note">Observação: <b>{lift.obs}</b></p> : null}
          <div class="mu-hist-acoes">
            <Button size="sm" variant="danger" icon="lixeira" onClick={onApagar}>
              Apagar treino
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function LiftsScreen() {
  const lifts = useStore((s) => s.lifts);
  const dia = hoje();
  const feitos = liftsFeitos(lifts).reverse();
  const [aberto, setAberto] = useState<string | null>(null);
  const [apagar, setApagar] = useState<Lift | null>(null);
  const desde = addDias(dia, -27);
  const recentes = feitos.filter((l) => l.data >= desde);

  const confirmar = (): void => {
    if (!apagar) return;
    const copia = apagar;
    apagarLift(copia.id);
    setApagar(null);
    toast('Treino apagado', {
      action: {
        label: 'Desfazer',
        onClick: () =>
          update((d) => {
            if (!d.lifts.some((l) => l.id === copia.id)) d.lifts.push(copia);
          }),
      },
    });
  };

  return (
    <Screen title="Treinos feitos" eyebrow="Musculação" back="/musculacao">
      {feitos.length === 0 ? (
        <Empty
          icon="musculacao"
          title="Nenhum treino feito ainda"
          text="Os treinos concluídos aparecem aqui, com séries, volume e recordes."
          action={<Button size="sm" href="/musculacao">Ver a ficha da vez</Button>}
        />
      ) : (
        <>
          <Section title="Últimas 4 semanas">
            <StatRow>
              <Stat label="Treinos" tone="musc" value={recentes.length} />
              <Stat label="Volume" value={fmtVolume(recentes.reduce((s, l) => s + volumeDoLift(l), 0))} unit="kg" />
              <Stat label="Recordes" value={recentes.reduce((s, l) => s + (l.prs?.length ?? 0), 0)} />
            </StatRow>
          </Section>
          <Section title={plural(feitos.length, 'treino', 'treinos')}>
            {feitos.map((l) => (
              <TreinoFeito key={l.id} lift={l} aberto={aberto === l.id} onToggle={() => setAberto(aberto === l.id ? null : l.id)} onApagar={() => setApagar(l)} />
            ))}
          </Section>
        </>
      )}
      <Sheet
        open={apagar !== null}
        onClose={() => setApagar(null)}
        title="Apagar este treino?"
        footer={
          <>
            <Button onClick={() => setApagar(null)}>Cancelar</Button>
            <Button variant="danger" icon="lixeira" onClick={confirmar}>
              Apagar
            </Button>
          </>
        }
      >
        <p class="ui-muted">
          {apagar ? `Ficha ${apagar.ficha} de ${fmtData(apagar.data, 'longa')}. ` : ''}As séries e os recordes deste treino saem do histórico e da progressão.
        </p>
      </Sheet>
    </Screen>
  );
}
