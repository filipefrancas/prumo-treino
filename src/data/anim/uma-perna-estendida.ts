import type { RigDef } from '../../rig/types.ts';

const def: RigDef = {
  id: 'uma-perna-estendida',
  view: 'side',
  base: {
    hip: [88, 153],
    torso: -80,
    head: -80,
    legN: [3.1, 3.1],
    footF: [117.6, 154.6],
    kneeF: 'up',
    legScaleF: 0.804,
    footAngleF: 0,
    handN: [96.5, 148.3],
    handF: { at: 'kneeF', d: [1.5, -4.8] },
  },
  keys: [
    { pose: {}, dur: 2.2, hold: 0.4 },
    {
      pose: { torso: -44, head: -34, handN: { at: 'toeN', d: [-2, 1] }, handF: { at: 'toeN', d: [-1.5, 3.5] } },
      dur: 2.2,
      hold: 1.2,
    },
  ],
  props: [{ k: 'rect', c: [112, 161.6], w: 130, h: 3, tone: 'eq2' }],
  focus: ['thighN'],
};
export default def;
