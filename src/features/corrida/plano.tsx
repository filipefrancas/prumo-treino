/* Corrida (#/corrida): Plano, Histórico e Zonas. */
import { useState } from 'preact/hooks';
import { ROTEIRO_CORRIDA, etapaAtual } from '../../data/coach.ts';
import { PROFILE } from '../../data/profile.ts';
import { ALL_RUNS, RUN_PLAN, runById } from '../../data/runs.ts';
import { planejadoPorSemana, porSemana, recordes, semanaDoPlano, situacaoDoTreino, totais, type Situacao } from '../../lib/corrida.ts';
import { DIAS_CURTOS, addDias, diaSemana, diffDias, fmtData, fmtDiaMes, fromISO, hoje, inicioSemana } from '../../lib/dates.ts';
import { fmtDur, fmtMin, fmtPace, num, pace, plural } from '../../lib/format.ts';
import { go, useRoute } from '../../lib/router.ts';
import { useStore } from '../../lib/store.ts';
import type { AppState, HrZone, ISODate, RunLog, RunWeek, RunWorkout, ZoneId } from '../../types.ts';
import {
  Bars,
  Button,
  Card,
  Empty,
  Icon,
  IntensityChart,
  Legend,
  List,
  Pill,
  ProgressBar,
  Row,
  Screen,
  Section,
  Segmented,
  Stat,
  StatRow,
} from '../../ui/index.ts';
import { SEMANAS_DO_BLOCO, SituacaoPill, dataComAno, fatosDoLog, rotuloDaSemana } from './comum.tsx';
import { RegistroSheet } from './registro.tsx';

type Parte = 'plano' | 'historico' | 'zonas';
const PARTES: { v: Parte; l: string }[] = [
  { v: 'plano', l: 'Plano' },
  { v: 'historico', l: 'Histórico' },
  { v: 'zonas', l: 'Zonas' },
];
const ehParte = (v: string | undefined): v is Parte => v === 'plano' || v === 'historico' || v === 'zonas';

/* ------------------------------------------------------------------ */
/* Plano                                                               */
/* ------------------------------------------------------------------ */

function Treino({ w, situacao }: { w: RunWorkout; situacao: Situacao }) {
  const d = fromISO(w.date);
  return (
    <a class={`co-treino${situacao === 'pulado' ? ' is-pulado' : ''}`} href={`#/corrida/treino/${w.id}`}>
      <span class="co-treino-dia">
        <span class="ui-tag">{DIAS_CURTOS[diaSemana(w.date)]}</span>
        <b class="num">{d.getDate()}</b>
      </span>
      <span class="co-treino-main">
        <span class="co-treino-t">{w.title}</span>
        <span class="co-treino-s">
          <span class="num">{w.minutes} min</span>
          <SituacaoPill situacao={situacao} />
        </span>
      </span>
      <span class="co-treino-graf">
        <IntensityChart blocks={w.blocks} compact height={30} label={`Perfil do treino ${w.title}`} />
      </span>
      <Icon name="avancar" size={16} class="co-treino-chev" />
    </a>
  );
}

function Semana({ wk, state, dia, aberta, onToggle }: { wk: RunWeek; state: AppState; dia: ISODate; aberta: boolean; onToggle: () => void }) {
  const fim = addDias(wk.start, 6);
  const atual = dia >= wk.start && dia <= fim;
  const situacoes = wk.workouts.map((w) => situacaoDoTreino(state, w, dia));
  const feitos = situacoes.filter((s) => s === 'feito').length;
  const minutos = wk.workouts.reduce((t, w) => t + w.minutes, 0);
  const corpo = `co-sem-${wk.index}`;
  return (
    <div class={`co-sem${atual ? ' is-atual' : ''}${aberta ? ' is-aberta' : ''}`}>
      <button type="button" class="co-sem-head" aria-expanded={aberta} aria-controls={corpo} onClick={onToggle}>
        <span class="co-sem-n num" aria-hidden="true">
          {wk.index > 0 ? wk.index : '0'}
        </span>
        <span class="co-sem-main">
          <span class="ui-tag">
            <span class="sr-only">{wk.index > 0 ? `Semana ${wk.index}, ` : ''}</span>
            {fmtDiaMes(wk.start)} a {fmtDiaMes(fim)}
            {atual ? ' · esta semana' : wk.index === 0 ? ' · antes do bloco' : ''}
          </span>
          <span class="co-sem-t">{wk.theme}</span>
          <span class="co-sem-s num">
            {plural(wk.workouts.length, 'treino', 'treinos')} · {fmtMin(minutos)}
            {feitos > 0 ? ` · ${feitos === wk.workouts.length ? 'todos feitos' : plural(feitos, 'feito', 'feitos')}` : ''}
          </span>
        </span>
        <Icon name="avancar" size={18} class="co-sem-chev" />
      </button>
      {aberta ? (
        <div class="co-sem-body" id={corpo}>
          <p class="co-recado">{wk.note}</p>
          <div class="co-treinos">
            {wk.workouts.map((w, i) => (
              <Treino key={w.id} w={w} situacao={situacoes[i] ?? 'futuro'} />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function Roteiro({ dia }: { dia: ISODate }) {
  const atual = etapaAtual(dia);
  return (
    <ol class="co-roteiro">
      {ROTEIRO_CORRIDA.map((e) => {
        const ehAtual = atual?.id === e.id;
        const passou = e.fim < dia;
        return (
          <li key={e.id} class={`co-etapa${ehAtual ? ' is-atual' : ''}${passou ? ' is-passada' : ''}`} aria-current={ehAtual ? 'step' : undefined}>
            <i class="co-etapa-pt" aria-hidden="true" />
            <div class="co-etapa-head">
              <b class="co-etapa-t">{e.nome}</b>
              {ehAtual ? <Pill tone="accent">você está aqui</Pill> : passou ? <Pill tone="good">concluída</Pill> : null}
            </div>
            <span class="ui-tag">{e.quando}</span>
            <p class="co-etapa-meta">
              <Icon name="alvo" size={14} />
              <span>
                Longo: <b>{e.longo}</b>
              </span>
            </p>
            <p class="co-etapa-p">{e.resumo}</p>
          </li>
        );
      })}
    </ol>
  );
}

function Plano() {
  const state = useStore((s) => s);
  const dia = hoje();
  const semanaAtual = semanaDoPlano(dia);
  const antes = dia < RUN_PLAN.start;
  const depois = dia > RUN_PLAN.end;
  const [abertas, setAbertas] = useState<Record<number, boolean>>(() => {
    const i = semanaAtual?.index ?? (antes ? 0 : -1);
    return i >= 0 ? { [i]: true } : {};
  });

  const n = SEMANAS_DO_BLOCO;
  // O bloco conta a partir da primeira semana de índice 1; a de índice 0 fica "antes do bloco".
  const inicioBloco = RUN_PLAN.weeks.find((wk) => wk.index > 0)?.start ?? RUN_PLAN.start;
  const diasTotais = diffDias(inicioBloco, RUN_PLAN.end) + 1;
  const progresso = antes || dia < inicioBloco ? 0 : depois ? 1 : (diffDias(inicioBloco, dia) + 1) / diasTotais;
  const situacoes = ALL_RUNS.map((w) => situacaoDoTreino(state, w, dia));
  const feitos = situacoes.filter((s) => s === 'feito').length;

  const planejado = planejadoPorSemana();
  const feitoPorSemana = new Map<ISODate, number>();
  for (const r of state.runs) {
    const seg = inicioSemana(r.data);
    feitoPorSemana.set(seg, (feitoPorSemana.get(seg) ?? 0) + (r.min ?? 0));
  }
  const barras = planejado.map((p) => ({
    label: fmtDiaMes(p.semana),
    value: p.min,
    value2: p.semana <= dia ? Math.round(feitoPorSemana.get(p.semana) ?? 0) : 0,
    highlight: semanaAtual?.start === p.semana,
  }));
  const planejadoAtual = semanaAtual ? planejado.find((p) => p.semana === semanaAtual.start) : undefined;
  const feitoAtual = semanaAtual ? Math.round(feitoPorSemana.get(semanaAtual.start) ?? 0) : 0;

  return (
    <>
      <Card
        area="corrida"
        eyebrow={`${fmtData(inicioBloco).slice(4)} a ${fmtData(RUN_PLAN.end).slice(4)}`}
        title={RUN_PLAN.name}
        action={
          semanaAtual ? (
            <Pill tone="corrida">{rotuloDaSemana(semanaAtual.index)}</Pill>
          ) : (
            <Pill tone={depois ? 'good' : 'muted'}>{depois ? 'concluído' : `começa ${fmtData(RUN_PLAN.start)}`}</Pill>
          )
        }
      >
        <p class="co-objetivo">{RUN_PLAN.goal}</p>
        <ProgressBar class="ui-mt" value={progresso} tone="corrida" label={semanaAtual && semanaAtual.index > 0 ? `Semana ${semanaAtual.index} de ${n} do bloco` : 'Andamento do bloco'} />
        <div class="co-bloco-pe num">
          <span>
            <b>{feitos}</b> de {ALL_RUNS.length} treinos feitos
          </span>
          <span>{depois ? 'bloco encerrado' : antes ? `${n} semanas` : plural(Math.max(0, diffDias(dia, RUN_PLAN.end)), 'dia restante', 'dias restantes')}</span>
        </div>
      </Card>

      <Section title="Semanas">
        <div class="co-semanas">
          {RUN_PLAN.weeks.map((wk) => (
            <Semana
              key={wk.index}
              wk={wk}
              state={state}
              dia={dia}
              aberta={abertas[wk.index] === true}
              onToggle={() => setAbertas((a) => ({ ...a, [wk.index]: !a[wk.index] }))}
            />
          ))}
        </div>
      </Section>

      <Section title="Minutos por semana">
        <Card>
          <div class="co-graf-head">
            <Legend
              items={[
                { label: 'Planejado', tone: 'corrida', kind: 'soft' },
                { label: 'Feito', tone: 'corrida', kind: 'box' },
              ]}
            />
            {planejadoAtual ? (
              <span class="ui-note num">
                esta semana: <b>{feitoAtual}</b> de {planejadoAtual.min} min
              </span>
            ) : null}
          </div>
          <Bars data={barras} unit="min" tone="corrida" height={150} ariaLabel="Minutos de corrida planejados e feitos em cada semana do bloco" />
        </Card>
      </Section>

      <Section title="Roteiro do treinador">
        <p class="ui-muted co-roteiro-intro">Do retorno aos longos de 15 a 18 km, e aos 21 km quando você estiver bem.</p>
        <Roteiro dia={dia} />
      </Section>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Histórico                                                           */
/* ------------------------------------------------------------------ */

type Periodo = '4s' | '3m' | '12m' | 'tudo';
const PERIODOS: { v: Periodo; l: string }[] = [
  { v: '4s', l: '4 semanas' },
  { v: '3m', l: '3 meses' },
  { v: '12m', l: '12 meses' },
  { v: 'tudo', l: 'Tudo' },
];
const SEMANAS: Record<Exclude<Periodo, 'tudo'>, number> = { '4s': 4, '3m': 13, '12m': 52 };
const LISTA_INICIAL = 12;

/** Tempo de prova a partir de minutos: "27:40", "1:58:12". */
const tempo = (min: number | undefined): string => (min === undefined ? '—' : fmtDur(min * 60));

function Historico() {
  const runs = useStore((s) => s.runs);
  const [periodo, setPeriodo] = useState<Periodo>('3m');
  const [todas, setTodas] = useState(false);
  const [editando, setEditando] = useState<RunLog | undefined>(undefined);
  const [folha, setFolha] = useState(false);
  const dia = hoje();

  const abrir = (r: RunLog | undefined): void => {
    setEditando(r);
    setFolha(true);
  };
  const sheet = (
    <RegistroSheet open={folha} onClose={() => setFolha(false)} log={editando} treino={editando?.treinoId ? runById(editando.treinoId) : undefined} />
  );

  if (runs.length === 0) {
    return (
      <>
        <Empty
          icon="corrida"
          title="Nenhuma corrida registrada"
          text="Registre a corrida de hoje aqui, ou traga as corridas antigas em Ajustes › Dados › Importar histórico."
          action={
            <Button size="sm" icon="ajustes" href="/ajustes">
              Abrir Ajustes
            </Button>
          }
        />
        <Button icon="mais" block onClick={() => abrir(undefined)}>
          Adicionar corrida
        </Button>
        {sheet}
      </>
    );
  }

  const ordenadas = [...runs].sort((a, b) => (a.data < b.data ? 1 : a.data > b.data ? -1 : 0));
  const primeira = ordenadas[ordenadas.length - 1]?.data ?? dia;
  const semanas = periodo === 'tudo' ? Math.min(104, Math.max(4, Math.floor(diffDias(inicioSemana(primeira), inicioSemana(dia)) / 7) + 1)) : SEMANAS[periodo];
  const desde = periodo === 'tudo' ? undefined : addDias(inicioSemana(dia), -7 * (semanas - 1));
  const noPeriodo = desde ? ordenadas.filter((r) => r.data >= desde) : ordenadas;
  const t = totais(runs, desde);
  const porSem = porSemana(runs, semanas, dia);
  const rec = recordes(runs);
  const visiveis = todas ? noPeriodo : noPeriodo.slice(0, LISTA_INICIAL);
  const ritmoMedio = pace(t.km, noPeriodo.reduce((m, r) => m + (r.km !== undefined ? (r.min ?? 0) : 0), 0));

  const linhasRecorde: { rotulo: string; log: RunLog; valor: string; unidade?: string; sub: string }[] = [];
  if (rec.maisLonga) {
    const r = rec.maisLonga;
    linhasRecorde.push(
      r.km !== undefined
        ? { rotulo: 'Corrida mais longa', log: r, valor: num(r.km, 1), unidade: 'km', sub: `${dataComAno(r.data)} · ${fmtMin(r.min ?? 0)}` }
        : { rotulo: 'Corrida mais longa', log: r, valor: fmtMin(r.min ?? 0), sub: dataComAno(r.data) },
    );
  }
  const melhores: [string, RunLog | undefined][] = [
    ['Melhor 5 km', rec.melhor5k],
    ['Melhor 10 km', rec.melhor10k],
    ['Melhor 21 km', rec.melhor21k],
  ];
  for (const [rotulo, r] of melhores) {
    if (r) linhasRecorde.push({ rotulo, log: r, valor: tempo(r.min), sub: `${dataComAno(r.data)} · ${fmtPace(pace(r.km, r.min))}` });
  }

  return (
    <>
      <div class="co-periodo">
        <Segmented size="sm" label="Período" value={periodo} onChange={(v) => { setPeriodo(v); setTodas(false); }} options={PERIODOS} />
      </div>

      <StatRow>
        <Stat label="Corridas" tone="corrida" value={num(t.n, 0)} />
        <Stat label="Distância" value={num(t.km, t.km >= 100 ? 0 : 1)} unit="km" sub={ritmoMedio !== undefined ? fmtPace(ritmoMedio) : undefined} />
        <Stat label="Tempo" value={t.min >= 60 ? num(t.min / 60, 1) : num(t.min, 0)} unit={t.min >= 60 ? 'h' : 'min'} />
      </StatRow>

      <Section title="Minutos por semana">
        <Card>
          <Bars
            data={porSem.map((s, i) => ({ label: fmtDiaMes(s.semana), value: Math.round(s.min), highlight: i === porSem.length - 1 }))}
            unit="min"
            tone="corrida"
            height={150}
          />
        </Card>
      </Section>

      {linhasRecorde.length ? (
        <Section title="Recordes">
          <Card>
            <List>
              {linhasRecorde.map((l) => (
                <Row
                  key={l.rotulo}
                  leading={<Icon name="trofeu" />}
                  title={l.rotulo}
                  sub={l.sub}
                  tone="accent"
                  right={
                    <>
                      {l.valor}
                      {l.unidade ? <small>{l.unidade}</small> : null}
                    </>
                  }
                />
              ))}
            </List>
          </Card>
        </Section>
      ) : null}

      <Section
        title={`Registros · ${noPeriodo.length}`}
        action={
          <button type="button" class="ui-link" onClick={() => abrir(undefined)}>
            adicionar corrida
          </button>
        }
      >
        {noPeriodo.length === 0 ? (
          <Empty icon="corrida" title="Nenhuma corrida neste período" text="Escolha um período maior ou registre a corrida de hoje." />
        ) : (
          <Card>
            <List>
              {visiveis.map((r) => (
                <Row
                  key={r.id}
                  title={r.titulo ?? (r.tipo === 'Longão' ? 'Longo' : r.tipo)}
                  sub={`${dataComAno(r.data, dia)}${fatosDoLog(r, { km: false }) ? ` · ${fatosDoLog(r, { km: false })}` : ''}`}
                  right={
                    r.km !== undefined ? (
                      <>
                        {num(r.km, 1)}
                        <small>km</small>
                      </>
                    ) : undefined
                  }
                  onClick={() => abrir(r)}
                />
              ))}
            </List>
            {noPeriodo.length > visiveis.length ? (
              <Button variant="ghost" size="sm" block class="ui-mt-sm" onClick={() => setTodas(true)}>
                Ver todas as {noPeriodo.length}
              </Button>
            ) : null}
          </Card>
        )}
        <Button icon="mais" block onClick={() => abrir(undefined)}>
          Adicionar corrida
        </Button>
      </Section>
      {sheet}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Zonas                                                               */
/* ------------------------------------------------------------------ */

const NIVEL_DA_ZONA: Record<ZoneId, number> = { leve: 2, continuo: 3, moderado: 4, forte: 5 };

const PSE: { faixa: string; nome: string; texto: string; nivel: number }[] = [
  { faixa: '1 a 2', nome: 'Muito leve', texto: 'Caminhada ou trote solto. Dá para cantar.', nivel: 1 },
  { faixa: '3 a 4', nome: 'Leve', texto: 'Conversa em frases inteiras. É o ritmo dos regenerativos.', nivel: 2 },
  { faixa: '5 a 6', nome: 'Moderado', texto: 'Frases curtas, respiração marcada. Os longos ficam entre 4 e 6.', nivel: 3 },
  { faixa: '7 a 8', nome: 'Forte', texto: 'Só palavras soltas. Difícil, mas controlado: os trechos fortes do fartlek e do intervalado.', nivel: 4 },
  { faixa: '9 a 10', nome: 'Máximo', texto: 'Tiro de tudo ou nada. Não entra neste bloco.', nivel: 5 },
];

function Zona({ z, fcMax, piso }: { z: HrZone; fcMax: number; piso: number }) {
  const faixa = Math.max(1, fcMax - piso);
  const esq = Math.min(100, Math.max(0, ((z.min - piso) / faixa) * 100));
  const larg = Math.min(100 - esq, Math.max(2, ((z.max - z.min) / faixa) * 100));
  return (
    <li class="co-zona" style={{ '--co-lv': `var(--lv-${NIVEL_DA_ZONA[z.id] ?? 3})` }}>
      <div class="co-zona-head">
        <b class="co-zona-t">
          <i aria-hidden="true" />
          {z.label}
        </b>
        <span class="co-zona-bpm num">
          {z.min} a {z.max}
          <small>bpm</small>
        </span>
      </div>
      <div class="co-zona-trilho" aria-hidden="true">
        <i style={{ left: `${esq.toFixed(1)}%`, width: `${larg.toFixed(1)}%` }} />
      </div>
      <p class="co-zona-p">
        {z.feel}{' '}
        <span class="num">
          {Math.round((z.min / fcMax) * 100)} a {Math.round((z.max / fcMax) * 100)}% da máxima.
        </span>
      </p>
    </li>
  );
}

function Zonas() {
  const zonas = useStore((s) => s.settings.zonas);
  const fcMax = useStore((s) => s.settings.fcMax);
  const piso = Math.min(110, ...zonas.map((z) => z.min - 10));
  return (
    <>
      <Section
        title="Frequência cardíaca"
        action={
          <a class="ui-link" href="#/ajustes">
            editar em Ajustes
          </a>
        }
      >
        <Card>
          <div class="co-fcmax">
            <span class="ui-val num">
              {fcMax}
              <small>bpm</small>
            </span>
            <span class="ui-note">
              <b>FC máxima.</b> As faixas abaixo são as mesmas dos treinos que estão no relógio.
            </span>
          </div>
          <ul class="co-zonas">
            {zonas.map((z) => (
              <Zona key={z.id} z={z} fcMax={fcMax} piso={piso} />
            ))}
          </ul>
          <div class="co-zona-eixo num" aria-hidden="true">
            <span>{piso}</span>
            <span>{fcMax} bpm</span>
          </div>
        </Card>
        <p class="ui-note">As faixas se sobrepõem de propósito: cada treino usa uma só, e a regra é ficar dentro dela, não no teto.</p>
      </Section>

      <Section title="Esforço percebido (PSE)">
        <Card>
          <p class="ui-muted">Nota de 1 a 10 para o quanto o esforço pesa. É por ela que você corre os longos e os trechos fortes, e é ela que você registra depois de cada corrida.</p>
          <ul class="co-pse">
            {PSE.map((p) => (
              <li key={p.faixa} style={{ '--co-lv': `var(--lv-${p.nivel})` }}>
                <span class="co-pse-n num">{p.faixa}</span>
                <span class="co-pse-main">
                  <b>{p.nome}</b>
                  <span>{p.texto}</span>
                </span>
              </li>
            ))}
          </ul>
        </Card>
      </Section>

      <Section title="No relógio">
        <Card>
          <ol class="co-relogio">
            <li>
              <b>Os treinos já estão no {PROFILE.watch}.</b> Eles foram agendados no Garmin Connect com os mesmos passos e alvos que aparecem aqui.
            </li>
            <li>
              <b>No dia, abra Corrida.</b> O relógio oferece o treino de hoje: aceite e ele conduz passo a passo, vibrando a cada troca.
            </li>
            <li>
              <b>Passo com alvo de FC:</b> o relógio avisa quando a frequência sai da faixa. Acima do teto, diminua o passo ou caminhe até ela voltar.
            </li>
            <li>
              <b>Passo por PSE ou livre:</b> o relógio só conta o tempo. Ignore o ritmo na tela e vá pela sensação.
            </li>
          </ol>
        </Card>
        <p class="ui-note">Sem o relógio ou na esteira, abra o treino e use a corrida guiada pelo celular.</p>
      </Section>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Tela                                                                */
/* ------------------------------------------------------------------ */

export function CorridaScreen() {
  const rota = useRoute();
  const parte: Parte = ehParte(rota.query.parte) ? rota.query.parte : 'plano';
  const semana = semanaDoPlano(hoje());
  const eyebrow = semana ? `${RUN_PLAN.name} · ${rotuloDaSemana(semana.index)}` : RUN_PLAN.name;
  return (
    <Screen eyebrow={eyebrow} title="Corrida">
      <Segmented label="Parte" value={parte} onChange={(v) => go(v === 'plano' ? '/corrida' : `/corrida?parte=${v}`, { replace: true })} options={PARTES} />
      {parte === 'plano' ? <Plano /> : parte === 'historico' ? <Historico /> : <Zonas />}
    </Screen>
  );
}

