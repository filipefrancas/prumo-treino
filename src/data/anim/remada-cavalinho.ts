import type { RigDef } from '../../rig/types.ts';

// Barra (landmine) presa ao chão em PIVO; as mãos percorrem um arco em torno dele (mesma distância nas duas keys).
const PIVO = [60, 158] as const;

const def: RigDef = {
  id: 'remada-cavalinho',
  view: 'side',
  base: {
    hip: [140, 113],
    torso: -41,
    head: -34,
    footN: [154, 157],
    footF: [148.5, 157],
    kneeN: 'right',
    kneeF: 'right',
    footAngleN: 0,
    footAngleF: 0,
    handN: [163, 123.4],
    handF: [160.16, 124.36],
    elbowN: 'back',
    elbowF: 'back',
  },
  keys: [
    { pose: {}, dur: 1.5, hold: 0.3 },
    { pose: { handN: [158.24, 111.56], handF: [155.53, 112.84] }, dur: 1.1, hold: 0.4 },
  ],
  props: [
    // Encaixe da barra no chão.
    { k: 'rect', c: [58, 158.2], w: 10, h: 3.6, r: 1.6, tone: 'eq2' },
    // Barra: do pivô até as mãos, mais a ponta que passa das mãos.
    { k: 'line', from: PIVO, to: { at: 'handN' }, w: 2.6 },
    { k: 'rect', c: { at: 'handN' }, along: [PIVO, { at: 'handN' }], w: 30, h: 2.6, r: 1.3 },
    // Anilha de perfil, logo depois das mãos.
    { k: 'rect', c: { at: 'handN', d: [10.2, -4.1] }, along: [PIVO, { at: 'handN' }], rot: 90, w: 14, h: 4.6, r: 1.8 },
  ],
  focus: ['upperBack'],
};
export default def;
