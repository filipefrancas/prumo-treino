import type { RigDef } from '../../rig/types.ts';

// Sentado, mãos fixas no chão atrás do corpo, quadril fora do chão.
// A panturrilha próxima fica tangente ao topo do rolo (centro 149,153; raio externo 8,1) e desliza sobre ele:
// K0 = rolo perto do tornozelo, K1 = rolo logo abaixo do joelho. O pé distante fica plantado e empurra o corpo.
const def: RigDef = {
  id: 'rolo-panturrilha',
  view: 'side',
  base: {
    hip: [107, 147],
    torso: -138,
    head: -124,
    handN: [89, 157],
    handF: [86, 157],
    legN: [-7.9, -7.9],
    footAngleN: -72,
    footF: [129.5, 157],
    kneeF: 'up',
    footAngleF: 0,
  },
  keys: [
    { pose: {}, dur: 2.4, hold: 0.2 },
    { pose: { hip: [117, 147], legN: [-10.4, -10.4] }, dur: 2.4, hold: 0.2 },
  ],
  props: [
    { k: 'rect', c: [124, 161.6], w: 124, h: 3, tone: 'eq2' },
    { k: 'circle', c: [149, 153], r: 7, ring: 2.2 },
  ],
  focus: ['shinN'],
};
export default def;
