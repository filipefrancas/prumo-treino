import type { RigDef } from '../../rig/types.ts';

/**
 * Agachamento com halter na frente (goblet): halter junto ao peito, cotovelos para baixo,
 * agachamento profundo com o tronco alto e os calcanhares no chão.
 * O halter é segurado atravessado (uma mão em cada ponta), por isso aparece de topo: um disco.
 */
const def: RigDef = {
  id: 'agachamento-halter-frente',
  view: 'side',
  base: {
    hip: [118, 110.5],
    torso: -87,
    head: -87,
    footN: [124, 157],
    footF: [119, 157],
    footAngleN: 0,
    footAngleF: 0,
    handN: { at: 'shoulder', d: [9, 5] },
    handF: { at: 'shoulder', d: [8, 3.5] },
    elbowN: 'down',
    elbowF: 'down',
  },
  keys: [
    { pose: {}, dur: 1.2, hold: 0.3 },
    {
      pose: {
        hip: [107, 140],
        torso: -72,
        head: -78,
        handN: { at: 'shoulder', d: [7, 7.5] },
        handF: { at: 'shoulder', d: [6.5, 6] },
      },
      dur: 1.6,
      hold: 0.3,
    },
  ],
  props: [{ k: 'circle', c: { at: 'handN', d: [1, 0] }, r: 5, tone: 'eq', layer: 'front' }],
  focus: ['thighN', 'thighF', 'glutes'],
};
export default def;
