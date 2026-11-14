import type { RigDef } from '../../rig/types.ts';

/**
 * Recuo com halteres: a perna distante dá o passo para trás, apoia a ponta do pé e o corpo desce reto;
 * a perna próxima (a que trabalha) fica plantada à frente.
 * Seis keys para o pé de trás fazer um passo de verdade (sai do chão, apoia e só então o corpo desce):
 * K0 em pé · K1 pé no ar · K2 pé apoiado atrás · K3 fundo do recuo · K4 = K2 · K5 = K1.
 */
const STEP = { hip: [113, 113], footF: [96, 146], footAngleF: 35 } as const;
const PLANTED = { hip: [102, 119], footF: [68, 150], footAngleF: 68 } as const;

const def: RigDef = {
  id: 'recuo-com-halteres',
  view: 'side',
  base: {
    hip: [121, 109.4],
    torso: -89,
    head: -89,
    footN: [124, 157],
    footF: [119, 157],
    footAngleN: 0,
    footAngleF: 0,
    armN: [88, 84],
    armF: [81, 77],
  },
  keys: [
    { pose: {}, dur: 0.4, hold: 0.3, ease: 'out' },
    { pose: STEP, dur: 0.4, ease: 'in' },
    { pose: PLANTED, dur: 0.35, ease: 'linear' },
    { pose: { hip: [100, 129], torso: -88, head: -88, footF: [68, 150], footAngleF: 68 }, dur: 0.9, hold: 0.3, ease: 'out' },
    { pose: PLANTED, dur: 0.7, ease: 'in' },
    { pose: STEP, dur: 0.35, ease: 'linear' },
  ],
  props: [
    { k: 'circle', c: { at: 'handF' }, r: 4.2, tone: 'eq', layer: 'back' },
    { k: 'circle', c: { at: 'handN' }, r: 4.2, tone: 'eq', layer: 'front' },
  ],
  focus: ['thighN', 'glutes'],
  thumb: 3,
};
export default def;
