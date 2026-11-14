/* Musculação: biblioteca de exercícios (#/exercicios) e detalhe de um exercício do catálogo (#/exercicio/:id). */
import { useMemo, useState } from 'preact/hooks';
import { hasAnim } from '../../data/anim/_index.ts';
import { allExercises, exById, exName } from '../../data/ex/_index.ts';
import { METODO_ROTULO, e1rm, fichasAtivas, liftsFeitos, metodoTexto, programaAtivo } from '../../lib/academia.ts';
import { fmtData } from '../../lib/dates.ts';
import { num, plural } from '../../lib/format.ts';
import { useStore } from '../../lib/store.ts';
import type { Exercise, ExerciseKind, FichaExercicio, ISODate, Lift } from '../../types.ts';
import { Button, Card, Chips, Empty, ExMedia, IconButton, LineChart, List, Pill, Row, Screen, Section, Stat, StatRow, TextInput } from '../../ui/index.ts';
import { GRUPO_ROTULO, KIND_CURTO, KIND_ROTULO, Mini, alvoDoBloco, maiuscula, resumoDasSeries, semAcento, tomDoTipo } from './comum.tsx';

/* ------------------------------------------------------------------ */
/* #/exercicios                                                        */
/* ------------------------------------------------------------------ */

type Filtro = 'todos' | ExerciseKind;
const ORDEM: ExerciseKind[] = ['forca', 'core', 'aquecimento', 'alongamento', 'educativo', 'pes', 'liberacao'];

export function LibraryScreen() {
  const [busca, setBusca] = useState('');
  const [filtro, setFiltro] = useState<Filtro>('todos');
  const todos = useMemo(() => allExercises(), []);
  const tipos = ORDEM.filter((k) => todos.some((e) => e.kind === k));
  const termo = semAcento(busca.trim());
  const lista = todos.filter((e) => {
    if (filtro !== 'todos' && e.kind !== filtro) return false;
    if (!termo) return true;
    const texto = semAcento([e.name, ...(e.aka ?? []), ...e.muscles.primary, ...e.equipment, GRUPO_ROTULO[e.group]].join(' '));
    return termo.split(/\s+/).every((t) => texto.includes(t));
  });

  // Agrupa por tipo e, dentro do tipo, por grupo muscular.
  const grupos: { titulo: string; itens: Exercise[] }[] = [];
  for (const k of ORDEM) {
    const doTipo = lista.filter((e) => e.kind === k);
    const porGrupo = new Map<string, Exercise[]>();
    for (const e of doTipo) {
      const g = porGrupo.get(e.group);
      if (g) g.push(e);
      else porGrupo.set(e.group, [e]);
    }
    for (const [g, itens] of porGrupo) grupos.push({ titulo: `${KIND_CURTO[k]} · ${GRUPO_ROTULO[g as Exercise['group']]}`, itens });
  }

  return (
    <Screen title="Exercícios" eyebrow={plural(todos.length, 'exercício', 'exercícios')} back="/musculacao">
      <div class="ui-stack">
        <TextInput type="search" value={busca} onChange={setBusca} placeholder="Buscar por nome, músculo ou aparelho" aria-label="Buscar exercício" />
        <div class="mu-filtros">
          <Chips<Filtro>
            label="Tipo de exercício"
            value={filtro}
            onChange={setFiltro}
            options={[{ v: 'todos', l: 'Todos' }, ...tipos.map((k) => ({ v: k as Filtro, l: KIND_CURTO[k] }))]}
          />
        </div>
      </div>
      {lista.length === 0 ? (
        <Empty
          icon="buscar"
          title="Nenhum exercício encontrado"
          text="Tente outro nome ou tire o filtro de tipo."
          action={
            <Button size="sm" onClick={() => { setBusca(''); setFiltro('todos'); }}>
              Limpar a busca
            </Button>
          }
        />
      ) : (
        grupos.map((g) => (
          <Section key={g.titulo} title={g.titulo}>
            <Card>
              <List>
                {g.itens.map((e) => (
                  <Row
                    key={e.id}
                    leading={<Mini anim={e.id} tone={tomDoTipo(e.kind)} size="md" />}
                    title={e.name}
                    sub={[e.muscles.primary.slice(0, 2).join(', '), e.equipment.join(', ')].filter(Boolean).join(' · ')}
                    href={`/exercicio/${e.id}`}
                  />
                ))}
              </List>
            </Card>
          </Section>
        ))
      )}
    </Screen>
  );
}

/* ------------------------------------------------------------------ */
/* #/exercicio/:id                                                     */
/* ------------------------------------------------------------------ */

interface Sessao { data: ISODate; e1rm: number; cargaMax: number; repsMax: number; sets: { reps?: number; carga?: number }[] }

/** Sessões feitas em que algum dos exercícios de ficha dados teve série marcada (cronológicas). */
function sessoesDe(lifts: Lift[], exIds: string[]): Sessao[] {
  const out: Sessao[] = [];
  for (const l of liftsFeitos(lifts)) {
    const sets: { reps?: number; carga?: number }[] = [];
    for (const exId of exIds) {
      const m = l.sets?.[exId];
      if (!m) continue;
      for (const k of Object.keys(m).sort((a, b) => Number(a) - Number(b))) {
        const s = m[k];
        if (s?.feito) sets.push(s);
      }
    }
    if (sets.length === 0) continue;
    out.push({
      data: l.data, sets,
      e1rm: Math.max(0, ...sets.map((s) => e1rm(s.carga ?? 0, s.reps ?? 0))),
      cargaMax: Math.max(0, ...sets.map((s) => s.carga ?? 0)),
      repsMax: Math.max(0, ...sets.map((s) => s.reps ?? 0)),
    });
  }
  return out;
}

function Progressao({ sessoes }: { sessoes: Sessao[] }) {
  const ultima = sessoes[sessoes.length - 1];
  if (!ultima) {
    return <Empty icon="progresso" title="Sem registros ainda" text="Depois do primeiro treino com este exercício, a progressão aparece aqui." />;
  }
  const comCarga = sessoes.some((s) => s.e1rm > 0);
  const melhor = Math.max(...sessoes.map((s) => (comCarga ? s.e1rm : s.repsMax)));
  const atual = comCarga ? ultima.e1rm : ultima.repsMax;
  const unidade = comCarga ? 'kg' : 'reps';
  return (
    <>
      <StatRow>
        <Stat label={comCarga ? '1RM estimado' : 'Repetições'} tone="musc" value={num(atual)} unit={unidade} sub="última sessão" />
        <Stat label="Melhor" value={num(melhor)} unit={unidade} tone={atual >= melhor && sessoes.length > 1 ? 'accent' : undefined} />
        <Stat label="Sessões" value={sessoes.length} />
      </StatRow>
      <Card>
        <LineChart
          series={[{ points: sessoes.map((s) => ({ x: s.data, y: comCarga ? s.e1rm : s.repsMax })), tone: 'musc', area: true }]}
          yFormat={(v) => num(v)}
          ariaLabel={`${comCarga ? '1RM estimado' : 'Repetições máximas'} por sessão: de ${num(comCarga ? (sessoes[0]?.e1rm ?? 0) : (sessoes[0]?.repsMax ?? 0))} a ${num(atual)} ${unidade}`}
        />
        <p class="ui-note ui-mt-sm">
          {comCarga ? '1RM estimado por sessão (melhor série, fórmula de Epley): a carga que você faria uma vez só.' : 'Maior número de repetições em uma série, por sessão.'}
        </p>
      </Card>
      <Card eyebrow="Últimas vezes">
        <List>
          {sessoes.slice(-5).reverse().map((s) => (
            <Row
              key={s.data}
              title={fmtData(s.data)}
              sub={<span class="num">{resumoDasSeries(s.sets)}</span>}
              right={
                comCarga ? (
                  <>
                    {num(s.e1rm)}
                    <small>kg</small>
                  </>
                ) : undefined
              }
            />
          ))}
        </List>
      </Card>
    </>
  );
}

function Lista({ itens, ordenada = false }: { itens: string[]; ordenada?: boolean }) {
  const filhos = itens.map((t) => <li key={t}>{t}</li>);
  return ordenada ? <ol class="mu-passos">{filhos}</ol> : <ul class="mu-lista">{filhos}</ul>;
}

export function ExerciseScreen({ id }: { id: string }) {
  const lifts = useStore((s) => s.lifts);
  const settings = useStore((s) => s.settings);
  const [pausado, setPausado] = useState(false);
  const ex = exById(id);
  const temAnim = hasAnim(id);

  if (!ex && !temAnim) {
    return (
      <Screen title="Exercício" back>
        <Empty icon="buscar" title="Exercício não encontrado" text="Este exercício não está no catálogo do app." action={<Button size="sm" href="/exercicios">Ver todos os exercícios</Button>} />
      </Screen>
    );
  }

  const nome = ex?.name ?? exName(id);
  const tom = tomDoTipo(ex?.kind);
  // Onde o exercício aparece nas fichas do programa em uso (o mesmo exercício pode estar em mais de uma).
  const naFicha: { letra: string; nomeFicha: string; fx: FichaExercicio }[] = [];
  for (const f of fichasAtivas(settings)) for (const fx of f.exercicios) if (fx.anim === id) naFicha.push({ letra: f.id, nomeFicha: f.nome, fx });
  const deForca = naFicha.some((x) => x.fx.tipo === 'principal');
  const sessoes = deForca ? sessoesDe(lifts, naFicha.map((x) => x.fx.id)) : [];
  const variacoes = ex ? [ex.easier ? { t: 'Mais fácil', d: ex.easier } : null, ex.harder ? { t: 'Mais difícil', d: ex.harder } : null].filter((v): v is { t: string; d: string } => v !== null) : [];
  const substitutos = (ex?.swap ?? []).filter((s) => exById(s) || hasAnim(s));

  return (
    <Screen title={nome} eyebrow={ex ? `${KIND_ROTULO[ex.kind]} · ${GRUPO_ROTULO[ex.group]}` : 'Exercício'} back>
      <div class="mu-fig">
        <ExMedia id={id} tone={tom} play="always" paused={pausado} label={`Animação: ${nome}`} />
        {temAnim ? (
          <IconButton class="mu-fig-b" icon={pausado ? 'play' : 'pause'} label={pausado ? 'Tocar a animação' : 'Pausar a animação'} onClick={() => setPausado((v) => !v)} />
        ) : null}
        {ex?.sided ? <span class="mu-fig-lado"><Pill tone={tom}>um lado de cada vez</Pill></span> : null}
      </div>

      {ex ? (
        <>
          <Card>
            <dl class="mu-dl">
              <div>
                <dt class="ui-eyebrow">Músculos</dt>
                <dd>
                  <b>{maiuscula(ex.muscles.primary.join(', '))}</b>
                  {ex.muscles.secondary && ex.muscles.secondary.length > 0 ? <span class="ui-muted"> · apoio: {ex.muscles.secondary.join(', ')}</span> : null}
                </dd>
              </div>
              <div>
                <dt class="ui-eyebrow">Equipamento</dt>
                <dd>{maiuscula(ex.equipment.join(', ')) || 'Nenhum'}</dd>
              </div>
              {ex.aka && ex.aka.length > 0 ? (
                <div>
                  <dt class="ui-eyebrow">Também chamado de</dt>
                  <dd class="ui-muted">{ex.aka.join(' · ')}</dd>
                </div>
              ) : null}
            </dl>
          </Card>

          <Section title="Execução">
            <Card>
              <Lista itens={ex.how} ordenada />
              {ex.breath ? (
                <p class="mu-resp">
                  <span class="ui-eyebrow">Respiração</span>
                  {ex.breath}
                </p>
              ) : null}
            </Card>
          </Section>

          <Section title="Dicas">
            <Card>
              <Lista itens={ex.cues} />
            </Card>
          </Section>

          <Section title="Erros comuns">
            <Card>
              <ul class="mu-lista is-erro">
                {ex.mistakes.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </Card>
          </Section>

          {variacoes.length > 0 ? (
            <Section title="Variações">
              <Card>
                <dl class="mu-dl">
                  {variacoes.map((v) => (
                    <div key={v.t}>
                      <dt class="ui-eyebrow">{v.t}</dt>
                      <dd>{v.d}</dd>
                    </div>
                  ))}
                </dl>
              </Card>
            </Section>
          ) : null}
        </>
      ) : (
        <Empty icon="info" title="Texto em preparo" text="Este exercício já tem animação, mas a explicação ainda não foi escrita." />
      )}

      {naFicha.length > 0 ? (
        <Section title={`Na ficha · ${programaAtivo(settings).nome}`}>
          {naFicha.map(({ letra, nomeFicha, fx }) => (
            <Card key={fx.id} area="musc" eyebrow={`Ficha ${letra} · ${nomeFicha}`} action={fx.metodo ? <Pill tone="musc">{METODO_ROTULO[fx.metodo].toLowerCase()}</Pill> : undefined} href={`/musculacao/ficha/${letra}`}>
              <div class="ui-stack is-sm">
                <b>{fx.nome}</b>
                {fx.series.map((b, k) => (
                  <span key={k} class="mu-alvo num">
                    {alvoDoBloco(b)}
                    {b.nota ? <span> · {b.nota}</span> : null}
                  </span>
                ))}
                {fx.metodo ? <p class="ui-note">{metodoTexto(fx)}</p> : null}
                {fx.instrucoes ? (
                  <p class="ui-note">
                    <b>Instruções da ficha:</b> {fx.instrucoes}
                  </p>
                ) : null}
              </div>
            </Card>
          ))}
        </Section>
      ) : null}

      {deForca ? (
        <Section title="Progressão">
          <Progressao sessoes={sessoes} />
        </Section>
      ) : null}

      {substitutos.length > 0 ? (
        <Section title="Substitutos">
          <Card>
            <List>
              {substitutos.map((s) => {
                const e = exById(s);
                return <Row key={s} leading={<Mini anim={s} tone={tomDoTipo(e?.kind)} size="md" />} title={exName(s)} sub={e ? e.equipment.join(', ') : undefined} href={`/exercicio/${s}`} />;
              })}
            </List>
            <p class="ui-note ui-mt-sm">Para quando o aparelho estiver ocupado.</p>
          </Card>
        </Section>
      ) : null}

      {ex ? (
        <div class="ui-stack is-sm">
          <Button block icon="link-externo" href={`https://www.youtube.com/results?search_query=${encodeURIComponent(ex.yt)}`}>
            Ver vídeo no YouTube
          </Button>
          <p class="ui-note mu-centro">Abre fora do app e precisa de internet.</p>
        </div>
      ) : null}
    </Screen>
  );
}
