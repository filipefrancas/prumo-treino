import type { RigDef } from '../../rig/types.ts';

const def: RigDef = {
  id: 'triceps-frances-polia',
  view: 'side',
  base: {
    hip: [120, 112],
    torso: -80,
    head: -66,
    footN: [134, 157],
    footF: [110, 157],
    footAngleN: 0,
    footAngleF: 0,
    // braço direito (próximo): cotovelo fixo apontando para cima, só o antebraço gira
    armN: [-88, 130],
    // o outro braço descansa com a mão na cintura
    handF: { at: 'hip', d: [4, -6] },
    elbowF: 'back',
  },
  keys: [
    { pose: {}, dur: 1.5, hold: 0.3 },
    { pose: { armN: [-88, 276] }, dur: 1.1, hold: 0.3 },
  ],
  props: [
    // torre da polia atrás do corpo e cabo até a mão
    { k: 'rect', c: [80, 104], w: 6, h: 112, r: 2, tone: 'eq2' },
    { k: 'line', from: [86, 108], to: { at: 'handN' }, w: 1.2, tone: 'eq' },
    { k: 'circle', c: [85, 108], r: 3, tone: 'eq' },
  ],
  focus: ['upperArmN'],
};
export default def;
