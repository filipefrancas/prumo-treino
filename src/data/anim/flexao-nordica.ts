import type { RigDef } from '../../rig/types.ts';

/**
 * Flexão nórdica: ajoelhado no apoio, tornozelos presos sob o rolo, corpo reto dos joelhos à cabeça.
 * O corpo gira em torno dos joelhos. Para o joelho não sair do apoio, o quadril percorre o arco
 * com uma key no meio do caminho (22,5°): K0 vertical · K1 meio · K2 a 45° · K3 = K1.
 * Joelho em (100, 145); quadril = joelho − 24,5 · dir(ângulo da coxa).
 * Braços cruzados: mão próxima no ombro oposto, mão distante um pouco abaixo (giram com o tronco).
 */
const MID = {
  hip: [109.38, 122.36],
  torso: -67.5,
  head: -67.5,
  handN: { at: 'shoulder', d: [3.5, 3.3] },
  handF: { at: 'shoulder', d: [3.1, 5.6] },
} as const;

const def: RigDef = {
  id: 'flexao-nordica',
  view: 'side',
  base: {
    hip: [100, 120.5],
    torso: -90,
    head: -90,
    footN: [76.5, 145],
    footF: [75.5, 145],
    footAngleN: 172,
    footAngleF: 172,
    handN: { at: 'shoulder', d: [4.5, 1.7] },
    handF: { at: 'shoulder', d: [5, 4] },
    elbowN: 'down',
    elbowF: 'down',
  },
  keys: [
    { pose: {}, dur: 0.6, hold: 0.3, ease: 'out' },
    { pose: MID, dur: 0.9, ease: 'in' },
    {
      pose: {
        hip: [117.32, 127.68],
        torso: -45,
        head: -45,
        handN: { at: 'shoulder', d: [2, 4.4] },
        handF: { at: 'shoulder', d: [0.7, 6.4] },
      },
      dur: 0.9,
      hold: 0.3,
      ease: 'out',
    },
    { pose: MID, dur: 0.6, ease: 'in' },
  ],
  props: [
    // Apoio dos joelhos e haste do rolo.
    { k: 'rect', c: [88, 154.5], w: 48, h: 11, r: 2, tone: 'eq2' },
    { k: 'line', from: [66, 150], to: [79, 137.6], w: 3, tone: 'eq2' },
    // Rolo que prende os tornozelos.
    { k: 'circle', c: [79, 137.6], r: 3.8, tone: 'eq', layer: 'front' },
  ],
  focus: ['thighN', 'thighF'],
  thumb: 2,
};
export default def;
