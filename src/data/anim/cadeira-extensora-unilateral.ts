import type { RigDef } from '../../rig/types.ts';

/**
 * Cadeira extensora unilateral: sentado, costas no encosto, mãos nos apoios; só a perna próxima estende.
 * O rolo fica preso à ponta do pé (pé em dorsiflexão), o que o mantém na frente do tornozelo e girando
 * junto com a canela; a alavanca sai do eixo da máquina, alinhado com o joelho.
 */
const def: RigDef = {
  id: 'cadeira-extensora-unilateral',
  view: 'side',
  base: {
    hip: [100, 119.5],
    torso: -100,
    head: -92,
    handN: [105, 117],
    handF: [104, 116],
    legN: [4.5, 92],
    legF: [6, 108],
    footAngleN: -28,
  },
  keys: [
    { pose: {}, dur: 1.6, hold: 0.3 },
    { pose: { legN: [4.5, 5], footAngleN: -115 }, dur: 1.1, hold: 0.4 },
  ],
  props: [
    // Estrutura: coluna do assento.
    { k: 'line', from: [103, 132], to: [103, 158.5], w: 5, tone: 'eq2' },
    // Encosto e assento.
    { k: 'rect', c: [88.4, 104.3], w: 38, h: 4, rot: 80, r: 2 },
    { k: 'rect', c: [105, 128.5], w: 30, h: 5, r: 2 },
    // Alavanca (do eixo no joelho até o rolo) e rolo na frente do tornozelo.
    { k: 'line', from: [124.4, 121.4], to: { at: 'toeN' }, w: 2.4 },
    { k: 'circle', c: { at: 'toeN' }, r: 3.8, tone: 'eq', layer: 'front' },
  ],
  focus: ['thighN'],
};
export default def;
