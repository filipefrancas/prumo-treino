import type { RigDef } from '../../rig/types.ts';

/**
 * Polichinelo (vista de frente).
 * K0 = pés juntos, braços ao lado do corpo · K2 = pés afastados, mãos juntas acima da cabeça.
 * K1 e K3 são a fase de voo: quadril 3 acima da linha K0–K2, pés fora do chão, braços na horizontal.
 * As eases 'in' e 'out' se emendam: braços e pernas fazem uma curva suave entre fechado e aberto.
 * Braços em FK com ângulos que varrem por fora (N passa por 0°, F passa por 180°).
 */
const AIR = {
  hip: [120, 107.6],
  footN: [130.2, 153.6],
  footF: [109.8, 153.6],
  footAngleN: 36,
  footAngleF: 144,
  armN: [1, -20],
  armF: [179, 200],
} as const;

const def: RigDef = {
  id: 'polichinelo',
  view: 'front',
  base: {
    hip: [120, 110],
    torso: -90,
    head: -90,
    footN: [123.4, 157],
    footF: [116.6, 157],
    footAngleN: 25,
    footAngleF: 155,
    armN: [82, 87],
    armF: [98, 93],
  },
  keys: [
    { pose: {}, dur: 0.27, ease: 'out' },
    { pose: AIR, dur: 0.27, ease: 'in' },
    { pose: { hip: [120, 111.2], footN: [137, 157], footF: [103, 157], armN: [-80, -127], armF: [260, 307] }, dur: 0.27, ease: 'out' },
    { pose: AIR, dur: 0.27, ease: 'in' },
  ],
  focus: ['shinN', 'shinF'],
  thumb: 2,
};
export default def;
