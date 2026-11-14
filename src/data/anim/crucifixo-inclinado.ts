import type { RigDef } from '../../rig/types.ts';

const def: RigDef = {
  id: 'crucifixo-inclinado',
  view: 'side',
  base: {
    hip: [132, 128],
    torso: -140,
    head: -140,
    footN: [161, 157],
    footF: [156, 157],
    footAngleN: 0,
    footAngleF: 0,
    // braços abertos para os lados: de lado, aparecem encurtados, com as mãos na linha dos ombros
    handN: [112, 103.5],
    handF: [110.5, 103],
    elbowN: 'cam',
    elbowF: 'cam',
  },
  keys: [
    { pose: {}, dur: 1.4, hold: 2 },
    { pose: { handN: [110, 78.2], handF: [106.5, 78.6] }, dur: 1, hold: 0.1 },
  ],
  props: [
    // banco inclinado: pés, assento e encosto
    { k: 'line', from: [113, 124], to: [113, 160], w: 3, tone: 'eq2' },
    { k: 'line', from: [140, 139], to: [140, 160], w: 3, tone: 'eq2' },
    { k: 'rect', c: [139, 137], w: 22, h: 5, r: 2.5, tone: 'eq' },
    { k: 'rect', c: [109, 119.2], w: 50, h: 5, rot: -140, r: 2.5, tone: 'eq' },
    // halteres (pegada neutra: vistos de lado, atravessados na mão)
    { k: 'rect', c: { at: 'handF' }, w: 11, h: 4.2, r: 2, rot: 90, along: [{ at: 'elbowF' }, { at: 'handF' }], tone: 'eq2', layer: 'front' },
    { k: 'rect', c: { at: 'handN' }, w: 11, h: 4.2, r: 2, rot: 90, along: [{ at: 'elbowN' }, { at: 'handN' }], tone: 'eq', layer: 'front' },
  ],
  focus: ['chest'],
};
export default def;
