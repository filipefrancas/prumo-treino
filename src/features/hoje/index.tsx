/* Hoje (SPEC 8.1): o treino do dia com um toque para começar, a semana e os atalhos. */
import { Fragment } from 'preact';
import { useState } from 'preact/hooks';
import { routineById } from '../../data/routines.ts';
import { RUN_PLAN } from '../../data/runs.ts';
import {
  contaComoFeito,
  duracaoDoLift,
  ehPrincipal,
  fichaPorLetra,
  seriesFeitas,
  seriesPlanejadas,
  sessaoAberta,
  totalSeriesDeTrabalho,
  volumeDoLift,
} from '../../lib/academia.ts';
import { logDoTreino, semanaDoPlano, type Situacao } from '../../lib/corrida.ts';
import { DIAS_LETRA, diaSemana, fmtData, fmtRelativa, fromISO, hoje, saudacao } from '../../lib/dates.ts';
import { useAgora } from '../../lib/feedback.ts';
import { copiar } from '../../lib/files.ts';
import { fmtMin, kg, num, plural } from '../../lib/format.ts';
import { agendaDaSemana, resumoDaSemana, type ItemDoDia } from '../../lib/plano.ts';
import { resumoParaTreinador } from '../../lib/progresso.ts';
import { useStore } from '../../lib/store.ts';
import type { AppState, Ficha, ISODate, Lift, RunFamily, RunWorkout } from '../../types.ts';
import {
  Button,
  Card,
  ExMedia,
  Icon,
  IconButton,
  IntensityChart,
  List,
  Pill,
  Ring,
  Row,
  Screen,
  Section,
  WeekStrip,
  toast,
  type PillTone,
  type WeekStripDay,
} from '../../ui/index.ts';
import { PesoSheet } from './PesoSheet.tsx';
import './hoje.css';

const FAMILIA: Record<RunFamily, string> = {
  regenerativo: 'Regenerativo',
  continuo: 'Contínuo',
  longo: 'Longo',
  fartlek: 'Fartlek',
  intervalado: 'Intervalado',
  progressivo: 'Progressivo',
  regressivo: 'Regressivo',
};

const SITUACAO: Record<Situacao, { texto: string; tone: PillTone }> = {
  feito: { texto: 'feito', tone: 'good' },
  pulado: { texto: 'pulado', tone: 'muted' },
  hoje: { texto: 'pendente', tone: 'warn' },
  perdido: { texto: 'não feito', tone: 'muted' },
  futuro: { texto: 'planejado', tone: 'muted' },
};

const ROTINA = {
  aquecimento: 'aquecimento-corrida',
  educativos: 'educativos-iniciante',
  posCorrida: 'pos-corrida',
  completo: 'alongamento-completo',
} as const;

const minutosDaRotina = (id: string): string => {
  const r = routineById(id);
  return r ? fmtMin(r.minutes) : '';
};

/** Tempo estimado da ficha: execução de cada série, descanso (o da ficha ou o padrão) e a troca de aparelho. */
function minutosEstimados(ficha: Ficha, descansoPadrao: number): number {
  let seg = 0;
  for (const ex of ficha.exercicios) {
    const principal = ehPrincipal(ex);
    for (const s of seriesPlanejadas(ex)) seg += (s.segundos ?? 40) + (principal ? (s.intervalo ?? descansoPadrao) : 15);
    seg += 45;
  }
  return Math.max(5, Math.round(seg / 60 / 5) * 5);
}

/** Minutos desde o início da sessão em andamento. */
function minutosDaSessao(l: Lift, agora: number): number | undefined {
  if (l.inicioMs === undefined) return undefined;
  const min = Math.floor((agora - l.inicioMs) / 60000);
  return min >= 0 && min < 24 * 60 ? min : undefined;
}

function tituloDoDia(data: ISODate, ref: ISODate): string {
  if (data === ref) return 'Hoje';
  const rel = fmtRelativa(data, ref);
  const longa = fmtData(data, 'longa');
  return rel === 'ontem' || rel === 'amanhã' ? `${rel} · ${fmtData(data)}` : longa;
}

/* ------------------------------------------------------------------ */
/* Cartões                                                             */
/* ------------------------------------------------------------------ */

interface CorridaCardProps {
  state: AppState;
  treino: RunWorkout;
  situacao: Situacao;
  primario: boolean;
}

function CorridaCard({ state, treino, situacao, primario }: CorridaCardProps) {
  const log = logDoTreino(state, treino.id);
  const sit = SITUACAO[situacao];
  const rota = `/corrida/treino/${treino.id}`;
  const fatos: string[] = [];
  if (log?.min !== undefined) fatos.push(fmtMin(Math.round(log.min)));
  if (log?.km !== undefined) fatos.push(`${num(log.km, 2)} km`);
  if (log?.pse !== undefined) fatos.push(`PSE ${log.pse}`);
  if (log?.fc !== undefined) fatos.push(`FC ${Math.round(log.fc)} bpm`);

  return (
    <Card area="corrida" eyebrow={`Corrida · ${FAMILIA[treino.family]}`} action={<Pill tone={sit.tone}>{sit.texto}</Pill>}>
      <div class="hj-topo">
        <div class="hj-topo-txt">
          <h3 class="hj-titulo">{treino.title}</h3>
          <p class="hj-sub">{treino.purpose}</p>
        </div>
        <div class="hj-min num" aria-label={`${treino.minutes} minutos`}>
          {treino.minutes}
          <small>min</small>
        </div>
      </div>
      <IntensityChart blocks={treino.blocks} compact class="hj-perfil" />
      <div class="ui-inline hj-selos">
        {treino.onWatch ? (
          <Pill tone="accent" icon="relogio">
            no relógio
          </Pill>
        ) : null}
        {fatos.length > 0 ? (
          <span class="ui-note">
            Registrado: <b>{fatos.join(' · ')}</b>
          </span>
        ) : situacao === 'feito' ? (
          <span class="ui-note">Marcado como feito, sem registro.</span>
        ) : null}
      </div>
      <div class="hj-acoes">
        <Button href={rota} icon="info">
          Ver treino
        </Button>
        {log ? (
          <Button href={rota} icon="editar">
            Ver registro
          </Button>
        ) : (
          <Button variant={primario ? 'primary' : 'soft'} href={`${rota}?registrar=1`} icon="check">
            Registrar
          </Button>
        )}
      </div>
    </Card>
  );
}

interface MuscCardProps {
  state: AppState;
  ficha: Ficha;
  data: ISODate;
  ehHoje: boolean;
  futuro: boolean;
  feito: boolean;
  aberta: Lift | undefined;
  agora: number;
}

function MuscCard({ state, ficha, data, ehHoje, futuro, feito, aberta, agora }: MuscCardProps) {
  const principais = ficha.exercicios.filter(ehPrincipal);
  const series = totalSeriesDeTrabalho(ficha);
  const estimado = minutosEstimados(ficha, state.settings.descansoPadrao);
  const lift = feito ? state.lifts.find((l) => l.data === data && contaComoFeito(l)) : undefined;
  const emAndamento = ehHoje && !feito && aberta !== undefined;
  const decorrido = aberta ? minutosDaSessao(aberta, agora) : undefined;

  const pill = feito ? (
    <Pill tone="good">feito</Pill>
  ) : emAndamento ? (
    <Pill tone="accent" icon="cronometro">
      em andamento
    </Pill>
  ) : ehHoje ? (
    <Pill tone="warn">pendente</Pill>
  ) : (
    <Pill>{futuro ? 'planejado' : 'não feito'}</Pill>
  );

  const fatos: string[] = [];
  if (lift) {
    const dur = duracaoDoLift(lift);
    if (dur !== null) fatos.push(fmtMin(Math.round(dur)));
    const volume = volumeDoLift(lift);
    if (volume > 0) fatos.push(`${Math.round(volume).toLocaleString('pt-BR')} kg de volume`);
    const n = seriesFeitas(lift);
    if (n > 0) fatos.push(plural(n, 'série', 'séries'));
  }

  return (
    <Card area="musc" eyebrow="Musculação" action={pill}>
      <div class="hj-ficha">
        <span class="hj-letra" aria-hidden="true">
          {ficha.id}
        </span>
        <div class="hj-topo-txt">
          <h3 class="hj-titulo">
            <span class="sr-only">Ficha {ficha.id}: </span>
            {ficha.nome}
          </h3>
          <p class="hj-sub">
            {plural(principais.length, 'exercício', 'exercícios')} · {plural(series, 'série', 'séries')} · cerca de {fmtMin(estimado)}
          </p>
        </div>
      </div>
      {principais.length > 0 ? (
        <ul class="hj-thumbs">
          {principais.slice(0, 3).map((ex) => (
            <li key={ex.id}>
              <ExMedia id={ex.anim} play="never" tone="musc" />
              <span>{ex.nome}</span>
            </li>
          ))}
        </ul>
      ) : null}
      {fatos.length > 0 ? (
        <p class="ui-note hj-feito">
          Treino feito: <b>{fatos.join(' · ')}</b>
        </p>
      ) : null}
      <div class="hj-acoes">
        {feito || !ehHoje ? (
          <Button href={`/musculacao/ficha/${ficha.id}`} icon="info">
            Ver ficha
          </Button>
        ) : emAndamento ? (
          <Button variant="primary" size="lg" icon="play" href="/musculacao/sessao">
            {decorrido !== undefined ? `Continuar treino · ${fmtMin(decorrido)}` : 'Continuar treino'}
          </Button>
        ) : (
          <Button variant="primary" size="lg" icon="play" href={`/musculacao/sessao?ficha=${encodeURIComponent(ficha.id)}`}>
            Começar treino
          </Button>
        )}
      </div>
      {ehHoje && !feito ? (
        <a class="ui-link hj-ver-ficha" href={`#/musculacao/ficha/${ficha.id}`}>
          ver a ficha antes
        </a>
      ) : null}
    </Card>
  );
}

function DescansoCard() {
  return (
    <Card eyebrow="Sem treino no plano" action={<Pill icon="descanso">descanso</Pill>}>
      <h3 class="hj-titulo">Descanso</h3>
      <p class="hj-sub">Dia de recuperar: é no descanso que o corpo absorve o treino. Se quiser se mexer, um alongamento leve cai bem.</p>
      <div class="hj-acoes">
        <Button href={`/mobilidade/rotina/${ROTINA.completo}`} icon="mobilidade">
          Alongamento completo · {minutosDaRotina(ROTINA.completo)}
        </Button>
      </div>
    </Card>
  );
}

function Sugestoes({ titulo, itens }: { titulo: string; itens: { id: string; nome: string; sub: string }[] }) {
  return (
    <Card flat area="mob" eyebrow={titulo} class="hj-sugestoes">
      <List>
        {itens.map((i) => (
          <Row
            key={i.id}
            leading={<Icon name="mobilidade" />}
            title={i.nome}
            sub={i.sub}
            right={<small class="hj-row-min">{minutosDaRotina(i.id)}</small>}
            href={`/mobilidade/rotina/${i.id}`}
          />
        ))}
      </List>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/* Tela                                                                */
/* ------------------------------------------------------------------ */

export function HojeScreen() {
  const state = useStore((s) => s);
  const agora = useAgora(30000);
  const dia = hoje();
  const [escolhido, setEscolhido] = useState<ISODate>(dia);
  const [pesoAberto, setPesoAberto] = useState(false);

  const semana = agendaDaSemana(state, dia);
  const sel = semana.some((d) => d.data === escolhido) ? escolhido : dia;
  const ehHoje = sel === dia;
  const itens: ItemDoDia[] = semana.find((d) => d.data === sel)?.itens ?? [];

  const dias: WeekStripDay[] = semana.map((d) => ({
    date: d.data,
    letter: DIAS_LETRA[diaSemana(d.data)] ?? '',
    num: fromISO(d.data).getDate(),
    marks: d.itens.map((i) => ({ tone: i.tipo, done: i.feito })),
    today: d.data === dia,
    selected: d.data === sel,
  }));

  const aberta = sessaoAberta(state.lifts);
  const itemMusc = itens.find((i) => i.tipo === 'musc');
  const muscPendenteHoje = ehHoje && itemMusc !== undefined && !itemMusc.feito;
  // A sessão em andamento aparece no cartão de musculação de hoje; fora dele, vira um aviso no topo.
  const avisoSessao = aberta !== undefined && !muscPendenteHoje;
  const fichaAberta = aberta ? fichaPorLetra(state.settings, aberta.ficha) : undefined;
  const decorrido = aberta ? minutosDaSessao(aberta, agora) : undefined;

  const resumo = resumoDaSemana(state, dia);
  const planCorridas = semana.reduce((n, d) => n + d.itens.filter((i) => i.tipo === 'corrida').length, 0);
  const planMusc = semana.reduce((n, d) => n + d.itens.filter((i) => i.tipo === 'musc').length, 0);
  const semanaPlano = semanaDoPlano(dia);
  const blocoConcluido = dia > RUN_PLAN.end;

  const ultimoPeso = state.weights.length > 0 ? state.weights[state.weights.length - 1] : undefined;
  const nome = state.settings.nome.trim();

  const copiarResumo = async (): Promise<void> => {
    const ok = await copiar(resumoParaTreinador(state));
    toast(ok ? 'Resumo copiado. Cole na conversa com o treinador.' : 'Não deu para copiar. Tente de novo.', { tone: ok ? 'ok' : 'erro' });
  };

  return (
    <Screen
      eyebrow={fmtData(dia)}
      title={nome ? `${saudacao(new Date(agora))}, ${nome}` : saudacao(new Date(agora))}
      actions={<IconButton icon="ajustes" label="Ajustes" href="/ajustes" />}
    >
      <WeekStrip days={dias} onSelect={setEscolhido} />

      {avisoSessao && aberta ? (
        <div class="ui-banner is-accent">
          <Icon name="cronometro" />
          <span class="ui-grow">
            <b>Treino em andamento</b>
            <br />
            Ficha {aberta.ficha}
            {fichaAberta ? ` · ${fichaAberta.nome}` : ''}
            {aberta.data !== dia ? ` · ${fmtRelativa(aberta.data, dia)}` : decorrido !== undefined ? ` · ${fmtMin(decorrido)}` : ''}
          </span>
          <Button size="sm" variant="primary" href="/musculacao/sessao">
            Continuar
          </Button>
        </div>
      ) : null}

      {blocoConcluido ? (
        <Card area="corrida" eyebrow={RUN_PLAN.name} action={<Pill tone="good">concluído</Pill>}>
          <h3 class="hj-titulo">Bloco concluído</h3>
          <p class="hj-sub">
            O plano de corrida terminou em {fmtData(RUN_PLAN.end, 'media')}. Mande o resumo das últimas semanas para o treinador montar o
            próximo bloco.
          </p>
          <div class="hj-acoes">
            <Button variant={avisoSessao || muscPendenteHoje ? 'soft' : 'primary'} icon="copiar" onClick={() => void copiarResumo()}>
              Copiar resumo para o treinador
            </Button>
          </div>
        </Card>
      ) : null}

      <Section
        title={tituloDoDia(sel, dia)}
        action={
          ehHoje ? null : (
            <button type="button" class="ui-link" onClick={() => setEscolhido(dia)}>
              voltar para hoje
            </button>
          )
        }
      >
        {itens.length === 0 ? <DescansoCard /> : null}
        {itens.map((item) => {
          if (item.tipo === 'corrida' && item.corrida) {
            const situacao = item.situacao ?? 'futuro';
            return (
              <Fragment key={item.corrida.id}>
                {ehHoje && situacao === 'hoje' ? (
                  <Sugestoes
                    titulo="Antes de correr"
                    itens={[
                      { id: ROTINA.aquecimento, nome: 'Aquecimento', sub: 'Solta quadril e tornozelo antes de sair.' },
                      { id: ROTINA.educativos, nome: 'Educativos', sub: 'Técnica de corrida, depois de aquecer.' },
                    ]}
                  />
                ) : null}
                <CorridaCard
                  state={state}
                  treino={item.corrida}
                  situacao={situacao}
                  primario={ehHoje && situacao === 'hoje' && !muscPendenteHoje && !avisoSessao}
                />
                {situacao === 'feito' ? (
                  <Sugestoes
                    titulo="Depois da corrida"
                    itens={[{ id: ROTINA.posCorrida, nome: 'Alongamento pós-corrida', sub: 'Com o corpo ainda quente.' }]}
                  />
                ) : null}
              </Fragment>
            );
          }
          if (item.tipo === 'musc' && item.ficha) {
            const ficha = muscPendenteHoje && fichaAberta ? fichaAberta : item.ficha;
            return (
              <MuscCard
                key={`musc-${ficha.id}`}
                state={state}
                ficha={ficha}
                data={sel}
                ehHoje={ehHoje}
                futuro={sel > dia}
                feito={item.feito}
                aberta={aberta}
                agora={agora}
              />
            );
          }
          return null;
        })}
      </Section>

      {semanaPlano ? (
        <Section title="Recado da semana">
          <Card
            eyebrow={semanaPlano.index > 0 ? `Semana ${semanaPlano.index} de ${RUN_PLAN.weeks.length - 1}` : 'Antes do bloco'}
            action={<Icon name="nota" />}
          >
            <h3 class="hj-titulo is-sm">{semanaPlano.theme}</h3>
            <p class="hj-recado">{semanaPlano.note}</p>
          </Card>
        </Section>
      ) : null}

      <Section title="Semana em números">
        <Card>
          <div class="hj-semana">
            <Ring
              value={resumo.planejados > 0 ? Math.min(1, resumo.feitos / resumo.planejados) : 0}
              size={116}
              tone={resumo.planejados > 0 && resumo.feitos >= resumo.planejados ? 'good' : 'accent'}
              ariaLabel={`${resumo.feitos} de ${plural(resumo.planejados, 'treino feito', 'treinos feitos')} na semana`}
            >
              <b class="num">
                {resumo.feitos}
                <i>/{resumo.planejados}</i>
              </b>
              <span>treinos</span>
            </Ring>
            <dl class="hj-nums">
              <div class="ui-area-corrida">
                <dt>
                  <i class="ui-dot" />
                  Corrida
                </dt>
                <dd class="num">
                  {resumo.corridas}
                  <small> de {planCorridas}</small>
                </dd>
              </div>
              <div class="ui-area-musc">
                <dt>
                  <i class="ui-dot" />
                  Musculação
                </dt>
                <dd class="num">
                  {resumo.musc}
                  <small> de {planMusc}</small>
                </dd>
              </div>
              <div class="ui-area-mob">
                <dt>
                  <i class="ui-dot" />
                  Mobilidade
                </dt>
                <dd class="num">
                  {resumo.mobMin}
                  <small> min</small>
                </dd>
              </div>
            </dl>
          </div>
        </Card>
      </Section>

      <Section title="Atalhos">
        <Card>
          <List>
            <Row
              leading={<Icon name="balanca" />}
              title="Registrar peso"
              sub={ultimoPeso ? `Último: ${fmtRelativa(ultimoPeso.data, dia)}` : 'Nenhum peso registrado ainda'}
              right={
                ultimoPeso ? (
                  <>
                    {kg(ultimoPeso.kg).replace(' kg', '')}
                    <small>kg</small>
                  </>
                ) : undefined
              }
              chevron
              onClick={() => setPesoAberto(true)}
            />
            <Row leading={<Icon name="mobilidade" />} title="Alongar" sub="Rotinas de alongamento, core e pés" href="/mobilidade" />
            <Row
              leading={<Icon name="corrida" />}
              title="Educativos"
              sub={`Técnica de corrida · ${minutosDaRotina(ROTINA.educativos)}`}
              href={`/mobilidade/rotina/${ROTINA.educativos}`}
            />
          </List>
        </Card>
      </Section>

      <PesoSheet open={pesoAberto} onClose={() => setPesoAberto(false)} />
    </Screen>
  );
}
