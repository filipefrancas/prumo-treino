/* Corrida: rótulos, formatações e peças pequenas usadas pelas três telas da feature. */
import { RUN_PLAN } from '../../data/runs.ts';
import type { Situacao } from '../../lib/corrida.ts';
import { fmtData, fromISO, hoje } from '../../lib/dates.ts';
import { fmtAlvo, fmtMin, fmtPace, num, pace } from '../../lib/format.ts';
import type { ISODate, RunBlock, RunFamily, RunLog, RunStep, StepKind, Target } from '../../types.ts';
import { Pill } from '../../ui/index.ts';

export const FAMILIA_ROTULO: Record<RunFamily, string> = {
  regenerativo: 'Regenerativo',
  continuo: 'Contínuo',
  longo: 'Longo',
  fartlek: 'Fartlek',
  intervalado: 'Intervalado',
  progressivo: 'Progressivo',
  regressivo: 'Regressivo',
};

export const PASSO_ROTULO: Record<StepKind, string> = {
  aquecimento: 'Aquecimento',
  ritmo: 'Ritmo',
  recuperacao: 'Recuperação',
  desaquecimento: 'Desaquecimento',
};

export const NIVEL_ROTULO: readonly string[] = ['', 'Muito leve', 'Leve', 'Moderado', 'Forte', 'Muito forte'];

export const SENSACAO_ROTULO: readonly string[] = ['', 'Péssimo', 'Ruim', 'Normal', 'Bem', 'Ótimo'];

/** Duração de um passo, por extenso e curta: "30 s", "5 min", "1 min 30". */
export function fmtPasso(seg: number): string {
  const s = Math.max(0, Math.round(seg));
  if (s < 60) return `${s} s`;
  const m = Math.floor(s / 60);
  const r = s % 60;
  return r === 0 ? `${m} min` : `${m} min ${String(r).padStart(2, '0')}`;
}

/** Duração para a voz: "30 segundos", "5 minutos", "1 minuto e 30 segundos". */
export function falaDuracao(seg: number): string {
  const s = Math.max(0, Math.round(seg));
  const m = Math.floor(s / 60);
  const r = s % 60;
  const partes: string[] = [];
  if (m > 0) partes.push(m === 1 ? '1 minuto' : `${m} minutos`);
  if (r > 0) partes.push(r === 1 ? '1 segundo' : `${r} segundos`);
  return partes.join(' e ') || '0 segundos';
}

/** Alvo para a voz: "frequência entre 130 e 152", "esforço 7 a 8 de 10", "ritmo livre". */
export function falaAlvo(t: Target): string {
  if (t.kind === 'fc') return t.min === t.max ? `frequência em ${t.min}` : `frequência entre ${t.min} e ${t.max}`;
  if (t.kind === 'pse') return t.min === t.max ? `esforço ${num(t.min)} de 10` : `esforço ${num(t.min)} a ${num(t.max)} de 10`;
  return 'ritmo livre';
}

/** Alvo do passo como aparece na tela: o `fmtAlvo` da biblioteca, com "livre" em minúsculas no meio de frase. */
export function alvo(t: Target): string {
  return fmtAlvo(t);
}

/** Data curta, com o ano quando não é o ano corrente: "qua 18 nov" · "dom 8 jun 2025". */
export function dataComAno(s: ISODate, ref: ISODate = hoje()): string {
  const ano = fromISO(s).getFullYear();
  return ano === fromISO(ref).getFullYear() ? fmtData(s) : `${fmtData(s)} ${ano}`;
}

/** Fatos do registro em uma linha: "25 min · 3,8 km · 6:35/km · PSE 4". */
export function fatosDoLog(r: RunLog, opts: { km?: boolean } = {}): string {
  const fatos: string[] = [];
  if (r.min !== undefined) fatos.push(fmtMin(r.min));
  if (opts.km !== false && r.km !== undefined) fatos.push(`${num(r.km, 2)} km`);
  const p = pace(r.km, r.min);
  if (p !== undefined) fatos.push(fmtPace(p));
  if (r.fc !== undefined) fatos.push(`${num(r.fc, 0)} bpm`);
  if (r.pse !== undefined) fatos.push(`PSE ${num(r.pse)}`);
  return fatos.join(' · ');
}

/** Semanas que contam no bloco: a de índice 0 é "antes do bloco" (os últimos treinos do ciclo anterior). */
export const SEMANAS_DO_BLOCO = Math.max(1, RUN_PLAN.weeks.filter((wk) => wk.index > 0).length);

/** "semana 2 de 6" para as semanas do bloco; "antes do bloco" para a de índice 0. */
export function rotuloDaSemana(index: number): string {
  return index <= 0 ? 'antes do bloco' : `semana ${index} de ${SEMANAS_DO_BLOCO}`;
}

/** Quantos passos o treino tem, com as repetições expandidas. */
export function contarPassos(blocks: RunBlock[]): number {
  return blocks.reduce((n, b) => n + ('times' in b ? b.times * b.steps.length : 1), 0);
}

/** Selo da situação do treino no plano. Treino futuro não leva selo. */
export function SituacaoPill({ situacao }: { situacao: Situacao }) {
  if (situacao === 'feito') return <Pill tone="good">feito</Pill>;
  if (situacao === 'pulado') return <Pill tone="muted">pulado</Pill>;
  if (situacao === 'hoje') return <Pill tone="accent">hoje</Pill>;
  if (situacao === 'perdido') return <Pill tone="warn">não feito</Pill>;
  return null;
}

/** Estilo com a cor do nível de intensidade do passo (1 a 5) em `--co-lv`. */
export function corDoNivel(level: RunStep['level']): Record<string, string> {
  return { '--co-lv': `var(--lv-${level})` };
}
