import type { RigDef } from '../../rig/types.ts';

// Sentado no chão, perna distante estendida. A perna próxima dobra e o pé cruza para fora do joelho estendido.
// O braço distante abraça o joelho dobrado; a mão próxima apoia no chão atrás do quadril e o tronco gira para trás.
const def: RigDef = {
  id: 'torcao-sentado',
  view: 'side',
  base: {
    hip: [100, 153],
    torso: -104,
    head: -106,
    legF: [2, 2],
    footAngleF: -78,
    footN: [123, 157],
    kneeN: 'up',
    footAngleN: 0,
    handF: { at: 'kneeN', d: [0.5, 2.5] },
    elbowF: 'up',
    handN: [86, 155],
    elbowN: 'back',
  },
  keys: [
    { pose: {}, dur: 2.2, hold: 0.5 },
    { pose: { torso: -109, head: -120 }, dur: 2.3, hold: 1.5 },
  ],
  props: [{ k: 'rect', c: [112, 161.6], w: 130, h: 3, tone: 'eq2' }],
  focus: ['glutes', 'lowerBack'],
  arrows: [{ from: { at: 'head', d: [4, -13] }, to: { at: 'head', d: [-13, -9] }, bend: 4 }],
};
export default def;
