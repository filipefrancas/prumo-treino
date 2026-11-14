import type { RigDef } from '../../rig/types.ts';

/**
 * Alongamento de panturrilha no degrau: ponta dos pés na borda (x = 117,5; topo y = 146), calcanhares para fora,
 * uma mão na parede à frente. A ponta do pé é o apoio fixo: N em (123,8; 143) e F em (121,3; 143).
 * K1: o pé gira -30° em torno da ponta, o calcanhar desce abaixo do topo do degrau e o corpo desce junto, joelhos estendidos.
 */
const def: RigDef = {
  id: 'panturrilha-no-step',
  view: 'side',
  base: {
    hip: [117, 95.5],
    torso: -88,
    head: -88,
    footN: [116, 143],
    footF: [113.5, 143],
    footAngleN: 0,
    footAngleF: 0,
    handN: [147, 74],
    handF: { at: 'hip', d: [2, -9] },
  },
  keys: [
    { pose: {}, dur: 2.2, hold: 0.5 },
    {
      pose: { hip: [118.8, 99.4], footN: [117.05, 146.9], footF: [114.55, 146.9], footAngleN: -30, footAngleF: -30 },
      dur: 2.3,
      hold: 1.8,
    },
  ],
  props: [
    { k: 'line', from: [148.5, 40], to: [148.5, 160], w: 3, tone: 'eq2' },
    { k: 'rect', c: [132.25, 153], w: 29.5, h: 14, r: 2, tone: 'eq2' },
  ],
  focus: ['shinN'],
  arrows: [{ from: [106, 140], to: [106, 153] }],
};
export default def;
