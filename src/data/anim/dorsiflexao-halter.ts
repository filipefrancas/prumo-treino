import type { RigDef } from '../../rig/types.ts';

/**
 * Dorsiflexão com halter: sentado no banco reto, pernas estendidas sobre o banco, pés para fora da ponta,
 * halter preso entre os pés. Só o tornozelo se mexe: de pé em ponta até a ponta dos pés puxada para a canela.
 */
const def: RigDef = {
  id: 'dorsiflexao-halter',
  view: 'side',
  base: {
    hip: [84, 116.5],
    torso: -112,
    head: -100,
    legN: [4, 2.5],
    legF: [5, 3.5],
    footAngleN: -32,
    footAngleF: -32,
    handN: [71, 119.5],
    handF: [73.5, 119.5],
    elbowN: 'back',
    elbowF: 'back',
  },
  keys: [
    { pose: {}, dur: 1.3, hold: 0.2 },
    { pose: { footAngleN: -104, footAngleF: -104 }, dur: 0.9, hold: 2 },
  ],
  props: [
    // Banco reto.
    { k: 'line', from: [72, 129], to: [72, 160], w: 3, tone: 'eq2' },
    { k: 'line', from: [118, 129], to: [118, 160], w: 3, tone: 'eq2' },
    { k: 'rect', c: [94, 126], w: 64, h: 6, r: 3 },
    // Halter entre os pés.
    { k: 'circle', c: { at: 'toeN' }, r: 4.2, layer: 'front' },
  ],
  focus: ['shinN', 'shinF'],
};
export default def;
