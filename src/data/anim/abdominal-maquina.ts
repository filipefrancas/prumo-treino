import type { RigDef } from '../../rig/types.ts';

/**
 * Abdominal na máquina: sentado, pés presos sob os rolos, mãos nos pegadores ao lado da cabeça.
 * O tronco enrola para a frente; a alavanca dos pegadores gira num eixo atrás da lombar.
 */
const def: RigDef = {
  id: 'abdominal-maquina',
  view: 'side',
  base: {
    hip: [100, 123.5],
    torso: -92,
    head: -88,
    footN: [126, 157],
    footF: [122, 157],
    footAngleN: 0,
    footAngleF: 0,
    handN: { at: 'shoulder', d: [3, -10] },
    handF: { at: 'shoulder', d: [5, -9] },
    elbowN: 'front',
    elbowF: 'front',
  },
  keys: [
    { pose: {}, dur: 1.6, hold: 0.3 },
    { pose: { torso: -58, head: -30 }, dur: 1.2, hold: 0.5 },
  ],
  props: [
    // Torre atrás do encosto e alavanca dos pegadores.
    { k: 'line', from: [78, 160], to: [78, 92], w: 4, tone: 'eq2' },
    { k: 'circle', c: [78, 112], r: 3 },
    { k: 'line', from: [78, 112], to: { at: 'handN' }, w: 2.4 },
    // Assento e encosto.
    { k: 'line', from: [104, 135], to: [104, 160], w: 3, tone: 'eq2' },
    { k: 'rect', c: [104, 132.5], w: 26, h: 5, r: 2.5 },
    { k: 'rect', c: [90, 108], w: 4, h: 36, r: 2 },
    // Rolos sobre o peito dos pés.
    { k: 'line', from: [112, 135], to: [131, 150.5], w: 2.4, tone: 'eq2' },
    { k: 'circle', c: [131, 150.5], r: 3.6, layer: 'front' },
    { k: 'circle', c: { at: 'handN' }, r: 1.7, layer: 'front' },
  ],
  focus: ['abs'],
};
export default def;
