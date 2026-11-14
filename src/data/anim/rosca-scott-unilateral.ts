import type { RigDef } from '../../rig/types.ts';

const def: RigDef = {
  id: 'rosca-scott-unilateral',
  view: 'side',
  base: {
    hip: [98, 123.5],
    torso: -76,
    head: -70,
    footN: [121, 157],
    footF: [116.5, 157],
    footAngleN: 0,
    footAngleF: 0,
    // Braço próximo: o braço fica parado sobre o apoio (50°) e só o antebraço gira.
    armN: [50, 44],
    // Braço distante: descansa na coxa, junto ao quadril.
    handF: { at: 'hip', d: [9, -3.5] },
    elbowF: 'back',
  },
  keys: [
    { pose: {}, dur: 1.5, hold: 0.3 },
    { pose: { armN: [50, -85] }, dur: 1.1, hold: 0.4 },
  ],
  props: [
    // Base, assento e haste do apoio.
    { k: 'line', from: [86, 158.6], to: [122, 158.6], w: 2.6, tone: 'eq2' },
    { k: 'line', from: [96, 136], to: [96, 158], w: 3, tone: 'eq2' },
    { k: 'rect', c: [96, 133], w: 22, h: 6, r: 3 },
    { k: 'line', from: [114.5, 116], to: [114.5, 158], w: 3, tone: 'eq2' },
    // Apoio Scott: inclinado, paralelo ao braço, encostado na parte de trás dele.
    { k: 'rect', c: [113.3, 113], w: 26, h: 7, rot: 50, r: 3 },
    // Halter.
    { k: 'circle', c: { at: 'handN' }, r: 4.2, layer: 'front' },
  ],
  focus: ['upperArmN'],
};
export default def;
