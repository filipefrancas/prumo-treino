import type { RigDef } from '../../rig/types.ts';

const def: RigDef = {
  id: 'alongamento-dorsal-espaldar',
  view: 'side',
  base: {
    hip: [108, 103.4],
    torso: -90,
    head: -84,
    handN: [108.5, 40.5],
    handF: [107.2, 40.8],
    elbowN: 'front',
    elbowF: 'front',
    footN: [108.5, 150.4],
    footF: [106.5, 150.6],
    footAngleN: 55,
    footAngleF: 60,
  },
  keys: [
    { pose: {}, dur: 2, hold: 0.5 },
    { pose: { hip: [101.5, 103], torso: -79.8, head: -72 }, dur: 2.2, hold: 1.8 },
  ],
  props: [
    // Espaldar: montante, barra alta projetada e degraus.
    { k: 'line', from: [92, 38], to: [92, 160], w: 3, tone: 'eq2' },
    { k: 'line', from: [92, 47], to: [108, 40.5], w: 2.4, tone: 'eq2' },
    { k: 'circle', c: [108, 40.5], r: 2.2 },
    { k: 'line', from: [89.5, 53.5], to: [94.5, 53.5], w: 2 },
    { k: 'line', from: [89.5, 66.5], to: [94.5, 66.5], w: 2 },
    { k: 'line', from: [89.5, 79.5], to: [94.5, 79.5], w: 2 },
    { k: 'line', from: [89.5, 92.5], to: [94.5, 92.5], w: 2 },
    { k: 'line', from: [89.5, 105.5], to: [94.5, 105.5], w: 2 },
    { k: 'line', from: [89.5, 118.5], to: [94.5, 118.5], w: 2 },
    { k: 'line', from: [89.5, 131.5], to: [94.5, 131.5], w: 2 },
    { k: 'line', from: [89.5, 144.5], to: [94.5, 144.5], w: 2 },
  ],
  focus: ['upperBack'],
  arrows: [{ from: { at: 'hip', d: [25, 1] }, to: { at: 'hip', d: [11, 1] } }],
  order: ['legF', 'armF', 'armN', 'torso', 'head', 'legN'],
};
export default def;
