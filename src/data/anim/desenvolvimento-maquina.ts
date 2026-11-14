import type { RigDef } from '../../rig/types.ts';

const def: RigDef = {
  id: 'desenvolvimento-maquina',
  view: 'side',
  base: {
    hip: [108, 123.5],
    torso: -90,
    head: -88,
    footN: [136, 157],
    footF: [131, 157],
    footAngleN: 0,
    footAngleF: 0,
    handN: [122, 90],
    handF: [122, 90],
    elbowN: 'front',
    elbowF: 'front',
  },
  keys: [
    { pose: {}, dur: 1.6, hold: 0.3 },
    { pose: { handN: [116, 62], handF: [116, 62] }, dur: 1.2, hold: 0.3 },
  ],
  props: [
    // torre atrás do encosto e alavanca presa à mão
    { k: 'line', from: [78, 160], to: [78, 84.8], w: 4, tone: 'eq2' },
    { k: 'line', from: [78, 84.8], to: { at: 'handN' }, w: 2.4, tone: 'eq' },
    { k: 'circle', c: [78, 84.8], r: 3, tone: 'eq' },
    // assento e encosto vertical
    { k: 'line', from: [112, 135], to: [112, 160], w: 3, tone: 'eq2' },
    { k: 'rect', c: [113, 132.5], w: 26, h: 5, r: 2.5, tone: 'eq' },
    { k: 'rect', c: [100, 109], w: 5, h: 40, r: 2.5, tone: 'eq' },
    { k: 'circle', c: { at: 'handN' }, r: 1.7, tone: 'eq', layer: 'front' },
  ],
  focus: ['shoulderN'],
};
export default def;
