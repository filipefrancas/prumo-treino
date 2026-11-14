import type { RigDef } from '../../rig/types.ts';

const def: RigDef = {
  id: 'borboleta',
  view: 'front',
  base: {
    hip: [120, 154.8],
    torso: -90,
    legN: [-32, 141.5],
    legF: [-148, 38.5],
    legScaleN: 0.9,
    legScaleF: 0.9,
    footAngleN: 174,
    footAngleF: 6,
    handN: [123.2, 154.5],
    handF: [116.8, 154.5],
    elbowN: 'right',
    elbowF: 'left',
  },
  keys: [
    { pose: {}, dur: 2.2, hold: 0.4 },
    { pose: { legN: [-10, 163.5], legF: [-170, 16.5], footAngleN: 182.4, footAngleF: -2.4 }, dur: 2.2, hold: 1.2 },
  ],
  props: [{ k: 'rect', c: [120, 161.6], w: 110, h: 3, tone: 'eq2' }],
  focus: ['thighN', 'thighF'],
  arrows: [
    { from: { at: 'kneeN', d: [6, -19] }, to: { at: 'kneeN', d: [6, -7] } },
    { from: { at: 'kneeF', d: [-6, -19] }, to: { at: 'kneeF', d: [-6, -7] } },
  ],
  order: ['torso', 'head', 'legF', 'legN', 'armF', 'armN'],
};
export default def;
