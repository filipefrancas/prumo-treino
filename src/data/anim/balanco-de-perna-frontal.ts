import type { RigDef } from '../../rig/types.ts';

/**
 * Balanço de perna para a frente e para trás.
 * Apoio na perna distante (IK, pé plantado) e mão distante na barra; a perna próxima balança em FK como um pêndulo.
 * K0 = atrás (coxa a ~30°), K2 = à frente (coxa a ~60°); K1 e K3 são a passagem sob o corpo, com o joelho solto
 * para o pé não raspar o chão. As eases 'in' e 'out' se emendam: a perna passa pela vertical na velocidade máxima.
 * A barra fica no plano de trás (lado da mão distante): a perna próxima passa na frente dela.
 * O tronco é desenhado por cima da coxa próxima para o destaque da frente do quadril ficar visível.
 */
const PASS = { legN: [80, 110], footAngleN: 2 } as const;

const def: RigDef = {
  id: 'balanco-de-perna-frontal',
  view: 'side',
  base: {
    hip: [110, 109.3],
    torso: -88,
    head: -88,
    footF: [111, 157],
    footAngleF: 0,
    legN: [118, 148],
    footAngleN: 60,
    handF: [140.5, 81],
    elbowF: 'down',
    handN: { at: 'hip', d: [3, -9] },
  },
  keys: [
    { pose: { torso: -86, head: -86 }, dur: 0.4, ease: 'out' },
    { pose: PASS, dur: 0.4, ease: 'in' },
    { pose: { legN: [30, 40], footAngleN: -54, torso: -89, head: -89 }, dur: 0.48, ease: 'out' },
    { pose: PASS, dur: 0.48, ease: 'in' },
  ],
  props: [
    { k: 'line', from: [140.5, 159], to: [140.5, 70], w: 2.4, tone: 'eq' },
    { k: 'line', from: [133, 159.2], to: [148, 159.2], w: 2.4, tone: 'eq' },
  ],
  focus: ['hipN'],
  order: ['legF', 'armF', 'legN', 'torso', 'head', 'armN'],
  thumb: 2,
};
export default def;
