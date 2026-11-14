import type { RigDef } from '../../rig/types.ts';

const def: RigDef = {
  id: 'pernas-juntas-a-frente',
  view: 'side',
  base: {
    hip: [88, 153],
    torso: -80,
    head: -80,
    legN: [3.1, 3.1],
    legF: [0.6, 0.6],
    handN: { at: 'kneeN', d: [-3, -5.5] },
    handF: { at: 'kneeF', d: [-1, -5.5] },
  },
  keys: [
    { pose: {}, dur: 2.2, hold: 0.4 },
    {
      pose: { torso: -44, head: -34, handN: { at: 'toeN', d: [-2, 1] }, handF: { at: 'toeF', d: [-2, 1] } },
      dur: 2.2,
      hold: 1.2,
    },
  ],
  props: [{ k: 'rect', c: [112, 161.6], w: 130, h: 3, tone: 'eq2' }],
  focus: ['thighN', 'thighF'],
};
export default def;
