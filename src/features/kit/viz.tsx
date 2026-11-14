/**
 * Galeria dos componentes de números e gráficos do kit (kit-viz.html), com dados de treino de exemplo.
 * Serve para conferir o acabamento nos dois temas: `npm run shots -- --full kit-viz.html`.
 * Os estilos da própria galeria ficam em linha (só tokens) para não misturar com o CSS do kit.
 */
import { Fragment, type ComponentChildren, type CSSProperties } from 'preact';
import { useState } from 'preact/hooks';
import { runById } from '../../data/runs.ts';
import type { RunWorkout } from '../../types.ts';
import { Bars } from '../../ui/Bars.tsx';
import { Figure } from '../../ui/Figure.tsx';
import { Heat, type HeatDay } from '../../ui/Heat.tsx';
import { IntensityChart } from '../../ui/IntensityChart.tsx';
import { Legend, LineChart } from '../../ui/LineChart.tsx';
import { Meter, ProgressBar } from '../../ui/Meter.tsx';
import { Ring } from '../../ui/Ring.tsx';
import { Spark } from '../../ui/Spark.tsx';
import { Stat, StatRow } from '../../ui/Stat.tsx';
import { TimerRing } from '../../ui/TimerRing.tsx';
import { WeekStrip, type WeekStripDay } from '../../ui/WeekStrip.tsx';
import { toneColor, type Tone } from '../../ui/viz-util.ts';

type Css = CSSProperties;

const S = {
  page: { maxWidth: '520px', margin: '0 auto', padding: 'calc(var(--safe-top) + 20px) 16px calc(var(--safe-bottom) + 40px)', display: 'flex', flexDirection: 'column', gap: '14px' } as Css,
  eyebrow: { font: '500 var(--fs-2xs)/1 var(--f-mono)', letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--muted)' } as Css,
  title: { font: '600 30px/1.05 var(--f-display)', marginTop: '6px' } as Css,
  lead: { color: 'var(--muted)', fontSize: 'var(--fs-sm)', marginTop: '6px' } as Css,
  section: { ...({ font: '500 var(--fs-2xs)/1 var(--f-mono)', letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--muted)' } as Css), display: 'flex', alignItems: 'center', gap: '10px', marginTop: '14px' } as Css,
  rule: { flex: '1', height: '1px', background: 'var(--line-soft)' } as Css,
  card: { background: 'var(--surface)', border: '1px solid var(--line-soft)', borderRadius: 'var(--r)', boxShadow: 'var(--shadow)', padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px', minWidth: '0' } as Css,
  h3: { font: '600 15px/1.2 var(--f-display)', letterSpacing: '.04em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '8px' } as Css,
  sq: { width: '8px', height: '8px', borderRadius: '2px', flex: 'none' } as Css,
  note: { fontSize: 'var(--fs-xs)', color: 'var(--muted)', lineHeight: '1.45' } as Css,
  head: { display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '10px' } as Css,
  tag: { font: '500 var(--fs-2xs)/1 var(--f-mono)', letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--muted)', whiteSpace: 'nowrap' } as Css,
  row: { display: 'flex', alignItems: 'center', gap: '12px', minWidth: '0' } as Css,
  rowText: { flex: '1', minWidth: '0', display: 'flex', flexDirection: 'column', gap: '2px' } as Css,
  strong: { fontWeight: '600', fontSize: 'var(--fs-md)', lineHeight: '1.3' } as Css,
  divider: { height: '1px', background: 'var(--line-soft)' } as Css,
  big: { font: '600 56px/0.95 var(--f-display)', fontVariantNumeric: 'tabular-nums', letterSpacing: '.01em' } as Css,
  mid: { font: '600 34px/0.95 var(--f-display)', fontVariantNumeric: 'tabular-nums' } as Css,
  grid2: { display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gap: '10px' } as Css,
  figCap: { fontSize: 'var(--fs-xs)', fontWeight: '600', marginTop: '6px', lineHeight: '1.3' } as Css,
};

function Secao({ children }: { children: ComponentChildren }) {
  return (
    <h2 style={S.section}>
      {children}
      <span style={S.rule} />
    </h2>
  );
}

function Cartao({ titulo, tone, lado, children }: { titulo: string; tone?: Tone; lado?: string; children: ComponentChildren }) {
  return (
    <section style={S.card}>
      <div style={S.head}>
        <h3 style={S.h3}>
          {tone && <i style={{ ...S.sq, background: toneColor(tone) }} aria-hidden="true" />}
          {titulo}
        </h3>
        {lado && <span style={S.tag}>{lado}</span>}
      </div>
      {children}
    </section>
  );
}

/* ---------------- dados de exemplo ---------------- */

const HOJE = '2026-11-14';

const iso = (d: Date): string => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const maisDias = (s: string, n: number): string => {
  const [y = 0, m = 1, d = 1] = s.split('-').map(Number);
  return iso(new Date(y, m - 1, d + n));
};

const SEMANA: Omit<WeekStripDay, 'selected'>[] = [
  { date: '2026-11-09', letter: 'S', num: 9, marks: [{ tone: 'musc', done: true }], today: false },
  { date: '2026-11-10', letter: 'T', num: 10, marks: [], today: false },
  { date: '2026-11-11', letter: 'Q', num: 11, marks: [{ tone: 'corrida', done: true }, { tone: 'mob', done: true }], today: false },
  { date: '2026-11-12', letter: 'Q', num: 12, marks: [{ tone: 'musc', done: true }], today: false },
  { date: '2026-11-13', letter: 'S', num: 13, marks: [{ tone: 'corrida', done: true }], today: false },
  { date: '2026-11-14', letter: 'S', num: 14, marks: [{ tone: 'musc', done: false }], today: true },
  { date: '2026-11-15', letter: 'D', num: 15, marks: [{ tone: 'corrida', done: false }], today: false },
];

/** 12 semanas até a atual: musculação seg/qui/sáb, corrida qua/sex/dom, com faltas e uma pausa de quase três semanas. */
function mapaDeExemplo(): HeatDay[][] {
  const inicio = maisDias('2026-11-09', -7 * 11);
  const faltas = new Set([3, 9, 16, 20, 26, 33, 38, 47]);
  return Array.from({ length: 12 }, (_, w) =>
    Array.from({ length: 7 }, (_, d) => {
      const date = maisDias(inicio, w * 7 + d);
      const n = w * 7 + d;
      const pausa = w >= 8 && w <= 10;
      const passado = date <= HOJE;
      const ok = passado && !faltas.has(n) && date !== HOJE;
      return {
        date,
        musc: ok && (d === 0 || d === 3 || d === 5) && !(pausa && d === 3),
        corrida: ok && (d === 2 || d === 4 || d === 6) && !pausa,
        mob: ok && ((d === 2 && w % 2 === 0) || (d === 6 && w % 3 !== 1) || (pausa && d === 1)),
      };
    }),
  );
}

const MIN_SEMANA = [
  { label: '24/8', value: 112 },
  { label: '31/8', value: 128 },
  { label: '7/9', value: 95 },
  { label: '14/9', value: 140 },
  { label: '21/9', value: 151 },
  { label: '28/9', value: 133 },
  { label: '5/10', value: 146 },
  { label: '12/10', value: 88 },
  { label: '19/10', value: 0 },
  { label: '26/10', value: 0 },
  { label: '2/11', value: 20 },
  { label: '9/11', value: 50, highlight: true },
];

const PLANO_FEITO = [
  { label: '9/11', value: 60, value2: 60 },
  { label: '16/11', value: 80, value2: 80 },
  { label: '23/11', value: 95, value2: 71 },
  { label: '30/11', value: 105, value2: 58, highlight: true },
  { label: '7/12', value: 90 },
  { label: '14/12', value: 118 },
  { label: '21/12', value: 125 },
];

const PESOS = [84.6, 84.1, 84.3, 83.6, 83.2, 83.4, 82.8, 82.9, 82.3, 82.5, 81.9, 82.1];
const PESO_PTS = PESOS.map((y, i) => ({ x: maisDias('2026-08-29', i * 7), y }));
const MEDIA_PTS = PESO_PTS.map((p, i) => {
  const janela = PESOS.slice(Math.max(0, i - 3), i + 1);
  return { x: p.x, y: Math.round((janela.reduce((a, b) => a + b, 0) / janela.length) * 10) / 10 };
});

const E1RM = [61.3, 62.5, 62.5, 64.2, 63.8, 65.6, 66.7, 68.1];
const E1RM_PTS = E1RM.map((y, i) => ({ x: maisDias('2026-08-27', i * 7), y }));

const TREINOS = ['c-2026-11-13', 'c-2026-12-18', 'c-2026-12-20'].map(runById).filter((r): r is RunWorkout => r !== undefined);

const virgula = (v: number, casas = 1): string => v.toFixed(casas).replace('.', ',');

/* ---------------- galeria ---------------- */

export function KitViz() {
  const [dia, setDia] = useState(HOJE);
  const dias: WeekStripDay[] = SEMANA.map((d) => ({ ...d, selected: d.date === dia }));
  const [fartlek, intervalado, longo] = TREINOS;

  return (
    <main style={S.page}>
      <header>
        <div style={S.eyebrow}>Kit de interface · sáb 14 nov</div>
        <h1 style={S.title}>Números e gráficos</h1>
        <p style={S.lead}>Stat, Ring, Meter, WeekStrip, Bars, LineChart, Spark, Heat, IntensityChart, TimerRing e Figure.</p>
      </header>

      <Secao>Semana</Secao>
      <Cartao titulo="Faixa da semana" lado="WeekStrip">
        <WeekStrip days={dias} onSelect={setDia} />
        <p style={S.note}>Cheio = feito · contorno = planejado · hoje com contorno âmbar · toque para selecionar.</p>
      </Cartao>

      <Cartao titulo="Semana em números" lado="Ring + Stat">
        <div style={{ ...S.row, gap: '16px' }}>
          <Ring value={4 / 6} label="4/6" sub="treinos" ariaLabel="4 de 6 treinos feitos na semana" />
          <div style={{ flex: '1', minWidth: '0', display: 'flex', flexDirection: 'column', gap: '11px' }}>
            <Meter label="Corrida" value={2} max={3} tone="corrida" right="2 de 3" />
            <Meter label="Musculação" value={2} max={3} tone="musc" right="2 de 3" />
            <Meter label="Mobilidade" value={18} max={30} tone="mob" right="18 min" />
          </div>
        </div>
        <StatRow>
          <Stat label="Corrida" tone="corrida" value="50" unit="min" sub="2 treinos" />
          <Stat label="Volume" tone="musc" value="9.840" unit="kg" delta={{ text: '+6%', dir: 'up', tone: 'good' }} />
          <Stat label="Mobilidade" tone="mob" value="18" unit="min" sub="2 rotinas" />
        </StatRow>
      </Cartao>

      <Secao>KPIs</Secao>
      <Cartao titulo="Stat" lado="2, 3 e 4 colunas">
        <StatRow>
          <Stat label="Peso atual" tone="peso" value="82,1" unit="kg" delta={{ text: '−0,4 kg', dir: 'down', tone: 'good' }} sub="na semana" />
          <Stat label="Corrida mais longa" tone="corrida" value="35" unit="min" sub={<>dom 15 nov · <b>5,2 km</b></>} />
        </StatRow>
        <StatRow>
          <Stat label="Sequência" value="5" unit="sem" tone="good" sub="seguidas" />
          <Stat label="FC média" value="148" unit="bpm" sub="no contínuo" />
          <Stat label="Ritmo" value="6:42" unit="/km" delta={{ text: '0:08', dir: 'down', tone: 'good' }} />
        </StatRow>
        <StatRow>
          <Stat label="Treinos" value="14" />
          <Stat label="Séries" value="212" />
          <Stat label="PSE" value="6,5" tone="warn" />
          <Stat label="Recordes" value={null} />
        </StatRow>
      </Cartao>

      <Cartao titulo="Anéis" lado="Ring">
        <div style={{ ...S.row, gap: '8px', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <Ring value={0.72} size={88} tone="corrida" label="72%" sub="do plano" />
          <Ring value={1} size={72} tone="good" label="3/3" sub="musc" ariaLabel="3 de 3 treinos de musculação" />
          <Ring value={0.4} size={54} stroke={5} tone="mob" label="12" ariaLabel="12 minutos de mobilidade" />
          <Ring value={0} size={54} stroke={5} tone="musc" label="—" ariaLabel="Sem dados" />
        </div>
      </Cartao>

      <Cartao titulo="Medidores" lado="Meter + ProgressBar">
        <Meter label="Minutos de corrida" value={85} max={120} tone="corrida" right={<>85 <span>de 120 min</span></>} />
        <Meter label="Séries de trabalho" value={31} max={46} tone="musc" right={<>31 <span>de 46</span></>} />
        <Meter label="Alongamento" value={8} max={8} tone="mob" right="8 min" />
        <div style={S.divider} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
          <div style={{ ...S.head, fontSize: 'var(--fs-xs)' }}>
            <span style={{ color: 'var(--muted)', fontWeight: '600' }}>Bloco de retorno</span>
            <span class="num" style={{ fontWeight: '600' }}>semana 4 de 7</span>
          </div>
          <ProgressBar value={0.5} mark={4 / 7} label="Semana 4 de 7 do bloco de retorno" />
          <p style={S.note}>O fio marca onde o plano espera que você esteja.</p>
        </div>
      </Cartao>

      <Secao>Gráficos</Secao>
      <Cartao titulo="Minutos por semana" tone="corrida" lado="Bars · 12 sem">
        <Bars data={MIN_SEMANA} unit="min" tone="corrida" target={120} />
      </Cartao>

      <Cartao titulo="Planejado × feito" tone="corrida" lado="Bars · value2">
        <Legend items={[{ label: 'Planejado', tone: 'corrida', kind: 'soft' }, { label: 'Feito', tone: 'corrida', kind: 'box' }]} />
        <Bars data={PLANO_FEITO} unit="min" tone="corrida" height={150} />
      </Cartao>

      <Cartao titulo="Peso" tone="peso" lado="LineChart">
        <LineChart
          series={[
            { points: PESO_PTS, tone: 'peso', area: true, label: 'Peso' },
            { points: MEDIA_PTS, tone: 'muted', dashed: true, label: 'Média de 4 semanas' },
          ]}
          target={80}
          yFormat={(v) => virgula(v, 0)}
        />
      </Cartao>

      <Cartao titulo="Supino reto · e1RM" tone="musc" lado="LineChart">
        <LineChart series={[{ points: E1RM_PTS, tone: 'musc' }]} height={150} />
      </Cartao>

      <Cartao titulo="Tendências" lado="Spark">
        {[
          { nome: 'Peso', valor: '82,1 kg', tone: 'peso' as const, v: PESOS },
          { nome: 'Supino reto (e1RM)', valor: '68,1 kg', tone: 'musc' as const, v: E1RM },
          { nome: 'Minutos de corrida', valor: '50 min', tone: 'corrida' as const, v: MIN_SEMANA.map((d) => d.value) },
        ].map((l, i) => (
          <Fragment key={l.nome}>
            {i > 0 && <div style={S.divider} />}
            <div style={S.row}>
              <div style={S.rowText}>
                <span style={{ ...S.note, fontWeight: '600' }}>{l.nome}</span>
                <span class="num" style={{ font: '600 20px/1 var(--f-display)' }}>{l.valor}</span>
              </div>
              <Spark values={l.v} tone={l.tone} />
            </div>
          </Fragment>
        ))}
      </Cartao>

      <Cartao titulo="Consistência" lado="Heat · 12 sem">
        <Heat weeks={mapaDeExemplo()} todayISO={HOJE} />
      </Cartao>

      <Secao>Corrida</Secao>
      {TREINOS.map((t) => (
        <Cartao key={t.id} titulo={t.title} tone="corrida" lado={`${t.minutes} min`}>
          <IntensityChart blocks={t.blocks} />
          <p style={S.note}>{t.purpose}</p>
        </Cartao>
      ))}

      {intervalado && (
        <Cartao titulo="Corrida guiada" tone="corrida" lado="cursorSec">
          <IntensityChart blocks={intervalado.blocks} height={84} cursorSec={11 * 60 + 20} label="Progresso do treino: 11 de 28 minutos" />
          <p style={S.note}>O que já passou fica apagado; a linha anda com o cronômetro.</p>
        </Cartao>
      )}

      <Cartao titulo="Em cartões" tone="corrida" lado="compact">
        {[fartlek, intervalado, longo].map((t, i) =>
          t ? (
            <Fragment key={t.id}>
              {i > 0 && <div style={S.divider} />}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
                <div style={S.head}>
                  <span style={S.strong}>{t.title}</span>
                  <span style={S.tag}>{t.minutes} min</span>
                </div>
                <IntensityChart blocks={t.blocks} compact />
              </div>
            </Fragment>
          ) : null,
        )}
      </Cartao>

      <Secao>Cronômetro</Secao>
      <Cartao titulo="Contagem regressiva" lado="TimerRing">
        <TimerRing total={90} left={42} size={220}>
          <span style={S.tag}>Descanso</span>
          <b style={S.big}>0:42</b>
          <span style={S.note}>Próximo: supino reto · série 3</span>
        </TimerRing>
        <div style={S.grid2}>
          <TimerRing total={60} left={18} size={140} tone="mob">
            <b style={S.mid}>18</b>
            <span style={S.tag}>segundos</span>
          </TimerRing>
          <TimerRing total={120} left={120} size={140} tone="corrida">
            <b style={S.mid}>2:00</b>
            <span style={S.tag}>Ritmo forte</span>
          </TimerRing>
        </div>
      </Cartao>

      <Secao>Boneco</Secao>
      <Cartao titulo="Animações" lado="Figure">
        <div style={S.grid2}>
          {(
            [
              { id: 'agachamento-livre', nome: 'Agachamento livre', tone: 'musc' },
              { id: 'rosca-direta', nome: 'Rosca direta', tone: 'musc' },
              { id: 'prancha', nome: 'Prancha', tone: 'mob' },
              { id: 'joelhos-ao-peito', nome: 'Joelhos ao peito', tone: 'corrida' },
              { id: 'elevacao-lateral', nome: 'Elevação lateral', tone: 'musc' },
              { id: 'exercicio-sem-animacao', nome: 'Sem animação (vazio)', tone: 'musc' },
            ] as const
          ).map((f) => (
            <div key={f.id}>
              <Figure id={f.id} tone={f.tone} label={f.nome} />
              <div style={S.figCap}>{f.nome}</div>
              <div style={S.tag}>{f.tone}</div>
            </div>
          ))}
        </div>
      </Cartao>

      <Cartao titulo="Em listas" lado="thumb + plain">
        {(
          [
            { id: 'agachamento-livre', nome: 'Agachamento livre', alvo: '3 × 8-12 · RIR 1-3 · 40 kg', tone: 'musc' },
            { id: 'elevacao-lateral', nome: 'Elevação lateral', alvo: '3 × 12-15 · 8 kg · descanso 60 s', tone: 'musc' },
            { id: 'prancha', nome: 'Prancha', alvo: '3 × 45 s', tone: 'mob' },
            { id: 'exercicio-sem-animacao', nome: 'Exercício sem animação', alvo: 'estado vazio', tone: 'musc' },
          ] as const
        ).map((f, i) => (
          <Fragment key={f.id}>
            {i > 0 && <div style={S.divider} />}
            <div style={S.row}>
              <Figure id={f.id} tone={f.tone} play="never" class="ui-fig--thumb" />
              <div style={S.rowText}>
                <span style={S.strong}>{f.nome}</span>
                <span class="num" style={S.note}>{f.alvo}</span>
              </div>
            </div>
          </Fragment>
        ))}
        <div style={S.divider} />
        <div style={S.row}>
          <div style={{ width: '120px', flex: 'none' }}>
            <Figure id="joelhos-ao-peito" tone="corrida" play="never" class="ui-fig--plain" />
          </div>
          <div style={S.rowText}>
            <span style={S.strong}>Sem fundo</span>
            <span style={S.note}>ui-fig--plain: o boneco direto sobre o cartão.</span>
          </div>
        </div>
      </Cartao>
    </main>
  );
}
