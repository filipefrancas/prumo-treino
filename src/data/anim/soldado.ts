import type { RigDef } from '../../rig/types.ts';

/**
 * Soldado: marcha com a perna reta. A perna sobe estendida à frente até perto da horizontal e a mão oposta
 * vai em direção à ponta do pé; alterna os lados. Tronco alto. Pernas em FK a partir de um quadril fixo:
 * a perna de apoio fica sempre vertical, com o pé no chão.
 */
const def: RigDef = {
  id: 'soldado',
  view: 'side',
  base: {
    hip: [106, 109],
    torso: -86,
    head: -88,
    // K0: perna próxima no alto, mão distante em direção ao pé.
    legN: [-10, -8],
    footAngleN: -98,
    legF: [90, 90],
    footAngleF: 0,
    armF: [28, 18],
    armN: [118, 100],
  },
  keys: [
    { pose: {}, dur: 0.45, hold: 0.15, ease: 'out' },
    {
      pose: { legN: [88, 90], footAngleN: 0, legF: [92, 96], footAngleF: 4, armF: [84, 70], armN: [92, 78] },
      dur: 0.4,
      ease: 'in',
    },
    {
      pose: { legN: [90, 90], footAngleN: 0, legF: [-8, -6], footAngleF: -96, armF: [118, 100], armN: [28, 18] },
      dur: 0.45,
      hold: 0.15,
      ease: 'out',
    },
    {
      pose: { legN: [92, 96], footAngleN: 4, legF: [88, 90], footAngleF: 0, armF: [92, 78], armN: [84, 70] },
      dur: 0.4,
      ease: 'in',
    },
  ],
  focus: ['thighN', 'thighF'],
  thumb: 0,
};
export default def;
