import type { RigDef } from '../../rig/types.ts';

// De bruços, cabeça à direita, quadril no chão, apoiado nos antebraços (mãos fixas). A perna próxima (N) abre
// para o lado (para a câmera) com o joelho dobrado: a coxa aparece encurtada, subindo na tela, e a parte interna
// passa por cima do rolo (centro 113,153, desenhado à frente porque fica entre a câmera e o quadril).
// O corpo desliza de lado sobre o rolo: de perfil isso aparece só como a coxa encurtando e alongando.
const def: RigDef = {
  id: 'rolo-adutores',
  view: 'side',
  base: {
    hip: [108, 153],
    torso: -22,
    head: -30,
    handN: [152.2, 157],
    handF: [155.2, 157],
    elbowN: 'down',
    elbowF: 'down',
    legF: [180, 180],
    footAngleF: 150,
    legN: [-75, 128],
    legScaleN: 0.55,
    footAngleN: 180,
  },
  keys: [
    { pose: {}, dur: 2.4, hold: 0.2 },
    { pose: { legScaleN: 0.72, legN: [-48, 132] }, dur: 2.4, hold: 0.2 },
  ],
  props: [
    { k: 'rect', c: [108, 161.6], w: 130, h: 3, tone: 'eq2' },
    { k: 'circle', c: [113, 153], r: 7, ring: 2.2, layer: 'front' },
  ],
  focus: ['thighN'],
};
export default def;
