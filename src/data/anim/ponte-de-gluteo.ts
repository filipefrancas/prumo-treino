import type { RigDef } from '../../rig/types.ts';

// Ponte de glúteo: deitado de costas, cabeça à esquerda. Os ombros (99, 153) são o pivô e os pés não saem do lugar.
// Braços um pouco afastados do corpo (encurtados pela perspectiva), com as mãos espalmadas no chão.
const def: RigDef = {
  id: 'ponte-de-gluteo',
  view: 'side',
  base: {
    hip: [130, 153],
    torso: 180,
    head: 180,
    footN: [154, 157],
    footF: [158.5, 157],
    footAngleN: 0,
    footAngleF: 0,
    armN: [8.4, 8.4],
    armF: [6.5, 6.5],
    armScaleN: 0.86,
    armScaleF: 0.86,
  },
  keys: [
    { pose: {}, dur: 1.5, hold: 0.3 },
    { pose: { hip: [128.13, 142.4], torso: 160 }, dur: 1.2, hold: 0.4 },
  ],
  props: [{ k: 'rect', c: [122, 161.6], w: 124, h: 3, tone: 'eq2' }],
  focus: ['glutes'],
};
export default def;
