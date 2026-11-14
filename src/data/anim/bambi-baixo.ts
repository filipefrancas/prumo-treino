import type { RigDef } from '../../rig/types.ts';

/**
 * Bambi baixo, no lugar: saltos alternados com fase de voo curta, como um cervo.
 * K0 e K2 = apoio: aterrissagem na ponta do pé, sob o corpo, com a perna livre ainda atrás;
 * K1 e K3 = voo: os dois pés fora do chão, joelho da frente a ~45° e perna de impulsão estendida atrás.
 * A impulsão acontece na saída do apoio: a perna de apoio estende e o joelho livre sobe até o alto do voo.
 * O corpo sobe desacelerando ('out') e cai acelerando ('in'), como um salto de verdade.
 */
const def: RigDef = {
  id: 'bambi-baixo',
  view: 'side',
  base: {
    hip: [116, 104.6],
    torso: -83,
    head: -84,
    legN: [98, 150],
    legF: [84, 100],
    footAngleN: 100,
    footAngleF: 42,
    armN: [86, -6],
    armF: [94, 4],
  },
  keys: [
    { pose: {}, dur: 0.3, hold: 0.04, ease: 'in' },
    {
      pose: { hip: [116, 96.6], torso: -86, head: -86, legN: [42, 86], legF: [112, 126], footAngleN: -2, footAngleF: 96, armN: [142, 56], armF: [38, -58] },
      dur: 0.3,
      ease: 'out',
    },
    {
      pose: { legN: [84, 100], legF: [98, 150], footAngleN: 42, footAngleF: 100, armN: [94, 4], armF: [86, -6] },
      dur: 0.3,
      hold: 0.04,
      ease: 'in',
    },
    {
      pose: { hip: [116, 96.6], torso: -86, head: -86, legN: [112, 126], legF: [42, 86], footAngleN: 96, footAngleF: -2, armN: [38, -58], armF: [142, 56] },
      dur: 0.3,
      ease: 'out',
    },
  ],
  focus: ['shinN', 'thighN'],
};
export default def;
