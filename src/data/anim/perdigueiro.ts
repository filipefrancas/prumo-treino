import type { RigDef } from '../../rig/types.ts';

// Perdigueiro: quatro apoios, cabeça à direita. A mão próxima e o joelho distante ficam no chão o tempo todo;
// o braço distante estende à frente e a perna próxima estende para trás, na horizontal.
const def: RigDef = {
  id: 'perdigueiro',
  view: 'side',
  base: {
    hip: [113, 131.5],
    torso: -11.7,
    head: -4,
    handN: [143.4, 157],
    elbowN: 'left',
    armF: [85, 85],
    legN: [90, 178.5],
    legF: [84, 178.5],
    footAngleN: 178,
    footAngleF: 178,
  },
  keys: [
    { pose: {}, dur: 1.4, hold: 0.3 },
    { pose: { armF: [0, 0], legN: [180, 180], footAngleN: 110 }, dur: 1.3, hold: 0.4 },
  ],
  props: [{ k: 'rect', c: [119, 161.6], w: 136, h: 3, tone: 'eq2' }],
  focus: ['abs', 'lowerBack'],
};
export default def;
