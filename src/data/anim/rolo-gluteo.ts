import type { RigDef } from '../../rig/types.ts';

// Sentado sobre o rolo (centro 122,153), mão próxima fixa no chão atrás, pé distante plantado à frente.
// Figura 4: o tornozelo próximo descansa sobre a coxa distante, junto ao joelho; o joelho próximo cai para fora
// (perna encurtada pela perspectiva). torsoScale < 1 = tronco inclinado para o lado do glúteo trabalhado.
const def: RigDef = {
  id: 'rolo-gluteo',
  view: 'side',
  base: {
    hip: [117.7, 137.5],
    torso: -154,
    torsoScale: 0.88,
    head: -140,
    handN: [98.2, 157],
    handF: { at: 'hip', d: [2, -8] },
    footF: [152, 157],
    kneeF: 'up',
    footAngleF: 0,
    footN: [137.6, 128.5],
    kneeN: 'down',
    legScaleN: 0.62,
    footAngleN: -35,
  },
  keys: [
    { pose: {}, dur: 2.4, hold: 0.2 },
    { pose: { hip: [127.7, 137.5], footN: [146.7, 126.75] }, dur: 2.4, hold: 0.2 },
  ],
  props: [
    { k: 'rect', c: [120, 161.6], w: 110, h: 3, tone: 'eq2' },
    { k: 'circle', c: [122, 153], r: 7, ring: 2.2 },
  ],
  focus: ['glutes'],
};
export default def;
