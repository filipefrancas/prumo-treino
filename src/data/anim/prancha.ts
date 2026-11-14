import type { RigDef } from '../../rig/types.ts';

const def: RigDef = {
  id: 'prancha',
  view: 'side',
  base: {
    hip: [107.7, 144.4],
    torso: -6.7,
    head: -4,
    armN: [90, 0],
    armF: [90, 0],
    legN: [173.3, 173.3],
    legF: [173.3, 173.3],
    footAngleN: 96,
    footAngleF: 96,
  },
  keys: [
    { pose: {}, dur: 2, hold: 0.2 },
    { pose: { hip: [107.7, 143.4] }, dur: 2, hold: 0.2 },
  ],
  props: [{ k: 'rect', c: [105, 161.6], w: 150, h: 3, tone: 'eq2' }],
  focus: ['abs'],
};
export default def;
