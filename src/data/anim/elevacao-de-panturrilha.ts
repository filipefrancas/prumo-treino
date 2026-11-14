import type { RigDef } from '../../rig/types.ts';

/**
 * Elevação de panturrilha em pé, mãos na cintura.
 * K0 = pés inteiros no chão · K1 = na ponta dos dois pés (pé a 50°).
 * O apoio é a ponta do pé, então o tornozelo sobe girando em torno dela: tornozelo = ponta − 7,8·dir(footAngle).
 * Com as pontas fixas em (131,8; 157) e (126,8; 157), o tornozelo vai de y = 157 para y = 151,03 e avança 2,79.
 * O quadril acompanha exatamente esse deslocamento: as pernas ficam retas e só o tornozelo se mexe.
 */
const def: RigDef = {
  id: 'elevacao-de-panturrilha',
  view: 'side',
  base: {
    hip: [121, 109.2],
    torso: -90,
    head: -90,
    footN: [124, 157],
    footF: [119, 157],
    footAngleN: 0,
    footAngleF: 0,
    handN: { at: 'hip', d: [3, -9] },
    handF: { at: 'hip', d: [1, -10] },
  },
  keys: [
    { pose: {}, dur: 1.3, hold: 0.25 },
    {
      pose: { hip: [123.79, 103.23], footN: [126.79, 151.03], footF: [121.79, 151.03], footAngleN: 50, footAngleF: 50 },
      dur: 1,
      hold: 0.5,
    },
  ],
  focus: ['shinN'],
};
export default def;
