import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { exById } from '../../src/data/ex/_index.ts';
import { EXERCICIOS_ANTIGOS, METODO_TXT_EXERCICIO, PROGRAMAS, PROGRAMA_ANTIGO, programaPorId } from '../../src/data/fichas.ts';
import {
  METODO_ROTULO, METODO_TXT, acharExercicio, aplicarAjuste, blocosDaFicha, catalogoDoExercicio, concluirSessao, contaComoFeito,
  descansoDe, desmarcarSerie, duracaoDoLift, e1rm, ehPreparacaoAntiga, ehPrincipal, esquemaDaSerie, exerciciosPreparacao,
  exerciciosPrincipais, fichaDoDia, fichaPorLetra, fichasAtivas, historicoEx, iniciarSessao, lerReps, liftsFeitos, marcarSerie,
  metodoTexto, nomeDoExercicio, paresCombinados, parceiroDe, programaAtivo, proximaFicha, prsDoLift, pularExercicio,
  resumoSemanaMusc, rotacaoFichas, serieConta, serieGravadaConta, seriesDeTrabalho, seriesFeitas, seriesMarcadas,
  seriesPlanejadas, sessaoAberta, sugestao, totalSeriesDeTrabalho, ultimaVez, volumeDoLift,
} from '../../src/lib/academia.ts';
import type { Ficha, FichaExercicio, Lift, SerieFeita, Settings } from '../../src/types.ts';

/* ---------------- apoio ---------------- */

/** Ajustes do estado inicial: seg A, ter descanso (alongamento), qua corrida, qui B, sex corrida, sáb C, dom corrida. Chave 0 = domingo. */
function ajustes(over: Partial<Settings> = {}): Settings {
  return {
    nome: 'Filipe', tema: 'auto', som: true, voz: true, vibrar: true, telaLigada: true, descansoPadrao: 90, alongamentoSeg: 60,
    fcMax: 192, zonas: [], programa: 'maromba',
    plano: {
      0: { tipo: 'corrida' }, 1: { tipo: 'musc', ficha: 'A' }, 2: { tipo: 'descanso' }, 3: { tipo: 'corrida' },
      4: { tipo: 'musc', ficha: 'B' }, 5: { tipo: 'corrida' }, 6: { tipo: 'musc', ficha: 'C' },
    },
    ...over,
  };
}

function ex(id: string): FichaExercicio {
  const achado = acharExercicio(id);
  if (!achado) throw new Error(`exercício ${id} não existe`);
  return achado.ex;
}
function ficha(letra: string): Ficha {
  const f = fichaPorLetra(ajustes(), letra);
  if (!f) throw new Error(`ficha ${letra} não existe`);
  return f;
}

/** Monta as séries feitas de um exercício: [[carga, reps], …] vira { "1": …, "2": … }. */
function feitas(pares: [number, number][]): Record<string, SerieFeita> {
  const out: Record<string, SerieFeita> = {};
  pares.forEach(([carga, reps], i) => { out[String(i + 1)] = { carga, reps, feito: true, t: '18:00' }; });
  return out;
}
let seq = 0;
function lift(data: string, letra: string, sets: Record<string, [number, number][]> = {}, over: Partial<Lift> = {}): Lift {
  const f = ficha(letra), s: Record<string, Record<string, SerieFeita>> = {};
  for (const [exId, pares] of Object.entries(sets)) s[exId] = feitas(pares);
  return { id: `l${++seq}`, data, ficha: letra, treino: f.nome, programa: 'maromba', concluido: true, emAndamento: false, sets: s, ...over };
}
/** Exercício fora do catálogo, para os ramos que o programa atual não usa (métodos, pares, preparação, tempo). */
function avulso(over: Partial<FichaExercicio>): FichaExercicio {
  return { id: 'x-1', anim: 'x', nome: 'Avulso', grupo: 'teste', tipo: 'principal', series: [], ...over };
}

/**
 * Ficha de teste com tudo o que o motor aceita e o programa atual não tem: preparação (alongamento, mobilidade,
 * aquecimento), pares combinados, cluster-set, rest-pause, super-set, drop-set, peso do corpo e série por tempo.
 */
const X = {
  alongA: avulso({ id: 'x-01', tipo: 'alongamento', combinado: 'c1', series: [{ sets: 2, reps: '45 s', carga: 0, intervalo: 45 }] }),
  alongB: avulso({ id: 'x-02', tipo: 'alongamento', combinado: 'c1', series: [{ sets: 2, reps: '45 s', carga: 0, intervalo: 30 }] }),
  mob: avulso({ id: 'x-03', tipo: 'mobilidade', series: [{ sets: 1, reps: '10', carga: null, intervalo: null }] }),
  aq: avulso({ id: 'x-04', tipo: 'aquecimento', combinado: 'c2', series: [{ sets: 2, reps: '15-20', carga: 0, intervalo: null }] }),
  ombro: avulso({ id: 'x-05', combinado: 'c2', series: [{ sets: 2, reps: '10-15', carga: 15, intervalo: null }] }),
  remada: avulso({ id: 'x-06', series: [{ sets: 1, reps: '10-15', carga: 25, intervalo: 60, nota: 'aquecimento' }, { sets: 3, reps: '8-12', carga: 40, intervalo: 90 }] }),
  cluster: avulso({ id: 'x-07', metodo: 'cluster-set', series: [{ sets: 3, reps: '4-4-4', carga: 35, intervalo: 90 }] }),
  rest: avulso({ id: 'x-08', metodo: 'rest-pause', series: [{ sets: 3, reps: '8-12', carga: 40, intervalo: 90 }] }),
  superA: avulso({ id: 'x-09', metodo: 'super-set', combinado: 'c4', series: [{ sets: 4, reps: '15-20', carga: 7, intervalo: null }] }),
  superB: avulso({ id: 'x-10', metodo: 'super-set', combinado: 'c4', series: [{ sets: 4, reps: '8-12', carga: 16, intervalo: 30 }] }),
  drop: avulso({ id: 'x-11', metodo: 'drop-set', series: [{ sets: 2, reps: '10-15', carga: 96, intervalo: 90, drops: [96, 52, 38] }] }),
  corpo: avulso({ id: 'x-12', equipamento: 'banco', series: [{ sets: 3, reps: '10-15', carga: 0, intervalo: 90 }] }),
  elastico: avulso({ id: 'x-13', tipo: 'aquecimento', series: [{ sets: 2, reps: '20/20', carga: null, intervalo: null, nota: 'elástico azul' }] }),
};
const FX: Ficha = { id: 'X', nome: 'Avulsa', exercicios: Object.values(X) };

/* ---------------- catálogo ---------------- */

describe('programa Maromba', () => {
  const p = programaPorId('maromba');
  const todos = (p?.fichas ?? []).flatMap((f) => f.exercicios);

  it('é o único programa, com as 3 fichas e os 27 exercícios', () => {
    expect(PROGRAMAS).toHaveLength(1);
    expect(p).toMatchObject({ id: 'maromba', nome: 'Maromba', objetivo: 'Hipertrofia', fonte: 'Treino montado em nov/2026 para a Planet Sports' });
    expect(p?.fichas.map((f) => `${f.id} ${f.nome} ${f.exercicios.length}`)).toEqual(['A Pernas 9', 'B Peito e costas 9', 'C Braços e ombros 9']);
    expect(todos).toHaveLength(27);
    expect(programaPorId('nao-existe')).toBeUndefined();
    expect(programaPorId(PROGRAMA_ANTIGO)).toBeUndefined(); // a ficha antiga saiu do app
  });

  it('exercícios, séries e descansos são os do plano aprovado', () => {
    const linha = (e: FichaExercicio): string => `${e.anim} ${e.series.map((b) => `${b.sets}x${b.reps}`).join('+')} ${e.series[e.series.length - 1]?.intervalo}s`;
    expect(ficha('A').exercicios.map(linha)).toEqual([
      'agachamento-hack 1x12-15+4x8-10 120s',
      'leg-press-45 3x10-12 90s',
      'cadeira-extensora 3x12-15 60s',
      'cadeira-flexora 4x10-12 75s',
      'stiff-halteres 3x10-12 90s',
      'cadeira-abdutora 3x12-15 60s',
      'cadeira-adutora 3x12-15 60s',
      'panturrilha-em-pe-maquina 4x12-15 45s',
      'panturrilha-sentado 3x12-15 45s',
    ]);
    expect(ficha('B').exercicios.map(linha)).toEqual([
      'supino-reto-barra 1x12-15+4x6-10 120s',
      'puxada-frente 4x8-12 90s',
      'supino-inclinado-halteres 3x8-12 90s',
      'remada-unilateral-halter 4x8-10 90s',
      'crossover 3x12-15 60s',
      'voador 3x12-15 60s',
      'remada-baixa 3x10-12 90s',
      'pullover-polia 3x12-15 60s',
      'crucifixo-inverso-voador 3x12-15 60s',
    ]);
    expect(ficha('C').exercicios.map(linha)).toEqual([
      'desenvolvimento-halteres 1x12-15+3x8-12 90s',
      'elevacao-lateral 4x12-15 45s',
      'rosca-direta-barra 4x8-10 75s',
      'triceps-testa 4x8-10 75s',
      'rosca-banco-inclinado 3x10-12 60s',
      'triceps-frances-polia 3x10-12 60s',
      'rosca-martelo 3x10-12 60s',
      'triceps-corda 3x12-15 60s',
      'abdominal-maquina 3x12-15 60s',
    ]);
  });

  it('ids novos e permanentes, tudo principal, sem pares nem métodos', () => {
    for (const f of p?.fichas ?? []) {
      // Os ids não seguem a ordem da ficha: exercício que entra depois ganha o número seguinte e não renumera os outros.
      // Exercício trocado por outro bem diferente também ganha id novo, e o antigo se aposenta
      // (fica em EXERCICIOS_ANTIGOS para o histórico não misturar as cargas).
      const ids = f.exercicios.map((e) => e.id);
      expect(new Set(ids).size).toBe(9);
      for (const id of ids) expect(id.startsWith(`m-${f.id}-`)).toBe(true);
      if (f.id === 'B') expect([...ids].sort()).toEqual(['m-B-01', 'm-B-02', 'm-B-03', 'm-B-05', 'm-B-06', 'm-B-08', 'm-B-09', 'm-B-10', 'm-B-11']);
      f.exercicios.forEach((e) => {
        expect(e.anim).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
        expect(e.equipamento).toBeTruthy();
        expect(e.tipo).toBe('principal');
        expect(e.combinado).toBeUndefined();
        expect(e.metodo).toBeUndefined();
        expect(e.instrucoes).toBeUndefined();
      });
    }
    expect(new Set(todos.map((e) => e.id)).size).toBe(27);
    expect(new Set(todos.map((e) => e.anim)).size).toBe(27); // nenhum exercício repetido entre as fichas
    for (const e of todos) expect(e.id in EXERCICIOS_ANTIGOS).toBe(false); // não colide com os ids da ficha antiga
    expect(METODO_TXT_EXERCICIO).toEqual({});
  });

  it('a primeira série do primeiro exercício é leve; as demais deixam 1 a 2 repetições de folga', () => {
    for (const f of p?.fichas ?? []) {
      f.exercicios.forEach((e, i) => {
        const trabalho = e.series[e.series.length - 1];
        expect(trabalho).toMatchObject({ rir: '1-2' });
        expect(trabalho?.nota).toBeUndefined();
        expect(trabalho?.carga).toBeGreaterThan(0);
        expect(trabalho?.intervalo).toBeGreaterThan(0);
        if (i === 0) {
          expect(e.series).toHaveLength(2);
          expect(e.series[0]).toMatchObject({ sets: 1, reps: '12-15', nota: 'aquecimento' });
          const fracao = (e.series[0]?.carga ?? 0) / (trabalho?.carga ?? 1);
          expect(fracao).toBeGreaterThanOrEqual(0.4);
          expect(fracao).toBeLessThanOrEqual(0.6); // cerca de metade da carga de trabalho
        } else {
          expect(e.series).toHaveLength(1);
        }
      });
    }
  });

  it('cargas de partida conhecidas', () => {
    const carga = (id: string): number | null | undefined => ex(id).series[ex(id).series.length - 1]?.carga;
    expect(carga('m-A-02')).toBe(160); // leg press: 200 era otimista para 10-12 depois da pausa
    expect(carga('m-C-02')).toBe(10); // elevação lateral
    expect(carga('m-C-05')).toBe(14); // rosca no banco inclinado
    expect(carga('m-B-11')).toBe(25); // crucifixo inverso no voador
    expect(carga('m-C-09')).toBe(20); // abdominal
  });

  it('cada ficha traz o "Por que assim" e cada exercício tem texto na biblioteca', () => {
    for (const f of p?.fichas ?? []) {
      expect(f.porque?.length ?? 0).toBeGreaterThan(300);
      expect(f.porque).not.toMatch(/—|Fabiano|Elevação em Y/);
      for (const e of f.exercicios) {
        expect(exById(e.anim)?.name, e.anim).toBe(e.nome);
      }
    }
    expect(ficha('A').porque).toMatch(/^Segunda é o dia mais longe do longo de domingo/);
    expect(ficha('B').porque).toMatch(/^Quinta fica entre a corrida de quarta e a de sexta/);
    expect(ficha('C').porque).toMatch(/O abdominal encerra a semana\.$/);
  });

  it('sem pares combinados nem preparação: cada exercício é um bloco', () => {
    for (const letra of ['A', 'B', 'C']) {
      const f = ficha(letra);
      expect(paresCombinados(f)).toEqual([]);
      expect(exerciciosPreparacao(f)).toEqual([]);
      expect(exerciciosPrincipais(f).map((e) => e.id)).toEqual(f.exercicios.map((e) => e.id));
      expect(blocosDaFicha(f).map((b) => b.map((e) => e.id).join('+'))).toEqual(f.exercicios.map((e) => e.id));
    }
  });
});

describe('ficha antiga no histórico', () => {
  it('a tabela cobre os 36 ids da ficha antiga e os 2 aposentados da atual, e dá nome a cada um', () => {
    expect(Object.keys(EXERCICIOS_ANTIGOS)).toHaveLength(38);
    for (const [id, e] of Object.entries(EXERCICIOS_ANTIGOS)) {
      expect(id).toMatch(/^(h-[ABC]-\d{2}|m-B-0[47])$/);
      expect(e.nome.length).toBeGreaterThan(5);
      expect(exById(e.anim), e.anim).toBeDefined();
    }
  });

  it('nome e catálogo de um exercício gravado: ficha atual, ficha antiga ou texto neutro (nunca o id)', () => {
    expect(nomeDoExercicio('m-A-01')).toBe('Agachamento no hack');
    expect(nomeDoExercicio('h-A-07')).toBe('Remada cavalinho (pegada neutra)');
    expect(nomeDoExercicio('z-9')).toBe('Exercício de uma ficha antiga');
    expect(catalogoDoExercicio('m-B-07')).toBe('face-pull');
    expect(catalogoDoExercicio('h-C-03')).toBe('supino-reto-maquina');
    expect(catalogoDoExercicio('z-9')).toBeUndefined();
  });

  it('séries de trabalho dos treinos antigos seguem a regra que a ficha tinha', () => {
    expect(serieGravadaConta('h-A-05', 1)).toBe(false); // preparação
    expect(serieGravadaConta('h-A-07', 1)).toBe(false); // aquecimento dentro do exercício
    expect(serieGravadaConta('h-A-07', 2)).toBe(true);
    expect(serieGravadaConta('h-C-03', 2)).toBe(false);
    expect(serieGravadaConta('h-C-03', 3)).toBe(true);
    expect(serieGravadaConta('h-A-09', 1)).toBe(true);
    expect(serieGravadaConta('m-A-01', 1)).toBe(false); // ficha atual: a série leve
    expect(serieGravadaConta('m-A-01', 2)).toBe(true);
    expect(serieGravadaConta('z-9', 1)).toBe(true); // desconhecido conta
    expect(ehPreparacaoAntiga('h-B-03')).toBe(true);
    expect(ehPreparacaoAntiga('h-B-08')).toBe(false);
    expect(ehPreparacaoAntiga('m-A-01')).toBe(false);
  });

  it('treinos gravados com a ficha antiga não quebram nada e não entram na rotação da nova', () => {
    const bruto = JSON.parse(readFileSync(new URL('../fixtures/musc.json', import.meta.url), 'utf8')) as { lifts: Lift[] };
    const antigos = bruto.lifts;
    expect(antigos.length).toBeGreaterThan(3);
    expect(antigos.every((l) => l.programa === PROGRAMA_ANTIGO)).toBe(true);
    const s = ajustes();
    for (const l of antigos) {
      expect(volumeDoLift(l)).toBeGreaterThanOrEqual(0);
      expect(seriesFeitas(l)).toBeLessThanOrEqual(seriesMarcadas(l));
      expect(() => prsDoLift(antigos, l)).not.toThrow();
      for (const exId of Object.keys(l.sets ?? {})) {
        expect(nomeDoExercicio(exId), exId).not.toMatch(/^h-|ficha antiga/);
        expect(() => historicoEx(antigos, exId)).not.toThrow();
      }
    }
    // a letra A da ficha antiga era outro treino: a rotação da nova começa do zero
    expect(proximaFicha(s, antigos).id).toBe('A');
    expect(rotacaoFichas(s, antigos)).toEqual({ ultimas: [], ultima: null, proxima: 'A' });
    expect(fichaDoDia(s, antigos, '2026-11-16')?.id).toBe('A');
    for (const e of ficha('A').exercicios) expect(sugestao(s, antigos, e).tipo).toMatch(/^(ficha|aquecimento)$/);
    // um estado ainda com o id do programa antigo cai no programa atual
    expect(programaAtivo(ajustes({ programa: PROGRAMA_ANTIGO })).id).toBe('maromba');
  });
});

describe('pares, preparação e métodos (ficha de teste)', () => {
  it('pares combinados, treino principal e preparação', () => {
    expect(paresCombinados(FX).map(([a, b]) => `${a.id}+${b.id}`)).toEqual(['x-01+x-02', 'x-04+x-05', 'x-09+x-10']);
    expect(parceiroDe(FX, 'x-10')?.id).toBe('x-09');
    expect(parceiroDe(FX, 'x-06')).toBeUndefined();
    // o aquecimento que faz par com um principal vai para o treino principal (cartão duplo)
    expect(exerciciosPrincipais(FX).map((e) => e.id)).toEqual(['x-04', 'x-05', 'x-06', 'x-07', 'x-08', 'x-09', 'x-10', 'x-11', 'x-12']);
    expect(exerciciosPreparacao(FX).map((e) => e.id)).toEqual(['x-01', 'x-02', 'x-03', 'x-13']);
    expect(blocosDaFicha(FX).map((b) => b.map((e) => e.id).join('+'))).toEqual(['x-04+x-05', 'x-06', 'x-07', 'x-08', 'x-09+x-10', 'x-11', 'x-12']);
    expect(totalSeriesDeTrabalho(FX)).toBe(2 + 3 + 3 + 3 + 4 + 4 + 2 + 3);
  });

  it('métodos têm rótulo e texto', () => {
    expect(METODO_ROTULO['dead-stop']).toBe('Dead stop');
    for (const m of ['rest-pause', 'cluster-set', 'super-set', 'bi-set', 'dead-stop', 'drop-set'] as const) {
      expect(METODO_ROTULO[m]).toBeTruthy();
      expect(METODO_TXT[m].length).toBeGreaterThan(20);
    }
    expect(metodoTexto(X.drop)).toBe(METODO_TXT['drop-set']);
    expect(metodoTexto(X.rest)).toBe(METODO_TXT['rest-pause']);
    expect(metodoTexto(ex('m-A-01'))).toBeUndefined();
  });
});

/* ---------------- leitura de reps e séries planejadas ---------------- */

describe('lerReps', () => {
  it('faixas numéricas', () => {
    expect(lerReps('8-12')).toEqual({ faixa: [8, 12], segundos: null, total: 20, esquema: null });
    expect(lerReps('10-15').faixa).toEqual([10, 15]);
    expect(lerReps('15')).toMatchObject({ faixa: [15, 15], esquema: null });
    expect(lerReps('20/20')).toMatchObject({ faixa: [20, 20], segundos: null, esquema: null });
  });
  it('cluster e soma', () => {
    expect(lerReps('4-4-4')).toEqual({ faixa: [4, 4], segundos: null, total: 12, esquema: 'cluster-set' });
    expect(lerReps('5 + 10')).toMatchObject({ total: 15, esquema: 'soma' });
  });
  it('tempo', () => {
    expect(lerReps('45 s')).toEqual({ faixa: null, segundos: 45, total: null, esquema: 'tempo' });
    expect(lerReps('30-45 s')).toMatchObject({ faixa: null, segundos: 45, esquema: 'tempo' });
    expect(lerReps('45seg').segundos).toBe(45);
    expect(lerReps('1 min').segundos).toBe(60);
  });
  it('sem número', () => {
    expect(lerReps('máximo')).toEqual({ faixa: null, segundos: null, total: null, esquema: null });
  });
});

describe('seriesPlanejadas', () => {
  it('não quebra em nenhum exercício (os 27 do programa e os da ficha de teste) e numera de 1 em diante', () => {
    let total = 0;
    for (const f of [...programaAtivo(ajustes()).fichas, FX]) {
      for (const e of f.exercicios) {
        const sp = seriesPlanejadas(e);
        expect(sp.length).toBe(e.series.reduce((a, b) => a + b.sets, 0));
        expect(sp.map((x) => x.n)).toEqual(sp.map((_, i) => i + 1));
        for (const x of sp) {
          expect(e.series[x.bloco]?.reps).toBe(x.reps);
          expect(x.faixa != null || x.segundos != null).toBe(true);
          if (x.faixa) expect(x.faixa[0]).toBeLessThanOrEqual(x.faixa[1]);
          if (x.segundos != null) expect(x.segundos).toBeGreaterThan(0);
        }
        total++;
      }
    }
    expect(total).toBe(27 + 13);
  });

  it('totais por ficha: séries planejadas e séries de trabalho', () => {
    const planejadas = (letra: string) => ficha(letra).exercicios.reduce((a, e) => a + seriesPlanejadas(e).length, 0);
    expect([planejadas('A'), planejadas('B'), planejadas('C')]).toEqual([31, 31, 31]);
    // a série leve do primeiro exercício não é série de trabalho
    expect([totalSeriesDeTrabalho(ficha('A')), totalSeriesDeTrabalho(ficha('B')), totalSeriesDeTrabalho(ficha('C'))]).toEqual([30, 30, 30]);
    // a contagem pela regra única bate com as linhas que não são de aquecimento
    for (const letra of ['A', 'B', 'C']) {
      const linhas = ficha(letra).exercicios.flatMap((e) => seriesPlanejadas(e)).filter((x) => !x.aquecimento).length;
      expect(linhas).toBe(totalSeriesDeTrabalho(ficha(letra)));
    }
  });

  it('n cumulativo entre blocos: Agachamento no hack e Supino reto', () => {
    const trabalho = (n: number) => ({ n, bloco: 1, reps: '8-10', faixa: [8, 10], segundos: null, carga: 80, intervalo: 120, aquecimento: false });
    expect(seriesPlanejadas(ex('m-A-01'))).toEqual([
      { n: 1, bloco: 0, reps: '12-15', faixa: [12, 15], segundos: null, carga: 40, intervalo: 60, aquecimento: true },
      trabalho(2), trabalho(3), trabalho(4), trabalho(5),
    ]);
    const supino = seriesPlanejadas(ex('m-B-01'));
    expect(supino.map((x) => [x.n, x.bloco, x.carga, x.aquecimento])).toEqual([[1, 0, 30, true], [2, 1, 60, false], [3, 1, 60, false], [4, 1, 60, false], [5, 1, 60, false]]);
  });

  it('tempo, carga não numérica e exercícios de preparação', () => {
    expect(seriesPlanejadas(X.alongA)[0]).toMatchObject({ reps: '45 s', faixa: null, segundos: 45, carga: 0, intervalo: 45, aquecimento: true });
    expect(seriesPlanejadas(X.alongB)[0]).toMatchObject({ segundos: 45, intervalo: 30 });
    expect(seriesPlanejadas(X.elastico)[0]).toMatchObject({ reps: '20/20', faixa: [20, 20], carga: null, intervalo: null, aquecimento: true });
    expect(seriesPlanejadas(X.cluster)[0]).toMatchObject({ reps: '4-4-4', faixa: [4, 4], segundos: null });
    expect(seriesPlanejadas(avulso({}))).toEqual([]);
  });

  it('série de trabalho: regra única', () => {
    expect(ehPrincipal(ex('m-A-01'))).toBe(true);
    expect(ehPrincipal(X.aq)).toBe(false);
    expect(serieConta(ex('m-A-01'), 1)).toBe(false); // a série leve
    expect(serieConta(ex('m-A-01'), 2)).toBe(true);
    expect(serieConta(ex('m-A-01'), 9)).toBe(true); // série extra cai no último bloco
    expect(serieConta(ex('m-A-02'), 1)).toBe(true); // só o primeiro exercício tem série leve
    expect(serieConta(X.aq, 1)).toBe(false);
    expect(serieConta(undefined, 1)).toBe(true); // exercício desconhecido conta
    expect(seriesDeTrabalho(ex('m-B-01'))).toBe(4);
    expect(seriesDeTrabalho(X.alongA)).toBe(0);
    expect(seriesDeTrabalho(X.drop)).toBe(2); // drop-set: 1 série por rodada
  });

  it('esquema de cada série', () => {
    expect(esquemaDaSerie(X.cluster, 1)).toBe('cluster-set');
    expect(esquemaDaSerie(X.drop, 2)).toBe('drop-set');
    expect(esquemaDaSerie(X.alongA, 1)).toBe('tempo');
    expect(esquemaDaSerie(X.rest, 1)).toBeNull(); // rest-pause progride normalmente
    expect(esquemaDaSerie(X.elastico, 1)).toBeNull();
    for (const e of PROGRAMAS.flatMap((p) => p.fichas).flatMap((f) => f.exercicios)) expect(esquemaDaSerie(e, 1)).toBeNull(); // tudo faixa normal
    expect(esquemaDaSerie(avulso({ metodo: 'dead-stop', series: [{ sets: 3, reps: '5 + 10', carga: 100 }] }), 1)).toBe('dead-stop');
    expect(esquemaDaSerie(avulso({ series: [{ sets: 3, reps: '5 + 10', carga: 100 }] }), 1)).toBe('soma');
  });
});

/* ---------------- programa e ajustes do usuário ---------------- */

describe('fichas ativas', () => {
  it('programa desconhecido cai no Maromba', () => {
    expect(programaAtivo(ajustes({ programa: 'xyz' })).id).toBe('maromba');
    expect(programaAtivo(ajustes({ programa: '' })).id).toBe('maromba');
    expect(fichasAtivas(ajustes()).map((f) => f.id)).toEqual(['A', 'B', 'C']);
    expect(fichaPorLetra(ajustes(), 'D')).toBeUndefined();
  });

  it('aplica settings.fichas sem alterar o catálogo', () => {
    const s = ajustes({ fichas: { 'm-A-01': { nome: 'Hack 45', series: 5, intervalo: 150 }, 'm-B-02': { carga: 55 } } });
    const A = fichaPorLetra(s, 'A'), B = fichaPorLetra(s, 'B');
    const hack = A?.exercicios.find((e) => e.id === 'm-A-01');
    expect(hack?.nome).toBe('Hack 45');
    expect(hack?.series.map((b) => [b.sets, b.intervalo])).toEqual([[1, 150], [5, 150]]); // "series" vale para o bloco de trabalho
    expect(B?.exercicios.find((e) => e.id === 'm-B-02')?.series[0]?.carga).toBe(55);
    expect(A?.porque).toBe(ficha('A').porque); // o texto da ficha segue junto
    expect(ex('m-A-01').nome).toBe('Agachamento no hack');
    expect(ex('m-A-01').series[1]?.sets).toBe(4);
    expect(totalSeriesDeTrabalho(A as Ficha)).toBe(31);
  });

  it('carga ajustada num bloco com drops remove os drops', () => {
    const ajustado = aplicarAjuste(X.drop, { carga: 80 });
    expect(ajustado.series[0]).toMatchObject({ carga: 80 });
    expect(ajustado.series[0]?.drops).toBeUndefined(); // o usuário assumiu a carga
    expect(X.drop.series[0]?.drops).toEqual([96, 52, 38]);
  });

  it('ajuste vazio ou inválido não muda nada e aplicar duas vezes dá no mesmo', () => {
    expect(aplicarAjuste(ex('m-A-01'), undefined)).toEqual(ex('m-A-01'));
    expect(aplicarAjuste(ex('m-A-01'), { nome: '  ', series: 0, carga: -5, intervalo: 0 })).toEqual(ex('m-A-01'));
    const uma = aplicarAjuste(ex('m-B-01'), { series: 5, carga: 70 });
    expect(aplicarAjuste(uma, { series: 5, carga: 70 })).toEqual(uma);
  });
});

/* ---------------- e1RM, volume, séries ---------------- */

describe('e1rm', () => {
  it('Epley com uma casa', () => {
    expect(e1rm(40, 12)).toBe(56);
    expect(e1rm(100, 1)).toBe(103.3);
    expect(e1rm(56.5, 10)).toBe(75.3);
    expect(e1rm(80, 30)).toBe(160); // sem teto
  });
  it('carga ou reps inválidas → 0', () => {
    expect(e1rm(0, 12)).toBe(0);
    expect(e1rm(40, 0)).toBe(0);
    expect(e1rm(-5, 10)).toBe(0);
    expect(e1rm(Number.NaN, 10)).toBe(0);
  });
});

describe('volume e contagem de séries', () => {
  const l = lift('2026-11-16', 'A', { 'm-A-01': [[40, 15], [80, 10], [80, 9], [80, 8]], 'm-A-02': [[160, 12]] });
  const antigo = lift('2026-11-07', 'A', { 'h-A-05': [[0, 20], [0, 20]], 'h-A-07': [[25, 12], [40, 12], [40, 10], [40, 9]], 'h-A-09': [[56.5, 10]] }, { programa: PROGRAMA_ANTIGO, treino: 'Costas e bíceps' });

  it('volume = Σ reps × carga das séries feitas', () => {
    expect(volumeDoLift(l)).toBe(40 * 15 + 80 * 27 + 160 * 12);
    const desmarcada = desmarcarSerie(l, 'm-A-02', 1);
    expect(volumeDoLift(desmarcada)).toBe(40 * 15 + 80 * 27);
    expect(volumeDoLift(antigo)).toBe(25 * 12 + 40 * 31 + 565);
  });
  it('registro sem séries usa o volume gravado', () => {
    expect(volumeDoLift({ id: 'm', data: '2026-11-01', ficha: 'A', treino: 'Pernas', programa: 'maromba', volume: 5200 })).toBe(5200);
    expect(volumeDoLift({ id: 'm', data: '2026-11-01', ficha: 'A', treino: 'Pernas', programa: 'maromba' })).toBe(0);
  });
  it('séries feitas contam só as de trabalho', () => {
    expect(seriesFeitas(l)).toBe(4); // 3 do hack (a primeira é leve) + 1 do leg press
    expect(seriesFeitas(l, 'm-A-01')).toBe(3);
    expect(seriesMarcadas(l)).toBe(5);
    expect(seriesMarcadas(l, 'm-A-01')).toBe(4);
    expect(seriesMarcadas(l, 'm-A-06')).toBe(0);
  });
  it('treino da ficha antiga: preparação e aquecimento continuam fora da conta', () => {
    expect(seriesFeitas(antigo)).toBe(4); // 3 da remada + 1 da puxada
    expect(seriesFeitas(antigo, 'h-A-07')).toBe(3);
    expect(seriesFeitas(antigo, 'h-A-05')).toBe(0);
    expect(seriesMarcadas(antigo)).toBe(7);
  });
  it('duração: min gravado ou fim − início', () => {
    expect(duracaoDoLift({ ...l, min: 52 })).toBe(52);
    expect(duracaoDoLift({ ...l, inicio: '23:40', fim: '00:25' })).toBe(45);
    expect(duracaoDoLift(l)).toBeNull();
  });
});

/* ---------------- feito, sessão aberta, última vez, histórico ---------------- */

describe('registros', () => {
  const a = lift('2026-11-05', 'B', { 'm-B-02': [[50, 12], [50, 11]] });
  const b = lift('2026-11-12', 'B', { 'm-B-02': [[52.5, 10], [52.5, 9]] });
  const aberto = lift('2026-11-19', 'B', { 'm-B-02': [[55, 8]] }, { emAndamento: true, concluido: false, inicio: '18:00' });
  const descartado = lift('2026-11-14', 'B', { 'm-B-02': [[60, 8]] }, { emAndamento: false, concluido: false });
  const antigo: Lift = { id: 'antigo', data: '2026-10-20', ficha: 'A', treino: 'Pernas', programa: 'maromba' };
  const todos = [aberto, b, descartado, a, antigo];

  it('contaComoFeito e liftsFeitos em ordem crescente', () => {
    expect(contaComoFeito(a)).toBe(true);
    expect(contaComoFeito(antigo)).toBe(true); // documento antigo, sem as marcas
    expect(contaComoFeito(aberto)).toBe(false);
    expect(contaComoFeito(descartado)).toBe(false);
    expect(liftsFeitos(todos).map((l) => l.id)).toEqual([antigo.id, a.id, b.id]);
  });

  it('desempata no mesmo dia pela hora de início', () => {
    const manha = lift('2026-11-05', 'B', {}, { inicio: '07:10' }), noite = lift('2026-11-05', 'C', {}, { inicio: '19:30' });
    expect(liftsFeitos([noite, manha]).map((l) => l.id)).toEqual([manha.id, noite.id]);
  });

  it('sessaoAberta', () => {
    expect(sessaoAberta(todos)?.id).toBe(aberto.id);
    expect(sessaoAberta([a, b, descartado])).toBeUndefined();
  });

  it('ultimaVez: só sessões feitas, com o número de cada série', () => {
    expect(ultimaVez(todos, 'm-B-02')).toEqual({ data: '2026-11-12', sets: [{ n: 1, reps: 10, carga: 52.5, feito: true, t: '18:00' }, { n: 2, reps: 9, carga: 52.5, feito: true, t: '18:00' }] });
    expect(ultimaVez(todos, 'm-B-07')).toBeUndefined();
    expect(ultimaVez(todos, 'm-B-02', b)?.data).toBe('2026-11-05'); // antes da sessão b
    expect(ultimaVez(todos, 'm-B-02', aberto)?.data).toBe('2026-11-12');
    expect(ultimaVez(todos, 'm-B-02', a)).toBeUndefined();
  });

  it('ultimaVez ignora séries desmarcadas', () => {
    const l = desmarcarSerie(desmarcarSerie(b, 'm-B-02', 1), 'm-B-02', 2);
    expect(ultimaVez([a, l], 'm-B-02')?.data).toBe('2026-11-05');
  });

  it('historicoEx por sessão', () => {
    expect(historicoEx(todos, 'm-B-02')).toEqual([
      { data: '2026-11-05', e1rm: 70, cargaMax: 50, repsMax: 12 },
      { data: '2026-11-12', e1rm: 70, cargaMax: 52.5, repsMax: 10 },
    ]);
    expect(historicoEx(todos, 'm-A-01')).toEqual([]);
  });
});

/* ---------------- sugestão: progressão dupla por bloco ---------------- */

describe('sugestao', () => {
  const s = ajustes();
  const PUXADA = 'm-B-02'; // 4 × 8-12 a 50 kg

  it('sem histórico: carga e base da ficha', () => {
    const sg = sugestao(s, [], ex(PUXADA));
    expect(sg).toMatchObject({ tipo: 'ficha', carga: 50, reps: '8', motivo: 'Primeira vez: carga da ficha' });
    expect(sg.series).toEqual([1, 2, 3, 4].map((n) => ({ n, carga: 50, reps: 8 })));
  });

  it('bateu o topo em todas, abaixo de 60 kg: +2,5 kg e volta à base', () => {
    const sg = sugestao(s, [lift('2026-11-12', 'B', { [PUXADA]: [[50, 12], [50, 12], [50, 12], [50, 13]] })], ex(PUXADA));
    expect(sg).toMatchObject({ tipo: 'sobe', carga: 52.5, reps: '8', motivo: 'Bateu 12 em todas: suba para 52,5 kg' });
    expect(sg.series.every((x) => x.carga === 52.5 && x.reps === 8)).toBe(true);
  });

  it('bateu o topo a partir de 60 kg: +5% arredondado a 0,5 kg', () => {
    const com = (carga: number) => sugestao(s, [lift('2026-11-12', 'B', { [PUXADA]: [[carga, 12], [carga, 12], [carga, 12], [carga, 12]] })], ex(PUXADA));
    expect(com(60).carga).toBe(63);
    expect(com(62.5).carga).toBe(65.5); // 65,625 → 65,5
    expect(com(80)).toMatchObject({ tipo: 'sobe', carga: 84 });
    expect(com(57.5)).toMatchObject({ carga: 60, motivo: 'Bateu 12 em todas: suba para 60 kg' });
    expect(com(40).motivo).toBe('Bateu 12 em todas: suba para 42,5 kg');
  });

  it('não bateu o topo em todas: repete a carga e mira +1 repetição', () => {
    const sg = sugestao(s, [lift('2026-11-12', 'B', { [PUXADA]: [[50, 12], [50, 10], [50, 9], [50, 9]] })], ex(PUXADA));
    expect(sg).toMatchObject({ tipo: 'repete', carga: 50, reps: '10', motivo: 'Faltou chegar a 12 em todas: repita 50 kg e mire 10' });
    // abaixo da base: mira a base
    const baixo = sugestao(s, [lift('2026-11-12', 'B', { [PUXADA]: [[50, 6], [50, 5]] })], ex(PUXADA));
    expect(baixo).toMatchObject({ tipo: 'repete', reps: '8' });
  });

  it('usa a sessão feita mais recente e ignora a em andamento', () => {
    const lifts = [
      lift('2026-11-05', 'B', { [PUXADA]: [[45, 12], [45, 12]] }),
      lift('2026-11-12', 'B', { [PUXADA]: [[47.5, 9], [47.5, 8]] }),
      lift('2026-11-19', 'B', { [PUXADA]: [[70, 12]] }, { emAndamento: true, concluido: false }),
    ];
    expect(sugestao(s, lifts, ex(PUXADA))).toMatchObject({ tipo: 'repete', carga: 47.5, reps: '9' });
  });

  it('séries de trabalho = carga com mais séries; a série isolada mais pesada fica fora', () => {
    const sg = sugestao(s, [lift('2026-11-12', 'B', { [PUXADA]: [[60, 6], [50, 12], [50, 12], [50, 12]] })], ex(PUXADA));
    expect(sg).toMatchObject({ tipo: 'sobe', carga: 52.5 });
    // empate no número de séries: vale a mais pesada
    const empate = sugestao(s, [lift('2026-11-12', 'B', { [PUXADA]: [[50, 12], [50, 12], [55, 9], [55, 9]] })], ex(PUXADA));
    expect(empate).toMatchObject({ tipo: 'repete', carga: 55, reps: '10' });
  });

  it('progressão por bloco: a série leve repete, o trabalho progride (Supino reto)', () => {
    const sg = sugestao(s, [lift('2026-11-12', 'B', { 'm-B-01': [[30, 15], [60, 10], [60, 10], [60, 10], [60, 10]] })], ex('m-B-01'));
    expect(sg).toMatchObject({ tipo: 'sobe', carga: 63, reps: '6', motivo: 'Bateu 10 em todas: suba para 63 kg' });
    expect(sg.series).toEqual([
      { n: 1, carga: 30, reps: 15 },
      { n: 2, carga: 63, reps: 6 }, { n: 3, carga: 63, reps: 6 }, { n: 4, carga: 63, reps: 6 }, { n: 5, carga: 63, reps: 6 },
    ]);
    // a série leve bater 15 não faz a carga de trabalho subir quando o trabalho não bateu o topo
    const faltou = sugestao(s, [lift('2026-11-12', 'B', { 'm-B-01': [[30, 15], [60, 10], [60, 9], [60, 8], [60, 8]] })], ex('m-B-01'));
    expect(faltou).toMatchObject({ tipo: 'repete', carga: 60, reps: '9' });
    // só a série leve feita: o bloco de trabalho segue a ficha
    const soAq = sugestao(s, [lift('2026-11-12', 'B', { 'm-B-01': [[30, 15]] })], ex('m-B-01'));
    expect(soAq).toMatchObject({ tipo: 'ficha', carga: 60, reps: '6' });
    expect(soAq.series[1]).toEqual({ n: 2, carga: 60, reps: 6 });
  });

  it('exercício de aquecimento: como na ficha', () => {
    expect(sugestao(s, [], X.aq)).toMatchObject({ tipo: 'aquecimento', carga: 0, reps: '15', motivo: 'Aquecimento: como na ficha' });
    const sg = sugestao(s, [lift('2026-11-07', 'A', { 'x-04': [[2, 20], [2, 18]] })], X.aq);
    expect(sg).toMatchObject({ tipo: 'aquecimento', carga: 2, reps: '18' });
  });

  it('peso do corpo progride por repetições', () => {
    const bateu = sugestao(s, [lift('2026-11-09', 'B', { 'x-12': [[0, 15], [0, 15], [0, 16]] })], X.corpo);
    expect(bateu).toMatchObject({ tipo: 'reps', carga: 0, reps: '16', motivo: 'Peso do corpo: bateu 15 em todas, tente 16' });
    const faltou = sugestao(s, [lift('2026-11-09', 'B', { 'x-12': [[0, 13], [0, 12], [0, 11]] })], X.corpo);
    expect(faltou).toMatchObject({ tipo: 'repete', carga: 0, reps: '12', motivo: 'Peso do corpo: faltou chegar a 15, mire 12' });
    // com carga registrada, o mesmo exercício volta à progressão por carga
    const comCarga = sugestao(s, [lift('2026-11-09', 'B', { 'x-12': [[10, 15], [10, 15], [10, 15]] })], X.corpo);
    expect(comCarga).toMatchObject({ tipo: 'sobe', carga: 12.5, reps: '10' });
  });

  it('última vez sem carga num exercício com carga na ficha: volta à ficha', () => {
    const sg = sugestao(s, [lift('2026-11-12', 'B', { [PUXADA]: [[0, 12], [0, 12]] })], ex(PUXADA));
    expect(sg).toMatchObject({ tipo: 'ficha', carga: 50, reps: '8', motivo: 'Última vez sem carga registrada: carga da ficha' });
  });

  it('cluster-set repete o esquema da ficha', () => {
    expect(sugestao(s, [], X.cluster)).toMatchObject({ tipo: 'ficha', carga: 35, reps: '12' });
    const sg = sugestao(s, [lift('2026-11-07', 'A', { 'x-07': [[37.5, 12], [37.5, 12], [37.5, 12]] })], X.cluster);
    expect(sg).toMatchObject({ tipo: 'repete', carga: 37.5, reps: '12', motivo: 'Cluster-set: siga o esquema 4-4-4 (12 por série)' });
    expect(sg.series).toEqual([1, 2, 3].map((n) => ({ n, carga: 37.5, reps: 12 })));
  });

  it('drop-set repete as cargas da ficha', () => {
    const sg = sugestao(s, [lift('2026-11-09', 'B', { 'x-11': [[96, 15], [96, 15]] })], X.drop);
    expect(sg).toMatchObject({ tipo: 'repete', carga: 96, reps: '15', motivo: 'Drop-set: siga as cargas da ficha (96 → 52 → 38 kg)' });
    expect(sugestao(s, [], X.drop)).toMatchObject({ tipo: 'ficha', carga: 96, reps: '10' });
  });

  it('dead stop e tempo repetem o esquema da ficha', () => {
    const dead = avulso({ metodo: 'dead-stop', series: [{ sets: 3, reps: '5 + 10', carga: 100, intervalo: 90 }] });
    const feito = { ...lift('2026-11-09', 'B'), sets: { 'x-1': feitas([[110, 15], [110, 15], [110, 15]]) } };
    expect(sugestao(s, [feito], dead)).toMatchObject({ tipo: 'repete', carga: 110, reps: '15', motivo: 'Dead stop: siga 5 + 10 (15 por série)' });
    expect(sugestao(s, [], dead)).toMatchObject({ tipo: 'ficha', carga: 100, reps: '15' });
    const tempo = avulso({ series: [{ sets: 2, reps: '45 s', carga: 10, intervalo: 30 }] });
    const sg = sugestao(s, [feito], tempo);
    expect(sg).toMatchObject({ tipo: 'repete', carga: 110, reps: '45 s', motivo: 'Tempo: 45 s como na ficha' });
    expect(sg.series).toEqual([{ n: 1, carga: 110, reps: null }, { n: 2, carga: 110, reps: null }]);
  });

  it('rest-pause e super-set progridem como faixa normal', () => {
    const sg = sugestao(s, [lift('2026-11-07', 'A', { 'x-08': [[40, 12], [40, 12], [40, 12]] })], X.rest);
    expect(sg).toMatchObject({ tipo: 'sobe', carga: 42.5 });
  });

  it('sem faixa de repetições ou sem séries na ficha', () => {
    const feito = { ...lift('2026-11-09', 'B'), sets: { 'x-1': feitas([[20, 9], [20, 8]]) } };
    const semFaixa = avulso({ series: [{ sets: 2, reps: 'máximo', carga: 15 }] });
    expect(sugestao(s, [feito], semFaixa)).toMatchObject({ tipo: 'repete', carga: 20, reps: '8', motivo: 'Sem faixa de repetições na ficha: repita a última carga' });
    expect(sugestao(s, [], semFaixa)).toMatchObject({ tipo: 'ficha', carga: 15, reps: 'máximo' });
    expect(sugestao(s, [], avulso({}))).toEqual({ tipo: 'ficha', carga: null, reps: '', motivo: 'Sem histórico nem ficha', series: [] });
    expect(sugestao(s, [feito], avulso({}))).toMatchObject({ tipo: 'repete', carga: 20, reps: '8', series: [{ n: 1, carga: 20, reps: 9 }, { n: 2, carga: 20, reps: 8 }] });
  });

  it('aplica o ajuste de carga do usuário quando não há histórico', () => {
    const sg = sugestao(ajustes({ fichas: { [PUXADA]: { carga: 45, series: 3 } } }), [], ex(PUXADA));
    expect(sg).toMatchObject({ tipo: 'ficha', carga: 45 });
    expect(sg.series).toHaveLength(3);
  });

  it('todo exercício do programa, sem histórico, sugere a carga de partida da ficha', () => {
    for (const e of PROGRAMAS.flatMap((p) => p.fichas).flatMap((f) => f.exercicios)) {
      const sg = sugestao(s, [], e), trabalho = e.series[e.series.length - 1];
      expect(sg, e.id).toMatchObject({ tipo: 'ficha', carga: trabalho?.carga, reps: String(lerReps(trabalho?.reps ?? '').faixa?.[0]) });
      expect(sg.series).toHaveLength(seriesPlanejadas(e).length);
    }
  });
});

/* ---------------- descanso ---------------- */

describe('descansoDe', () => {
  it('intervalo do bloco que cobre a série', () => {
    const s = ajustes();
    expect(descansoDe(s, ex('m-A-01'), 1)).toBe(60);
    expect(descansoDe(s, ex('m-A-01'), 2)).toBe(120);
    expect(descansoDe(s, ex('m-A-01'), 9)).toBe(120); // além do total: último bloco
    expect(descansoDe(s, ex('m-A-06'), 1)).toBe(45);
    expect(descansoDe(s, ex('m-C-03'), 1)).toBe(75);
  });
  it('sem intervalo na ficha: padrão do usuário, depois 90 s', () => {
    expect(descansoDe(ajustes({ descansoPadrao: 75 }), X.ombro, 1)).toBe(75);
    expect(descansoDe(ajustes({ descansoPadrao: 0 }), X.ombro, 1)).toBe(90);
    expect(descansoDe(ajustes({ descansoPadrao: Number.NaN }), X.ombro, 2)).toBe(90);
    expect(descansoDe(ajustes({ descansoPadrao: 75 }), ex('m-A-01'), 2)).toBe(120); // o da ficha vence o padrão
  });
  it('par combinado: vale o maior dos dois intervalos', () => {
    const s = ajustes({ descansoPadrao: 75 });
    const p60 = avulso({ id: 'x-60', series: [{ sets: 3, reps: '8-12', carga: 85, intervalo: 60 }] });
    const p90 = avulso({ id: 'x-90', series: [{ sets: 3, reps: '8-12', carga: 20, intervalo: 90 }] });
    expect(descansoDe(s, X.superA, 1, X.superB)).toBe(30); // null + 30
    expect(descansoDe(s, X.superB, 1, X.superA)).toBe(30);
    expect(descansoDe(s, p60, 1, p90)).toBe(90); // 60 + 90
    expect(descansoDe(s, p90, 3, p60)).toBe(90);
    expect(descansoDe(s, X.aq, 1, X.ombro)).toBe(75); // nenhum dos dois prescreve: padrão
    expect(descansoDe(s, X.superA, 1)).toBe(75); // parceiro pulado: só o próprio, que cai no padrão
  });
  it('respeita o intervalo ajustado pelo usuário', () => {
    expect(descansoDe(ajustes({ fichas: { 'm-A-01': { intervalo: 150 } } }), ex('m-A-01'), 2)).toBe(150);
  });
});

/* ---------------- recordes ---------------- */

describe('prsDoLift', () => {
  const base = lift('2026-11-05', 'B', { 'm-B-02': [[50, 10], [50, 10]], 'm-B-06': [[45, 10]] }, { inicio: '18:00' });

  it('a primeira vez de um exercício não é recorde', () => {
    expect(prsDoLift([], base)).toEqual([]);
    const novo = lift('2026-11-12', 'B', { 'm-B-04': [[40, 10]] });
    expect(prsDoLift([base], novo)).toEqual([]);
  });

  it('e1RM maior que o melhor anterior é recorde', () => {
    const l = lift('2026-11-12', 'B', { 'm-B-02': [[50, 12], [52.5, 10]], 'm-B-06': [[45, 10]] });
    expect(prsDoLift([base, l], l)).toEqual([
      { exId: 'm-B-02', nome: 'Puxada na frente com pegada aberta', e1rm: 70, carga: 50, reps: 12, anterior: 66.7, medida: 'e1rm' },
    ]);
  });

  it('igualar não é recorde; mais repetições na mesma carga é', () => {
    expect(prsDoLift([base], lift('2026-11-12', 'B', { 'm-B-02': [[50, 10]] }))).toEqual([]);
    expect(prsDoLift([base], lift('2026-11-12', 'B', { 'm-B-02': [[50, 11]] }))).toHaveLength(1);
  });

  it('compara com TODAS as sessões anteriores, não só a última', () => {
    const fraca = lift('2026-11-12', 'B', { 'm-B-02': [[40, 8]] });
    const l = lift('2026-11-19', 'B', { 'm-B-02': [[45, 10]] }); // melhor que a fraca, pior que a base
    expect(prsDoLift([base, fraca], l)).toEqual([]);
  });

  it('só valem sessões feitas e anteriores', () => {
    const aberta = lift('2026-11-08', 'B', { 'm-B-02': [[80, 10]] }, { emAndamento: true, concluido: false });
    const futura = lift('2026-11-26', 'B', { 'm-B-02': [[90, 10]] });
    const l = lift('2026-11-12', 'B', { 'm-B-02': [[55, 10]] });
    expect(prsDoLift([base, aberta, futura, l], l).map((p) => p.exId)).toEqual(['m-B-02']);
  });

  it('segunda sessão do mesmo dia compara com a primeira', () => {
    const tarde = lift('2026-11-05', 'B', { 'm-B-02': [[55, 10]] }, { inicio: '20:00' });
    expect(prsDoLift([base], tarde)).toHaveLength(1);
    expect(prsDoLift([tarde], base)).toEqual([]); // a de mais cedo não enxerga a de mais tarde
  });

  it('peso do corpo compara repetições máximas (treino da ficha antiga, com o nome dela)', () => {
    const antes = lift('2026-11-02', 'B', { 'h-B-11': [[0, 12], [0, 11]] }, { programa: PROGRAMA_ANTIGO });
    const l = lift('2026-11-09', 'B', { 'h-B-11': [[0, 14], [0, 12]] }, { programa: PROGRAMA_ANTIGO });
    expect(prsDoLift([antes], l)).toEqual([
      { exId: 'h-B-11', nome: 'Hiperextensão de lombar', e1rm: 0, carga: 0, reps: 14, anterior: 0, repsAnterior: 12, medida: 'reps' },
    ]);
    expect(prsDoLift([antes], lift('2026-11-09', 'B', { 'h-B-11': [[0, 12]] }))).toEqual([]);
  });

  it('exercício que o app não conhece ganha um nome neutro, nunca o id', () => {
    const antes = { ...lift('2026-11-02', 'A'), sets: { 'z-9': feitas([[10, 10]]) } };
    const l = { ...lift('2026-11-09', 'A'), sets: { 'z-9': feitas([[12, 10]]) } };
    expect(prsDoLift([antes], l)[0]).toMatchObject({ exId: 'z-9', nome: 'Exercício de uma ficha antiga', medida: 'e1rm' });
  });
});

/* ---------------- rotação e ficha do dia ---------------- */

describe('proximaFicha e rotação', () => {
  const s = ajustes();

  it('sem histórico começa pela A', () => {
    expect(proximaFicha(s, []).id).toBe('A');
    expect(rotacaoFichas(s, [])).toEqual({ ultimas: [], ultima: null, proxima: 'A' });
  });

  it('nunca feita vem antes; depois, a que está há mais tempo sem fazer', () => {
    expect(proximaFicha(s, [lift('2026-11-02', 'A')]).id).toBe('B');
    expect(proximaFicha(s, [lift('2026-11-02', 'A'), lift('2026-11-04', 'B')]).id).toBe('C');
    expect(proximaFicha(s, [lift('2026-11-02', 'A'), lift('2026-11-04', 'B'), lift('2026-11-06', 'C')]).id).toBe('A');
    // fora de ordem: fez A de novo por último, a mais antiga é a B
    expect(proximaFicha(s, [lift('2026-11-02', 'A'), lift('2026-11-04', 'B'), lift('2026-11-06', 'C'), lift('2026-11-08', 'A')]).id).toBe('B');
    expect(proximaFicha(s, [lift('2026-11-08', 'C'), lift('2026-11-06', 'B'), lift('2026-11-09', 'A')]).id).toBe('B');
  });

  it('em andamento, descartada e de outro programa não contam; registro sem letra casa pelo nome', () => {
    const aberta = lift('2026-11-10', 'A', {}, { emAndamento: true, concluido: false });
    const descartada = lift('2026-11-10', 'A', {}, { concluido: false });
    const outro = lift('2026-11-10', 'A', {}, { programa: 'bodybuilder' });
    const daFichaAntiga = lift('2026-11-10', 'A', {}, { programa: PROGRAMA_ANTIGO, treino: 'Costas e bíceps' });
    expect(proximaFicha(s, [aberta, descartada, outro, daFichaAntiga]).id).toBe('A');
    expect(rotacaoFichas(s, [outro, daFichaAntiga]).ultimas).toEqual([]);
    const porNome: Lift = { id: 'n', data: '2026-11-03', ficha: '', treino: 'Pernas', programa: 'maromba' };
    expect(proximaFicha(s, [porNome]).id).toBe('B');
  });

  it('rotacaoFichas: últimas 6 e a seguinte na ordem A → B → C → A', () => {
    const lifts = ['A', 'B', 'C', 'A', 'B', 'C', 'A'].map((letra, i) => lift(`2026-10-${String(i + 10)}`, letra));
    expect(rotacaoFichas(s, lifts)).toEqual({ ultimas: ['B', 'C', 'A', 'B', 'C', 'A'], ultima: 'A', proxima: 'B' });
    expect(rotacaoFichas(s, [lift('2026-11-02', 'C')]).proxima).toBe('A');
  });
});

describe('fichaDoDia', () => {
  const s = ajustes();

  it('dias fixos: segunda = A (Pernas), quinta = B (Peito e costas), sábado = C (Braços e ombros)', () => {
    expect(new Date(2026, 10, 14).getDay()).toBe(6);
    expect(fichaDoDia(s, [], '2026-11-16')).toMatchObject({ id: 'A', nome: 'Pernas' }); // segunda (chave 1)
    expect(fichaDoDia(s, [], '2026-11-19')).toMatchObject({ id: 'B', nome: 'Peito e costas' }); // quinta (chave 4)
    expect(fichaDoDia(s, [], '2026-11-14')).toMatchObject({ id: 'C', nome: 'Braços e ombros' }); // sábado (chave 6)
    expect(fichaDoDia(s, [], '2026-11-15')).toBeUndefined(); // domingo (chave 0): corrida
    expect(fichaDoDia(s, [], '2026-11-17')).toBeUndefined(); // terça: alongamento, sem musculação
    expect(fichaDoDia(s, [], '2026-11-18')).toBeUndefined(); // quarta: corrida
    expect(fichaDoDia(s, [], '2026-11-20')).toBeUndefined(); // sexta: corrida
  });

  it('o dia fixo não sai do lugar, qualquer que seja o histórico', () => {
    const baguncado = [
      lift('2026-11-16', 'C'), // fez braços na segunda
      lift('2026-11-19', 'A'), // e pernas na quinta
      lift('2026-11-21', 'A'),
      lift('2026-11-23', 'B'),
    ];
    for (let semana = 0; semana < 8; semana++) {
      const dia = (d: number): string => {
        const data = new Date(2026, 10, 23 + semana * 7 + d);
        return `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}-${String(data.getDate()).padStart(2, '0')}`;
      };
      expect(fichaDoDia(s, baguncado, dia(0))?.id, dia(0)).toBe('A'); // segunda
      expect(fichaDoDia(s, baguncado, dia(3))?.id, dia(3)).toBe('B'); // quinta
      expect(fichaDoDia(s, baguncado, dia(5))?.id, dia(5)).toBe('C'); // sábado
      for (const d of [1, 2, 4, 6]) expect(fichaDoDia(s, baguncado, dia(d)), dia(d)).toBeUndefined();
    }
  });

  it('a chave 0 é o domingo, não a segunda', () => {
    const soDomingo = ajustes({ plano: { 0: { tipo: 'musc', ficha: 'C' } } });
    expect(fichaDoDia(soDomingo, [], '2026-11-15')?.id).toBe('C'); // domingo
    expect(fichaDoDia(soDomingo, [], '2026-11-16')).toBeUndefined(); // segunda
  });

  it('sem ficha fixa vale a próxima da rotação; "ambos" também tem musculação', () => {
    const livre = ajustes({ plano: { 1: { tipo: 'musc' }, 3: { tipo: 'ambos' }, 5: { tipo: 'corrida' } } });
    expect(fichaDoDia(livre, [], '2026-11-16')?.id).toBe('A');
    expect(fichaDoDia(livre, [lift('2026-11-16', 'A')], '2026-11-18')?.id).toBe('B'); // quarta, "ambos"
    expect(fichaDoDia(livre, [], '2026-11-20')).toBeUndefined();
    expect(fichaDoDia(livre, [], '2026-11-14')).toBeUndefined(); // dia sem entrada no plano
  });

  it('ficha fixa desconhecida cai na rotação; data inválida não tem ficha', () => {
    expect(fichaDoDia(ajustes({ plano: { 6: { tipo: 'musc', ficha: 'Z' } } }), [lift('2026-11-10', 'A')], '2026-11-14')?.id).toBe('B');
    expect(fichaDoDia(s, [], 'ontem')).toBeUndefined();
  });

  it('devolve a ficha com os ajustes do usuário', () => {
    const f = fichaDoDia(ajustes({ fichas: { 'm-C-02': { carga: 12 } } }), [], '2026-11-14');
    expect(f?.exercicios.find((e) => e.id === 'm-C-02')?.series[0]?.carga).toBe(12);
  });
});

/* ---------------- sessão guiada ---------------- */

describe('sessão guiada', () => {
  const s = ajustes();
  const inicio = new Date(2026, 10, 16, 18, 0, 0); // segunda
  const anterior = lift('2026-11-09', 'A', { 'm-A-01': [[40, 15], [80, 8], [80, 8], [80, 8], [80, 8]], 'm-A-02': [[160, 10]] });

  it('fluxo completo: iniciar → marcar → desmarcar → pular → concluir', () => {
    const l0 = iniciarSessao(s, ficha('A'), inicio);
    expect(l0).toMatchObject({ data: '2026-11-16', ficha: 'A', treino: 'Pernas', programa: 'maromba', inicio: '18:00', emAndamento: true, concluido: false, sets: {}, inicioMs: inicio.getTime() });
    expect(l0.id).toBeTruthy();
    expect(contaComoFeito(l0)).toBe(false);
    expect(sessaoAberta([anterior, l0])?.id).toBe(l0.id);

    let l = marcarSerie(l0, 'm-A-01', 1, { reps: 15, carga: 40 }, new Date(2026, 10, 16, 18, 2));
    l = marcarSerie(l, 'm-A-01', 2, { reps: 10, carga: 80 }, new Date(2026, 10, 16, 18, 5));
    l = marcarSerie(l, 'm-A-01', 3, { reps: 10, carga: 80 }, new Date(2026, 10, 16, 18, 8));
    l = marcarSerie(l, 'm-A-01', 4, { reps: 10, carga: 80 }, new Date(2026, 10, 16, 18, 11));
    l = marcarSerie(l, 'm-A-01', 5, { reps: 9, carga: 80 }, new Date(2026, 10, 16, 18, 14));
    l = marcarSerie(l, 'm-A-02', 1, { reps: 11, carga: 160 }, new Date(2026, 10, 16, 18, 20));
    expect(l0.sets).toEqual({}); // o argumento não muda
    expect(l.sets?.['m-A-01']?.['2']).toEqual({ reps: 10, carga: 80, feito: true, t: '18:05' });
    expect(Object.keys(l.sets?.['m-A-01'] ?? {})).toEqual(['1', '2', '3', '4', '5']);
    expect(seriesFeitas(l)).toBe(5); // a série leve não conta
    expect(seriesMarcadas(l)).toBe(6);

    // tocar de novo desmarca: os valores ficam, a série deixa de contar
    const semUltima = desmarcarSerie(l, 'm-A-02', 1);
    expect(semUltima.sets?.['m-A-02']?.['1']).toEqual({ reps: 11, carga: 160, feito: false, t: '18:20' });
    expect(seriesFeitas(semUltima)).toBe(4);
    expect(l.sets?.['m-A-02']?.['1']?.feito).toBe(true);
    expect(desmarcarSerie(l, 'm-A-06', 1).sets).toEqual(l.sets);
    // marcar de novo sem valores aproveita o que estava gravado
    expect(marcarSerie(semUltima, 'm-A-02', 1, {}, new Date(2026, 10, 16, 18, 22)).sets?.['m-A-02']?.['1']).toEqual({ reps: 11, carga: 160, feito: true, t: '18:22' });

    l = pularExercicio(l, 'm-A-03', true);
    l = pularExercicio(l, 'm-A-03', true);
    l = pularExercicio(l, 'm-A-04', true);
    expect(l.pulados).toEqual(['m-A-03', 'm-A-04']);
    l = pularExercicio(l, 'm-A-04', false);
    expect(l.pulados).toEqual(['m-A-03']);

    const fim = new Date(2026, 10, 16, 18, 47, 30);
    const feito = concluirSessao([anterior, l], l, { intensidade: 4, obs: '  bom treino ' }, fim);
    expect(feito).toMatchObject({ concluido: true, emAndamento: false, fim: '18:47', min: 47.5, intensidade: 4, obs: 'bom treino', pulados: ['m-A-03'] });
    expect(feito.volume).toBe(40 * 15 + 80 * 39 + 160 * 11); // 5480
    expect(feito.prs).toEqual([
      { exId: 'm-A-01', nome: 'Agachamento no hack', e1rm: 106.7, carga: 80, reps: 10, anterior: 101.3, medida: 'e1rm' },
      { exId: 'm-A-02', nome: 'Leg press 45°', e1rm: 218.7, carga: 160, reps: 11, anterior: 213.3, medida: 'e1rm' },
    ]);
    expect(contaComoFeito(feito)).toBe(true);
    expect(l.emAndamento).toBe(true); // o argumento não muda
    expect(sessaoAberta([anterior, feito])).toBeUndefined();
    expect(proximaFicha(s, [anterior, feito]).id).toBe('B');
    expect(ultimaVez([anterior, feito], 'm-A-01')?.data).toBe('2026-11-16');
    // depois do treino: o hack não bateu 10 em todas, repete a carga e mira 10
    expect(sugestao(s, [anterior, feito], ex('m-A-01'))).toMatchObject({ tipo: 'repete', carga: 80, reps: '10' });
    // o leg press ficou em 11 de 12: repete e mira 12
    expect(sugestao(s, [anterior, feito], ex('m-A-02'))).toMatchObject({ tipo: 'repete', carga: 160, reps: '12' });
  });

  it('concluir sem séries conta como treino feito, com volume 0 e sem recordes', () => {
    const l = iniciarSessao(s, ficha('B'), inicio);
    const feito = concluirSessao([], l, {}, new Date(2026, 10, 16, 18, 30));
    expect(feito).toMatchObject({ concluido: true, emAndamento: false, min: 30, volume: 0, prs: [], obs: '' });
    expect(feito.intensidade).toBeUndefined();
  });

  it('a sessão sempre grava o programa em uso, mesmo com um id antigo nos ajustes', () => {
    expect(iniciarSessao(ajustes({ programa: PROGRAMA_ANTIGO }), ficha('C'), inicio).programa).toBe('maromba');
  });

  it('sem cronômetro, a duração sai de início e fim', () => {
    const l = { ...iniciarSessao(s, ficha('C'), new Date(2026, 10, 14, 23, 40)) };
    delete l.inicioMs;
    expect(concluirSessao([], l, {}, new Date(2026, 10, 14, 23, 59)).min).toBe(19);
  });

  it('sessão esquecida de outro dia: o fim é a hora da última série marcada', () => {
    let l = iniciarSessao(s, ficha('A'), new Date(2026, 10, 12, 19, 0));
    l = marcarSerie(l, 'm-A-01', 2, { reps: 10, carga: 80 }, new Date(2026, 10, 12, 19, 10));
    l = marcarSerie(l, 'm-A-02', 1, { reps: 10, carga: 160 }, new Date(2026, 10, 12, 19, 35));
    const feito = concluirSessao([], l, { intensidade: 3 }, new Date(2026, 10, 14, 9, 0));
    expect(feito).toMatchObject({ data: '2026-11-12', fim: '19:35', min: 35, concluido: true });
    // sem nenhuma série marcada não há como saber: fica sem fim e sem duração
    const vazio = concluirSessao([], iniciarSessao(s, ficha('A'), new Date(2026, 10, 12, 19, 0)), {}, new Date(2026, 10, 14, 9, 0));
    expect(vazio.fim).toBeUndefined();
    expect(vazio.min).toBeUndefined();
  });
});

/* ---------------- semana ---------------- */

describe('resumoSemanaMusc', () => {
  const s = ajustes();
  const lifts = [
    lift('2026-11-08', 'C', { 'm-C-02': [[10, 15]] }), // domingo da semana anterior
    lift('2026-11-09', 'A', { 'm-A-02': [[160, 10], [160, 10]], 'm-A-01': [[40, 15]] }), // segunda: a série leve do hack não conta
    lift('2026-11-14', 'C', { 'm-C-01': [[8, 15], [16, 10]] }), // sábado
    lift('2026-11-15', 'B', { 'm-B-02': [[50, 10]] }), // domingo: ainda é a mesma semana
    lift('2026-11-13', 'B', { 'm-B-02': [[50, 10]] }, { emAndamento: true, concluido: false }),
    lift('2026-11-16', 'A', { 'm-A-02': [[160, 10]] }), // segunda seguinte
  ];

  it('semana de segunda a domingo, só treinos feitos e séries de trabalho', () => {
    const esperado = { treinos: 3, planejados: 3, volume: 3200 + 600 + 120 + 160 + 500, series: 2 + 1 + 1 };
    expect(resumoSemanaMusc(s, lifts, '2026-11-14')).toEqual(esperado);
    expect(resumoSemanaMusc(s, lifts, '2026-11-09')).toEqual(esperado);
    expect(resumoSemanaMusc(s, lifts, '2026-11-15')).toEqual(esperado);
    expect(resumoSemanaMusc(s, lifts, '2026-11-16')).toMatchObject({ treinos: 1, volume: 1600, series: 1 });
  });

  it('planejados conta os dias "musc" e "ambos"', () => {
    const p = ajustes({ plano: { 0: { tipo: 'ambos' }, 1: { tipo: 'musc' }, 2: { tipo: 'corrida' }, 3: { tipo: 'descanso' } } });
    expect(resumoSemanaMusc(p, [], '2026-11-14')).toEqual({ treinos: 0, planejados: 2, volume: 0, series: 0 });
  });
});
