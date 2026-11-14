/**
 * Máquina de estados da rotina guiada. Todo o tempo vem do relógio (`agora` = Date.now()): o estado guarda
 * QUANDO cada fase começou, nunca quantos "tiques" passaram. Se o iPhone bloquear a tela e os intervalos
 * pararem, `avancar` recalcula tudo de uma vez ao voltar. Funções puras: recebem o estado e devolvem outro.
 */
import type { PassoTocar } from './rotina.ts';

/** prep: transição anunciando a posição · ativo: a posição valendo · fim: resumo. */
export type Fase = 'prep' | 'ativo' | 'fim';

export interface Tocador {
  idx: number;
  fase: Fase;
  /** Início da fase atual (ms). Ao retomar de uma pausa ele é empurrado para a frente pelo tempo pausado. */
  t0: number;
  /** Início da rotina (ms), também empurrado pelas pausas: `agora − inicio` é o tempo de treino. */
  inicio: number;
  /** Momento em que pausou (ms), ou null. */
  pausa: number | null;
  /** Momento em que terminou (ms), só na fase "fim". */
  fimEm: number | null;
  feitos: number[];
  pulados: number[];
}

/** Segundos mínimos da primeira transição: dá tempo de ouvir o nome da posição e se ajeitar. */
const PREP_INICIAL = 5;
/** Depois deste tempo na posição, "Voltar" recomeça a mesma posição em vez de ir para a anterior. */
const VOLTA_REINICIA_MS = 3000;

export function iniciar(agora: number): Tocador {
  return { idx: 0, fase: 'prep', t0: agora, inicio: agora, pausa: null, fimEm: null, feitos: [], pulados: [] };
}

/** Duração da transição antes do passo `idx`, em segundos. */
export function prepSeg(idx: number, transicao: number): number {
  return idx === 0 ? Math.max(PREP_INICIAL, transicao) : Math.max(1, transicao);
}

/** O relógio visto pelo tocador: parado no instante da pausa. */
const relogio = (s: Tocador, agora: number): number => s.pausa ?? agora;

/** Milissegundos decorridos na fase atual. */
export function decorridoMs(s: Tocador, agora: number): number {
  return Math.max(0, relogio(s, agora) - s.t0);
}

/** Segundos de treino até agora (ou até o fim), sem contar as pausas. */
export function totalSeg(s: Tocador, agora: number): number {
  const ate = s.fimEm ?? relogio(s, agora);
  return Math.max(0, Math.round((ate - s.inicio) / 1000));
}

const sem = (lista: number[], i: number): number[] => lista.filter((x) => x !== i);
const com = (lista: number[], i: number): number[] => (lista.includes(i) ? lista : [...lista, i]);

/** Vai para o passo seguinte (transição) ou encerra, no instante `quando`. */
function seguinte(s: Tocador, total: number, quando: number): Tocador {
  if (s.idx + 1 >= total) return { ...s, fase: 'fim', t0: quando, fimEm: quando };
  return { ...s, idx: s.idx + 1, fase: 'prep', t0: quando };
}

/**
 * Aplica o que o relógio já decidiu: a transição que acabou vira posição valendo; a posição por tempo que
 * acabou conta como feita e passa para a próxima. Posições por repetição ou em tempo livre esperam o "Feito".
 */
export function avancar(s: Tocador, passos: PassoTocar[], transicao: number, agora: number): Tocador {
  if (s.pausa !== null || s.fase === 'fim') return s;
  let e = s;
  for (let guarda = 0; guarda < passos.length * 2 + 2; guarda++) {
    const p = passos[e.idx];
    if (!p) return { ...e, fase: 'fim', fimEm: e.fimEm ?? agora };
    if (e.fase === 'prep') {
      const fim = e.t0 + prepSeg(e.idx, transicao) * 1000;
      if (agora < fim) return e;
      e = { ...e, fase: 'ativo', t0: fim };
    } else if (e.fase === 'ativo') {
      if (p.modo !== 'tempo') return e;
      const fim = e.t0 + p.seg * 1000;
      if (agora < fim) return e;
      e = seguinte({ ...e, feitos: com(e.feitos, e.idx), pulados: sem(e.pulados, e.idx) }, passos.length, fim);
    } else return e;
  }
  return e;
}

export function pausar(s: Tocador, agora: number): Tocador {
  if (s.pausa !== null || s.fase === 'fim') return s;
  return { ...s, pausa: agora };
}

export function retomar(s: Tocador, agora: number): Tocador {
  if (s.pausa === null) return s;
  const parado = Math.max(0, agora - s.pausa);
  return { ...s, pausa: null, t0: s.t0 + parado, inicio: s.inicio + parado };
}

/** Pula a transição: a posição começa a valer agora. */
export function comecarJa(s: Tocador, agora: number): Tocador {
  const e = retomar(s, agora);
  return e.fase === 'prep' ? { ...e, fase: 'ativo', t0: agora } : e;
}

/** "Feito": conclui a posição atual (repetições ou tempo livre; também vale para adiantar uma por tempo). */
export function concluir(s: Tocador, total: number, agora: number): Tocador {
  const e = retomar(s, agora);
  if (e.fase !== 'ativo') return e;
  return seguinte({ ...e, feitos: com(e.feitos, e.idx), pulados: sem(e.pulados, e.idx) }, total, agora);
}

/** Pula a posição atual (fica marcada como pulada) e vai para a próxima. */
export function pular(s: Tocador, total: number, agora: number): Tocador {
  const e = retomar(s, agora);
  if (e.fase === 'fim') return e;
  return seguinte({ ...e, pulados: com(e.pulados, e.idx), feitos: sem(e.feitos, e.idx) }, total, agora);
}

/**
 * Voltar: com a posição valendo há mais de 3 s, recomeça a mesma posição; senão volta para a transição da
 * posição anterior (que deixa de contar como feita ou pulada).
 */
export function voltar(s: Tocador, agora: number): Tocador {
  const e = retomar(s, agora);
  if (e.fase === 'fim') return e;
  if (e.fase === 'ativo' && agora - e.t0 > VOLTA_REINICIA_MS) return { ...e, t0: agora };
  const idx = Math.max(0, e.idx - 1);
  return { ...e, idx, fase: 'prep', t0: agora, feitos: sem(e.feitos, idx), pulados: sem(e.pulados, idx) };
}
