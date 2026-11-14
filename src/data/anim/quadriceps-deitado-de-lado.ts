import type { RigDef } from '../../rig/types.ts';

// Deitado de lado, cabeça à esquerda apoiada no braço de baixo estendido. A perna de baixo fica estendida no chão;
// a mão de cima segura o pé da perna de cima e puxa o calcanhar para o glúteo (joelho apontando para a direita).
const def: RigDef = {
  id: 'quadriceps-deitado-de-lado',
  view: 'side',
  facing: -1,
  base: {
    hip: [122, 153],
    torso: 180,
    head: 180,
    armF: [180, 180],
    legF: [2, 2],
    footAngleF: 8,
    legN: [-2, -148],
    footAngleN: 178,
    handN: { at: 'toeN', d: [1.5, 0] },
    elbowN: 'up',
  },
  keys: [
    { pose: {}, dur: 2.2, hold: 0.5 },
    { pose: { legN: [-9, -163], footAngleN: 168 }, dur: 2.3, hold: 1.5 },
  ],
  props: [{ k: 'rect', c: [112, 161.6], w: 150, h: 3, tone: 'eq2' }],
  focus: ['thighN'],
  arrows: [{ from: { at: 'ankleN', d: [4, -14] }, to: { at: 'ankleN', d: [-9, -10] }, bend: -3 }],
};
export default def;
