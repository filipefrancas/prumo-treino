import type { RigDef } from '../../rig/types.ts';

const def: RigDef = {
  id: 'elevacao-lateral',
  view: 'front',
  base: {
    hip: [120, 110.5],
    torso: -90,
    footN: [128, 157],
    footF: [112, 157],
    armN: [80, 87],
    armF: [100, 93],
  },
  keys: [
    { pose: {}, dur: 1.6, hold: 0.3 },
    // cotovelos levemente flexionados: a mão termina um pouco abaixo do cotovelo, na altura dos ombros
    { pose: { armN: [1, 10], armF: [179, 170] }, dur: 1.2, hold: 0.4 },
  ],
  props: [
    { k: 'circle', c: { at: 'handN' }, r: 4.2, tone: 'eq', layer: 'front' },
    { k: 'circle', c: { at: 'handF' }, r: 4.2, tone: 'eq', layer: 'front' },
  ],
  focus: ['shoulderN', 'shoulderF'],
};
export default def;
