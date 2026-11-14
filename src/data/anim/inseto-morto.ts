import type { RigDef } from '../../rig/types.ts';

// Inseto morto: deitado de costas, cabeça à esquerda. O tronco não se mexe (lombar no chão);
// o braço próximo desce para trás da cabeça e a perna distante estende à frente, rente ao chão.
const def: RigDef = {
  id: 'inseto-morto',
  view: 'side',
  base: {
    hip: [132, 153],
    torso: 180,
    head: 180,
    armN: [-93, -93],
    armF: [-86, -86],
    legN: [-90, 0],
    legF: [-84, 3],
  },
  keys: [
    { pose: {}, dur: 1.5, hold: 0.3 },
    { pose: { armN: [-157, -159], legF: [-3, -3] }, dur: 1.5, hold: 0.4 },
  ],
  props: [{ k: 'rect', c: [124, 161.6], w: 130, h: 3, tone: 'eq2' }],
  focus: ['abs'],
};
export default def;
