import type { RigDef } from '../../rig/types.ts';

// Eixo da alavanca, baixo e à frente: fica à mesma distância das mãos nas duas keys (as mãos percorrem um arco).
const EIXO = [147.9, 156] as const;

const def: RigDef = {
  id: 'remada-maquina',
  view: 'side',
  base: {
    hip: [100, 123.5],
    torso: -90,
    head: -88,
    footN: [123, 157],
    footF: [118.5, 157],
    footAngleN: 0,
    footAngleF: 0,
    handN: [130.5, 95],
    handF: [130.5, 95],
    elbowN: 'back',
    elbowF: 'back',
  },
  keys: [
    { pose: {}, dur: 1.5, hold: 0.3 },
    { pose: { handN: [107, 107.5], handF: [107, 107.5] }, dur: 1.1, hold: 0.4 },
  ],
  props: [
    // Base da máquina.
    { k: 'line', from: [86, 158.6], to: [152, 158.6], w: 2.6, tone: 'eq2' },
    // Assento.
    { k: 'line', from: [97, 136], to: [97, 158], w: 3, tone: 'eq2' },
    { k: 'rect', c: [97, 133], w: 22, h: 6, r: 3 },
    // Apoio do peito, com a haste que desce entre as pernas.
    { k: 'line', from: [109.8, 112], to: [109.8, 158], w: 3, tone: 'eq2' },
    { k: 'rect', c: [109.5, 104], w: 5.5, h: 21, r: 2.6 },
    // Alavanca: do eixo até as mãos.
    { k: 'line', from: EIXO, to: { at: 'handN' }, w: 2.6 },
    { k: 'circle', c: EIXO, r: 2.8 },
    { k: 'circle', c: { at: 'handN' }, r: 1.7, layer: 'front' },
  ],
  focus: ['upperBack'],
};
export default def;
