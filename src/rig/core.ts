import type { Arrow, Ease, Focus, HandTarget, JointName, Joints, Key, P, Part, Pole, Pose, Prim, Prop, Rel, RigDef, Vec } from './types.ts';

/** Palco. */
export const STAGE = { w: 240, h: 180, ground: 160 } as const;

/** Comprimentos dos ossos, em unidades do palco (boneco em pé ≈ 104 de altura). */
export const BONE = {
  head: 7.2,
  neck: 12.5,
  torso: 31,
  upperArm: 16.5,
  forearm: 15.5,
  hand: 3.1,
  thigh: 24.5,
  shin: 23.5,
  footBack: 1.8,
  footFront: 7.8,
  shoulderHalf: 8.5,
  hipHalf: 5,
} as const;

/** Espessuras dos traços. */
export const WIDTH = {
  torsoSide: 13.5,
  torsoFront: 9,
  upperArm: 6.2,
  forearm: 5.4,
  thigh: 9,
  shin: 7.2,
  foot: 5.4,
} as const;

/** Altura do tornozelo quando o pé está apoiado no chão. */
export const ANKLE_H = 3;

const DEG = Math.PI / 180;

export const dir = (deg: number): Vec => [Math.cos(deg * DEG), Math.sin(deg * DEG)];
export const add = (a: Vec, b: Vec): Vec => [a[0] + b[0], a[1] + b[1]];
export const sub = (a: Vec, b: Vec): Vec => [a[0] - b[0], a[1] - b[1]];
export const mul = (a: Vec, k: number): Vec => [a[0] * k, a[1] * k];
export const dot = (a: Vec, b: Vec): number => a[0] * b[0] + a[1] * b[1];
export const len = (a: Vec): number => Math.hypot(a[0], a[1]);
export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;
export const lerpV = (a: Vec, b: Vec, t: number): Vec => [lerp(a[0], b[0], t), lerp(a[1], b[1], t)];
export const angleOf = (v: Vec): number => Math.atan2(v[1], v[0]) / DEG;
const norm = (a: Vec): Vec => {
  const l = len(a);
  return l < 1e-9 ? [1, 0] : [a[0] / l, a[1] / l];
};

const EASE: Record<Ease, (t: number) => number> = {
  linear: (t) => t,
  in: (t) => t * t,
  out: (t) => 1 - (1 - t) * (1 - t),
  inOut: (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2),
};

/* ------------------------------------------------------------------ */
/* Linha do tempo                                                      */
/* ------------------------------------------------------------------ */

export function loopDuration(def: RigDef): number {
  if (def.keys.length < 2) return 0;
  return def.keys.reduce((s, k) => s + Math.max(0, k.dur) + Math.max(0, k.hold ?? 0), 0);
}

function keyPose(def: RigDef, i: number): Pose {
  const key = def.keys[i] as Key;
  return { ...def.base, ...key.pose };
}

const NUM_FIELDS = [
  'torso', 'torsoScale', 'head',
  'armScaleN', 'armScaleF', 'legScaleN', 'legScaleF',
  'footAngleN', 'footAngleF',
] as const;
const VEC_FIELDS = ['hip', 'footN', 'footF'] as const;
const HAND_FIELDS = ['handN', 'handF'] as const;

const isVec = (v: unknown): v is Vec => Array.isArray(v);
const isRel = (v: unknown): v is Rel => typeof v === 'object' && v !== null && 'at' in v;

function mixHand(a: HandTarget | undefined, b: HandTarget | undefined, t: number): HandTarget | undefined {
  if (!a || !b) return a ?? b;
  if (isVec(a) && isVec(b)) return lerpV(a, b, t);
  if (isRel(a) && isRel(b) && a.at === b.at) return { at: a.at, d: lerpV(a.d ?? [0, 0], b.d ?? [0, 0], t) };
  if ((isVec(a) || isRel(a)) && (isVec(b) || isRel(b))) return { blend: [a, b, t] };
  return t < 0.5 ? a : b;
}
const PAIR_FIELDS = ['armN', 'armF', 'legN', 'legF'] as const;
const POLE_FIELDS = ['elbowN', 'elbowF', 'kneeN', 'kneeF'] as const;

export function mixPose(a: Pose, b: Pose, t: number): Pose {
  const out: Record<string, unknown> = {};
  for (const f of VEC_FIELDS) {
    const va = a[f];
    const vb = b[f];
    if (va && vb) out[f] = lerpV(va, vb, t);
    else if (va || vb) out[f] = va ?? vb;
  }
  for (const f of HAND_FIELDS) {
    const h = mixHand(a[f], b[f], t);
    if (h) out[f] = h;
  }
  for (const f of NUM_FIELDS) {
    const na = a[f];
    const nb = b[f];
    if (na !== undefined && nb !== undefined) out[f] = lerp(na, nb, t);
    else if (na !== undefined || nb !== undefined) {
      // Só um dos lados define o campo: o outro usa o padrão, então não há como interpolar com segurança.
      out[f] = t < 0.5 ? na : nb;
    }
  }
  for (const f of PAIR_FIELDS) {
    const pa = a[f];
    const pb = b[f];
    if (pa && pb) out[f] = [lerp(pa[0], pb[0], t), lerp(pa[1], pb[1], t)];
    else if (pa || pb) out[f] = pa ?? pb;
  }
  for (const f of POLE_FIELDS) {
    const pa = a[f];
    const pb = b[f];
    if (Array.isArray(pa) && Array.isArray(pb)) out[f] = lerpV(pa as Vec, pb as Vec, t);
    else out[f] = t < 0.5 ? (pa ?? pb) : (pb ?? pa);
  }
  return out as unknown as Pose;
}

/** Pose no instante t (segundos), percorrendo o ciclo de keys. */
export function poseAt(def: RigDef, tSec: number): Pose {
  const n = def.keys.length;
  if (n === 0) return def.base;
  if (n === 1) return keyPose(def, 0);
  const total = loopDuration(def);
  if (total <= 0) return keyPose(def, 0);
  let t = ((tSec % total) + total) % total;
  // Começa parado na key 0 (hold 0), depois segue para 1, 2, …, e volta para 0.
  for (let i = 0; i < n; i++) {
    const cur = def.keys[i] as Key;
    const hold = Math.max(0, cur.hold ?? 0);
    if (t < hold) return keyPose(def, i);
    t -= hold;
    const j = (i + 1) % n;
    const next = def.keys[j] as Key;
    const d = Math.max(0, next.dur);
    if (t < d) {
      const u = EASE[next.ease ?? 'inOut'](d === 0 ? 1 : t / d);
      return mixPose(keyPose(def, i), keyPose(def, j), u);
    }
    t -= d;
  }
  return keyPose(def, 0);
}

/** Instante (s) em que o ciclo está parado exatamente na key i. */
export function timeOfKey(def: RigDef, index: number): number {
  let t = 0;
  for (let i = 0; i < def.keys.length; i++) {
    if (i === index) return t;
    const cur = def.keys[i] as Key;
    const next = def.keys[(i + 1) % def.keys.length] as Key;
    t += Math.max(0, cur.hold ?? 0) + Math.max(0, next.dur);
  }
  return 0;
}

/* ------------------------------------------------------------------ */
/* Cinemática                                                          */
/* ------------------------------------------------------------------ */

function poleVec(p: Pole | undefined, fallback: Pole, frontN: Vec): Vec | 'cam' {
  const v = p ?? fallback;
  if (typeof v !== 'string') return v as Vec;
  switch (v) {
    case 'cam': return 'cam';
    case 'front': return frontN;
    case 'back': return mul(frontN, -1);
    case 'up': return [0, -1];
    case 'down': return [0, 1];
    case 'left': return [-1, 0];
    case 'right': return [1, 0];
  }
}

/** IK de dois ossos. Devolve a articulação do meio e a ponta (que pode não alcançar um alvo fora de alcance). */
export function ik2(root: Vec, target: Vec, a: number, b: number, pole: Vec | 'cam'): { mid: Vec; end: Vec; reach: number } {
  const raw = sub(target, root);
  const dRaw = len(raw);
  const u = norm(raw);
  if (pole === 'cam') {
    // A articulação dobra na direção da câmera: o membro aparece reto e encurtado pela perspectiva.
    const dCam = Math.min(a + b, dRaw);
    const endCam = add(root, mul(u, dCam));
    return { mid: add(root, mul(u, (dCam * a) / (a + b))), end: endCam, reach: dRaw - dCam };
  }
  const dMin = Math.abs(a - b) + 0.01;
  const dMax = a + b - 0.01;
  const d = Math.min(dMax, Math.max(dMin, dRaw));
  const x = (a * a - b * b + d * d) / (2 * d);
  const h = Math.sqrt(Math.max(0, a * a - x * x));
  const base = add(root, mul(u, x));
  const n: Vec = [-u[1], u[0]];
  const m1 = add(base, mul(n, h));
  const m2 = sub(base, mul(n, h));
  const mid = dot(sub(m1, base), pole) >= dot(sub(m2, base), pole) ? m1 : m2;
  return { mid, end: add(root, mul(u, d)), reach: dRaw - d };
}

export interface Solved {
  joints: Joints;
  /** Normal que aponta para a frente do corpo (lado do peito). */
  front: Vec;
  /** Quanto cada alvo de IK ficou fora de alcance (0 = alcançou). Útil para validar as animações. */
  miss: { handN: number; handF: number; footN: number; footF: number };
}

export function solve(def: RigDef, pose: Pose): Solved {
  const facing = def.facing ?? 1;
  const front = def.view === 'front';
  const u = dir(pose.torso);
  const perp = dir(pose.torso + 90);
  const frontN = mul(perp, facing);
  const hip = pose.hip;
  const shoulder = add(hip, mul(u, BONE.torso * (pose.torsoScale ?? 1)));
  const sw = front ? BONE.shoulderHalf : 0;
  const hw = front ? BONE.hipHalf : 0;
  const shoulderN = add(shoulder, mul(perp, sw));
  const shoulderF = sub(shoulder, mul(perp, sw));
  const hipN = add(hip, mul(perp, hw));
  const hipF = sub(hip, mul(perp, hw));
  const head = add(shoulder, mul(dir(pose.head ?? pose.torso), BONE.neck));
  const miss = { handN: 0, handF: 0, footN: 0, footF: 0 };

  const arm = (root: Vec, hand: Vec | undefined, fk: readonly [number, number] | undefined, pole: Pole | undefined, scale: number, key: 'handN' | 'handF') => {
    const a = BONE.upperArm * scale;
    const b = BONE.forearm * scale;
    if (hand) {
      const r = ik2(root, hand, a, b, poleVec(pole, front ? 'down' : 'back', frontN));
      miss[key] = Math.max(0, r.reach);
      return { mid: r.mid, end: r.end };
    }
    const ang = fk ?? [pose.torso + 180, pose.torso + 180];
    const mid = add(root, mul(dir(ang[0]), a));
    return { mid, end: add(mid, mul(dir(ang[1]), b)) };
  };
  const leg = (root: Vec, foot: Vec | undefined, fk: readonly [number, number] | undefined, pole: Pole | undefined, scale: number, key: 'footN' | 'footF') => {
    const a = BONE.thigh * scale;
    const b = BONE.shin * scale;
    if (foot) {
      const r = ik2(root, foot, a, b, poleVec(pole, front ? 'cam' : 'front', frontN));
      miss[key] = Math.max(0, r.reach);
      return { mid: r.mid, end: r.end };
    }
    const ang = fk ?? [pose.torso + 180, pose.torso + 180];
    const mid = add(root, mul(dir(ang[0]), a));
    return { mid, end: add(mid, mul(dir(ang[1]), b)) };
  };

  const lN = leg(hipN, pose.footN, pose.legN, pose.kneeN, pose.legScaleN ?? 1, 'footN');
  const lF = leg(hipF, pose.footF, pose.legF, pose.kneeF, pose.legScaleF ?? 1, 'footF');

  const footScale = front ? 0.6 : 1;
  const foot = (knee: Vec, ankle: Vec, explicit: number | undefined, sideDefault: number) => {
    const shinAngle = angleOf(sub(ankle, knee));
    const a = explicit ?? (front ? sideDefault : shinAngle - 90 * facing);
    const d = dir(a);
    return { toe: add(ankle, mul(d, BONE.footFront * footScale)), heel: sub(ankle, mul(d, BONE.footBack * footScale)) };
  };
  const fN = foot(lN.mid, lN.end, pose.footAngleN, 25);
  const fF = foot(lF.mid, lF.end, pose.footAngleF, 155);

  // As mãos podem ficar presas a articulações já resolvidas (joelho, pé, ombro…).
  const anchors = {
    hip, hipN, hipF, shoulder, shoulderN, shoulderF, head,
    kneeN: lN.mid, ankleN: lN.end, toeN: fN.toe, heelN: fN.heel,
    kneeF: lF.mid, ankleF: lF.end, toeF: fF.toe, heelF: fF.heel,
  };
  const point = (v: Vec | Rel): Vec => (isVec(v) ? v : add(anchors[v.at], v.d ?? [0, 0]));
  const target = (h: HandTarget | undefined): Vec | undefined => {
    if (!h) return undefined;
    if (isVec(h) || isRel(h)) return point(h);
    return lerpV(point(h.blend[0]), point(h.blend[1]), h.blend[2]);
  };
  const aN = arm(shoulderN, target(pose.handN), pose.armN, pose.elbowN, pose.armScaleN ?? 1, 'handN');
  const aF = arm(shoulderF, target(pose.handF), pose.armF, pose.elbowF, pose.armScaleF ?? 1, 'handF');

  const joints: Joints = {
    hip, hipN, hipF, shoulder, shoulderN, shoulderF, head,
    elbowN: aN.mid, handN: aN.end, elbowF: aF.mid, handF: aF.end,
    kneeN: lN.mid, ankleN: lN.end, toeN: fN.toe, heelN: fN.heel,
    kneeF: lF.mid, ankleF: lF.end, toeF: fF.toe, heelF: fF.heel,
  };
  return { joints, front: frontN, miss };
}

/* ------------------------------------------------------------------ */
/* Lista de desenho                                                    */
/* ------------------------------------------------------------------ */

const DEFAULT_ORDER: Part[] = ['legF', 'armF', 'torso', 'head', 'legN', 'armN'];
const DEFAULT_ORDER_FRONT: Part[] = ['legF', 'legN', 'torso', 'head', 'armF', 'armN'];

function resolveP(p: P, j: Joints): Vec {
  if (Array.isArray(p)) return p as Vec;
  const o = p as { at: JointName; d?: Vec };
  const base = j[o.at];
  return o.d ? add(base, o.d) : base;
}

function propPrims(props: Prop[] | undefined, layer: 'back' | 'front', j: Joints): Prim[] {
  const out: Prim[] = [];
  (props ?? []).forEach((p, i) => {
    if ((p.layer ?? 'back') !== layer) return;
    const cls = `p-${p.tone ?? 'eq'}`;
    const id = `prop${i}`;
    if (p.k === 'line') out.push({ k: 'line', id, a: resolveP(p.from, j), b: resolveP(p.to, j), w: p.w ?? 3, cls });
    else if (p.k === 'circle') out.push({ k: 'circle', id, c: resolveP(p.c, j), r: p.r, cls, ring: p.ring });
    else {
      const dirRot = p.along ? angleOf(sub(resolveP(p.along[1], j), resolveP(p.along[0], j))) : 0;
      out.push({ k: 'rect', id, c: resolveP(p.c, j), w: p.w, h: p.h, rot: dirRot + (p.rot ?? 0), r: p.r ?? 1.5, cls });
    }
  });
  return out;
}

function arrowPrims(arrows: Arrow[] | undefined, j: Joints): Prim[] {
  const out: Prim[] = [];
  (arrows ?? []).forEach((a, i) => {
    const from = resolveP(a.from, j);
    const to = resolveP(a.to, j);
    const v = sub(to, from);
    const l = len(v);
    if (l < 1) return;
    const u = norm(v);
    const n: Vec = [-u[1], u[0]];
    const ctrl = add(lerpV(from, to, 0.5), mul(n, a.bend ?? 0));
    // Direção de chegada (tangente no fim da curva quadrática).
    const tan = norm(sub(to, ctrl));
    const tn: Vec = [-tan[1], tan[0]];
    const hl = 5;
    const h1 = add(sub(to, mul(tan, hl)), mul(tn, hl * 0.55));
    const h2 = sub(sub(to, mul(tan, hl)), mul(tn, hl * 0.55));
    const f = (p: Vec) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`;
    out.push({
      k: 'path',
      id: `arrow${i}`,
      d: `M${f(from)} Q${f(ctrl)} ${f(to)} M${f(h1)} L${f(to)} L${f(h2)}`,
      w: 1.8,
      cls: 'f-arrow',
    });
  });
  return out;
}

export interface ViewBox {
  x: number;
  y: number;
  w: number;
  h: number;
}

export const FULL_VIEW: ViewBox = { x: 0, y: 0, w: STAGE.w, h: STAGE.h };

export function drawList(def: RigDef, solved: Solved, view: ViewBox = FULL_VIEW): Prim[] {
  const j = solved.joints;
  const frontN = solved.front;
  const focus = new Set<Focus>(def.focus ?? []);
  const front = def.view === 'front';
  const out: Prim[] = [];
  const ground = def.ground === undefined ? STAGE.ground : def.ground;

  if (ground !== null) {
    out.push({ k: 'line', id: 'ground', a: [view.x + 6, ground], b: [view.x + view.w - 6, ground], w: 1.2, cls: 'f-ground' });
    // Sombra: acompanha a projeção horizontal do corpo.
    const xs = [j.hip, j.shoulder, j.head, j.ankleN, j.ankleF, j.handN, j.handF, j.kneeN, j.kneeF].map((p) => p[0]);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const rx = Math.max(14, Math.min(70, (maxX - minX) / 2 + 6));
    out.push({ k: 'ellipse', id: 'shadow', c: [(minX + maxX) / 2, ground + 2.2], rx, ry: 2.6, cls: 'f-shadow' });
  }

  out.push(...propPrims(def.props, 'back', j));

  const tone = (near: boolean) => (near || front ? 'f-near' : 'f-far');
  const seg = (id: string, a: Vec, b: Vec, w: number, near: boolean, f: Focus) => {
    out.push({ k: 'line', id, a, b, w, cls: focus.has(f) ? 'f-hl' : tone(near) });
  };

  const parts: Record<Part, () => void> = {
    legF: () => {
      seg('thighF', j.hipF, j.kneeF, WIDTH.thigh, false, 'thighF');
      if (!focus.has('thighF')) out.push({ k: 'line', id: 'shortF', a: j.hipF, b: lerpV(j.hipF, j.kneeF, 0.42), w: WIDTH.thigh + 0.8, cls: front ? 'f-short' : 'f-short-far' });
      seg('shinF', j.kneeF, j.ankleF, WIDTH.shin, false, 'shinF');
      out.push({ k: 'line', id: 'footF', a: j.heelF, b: j.toeF, w: WIDTH.foot, cls: front ? 'f-shoe' : 'f-shoe-far' });
    },
    legN: () => {
      seg('thighN', j.hipN, j.kneeN, WIDTH.thigh, true, 'thighN');
      if (!focus.has('thighN')) out.push({ k: 'line', id: 'shortN', a: j.hipN, b: lerpV(j.hipN, j.kneeN, 0.42), w: WIDTH.thigh + 0.8, cls: 'f-short' });
      seg('shinN', j.kneeN, j.ankleN, WIDTH.shin, true, 'shinN');
      out.push({ k: 'line', id: 'footN', a: j.heelN, b: j.toeN, w: WIDTH.foot, cls: 'f-shoe' });
    },
    armF: () => {
      seg('upperArmF', j.shoulderF, j.elbowF, WIDTH.upperArm, false, 'upperArmF');
      seg('forearmF', j.elbowF, j.handF, WIDTH.forearm, false, 'forearmF');
      out.push({ k: 'circle', id: 'handF', c: j.handF, r: BONE.hand, cls: tone(false) });
      if (focus.has('shoulderF')) out.push({ k: 'circle', id: 'hl-shoulderF', c: j.shoulderF, r: 4.4, cls: 'f-hl' });
    },
    armN: () => {
      if (!front) {
        // Recorte na cor do fundo: separa o braço da frente do tronco, que tem tom parecido.
        const f = (p: Vec) => `${p[0].toFixed(2)} ${p[1].toFixed(2)}`;
        out.push({ k: 'path', id: 'cutArmN', d: `M${f(lerpV(j.shoulderN, j.elbowN, 0.22))} L${f(j.elbowN)} L${f(j.handN)}`, w: WIDTH.upperArm + 2.6, cls: 'f-cut' });
      }
      seg('upperArmN', j.shoulderN, j.elbowN, WIDTH.upperArm, true, 'upperArmN');
      seg('forearmN', j.elbowN, j.handN, WIDTH.forearm, true, 'forearmN');
      out.push({ k: 'circle', id: 'handN', c: j.handN, r: BONE.hand, cls: tone(true) });
      if (focus.has('shoulderN')) out.push({ k: 'circle', id: 'hl-shoulderN', c: j.shoulderN, r: 4.4, cls: 'f-hl' });
    },
    torso: () => {
      const cls = focus.has('torso') ? 'f-hl' : 'f-torso';
      if (front) out.push({ k: 'poly', id: 'torso', pts: [j.shoulderN, j.shoulderF, j.hipF, j.hipN], w: WIDTH.torsoFront, cls });
      else out.push({ k: 'line', id: 'torso', a: j.shoulder, b: j.hip, w: WIDTH.torsoSide, cls });
      // Zonas musculares sobre o tronco.
      const along = (t: number): Vec => lerpV(j.shoulder, j.hip, t);
      const off = (p: Vec, k: number): Vec => (front ? p : add(p, mul(frontN, k)));
      const zone = (id: string, t0: number, t1: number, k: number, w: number) => {
        out.push({ k: 'line', id, a: off(along(t0), k), b: off(along(t1), k), w, cls: 'f-hl' });
      };
      const zw = front ? 13 : 6.5;
      if (focus.has('chest')) zone('hl-chest', 0.08, 0.36, 3.2, zw);
      if (focus.has('abs')) zone('hl-abs', 0.48, 0.9, 3.2, front ? 10 : 6.2);
      if (focus.has('upperBack')) zone('hl-upperBack', 0.06, 0.48, -3.2, zw);
      if (focus.has('lowerBack')) zone('hl-lowerBack', 0.58, 0.92, -3.2, front ? 10 : 6.2);
      if (focus.has('glutes')) out.push({ k: 'circle', id: 'hl-glutes', c: off(along(1.04), -3.4), r: front ? 7.5 : 6.2, cls: 'f-hl' });
      if (focus.has('hipN')) out.push({ k: 'circle', id: 'hl-hipN', c: off(j.hipN, 3), r: 5, cls: 'f-hl' });
      if (focus.has('hipF')) out.push({ k: 'circle', id: 'hl-hipF', c: off(j.hipF, 3), r: 5, cls: 'f-hl' });
    },
    head: () => {
      if (focus.has('neck')) out.push({ k: 'line', id: 'hl-neck', a: j.shoulder, b: lerpV(j.shoulder, j.head, 0.55), w: 5, cls: 'f-hl' });
      out.push({ k: 'circle', id: 'head', c: j.head, r: BONE.head, cls: 'f-head' });
    },
  };
  for (const part of def.order ?? (front ? DEFAULT_ORDER_FRONT : DEFAULT_ORDER)) parts[part]();

  out.push(...propPrims(def.props, 'front', j));
  out.push(...arrowPrims(def.arrows, j));
  return out;
}

function primBounds(p: Prim): [number, number, number, number] {
  switch (p.k) {
    case 'line': {
      const h = p.w / 2;
      return [Math.min(p.a[0], p.b[0]) - h, Math.min(p.a[1], p.b[1]) - h, Math.max(p.a[0], p.b[0]) + h, Math.max(p.a[1], p.b[1]) + h];
    }
    case 'circle': {
      const r = p.r + (p.ring ?? 0) / 2;
      return [p.c[0] - r, p.c[1] - r, p.c[0] + r, p.c[1] + r];
    }
    case 'ellipse':
      return [p.c[0] - p.rx, p.c[1] - p.ry, p.c[0] + p.rx, p.c[1] + p.ry];
    case 'poly': {
      const xs = p.pts.map((q) => q[0]);
      const ys = p.pts.map((q) => q[1]);
      const h = p.w / 2;
      return [Math.min(...xs) - h, Math.min(...ys) - h, Math.max(...xs) + h, Math.max(...ys) + h];
    }
    case 'rect': {
      const r = Math.hypot(p.w, p.h) / 2;
      return p.rot ? [p.c[0] - r, p.c[1] - r, p.c[0] + r, p.c[1] + r] : [p.c[0] - p.w / 2, p.c[1] - p.h / 2, p.c[0] + p.w / 2, p.c[1] + p.h / 2];
    }
    case 'path':
      return [Infinity, Infinity, -Infinity, -Infinity];
  }
}

const viewCache = new WeakMap<RigDef, ViewBox>();

/**
 * Enquadramento automático: a menor janela 4:3 que contém o boneco e os acessórios durante todo o ciclo,
 * com folga, para o exercício ocupar bem o cartão (sem ampliar além de ~1,7×).
 */
export function fitView(def: RigDef): ViewBox {
  const hit = viewCache.get(def);
  if (hit) return hit;
  const total = loopDuration(def);
  const samples = def.keys.length < 2 ? [0] : Array.from({ length: 16 }, (_, i) => (total * i) / 16);
  let x0 = Infinity;
  let y0 = Infinity;
  let x1 = -Infinity;
  let y1 = -Infinity;
  for (const t of samples) {
    for (const p of drawList(def, solve(def, poseAt(def, t)))) {
      if (p.id === 'ground' || p.id === 'shadow') continue;
      const b = primBounds(p);
      x0 = Math.min(x0, b[0]);
      y0 = Math.min(y0, b[1]);
      x1 = Math.max(x1, b[2]);
      y1 = Math.max(y1, b[3]);
    }
  }
  const ground = def.ground === undefined ? STAGE.ground : def.ground;
  if (ground !== null) y1 = Math.max(y1, ground + 5);
  const pad = 9;
  const ratio = STAGE.w / STAGE.h;
  let w = Math.max(x1 - x0 + pad * 2, (y1 - y0 + pad * 2) * ratio, STAGE.w / 1.7);
  w = Math.min(w, STAGE.w * 1.25);
  const h = w / ratio;
  const cx = (x0 + x1) / 2;
  // Ancora embaixo: o chão fica sempre na mesma altura relativa do cartão.
  const bottom = y1 + pad;
  const view: ViewBox = { x: cx - w / 2, y: bottom - h, w, h };
  viewCache.set(def, view);
  return view;
}

/** Atalho: pose no instante t → primitivas, já no enquadramento automático. */
export function frame(def: RigDef, tSec: number): Prim[] {
  return drawList(def, solve(def, poseAt(def, tSec)), fitView(def));
}

/* ------------------------------------------------------------------ */
/* Validação (usada pelos testes e pela ferramenta de pré-visualização) */
/* ------------------------------------------------------------------ */

export interface Issue {
  level: 'error' | 'warn';
  msg: string;
}

export function validate(def: RigDef): Issue[] {
  const issues: Issue[] = [];
  const err = (msg: string) => issues.push({ level: 'error', msg });
  const warn = (msg: string) => issues.push({ level: 'warn', msg });
  if (!def.keys.length) err('sem keys');
  const ground = def.ground === undefined ? STAGE.ground : def.ground;
  const limbMode = (p: Pose, ikField: 'handN' | 'handF' | 'footN' | 'footF', fkField: 'armN' | 'armF' | 'legN' | 'legF') =>
    p[ikField] ? 'ik' : p[fkField] ? 'fk' : 'default';
  const pairs = [['handN', 'armN'], ['handF', 'armF'], ['footN', 'legN'], ['footF', 'legF']] as const;
  const modes0 = pairs.map(([a, b]) => limbMode({ ...def.base, ...(def.keys[0]?.pose ?? {}) }, a, b));
  def.keys.forEach((key, i) => {
    if (!(key.dur >= 0)) err(`key ${i}: dur inválida`);
    const pose = { ...def.base, ...key.pose };
    pairs.forEach(([a, b], k) => {
      if (pose[a] && pose[b]) err(`key ${i}: ${a} e ${b} definidos juntos`);
      if (limbMode(pose, a, b) !== modes0[k]) err(`key ${i}: ${a}/${b} muda de modo (IK/FK) entre keys`);
    });
    const s = solve(def, pose);
    for (const [name, v] of Object.entries(s.joints)) {
      if (!Number.isFinite(v[0]) || !Number.isFinite(v[1])) err(`key ${i}: ${name} não é finito`);
      if (v[0] < 2 || v[0] > STAGE.w - 2 || v[1] < 2 || v[1] > STAGE.h - 2) warn(`key ${i}: ${name} fora do palco (${v[0].toFixed(0)}, ${v[1].toFixed(0)})`);
      if (ground !== null && v[1] > ground + 0.6) warn(`key ${i}: ${name} abaixo do chão (y=${v[1].toFixed(1)})`);
    }
    for (const [name, m] of Object.entries(s.miss)) {
      if (m > 1.5) warn(`key ${i}: alvo ${name} fora de alcance por ${m.toFixed(1)}`);
    }
  });
  const total = loopDuration(def);
  if (def.keys.length > 1 && (total < 1.2 || total > 12)) warn(`ciclo de ${total.toFixed(1)} s (esperado entre 1,2 e 12 s)`);
  return issues;
}
