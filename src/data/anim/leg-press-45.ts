import type { RigDef } from '../../rig/types.ts';

/**
 * Leg press 45°: encosto reclinado no canto inferior esquerdo, pernas empurrando a plataforma em diagonal.
 * A plataforma corre num trilho a 45° e é perpendicular a ele; os tornozelos andam em linha reta paralela ao trilho.
 * Pés afastados: o pé distante fica um pouco mais abaixo na plataforma para aparecer.
 */
const def: RigDef = {
  id: 'leg-press-45',
  view: 'side',
  base: {
    hip: [88, 140],
    torso: -140,
    head: -134,
    armN: [47, 41],
    armScaleN: 0.88,
    armF: [43, 37],
    armScaleF: 0.88,
    footN: [100, 111],
    footF: [102.1, 113.1],
    kneeN: 'up',
    kneeF: 'up',
    footAngleN: -135,
    footAngleF: -135,
  },
  keys: [
    { pose: {}, dur: 1.6, hold: 0.3 },
    { pose: { footN: [111.7, 99.3], footF: [113.8, 101.4] }, dur: 1.2, hold: 0.3 },
  ],
  props: [
    // Trilho e apoio do encosto (estrutura).
    { k: 'line', from: [84.5, 159], to: [142, 101.5], w: 3, tone: 'eq2' },
    { k: 'line', from: [58, 137], to: [58, 159], w: 3, tone: 'eq2' },
    // Encosto e assento.
    { k: 'rect', c: [64, 131.3], w: 52, h: 4, rot: 40, r: 2 },
    { k: 'rect', c: [97, 143.4], w: 22, h: 4, rot: -45, r: 2 },
    // Plataforma presa aos pés.
    { k: 'rect', c: { at: 'ankleN', d: [7.1, 0] }, w: 36, h: 4, rot: 45, r: 2 },
  ],
  focus: ['thighN', 'thighF', 'glutes'],
};
export default def;
