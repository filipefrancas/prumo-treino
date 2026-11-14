import type { RigDef, Pose } from '../../rig/types.ts';

/**
 * Hop: saltitos baixos sobre uma perna, com o outro joelho elevado a uns 45°. Dois toques com a mesma perna e troca.
 * Ciclo: toque (apoio distante) → voo → toque → voo com troca → toque (apoio próximo) → voo → toque → voo com troca.
 * Os dois pés pousam no mesmo ponto (ponta em x ≈ 121): o pé de apoio volta exatamente ao mesmo alvo a cada toque.
 * A perna elevada acompanha o quadril (mesmo deslocamento), então não muda de forma durante o saltito.
 */

// Toque: quadril baixo, apoio no antepé (calcanhar baixo), joelho de apoio levemente flexionado.
const HIP_TOQUE: [number, number] = [117, 106.5];
// Voo: quadril 7,7 mais alto, perna de apoio estendida com a ponta do pé para baixo (uns 4 acima do chão).
const HIP_VOO: [number, number] = [117, 98.8];

const apoioDistante: Partial<Pose> = {
  hip: HIP_TOQUE,
  footF: [114.25, 153.1],
  footAngleF: 30,
  footN: [127.85, 146.4],
  footAngleN: 12,
  armN: [116, 28],
  armF: [58, -30],
};
const vooDistante: Partial<Pose> = {
  hip: HIP_VOO,
  footF: [117.7, 146],
  footAngleF: 70,
  footN: [127.85, 138.7],
  footAngleN: 12,
  armN: [124, 36],
  armF: [50, -40],
};
const apoioProximo: Partial<Pose> = {
  hip: HIP_TOQUE,
  footN: [114.25, 153.1],
  footAngleN: 30,
  footF: [127.85, 146.4],
  footAngleF: 12,
  armN: [58, -30],
  armF: [116, 28],
};
const vooProximo: Partial<Pose> = {
  hip: HIP_VOO,
  footN: [117.7, 146],
  footAngleN: 70,
  footF: [127.85, 138.7],
  footAngleF: 12,
  armN: [50, -40],
  armF: [124, 36],
};

const def: RigDef = {
  id: 'hop',
  view: 'side',
  base: {
    hip: HIP_TOQUE,
    torso: -86,
    head: -87,
    footN: [127.85, 146.4],
    footAngleN: 12,
    footF: [114.25, 153.1],
    footAngleF: 30,
    armN: [116, 28],
    armF: [58, -30],
  },
  keys: [
    { pose: apoioDistante, dur: 0.2, hold: 0.04, ease: 'in' },
    { pose: vooDistante, dur: 0.2, ease: 'out' },
    { pose: apoioDistante, dur: 0.2, hold: 0.04, ease: 'in' },
    {
      // Voo com troca: a perna próxima desce para pousar; a distante acabou de sair do chão.
      pose: {
        hip: HIP_VOO,
        footN: [121.5, 145.6],
        footAngleN: 50,
        footF: [109.5, 141.6],
        footAngleF: 62,
        armN: [88, -2],
        armF: [86, -4],
      },
      dur: 0.2,
      ease: 'out',
    },
    { pose: apoioProximo, dur: 0.2, hold: 0.04, ease: 'in' },
    { pose: vooProximo, dur: 0.2, ease: 'out' },
    { pose: apoioProximo, dur: 0.2, hold: 0.04, ease: 'in' },
    {
      // Voo com troca: a perna distante desce para pousar; a próxima acabou de sair do chão.
      pose: {
        hip: HIP_VOO,
        footF: [121.5, 145.6],
        footAngleF: 50,
        footN: [109.5, 141.6],
        footAngleN: 62,
        armN: [86, -4],
        armF: [88, -2],
      },
      dur: 0.2,
      ease: 'out',
    },
  ],
  focus: ['shinN', 'shinF'],
};
export default def;
