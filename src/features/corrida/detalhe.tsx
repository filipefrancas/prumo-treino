/* Corrida: detalhe de um treino do plano (#/corrida/treino/:id). */
import { useEffect, useState } from 'preact/hooks';
import { runById } from '../../data/runs.ts';
import { logDoTreino, marcarTreino, situacaoDoTreino } from '../../lib/corrida.ts';
import { fmtData } from '../../lib/dates.ts';
import { fmtMin, fmtPace, num, pace } from '../../lib/format.ts';
import { go, useRoute } from '../../lib/router.ts';
import { useStore } from '../../lib/store.ts';
import type { RunBlock, RunLog, RunStep } from '../../types.ts';
import { Button, Card, Empty, Icon, IntensityChart, Pill, PorQue, Screen, Section, Stat, StatRow, Tag, toast } from '../../ui/index.ts';
import { FAMILIA_ROTULO, NIVEL_ROTULO, PASSO_ROTULO, SENSACAO_ROTULO, SituacaoPill, alvo, contarPassos, corDoNivel, dataComAno, fmtPasso } from './comum.tsx';
import { sessaoGuiada } from './guiada.tsx';
import { RegistroSheet } from './registro.tsx';

function Passo({ s }: { s: RunStep }) {
  return (
    <li class="co-passo" style={corDoNivel(s.level)}>
      <i class="co-passo-nv" aria-hidden="true" />
      <span class="co-passo-dur num">{fmtPasso(s.sec)}</span>
      <span class="co-passo-main">
        <span class="co-passo-t">{s.label}</span>
        <span class="co-passo-s">
          {PASSO_ROTULO[s.kind]} · {alvo(s.target)}
        </span>
      </span>
    </li>
  );
}

function Passos({ blocks }: { blocks: RunBlock[] }) {
  return (
    <ol class="co-passos">
      {blocks.map((b, i) =>
        'times' in b ? (
          <li key={i} class="co-rep">
            <div class="co-rep-head">
              <b class="co-rep-x num">{b.times}×</b>
              <span>
                repetir {b.times} vezes · {fmtPasso(b.times * b.steps.reduce((t, s) => t + s.sec, 0))}
              </span>
            </div>
            <ol class="co-passos">
              {b.steps.map((s, j) => (
                <Passo key={j} s={s} />
              ))}
            </ol>
          </li>
        ) : (
          <Passo key={i} s={b} />
        ),
      )}
    </ol>
  );
}

function niveisUsados(blocks: RunBlock[]): number[] {
  const usados = new Set<number>();
  for (const b of blocks) {
    if ('times' in b) for (const s of b.steps) usados.add(s.level);
    else usados.add(b.level);
  }
  return [...usados].sort((a, b) => a - b);
}

function Resumo({ log, onEditar }: { log: RunLog; onEditar: () => void }) {
  const ritmo = pace(log.km, log.min);
  const detalhes: string[] = [];
  if (log.sensacao) detalhes.push(`Sentiu-se: ${(SENSACAO_ROTULO[log.sensacao] ?? '').toLowerCase()}`);
  if (log.local) detalhes.push(log.local === 'esteira' ? 'Esteira' : 'Rua');
  if (log.fc !== undefined) detalhes.push(`FC média ${num(log.fc, 0)} bpm`);
  if (log.fcMax !== undefined) detalhes.push(`máxima ${num(log.fcMax, 0)} bpm`);
  const cam = log.caminhada;
  const caminhada = cam
    ? [cam.km !== undefined ? `${num(cam.km, 2)} km` : '', cam.min !== undefined ? `em ${fmtMin(cam.min)}` : '', cam.fc !== undefined ? `· FC média ${num(cam.fc, 0)} bpm` : '']
        .filter(Boolean)
        .join(' ')
    : undefined;
  return (
    <Card
      area="corrida"
      eyebrow={`Registrado · ${dataComAno(log.data)}`}
      action={
        <button type="button" class="ui-link" onClick={onEditar}>
          editar
        </button>
      }
    >
      <StatRow>
        <Stat label="Duração" value={log.min !== undefined ? fmtMin(log.min).replace(' min', '') : null} unit={log.min !== undefined && log.min < 60 ? 'min' : undefined} />
        <Stat label="Distância" value={log.km !== undefined ? num(log.km, 2) : null} unit="km" sub={ritmo !== undefined ? fmtPace(ritmo) : undefined} />
        <Stat label="PSE" value={log.pse !== undefined ? num(log.pse) : null} unit="de 10" />
      </StatRow>
      {detalhes.length ? <p class="ui-note ui-mt">{detalhes.join(' · ')}</p> : null}
      {caminhada ? (
        <p class="ui-note ui-mt-sm">
          <b>Caminhada no mesmo dia:</b> {caminhada}
        </p>
      ) : null}
      {log.obs ? <p class="co-nota ui-mt-sm">{log.obs}</p> : null}
    </Card>
  );
}

export function RunDetailScreen({ id }: { id: string }) {
  const w = runById(id);
  const log = useStore((s) => logDoTreino(s, id));
  const situacao = useStore((s) => (w ? situacaoDoTreino(s, w) : 'futuro'));
  // A rota com ?registrar=1 (atalho "Registrar" de outras telas) já abre a folha de registro.
  const pedeRegistro = useRoute().query.registrar === '1';
  const [registrando, setRegistrando] = useState(pedeRegistro);
  useEffect(() => {
    if (pedeRegistro) setRegistrando(true);
  }, [pedeRegistro]);
  const fecharRegistro = (): void => {
    setRegistrando(false);
    // Tira o pedido do endereço: voltar para esta tela não reabre a folha.
    if (pedeRegistro) go(`/corrida/treino/${id}`, { replace: true });
  };

  if (!w) {
    return (
      <Screen title="Treino de corrida" back="/corrida">
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

  const feito = situacao === 'feito';
  const pulado = situacao === 'pulado';
  const emAndamento = sessaoGuiada(w.id) !== undefined;
  const niveis = niveisUsados(w.blocks);
  const nPassos = contarPassos(w.blocks);

  function pular(): void {
    marcarTreino(id, 'pulado');
    toast('Treino pulado', { action: { label: 'Desfazer', onClick: () => marcarTreino(id, null) } });
  }

  const rodape = log ? (
    <Button icon="editar" onClick={() => setRegistrando(true)}>
      Editar registro
    </Button>
  ) : (
    <>
      <Button icon="play" href={`/corrida/guiada/${w.id}`}>
        {emAndamento ? 'Continuar' : 'Corrida guiada'}
      </Button>
      <Button variant="primary" icon="check" onClick={() => setRegistrando(true)}>
        Registrar treino
      </Button>
    </>
  );

  return (
    <Screen eyebrow={fmtData(w.date, 'longa')} title={w.title} back="/corrida" footer={rodape}>
      <div class="co-topo">
        <div class="co-topo-linha">
          <span class="ui-val num">
            {w.minutes}
            <small>min</small>
          </span>
          <div class="co-topo-selos">
            <SituacaoPill situacao={situacao} />
            {w.onWatch ? <Pill tone="corrida" icon="relogio">no relógio</Pill> : null}
          </div>
        </div>
        <div class="ui-inline">
          <Tag>{FAMILIA_ROTULO[w.family]}</Tag>
          <Tag>·</Tag>
          <Tag>{nPassos === 1 ? '1 passo' : `${nPassos} passos`}</Tag>
          {w.source === 'treinador' ? (
            <>
              <Tag>·</Tag>
              <Tag>do treinador</Tag>
            </>
          ) : null}
        </div>
        <p class="co-proposito">{w.purpose}</p>
      </div>

      {log ? <Resumo log={log} onEditar={() => setRegistrando(true)} /> : null}

      {feito && !log ? (
        <div class="ui-banner is-accent">
          <Icon name="check" />
          <span class="ui-grow">Marcado como feito, sem registro. Registre para o treinador ver como foi.</span>
          <Button size="sm" onClick={() => setRegistrando(true)}>
            Registrar
          </Button>
        </div>
      ) : null}

      {pulado ? (
        <div class="ui-banner">
          <Icon name="pular" />
          <span class="ui-grow">Você pulou este treino.</span>
          <Button size="sm" onClick={() => marcarTreino(id, null)}>
            Desfazer
          </Button>
        </div>
      ) : null}

      <PorQue texto={w.porque} area="corrida" />

      <Section title="Intensidade">
        <Card>
          <IntensityChart blocks={w.blocks} />
          <ul class="co-niveis" aria-label="Legenda dos níveis de intensidade">
            {niveis.map((n) => (
              <li key={n} style={{ '--co-lv': `var(--lv-${n})` }}>
                <i aria-hidden="true" />
                {NIVEL_ROTULO[n]}
              </li>
            ))}
          </ul>
        </Card>
      </Section>

      <Section title={`Passos · ${nPassos}`}>
        <Card>
          <Passos blocks={w.blocks} />
        </Card>
      </Section>

      <Section title="Orientação do treinador">
        <p class="co-orientacao">{w.description}</p>
        {w.tips?.length ? (
          <ul class="co-dicas">
            {w.tips.map((t) => (
              <li key={t}>
                <Icon name="info" size={16} />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        ) : null}
      </Section>

      {!log && !pulado && !feito ? (
        <div class="co-pular">
          <p class="ui-note">Não vai dar para fazer? Pule o treino: ele sai da conta da semana e o treinador fica sabendo.</p>
          <Button variant="ghost" size="sm" icon="pular" onClick={pular}>
            Pular este treino
          </Button>
        </div>
      ) : null}

      <RegistroSheet open={registrando && w !== undefined} onClose={fecharRegistro} treino={w} log={log} />
    </Screen>
  );
}
