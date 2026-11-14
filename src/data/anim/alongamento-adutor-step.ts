import type { RigDef } from '../../rig/types.ts';

/**
 * Alongamento de adutor sentado em degrau baixo (topo y = 146; quadril em 139,5), de frente.
 * Pernas bem abertas e estendidas, calcanhares fixos no chão. K1: o tronco inclina à frente (encurta por perspectiva)
 * e as mãos descem entre as pernas em direção ao chão.
 */
const def: RigDef = {
  id: 'alongamento-adutor-step',
  view: 'front',
  base: {
    hip: [120, 139.5],
    torso: -90,
    torsoScale: 0.94,
    footN: [169, 156],
    footF: [71, 156],
    footAngleN: -72,
    footAngleF: -108,
    handN: [125, 141],
    handF: [115, 141],
    elbowN: 'right',
    elbowF: 'left',
  },
  keys: [
    { pose: {}, dur: 2.2, hold: 0.4 },
    { pose: { torsoScale: 0.6, handN: [126, 152], handF: [114, 152] }, dur: 2.3, hold: 1.5 },
  ],
  props: [{ k: 'rect', c: [120, 153], w: 46, h: 14, r: 2, tone: 'eq2' }],
  focus: ['thighN', 'thighF'],
  arrows: [{ from: [146, 106], to: [146, 122] }],
};
export default def;
