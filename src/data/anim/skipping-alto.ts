import type { RigDef } from '../../rig/types.ts';

/**
 * Skipping alto: elevação alternada dos joelhos até a coxa ficar na horizontal (joelho na altura do quadril),
 * tronco alto, sempre na ponta dos pés.
 * O pé de apoio usa exatamente o mesmo alvo do pouso até o joelho oposto chegar ao alto (N: [113.5, 151.2];
 * F: [118, 151.2]). Só na key de troca seguinte o calcanhar sobe para sair do chão, com a ponta no mesmo ponto.
 */
const def: RigDef = {
  id: 'skipping-alto',
  view: 'side',
  base: {
    hip: [117, 103.4],
    torso: -87,
    head: -88,
    // K0: coxa próxima na horizontal, canela pendurada; apoio na ponta do pé distante.
    footN: [138.6, 126.7],
    footAngleN: 2,
    footF: [118, 151.2],
    footAngleF: 48,
    armN: [132, 42],
    armF: [42, -50],
  },
  keys: [
    { pose: {}, dur: 0.3, ease: 'out' },
    {
      // Troca: o pé próximo pousa na ponta; o pé distante está saindo do chão (calcanhar alto, ponta no mesmo ponto).
      pose: {
        hip: [117, 105.3],
        footN: [113.5, 151.2],
        footAngleN: 48,
        footF: [119.3, 150.2],
        footAngleF: 60,
        armN: [88, -2],
        armF: [86, -4],
      },
      dur: 0.3,
      ease: 'in',
    },
    {
      // Coxa distante na horizontal; apoio na ponta do pé próximo (mesmo alvo do pouso).
      pose: {
        footN: [113.5, 151.2],
        footAngleN: 48,
        footF: [138.6, 126.7],
        footAngleF: 2,
        armN: [42, -50],
        armF: [132, 42],
      },
      dur: 0.3,
      ease: 'out',
    },
    {
      // Troca: o pé distante pousa na ponta (mesmo alvo da K0); o pé próximo está saindo do chão.
      pose: {
        hip: [117, 105.3],
        footN: [114.8, 150.2],
        footAngleN: 60,
        footF: [118, 151.2],
        footAngleF: 48,
        armN: [86, -4],
        armF: [88, -2],
      },
      dur: 0.3,
      ease: 'in',
    },
  ],
  focus: ['thighN', 'thighF', 'hipN'],
  thumb: 0,
};
export default def;
