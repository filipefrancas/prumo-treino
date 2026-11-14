import type { RigDef } from '../../rig/types.ts';

/**
 * Agachamento sem carga, braços estendidos à frente para equilibrar.
 * Pés em IK com o mesmo alvo nas duas keys e footAngle 0 (pé inteiro no chão, calcanhar não sobe).
 * K0 = em pé · K1 = coxa paralela ao chão (quadril e joelho na mesma altura), canela inclinada ~24° à frente.
 */
const def: RigDef = {
  id: 'agachamento-peso-do-corpo',
  view: 'side',
  base: {
    hip: [121, 109.5],
    torso: -87,
    head: -87,
    footN: [124, 157],
    footF: [119, 157],
    footAngleN: 0,
    footAngleF: 0,
    armN: [14, 6],
    armF: [20, 12],
  },
  keys: [
    { pose: {}, dur: 1.1, hold: 0.3 },
    { pose: { hip: [109, 135.8], torso: -60, head: -66, armN: [2, -4], armF: [8, 2] }, dur: 1.4, hold: 0.3 },
  ],
  focus: ['thighN', 'thighF', 'glutes'],
};
export default def;
