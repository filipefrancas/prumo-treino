import type { RigDef } from '../../rig/types.ts';

/**
 * Pendular anterior + anfersen, no lugar: a perna próxima faz o pendular (sobe reta a ~45° à frente)
 * e a perna distante faz o anfersen (calcanhar no glúteo), alternando os apoios.
 * K0 = perna próxima reta à frente, apoio na ponta do pé distante; K2 = calcanhar distante no glúteo,
 * apoio na ponta do pé próximo; K1 e K3 = troca no ar. Pernas e braços em FK.
 * Capa (thumb) = K1: é a única key em que as duas pernas aparecem nos seus papéis ao mesmo tempo
 * (a próxima reta à frente, a distante dobrando para trás).
 */
const def: RigDef = {
  id: 'pendular-anfersen',
  view: 'side',
  base: {
    hip: [114, 105.3],
    torso: -89,
    head: -88,
    legN: [46, 48],
    legF: [92, 96],
    footAngleN: -42,
    footAngleF: 32,
    armN: [132, 48],
    armF: [52, -42],
  },
  keys: [
    { pose: {}, dur: 0.35, ease: 'out' },
    {
      pose: { hip: [114, 103.3], legN: [66, 68], legF: [87, 152], footAngleN: -11, footAngleF: 84, armN: [99, 10], armF: [85, -4] },
      dur: 0.25,
      ease: 'in',
    },
    {
      pose: { legN: [94, 96], legF: [81, 230], footAngleN: 32, footAngleF: 158, armN: [52, -42], armF: [132, 48] },
      dur: 0.35,
      ease: 'out',
    },
    {
      pose: { hip: [114, 103.3], legN: [74, 76], legF: [86, 174], footAngleN: 1, footAngleF: 105, armN: [85, -4], armF: [99, 10] },
      dur: 0.25,
      ease: 'in',
    },
  ],
  focus: ['thighN', 'thighF'],
  thumb: 1,
};
export default def;
