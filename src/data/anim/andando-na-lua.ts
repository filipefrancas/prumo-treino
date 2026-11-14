import type { RigDef, Pose } from '../../rig/types.ts';

/**
 * Andando na lua, no lugar: passadas lentas e exageradas, quase em câmera lenta.
 * Cada lado tem três keys: aterrissagem suave na ponta do pé → impulsão (a perna de apoio empurra até estender,
 * com a ponta do pé fixa no chão em x ≈ 120, e o joelho livre sobe) → voo longo (joelho alto, perna de trás
 * estendida, braços amplos). Pernas em FK; os ângulos da perna de apoio foram calculados para a ponta do pé
 * ficar no mesmo ponto nas keys de aterrissagem e de impulsão.
 * A subida da impulsão ('in') emenda na subida do voo ('out') com a mesma velocidade; a queda é 'inOut' (pouso suave).
 */

const HIP_POUSO: [number, number] = [116, 107.2];
const HIP_IMPULSAO: [number, number] = [116, 101.9];
const HIP_VOO: [number, number] = [116, 93.4];

// Perna de apoio: aterrissagem (joelho flexionado ~25°) e impulsão (estendida, calcanhar alto).
const APOIO_POUSO = [81.9, 106.6] as const;
const APOIO_IMPULSAO = [83.3, 94.4] as const;
// Perna livre: atrás e dobrada na aterrissagem → joelho alto com o calcanhar recolhido → coxa na horizontal no voo.
const LIVRE_POUSO = [100, 150] as const;
const LIVRE_IMPULSAO = [22, 131] as const;
const LIVRE_VOO = [5, 80] as const;
// Perna de impulsão depois de sair do chão: estendida para trás.
const ATRAS_VOO = [124, 128] as const;

const pousoDistante: Partial<Pose> = {
  hip: HIP_POUSO, torso: -84, head: -85,
  legF: APOIO_POUSO, footAngleF: 22,
  legN: LIVRE_POUSO, footAngleN: 110,
  armN: [82, -12], armF: [98, 14],
};
const impulsaoDistante: Partial<Pose> = {
  hip: HIP_IMPULSAO, torso: -82, head: -83,
  legF: APOIO_IMPULSAO, footAngleF: 68,
  legN: LIVRE_IMPULSAO, footAngleN: 50,
  armN: [123, 32], armF: [48, -39],
};
const vooProximoAFrente: Partial<Pose> = {
  hip: HIP_VOO, torso: -86, head: -86,
  legF: ATRAS_VOO, footAngleF: 112,
  legN: LIVRE_VOO, footAngleN: -8,
  armN: [150, 62], armF: [15, -75],
};
const pousoProximo: Partial<Pose> = {
  hip: HIP_POUSO, torso: -84, head: -85,
  legN: APOIO_POUSO, footAngleN: 22,
  legF: LIVRE_POUSO, footAngleF: 110,
  armN: [98, 14], armF: [82, -12],
};
const impulsaoProximo: Partial<Pose> = {
  hip: HIP_IMPULSAO, torso: -82, head: -83,
  legN: APOIO_IMPULSAO, footAngleN: 68,
  legF: LIVRE_IMPULSAO, footAngleF: 50,
  armN: [48, -39], armF: [123, 32],
};
const vooDistanteAFrente: Partial<Pose> = {
  hip: HIP_VOO, torso: -86, head: -86,
  legN: ATRAS_VOO, footAngleN: 112,
  legF: LIVRE_VOO, footAngleF: -8,
  armN: [15, -75], armF: [150, 62],
};

const def: RigDef = {
  id: 'andando-na-lua',
  view: 'side',
  base: {
    hip: HIP_POUSO,
    torso: -84,
    head: -85,
    legN: LIVRE_POUSO,
    legF: APOIO_POUSO,
    footAngleN: 110,
    footAngleF: 22,
    armN: [82, -12],
    armF: [98, 14],
  },
  keys: [
    { pose: pousoDistante, dur: 0.45, ease: 'inOut' },
    { pose: impulsaoDistante, dur: 0.25, ease: 'in' },
    { pose: vooProximoAFrente, dur: 0.4, ease: 'out' },
    { pose: pousoProximo, dur: 0.45, ease: 'inOut' },
    { pose: impulsaoProximo, dur: 0.25, ease: 'in' },
    { pose: vooDistanteAFrente, dur: 0.4, ease: 'out' },
  ],
  focus: ['glutes', 'thighN', 'thighF'],
  thumb: 2,
};
export default def;
