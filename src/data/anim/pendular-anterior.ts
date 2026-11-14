import type { RigDef } from '../../rig/types.ts';

/**
 * Pendular anterior, no lugar: tesoura com as pernas estendidas à frente.
 * K0 e K2 = uma perna reta a ~45° à frente e a outra apoiada na ponta do pé sob o corpo;
 * K1 e K3 = troca no ar (as pernas se cruzam, os dois pés fora do chão).
 * Pernas e braços em FK para o membro girar reto, como um pêndulo, a partir do quadril e do ombro.
 */
const def: RigDef = {
  id: 'pendular-anterior',
  view: 'side',
  base: {
    hip: [112, 105.3],
    torso: -93,
    head: -90,
    legN: [46, 48],
    legF: [94, 96],
    footAngleN: -42,
    footAngleF: 32,
    armN: [130, 46],
    armF: [50, -44],
  },
  keys: [
    { pose: {}, dur: 0.35, ease: 'out' },
    {
      pose: { hip: [112, 103.3], legN: [66, 68], legF: [74, 76], footAngleN: -11, footAngleF: 1, armN: [97, 8], armF: [83, -6] },
      dur: 0.25,
      ease: 'in',
    },
    {
      pose: { legN: [94, 96], legF: [46, 48], footAngleN: 32, footAngleF: -42, armN: [50, -44], armF: [130, 46] },
      dur: 0.35,
      ease: 'out',
    },
    {
      pose: { hip: [112, 103.3], legN: [74, 76], legF: [66, 68], footAngleN: 1, footAngleF: -11, armN: [83, -6], armF: [97, 8] },
      dur: 0.25,
      ease: 'in',
    },
  ],
  focus: ['thighN', 'thighF'],
  thumb: 0,
};
export default def;
