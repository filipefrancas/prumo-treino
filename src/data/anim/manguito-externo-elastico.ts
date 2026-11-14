import type { Pose, RigDef } from '../../rig/types.ts';

// Puxada com os cotovelos altos (K1) e "candelabro" (K2): usadas na ida e na volta.
const puxada: Partial<Pose> = { handN: [98, 69.5], handF: [99.5, 70.5], armScaleN: 0.7, armScaleF: 0.7 };
const candelabro: Partial<Pose> = { handN: [88, 64.9], handF: [89.5, 65.9], armScaleN: 0.7, armScaleF: 0.7 };

const def: RigDef = {
  id: 'manguito-externo-elastico',
  view: 'side',
  base: {
    hip: [100, 110.5],
    torso: -90,
    head: -90,
    footN: [104, 157],
    footF: [97, 157],
    footAngleN: 0,
    footAngleF: 0,
    handN: [130.5, 86.5],
    handF: [131, 88],
    elbowN: 'back',
    elbowF: 'back',
    armScaleN: 1,
    armScaleF: 1,
  },
  keys: [
    { pose: {}, dur: 0.8, hold: 0.3 },
    { pose: puxada, dur: 0.8, hold: 0.2 },
    { pose: candelabro, dur: 0.7, hold: 0.2 },
    { pose: { handN: [97.5, 48], handF: [99.5, 48.6], head: -82 }, dur: 0.8, hold: 0.3 },
    { pose: candelabro, dur: 0.8, hold: 0.1 },
    { pose: puxada, dur: 0.7, hold: 0.1 },
  ],
  props: [
    // Espaldar à frente: montante, barra alta projetada e degraus.
    { k: 'line', from: [160, 38], to: [160, 160], w: 3, tone: 'eq2' },
    { k: 'line', from: [160, 47], to: [144, 40.5], w: 2.4, tone: 'eq2' },
    { k: 'circle', c: [144, 40.5], r: 2.2 },
    { k: 'line', from: [157.5, 53.5], to: [162.5, 53.5], w: 2 },
    { k: 'line', from: [157.5, 66.5], to: [162.5, 66.5], w: 2 },
    { k: 'line', from: [157.5, 79.5], to: [162.5, 79.5], w: 2 },
    { k: 'line', from: [157.5, 92.5], to: [162.5, 92.5], w: 2 },
    { k: 'line', from: [157.5, 105.5], to: [162.5, 105.5], w: 2 },
    { k: 'line', from: [157.5, 118.5], to: [162.5, 118.5], w: 2 },
    { k: 'line', from: [157.5, 131.5], to: [162.5, 131.5], w: 2 },
    { k: 'line', from: [157.5, 144.5], to: [162.5, 144.5], w: 2 },
    // Elástico preso no espaldar, na altura do peito.
    { k: 'line', from: [158, 92.5], to: { at: 'handF' }, w: 1.6, tone: 'eq2' },
    { k: 'line', from: [158, 92.5], to: { at: 'handN' }, w: 1.6 },
  ],
  focus: ['shoulderN'],
};
export default def;
