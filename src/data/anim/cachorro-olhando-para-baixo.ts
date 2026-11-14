import type { RigDef } from '../../rig/types.ts';

// V invertido: mãos (à direita) e pés (à esquerda) fixos no chão, quadril no alto, cabeça entre os braços.
// K0: calcanhares levantados (apoio na ponta dos pés). K1: calcanhares descem e o quadril sobe e recua.
const def: RigDef = {
  id: 'cachorro-olhando-para-baixo',
  view: 'side',
  base: {
    hip: [96.5, 107.4],
    torso: 52.2,
    head: 53,
    handN: [135, 157],
    handF: [136.5, 157],
    elbowN: 'up',
    elbowF: 'up',
    footN: [81.8, 152],
    footF: [78.3, 152],
    kneeN: 'right',
    kneeF: 'right',
    footAngleN: 40,
    footAngleF: 40,
  },
  keys: [
    { pose: {}, dur: 2.2, hold: 0.5 },
    {
      pose: {
        hip: [92.3, 110.9],
        torso: 47.2,
        head: 49,
        footN: [80, 157],
        footF: [76.5, 157],
        footAngleN: 0,
        footAngleF: 0,
      },
      dur: 2.4,
      hold: 1.6,
    },
  ],
  props: [{ k: 'rect', c: [116, 161.6], w: 136, h: 3, tone: 'eq2' }],
  focus: ['shinN', 'thighN'],
  arrows: [{ from: { at: 'heelN', d: [-9, -9] }, to: { at: 'heelN', d: [-9, 3] } }],
};
export default def;
