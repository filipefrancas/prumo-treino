import type { RigDef } from '../../rig/types.ts';

const def: RigDef = {
  id: 'supino-reto-maquina',
  view: 'side',
  base: {
    hip: [130, 116.25],
    torso: 180,
    head: 182,
    footN: [160, 120],
    footF: [155, 120],
    footAngleN: 0,
    footAngleF: 0,
    handN: [110, 111.5],
    handF: [110, 111.5],
    elbowN: [1, 0.6],
    elbowF: [1, 0.6],
  },
  keys: [
    { pose: {}, dur: 1.6, hold: 0.3 },
    { pose: { handN: [107, 85.5], handF: [107, 85.5] }, dur: 1.2, hold: 0.3 },
  ],
  props: [
    // torre e alavanca da máquina (atrás da cabeça)
    { k: 'rect', c: [61, 129], w: 5, h: 62, r: 2, tone: 'eq2' },
    { k: 'line', from: [61.8, 101], to: { at: 'handN', d: [0, -3] }, w: 2.4, tone: 'eq' },
    { k: 'circle', c: [61.8, 101], r: 3, tone: 'eq' },
    // banco
    { k: 'line', from: [92, 129], to: [92, 160], w: 3, tone: 'eq2' },
    { k: 'line', from: [160, 129], to: [160, 160], w: 3, tone: 'eq2' },
    { k: 'rect', c: [126, 126], w: 96, h: 6, r: 3, tone: 'eq' },
    // pegador (visto de topo) na mão
    { k: 'circle', c: { at: 'handN' }, r: 1.7, tone: 'eq', layer: 'front' },
  ],
  focus: ['chest', 'shoulderN'],
};
export default def;
