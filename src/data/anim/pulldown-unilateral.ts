import type { RigDef } from '../../rig/types.ts';

// Eixo da alavanca na coluna da máquina: fica à mesma distância da mão nas duas keys (a mão percorre um arco).
const EIXO = [150, 84] as const;

const def: RigDef = {
  id: 'pulldown-unilateral',
  view: 'side',
  base: {
    hip: [104, 123.5],
    torso: -90,
    head: -90,
    footN: [127, 157],
    footF: [122.5, 157],
    footAngleN: 0,
    footAngleF: 0,
    // Braço próximo: puxa o pegador da alavanca.
    handN: [116, 63.5],
    elbowN: 'down',
    // Braço distante: descansa na coxa.
    handF: { at: 'kneeF', d: [-12.5, -14] },
    elbowF: 'back',
  },
  keys: [
    { pose: {}, dur: 1.6, hold: 0.3 },
    { pose: { handN: [112, 95.5] }, dur: 1.2, hold: 0.4 },
  ],
  props: [
    // Coluna e base da máquina.
    { k: 'rect', c: [152.5, 116], w: 5, h: 88, r: 2, tone: 'eq2' },
    { k: 'line', from: [92, 158.6], to: [154, 158.6], w: 2.6, tone: 'eq2' },
    // Assento.
    { k: 'line', from: [101, 136], to: [101, 158], w: 3, tone: 'eq2' },
    { k: 'rect', c: [101, 133], w: 26, h: 6, r: 3 },
    // Rolo sobre as coxas.
    { k: 'line', from: [124.4, 123], to: [151, 123], w: 2.4, tone: 'eq2' },
    { k: 'circle', c: [124.4, 123], r: 4.3 },
    // Alavanca: do eixo até a mão.
    { k: 'line', from: EIXO, to: { at: 'handN' }, w: 2.6 },
    { k: 'circle', c: EIXO, r: 2.8 },
    { k: 'circle', c: { at: 'handN' }, r: 1.7, layer: 'front' },
  ],
  focus: ['upperBack'],
};
export default def;
