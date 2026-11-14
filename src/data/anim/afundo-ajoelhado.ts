import type { RigDef } from '../../rig/types.ts';

/**
 * Afundo ajoelhado (alongamento do flexor do quadril): joelho de trás (perna distante) fixo sobre uma toalha em (100; 155),
 * pé da frente fixo em (134; 157), tronco ereto e mãos na cintura.
 * K0: quadril quase sobre o joelho de trás. K1: quadril avança e desce, girando em torno do joelho de trás.
 */
const def: RigDef = {
  id: 'afundo-ajoelhado',
  view: 'side',
  base: {
    hip: [104.25, 130.87],
    torso: -90,
    head: -90,
    footN: [134, 157],
    footAngleN: 0,
    footF: [76.5, 156.5],
    kneeF: 'down',
    footAngleF: 176,
    handN: { at: 'hip', d: [3, -8] },
    handF: { at: 'hip', d: [1, -9] },
  },
  keys: [
    { pose: {}, dur: 2.2, hold: 0.5 },
    { pose: { hip: [115.1, 135.7], torso: -88, head: -88 }, dur: 2.3, hold: 1.8 },
  ],
  props: [{ k: 'rect', c: [100, 159.2], w: 20, h: 2.6, r: 1.2 }],
  focus: ['thighF', 'hipF'],
  arrows: [{ from: { at: 'hip', d: [-24, -2] }, to: { at: 'hip', d: [-11, 3] }, bend: 2 }],
};
export default def;
