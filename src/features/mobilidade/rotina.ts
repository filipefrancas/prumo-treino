/**
 * Mobilidade: o que as três telas compartilham sobre uma rotina. Monta os passos do tocador (nome, lado, frase
 * de execução, tempo ou repetições), agrupa os passos para a lista do detalhe e escreve os textos falados.
 * Funções puras.
 */
import { exById, exName } from '../../data/ex/_index.ts';
import { routineSeconds } from '../../data/routines.ts';
import type { MobilityLog, Routine, RoutineKind } from '../../types.ts';

export const KIND_ROTULO: Record<RoutineKind, string> = {
  alongamento: 'Alongamento',
  aquecimento: 'Aquecimento',
  educativos: 'Educativos de corrida',
  core: 'Core',
  pes: 'Pés',
  liberacao: 'Liberação miofascial',
};

/** Ordem das seções na tela de rotinas. */
export const KIND_ORDEM: readonly RoutineKind[] = ['alongamento', 'aquecimento', 'educativos', 'core', 'pes', 'liberacao'];

/** Opções do seletor de tempo por posição (0 = tempo livre). */
export const TEMPOS_POSICAO: readonly number[] = [30, 45, 60, 0];

/** Cor do boneco: laranja da corrida nos educativos, verde-água no resto. */
export const tomDaRotina = (r: Routine): 'mob' | 'corrida' => (r.kind === 'educativos' ? 'corrida' : 'mob');

export const LADO_ROTULO: Record<'D' | 'E', string> = { D: 'Direita', E: 'Esquerda' };
const LADO_FALA: Record<'D' | 'E', string> = { D: 'lado direito', E: 'lado esquerdo' };

/** tempo: contagem regressiva · reps: repetições com "Feito" · livre: fica o quanto quiser e toca em "Feito". */
export type ModoPasso = 'tempo' | 'reps' | 'livre';

export interface PassoTocar {
  ex: string;
  nome: string;
  lado?: 'D' | 'E';
  modo: ModoPasso;
  /** Segundos da posição (modo tempo). */
  seg: number;
  /** Repetições (modo reps). */
  reps: number;
  /** Uma frase de execução: o primeiro passo de "como fazer" do exercício. */
  frase: string;
  nota?: string;
  /** Rodada [atual, total] nas rotinas que repetem a mesma sequência. */
  rodada?: [number, number];
}

/**
 * Tamanho da sequência que se repete (educativos: 3 rodadas da mesma lista). Devolve o número de rodadas e
 * quantos passos tem cada uma; sem repetição, 1 rodada com todos os passos.
 */
export function rodadasDe(routine: Routine): { rodadas: number; porRodada: number } {
  const n = routine.steps.length;
  const chave = (i: number): string => {
    const s = routine.steps[i];
    return s ? `${s.ex}|${s.side ?? ''}|${s.sec ?? ''}|${s.reps ?? ''}` : '';
  };
  for (let p = 2; p <= n / 2; p++) {
    if (n % p !== 0) continue;
    let igual = true;
    for (let i = p; i < n && igual; i++) igual = chave(i) === chave(i % p);
    if (igual) return { rodadas: n / p, porRodada: p };
  }
  return { rodadas: 1, porRodada: n };
}

/** Segundos por posição que valem para a rotina: o ajuste do usuário nas rotinas com `userTimed` (0 = livre). */
export function tempoDaPosicao(routine: Routine, alongamentoSeg: number): number | undefined {
  return routine.userTimed ? Math.max(0, Math.round(alongamentoSeg)) : undefined;
}

/** Passos na ordem de execução, já com o tempo por posição do usuário aplicado. */
export function montarPassos(routine: Routine, alongamentoSeg: number): PassoTocar[] {
  const ajuste = tempoDaPosicao(routine, alongamentoSeg);
  const { rodadas, porRodada } = rodadasDe(routine);
  return routine.steps.map((s, i) => {
    const ex = exById(s.ex);
    const porTempo = s.sec !== undefined;
    const modo: ModoPasso = !porTempo ? 'reps' : ajuste === 0 ? 'livre' : 'tempo';
    const passo: PassoTocar = {
      ex: s.ex,
      nome: ex?.name ?? exName(s.ex),
      modo,
      seg: porTempo ? (ajuste && ajuste > 0 ? ajuste : (s.sec ?? 0)) : 0,
      reps: s.reps ?? 0,
      frase: ex?.how[0] ?? '',
    };
    if (s.side) passo.lado = s.side;
    if (s.note) passo.nota = s.note;
    if (rodadas > 1) passo.rodada = [Math.floor(i / porRodada) + 1, rodadas];
    return passo;
  });
}

/** Duração estimada em segundos, com o ajuste do usuário; `null` quando a rotina está em tempo livre. */
export function duracaoEstimada(routine: Routine, alongamentoSeg: number): number | null {
  const ajuste = tempoDaPosicao(routine, alongamentoSeg);
  if (ajuste === 0) return null;
  return routineSeconds(routine, ajuste);
}

/** "22 min" a partir de segundos, arredondando para o minuto (mínimo 1). */
export function minutosDe(seg: number): number {
  return Math.max(1, Math.round(seg / 60));
}

/** Quanto dura ou quanto repete: "40 s", "12×", "livre". */
export function medidaDoPasso(p: PassoTocar): string {
  if (p.modo === 'reps') return `${p.reps}×`;
  if (p.modo === 'livre') return 'livre';
  return `${p.seg} s`;
}

export interface LinhaDaLista {
  ex: string;
  nome: string;
  /** Feito dos dois lados, um de cada vez. */
  cadaLado: boolean;
  modo: ModoPasso;
  seg: number;
  reps: number;
  nota?: string;
}

/** Lista do detalhe: uma rodada só, com os pares direita/esquerda juntos em uma linha ("cada lado"). */
export function linhasDaLista(passos: PassoTocar[], porRodada: number): LinhaDaLista[] {
  const linhas: LinhaDaLista[] = [];
  const rodada = passos.slice(0, porRodada);
  for (let i = 0; i < rodada.length; i++) {
    const p = rodada[i];
    if (!p) continue;
    const prox = rodada[i + 1];
    const par = p.lado === 'D' && prox !== undefined && prox.ex === p.ex && prox.lado === 'E';
    const linha: LinhaDaLista = { ex: p.ex, nome: p.nome, cadaLado: par, modo: p.modo, seg: p.seg, reps: p.reps };
    if (p.nota) linha.nota = p.nota;
    linhas.push(linha);
    if (par) i += 1;
  }
  return linhas;
}

function medidaFalada(p: PassoTocar): string {
  if (p.modo === 'reps') return `${p.reps} ${p.reps === 1 ? 'repetição' : 'repetições'}`;
  if (p.modo === 'livre') return 'Fique o tempo que quiser e toque em feito';
  return `${p.seg} segundos`;
}

/** O que a voz diz na transição para o passo `i`: a posição, o lado e quanto dura. */
export function anuncio(passos: PassoTocar[], i: number): string {
  const p = passos[i];
  if (!p) return '';
  const antes = i > 0 ? passos[i - 1] : undefined;
  if (antes && antes.ex === p.ex && p.lado && antes.lado && antes.lado !== p.lado) {
    return `Troque de lado. Agora, ${LADO_FALA[p.lado]}.`;
  }
  const partes: string[] = [];
  if (i === 0) partes.push('Vamos começar.');
  else if (p.rodada && antes?.rodada && antes.rodada[0] !== p.rodada[0]) partes.push(`Rodada ${p.rodada[0]} de ${p.rodada[1]}.`);
  else partes.push('A seguir.');
  partes.push(p.lado ? `${p.nome}, ${LADO_FALA[p.lado]}.` : `${p.nome}.`);
  partes.push(`${medidaFalada(p)}.`);
  return partes.join(' ');
}

/** Registro mais recente de uma rotina. */
export function ultimoRegistro(mob: MobilityLog[], rotinaId: string): MobilityLog | undefined {
  let achado: MobilityLog | undefined;
  for (const m of mob) {
    if (m.rotina === rotinaId && (!achado || m.data >= achado.data)) achado = m;
  }
  return achado;
}
