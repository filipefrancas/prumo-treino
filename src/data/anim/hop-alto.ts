import type { RigDef, Pose } from '../../rig/types.ts';

/**
 * Hop alto: o mesmo do hop, com salto mais alto. A cada salto o joelho livre sobe até a altura do quadril
 * e o braço oposto sobe junto. Dois toques com a mesma perna e troca.
 * Ciclo: toque (apoio distante) → voo → toque → voo com troca → toque (apoio próximo) → voo → toque → voo com troca.
 * Os dois pés pousam no mesmo ponto (ponta em x ≈ 121): o pé de apoio volta exatamente ao mesmo alvo a cada toque.
 */

// Toque: quadril baixo, apoio no antepé, joelho de apoio flexionado para amortecer e impulsionar.
const HIP_TOQUE: [number, number] = [117, 107.5];
// Voo: quadril 12 mais alto, perna de apoio estendida com a ponta do pé para baixo (uns 7 acima do chão).
const HIP_VOO: [number, number] = [117, 95.5];
// Voo com troca: um pouco mais baixo.
const HIP_TROCA: [number, number] = [117, 96.5];

const apoioDistante: Partial<Pose> = {
  hip: HIP_TOQUE,
  footF: [114.25, 153.1],
  footAngleF: 30,
  footN: [128.5, 145.6],
  footAngleN: 15,
  armN: [104, 14],
  armF: [72, -18],
};
const vooDistante: Partial<Pose> = {
  hip: HIP_VOO,
  footF: [117.9, 142.8],
  footAngleF: 72,
  footN: [139.85, 118.1],
  footAngleN: 4,
  armN: [130, 45],
  armF: [12, -76],
};
const apoioProximo: Partial<Pose> = {
  hip: HIP_TOQUE,
  footN: [114.25, 153.1],
  footAngleN: 30,
  footF: [128.5, 145.6],
  footAngleF: 15,
  armN: [72, -18],
  armF: [104, 14],
};
const vooProximo: Partial<Pose> = {
  hip: HIP_VOO,
  footN: [117.9, 142.8],
  footAngleN: 72,
  footF: [139.85, 118.1],
  footAngleF: 4,
  armN: [12, -76],
  armF: [130, 45],
};

const def: RigDef = {
  id: 'hop-alto',
  view: 'side',
  base: {
    hip: HIP_TOQUE,
    torso: -87,
    head: -87,
    footN: [128.5, 145.6],
    footAngleN: 15,
    footF: [114.25, 153.1],
    footAngleF: 30,
    armN: [104, 14],
    armF: [72, -18],
  },
  keys: [
    { pose: apoioDistante, dur: 0.26, hold: 0.05, ease: 'in' },
    { pose: vooDistante, dur: 0.26, ease: 'out' },
    { pose: apoioDistante, dur: 0.26, hold: 0.05, ease: 'in' },
    {
      // Voo com troca: a perna próxima desce para pousar; a distante acabou de sair do chão.
      pose: {
        hip: HIP_TROCA,
        footN: [121.5, 143.3],
        footAngleN: 50,
        footF: [109.5, 139.3],
        footAngleF: 62,
        armN: [88, -2],
        armF: [86, -4],
      },
      dur: 0.26,
      ease: 'out',
    },
    { pose: apoioProximo, dur: 0.26, hold: 0.05, ease: 'in' },
    { pose: vooProximo, dur: 0.26, ease: 'out' },
    { pose: apoioProximo, dur: 0.26, hold: 0.05, ease: 'in' },
    {
      // Voo com troca: a perna distante desce para pousar; a próxima acabou de sair do chão.
      pose: {
        hip: HIP_TROCA,
        footF: [121.5, 143.3],
        footAngleF: 50,
        footN: [109.5, 139.3],
        footAngleN: 62,
        armN: [86, -4],
        armF: [88, -2],
      },
      dur: 0.26,
      ease: 'out',
    },
  ],
  focus: ['thighN', 'thighF', 'glutes'],
};
export default def;
