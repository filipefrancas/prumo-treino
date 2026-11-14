import type { RigDef } from '../../rig/types.ts';

/**
 * Mobilidade anterior de quadril, meio-ajoelhado: joelho de trás (perna distante) fixo no chão em (105; 156),
 * pé da frente fixo em (142; 157). O quadril gira em torno do joelho de trás (raio = coxa, 24,5).
 * K0: tronco ereto, quadril empurrado à frente. K1: quadril volta, tronco inclina sobre a perna da frente, que estende um pouco.
 */
const def: RigDef = {
  id: 'anterior-quadril-flexao-tronco',
  view: 'side',
  base: {
    hip: [119.05, 135.93],
    torso: -92,
    head: -90,
    footN: [142, 157],
    kneeN: 'up',
    footAngleN: 0,
    footF: [81.5, 157],
    kneeF: 'down',
    footAngleF: 176,
    handN: { at: 'hip', d: [3, -8] },
    handF: { at: 'hip', d: [1, -9] },
  },
  keys: [
    { pose: {}, dur: 2.2, hold: 2 },
    {
      pose: {
        hip: [105, 131.5],
        torso: -40,
        head: -32,
        handN: { at: 'kneeN', d: [0, 5] },
        handF: { at: 'kneeN', d: [-1, 3] },
      },
      dur: 2.2,
      hold: 1,
    },
  ],
  props: [{ k: 'rect', c: [112, 161.6], w: 130, h: 3, tone: 'eq2' }],
  focus: ['hipF', 'thighF'],
  thumb: 0,
};
export default def;
