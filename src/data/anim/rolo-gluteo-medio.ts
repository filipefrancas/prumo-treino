import type { RigDef } from '../../rig/types.ts';

// Deitado de lado, cabeça à direita, a lateral do quadril sobre o rolo (centro 110,153), antebraço de baixo
// fixo no chão (cotovelo em 140,5;157). Perna de baixo (N) estendida até o chão; a de cima (F) cruza à frente
// com o pé fixo no chão. Amplitude curta: o rolo passa de um lado ao outro da lateral do quadril.
const def: RigDef = {
  id: 'rolo-gluteo-medio',
  view: 'side',
  base: {
    hip: [114, 138.2],
    torso: 5.6,
    head: -16,
    handN: [156, 157],
    elbowN: 'down',
    handF: { at: 'hip', d: [4, -7] },
    elbowF: 'up',
    legN: [158, 158],
    footAngleN: 172,
    footF: [88, 157],
    kneeF: 'up',
    footAngleF: 180,
  },
  keys: [
    { pose: {}, dur: 2.4, hold: 0.2 },
    { pose: { hip: [106, 138.2], torso: 5.9 }, dur: 2.4, hold: 0.2 },
  ],
  props: [
    { k: 'rect', c: [110, 161.6], w: 130, h: 3, tone: 'eq2' },
    { k: 'circle', c: [110, 153], r: 7, ring: 2.2 },
  ],
  focus: ['glutes', 'hipN'],
};
export default def;
