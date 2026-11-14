import type { RigDef } from '../../rig/types.ts';

/**
 * Pendular posterior, no lugar: tronco inclinado à frente e pernas estendidas subindo para trás, alternando.
 * K0 e K2 = uma perna reta atrás (~40° da vertical) e a outra apoiada na ponta do pé sob o corpo;
 * K1 e K3 = troca no ar. Pernas e braços em FK (giro reto a partir do quadril e do ombro).
 */
const def: RigDef = {
  id: 'pendular-posterior',
  view: 'side',
  base: {
    hip: [118, 105.4],
    torso: -66,
    head: -72,
    legN: [130, 133],
    legF: [82, 87],
    footAngleN: 64,
    footAngleF: 32,
    armN: [74, -18],
    armF: [152, 64],
  },
  keys: [
    { pose: {}, dur: 0.35, ease: 'out' },
    {
      pose: { hip: [118, 102.4], legN: [110, 114], legF: [102, 106], footAngleN: 51, footAngleF: 45, armN: [106.5, 16], armF: [119.5, 30] },
      dur: 0.25,
      ease: 'in',
    },
    {
      pose: { legN: [82, 87], legF: [130, 133], footAngleN: 32, footAngleF: 64, armN: [152, 64], armF: [74, -18] },
      dur: 0.35,
      ease: 'out',
    },
    {
      pose: { hip: [118, 102.4], legN: [102, 106], legF: [110, 114], footAngleN: 45, footAngleF: 51, armN: [119.5, 30], armF: [106.5, 16] },
      dur: 0.25,
      ease: 'in',
    },
  ],
  focus: ['glutes'],
  thumb: 0,
};
export default def;
