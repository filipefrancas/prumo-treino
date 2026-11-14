/**
 * Boneco articulado ("rig") usado nas animações de exercícios.
 *
 * Sistema de coordenadas: o palco é um viewBox de 240 × 180, com x para a direita e y para BAIXO.
 * Ângulos em graus no plano da tela: 0 = direita, 90 = baixo, 180 = esquerda, -90 (ou 270) = cima.
 * O chão padrão fica em y = 160; um pé apoiado tem o tornozelo em y = chão - 3.
 */

export type Vec = readonly [number, number];
export type View = 'side' | 'front';

/**
 * Direção para onde a articulação do meio (cotovelo ou joelho) deve apontar quando o membro é resolvido por IK.
 * 'front'/'back' são relativos ao corpo (lado do peito / lado das costas); 'up'/'down'/'left'/'right' são relativos à tela.
 * 'cam' = dobra em direção à câmera: o membro é desenhado reto e encurtado (padrão dos joelhos na vista de frente).
 */
export type Pole = 'front' | 'back' | 'up' | 'down' | 'left' | 'right' | 'cam' | Vec;

/** Articulações às quais uma mão pode ficar presa (tudo menos os próprios braços). */
export type HandAnchor =
  | 'hip' | 'hipN' | 'hipF'
  | 'shoulder' | 'shoulderN' | 'shoulderF'
  | 'head'
  | 'kneeN' | 'ankleN' | 'toeN' | 'heelN'
  | 'kneeF' | 'ankleF' | 'toeF' | 'heelF';
export type Rel = { at: HandAnchor; d?: Vec };
/** Uso interno da interpolação: mistura de dois alvos de tipos diferentes. */
export type Blend = { blend: readonly [Vec | Rel, Vec | Rel, number] };
export type HandTarget = Vec | Rel | Blend;

export interface Pose {
  /** Centro do quadril. */
  hip: Vec;
  /** Ângulo da coluna, do quadril para os ombros. -90 = tronco em pé; 0 = deitado com a cabeça à direita; 180 = cabeça à esquerda. */
  torso: number;
  /** Encurtamento do tronco por perspectiva (1 = normal). */
  torsoScale?: number;
  /** Ângulo do pescoço (dos ombros para a cabeça). Padrão: igual ao tronco. */
  head?: number;

  /**
   * Braço próximo (N) e distante (F): use mão-alvo (IK) OU ângulos [braço, antebraço] (FK), nunca os dois no mesmo exercício.
   * A mão-alvo pode ser um ponto do palco ([x, y]) ou ficar presa a uma articulação já resolvida
   * ({ at: 'kneeN', d: [2, 3] } = segurando o joelho), o que mantém a mão no lugar enquanto o corpo se move.
   */
  handN?: HandTarget;
  handF?: HandTarget;
  elbowN?: Pole;
  elbowF?: Pole;
  armN?: readonly [number, number];
  armF?: readonly [number, number];
  armScaleN?: number;
  armScaleF?: number;

  /** Perna próxima (N) e distante (F): use tornozelo-alvo (IK) OU ângulos [coxa, canela] (FK). */
  footN?: Vec;
  footF?: Vec;
  kneeN?: Pole;
  kneeF?: Pole;
  legN?: readonly [number, number];
  legF?: readonly [number, number];
  legScaleN?: number;
  legScaleF?: number;
  /** Direção do pé (do calcanhar para os dedos). Padrão: perpendicular à canela, apontando para a frente do corpo. */
  footAngleN?: number;
  footAngleF?: number;
}

export type Ease = 'inOut' | 'in' | 'out' | 'linear';

export interface Key {
  /** Campos que mudam em relação à pose base. */
  pose: Partial<Pose>;
  /** Segundos para chegar a esta key vindo da anterior (a key 0 é alcançada a partir da última: o ciclo fecha). */
  dur: number;
  /** Pausa, em segundos, ao chegar nesta key. */
  hold?: number;
  ease?: Ease;
}

export type JointName =
  | 'hip' | 'hipN' | 'hipF'
  | 'shoulder' | 'shoulderN' | 'shoulderF'
  | 'head'
  | 'elbowN' | 'handN' | 'elbowF' | 'handF'
  | 'kneeN' | 'ankleN' | 'toeN' | 'heelN'
  | 'kneeF' | 'ankleF' | 'toeF' | 'heelF';

export type Joints = Record<JointName, Vec>;

/** Ponto de um acessório: fixo no palco ([x, y]) ou preso a uma articulação, com deslocamento opcional. */
export type P = Vec | { at: JointName; d?: Vec };

export type Tone = 'eq' | 'eq2' | 'hl' | 'soft';

export type Prop =
  | { k: 'line'; from: P; to: P; w?: number; tone?: Tone; layer?: 'back' | 'front' }
  | { k: 'circle'; c: P; r: number; ring?: number; tone?: Tone; layer?: 'back' | 'front' }
  | {
      k: 'rect';
      c: P;
      w: number;
      h: number;
      /** Rotação fixa, em graus. Somada à direção de `along`, quando houver. */
      rot?: number;
      /** Alinha o retângulo com a direção entre dois pontos (por exemplo, cotovelo → mão), acompanhando o movimento. */
      along?: readonly [P, P];
      r?: number;
      tone?: Tone;
      layer?: 'back' | 'front';
    };

/** Segmentos do corpo e zonas musculares que podem receber a cor de destaque. */
export type Focus =
  | 'upperArmN' | 'forearmN' | 'upperArmF' | 'forearmF'
  | 'thighN' | 'shinN' | 'thighF' | 'shinF'
  | 'torso' | 'chest' | 'abs' | 'upperBack' | 'lowerBack' | 'glutes'
  | 'shoulderN' | 'shoulderF' | 'hipN' | 'hipF' | 'neck';

export interface Arrow {
  from: P;
  to: P;
  /** Curvatura: 0 = reta; positivo curva para um lado, negativo para o outro (em unidades do palco). */
  bend?: number;
}

export type Part = 'legF' | 'armF' | 'torso' | 'head' | 'legN' | 'armN';

export interface RigDef {
  id: string;
  view: View;
  /** 1 (padrão): de pé, o boneco olha para a direita. -1: espelha a frente do corpo. */
  facing?: 1 | -1;
  /** y do chão (padrão 160). null esconde o chão e a sombra. */
  ground?: number | null;
  base: Pose;
  /** Ciclo da animação: key 0 → key 1 → … → key 0. Uma única key gera uma pose parada. */
  keys: Key[];
  props?: Prop[];
  focus?: Focus[];
  arrows?: Arrow[];
  /** Ordem de desenho, do fundo para a frente. Padrão: legF, armF, torso, head, legN, armN. */
  order?: Part[];
  /** Índice da key usada na miniatura. Padrão: 1 quando existe, senão 0. */
  thumb?: number;
}

export type Prim =
  | { k: 'line'; id: string; a: Vec; b: Vec; w: number; cls: string }
  | { k: 'circle'; id: string; c: Vec; r: number; cls: string; ring?: number }
  | { k: 'ellipse'; id: string; c: Vec; rx: number; ry: number; cls: string }
  | { k: 'poly'; id: string; pts: Vec[]; w: number; cls: string }
  | { k: 'rect'; id: string; c: Vec; w: number; h: number; rot: number; r: number; cls: string }
  | { k: 'path'; id: string; d: string; w: number; cls: string };
