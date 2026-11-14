import type { RigDef } from '../../rig/types.ts';

/**
 * Mobilidade de quadril com elástico: deitado de costas, cabeça à esquerda. Perna distante estendida no chão;
 * a perna próxima sobe estendida com o elástico passando pela sola do pé e seguro pelas duas mãos.
 * K0: perna a 60° do chão. K1: perna perto da vertical, as mãos puxam o elástico para o peito.
 */
const def: RigDef = {
  id: 'mobilidade-quadril-elastico',
  view: 'side',
  base: {
    hip: [124, 153],
    torso: 180,
    head: 180,
    legN: [-60, -60],
    footAngleN: -150,
    legF: [3, 4],
    handN: [112, 131],
    handF: [109, 133],
    elbowN: 'right',
    elbowF: 'right',
  },
  keys: [
    { pose: {}, dur: 2.2, hold: 0.5 },
    { pose: { legN: [-86, -86], footAngleN: -176, handN: [106, 137], handF: [103, 139] }, dur: 2.4, hold: 1.6 },
  ],
  props: [
    { k: 'rect', c: [124, 161.6], w: 130, h: 3, tone: 'eq2' },
    { k: 'line', from: { at: 'handN' }, to: { at: 'toeN', d: [1, -1] }, w: 2, layer: 'front' },
    { k: 'line', from: { at: 'handF' }, to: { at: 'heelN', d: [1, -2] }, w: 2 },
  ],
  focus: ['thighN'],
  arrows: [{ from: { at: 'ankleN', d: [12, 4] }, to: { at: 'ankleN', d: [4, -12] }, bend: -3 }],
};
export default def;
