import type { RigDef } from '../../rig/types.ts';

// Deitado de lado, cabeça à direita, apoiado no antebraço de baixo (cotovelo fixo em 140,5;157).
// A lateral da coxa de baixo (N) fica tangente ao topo do rolo (centro 96,153): K0 = rolo perto do joelho,
// K1 = rolo perto do quadril. A perna de cima (F) cruza à frente com o pé fixo no chão e ajuda a empurrar.
const def: RigDef = {
  id: 'rolo-lateral-coxa',
  view: 'side',
  base: {
    hip: [115, 140.4],
    torso: 1.9,
    head: -18,
    handN: [156, 157],
    elbowN: 'down',
    handF: { at: 'hip', d: [3, -7] },
    elbowF: 'up',
    legN: [180, 174],
    footAngleN: 100,
    footF: [84, 157],
    kneeF: 'up',
    footAngleF: 180,
  },
  keys: [
    { pose: {}, dur: 2.4, hold: 0.2 },
    { pose: { hip: [104, 140.4] }, dur: 2.4, hold: 0.2 },
  ],
  props: [
    { k: 'rect', c: [110, 161.6], w: 130, h: 3, tone: 'eq2' },
    { k: 'circle', c: [96, 153], r: 7, ring: 2.2 },
  ],
  focus: ['thighN'],
};
export default def;
