import type { RigDef } from '../../rig/types.ts';

const def: RigDef = {
  id: 'joelho-ao-peito',
  view: 'side',
  base: {
    hip: [124, 153],
    torso: 180,
    head: 180,
    // Perna próxima dobrada, abraçada pelas duas mãos; perna distante estendida no chão (calcanhar apoiado).
    legN: [-121, 22],
    legF: [3, 4],
    handN: { at: 'kneeN', d: [5, 1] },
    handF: { at: 'kneeN', d: [7, 3] },
    elbowN: [-0.2, -1],
    elbowF: [-0.2, -1],
    armScaleN: 1,
    armScaleF: 1,
  },
  keys: [
    { pose: {}, dur: 2, hold: 0.5 },
    { pose: { legN: [-137, 10], armScaleN: 0.84, armScaleF: 0.84 }, dur: 2.2, hold: 1.5 },
  ],
  props: [{ k: 'rect', c: [124, 161.6], w: 130, h: 3, tone: 'eq2', layer: 'front' }],
  focus: ['glutes'],
  order: ['legF', 'armF', 'legN', 'torso', 'head', 'armN'],
  arrows: [{ from: { at: 'kneeN', d: [-3, -11] }, to: { at: 'kneeN', d: [-17, -8] }, bend: -3 }],
};
export default def;
