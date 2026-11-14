/* Musculação: textos, formatos e pequenos componentes usados por mais de uma tela da feature. */
import type { ComponentChildren } from 'preact';
import { FATOR_RETORNO } from '../../data/coach.ts';
import { exById } from '../../data/ex/_index.ts';
import {
  METODO_ROTULO,
  ehPrincipal,
  liftsFeitos,
  seriesPlanejadas,
  type Sugestao,
} from '../../lib/academia.ts';
import { fmtData, fmtDiaMes, fmtRelativa } from '../../lib/dates.ts';
import { num } from '../../lib/format.ts';
import { update } from '../../lib/store.ts';
import type {
  ExerciseKind,
  Ficha,
  FichaExercicio,
  FichaTipo,
  ISODate,
  Lift,
  MuscleGroup,
  SerieBloco,
  Settings,
} from '../../types.ts';
import { ExMedia, Icon, cx, type FigureTone } from '../../ui/index.ts';

/* ------------------------------------------------------------------ */
/* Rótulos                                                             */
/* ------------------------------------------------------------------ */

export const KIND_ROTULO: Record<ExerciseKind, string> = {
  forca: 'Força',
  core: 'Core',
  alongamento: 'Alongamento',
  educativo: 'Educativo de corrida',
  pes: 'Pés e tornozelos',
  liberacao: 'Liberação miofascial',
  aquecimento: 'Aquecimento',
};

export const KIND_CURTO: Record<ExerciseKind, string> = {
  forca: 'Força',
  core: 'Core',
  alongamento: 'Alongamento',
  educativo: 'Educativos',
  pes: 'Pés',
  liberacao: 'Liberação',
  aquecimento: 'Aquecimento',
};

export const GRUPO_ROTULO: Record<MuscleGroup, string> = {
  pernas: 'Pernas',
  gluteos: 'Glúteos',
  posterior: 'Posterior de coxa',
  panturrilha: 'Panturrilha',
  peito: 'Peito',
  costas: 'Costas',
  ombros: 'Ombros',
  biceps: 'Bíceps',
  triceps: 'Tríceps',
  core: 'Core',
  quadril: 'Quadril',
  pes: 'Pés',
  'corpo-todo': 'Corpo todo',
};

export const TIPO_ROTULO: Record<FichaTipo, string> = {
  alongamento: 'Alongamento',
  mobilidade: 'Mobilidade',
  aquecimento: 'Aquecimento',
  principal: 'Principal',
};

/** Cor do destaque da figura conforme o tipo do exercício no catálogo. */
export function tomDoTipo(kind: ExerciseKind | undefined): FigureTone {
  if (kind === 'educativo') return 'corrida';
  if (kind === 'alongamento' || kind === 'pes' || kind === 'liberacao' || kind === 'aquecimento') return 'mob';
  return 'musc';
}

/** Cor do destaque da figura para um item da ficha (preparação em verde-água, principal em lilás). */
export function tomDaFicha(ex: FichaExercicio): FigureTone {
  return ehPrincipal(ex) ? 'musc' : 'mob';
}

export const maiuscula = (s: string): string => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);

/** "Quadríceps · máquina". */
export function metaDoEx(ex: FichaExercicio): string {
  return [maiuscula(ex.grupo), ex.equipamento].filter(Boolean).join(' · ');
}

export { METODO_ROTULO };

/* ------------------------------------------------------------------ */
/* Formatos                                                            */
/* ------------------------------------------------------------------ */

/** Volume em kg inteiros com separador de milhar: 9840 → "9.840". */
export function fmtVolume(v: number): string {
  return Math.round(v).toLocaleString('pt-BR');
}

/** "3 × 8-12 · RIR 1-3 · 40 kg · descanso 90 s" (o que a ficha pede em um bloco de séries). */
export function alvoDoBloco(b: SerieBloco): string {
  const partes: string[] = [`${b.sets} × ${b.reps}`];
  if (b.rir) partes.push(`RIR ${b.rir}`);
  if (b.iso) partes.push(`isometria ${b.iso}`);
  if (b.drops && b.drops.length > 1) partes.push(`${b.drops.map((d) => num(d, 2)).join(' → ')} kg`);
  else if (typeof b.carga === 'number' && b.carga > 0) partes.push(`${num(b.carga, 2)} kg`);
  if (typeof b.intervalo === 'number' && b.intervalo > 0) partes.push(`descanso ${b.intervalo} s`);
  // dentro de cada parte o espaço não quebra: a linha só parte nos " · "
  return partes.map((p) => p.replace(/ /g, ' ')).join(' · ');
}

/** Séries feitas agrupadas pela carga: "25 kg × 12 / 42,5 kg × 10 · 10 · 9"; sem carga, "12 · 12 · 10 reps". */
export function resumoDasSeries(sets: { reps?: number; carga?: number }[]): string {
  const grupos: { carga: number; reps: number[] }[] = [];
  for (const s of sets) {
    const carga = s.carga ?? 0;
    const ult = grupos[grupos.length - 1];
    if (ult && ult.carga === carga) ult.reps.push(s.reps ?? 0);
    else grupos.push({ carga, reps: [s.reps ?? 0] });
  }
  return grupos
    .map((g) => {
      const reps = g.reps.filter((r) => r > 0);
      if (reps.length === 0) return g.carga > 0 ? `${num(g.carga, 2)} kg` : `${g.reps.length} × feito`;
      return g.carga > 0 ? `${num(g.carga, 2)} kg × ${reps.join(' · ')}` : `${reps.join(' · ')} reps`;
    })
    .join(' / ');
}

/** Uma série em poucas letras: "40 kg × 10", "12 reps", "feito". */
export function serieCurta(carga: number | undefined, reps: number | undefined): string {
  const c = carga ?? 0;
  const r = reps ?? 0;
  if (c > 0 && r > 0) return `${num(c, 2)} kg × ${r}`;
  if (c > 0) return `${num(c, 2)} kg`;
  if (r > 0) return `${r} reps`;
  return 'feito';
}

/** Carga arredondada para o meio quilo. */
export const r05 = (x: number): number => Math.round(x * 2) / 2;

/** Carga inicial na volta: a da ficha × 0,75, arredondada para 0,5 kg. */
export function cargaDeRetorno(cargaDaFicha: number): number {
  return r05(cargaDaFicha * FATOR_RETORNO);
}

export const LEGENDA_RETORNO = 'Sugestão do treinador: 75% da ficha (as cargas são de ago/2025)';

/** A frase da sugestão para a interface e o tom dela. `primeiraVez` = sem histórico do exercício. */
export function fraseDaSugestao(sug: Sugestao, primeiraVez: boolean, ex: FichaExercicio): { texto: string; tom: 'good' | 'accent' | 'muted' } | undefined {
  if (!ehPrincipal(ex)) return undefined;
  if (primeiraVez) {
    const temCarga = ex.series.some((b) => typeof b.carga === 'number' && b.carga > 0);
    return temCarga ? { texto: LEGENDA_RETORNO, tom: 'accent' } : { texto: 'Primeira vez: comece leve e anote o que fez', tom: 'muted' };
  }
  if (sug.tipo === 'sobe' || sug.tipo === 'reps') return { texto: sug.motivo, tom: 'good' };
  if (sug.tipo === 'repete') return { texto: sug.motivo, tom: 'muted' };
  return undefined;
}

/** Tempo estimado da ficha em minutos (múltiplo de 5): execução, descanso e troca de aparelho. */
export function minutosEstimados(ficha: Ficha, s: Settings): number {
  let seg = 0;
  for (const ex of ficha.exercicios) {
    const principal = ehPrincipal(ex);
    for (const p of seriesPlanejadas(ex)) seg += (p.segundos ?? 40) + (principal ? (p.intervalo ?? s.descansoPadrao) : 15);
    seg += 45;
  }
  return Math.max(5, Math.round(seg / 60 / 5) * 5);
}

/** Último treino feito da ficha (pela letra). */
export function ultimoDaFicha(lifts: Lift[], letra: string, antesDe?: Lift): Lift | undefined {
  const feitos = liftsFeitos(lifts).filter((l) => l.ficha === letra && l.id !== antesDe?.id);
  return feitos[feitos.length - 1];
}

/** "há 3 dias" perto de hoje; mais longe, "seg 9 nov". */
export function quando(data: ISODate, ref: ISODate): string {
  return fmtRelativa(data, ref);
}

export { fmtData, fmtDiaMes };

/** Nome do exercício do catálogo usado no lugar do da ficha (troca na sessão), ou o da ficha. */
export function nomeEmUso(ex: FichaExercicio, troca: string | undefined): string {
  if (!troca) return ex.nome;
  return exById(troca)?.name ?? ex.nome;
}

/* ------------------------------------------------------------------ */
/* Gravação                                                            */
/* ------------------------------------------------------------------ */

/** Troca o treino `id` em state.lifts pelo resultado de `fn` (os auxiliares de lib/academia devolvem um Lift novo). */
export function gravarLift(id: string, fn: (l: Lift) => Lift): void {
  update((d) => {
    const i = d.lifts.findIndex((l) => l.id === id);
    const atual = d.lifts[i];
    if (i >= 0 && atual) d.lifts[i] = fn(atual);
  });
}

export function apagarLift(id: string): void {
  update((d) => {
    d.lifts = d.lifts.filter((l) => l.id !== id);
  });
}

/* ------------------------------------------------------------------ */
/* Componentes                                                         */
/* ------------------------------------------------------------------ */

/** Letra da ficha em display, na cor da musculação. */
export function Letra({ children, size = 'md' }: { children: ComponentChildren; size?: 'sm' | 'md' | 'lg' }) {
  return (
    <span class={cx('mu-letra', `is-${size}`)} aria-hidden="true">
      {children}
    </span>
  );
}

/** Miniatura do exercício (figura parada por padrão). */
export function Mini({ anim, tone, play = 'never', size = 'md' }: { anim: string; tone: FigureTone; play?: 'never' | 'visible'; size?: 'sm' | 'md' | 'lg' }) {
  return <ExMedia id={anim} tone={tone} play={play} class={cx('mu-mini', `is-${size}`)} />;
}

/** Linha de nota com ícone: sugestão de carga, aviso da semana. */
export function Nota({ icon, tom = 'muted', children }: { icon: 'subir' | 'info' | 'alvo' | 'nota' | 'repetir' | 'alerta' | 'trocar'; tom?: 'good' | 'accent' | 'muted' | 'warn'; children: ComponentChildren }) {
  return (
    <p class={cx('mu-nota', `is-${tom}`)}>
      <Icon name={icon} size={14} />
      <span>{children}</span>
    </p>
  );
}

/** Busca sem acentos e sem caixa. */
export function semAcento(s: string): string {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}
