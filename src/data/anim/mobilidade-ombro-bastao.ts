import type { RigDef } from '../../rig/types.ts';

const def: RigDef = {
  id: 'mobilidade-ombro-bastao',
  view: 'side',
  base: {
    hip: [118, 109.4],
    torso: -90,
    head: -90,
    footN: [120, 157],
    footF: [116, 157],
    footAngleN: 0,
    footAngleF: 0,
    armN: [106, 106],
    armF: [101, 101],
    armScaleF: 0.98,
  },
  keys: [
    { pose: {}, dur: 1.5, hold: 0.3 },
    { pose: { armN: [138, 138], armF: [132, 132], armScaleF: 0.9 }, dur: 1.5, hold: 0.5 },
  ],
  props: [
    // Bastão horizontal seguro pelas duas mãos, atrás do corpo.
    { k: 'line', from: { at: 'handN', d: [-8, 0] }, to: { at: 'handF', d: [7, 0] }, w: 3 },
  ],
  focus: ['shoulderN', 'shoulderF'],
};
export default def;
