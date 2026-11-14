import type { RigDef } from '../../rig/types.ts';

/**
 * Tríceps paralela na máquina (mergulho sentado): tronco levemente inclinado à frente, pegadores ao lado do quadril.
 * A alavanca gira num eixo atrás do banco; a mão percorre um arco quase vertical, das costelas até ao lado do quadril.
 */
const def: RigDef = {
  id: 'triceps-paralela-maquina',
  view: 'side',
  base: {
    hip: [108, 123.5],
    torso: -80,
    head: -78,
    footN: [135, 157],
    footF: [130, 157],
    footAngleN: 0,
    footAngleF: 0,
    handN: [104, 110],
    handF: [105.5, 110.5],
    elbowN: 'back',
    elbowF: 'back',
  },
  keys: [
    { pose: {}, dur: 1.6, hold: 0.3 },
    { pose: { handN: [112, 124.5], handF: [113.5, 125] }, dur: 1.2, hold: 0.4 },
  ],
  props: [
    // Torre e eixo da alavanca, atrás do encosto.
    { k: 'line', from: [75, 160], to: [75, 126], w: 4, tone: 'eq2' },
    { k: 'circle', c: [75, 135.5], r: 3 },
    { k: 'line', from: [75, 135.5], to: { at: 'handN' }, w: 2.4 },
    // Assento e encosto.
    { k: 'line', from: [110, 135], to: [110, 160], w: 3, tone: 'eq2' },
    { k: 'rect', c: [111, 132.5], w: 26, h: 5, r: 2.5 },
    { k: 'rect', c: [101.5, 107], w: 34, h: 4, rot: -80, r: 2 },
    { k: 'circle', c: { at: 'handN' }, r: 1.7, layer: 'front' },
  ],
  focus: ['upperArmN', 'upperArmF'],
};
export default def;
