import type { RigDef } from '../../rig/types.ts';

const def: RigDef = {
  id: 'alongamento-peitoral-fita',
  view: 'front',
  base: {
    hip: [120, 110.5],
    torso: -90,
    footN: [128, 157],
    footF: [112, 157],
    armN: [3, -3],
    armF: [177, 183],
    armScaleN: 1,
    armScaleF: 1,
  },
  keys: [
    { pose: {}, dur: 2, hold: 0.5 },
    { pose: { hip: [120, 110], armN: [0, -6], armF: [180, 186], armScaleN: 0.86, armScaleF: 0.86 }, dur: 2.2, hold: 1.8 },
  ],
  props: [
    // Fita elástica: das mãos para trás das costas (o trecho do meio fica escondido pelo tronco).
    { k: 'line', from: { at: 'handN' }, to: { at: 'shoulderN', d: [-3, 10] }, w: 2 },
    { k: 'line', from: { at: 'handF' }, to: { at: 'shoulderF', d: [3, 10] }, w: 2 },
  ],
  focus: ['chest'],
};
export default def;
