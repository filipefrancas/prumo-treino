import type { RigDef } from '../../rig/types.ts';

const def: RigDef = {
  id: 'pernas-afastadas',
  view: 'front',
  base: {
    hip: [120, 155],
    torso: -90,
    torsoScale: 1,
    footN: [165, 156],
    footF: [75, 156],
    footAngleN: -78,
    footAngleF: -102,
    handN: [124, 155.6],
    handF: [116, 155.6],
    elbowN: 'cam',
    elbowF: 'cam',
  },
  keys: [
    { pose: {}, dur: 2.2, hold: 0.4 },
    { pose: { torsoScale: 0.62, handN: [128.5, 157.6], handF: [111.5, 157.6] }, dur: 2.2, hold: 1.2 },
  ],
  props: [{ k: 'rect', c: [120, 161.6], w: 130, h: 3, tone: 'eq2' }],
  focus: ['thighN', 'thighF'],
  arrows: [{ from: [142, 113], to: [142, 130] }],
};
export default def;
