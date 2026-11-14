import type { RigDef } from '../../rig/types.ts';

const def: RigDef = {
  id: 'alongamento-peitoral-espaldar',
  view: 'side',
  base: {
    hip: [104.5, 109.8],
    torso: -90,
    head: -90,
    footN: [113, 157],
    footF: [101, 157],
    footAngleN: 0,
    footAngleF: 0,
    handN: [92.5, 79.5],
    handF: [92.5, 79.5],
    elbowN: 'down',
    elbowF: 'down',
    armScaleN: 0.5,
    armScaleF: 0.62,
  },
  keys: [
    { pose: {}, dur: 2, hold: 0.5 },
    { pose: { hip: [114, 111], torso: -85, head: -84, armScaleN: 0.85, armScaleF: 0.96 }, dur: 2.2, hold: 1.8 },
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
  focus: ['chest'],
  arrows: [{ from: { at: 'shoulder', d: [11, 7] }, to: { at: 'shoulder', d: [25, 7] } }],
};
export default def;
