import type { RigDef } from '../../rig/types.ts';

const def: RigDef = {
  id: 'rosca-banco-inclinado',
  view: 'side',
  base: {
    hip: [112, 123.5],
    torso: -120,
    head: -118,
    footN: [136, 157],
    footF: [131.5, 157],
    footAngleN: 0,
    footAngleF: 0,
    // Braços pendentes na vertical (atrás da linha do tronco); só o antebraço gira.
    armN: [90, 86],
    armF: [94, 90],
  },
  keys: [
    { pose: {}, dur: 1.5, hold: 0.3 },
    { pose: { armN: [90, -58], armF: [94, -52] }, dur: 1.1, hold: 0.4 },
  ],
  props: [
    // Estrutura do banco.
    { k: 'line', from: [82, 158.6], to: [128, 158.6], w: 2.6, tone: 'eq2' },
    { k: 'line', from: [86, 98], to: [86, 158], w: 3, tone: 'eq2' },
    { k: 'line', from: [115, 135], to: [115, 158], w: 3, tone: 'eq2' },
    // Encosto a 60° e assento.
    { k: 'rect', c: [92, 107.35], w: 52, h: 5, rot: 60, r: 2.5 },
    { k: 'rect', c: [115, 132.75], w: 24, h: 5.5, r: 2.7 },
    // Halteres.
    { k: 'circle', c: { at: 'handF' }, r: 4, tone: 'eq2' },
    { k: 'circle', c: { at: 'handN' }, r: 4.2, layer: 'front' },
  ],
  focus: ['upperArmN'],
};
export default def;
