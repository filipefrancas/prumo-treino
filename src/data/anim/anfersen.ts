import type { RigDef } from '../../rig/types.ts';

/**
 * Anfersen: calcanhar no glúteo, alternando. A coxa fica quase na vertical e só a canela gira para trás.
 * Pernas em FK para a canela descrever o arco natural em volta do joelho. Os ângulos da perna de apoio foram
 * calculados (IK → FK) para o tornozelo de apoio cair no mesmo ponto no pouso e no apoio (N: [113.5, 151.2];
 * F: [118, 151.2]) e para a ponta do pé continuar no mesmo ponto do chão quando o calcanhar sobe para sair.
 */
const def: RigDef = {
  id: 'anfersen',
  view: 'side',
  base: {
    hip: [117, 103.8],
    torso: -83,
    head: -84,
    // K0: calcanhar próximo no glúteo; apoio na ponta do pé distante.
    legN: [85, 235],
    footAngleN: 160,
    legF: [80, 98],
    footAngleF: 48,
    armN: [55, -35],
    armF: [120, 30],
  },
  keys: [
    { pose: {}, dur: 0.3, ease: 'out' },
    {
      // Troca: o pé próximo pousa na ponta; o pé distante está saindo do chão (calcanhar alto).
      pose: {
        hip: [117, 105.3],
        legN: [78.3, 111.2],
        footAngleN: 48,
        legF: [67, 108],
        footAngleF: 60,
        armN: [88, -2],
        armF: [86, -4],
      },
      dur: 0.3,
      ease: 'in',
    },
    {
      // Calcanhar distante no glúteo; apoio na ponta do pé próximo.
      pose: {
        legN: [86.4, 102.4],
        footAngleN: 48,
        legF: [81, 232],
        footAngleF: 158,
        armN: [120, 30],
        armF: [55, -35],
      },
      dur: 0.3,
      ease: 'out',
    },
    {
      // Troca: o pé distante pousa na ponta; o pé próximo está saindo do chão.
      pose: {
        hip: [117, 105.3],
        legN: [72.7, 113.8],
        footAngleN: 60,
        legF: [72.1, 106.1],
        footAngleF: 48,
        armN: [86, -4],
        armF: [88, -2],
      },
      dur: 0.3,
      ease: 'in',
    },
  ],
  focus: ['thighN', 'thighF'],
  thumb: 0,
};
export default def;
