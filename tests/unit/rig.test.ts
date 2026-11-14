import { describe, expect, it } from 'vitest';
import { BONE, fitView, frame, ik2, len, loopDuration, mixPose, poseAt, solve, sub, timeOfKey, validate } from '../../src/rig/core.ts';
import type { Pose, RigDef } from '../../src/rig/types.ts';

const standing: Pose = { hip: [120, 110], torso: -90, footN: [124, 157], footF: [118, 157] };

const squat: RigDef = {
  id: 'teste-agachamento',
  view: 'side',
  base: standing,
  keys: [
    { pose: {}, dur: 1, hold: 0.5 },
    { pose: { hip: [100, 136], torso: -58 }, dur: 2, hold: 0.25 },
  ],
};

describe('ik2', () => {
  it('mantém os comprimentos dos ossos e alcança o alvo', () => {
    const r = ik2([0, 0], [20, 10], 16.5, 15.5, [0, -1]);
    expect(len(r.mid)).toBeCloseTo(16.5, 5);
    expect(len(sub(r.end, r.mid))).toBeCloseTo(15.5, 5);
    expect(r.end[0]).toBeCloseTo(20, 5);
    expect(r.end[1]).toBeCloseTo(10, 5);
    expect(r.reach).toBeLessThanOrEqual(0);
  });

  it('escolhe o lado da articulação pelo pole', () => {
    const up = ik2([0, 0], [20, 0], 16.5, 15.5, [0, -1]);
    const down = ik2([0, 0], [20, 0], 16.5, 15.5, [0, 1]);
    expect(up.mid[1]).toBeLessThan(0);
    expect(down.mid[1]).toBeGreaterThan(0);
  });

  it('estica o membro e informa a falta quando o alvo está fora de alcance', () => {
    const r = ik2([0, 0], [100, 0], 16.5, 15.5, [0, -1]);
    expect(r.end[0]).toBeCloseTo(32, 1);
    expect(r.reach).toBeGreaterThan(60);
  });

  it("no pole 'cam' o membro fica reto e encurtado", () => {
    const r = ik2([0, 0], [0, 40], 24.5, 23.5, 'cam');
    expect(r.end[1]).toBeCloseTo(40, 5);
    expect(r.mid[0]).toBeCloseTo(0, 5);
    expect(r.mid[1]).toBeCloseTo((40 * 24.5) / 48, 5);
  });
});

describe('linha do tempo', () => {
  it('soma durações e pausas no ciclo', () => {
    expect(loopDuration(squat)).toBeCloseTo(3.75, 5);
  });

  it('fica parada na key durante o hold e chega na key seguinte no tempo certo', () => {
    expect(poseAt(squat, 0.2).hip).toEqual([120, 110]);
    const k1 = timeOfKey(squat, 1);
    expect(k1).toBeCloseTo(2.5, 5);
    expect(poseAt(squat, k1 + 0.1).hip).toEqual([100, 136]);
  });

  it('volta para a key 0 no fim do ciclo', () => {
    const p = poseAt(squat, loopDuration(squat) - 0.0001);
    expect(p.hip[0]).toBeCloseTo(120, 1);
    expect(p.hip[1]).toBeCloseTo(110, 1);
  });

  it('interpola mãos presas à mesma articulação pelo deslocamento', () => {
    const a: Pose = { ...standing, handN: { at: 'kneeN', d: [0, 0] } };
    const b: Pose = { ...standing, handN: { at: 'kneeN', d: [4, 2] } };
    expect(mixPose(a, b, 0.5).handN).toEqual({ at: 'kneeN', d: [2, 1] });
  });
});

describe('solve', () => {
  it('mantém os pés plantados durante todo o agachamento', () => {
    for (let t = 0; t < loopDuration(squat); t += 0.05) {
      const j = solve(squat, poseAt(squat, t)).joints;
      expect(j.ankleN[0]).toBeCloseTo(124, 4);
      expect(j.ankleN[1]).toBeCloseTo(157, 4);
      expect(len(sub(j.kneeN, j.hipN))).toBeCloseTo(BONE.thigh, 4);
      expect(len(sub(j.ankleN, j.kneeN))).toBeCloseTo(BONE.shin, 4);
    }
  });

  it('dobra o joelho para a frente do corpo por padrão', () => {
    const j = solve(squat, { ...standing, hip: [100, 136], torso: -58 }).joints;
    expect(j.kneeN[0]).toBeGreaterThan(j.hip[0]);
  });

  it('prende a mão à articulação pedida', () => {
    const j = solve(squat, { ...standing, hip: [100, 136], torso: -58, handN: { at: 'kneeN', d: [1, -2] } }).joints;
    expect(j.handN[0]).toBeCloseTo(j.kneeN[0] + 1, 4);
    expect(j.handN[1]).toBeCloseTo(j.kneeN[1] - 2, 4);
  });
});

describe('desenho e validação', () => {
  it('gera as mesmas primitivas, na mesma ordem, em todos os quadros', () => {
    const ids = frame(squat, 0).map((p) => p.id).join(',');
    for (let t = 0.3; t < 3.7; t += 0.37) expect(frame(squat, t).map((p) => p.id).join(',')).toBe(ids);
  });

  it('enquadra o boneco em 4:3 com o chão dentro do quadro', () => {
    const v = fitView(squat);
    expect(v.w / v.h).toBeCloseTo(240 / 180, 5);
    expect(v.y + v.h).toBeGreaterThan(160);
  });

  it('não acusa problemas em uma animação correta', () => {
    expect(validate(squat).filter((i) => i.level === 'error')).toEqual([]);
  });

  it('acusa mistura de IK e FK no mesmo membro', () => {
    const bad: RigDef = { ...squat, keys: [{ pose: {}, dur: 1 }, { pose: { footN: undefined, legN: [90, 90] }, dur: 1 }] };
    expect(validate(bad).some((i) => i.level === 'error')).toBe(true);
  });

  it('avisa quando o alvo fica fora de alcance', () => {
    const far: RigDef = { ...squat, keys: [{ pose: { hip: [120, 60] }, dur: 1 }] };
    expect(validate(far).some((i) => i.msg.includes('fora de alcance'))).toBe(true);
  });
});
