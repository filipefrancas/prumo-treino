import type { RigDef } from '../../rig/types.ts';

/**
 * Rotação de quadril (vista de frente), "abrindo a porteira".
 * Apoio na perna F (IK, pé plantado), mãos na cintura; a perna N em FK descreve o círculo:
 * K0 = em pé · K1 = joelho sobe à frente (perna encurtada pela perspectiva, apontando para a câmera) ·
 * K2 = joelho a meio caminho da abertura · K3 = joelho aberto para o lado, na altura do quadril · volta ao chão.
 * O pé fica na mesma altura enquanto o joelho abre (K1 → K3); o quadril desloca 1,5 para o lado do apoio.
 */
const def: RigDef = {
  id: 'rotacao-de-quadril',
  view: 'front',
  base: {
    hip: [118, 109.5],
    torso: -90,
    head: -90,
    footF: [113.5, 157],
    legN: [90, 90],
    legScaleN: 0.99,
    handN: { at: 'hipN', d: [3, -8] },
    handF: { at: 'hipF', d: [-3, -8] },
    elbowN: 'right',
    elbowF: 'left',
  },
  keys: [
    { pose: {}, dur: 0.7, hold: 0.2 },
    { pose: { hip: [116.5, 109.5], legN: [66, 104], legScaleN: 0.55 }, dur: 0.6 },
    { pose: { hip: [116.5, 109.5], legN: [22, 99], legScaleN: 0.78 }, dur: 0.34, ease: 'in' },
    { pose: { hip: [116.5, 109.5], legN: [5, 96], legScaleN: 1 }, dur: 0.26, hold: 0.15, ease: 'out' },
  ],
  focus: ['hipN'],
  thumb: 3,
};
export default def;
