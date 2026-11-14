import type { RigDef } from '../../rig/types.ts';

const def: RigDef = {
  id: 'agachamento-livre',
  view: 'side',
  base: {
    hip: [116, 110.5],
    torso: -84,
    head: -84,
    footN: [124, 157],
    footF: [119, 157],
    handN: { at: 'shoulder', d: [-3, 5] },
    handF: { at: 'shoulder', d: [-3, 5] },
    elbowN: 'down',
    elbowF: 'down',
  },
  keys: [
    { pose: {}, dur: 1.3, hold: 0.4 },
    { pose: { hip: [98, 137], torso: -56, head: -64 }, dur: 1.6, hold: 0.3 },
  ],
  props: [
    { k: 'circle', c: { at: 'shoulder', d: [-5, -1] }, r: 11, ring: 2.6, tone: 'eq', layer: 'front' },
    { k: 'circle', c: { at: 'shoulder', d: [-5, -1] }, r: 2.2, tone: 'eq', layer: 'front' },
  ],
  focus: ['thighN', 'thighF', 'glutes'],
};
export default def;
