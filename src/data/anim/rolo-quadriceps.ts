import type { RigDef } from '../../rig/types.ts';

// De bruços, cabeça à direita, apoiado nos antebraços (cotovelo fixo em 144,157; mãos fixas).
// As coxas ficam tangentes ao topo do rolo (centro 100,153; raio externo 8,1): K0 = rolo logo acima do joelho,
// K1 = rolo perto do quadril. Os pés ficam no ar; quem move o corpo são os antebraços.
const def: RigDef = {
  id: 'rolo-quadriceps',
  view: 'side',
  base: {
    hip: [119, 140.4],
    torso: 2.3,
    head: -14,
    handN: [159.5, 157],
    handF: [162.5, 157],
    elbowN: 'down',
    elbowF: 'down',
    legN: [180, 176],
    legF: [180, 168],
    footAngleN: 120,
    footAngleF: 120,
  },
  keys: [
    { pose: {}, dur: 2.4, hold: 0.2 },
    { pose: { hip: [107, 140.4] }, dur: 2.4, hold: 0.2 },
  ],
  props: [
    { k: 'rect', c: [112, 161.6], w: 130, h: 3, tone: 'eq2' },
    { k: 'circle', c: [100, 153], r: 7, ring: 2.2 },
  ],
  focus: ['thighN'],
};
export default def;
