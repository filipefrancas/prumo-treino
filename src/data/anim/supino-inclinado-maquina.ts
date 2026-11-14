import type { RigDef } from '../../rig/types.ts';

const def: RigDef = {
  id: 'supino-inclinado-maquina',
  view: 'side',
  base: {
    hip: [112, 123.5],
    torso: -120,
    head: -118,
    footN: [142, 157],
    footF: [137, 157],
    footAngleN: 0,
    footAngleF: 0,
    handN: [103, 101],
    handF: [103, 101],
    elbowN: 'down',
    elbowF: 'down',
  },
  keys: [
    { pose: {}, dur: 1.6, hold: 0.3 },
    { pose: { handN: [121.7, 79], handF: [121.7, 79] }, dur: 1.2, hold: 0.3 },
  ],
  props: [
    // torre, articulação no alto, alavanca e pegador
    { k: 'line', from: [74, 160], to: [80.2, 49], w: 4, tone: 'eq2' },
    { k: 'line', from: [80.2, 49], to: { at: 'handN', d: [9, -6] }, w: 2.4, tone: 'eq' },
    { k: 'line', from: { at: 'handN', d: [9, -6] }, to: { at: 'handN' }, w: 2.4, tone: 'eq' },
    { k: 'circle', c: [80.2, 49], r: 3, tone: 'eq' },
    // assento e encosto inclinado
    { k: 'line', from: [116, 135], to: [116, 160], w: 3, tone: 'eq2' },
    { k: 'rect', c: [116, 132.5], w: 24, h: 5, r: 2.5, tone: 'eq' },
    { k: 'rect', c: [96.8, 113.2], w: 41, h: 5, rot: -120, r: 2.5, tone: 'eq' },
    { k: 'circle', c: { at: 'handN' }, r: 1.7, tone: 'eq', layer: 'front' },
  ],
  focus: ['chest', 'shoulderN'],
};
export default def;
