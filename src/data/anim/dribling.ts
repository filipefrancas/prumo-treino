import type { RigDef } from '../../rig/types.ts';

/**
 * Dribling: passos curtíssimos no lugar, rolando o pé do calcanhar à ponta.
 * A ponta de cada pé fica sempre no mesmo ponto do chão (N em x ≈ 119,8; F em x ≈ 128,8): só o calcanhar sobe e desce.
 * Fases de cada pé: apoio inteiro → calcanhar sobe → ponta sai um pouco do chão (joelho vai à frente) → ponta toca e o calcanhar desce.
 * O pé distante pisa um pouco à frente do próximo para as duas pernas ficarem visíveis.
 */
const def: RigDef = {
  id: 'dribling',
  view: 'side',
  base: {
    hip: [119.5, 110],
    torso: -87,
    head: -87,
    // K0: pé próximo no alto do passo (calcanhar alto, ponta rente ao chão); pé distante inteiro no chão.
    footN: [113.8, 150],
    footAngleN: 48,
    footF: [121, 157],
    footAngleF: 0,
    armN: [112, 22],
    armF: [62, -28],
  },
  keys: [
    { pose: {}, dur: 0.3, ease: 'out' },
    {
      // Troca: a ponta do pé próximo toca e o calcanhar desce; o calcanhar do pé distante começa a subir.
      pose: {
        hip: [119.5, 109],
        footN: [112.5, 154.3],
        footAngleN: 20,
        footF: [122.5, 152.4],
        footAngleF: 36,
        armN: [88, -2],
        armF: [86, -4],
      },
      dur: 0.3,
      ease: 'in',
    },
    {
      // Outro lado: pé próximo inteiro no chão; pé distante no alto do passo.
      pose: {
        footN: [112, 157],
        footAngleN: 0,
        footF: [122.8, 150],
        footAngleF: 48,
        armN: [62, -28],
        armF: [112, 22],
      },
      dur: 0.3,
      ease: 'out',
    },
    {
      // Troca: o calcanhar do pé próximo sobe; a ponta do pé distante toca.
      pose: {
        hip: [119.5, 109],
        footN: [113.5, 152.4],
        footAngleN: 36,
        footF: [121.5, 154.3],
        footAngleF: 20,
        armN: [86, -4],
        armF: [88, -2],
      },
      dur: 0.3,
      ease: 'in',
    },
  ],
  focus: ['shinN', 'shinF'],
  thumb: 0,
};
export default def;
