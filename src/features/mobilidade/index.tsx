/* Mobilidade: rotinas (#/mobilidade), detalhe da rotina (#/mobilidade/rotina/:id) e rotina guiada (tocar.tsx). */
import { useMemo } from 'preact/hooks';
import { ROUTINES, routineById } from '../../data/routines.ts';
import { fmtRelativa, hoje, semanaDe } from '../../lib/dates.ts';
import { destravarAudio } from '../../lib/feedback.ts';
import { fmtMin, plural } from '../../lib/format.ts';
import { agendaDoDia } from '../../lib/plano.ts';
import { go } from '../../lib/router.ts';
import { update, useStore } from '../../lib/store.ts';
import type { AppState, MobilityLog, Routine } from '../../types.ts';
import { Button, Card, Empty, ExMedia, Icon, List, Pill, Row, Screen, Section, Segmented, Stat, StatRow } from '../../ui/index.ts';
import './mobilidade.css';
import {
  duracaoEstimada,
  KIND_ORDEM,
  KIND_ROTULO,
  linhasDaLista,
  minutosDe,
  montarPassos,
  rodadasDe,
  TEMPOS_POSICAO,
  tomDaRotina,
  ultimoRegistro,
  type LinhaDaLista,
} from './rotina.ts';

export { RoutinePlayerScreen } from './tocar.tsx';

/** Telas de rota com parâmetro recebem o trecho `:id` da rota. */
export interface ComId {
  id: string;
}

/** "22 min" com o ajuste do usuário; em tempo livre, o tempo de referência da rotina com "~". */
function textoDuracao(r: Routine, alongSeg: number): string {
  const seg = duracaoEstimada(r, alongSeg);
  return seg === null ? 'tempo livre' : fmtMin(minutosDe(seg));
}

/** "14 posições" · "6 exercícios · 3 rodadas". */
function textoPassos(r: Routine, linhas: number, rodadas: number): string {
  const base = r.kind === 'alongamento' ? plural(linhas, 'posição', 'posições') : plural(linhas, 'exercício', 'exercícios');
  return rodadas > 1 ? `${base} · ${rodadas} rodadas` : base;
}

function contagemDe(r: Routine): { linhas: number; rodadas: number } {
  const { rodadas, porRodada } = rodadasDe(r);
  return { linhas: linhasDaLista(montarPassos(r, 60), porRodada).length, rodadas };
}

/* ------------------------------------------------------------------ */
/* #/mobilidade                                                        */
/* ------------------------------------------------------------------ */

interface Sugestao {
  rotina: Routine;
  motivo: string;
}

/** A rotina que mais combina com o dia: aquecer antes da corrida, alongar depois. Em dia de musculação, nenhuma. */
function sugestaoDoDia(state: AppState, dia: string): Sugestao | undefined {
  const feitasHoje = new Set(state.mob.filter((m) => m.data === dia).map((m) => m.rotina));
  const escolher = (id: string, motivo: string): Sugestao | undefined => {
    const rotina = routineById(id);
    return rotina && !feitasHoje.has(id) ? { rotina, motivo } : undefined;
  };
  const itens = agendaDoDia(state, dia);
  // Dia de musculação: o treino já é o dia inteiro, sem alongamento, mobilidade ou aquecimento sugerido.
  if (itens.some((i) => i.tipo === 'musc')) return undefined;
  const corrida = itens.find((i) => i.tipo === 'corrida');
  if (corrida?.feito) return escolher('pos-corrida', 'Você correu hoje: alongue enquanto o corpo ainda está quente.');
  if (corrida && corrida.situacao === 'hoje') return escolher('aquecimento-corrida', 'Hoje tem corrida: cinco minutos para soltar quadril e tornozelo antes de sair.');
  const mob = itens.find((i) => i.tipo === 'mob');
  if (mob?.rotina) return escolher(mob.rotina.id, 'Hoje é dia de alongamento: é o único dia sem corrida nem musculação.');
  return escolher('alongamento-completo', 'Dia sem treino: bom momento para o alongamento completo, sem pressa.');
}

function CartaoRotina({ r, ultimo, alongSeg, dia }: { r: Routine; ultimo: MobilityLog | undefined; alongSeg: number; dia: string }) {
  const { linhas, rodadas } = useMemo(() => contagemDe(r), [r]);
  const tom = tomDaRotina(r);
  return (
    <Card area={tom} title={r.name} href={`/mobilidade/rotina/${r.id}`} action={<span class="num">{textoDuracao(r, alongSeg)}</span>}>
      <div class="mo-rot">
        <ExMedia id={r.steps[0]?.ex} play="never" tone={tom} class="ui-fig--thumb mo-rot-fig" />
        <div class="mo-rot-txt">
          <p class="mo-rot-quando">{r.when}</p>
          <p class="mo-rot-meta">
            <span class="num">{textoPassos(r, linhas, rodadas)}</span>
            <i aria-hidden="true">·</i>
            {ultimo ? (
              <span class="mo-rot-ultima">
                <Icon name="check" size={13} />
                {fmtRelativa(ultimo.data, dia)}
              </span>
            ) : (
              <span>ainda não fez</span>
            )}
          </p>
        </div>
        <Icon name="avancar" size={16} class="mo-rot-chev" />
      </div>
    </Card>
  );
}

export function MobilidadeScreen() {
  const state = useStore((s) => s);
  const { mob, settings } = state;
  const dia = hoje();
  const semana = new Set(semanaDe(dia));
  const daSemana = mob.filter((m) => semana.has(m.data));
  const minSemana = Math.round(daSemana.reduce((s, m) => s + m.seg, 0) / 60);
  const ultima = mob.reduce<MobilityLog | undefined>((a, m) => (!a || m.data >= a.data ? m : a), undefined);
  const sugestao = sugestaoDoDia(state, dia);

  return (
    <Screen eyebrow="Alongar, aquecer, fortalecer" title="Mobilidade">
      <Section title="Esta semana">
        <StatRow>
          <Stat label="Minutos" tone="mob" value={String(minSemana)} unit="min" />
          <Stat label="Rotinas" value={String(daSemana.length)} sub={daSemana.length === 0 ? 'nenhuma ainda' : undefined} />
          <Stat label="Última vez" value={ultima ? fmtRelativa(ultima.data, dia) : null} class="mo-stat-txt" />
        </StatRow>
        {sugestao ? (
          <Card class="mo-sug" href={`/mobilidade/rotina/${sugestao.rotina.id}`} eyebrow="Sugestão de hoje" area={tomDaRotina(sugestao.rotina)}
            action={<Pill tone="accent" icon="relogio">{textoDuracao(sugestao.rotina, settings.alongamentoSeg)}</Pill>}>
            <div class="mo-rot">
              <ExMedia id={sugestao.rotina.steps[0]?.ex} play="never" tone={tomDaRotina(sugestao.rotina)} class="ui-fig--thumb mo-rot-fig" />
              <div class="mo-rot-txt">
                <b class="mo-sug-nome">{sugestao.rotina.name}</b>
                <p class="mo-rot-quando">{sugestao.motivo}</p>
              </div>
              <Icon name="avancar" size={16} class="mo-rot-chev" />
            </div>
          </Card>
        ) : null}
      </Section>

      {KIND_ORDEM.map((kind) => {
        const rotinas = ROUTINES.filter((r) => r.kind === kind);
        if (rotinas.length === 0) return null;
        return (
          <Section key={kind} title={KIND_ROTULO[kind]}>
            {rotinas.map((r) => (
              <CartaoRotina key={r.id} r={r} ultimo={ultimoRegistro(mob, r.id)} alongSeg={settings.alongamentoSeg} dia={dia} />
            ))}
          </Section>
        );
      })}
    </Screen>
  );
}

/* ------------------------------------------------------------------ */
/* #/mobilidade/rotina/:id                                             */
/* ------------------------------------------------------------------ */

function medidaDaLinha(l: LinhaDaLista) {
  if (l.modo === 'reps') return <>{l.reps}<small>×</small></>;
  if (l.modo === 'livre') return <small>livre</small>;
  return <>{l.seg}<small>s</small></>;
}

export function RoutineScreen({ id }: ComId) {
  const routine = routineById(id);
  const alongSeg = useStore((s) => s.settings.alongamentoSeg);
  const mob = useStore((s) => s.mob);
  const dia = hoje();

  if (!routine) {
    return (
      <Screen title="Rotina" back="/mobilidade">
        <Empty icon="mobilidade" title="Rotina não encontrada" text="Volte para Mobilidade e escolha uma rotina da lista." />
      </Screen>
    );
  }

  const tom = tomDaRotina(routine);
  const passos = montarPassos(routine, alongSeg);
  const { rodadas, porRodada } = rodadasDe(routine);
  const linhas = linhasDaLista(passos, porRodada);
  const ultimo = ultimoRegistro(mob, routine.id);
  const vezes = mob.filter((m) => m.rotina === routine.id).length;
  const seg = duracaoEstimada(routine, alongSeg);
  const posicoes = routine.kind === 'alongamento';
  const valorTempo = TEMPOS_POSICAO.includes(alongSeg) ? String(alongSeg) : '';

  const comecar = (): void => {
    destravarAudio(); // dentro do toque: libera bipes e voz para a rotina guiada
    go(`/mobilidade/tocar/${routine.id}`);
  };

  return (
    <Screen
      eyebrow={KIND_ROTULO[routine.kind]}
      title={routine.name}
      back="/mobilidade"
      footer={
        <Button variant="primary" size="lg" icon="play" onClick={comecar}>
          {seg === null ? 'Começar' : `Começar · ${fmtMin(minutosDe(seg))}`}
        </Button>
      }
    >
      <div class="ui-stack">
        <StatRow>
          <Stat label="Duração" tone={tom} value={seg === null ? 'livre' : String(minutosDe(seg))} unit={seg === null ? undefined : 'min'} class={seg === null ? 'mo-stat-txt' : undefined} />
          <Stat label={posicoes ? 'Posições' : 'Exercícios'} value={String(linhas.length)} sub={rodadas > 1 ? `${rodadas} rodadas` : undefined} />
          <Stat label="Última vez" value={ultimo ? fmtRelativa(ultimo.data, dia) : null} sub={vezes > 0 ? plural(vezes, 'vez', 'vezes') : 'ainda não fez'} class="mo-stat-txt" />
        </StatRow>
        <p class="mo-desc">{routine.description}</p>
        <p class="mo-quando">
          <Icon name="relogio" size={16} />
          <span>{routine.when}</span>
        </p>
      </div>

      {routine.userTimed ? (
        <Section title="Tempo por posição">
          <Segmented
            label="Tempo por posição"
            value={valorTempo}
            onChange={(v) => update((d) => { d.settings.alongamentoSeg = Number(v); })}
            options={TEMPOS_POSICAO.map((t) => ({ v: String(t), l: t === 0 ? 'Livre' : `${t} s` }))}
          />
          <p class="ui-note">
            {alongSeg === 0
              ? 'Tempo livre: você fica em cada posição o quanto quiser e toca em Feito para seguir.'
              : valorTempo === ''
                ? `Agora: ${alongSeg} s por posição, definido em Ajustes.`
                : `Cada posição dura ${alongSeg} s, com ${routine.transition} s para trocar. Vale para as próximas vezes.`}
          </p>
        </Section>
      ) : null}

      <Section title={rodadas > 1 ? `Cada rodada · ${rodadas} rodadas` : posicoes ? 'Posições' : 'Exercícios'}>
        <Card>
          <List>
            {linhas.map((l, i) => (
              <Row
                key={`${l.ex}-${i}`}
                leading={<ExMedia id={l.ex} play="never" tone={tom} class="ui-fig--thumb mo-passo-fig" />}
                title={l.nome}
                sub={[l.cadaLado ? 'cada lado' : null, l.nota ?? null].filter(Boolean).join(' · ') || undefined}
                right={medidaDaLinha(l)}
                href={`/exercicio/${l.ex}`}
              />
            ))}
          </List>
        </Card>
        <p class="ui-note">
          {routine.transition} s de transição entre {posicoes ? 'as posições' : 'os exercícios'}, com a próxima anunciada por voz. Toque em um item para ver
          como fazer.
        </p>
      </Section>
    </Screen>
  );
}
