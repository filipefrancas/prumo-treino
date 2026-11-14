/* Progresso (#/progresso): consistência, corrida, força, peso, mobilidade e o resumo para o treinador. */
import { useState } from 'preact/hooks';
import { fichasAtivas, historicoEx, liftsFeitos, resumoSemanaMusc, volumeDoLift, ehPrincipal } from '../../lib/academia.ts';
import { porSemana, recordes, ultimasSemanas } from '../../lib/corrida.ts';
import { addDias, fmtData, fmtDiaMes, fmtRelativa, hoje, inicioSemana, MESES_LONGOS } from '../../lib/dates.ts';
import { copiar } from '../../lib/files.ts';
import { fmtMin, kg, num, plural } from '../../lib/format.ts';
import { resumoDaSemana } from '../../lib/plano.ts';
import { mapaDeTreinos, mobPorSemana, pesoComMedia, resumoParaTreinador, salvarPeso, sequenciaDeSemanas } from '../../lib/progresso.ts';
import { update, useStore } from '../../lib/store.ts';
import type { AppState, ISODate, WeightLog } from '../../types.ts';
import {
  Bars,
  Button,
  Card,
  DateInput,
  Empty,
  Field,
  Heat,
  Icon,
  IconButton,
  LineChart,
  List,
  Pill,
  Ring,
  Row,
  Screen,
  Segmented,
  Sheet,
  Stat,
  StatRow,
  Stepper,
  TextInput,
  toast,
} from '../../ui/index.ts';
import './progresso.css';

const SEMANAS = 12;

/** Milhar com ponto, sem casas: 9840 → "9.840". */
const inteiro = (v: number): string => String(Math.round(v)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');

/* ------------------------------------------------------------------ */
/* Consistência                                                        */
/* ------------------------------------------------------------------ */

function Consistencia({ state, dia }: { state: AppState; dia: ISODate }) {
  const mapa = mapaDeTreinos(state, SEMANAS, dia);
  const sequencia = sequenciaDeSemanas(state, 3, dia);
  const semana = resumoDaSemana(state, dia);
  const ativos = mapa.flat().filter((d) => d.data <= dia && (d.corrida || d.musc || d.mob)).length;
  const fracao = semana.planejados > 0 ? semana.feitos / semana.planejados : 0;
  return (
    <Card title="Consistência" action="12 semanas">
      <div class="pr-cons">
        <Ring
          value={fracao}
          size={112}
          label={`${semana.feitos}/${semana.planejados}`}
          sub="na semana"
          ariaLabel={`${semana.feitos} de ${plural(semana.planejados, 'treino planejado', 'treinos planejados')} feitos nesta semana`}
        />
        <div class="pr-cons-nums">
          <Stat
            label="Sequência"
            tone={sequencia > 0 ? 'accent' : undefined}
            value={String(sequencia)}
            unit={sequencia === 1 ? 'semana' : 'semanas'}
            sub="com 3 ou mais treinos"
          />
          <Stat label="Dias com treino" value={String(ativos)} sub={ativos === 0 ? 'o primeiro vale muito' : 'nas últimas 12 semanas'} />
        </div>
      </div>
      {/* o Heat do kit espera `date`; mapaDeTreinos devolve `data` */}
      <Heat weeks={mapa.map((w) => w.map((d) => ({ date: d.data, corrida: d.corrida, musc: d.musc, mob: d.mob })))} todayISO={dia} class="pr-heat" />
      {ativos === 0 ? (
        <p class="ui-note ui-mt-sm">Cada treino registrado vira um ponto no mapa: corrida, musculação e mobilidade.</p>
      ) : null}
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/* Corrida                                                             */
/* ------------------------------------------------------------------ */

function Corrida({ state, dia, desde }: { state: AppState; dia: ISODate; desde: ISODate }) {
  const noPeriodo = state.runs.filter((r) => r.data >= desde && r.data <= dia);
  const semanas = porSemana(state.runs, SEMANAS, dia);
  const mes = dia.slice(0, 7);
  const kmMes = state.runs.filter((r) => r.data.slice(0, 7) === mes).reduce((s, r) => s + (r.km ?? 0), 0);
  const nomeMes = MESES_LONGOS[Number(dia.slice(5, 7)) - 1] ?? 'mês';
  const longa = recordes(noPeriodo).maisLonga;
  const minutos = noPeriodo.reduce((s, r) => s + (r.min ?? 0), 0);
  const atual = inicioSemana(dia);
  return (
    <Card area="corrida" title="Corrida" action={<a class="ui-link" href="#/corrida">ver plano</a>}>
      {noPeriodo.length === 0 ? (
        <Empty
          icon="corrida"
          title="Nenhuma corrida nas últimas 12 semanas"
          text="Registre o treino do dia em Corrida ou importe o histórico em Ajustes: os minutos por semana aparecem aqui."
        />
      ) : (
        <>
          <StatRow>
            <Stat label={`Km em ${nomeMes}`} value={kmMes > 0 ? num(kmMes, 1) : null} unit="km" />
            <Stat
              label="Mais longa"
              value={longa ? (longa.km !== undefined ? num(longa.km, 1) : String(Math.round(longa.min ?? 0))) : null}
              unit={longa?.km !== undefined ? 'km' : 'min'}
              sub={longa ? fmtData(longa.data) : undefined}
            />
            <Stat label="Corridas" value={String(noPeriodo.length)} sub={fmtMin(minutos)} />
          </StatRow>
          <div class="pr-chart">
            <div class="pr-chart-lab">Minutos por semana</div>
            <Bars
              data={semanas.map((s) => ({ label: fmtDiaMes(s.semana), value: Math.round(s.min), highlight: s.semana === atual }))}
              unit="min"
              tone="corrida"
              height={150}
            />
          </div>
        </>
      )}
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/* Força                                                               */
/* ------------------------------------------------------------------ */

interface Recorde {
  exId: string;
  anim: string;
  nome: string;
  ficha: string;
  data: ISODate;
  e1rm: number;
  carga: number;
  reps: number;
  sessoes: number;
}

/** O melhor de cada exercício principal das fichas em uso (e1RM; em peso do corpo, repetições). */
function recordesPorExercicio(state: AppState): Recorde[] {
  const saida: Recorde[] = [];
  for (const ficha of fichasAtivas(state.settings)) {
    for (const ex of ficha.exercicios) {
      if (!ehPrincipal(ex)) continue;
      const h = historicoEx(state.lifts, ex.id);
      let melhor = h[0];
      if (!melhor) continue;
      for (const s of h) {
        if (s.e1rm > melhor.e1rm || (s.e1rm === melhor.e1rm && s.e1rm === 0 && s.repsMax > melhor.repsMax)) melhor = s;
      }
      saida.push({ exId: ex.id, anim: ex.anim, nome: ex.nome, ficha: ficha.id, data: melhor.data, e1rm: melhor.e1rm, carga: melhor.cargaMax, reps: melhor.repsMax, sessoes: h.length });
    }
  }
  return saida.sort((a, b) => (a.data < b.data ? 1 : a.data > b.data ? -1 : b.e1rm - a.e1rm));
}

function Forca({ state, dia, desde }: { state: AppState; dia: ISODate; desde: ISODate }) {
  const [modo, setModo] = useState<'treinos' | 'volume'>('treinos');
  const [todos, setTodos] = useState(false);
  const feitos = liftsFeitos(state.lifts);
  const noPeriodo = feitos.filter((l) => l.data >= desde && l.data <= dia);
  const atual = inicioSemana(dia);
  const semanas = ultimasSemanas(SEMANAS, dia).map((semana) => {
    const fim = addDias(semana, 6);
    const da = noPeriodo.filter((l) => l.data >= semana && l.data <= fim);
    return { semana, n: da.length, volume: da.reduce((s, l) => s + volumeDoLift(l), 0) };
  });
  const semana = resumoSemanaMusc(state.settings, state.lifts, dia);
  const recs = recordesPorExercicio(state);
  const visiveis = todos ? recs : recs.slice(0, 5);
  const recente = addDias(dia, -14);

  if (feitos.length === 0) {
    return (
      <Card area="musc" title="Força" action={<a class="ui-link" href="#/musculacao">ver fichas</a>}>
        <Empty
          icon="musculacao"
          title="Nenhum treino de força registrado"
          text="Conclua um treino em Musculação: treinos e volume por semana e os recordes de cada exercício aparecem aqui."
        />
      </Card>
    );
  }

  return (
    <Card area="musc" title="Força" action={<a class="ui-link" href="#/musculacao/historico">ver treinos</a>}>
      <StatRow>
        <Stat label="Treinos na semana" value={`${semana.treinos}/${semana.planejados}`} />
        <Stat label="Volume na semana" value={semana.volume > 0 ? inteiro(semana.volume) : null} unit="kg" />
        <Stat label="Séries na semana" value={semana.series > 0 ? String(semana.series) : null} />
      </StatRow>
      <div class="pr-chart">
        <div class="pr-chart-head">
          <div class="pr-chart-lab">{modo === 'treinos' ? 'Treinos por semana' : 'Volume por semana, em toneladas'}</div>
          <Segmented
            size="sm"
            label="O que mostrar no gráfico"
            value={modo}
            onChange={setModo}
            options={[
              { v: 'treinos', l: 'Treinos' },
              { v: 'volume', l: 'Volume' },
            ]}
          />
        </div>
        {modo === 'treinos' ? (
          <Bars
            data={semanas.map((s) => ({ label: fmtDiaMes(s.semana), value: s.n, highlight: s.semana === atual }))}
            unit="treinos"
            tone="musc"
            target={semana.planejados > 0 ? semana.planejados : undefined}
            height={150}
            format={(v) => num(v, 0)}
          />
        ) : (
          <Bars
            data={semanas.map((s) => ({ label: fmtDiaMes(s.semana), value: Math.round(s.volume / 100) / 10, highlight: s.semana === atual }))}
            unit="t"
            tone="musc"
            height={150}
          />
        )}
      </div>
      <div class="pr-sub">
        <div class="pr-sub-head">
          <h4 class="ui-eyebrow">Recordes por exercício</h4>
          {recs.length > 0 ? <span class="ui-note">e1RM estimado</span> : null}
        </div>
        {recs.length === 0 ? (
          <p class="ui-note">Os recordes aparecem quando as séries tiverem carga e repetições registradas.</p>
        ) : (
          <>
            <List>
              {visiveis.map((r) => (
                <Row
                  key={r.exId}
                  leading={<Icon name="trofeu" size={18} class={r.sessoes > 1 && r.data >= recente ? 'pr-novo' : undefined} />}
                  title={r.nome}
                  sub={
                    <>
                      Ficha {r.ficha} · {r.e1rm > 0 ? `carga máx. ${kg(r.carga)}` : 'peso do corpo'} · {fmtRelativa(r.data, dia)}
                      {r.sessoes > 1 && r.data >= recente ? <b class="pr-novo-txt"> · novo</b> : null}
                    </>
                  }
                  right={r.e1rm > 0 ? <>{num(r.e1rm, 1)}<small>kg</small></> : <>{r.reps}<small>rep.</small></>}
                  href={`/exercicio/${r.anim}`}
                  chevron={false}
                />
              ))}
            </List>
            {recs.length > 5 ? (
              <button type="button" class="ui-link pr-mais" onClick={() => setTodos(!todos)}>
                {todos ? 'mostrar menos' : `ver todos os ${recs.length}`}
              </button>
            ) : null}
          </>
        )}
      </div>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/* Peso                                                                */
/* ------------------------------------------------------------------ */

interface PesoForm {
  aberto: boolean;
  /** Registro em edição (data original), ou null para um novo. */
  original: WeightLog | null;
  data: ISODate;
  valor: number;
  obs: string;
}

function Peso({ state, dia }: { state: AppState; dia: ISODate }) {
  const { weights, settings } = state;
  const serie = pesoComMedia(weights);
  const ultimo = serie[serie.length - 1];
  const meta = settings.pesoMeta;
  const [form, setForm] = useState<PesoForm>({ aberto: false, original: null, data: dia, valor: 80, obs: '' });
  const [apagar, setApagar] = useState(false);

  const abrirNovo = (): void => {
    const deHoje = weights.find((w) => w.data === dia);
    setForm({ aberto: true, original: deHoje ?? null, data: dia, valor: deHoje?.kg ?? ultimo?.kg ?? meta ?? 80, obs: deHoje?.obs ?? '' });
  };
  const abrirEdicao = (w: WeightLog): void => setForm({ aberto: true, original: w, data: w.data, valor: w.kg, obs: w.obs ?? '' });
  const fechar = (): void => {
    setForm((f) => ({ ...f, aberto: false }));
    setApagar(false);
  };
  const salvar = (): void => {
    if (!form.data || form.data > dia) {
      toast('Escolha uma data até hoje.', { tone: 'erro' });
      return;
    }
    const original = form.original;
    if (original && original.data !== form.data) {
      update((d) => {
        d.weights = d.weights.filter((w) => w.id !== original.id);
      });
    }
    salvarPeso(form.data, Math.round(form.valor * 10) / 10, form.obs);
    fechar();
    toast('Peso registrado', { tone: 'ok' });
  };
  const confirmarApagar = (): void => {
    const original = form.original;
    if (!original) return;
    update((d) => {
      d.weights = d.weights.filter((w) => w.id !== original.id);
    });
    fechar();
    toast('Registro apagado', {
      action: {
        label: 'Desfazer',
        onClick: () => salvarPeso(original.data, original.kg, original.obs),
      },
    });
  };

  // variação nos últimos 30 dias: do primeiro registro da janela até o mais recente
  const janela = serie.filter((p) => p.data >= addDias(dia, -30));
  const primeiro = janela[0];
  const dif = ultimo && primeiro && primeiro.data !== ultimo.data ? Math.round((ultimo.kg - primeiro.kg) * 10) / 10 : null;
  const rumoCerto = dif !== null && meta !== undefined && ultimo ? Math.abs(ultimo.kg - meta) < Math.abs(ultimo.kg - dif - meta) : null;
  const grafico = serie.filter((p) => p.data >= addDias(dia, -SEMANAS * 7));
  const pontos = grafico.length >= 2 ? grafico : serie.slice(-12);
  const lista = [...weights].sort((a, b) => (a.data < b.data ? 1 : a.data > b.data ? -1 : 0)).slice(0, 5);
  const falta = ultimo && meta !== undefined ? Math.round((ultimo.kg - meta) * 10) / 10 : null;

  return (
    <Card
      area="peso"
      title="Peso"
      action={
        <Button size="sm" icon="mais" onClick={abrirNovo}>
          Registrar peso
        </Button>
      }
    >
      {!ultimo ? (
        <Empty
          icon="balanca"
          title="Nenhum peso registrado"
          text="Pese-se de manhã, sempre nas mesmas condições. Com dois registros o gráfico já mostra a tendência."
        />
      ) : (
        <>
          <div class="pr-peso">
            <div class="pr-peso-atual">
              <span class="ui-val num">
                {num(ultimo.kg, 1)}
                <small>kg</small>
              </span>
              <span class="ui-note">{fmtRelativa(ultimo.data, dia)}</span>
            </div>
            <div class="pr-peso-fatos">
              {dif !== null ? (
                <Pill tone={dif === 0 || rumoCerto === null ? 'muted' : rumoCerto ? 'good' : 'warn'} icon={false}>
                  {dif === 0 ? 'estável' : `${dif > 0 ? '+' : '−'}${num(Math.abs(dif), 1)} kg`} em 30 dias
                </Pill>
              ) : null}
              {meta !== undefined ? (
                <span class="ui-note num">
                  Meta <b>{kg(meta)}</b>
                  {falta !== null && falta !== 0 ? ` · ${falta > 0 ? 'faltam' : 'abaixo'} ${num(Math.abs(falta), 1)} kg` : falta === 0 ? ' · na meta' : ''}
                </span>
              ) : (
                <span class="ui-note">Defina a meta de peso em Ajustes.</span>
              )}
            </div>
          </div>
          <div class="pr-chart">
            <LineChart
              series={[
                { points: pontos.map((p) => ({ x: p.data, y: p.kg })), tone: 'peso', area: true, label: 'Peso' },
                { points: pontos.map((p) => ({ x: p.data, y: p.media })), tone: 'muted', dashed: true, label: 'Média de 7 registros' },
              ]}
              target={meta}
              height={170}
              yFormat={(v) => num(v, 1)}
            />
          </div>
          <div class="pr-sub">
            <div class="pr-sub-head">
              <h4 class="ui-eyebrow">Últimos registros</h4>
              <span class="ui-note">toque para corrigir</span>
            </div>
            <List>
              {lista.map((w) => (
                <Row key={w.id} title={fmtData(w.data)} sub={w.obs || undefined} right={<>{num(w.kg, 1)}<small>kg</small></>} onClick={() => abrirEdicao(w)} />
              ))}
            </List>
          </div>
        </>
      )}

      <Sheet
        open={form.aberto}
        onClose={fechar}
        title={apagar ? 'Apagar este registro?' : form.original ? 'Corrigir peso' : 'Registrar peso'}
        footer={
          apagar ? (
            <>
              <Button onClick={() => setApagar(false)}>Cancelar</Button>
              <Button variant="danger" icon="lixeira" onClick={confirmarApagar}>
                Apagar
              </Button>
            </>
          ) : (
            <>
              <Button onClick={fechar}>Cancelar</Button>
              <Button variant="primary" icon="check" onClick={salvar}>
                Salvar
              </Button>
            </>
          )
        }
      >
        {apagar && form.original ? (
          <p class="ui-muted">
            O peso de {fmtData(form.original.data)} ({kg(form.original.kg)}) sai do gráfico e da lista.
          </p>
        ) : (
          <div class="ui-form">
            <Stepper big label="Peso" unit="kg" step={0.1} min={30} max={250} value={form.valor} format={(v) => num(v, 1)} onChange={(valor) => setForm((f) => ({ ...f, valor }))} />
            <Field label="Data">
              <DateInput value={form.data} max={dia} onChange={(data) => setForm((f) => ({ ...f, data }))} />
            </Field>
            <Field label="Observação" hint="Opcional: depois do treino, em jejum…">
              <TextInput value={form.obs} maxLength={80} onChange={(obs) => setForm((f) => ({ ...f, obs }))} />
            </Field>
            {form.original ? (
              <Button variant="ghost" icon="lixeira" onClick={() => setApagar(true)}>
                Apagar este registro
              </Button>
            ) : null}
          </div>
        )}
      </Sheet>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/* Mobilidade                                                          */
/* ------------------------------------------------------------------ */

function Mobilidade({ state, dia, desde }: { state: AppState; dia: ISODate; desde: ISODate }) {
  const semanas = mobPorSemana(state.mob, SEMANAS, dia);
  const noPeriodo = state.mob.filter((m) => m.data >= desde && m.data <= dia);
  const atual = inicioSemana(dia);
  const minSemana = semanas[semanas.length - 1]?.min ?? 0;
  const total = Math.round(noPeriodo.reduce((s, m) => s + m.seg, 0) / 60);
  return (
    <Card area="mob" title="Mobilidade" action={<a class="ui-link" href="#/mobilidade">ver rotinas</a>}>
      {noPeriodo.length === 0 ? (
        <Empty
          icon="mobilidade"
          title="Nenhuma rotina nas últimas 12 semanas"
          text="Alongamento, educativos, core e pés contam aqui. Oito minutos depois da corrida já fazem diferença."
        />
      ) : (
        <>
          <StatRow>
            <Stat label="Na semana" value={String(minSemana)} unit="min" />
            <Stat label="Rotinas" value={String(noPeriodo.length)} sub="em 12 semanas" />
            <Stat label="Total" value={total >= 60 ? num(total / 60, 1) : String(total)} unit={total >= 60 ? 'h' : 'min'} sub="em 12 semanas" />
          </StatRow>
          <div class="pr-chart">
            <div class="pr-chart-lab">Minutos por semana</div>
            <Bars data={semanas.map((s) => ({ label: fmtDiaMes(s.semana), value: s.min, highlight: s.semana === atual }))} unit="min" tone="mob" height={130} />
          </div>
        </>
      )}
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/* Resumo para o treinador                                             */
/* ------------------------------------------------------------------ */

async function copiarResumo(state: AppState, dia: ISODate): Promise<void> {
  const ok = await copiar(resumoParaTreinador(state, 14, dia));
  if (ok) toast('Resumo copiado. Agora é só colar na conversa.', { tone: 'ok' });
  else toast('Não deu para copiar. Abra "ver o texto" e copie à mão.', { tone: 'erro', ms: 4000 });
}

function Resumo({ state, dia }: { state: AppState; dia: ISODate }) {
  const [aberto, setAberto] = useState(false);
  const texto = resumoParaTreinador(state, 14, dia);
  return (
    <Card title="Resumo para o treinador" class="pr-resumo">
      <p class="ui-muted">
        As últimas 2 semanas em texto: corridas com PSE, sensação e notas, musculação, mobilidade e peso. Copie e cole na conversa com o treinador.
      </p>
      <Button variant="primary" block icon="copiar" class="ui-mt" onClick={() => void copiarResumo(state, dia)}>
        Copiar resumo
      </Button>
      <div class="pr-resumo-ver">
        <button type="button" class="ui-link" aria-expanded={aberto} onClick={() => setAberto(!aberto)}>
          {aberto ? 'esconder o texto' : 'ver o texto'}
        </button>
      </div>
      {aberto ? <pre class="pr-resumo-txt">{texto}</pre> : null}
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/* Tela                                                                */
/* ------------------------------------------------------------------ */

export function ProgressoScreen() {
  const state = useStore((s) => s);
  const dia = hoje();
  const desde = ultimasSemanas(SEMANAS, dia)[0] ?? addDias(dia, -SEMANAS * 7);
  const vazio = state.runs.length === 0 && state.lifts.length === 0 && state.weights.length === 0 && state.mob.length === 0;
  return (
    <Screen
      eyebrow="Últimas 12 semanas"
      title="Progresso"
      actions={<IconButton icon="copiar" label="Copiar resumo para o treinador" onClick={() => void copiarResumo(state, dia)} />}
    >
      <div class="pr-pilha">
        {vazio ? (
          <div class="ui-banner is-accent">
            <Icon name="progresso" size={18} />
            <span class="ui-grow">Aqui você acompanha a constância, a corrida, a força e o peso. Cada treino registrado preenche esta tela.</span>
          </div>
        ) : null}
        <Consistencia state={state} dia={dia} />
        <Corrida state={state} dia={dia} desde={desde} />
        <Forca state={state} dia={dia} desde={desde} />
        <Peso state={state} dia={dia} />
        <Mobilidade state={state} dia={dia} desde={desde} />
        <Resumo state={state} dia={dia} />
      </div>
    </Screen>
  );
}
