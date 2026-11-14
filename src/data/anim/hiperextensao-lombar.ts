import type { RigDef } from '../../rig/types.ts';

/**
 * Hiperextensão de lombar no banco a 45°: pernas retas em diagonal, coxas no apoio, tornozelos presos no rolo.
 * Só o tronco gira no quadril: de pendurado à frente até alinhado com as pernas. Braços cruzados no peito
 * (FK, girando junto com o tronco).
 */
const def: RigDef = {
  id: 'hiperextensao-lombar',
  view: 'side',
  base: {
    hip: [114, 116],
    torso: 38,
    head: 46,
    legN: [135, 135],
    legF: [133.5, 134],
    footAngleN: 45,
    footAngleF: 45,
    armN: [205, 31],
    armF: [200, 26],
  },
  keys: [
    { pose: {}, dur: 1.6, hold: 0.3 },
    { pose: { torso: -45, head: -43, armN: [122, -52], armF: [117, -57] }, dur: 1.2, hold: 0.4 },
  ],
  props: [
    // Base e coluna do banco.
    { k: 'line', from: [72, 158.6], to: [140, 158.6], w: 2.6, tone: 'eq2' },
    { k: 'line', from: [120, 133], to: [120, 158], w: 3, tone: 'eq2' },
    { k: 'line', from: [84, 158], to: [116, 130], w: 3, tone: 'eq2' },
    // Apoio das coxas.
    { k: 'rect', c: [113.5, 128.5], w: 20, h: 6, rot: -45, r: 3 },
    // Plataforma dos pés e rolo atrás dos tornozelos.
    { k: 'rect', c: [87.5, 153.5], w: 4, h: 16, rot: 45, r: 2 },
    { k: 'circle', c: [74.5, 144.5], r: 3.6, layer: 'front' },
  ],
  focus: ['lowerBack', 'glutes'],
};
export default def;
