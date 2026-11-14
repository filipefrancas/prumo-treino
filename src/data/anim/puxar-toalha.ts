import type { RigDef } from '../../rig/types.ts';

// Puxar a toalha com o pé: sentado num banco (tampo em y = 134), pé próximo sobre a toalha.
// O motor não tem articulação de dedos nem acessório com tamanho animado. Por isso o braço distante fica
// escondido atrás do tronco e serve de "guia": o cotovelo dele leva a ponta dos dedos (linha de destaque)
// e a mão leva a ponta da toalha. O calcanhar (126.2, 157) não sai do lugar: o pé gira em torno dele,
// a frente do pé sobe um pouco e os dedos se fecham para baixo, arrastando a toalha.
const def: RigDef = {
  id: 'puxar-toalha',
  view: 'side',
  base: {
    hip: [100, 127.5],
    torso: -85,
    head: -78,
    footN: [128, 157],
    footF: [111, 157],
    footAngleN: 0,
    footAngleF: 0,
    handN: { at: 'hip', d: [12, -2.3] },
    armF: [88.6, 85.5],
  },
  keys: [
    { pose: {}, dur: 1.3, hold: 0.3 },
    { pose: { footN: [127.93, 156.5], footAngleN: -16, armF: [101.4, 100.1] }, dur: 1.1, hold: 0.4 },
  ],
  props: [
    // Banco.
    { k: 'line', from: [83, 140], to: [83, 160], w: 3, tone: 'eq2' },
    { k: 'line', from: [109, 140], to: [109, 160], w: 3, tone: 'eq2' },
    { k: 'rect', c: [96, 137], w: 36, h: 6, r: 2.5, tone: 'eq' },
    // Toalha no chão: a ponta da frente é puxada para trás.
    { k: 'line', from: [123, 161.4], to: { at: 'handF', d: [51.7, 32.9] }, w: 2.8, tone: 'eq' },
    // Dedos (fecham para baixo) e pé em destaque.
    { k: 'line', from: { at: 'toeN', d: [0.4, 0.5] }, to: { at: 'elbowF', d: [37.5, 45.2] }, w: 3.4, tone: 'hl', layer: 'front' },
    { k: 'line', from: { at: 'heelN' }, to: { at: 'toeN' }, w: 5.4, tone: 'hl', layer: 'front' },
  ],
  arrows: [{ from: [161, 153], to: [147, 153] }],
};
export default def;
