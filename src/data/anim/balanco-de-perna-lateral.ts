import type { RigDef } from '../../rig/types.ts';

/**
 * Balanço de perna para os lados (vista de frente).
 * Apoio na perna F (IK, pé plantado), mãos fixas sobre a barra à frente; a perna N balança em FK como um pêndulo:
 * K0 = cruza à frente da perna de apoio, K1 = abre para o lado (~45°).
 * A perna encurta um pouco ao cruzar (legScaleN) porque passa à frente do corpo, e assim o pé não raspa o chão.
 */
const def: RigDef = {
  id: 'balanco-de-perna-lateral',
  view: 'front',
  base: {
    hip: [118, 109.5],
    torso: -90,
    head: -90,
    footF: [115.5, 157],
    legN: [116, 116],
    legScaleN: 0.9,
    footAngleN: 50,
    handN: [136, 97.6],
    handF: [100, 97.6],
    elbowN: 'right',
    elbowF: 'left',
    armScaleN: 0.72,
    armScaleF: 0.72,
  },
  keys: [
    { pose: { torso: -89, head: -89 }, dur: 0.85 },
    { pose: { legN: [45, 45], legScaleN: 1, footAngleN: -20, torso: -91.5, head: -91.5 }, dur: 0.85 },
  ],
  props: [
    // Barra à frente do corpo: inteira no plano de trás (as mãos ficam por cima dela)
    // e o trecho central repetido no plano da frente (a barra passa na frente do tronco).
    { k: 'line', from: [82, 99], to: [154, 99], w: 3, tone: 'eq' },
    { k: 'line', from: [106, 99], to: [130, 99], w: 3, tone: 'eq', layer: 'front' },
  ],
  focus: ['hipN'],
};
export default def;
