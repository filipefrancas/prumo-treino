import type { RigDef } from '../../rig/types.ts';

// Sentado no chão, perna próxima estendida à frente, mãos apoiadas atrás do quadril. O elástico prende no peito
// do pé e puxa para a frente (ponto fixo à direita). K0: pé em ponta. K1: a ponta do pé vem em direção à canela.
const def: RigDef = {
  id: 'dorsiflexao-do-pe',
  view: 'side',
  base: {
    hip: [84, 153],
    torso: -104,
    head: -98,
    legN: [2, 2],
    footAngleN: -42,
    footF: [108, 157],
    kneeF: 'up',
    footAngleF: 0,
    handN: [70.5, 155],
    handF: [67.5, 155],
    elbowN: 'back',
    elbowF: 'back',
  },
  keys: [
    { pose: {}, dur: 1.5, hold: 0.3 },
    { pose: { footAngleN: -108 }, dur: 1.2, hold: 0.5 },
  ],
  props: [
    { k: 'rect', c: [118, 161.6], w: 136, h: 3, tone: 'eq2' },
    // Ponto fixo do elástico, à frente do pé.
    { k: 'line', from: [180, 138], to: [180, 160], w: 3, tone: 'eq2' },
    { k: 'line', from: [180, 146], to: { at: 'toeN', d: [-1.5, 0] }, w: 2, layer: 'front' },
  ],
  focus: ['shinN'],
  arrows: [{ from: { at: 'ankleN', d: [9, -15] }, to: { at: 'ankleN', d: [-6, -17] }, bend: 4 }],
};
export default def;
