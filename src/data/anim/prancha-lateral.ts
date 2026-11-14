import type { RigDef } from '../../rig/types.ts';

/**
 * Prancha lateral, corpo de frente para a câmera: apoio no antebraço de baixo (cotovelo sob o ombro) e na lateral do pé,
 * corpo reto em diagonal, mão de cima na cintura. Isometria: o quadril sobe 1 unidade (respiração),
 * com os ângulos do tronco e das pernas ajustados para o ombro e os pés ficarem no lugar.
 */
const def: RigDef = {
  id: 'prancha-lateral',
  view: 'front',
  base: {
    hip: [117, 139.75],
    torso: -14,
    head: -16,
    armN: [90, 0],
    handF: { at: 'hip', d: [8, -6] },
    elbowF: 'up',
    legN: [166, 166],
    legF: [166, 166],
    footAngleN: -125,
    footAngleF: -125,
  },
  keys: [
    { pose: {}, dur: 2, hold: 0.2 },
    { pose: { hip: [117, 138.75], torso: -12.15, legN: [164.8, 164.8], legF: [164.8, 164.8] }, dur: 2, hold: 0.2 },
  ],
  props: [{ k: 'rect', c: [118, 161.6], w: 140, h: 3, tone: 'eq2' }],
  focus: ['abs'],
};
export default def;
