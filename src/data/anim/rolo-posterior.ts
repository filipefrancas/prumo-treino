import type { RigDef } from '../../rig/types.ts';

// Mesma posição do rolo-panturrilha (sentado, mãos fixas atrás, quadril fora do chão), com o rolo sob a coxa.
// A coxa próxima fica tangente ao topo do rolo (centro 132,153; raio externo 8,1): K0 = rolo perto do joelho,
// K1 = rolo perto do glúteo. A perna fica solta, com o calcanhar no ar; o pé distante fica plantado depois do rolo.
const def: RigDef = {
  id: 'rolo-posterior',
  view: 'side',
  base: {
    hip: [112, 142],
    torso: -149,
    head: -135,
    handN: [90.4, 157],
    handF: [87.4, 157],
    legN: [-4.7, 10],
    footAngleN: -68,
    footF: [149, 157],
    kneeF: 'up',
    footAngleF: 0,
  },
  keys: [
    { pose: {}, dur: 2.4, hold: 0.2 },
    { pose: { hip: [122, 142], legN: [-10.2, 6] }, dur: 2.4, hold: 0.2 },
  ],
  props: [
    { k: 'rect', c: [122, 161.6], w: 124, h: 3, tone: 'eq2' },
    { k: 'circle', c: [132, 153], r: 7, ring: 2.2 },
  ],
  focus: ['thighN'],
};
export default def;
