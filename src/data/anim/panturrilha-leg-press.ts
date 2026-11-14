import type { RigDef } from '../../rig/types.ts';

/**
 * Panturrilha no leg press horizontal: pernas estendidas, só a ponta dos pés na plataforma vertical.
 * Só o tornozelo se mexe; a plataforma fica presa à ponta do pé e corre no trilho.
 * K0 = calcanhares à frente (panturrilha alongada, pausa de 2 s); K1 = pé em ponta.
 */
const def: RigDef = {
  id: 'panturrilha-leg-press',
  view: 'side',
  base: {
    hip: [80, 135],
    torso: -115,
    head: -105,
    legN: [-6, 3],
    legF: [-4, 5],
    footAngleN: -108,
    footAngleF: -108,
    handN: [78, 136],
    handF: [76.5, 135.5],
  },
  keys: [
    { pose: {}, dur: 1.1, hold: 2 },
    { pose: { footAngleN: -58, footAngleF: -58 }, dur: 0.8, hold: 0.4 },
  ],
  props: [
    // Trilho no chão.
    { k: 'line', from: [58, 158.6], to: [158, 158.6], w: 2.6, tone: 'eq2' },
    { k: 'line', from: [84, 146], to: [84, 158], w: 3, tone: 'eq2' },
    // Assento e encosto reclinado.
    { k: 'rect', c: [86, 144], w: 26, h: 5, r: 2.5 },
    { k: 'rect', c: [65.3, 124.8], w: 36, h: 4, rot: 65, r: 2 },
    // Plataforma presa à ponta dos pés, com a coluna que desce até o trilho.
    { k: 'line', from: { at: 'toeN', d: [4, 0] }, to: { at: 'toeN', d: [4, 31] }, w: 3, tone: 'eq2' },
    { k: 'rect', c: { at: 'toeN', d: [4, -3] }, w: 4, h: 36, r: 2 },
  ],
  focus: ['shinN', 'shinF'],
};
export default def;
