import type { RigDef } from '../../rig/types.ts';

const def: RigDef = {
  id: 'crucifixo-inverso',
  view: 'side',
  base: {
    hip: [98, 125],
    torso: -30,
    head: -24,
    // Pernas para trás, ponta dos pés no chão.
    footN: [58.5, 150],
    footF: [63, 150],
    kneeN: 'down',
    kneeF: 'down',
    footAngleN: 96,
    footAngleF: 96,
    // Os braços abrem para os lados: de lado, saem retos e encurtam (cotovelo "para a câmera").
    handN: [125.5, 141],
    handF: [122, 140.5],
    elbowN: 'cam',
    elbowF: 'cam',
  },
  keys: [
    { pose: {}, dur: 1.5, hold: 0.3 },
    { pose: { handN: [121.9, 99.5], handF: [118.9, 97.5] }, dur: 1.1, hold: 0.4 },
  ],
  props: [
    // Banco inclinado baixo: base, dois pés e o estofado sob o peito.
    { k: 'line', from: [93, 158.6], to: [124, 158.6], w: 2.6, tone: 'eq2' },
    { k: 'line', from: [98, 137], to: [98, 158], w: 3, tone: 'eq2' },
    { k: 'line', from: [118, 126], to: [118, 158], w: 3, tone: 'eq2' },
    { k: 'rect', c: [109.1, 129.3], w: 30, h: 5, rot: -30, r: 2.5 },
    // Halteres.
    { k: 'circle', c: { at: 'handF' }, r: 4.2, tone: 'eq2' },
    { k: 'circle', c: { at: 'handN' }, r: 4.2, layer: 'front' },
  ],
  focus: ['shoulderN', 'upperBack'],
};
export default def;
