import type { RigDef } from '../../rig/types.ts';

// Deitado de costas, cabeça à esquerda, tronco inclinado (195°) e tangente ao topo do rolo (centro 100,153).
// Quadril fora do chão, pés fixos empurram: K0 = rolo no meio das costas, K1 = rolo perto dos ombros.
// Mãos atrás da cabeça, cotovelos abertos (para a câmera).
const def: RigDef = {
  id: 'rolo-toracica',
  view: 'side',
  base: {
    hip: [118.3, 142.5],
    torso: 195,
    head: 188,
    handN: { at: 'head', d: [-2, 3] },
    handF: { at: 'head', d: [-4, 2] },
    elbowN: 'cam',
    elbowF: 'cam',
    footN: [152, 157],
    footF: [156, 157],
    kneeN: 'up',
    kneeF: 'up',
    footAngleN: 0,
    footAngleF: 0,
  },
  keys: [
    { pose: {}, dur: 2.4, hold: 0.2 },
    { pose: { hip: [129, 145.4] }, dur: 2.4, hold: 0.2 },
  ],
  props: [
    { k: 'rect', c: [116, 161.6], w: 124, h: 3, tone: 'eq2' },
    { k: 'circle', c: [100, 153], r: 7, ring: 2.2 },
  ],
  focus: ['upperBack'],
};
export default def;
