import type { RigDef } from '../../rig/types.ts';

// Deitado de costas, cabeça à esquerda, quadril fora do chão. A lombar fica tangente ao topo do rolo
// (centro 110,153; raio externo 8,1). Pés fixos no chão empurram: K0 = rolo logo acima do quadril,
// K1 = rolo no meio da lombar. Amplitude curta. Mãos cruzadas no peito.
const def: RigDef = {
  id: 'rolo-lombar',
  view: 'side',
  base: {
    hip: [117, 138.2],
    torso: 180,
    head: 190,
    handN: { at: 'shoulder', d: [11, -6] },
    handF: { at: 'shoulder', d: [7, -7] },
    elbowN: 'cam',
    elbowF: 'cam',
    footN: [150, 157],
    footF: [154, 157],
    kneeN: 'up',
    kneeF: 'up',
    footAngleN: 0,
    footAngleF: 0,
  },
  keys: [
    { pose: {}, dur: 2.4, hold: 0.2 },
    { pose: { hip: [125, 138.2] }, dur: 2.4, hold: 0.2 },
  ],
  props: [
    { k: 'rect', c: [116, 161.6], w: 124, h: 3, tone: 'eq2' },
    { k: 'circle', c: [110, 153], r: 7, ring: 2.2 },
  ],
  focus: ['lowerBack'],
};
export default def;
