/**
 * Tipos de domínio do Prumo Treino. Este arquivo é o contrato entre os dados (src/data), o estado salvo no
 * aparelho (src/lib/store) e as telas (src/features). Não mude sem necessidade.
 *
 * Convenções:
 * - Datas são sempre strings locais "AAAA-MM-DD"; horas, "HH:MM".
 * - Os REGISTROS (corridas, musculação, peso) e a FICHA de musculação usam os mesmos nomes de campo do Prumo
 *   (o painel pessoal do Filipe), em português, para que backup e restauração funcionem entre os dois apps.
 * - O conteúdo estático próprio deste app (plano de corrida, biblioteca de exercícios, rotinas) usa os tipos abaixo.
 */

/** 0 = domingo … 6 = sábado (igual a Date.getDay()). */
export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;
export type ISODate = string;

/* ------------------------------------------------------------------ */
/* Perfil e zonas                                                      */
/* ------------------------------------------------------------------ */

export type ZoneId = 'leve' | 'continuo' | 'moderado' | 'forte';

export interface HrZone {
  id: ZoneId;
  label: string;
  /** Batimentos por minuto. */
  min: number;
  max: number;
  /** Como o esforço deve parecer, em uma frase curta. */
  feel: string;
}

export interface Profile {
  name: string;
  hrMax: number;
  zones: HrZone[];
  runDays: Weekday[];
  gymDays: Weekday[];
  /** Dias de alongamento: sem corrida nem musculação, o treino do dia é a rotina `stretchRoutine`. */
  stretchDays: Weekday[];
  /** id da rotina (data/routines) feita nos dias de alongamento. */
  stretchRoutine: string;
  watch: string;
}

/* ------------------------------------------------------------------ */
/* Plano de corrida (conteúdo estático)                                */
/* ------------------------------------------------------------------ */

export type RunFamily = 'regenerativo' | 'continuo' | 'longo' | 'fartlek' | 'intervalado' | 'progressivo' | 'regressivo';

export type Target =
  | { kind: 'fc'; min: number; max: number }
  | { kind: 'pse'; min: number; max: number }
  | { kind: 'livre' };

export type StepKind = 'aquecimento' | 'ritmo' | 'recuperacao' | 'desaquecimento';

export interface RunStep {
  kind: StepKind;
  sec: number;
  label: string;
  target: Target;
  /** Intensidade de 1 (muito leve) a 5 (forte): define a altura e a cor da barra no gráfico do treino. */
  level: 1 | 2 | 3 | 4 | 5;
}

export interface RunRepeat {
  times: number;
  steps: RunStep[];
}

export type RunBlock = RunStep | RunRepeat;

export interface RunWorkout {
  id: string;
  date: ISODate;
  title: string;
  family: RunFamily;
  minutes: number;
  /** Para que serve o treino, em uma frase. */
  purpose: string;
  /** Orientação completa, no estilo do treinador. */
  description: string;
  blocks: RunBlock[];
  tips?: string[];
  /** "Por que assim": o raciocínio do treinador para este treino, neste dia. Aparece sempre na tela do treino. */
  porque?: string;
  /** Quem montou o treino. */
  source: 'claude' | 'treinador';
  /** Já está no calendário do Garmin Connect. */
  onWatch: boolean;
}

export interface RunWeek {
  index: number;
  /** Segunda-feira da semana. */
  start: ISODate;
  theme: string;
  /** Recado do treinador para a semana. */
  note: string;
  workouts: RunWorkout[];
}

export interface RunPlan {
  id: string;
  name: string;
  goal: string;
  start: ISODate;
  end: ISODate;
  version: number;
  weeks: RunWeek[];
}

/* ------------------------------------------------------------------ */
/* Registros (mesmos campos do Prumo)                                  */
/* ------------------------------------------------------------------ */

/** Tipos de corrida do Prumo. */
export type RunTipo = 'Rodagem' | 'Longão' | 'Intervalado' | 'Tempo run' | 'Regenerativo' | 'Prova';

/** Corrida registrada. Campos até `fonte` são os do Prumo; os demais são extras deste app. */
export interface RunLog {
  id: string;
  data: ISODate;
  tipo: RunTipo;
  /** Distância em km. Pode faltar em corrida guiada ou na esteira sem medição. */
  km?: number;
  /** Duração em minutos. */
  min?: number;
  /** FC média em bpm. */
  fc?: number;
  elev?: number;
  cad?: number;
  /** Esforço percebido na escala do Prumo: 1 (leve) a 5 (máximo). Derivado de `pse` quando ele existe. */
  rpe?: number;
  obs?: string;
  fonte: 'manual' | 'garmin' | 'treino' | 'historico';
  /** id do treino do plano que originou o registro. */
  treinoId?: string;
  titulo?: string;
  /** Percepção de esforço de 1 a 10 (a escala usada pelo treinador). */
  pse?: number;
  /** Como se sentiu: 1 (péssimo) a 5 (ótimo). */
  sensacao?: 1 | 2 | 3 | 4 | 5;
  local?: 'rua' | 'esteira';
  fcMax?: number;
  /** id da atividade no intervals.icu, quando a corrida veio do relógio (Garmin). */
  garminId?: string;
}

/** Peso registrado (igual ao Prumo). */
export interface WeightLog {
  id: string;
  data: ISODate;
  kg: number;
  obs?: string;
}

/* ------------------------------------------------------------------ */
/* Musculação: ficha (mesma estrutura do catálogo do Prumo)            */
/* ------------------------------------------------------------------ */

export type FichaTipo = 'alongamento' | 'mobilidade' | 'aquecimento' | 'principal';
export type Metodo = 'rest-pause' | 'cluster-set' | 'super-set' | 'bi-set' | 'dead-stop' | 'drop-set';

/** Um bloco de séries de um exercício (um exercício pode ter bloco de aquecimento e bloco de trabalho). */
export interface SerieBloco {
  sets: number;
  /** Texto da ficha: "8-12", "4-4-4", "45 s", "30-45 s", "20/20". */
  reps: string;
  /** Repetições em reserva: "1-3". */
  rir?: string | null;
  /** Isometria por repetição: "2 s". */
  iso?: string | null;
  /** Carga da ficha em kg (0 = sem carga; null = não numérica, explicada em `nota`). */
  carga?: number | null;
  /** Descanso em segundos (null = não prescrito: vale o do par ou o padrão). */
  intervalo?: number | null;
  nota?: string;
  /** Drop-set: cargas em sequência, sem descanso. */
  drops?: number[];
}

export interface FichaExercicio {
  /** id permanente: "m-A-01" (programa-ficha-posição). É a chave de `Lift.sets` nos treinos gravados. */
  id: string;
  /** id do exercício no catálogo deste app (foto em assets/fotos, textos em data/ex e, se houver, animação em data/anim). */
  anim: string;
  nome: string;
  grupo: string;
  equipamento?: string;
  tipo: FichaTipo;
  /** Par combinado: exercícios com o mesmo código ("c1") são feitos alternados. */
  combinado?: string;
  series: SerieBloco[];
  metodo?: Metodo;
  /** Instruções do treinador, como estão na ficha. */
  instrucoes?: string;
}

export interface Ficha {
  /** Letra da ficha: "A", "B", "C". */
  id: string;
  nome: string;
  /** "Por que assim": o raciocínio do treinador para esta ficha. Aparece sempre na tela da ficha e em Hoje. */
  porque?: string;
  exercicios: FichaExercicio[];
}

export interface Programa {
  id: string;
  nome: string;
  objetivo: string;
  /** De onde veio. */
  fonte: string;
  fichas: Ficha[];
}

/** Alteração do usuário sobre um exercício da ficha (igual a settings.fichas do Prumo). */
export interface FichaAjuste {
  nome?: string;
  series?: number;
  carga?: number;
  intervalo?: number;
}

/* ------------------------------------------------------------------ */
/* Musculação: registros (mesmo documento `lifts` do Prumo)            */
/* ------------------------------------------------------------------ */

export interface SerieFeita {
  reps?: number;
  carga?: number;
  feito: boolean;
  /** Hora em que a série foi concluída ("HH:MM"). */
  t?: string;
}

export interface Pr {
  exId: string;
  nome: string;
  e1rm: number;
  carga: number;
  reps: number;
  anterior: number;
  medida: 'e1rm' | 'reps';
}

export interface Lift {
  id: string;
  data: ISODate;
  /** Letra da ficha. */
  ficha: string;
  /** Nome da ficha. */
  treino: string;
  programa: string;
  inicio?: string;
  fim?: string;
  /** Sessão guiada em andamento. Um treino só conta como feito quando emAndamento !== true e concluido !== false. */
  emAndamento?: boolean;
  concluido?: boolean;
  /** Séries feitas: exId → número da série ("1", "2"…) → o que foi feito. */
  sets?: Record<string, Record<string, SerieFeita>>;
  /** Exercícios pulados (ids). */
  pulados?: string[];
  /** Observação por exercício. */
  obsEx?: Record<string, string>;
  /** Duração em minutos. */
  min?: number;
  /** Volume em kg (soma de reps × carga das séries feitas). */
  volume?: number;
  prs?: Pr[];
  /** 1 (leve) a 5 (máxima). */
  intensidade?: number;
  cardio?: number;
  hora?: string;
  obs?: string;
  /** Extra deste app: epoch (ms) do início, para o cronômetro sobreviver ao fechamento do app. */
  inicioMs?: number;
  /** Extra deste app: troca de exercício na sessão (exId da ficha → id do catálogo usado no lugar). */
  trocas?: Record<string, string>;
}

/* ------------------------------------------------------------------ */
/* Biblioteca de exercícios (força, alongamento, educativos…)          */
/* ------------------------------------------------------------------ */

export type ExerciseKind = 'forca' | 'core' | 'alongamento' | 'educativo' | 'pes' | 'liberacao' | 'aquecimento';

export type MuscleGroup =
  | 'pernas' | 'gluteos' | 'posterior' | 'panturrilha'
  | 'peito' | 'costas' | 'ombros' | 'biceps' | 'triceps'
  | 'core' | 'quadril' | 'pes' | 'corpo-todo';

export interface Exercise {
  /** kebab-case sem acentos; igual ao id da animação em src/data/anim (ver docs/CATALOGO.md). */
  id: string;
  name: string;
  /** Outros nomes pelos quais o exercício é conhecido (como aparece na ficha, por exemplo). */
  aka?: string[];
  kind: ExerciseKind;
  group: MuscleGroup;
  muscles: { primary: string[]; secondary?: string[] };
  equipment: string[];
  /** Feito um lado de cada vez. */
  sided?: boolean;
  /** Execução em 3 a 5 passos curtos, no imperativo. */
  how: string[];
  /** 2 ou 3 dicas do que sentir e onde prestar atenção. */
  cues: string[];
  /** 2 ou 3 erros comuns. */
  mistakes: string[];
  breath?: string;
  easier?: string;
  harder?: string;
  /** ids do catálogo que substituem este quando o aparelho está ocupado. */
  swap?: string[];
  /** Termos de busca para ver um vídeo real no YouTube. */
  yt: string;
}

/* ------------------------------------------------------------------ */
/* Mobilidade (alongamento, educativos, pés, liberação, aquecimento)   */
/* ------------------------------------------------------------------ */

export type RoutineKind = 'alongamento' | 'educativos' | 'pes' | 'liberacao' | 'aquecimento' | 'core';

export interface RoutineStep {
  /** id do exercício no catálogo. */
  ex: string;
  side?: 'D' | 'E';
  /** Passo por tempo (segundos) OU por repetições. */
  sec?: number;
  reps?: number;
  note?: string;
}

export interface Routine {
  id: string;
  name: string;
  kind: RoutineKind;
  minutes: number;
  /** Quando fazer: "Depois da corrida", "Em qualquer horário"… */
  when: string;
  description: string;
  /** Segundos para trocar de posição entre os passos. */
  transition: number;
  /** O tempo de cada posição segue o ajuste "tempo por posição" do usuário (rotinas de alongamento). */
  userTimed?: boolean;
  steps: RoutineStep[];
}

export interface MobilityLog {
  id: string;
  data: ISODate;
  rotina: string;
  nome: string;
  /** Duração em segundos. */
  seg: number;
  completo: boolean;
}

/* ------------------------------------------------------------------ */
/* Ajustes e estado salvo no aparelho                                  */
/* ------------------------------------------------------------------ */

export type PlanoTipo = 'musc' | 'corrida' | 'ambos' | 'descanso';

export interface DiaPlano {
  tipo: PlanoTipo;
  /** Ficha fixa do dia (letra). Sem ela, vale a próxima da rotação. */
  ficha?: string;
}

export interface Settings {
  nome: string;
  nascimento?: ISODate;
  alturaCm?: number;
  pesoMeta?: number;
  tema: 'auto' | 'escuro' | 'claro';
  som: boolean;
  voz: boolean;
  vibrar: boolean;
  /** Manter a tela ligada durante treinos guiados. */
  telaLigada: boolean;
  /** Descanso padrão entre séries, em segundos, quando a ficha não define. */
  descansoPadrao: number;
  /** Segundos por posição nas rotinas de alongamento (0 = tempo livre). */
  alongamentoSeg: number;
  fcMax: number;
  zonas: HrZone[];
  /** id do programa de musculação em uso. */
  programa: string;
  /** Plano da semana por dia (chave = Weekday, 0 = domingo). */
  plano: Record<number, DiaPlano>;
  /** Alterações do usuário sobre a ficha: exId → ajuste. */
  fichas?: Record<string, FichaAjuste>;
}

export type PlanMark = 'feito' | 'pulado';

export interface AppState {
  /** Versão do esquema, para migrações. */
  v: number;
  criadoEm: number;
  settings: Settings;
  runs: RunLog[];
  lifts: Lift[];
  weights: WeightLog[];
  mob: MobilityLog[];
  /** Marcação manual de treinos de corrida do plano, por id do treino. */
  marcas: Record<string, PlanMark>;
  ultimoBackup?: number;
  /** Quando o histórico (TrainingPeaks / Garmin) foi importado. */
  historicoEm?: number;
}
