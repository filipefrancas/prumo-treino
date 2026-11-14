import type { RigDef } from '../../rig/types.ts';

const def: RigDef = {
  id: 'elevacao-y-banco',
  view: 'side',
  base: {
    hip: [98, 127],
    torso: -40,
    head: -32,
    // Pernas para trás, ponta dos pés no chão.
    footN: [57.5, 150],
    footF: [62, 150],
    kneeN: 'down',
    kneeF: 'down',
    footAngleN: 96,
    footAngleF: 96,
    // Braços pendentes; sobem à frente até a linha do tronco (o Y abre para os lados: leve encurtamento).
    armN: [90, 90],
    armF: [93, 93],
    armScaleN: 1,
    armScaleF: 1,
  },
  keys: [
    { pose: {}, dur: 1.3, hold: 0.2 },
    { pose: { armN: [-50, -50], armF: [-43, -43], armScaleN: 0.92, armScaleF: 0.92 }, dur: 1, hold: 2 },
  ],
  props: [
    // Banco inclinado: base, dois pés e o estofado sob o peito.
    { k: 'line', from: [94, 158.6], to: [122, 158.6], w: 2.6, tone: 'eq2' },
    { k: 'line', from: [99, 139], to: [99, 158], w: 3, tone: 'eq2' },
    { k: 'line', from: [116, 126], to: [116, 158], w: 3, tone: 'eq2' },
    { k: 'rect', c: [108.55, 130.2], w: 30, h: 5, rot: -40, r: 2.5 },
    // Halteres leves.
    { k: 'circle', c: { at: 'handF' }, r: 3.6, tone: 'eq2' },
    { k: 'circle', c: { at: 'handN' }, r: 3.6, layer: 'front' },
  ],
  focus: ['shoulderN', 'upperBack'],
};
export default def;
