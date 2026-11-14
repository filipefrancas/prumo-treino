import type { RigDef } from '../../rig/types.ts';

// Ajoelhado, sentado sobre os calcanhares, peito dos pés no chão (joelhos à direita).
// K0: tronco ereto, mãos sobre as coxas. K1: tronco inclina para trás, mãos apoiadas no chão atrás do corpo.
const def: RigDef = {
  id: 'sentado-nos-calcanhares',
  view: 'side',
  base: {
    hip: [106, 146],
    torso: -90,
    head: -90,
    legN: [24, 178],
    legF: [22.5, 177],
    footAngleN: 180,
    footAngleF: 180,
    handN: [113, 143.5],
    handF: [110.5, 143.5],
    elbowN: 'back',
    elbowF: 'back',
  },
  keys: [
    { pose: {}, dur: 2.2, hold: 0.6 },
    {
      pose: { torso: -136, head: -124, handN: [82.5, 155.5], handF: [79.5, 155.5] },
      dur: 2.4,
      hold: 1.6,
    },
  ],
  props: [{ k: 'rect', c: [108, 161.6], w: 120, h: 3, tone: 'eq2' }],
  focus: ['thighN', 'thighF'],
};
export default def;
