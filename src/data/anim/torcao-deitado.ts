import type { RigDef } from '../../rig/types.ts';

const def: RigDef = {
  id: 'torcao-deitado',
  view: 'side',
  base: {
    hip: [128, 153],
    torso: 180,
    head: 180,
    // Braços em cruz: o distante aparece encurtado, para cima da tela; o próximo fica escondido atrás do tronco.
    armF: [-90, -90],
    armScaleF: 0.55,
    armScaleN: 0.5,
    // Perna distante estendida no chão.
    legF: [3, 4],
    // Perna próxima: joelho dobrado para cima, pé apoiado no chão.
    footN: [149, 157],
    kneeN: 'up',
    footAngleN: 0,
    legScaleN: 1,
  },
  keys: [
    { pose: {}, dur: 2, hold: 0.5 },
    {
      // O joelho cai para o lado (para a câmera: perna encurtada) e a bacia gira; os ombros ficam no chão.
      pose: { hip: [128, 151], torso: 176.3, legF: [5.5, 6], legScaleN: 0.5 },
      dur: 2.2,
      hold: 1.5,
    },
  ],
  props: [{ k: 'rect', c: [126, 161.6], w: 130, h: 3, tone: 'eq2', layer: 'front' }],
  focus: ['lowerBack'],
  order: ['legF', 'armN', 'armF', 'torso', 'head', 'legN'],
  arrows: [{ from: { at: 'kneeN', d: [9, -15] }, to: { at: 'kneeN', d: [12, -3] }, bend: 4 }],
};
export default def;
