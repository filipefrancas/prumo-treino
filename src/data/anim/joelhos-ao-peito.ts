import type { RigDef } from '../../rig/types.ts';

const def: RigDef = {
  id: 'joelhos-ao-peito',
  view: 'side',
  base: {
    hip: [132, 153],
    torso: 180,
    head: 180,
    legN: [-123, 21],
    legF: [-116, 26],
    handN: { at: 'kneeN', d: [5, 1] },
    handF: { at: 'kneeF', d: [4, 2] },
    elbowN: [-0.2, -1],
    elbowF: [-0.2, -1],
    armScaleN: 1,
    armScaleF: 1,
  },
  keys: [
    { pose: {}, dur: 2, hold: 0.5 },
    {
      // Joelhos mais perto do peito: os cotovelos abrem para os lados (braços encurtados) e a bacia enrola um pouco.
      pose: { hip: [132, 152.2], torso: 178.5, legN: [-137, 10], legF: [-130, 15], armScaleN: 0.84, armScaleF: 0.84 },
      dur: 2.2,
      hold: 1.5,
    },
  ],
  // Colchonete na frente: o glúteo destacado "afunda" nele em vez de atravessar o chão.
  props: [{ k: 'rect', c: [112, 161.6], w: 130, h: 3, tone: 'eq2', layer: 'front' }],
  focus: ['lowerBack', 'glutes'],
  order: ['legF', 'armF', 'legN', 'torso', 'head', 'armN'],
  arrows: [{ from: { at: 'kneeN', d: [-3, -11] }, to: { at: 'kneeN', d: [-17, -8] }, bend: -3 }],
};
export default def;
