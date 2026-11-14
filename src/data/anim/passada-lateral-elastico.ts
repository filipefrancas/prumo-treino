import type { RigDef } from '../../rig/types.ts';

/**
 * Passada lateral com elástico (vista de frente): joelhos semiflexionados, mãos na cintura, elástico nos tornozelos.
 * K0 pés na largura do quadril; K1 um pé abre para o lado; K2 o outro acompanha; K3 abre de volta; fecha em K0.
 * O pé que não está andando mantém exatamente o mesmo alvo.
 */
const def: RigDef = {
  id: 'passada-lateral-elastico',
  view: 'front',
  base: {
    hip: [111, 116],
    torso: -90,
    head: -90,
    footN: [119, 157],
    footF: [103, 157],
    handN: { at: 'hip', d: [9, -7] },
    handF: { at: 'hip', d: [-9, -7] },
    elbowN: 'right',
    elbowF: 'left',
  },
  keys: [
    { pose: {}, dur: 0.45, hold: 0.15 },
    { pose: { hip: [122, 117.5], footN: [141, 157] }, dur: 0.45, hold: 0.15 },
    { pose: { hip: [133, 116], footN: [141, 157], footF: [125, 157] }, dur: 0.45, hold: 0.15 },
    { pose: { hip: [122, 117.5], footN: [141, 157] }, dur: 0.45, hold: 0.15 },
  ],
  props: [{ k: 'line', from: { at: 'ankleF', d: [0, -2] }, to: { at: 'ankleN', d: [0, -2] }, w: 2.4, layer: 'front' }],
  focus: ['hipN', 'hipF'],
};
export default def;
