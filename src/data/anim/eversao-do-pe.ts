import type { RigDef } from '../../rig/types.ts';

// De frente, sentado no chão (visto um pouco de cima: o colchonete aparece como um plano).
// A perna próxima fica estendida em direção à câmera (encurtada); a outra, dobrada e solta para o lado.
// O elástico prende na ponta do pé e puxa para dentro; a ponta do pé gira para fora. Só o tornozelo se mexe.
const def: RigDef = {
  id: 'eversao-do-pe',
  view: 'front',
  base: {
    hip: [116, 116],
    torso: -90,
    legN: [86, 86],
    legScaleN: 0.8,
    footAngleN: -84,
    legF: [176, 100],
    legScaleF: 0.8,
    footAngleF: 178,
    handN: [136, 115],
    elbowN: 'right',
    handF: { at: 'kneeF', d: [4, -3] },
    elbowF: 'left',
  },
  keys: [
    { pose: {}, dur: 1.5, hold: 0.3 },
    { pose: { footAngleN: -38 }, dur: 1.2, hold: 0.5 },
  ],
  props: [
    { k: 'rect', c: [122, 140], w: 136, h: 42, r: 4, tone: 'soft' },
    // Ponto fixo do elástico, do lado de dentro do pé (passa à frente da outra perna).
    { k: 'line', from: [84, 143], to: [84, 158], w: 3, tone: 'eq2' },
    { k: 'line', from: [84, 150.5], to: { at: 'toeN' }, w: 2, layer: 'front' },
  ],
  focus: ['shinN'],
  arrows: [{ from: { at: 'ankleN', d: [9, -13] }, to: { at: 'ankleN', d: [18, -3] }, bend: -3 }],
};
export default def;
