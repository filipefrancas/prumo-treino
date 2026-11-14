import type { RigDef } from '../../rig/types.ts';

/**
 * Flexão plantar em pé, unilateral: apoio só na perna próxima, a outra dobrada para trás, mão na parede à frente.
 * A ponta do pé é o apoio fixo em (131,8; 157). K1: o pé gira 55° em torno da ponta; tornozelo = ponta − 7,8·dir(55),
 * e o quadril sobe o mesmo deslocamento (perna reta).
 */
const def: RigDef = {
  id: 'flexao-plantar',
  view: 'side',
  base: {
    hip: [121, 109.2],
    torso: -89,
    head: -89,
    footN: [124, 157],
    footAngleN: 0,
    legF: [100, 172],
    handN: [151, 80],
    handF: { at: 'hip', d: [2, -9] },
  },
  keys: [
    { pose: {}, dur: 1.4, hold: 0.3 },
    { pose: { hip: [124.33, 102.81], footN: [127.33, 150.61], footAngleN: 55 }, dur: 1.1, hold: 0.6 },
  ],
  props: [{ k: 'line', from: [152.5, 40], to: [152.5, 160], w: 3, tone: 'eq2' }],
  focus: ['shinN'],
  arrows: [{ from: [112, 152], to: [112, 139] }],
};
export default def;
