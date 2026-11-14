import type { RigDef } from '../../rig/types.ts';

const def: RigDef = {
  id: 'figura-4-deitado',
  view: 'side',
  base: {
    hip: [130, 153],
    torso: 180,
    head: 180,
    // Perna distante: coxa perto da vertical, joelho dobrado, canela no ar.
    legF: [-100, -14],
    // Perna próxima: tornozelo cruzado sobre a coxa distante, junto ao joelho; joelho aberto para fora
    // (para a câmera), por isso a perna aparece encurtada. As duas pernas formam o "4".
    footN: [122.8, 132.4],
    kneeN: 'right',
    legScaleN: 0.88,
    footAngleN: -115,
    // As duas mãos seguram a coxa distante (a "de baixo").
    handN: { at: 'kneeF', d: [-0.1, 13.7] },
    handF: { at: 'kneeF', d: [1.7, 15.4] },
    elbowN: [-0.2, -1],
    elbowF: [-0.2, -1],
    armScaleN: 1,
    armScaleF: 1,
  },
  keys: [
    { pose: {}, dur: 2, hold: 0.5 },
    {
      pose: {
        legF: [-114, -28],
        footN: [118, 134.8],
        footAngleN: -129,
        handN: { at: 'kneeF', d: [3.2, 13.4] },
        handF: { at: 'kneeF', d: [5.4, 14.6] },
        armScaleN: 0.9,
        armScaleF: 0.9,
      },
      dur: 2.2,
      hold: 1.5,
    },
  ],
  props: [{ k: 'rect', c: [118, 161.6], w: 130, h: 3, tone: 'eq2', layer: 'front' }],
  focus: ['glutes'],
  order: ['legF', 'armF', 'legN', 'torso', 'head', 'armN'],
};
export default def;
