import type { RigDef } from '../../rig/types.ts';

// Polia no alto, na vertical das mãos: o cabo desce reto até a barra.
const POLIA = [112, 47] as const;

const def: RigDef = {
  id: 'puxada-supinada',
  view: 'side',
  base: {
    hip: [104, 123.5],
    torso: -90,
    head: -88,
    footN: [127, 157],
    footF: [122.5, 157],
    footAngleN: 0,
    footAngleF: 0,
    handN: [112.5, 62.5],
    handF: [112.5, 62.5],
    elbowN: 'down',
    elbowF: 'down',
  },
  keys: [
    { pose: {}, dur: 1.6, hold: 0.3 },
    { pose: { torso: -101, head: -94, handN: [110, 97.5], handF: [110, 97.5] }, dur: 1.2, hold: 0.4 },
  ],
  props: [
    // Torre, travessa do alto e base.
    { k: 'rect', c: [152.5, 101.5], w: 5, h: 117, r: 2, tone: 'eq2' },
    { k: 'line', from: POLIA, to: [152, 47], w: 3, tone: 'eq2' },
    { k: 'line', from: [92, 158.6], to: [154, 158.6], w: 2.6, tone: 'eq2' },
    // Assento.
    { k: 'line', from: [101, 136], to: [101, 158], w: 3, tone: 'eq2' },
    { k: 'rect', c: [101, 133], w: 26, h: 6, r: 3 },
    // Rolo sobre as coxas.
    { k: 'line', from: [124.4, 123], to: [151, 123], w: 2.4, tone: 'eq2' },
    { k: 'circle', c: [124.4, 123], r: 4.3 },
    // Polia, cabo e barra (vista de topo, presa às mãos).
    { k: 'circle', c: POLIA, r: 3.6, ring: 2 },
    { k: 'line', from: POLIA, to: { at: 'handN' }, w: 1.2 },
    { k: 'circle', c: { at: 'handN' }, r: 2.2, layer: 'front' },
  ],
  focus: ['upperBack', 'upperArmN'],
};
export default def;
