import type { RigDef } from '../../rig/types.ts';

const def: RigDef = {
  id: 'rosca-direta',
  view: 'side',
  base: {
    hip: [118, 110.5],
    torso: -90,
    footN: [123, 157],
    footF: [117, 157],
    armN: [96, 78],
    armF: [96, 78],
  },
  keys: [
    { pose: {}, dur: 1.4, hold: 0.3 },
    { pose: { armN: [100, -68], armF: [100, -68] }, dur: 1.1, hold: 0.3 },
  ],
  props: [
    { k: 'circle', c: { at: 'handN' }, r: 7.5, ring: 2.4, tone: 'eq', layer: 'front' },
    { k: 'circle', c: { at: 'handN' }, r: 1.8, tone: 'eq', layer: 'front' },
  ],
  focus: ['upperArmN'],
};
export default def;
