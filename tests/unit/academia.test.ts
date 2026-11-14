import { describe, expect, it } from 'vitest';
import { METODO_TXT_EXERCICIO, PROGRAMAS, programaPorId } from '../../src/data/fichas.ts';
import {
  METODO_ROTULO, METODO_TXT, acharExercicio, aplicarAjuste, blocosDaFicha, concluirSessao, contaComoFeito, descansoDe,
  desmarcarSerie, duracaoDoLift, e1rm, ehPrincipal, esquemaDaSerie, exerciciosPreparacao, exerciciosPrincipais, fichaDoDia,
  fichaPorLetra, fichasAtivas, historicoEx, iniciarSessao, lerReps, liftsFeitos, marcarSerie, metodoTexto, paresCombinados,
  parceiroDe, programaAtivo, proximaFicha, prsDoLift, pularExercicio, resumoSemanaMusc, rotacaoFichas, serieConta,
  seriesDeTrabalho, seriesFeitas, seriesMarcadas, seriesPlanejadas, sessaoAberta, sugestao, totalSeriesDeTrabalho,
  ultimaVez, volumeDoLift,
} from '../../src/lib/academia.ts';
import type { Ficha, FichaExercicio, Lift, SerieFeita, Settings } from '../../src/types.ts';

/* ---------------- apoio ---------------- */

/** Ajustes do estado inicial (SPEC §4): seg B, ter descanso, qua corrida, qui C, sex corrida, sáb A, dom corrida. Chave 0 = domingo. */
function ajustes(over: Partial<Settings> = {}): Settings {
  return {
    nome: 'Filipe', tema: 'auto', som: true, voz: true, vibrar: true, telaLigada: true, descansoPadrao: 90, alongamentoSeg: 60,
    fcMax: 192, zonas: [], programa: 'hibrido',
    plano: {
      0: { tipo: 'corrida' }, 1: { tipo: 'musc', ficha: 'B' }, 2: { tipo: 'descanso' }, 3: { tipo: 'corrida' },
      4: { tipo: 'musc', ficha: 'C' }, 5: { tipo: 'corrida' }, 6: { tipo: 'musc', ficha: 'A' },
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
  return { id: `l${++seq}`, data, ficha: letra, treino: f.nome, programa: 'hibrido', concluido: true, emAndamento: false, sets: s, ...over };
}
/** Exercício fora do catálogo, para os ramos que o programa híbrido não tem. */
function avulso(over: Partial<FichaExercicio>): FichaExercicio {
  return { id: 'x-1', anim: 'x', nome: 'Avulso', grupo: 'teste', tipo: 'principal', series: [], ...over };
}

/* ---------------- catálogo ---------------- */

describe('fichas do programa híbrido', () => {
  const p = programaPorId('hibrido');

  it('tem o programa com as 3 fichas e os 36 exercícios', () => {
    expect(PROGRAMAS).toHaveLength(1);
    expect(p).toMatchObject({ id: 'hibrido', nome: 'Atleta Híbrido', objetivo: 'Condicionamento físico', fonte: 'Treinador Fabiano · ficha de ago/2025' });
    expect(p?.fichas.map((f) => `${f.id} ${f.nome} ${f.exercicios.length}`)).toEqual(['A Costas e bíceps 13', 'B Inferiores 13', 'C Peito, ombro e braço 10']);
    expect(programaPorId('nao-existe')).toBeUndefined();
  });

  it('ids permanentes em sequência, anim e equipamento em todos, sem foto', () => {
    for (const f of p?.fichas ?? []) {
      f.exercicios.forEach((e, i) => {
        expect(e.id).toBe(`h-${f.id}-${String(i + 1).padStart(2, '0')}`);
        expect(e.anim).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
        expect(e.equipamento).toBeTruthy();
        expect(e.series.length).toBeGreaterThan(0);
        expect(Object.keys(e)).not.toContain('img');
        expect(Object.keys(e)).not.toContain('imgArquivo');
      });
    }
    expect(ex('h-B-10').equipamento).toBe('banco nórdico');
    expect(ex('h-A-01').anim).toBe('alongamento-peitoral-espaldar');
    expect(ex('h-C-01').anim).toBe('alongamento-peitoral-espaldar');
    expect(ex('h-C-02').anim).toBe(ex('h-A-05').anim);
    expect(ex('h-B-13').anim).toBe('dorsiflexao-halter');
    expect(ex('h-C-10').anim).toBe('abdominal-maquina');
  });

  it('guarda blocos, métodos, instruções e drops como no catálogo', () => {
    expect(ex('h-A-07').series).toEqual([
      { sets: 1, reps: '10-15', rir: '1-3', iso: '2 s', carga: 25, intervalo: 60, nota: 'aquecimento' },
      { sets: 3, reps: '8-12', rir: '1-3', iso: null, carga: 40, intervalo: 90 },
    ]);
    expect(ex('h-B-09')).toMatchObject({ metodo: 'drop-set', series: [{ sets: 2, carga: 96, drops: [96, 52, 38] }] });
    expect(ex('h-B-05').series[0]).toMatchObject({ reps: '20/20', carga: null, nota: 'elástico azul' });
    expect(ex('h-A-11')).toMatchObject({ metodo: 'super-set', combinado: 'c4', instrucoes: 'Super-set 1' });
    expect(ex('h-C-09').instrucoes).toBe('Combinar com abdômen bi articular, ao lado.');
    const comMetodo = PROGRAMAS.flatMap((x) => x.fichas).flatMap((f) => f.exercicios).filter((e) => e.metodo);
    expect(comMetodo.map((e) => e.id).sort()).toEqual(Object.keys(METODO_TXT_EXERCICIO).sort());
  });

  it('pares combinados, treino principal e preparação', () => {
    const A = ficha('A'), B = ficha('B'), C = ficha('C');
    expect(paresCombinados(A).map(([a, b]) => `${a.id}+${b.id}`)).toEqual(['h-A-01+h-A-02', 'h-A-03+h-A-04', 'h-A-05+h-A-06', 'h-A-11+h-A-12']);
    expect(paresCombinados(B)).toHaveLength(3);
    expect(paresCombinados(C)).toHaveLength(2);
    expect(parceiroDe(A, 'h-A-12')?.id).toBe('h-A-11');
    expect(parceiroDe(A, 'h-A-07')).toBeUndefined();
    // o aquecimento que faz par com um principal vai para o treino principal (cartão duplo)
    expect(exerciciosPrincipais(A).map((e) => e.id)).toEqual(['h-A-05', 'h-A-06', 'h-A-07', 'h-A-08', 'h-A-09', 'h-A-10', 'h-A-11', 'h-A-12', 'h-A-13']);
    expect(exerciciosPreparacao(A).map((e) => e.id)).toEqual(['h-A-01', 'h-A-02', 'h-A-03', 'h-A-04']);
    expect(exerciciosPreparacao(B).map((e) => e.id)).toEqual(['h-B-01', 'h-B-02', 'h-B-03', 'h-B-04']);
    expect(blocosDaFicha(A).map((b) => b.map((e) => e.id).join('+'))).toEqual(['h-A-05+h-A-06', 'h-A-07', 'h-A-08', 'h-A-09', 'h-A-10', 'h-A-11+h-A-12', 'h-A-13']);
    expect(blocosDaFicha(C).map((b) => b.length)).toEqual([1, 1, 1, 1, 1, 1, 2]);
  });

  it('métodos têm rótulo e texto', () => {
    expect(METODO_ROTULO['dead-stop']).toBe('Dead stop');
    for (const m of ['rest-pause', 'cluster-set', 'super-set', 'bi-set', 'dead-stop', 'drop-set'] as const) {
      expect(METODO_ROTULO[m]).toBeTruthy();
      expect(METODO_TXT[m].length).toBeGreaterThan(20);
    }
    expect(metodoTexto(ex('h-B-09'))).toContain('96 kg');
    expect(metodoTexto(ex('h-A-10'))).toBe(METODO_TXT['rest-pause']);
    expect(metodoTexto(ex('h-A-07'))).toBeUndefined();
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
  it('não quebra em nenhum dos 36 exercícios e numera de 1 em diante', () => {
    let total = 0;
    for (const f of programaAtivo(ajustes()).fichas) {
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
    expect(total).toBe(36);
  });

  it('totais por ficha: séries planejadas e séries de trabalho', () => {
    const planejadas = (letra: string) => ficha(letra).exercicios.reduce((a, e) => a + seriesPlanejadas(e).length, 0);
    expect([planejadas('A'), planejadas('B'), planejadas('C')]).toEqual([38, 32, 29]);
    expect([totalSeriesDeTrabalho(ficha('A')), totalSeriesDeTrabalho(ficha('B')), totalSeriesDeTrabalho(ficha('C'))]).toEqual([27, 22, 23]);
    // a contagem pela regra única bate com as linhas que não são de aquecimento
    for (const letra of ['A', 'B', 'C']) {
      const linhas = ficha(letra).exercicios.flatMap((e) => seriesPlanejadas(e)).filter((x) => !x.aquecimento).length;
      expect(linhas).toBe(totalSeriesDeTrabalho(ficha(letra)));
    }
  });

  it('n cumulativo entre blocos: Remada Cavalinho e Supino Reto', () => {
    expect(seriesPlanejadas(ex('h-A-07'))).toEqual([
      { n: 1, bloco: 0, reps: '10-15', faixa: [10, 15], segundos: null, carga: 25, intervalo: 60, aquecimento: true },
      { n: 2, bloco: 1, reps: '8-12', faixa: [8, 12], segundos: null, carga: 40, intervalo: 90, aquecimento: false },
      { n: 3, bloco: 1, reps: '8-12', faixa: [8, 12], segundos: null, carga: 40, intervalo: 90, aquecimento: false },
      { n: 4, bloco: 1, reps: '8-12', faixa: [8, 12], segundos: null, carga: 40, intervalo: 90, aquecimento: false },
    ]);
    const supino = seriesPlanejadas(ex('h-C-03'));
    expect(supino.map((x) => [x.n, x.bloco, x.carga, x.aquecimento])).toEqual([[1, 0, 30, true], [2, 1, 40, true], [3, 2, 80, false], [4, 2, 80, false], [5, 2, 80, false]]);
  });

  it('tempo, carga não numérica e exercícios de preparação', () => {
    expect(seriesPlanejadas(ex('h-A-01'))[0]).toMatchObject({ reps: '45 s', faixa: null, segundos: 45, carga: 0, intervalo: 45, aquecimento: true });
    expect(seriesPlanejadas(ex('h-A-02'))[0]).toMatchObject({ segundos: 45, intervalo: 30 });
    expect(seriesPlanejadas(ex('h-B-05'))[0]).toMatchObject({ reps: '20/20', faixa: [20, 20], carga: null, intervalo: null, aquecimento: true });
    expect(seriesPlanejadas(ex('h-A-08'))[0]).toMatchObject({ reps: '4-4-4', faixa: [4, 4], segundos: null });
    expect(seriesPlanejadas(avulso({}))).toEqual([]);
  });

  it('série de trabalho: regra única', () => {
    expect(ehPrincipal(ex('h-A-07'))).toBe(true);
    expect(ehPrincipal(ex('h-A-05'))).toBe(false);
    expect(serieConta(ex('h-A-07'), 1)).toBe(false);
    expect(serieConta(ex('h-A-07'), 2)).toBe(true);
    expect(serieConta(ex('h-A-07'), 9)).toBe(true); // série extra cai no último bloco
    expect(serieConta(ex('h-A-05'), 1)).toBe(false);
    expect(serieConta(undefined, 1)).toBe(true); // exercício desconhecido conta
    expect(seriesDeTrabalho(ex('h-C-03'))).toBe(3);
    expect(seriesDeTrabalho(ex('h-A-01'))).toBe(0);
    expect(seriesDeTrabalho(ex('h-B-09'))).toBe(2); // drop-set: 1 série por rodada
  });

  it('esquema de cada série', () => {
    expect(esquemaDaSerie(ex('h-A-08'), 1)).toBe('cluster-set');
    expect(esquemaDaSerie(ex('h-B-09'), 2)).toBe('drop-set');
    expect(esquemaDaSerie(ex('h-A-01'), 1)).toBe('tempo');
    expect(esquemaDaSerie(ex('h-A-10'), 1)).toBeNull(); // rest-pause progride normalmente
    expect(esquemaDaSerie(ex('h-B-05'), 1)).toBeNull();
    expect(esquemaDaSerie(avulso({ metodo: 'dead-stop', series: [{ sets: 3, reps: '5 + 10', carga: 100 }] }), 1)).toBe('dead-stop');
    expect(esquemaDaSerie(avulso({ series: [{ sets: 3, reps: '5 + 10', carga: 100 }] }), 1)).toBe('soma');
  });
});

/* ---------------- programa e ajustes do usuário ---------------- */

describe('fichas ativas', () => {
  it('programa desconhecido cai no híbrido', () => {
    expect(programaAtivo(ajustes({ programa: 'xyz' })).id).toBe('hibrido');
    expect(fichasAtivas(ajustes()).map((f) => f.id)).toEqual(['A', 'B', 'C']);
    expect(fichaPorLetra(ajustes(), 'D')).toBeUndefined();
  });

  it('aplica settings.fichas sem alterar o catálogo', () => {
    const s = ajustes({ fichas: { 'h-A-07': { nome: 'Remada T', series: 4, intervalo: 120 }, 'h-B-09': { carga: 80 }, 'h-A-09': { carga: 50 } } });
    const A = fichaPorLetra(s, 'A'), B = fichaPorLetra(s, 'B');
    const remada = A?.exercicios.find((e) => e.id === 'h-A-07');
    expect(remada?.nome).toBe('Remada T');
    expect(remada?.series.map((b) => [b.sets, b.intervalo])).toEqual([[1, 120], [4, 120]]); // "series" vale para o bloco de trabalho
    expect(A?.exercicios.find((e) => e.id === 'h-A-09')?.series[0]?.carga).toBe(50);
    const extensora = B?.exercicios.find((e) => e.id === 'h-B-09');
    expect(extensora?.series[0]).toMatchObject({ carga: 80 });
    expect(extensora?.series[0]?.drops).toBeUndefined(); // o usuário assumiu a carga
    expect(ex('h-A-07').nome).toBe('Remada Cavalinho (Pegada Neutra)');
    expect(ex('h-B-09').series[0]?.drops).toEqual([96, 52, 38]);
    expect(totalSeriesDeTrabalho(A as Ficha)).toBe(28);
  });

  it('ajuste vazio ou inválido não muda nada e aplicar duas vezes dá no mesmo', () => {
    expect(aplicarAjuste(ex('h-A-07'), undefined)).toEqual(ex('h-A-07'));
    expect(aplicarAjuste(ex('h-A-07'), { nome: '  ', series: 0, carga: -5, intervalo: 0 })).toEqual(ex('h-A-07'));
    const uma = aplicarAjuste(ex('h-C-03'), { series: 5, carga: 70 });
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
  const l = lift('2026-11-14', 'A', { 'h-A-05': [[0, 20], [0, 20]], 'h-A-07': [[25, 12], [40, 12], [40, 10], [40, 9]], 'h-A-09': [[56.5, 10]] });

  it('volume = Σ reps × carga das séries feitas', () => {
    expect(volumeDoLift(l)).toBe(25 * 12 + 40 * 31 + 565);
    const desmarcada = desmarcarSerie(l, 'h-A-09', 1);
    expect(volumeDoLift(desmarcada)).toBe(25 * 12 + 40 * 31);
  });
  it('registro sem séries usa o volume gravado', () => {
    expect(volumeDoLift({ id: 'm', data: '2026-11-01', ficha: 'A', treino: 'Costas e bíceps', programa: 'hibrido', volume: 5200 })).toBe(5200);
    expect(volumeDoLift({ id: 'm', data: '2026-11-01', ficha: 'A', treino: 'Costas e bíceps', programa: 'hibrido' })).toBe(0);
  });
  it('séries feitas contam só as de trabalho', () => {
    expect(seriesFeitas(l)).toBe(4); // 3 da remada + 1 da puxada
    expect(seriesFeitas(l, 'h-A-07')).toBe(3);
    expect(seriesFeitas(l, 'h-A-05')).toBe(0);
    expect(seriesMarcadas(l)).toBe(7);
    expect(seriesMarcadas(l, 'h-A-05')).toBe(2);
    expect(seriesMarcadas(l, 'h-A-13')).toBe(0);
  });
  it('duração: min gravado ou fim − início', () => {
    expect(duracaoDoLift({ ...l, min: 52 })).toBe(52);
    expect(duracaoDoLift({ ...l, inicio: '23:40', fim: '00:25' })).toBe(45);
    expect(duracaoDoLift(l)).toBeNull();
  });
});

/* ---------------- feito, sessão aberta, última vez, histórico ---------------- */

describe('registros', () => {
  const a = lift('2026-11-02', 'A', { 'h-A-09': [[50, 12], [50, 11]] });
  const b = lift('2026-11-09', 'A', { 'h-A-09': [[52.5, 10], [52.5, 9]] });
  const aberto = lift('2026-11-14', 'A', { 'h-A-09': [[55, 8]] }, { emAndamento: true, concluido: false, inicio: '18:00' });
  const descartado = lift('2026-11-12', 'A', { 'h-A-09': [[60, 8]] }, { emAndamento: false, concluido: false });
  const antigo: Lift = { id: 'antigo', data: '2026-10-20', ficha: 'B', treino: 'Inferiores', programa: 'hibrido' };
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
    expect(ultimaVez(todos, 'h-A-09')).toEqual({ data: '2026-11-09', sets: [{ n: 1, reps: 10, carga: 52.5, feito: true, t: '18:00' }, { n: 2, reps: 9, carga: 52.5, feito: true, t: '18:00' }] });
    expect(ultimaVez(todos, 'h-A-13')).toBeUndefined();
    expect(ultimaVez(todos, 'h-A-09', b)?.data).toBe('2026-11-02'); // antes da sessão b
    expect(ultimaVez(todos, 'h-A-09', aberto)?.data).toBe('2026-11-09');
    expect(ultimaVez(todos, 'h-A-09', a)).toBeUndefined();
  });

  it('ultimaVez ignora séries desmarcadas', () => {
    const l = desmarcarSerie(desmarcarSerie(b, 'h-A-09', 1), 'h-A-09', 2);
    expect(ultimaVez([a, l], 'h-A-09')?.data).toBe('2026-11-02');
  });

  it('historicoEx por sessão', () => {
    expect(historicoEx(todos, 'h-A-09')).toEqual([
      { data: '2026-11-02', e1rm: 70, cargaMax: 50, repsMax: 12 },
      { data: '2026-11-09', e1rm: 70, cargaMax: 52.5, repsMax: 10 },
    ]);
    expect(historicoEx(todos, 'h-C-03')).toEqual([]);
  });
});

/* ---------------- sugestão: progressão dupla por bloco ---------------- */

describe('sugestao', () => {
  const s = ajustes();

  it('sem histórico: carga e base da ficha', () => {
    const sg = sugestao(s, [], ex('h-A-09'));
    expect(sg).toMatchObject({ tipo: 'ficha', carga: 56.5, reps: '8', motivo: 'Primeira vez: carga da ficha' });
    expect(sg.series).toEqual([1, 2, 3, 4].map((n) => ({ n, carga: 56.5, reps: 8 })));
  });

  it('bateu o topo em todas, abaixo de 60 kg: +2,5 kg e volta à base', () => {
    const sg = sugestao(s, [lift('2026-11-07', 'A', { 'h-A-09': [[56.5, 12], [56.5, 12], [56.5, 12], [56.5, 13]] })], ex('h-A-09'));
    expect(sg).toMatchObject({ tipo: 'sobe', carga: 59, reps: '8', motivo: 'Bateu 12 em todas: suba para 59 kg' });
    expect(sg.series.every((x) => x.carga === 59 && x.reps === 8)).toBe(true);
  });

  it('bateu o topo a partir de 60 kg: +5% arredondado a 0,5 kg', () => {
    const com = (carga: number) => sugestao(s, [lift('2026-11-07', 'A', { 'h-A-09': [[carga, 12], [carga, 12], [carga, 12], [carga, 12]] })], ex('h-A-09'));
    expect(com(60).carga).toBe(63);
    expect(com(62.5).carga).toBe(65.5); // 65,625 → 65,5
    expect(com(80)).toMatchObject({ tipo: 'sobe', carga: 84 });
    expect(com(57.5)).toMatchObject({ carga: 60, motivo: 'Bateu 12 em todas: suba para 60 kg' });
    expect(com(40).motivo).toBe('Bateu 12 em todas: suba para 42,5 kg');
  });

  it('não bateu o topo em todas: repete a carga e mira +1 repetição', () => {
    const sg = sugestao(s, [lift('2026-11-07', 'A', { 'h-A-09': [[56.5, 12], [56.5, 10], [56.5, 9], [56.5, 9]] })], ex('h-A-09'));
    expect(sg).toMatchObject({ tipo: 'repete', carga: 56.5, reps: '10', motivo: 'Faltou chegar a 12 em todas: repita 56,5 kg e mire 10' });
    // abaixo da base: mira a base
    const baixo = sugestao(s, [lift('2026-11-07', 'A', { 'h-A-09': [[56.5, 6], [56.5, 5]] })], ex('h-A-09'));
    expect(baixo).toMatchObject({ tipo: 'repete', reps: '8' });
  });

  it('usa a sessão feita mais recente e ignora a em andamento', () => {
    const lifts = [
      lift('2026-11-01', 'A', { 'h-A-09': [[50, 12], [50, 12]] }),
      lift('2026-11-08', 'A', { 'h-A-09': [[52.5, 9], [52.5, 8]] }),
      lift('2026-11-14', 'A', { 'h-A-09': [[70, 12]] }, { emAndamento: true, concluido: false }),
    ];
    expect(sugestao(s, lifts, ex('h-A-09'))).toMatchObject({ tipo: 'repete', carga: 52.5, reps: '9' });
  });

  it('séries de trabalho = carga com mais séries; a série isolada mais pesada fica fora', () => {
    const sg = sugestao(s, [lift('2026-11-07', 'A', { 'h-A-09': [[60, 6], [50, 12], [50, 12], [50, 12]] })], ex('h-A-09'));
    expect(sg).toMatchObject({ tipo: 'sobe', carga: 52.5 });
    // empate no número de séries: vale a mais pesada
    const empate = sugestao(s, [lift('2026-11-07', 'A', { 'h-A-09': [[50, 12], [50, 12], [55, 9], [55, 9]] })], ex('h-A-09'));
    expect(empate).toMatchObject({ tipo: 'repete', carga: 55, reps: '10' });
  });

  it('progressão por bloco: aquecimento repete, trabalho progride (Supino Reto)', () => {
    const sg = sugestao(s, [lift('2026-11-05', 'C', { 'h-C-03': [[30, 15], [42.5, 10], [80, 12], [80, 12], [80, 12]] })], ex('h-C-03'));
    expect(sg).toMatchObject({ tipo: 'sobe', carga: 84, reps: '8' });
    expect(sg.series).toEqual([
      { n: 1, carga: 30, reps: 15 }, { n: 2, carga: 42.5, reps: 10 },
      { n: 3, carga: 84, reps: 8 }, { n: 4, carga: 84, reps: 8 }, { n: 5, carga: 84, reps: 8 },
    ]);
    // só o aquecimento feito: o bloco de trabalho segue a ficha
    const soAq = sugestao(s, [lift('2026-11-05', 'C', { 'h-C-03': [[30, 15]] })], ex('h-C-03'));
    expect(soAq).toMatchObject({ tipo: 'ficha', carga: 80, reps: '8' });
    expect(soAq.series[1]).toEqual({ n: 2, carga: 40, reps: 8 });
  });

  it('exercício de aquecimento: como na ficha', () => {
    expect(sugestao(s, [], ex('h-A-05'))).toMatchObject({ tipo: 'aquecimento', carga: 0, reps: '15', motivo: 'Aquecimento: como na ficha' });
    const sg = sugestao(s, [lift('2026-11-07', 'A', { 'h-A-05': [[2, 20], [2, 18]] })], ex('h-A-05'));
    expect(sg).toMatchObject({ tipo: 'aquecimento', carga: 2, reps: '18' });
  });

  it('peso do corpo progride por repetições', () => {
    const bateu = sugestao(s, [lift('2026-11-09', 'B', { 'h-B-11': [[0, 15], [0, 15], [0, 16]] })], ex('h-B-11'));
    expect(bateu).toMatchObject({ tipo: 'reps', carga: 0, reps: '16', motivo: 'Peso do corpo: bateu 15 em todas, tente 16' });
    const faltou = sugestao(s, [lift('2026-11-09', 'B', { 'h-B-11': [[0, 13], [0, 12], [0, 11]] })], ex('h-B-11'));
    expect(faltou).toMatchObject({ tipo: 'repete', carga: 0, reps: '12', motivo: 'Peso do corpo: faltou chegar a 15, mire 12' });
    // com carga registrada, o mesmo exercício volta à progressão por carga
    const comCarga = sugestao(s, [lift('2026-11-09', 'B', { 'h-B-11': [[10, 15], [10, 15], [10, 15]] })], ex('h-B-11'));
    expect(comCarga).toMatchObject({ tipo: 'sobe', carga: 12.5, reps: '10' });
  });

  it('última vez sem carga num exercício com carga na ficha: volta à ficha', () => {
    const sg = sugestao(s, [lift('2026-11-07', 'A', { 'h-A-09': [[0, 12], [0, 12]] })], ex('h-A-09'));
    expect(sg).toMatchObject({ tipo: 'ficha', carga: 56.5, reps: '8', motivo: 'Última vez sem carga registrada: carga da ficha' });
  });

  it('cluster-set repete o esquema da ficha', () => {
    expect(sugestao(s, [], ex('h-A-08'))).toMatchObject({ tipo: 'ficha', carga: 35, reps: '12' });
    const sg = sugestao(s, [lift('2026-11-07', 'A', { 'h-A-08': [[37.5, 12], [37.5, 12], [37.5, 12]] })], ex('h-A-08'));
    expect(sg).toMatchObject({ tipo: 'repete', carga: 37.5, reps: '12', motivo: 'Cluster-set: siga o esquema 4-4-4 (12 por série)' });
    expect(sg.series).toEqual([1, 2, 3].map((n) => ({ n, carga: 37.5, reps: 12 })));
  });

  it('drop-set repete as cargas da ficha', () => {
    const sg = sugestao(s, [lift('2026-11-09', 'B', { 'h-B-09': [[96, 15], [96, 15]] })], ex('h-B-09'));
    expect(sg).toMatchObject({ tipo: 'repete', carga: 96, reps: '15', motivo: 'Drop-set: siga as cargas da ficha (96 → 52 → 38 kg)' });
    expect(sugestao(s, [], ex('h-B-09'))).toMatchObject({ tipo: 'ficha', carga: 96, reps: '10' });
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
    const sg = sugestao(s, [lift('2026-11-07', 'A', { 'h-A-10': [[40, 12], [40, 12], [40, 12]] })], ex('h-A-10'));
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
    const sg = sugestao(ajustes({ fichas: { 'h-A-09': { carga: 45, series: 3 } } }), [], ex('h-A-09'));
    expect(sg).toMatchObject({ tipo: 'ficha', carga: 45 });
    expect(sg.series).toHaveLength(3);
  });
});

/* ---------------- descanso ---------------- */

describe('descansoDe', () => {
  it('intervalo do bloco que cobre a série', () => {
    const s = ajustes();
    expect(descansoDe(s, ex('h-A-07'), 1)).toBe(60);
    expect(descansoDe(s, ex('h-A-07'), 2)).toBe(90);
    expect(descansoDe(s, ex('h-A-07'), 9)).toBe(90); // além do total: último bloco
    expect(descansoDe(s, ex('h-B-07'), 1)).toBe(30);
  });
  it('sem intervalo na ficha: padrão do usuário, depois 90 s', () => {
    expect(descansoDe(ajustes({ descansoPadrao: 75 }), ex('h-A-06'), 1)).toBe(75);
    expect(descansoDe(ajustes({ descansoPadrao: 0 }), ex('h-A-06'), 1)).toBe(90);
    expect(descansoDe(ajustes({ descansoPadrao: Number.NaN }), ex('h-B-06'), 2)).toBe(90);
    expect(descansoDe(ajustes({ descansoPadrao: 75 }), ex('h-A-07'), 2)).toBe(90); // o da ficha vence o padrão
  });
  it('par combinado: vale o maior dos dois intervalos', () => {
    const s = ajustes({ descansoPadrao: 75 });
    expect(descansoDe(s, ex('h-A-11'), 1, ex('h-A-12'))).toBe(30); // null + 30
    expect(descansoDe(s, ex('h-A-12'), 1, ex('h-A-11'))).toBe(30);
    expect(descansoDe(s, ex('h-C-09'), 1, ex('h-C-10'))).toBe(90); // 60 + 90
    expect(descansoDe(s, ex('h-C-10'), 3, ex('h-C-09'))).toBe(90);
    expect(descansoDe(s, ex('h-B-10'), 2, ex('h-B-11'))).toBe(90);
    expect(descansoDe(s, ex('h-A-05'), 1, ex('h-A-06'))).toBe(75); // nenhum dos dois prescreve: padrão
    expect(descansoDe(s, ex('h-A-11'), 1)).toBe(75); // parceiro pulado: só o próprio, que cai no padrão
  });
  it('respeita o intervalo ajustado pelo usuário', () => {
    expect(descansoDe(ajustes({ fichas: { 'h-A-07': { intervalo: 120 } } }), ex('h-A-07'), 2)).toBe(120);
  });
});

/* ---------------- recordes ---------------- */

describe('prsDoLift', () => {
  const base = lift('2026-11-02', 'A', { 'h-A-09': [[50, 10], [50, 10]], 'h-A-13': [[25, 10]] }, { inicio: '18:00' });

  it('a primeira vez de um exercício não é recorde', () => {
    expect(prsDoLift([], base)).toEqual([]);
    const novo = lift('2026-11-09', 'A', { 'h-A-10': [[40, 12]] });
    expect(prsDoLift([base], novo)).toEqual([]);
  });

  it('e1RM maior que o melhor anterior é recorde', () => {
    const l = lift('2026-11-09', 'A', { 'h-A-09': [[50, 12], [52.5, 10]], 'h-A-13': [[25, 10]] });
    expect(prsDoLift([base, l], l)).toEqual([
      { exId: 'h-A-09', nome: 'Puxada supinada', e1rm: 70, carga: 50, reps: 12, anterior: 66.7, medida: 'e1rm' },
    ]);
  });

  it('igualar não é recorde; mais repetições na mesma carga é', () => {
    expect(prsDoLift([base], lift('2026-11-09', 'A', { 'h-A-09': [[50, 10]] }))).toEqual([]);
    expect(prsDoLift([base], lift('2026-11-09', 'A', { 'h-A-09': [[50, 11]] }))).toHaveLength(1);
  });

  it('compara com TODAS as sessões anteriores, não só a última', () => {
    const fraca = lift('2026-11-09', 'A', { 'h-A-09': [[40, 8]] });
    const l = lift('2026-11-12', 'A', { 'h-A-09': [[45, 10]] }); // melhor que a fraca, pior que a base
    expect(prsDoLift([base, fraca], l)).toEqual([]);
  });

  it('só valem sessões feitas e anteriores', () => {
    const aberta = lift('2026-11-05', 'A', { 'h-A-09': [[80, 10]] }, { emAndamento: true, concluido: false });
    const futura = lift('2026-11-20', 'A', { 'h-A-09': [[90, 10]] });
    const l = lift('2026-11-09', 'A', { 'h-A-09': [[55, 10]] });
    expect(prsDoLift([base, aberta, futura, l], l).map((p) => p.exId)).toEqual(['h-A-09']);
  });

  it('segunda sessão do mesmo dia compara com a primeira', () => {
    const tarde = lift('2026-11-02', 'A', { 'h-A-09': [[55, 10]] }, { inicio: '20:00' });
    expect(prsDoLift([base], tarde)).toHaveLength(1);
    expect(prsDoLift([tarde], base)).toEqual([]); // a de mais cedo não enxerga a de mais tarde
  });

  it('peso do corpo compara repetições máximas', () => {
    const antes = lift('2026-11-02', 'B', { 'h-B-11': [[0, 12], [0, 11]] });
    const l = lift('2026-11-09', 'B', { 'h-B-11': [[0, 14], [0, 12]] });
    expect(prsDoLift([antes], l)).toEqual([
      { exId: 'h-B-11', nome: 'Hiperextensão de Lombar', e1rm: 0, carga: 0, reps: 14, anterior: 0, repsAnterior: 12, medida: 'reps' },
    ]);
    expect(prsDoLift([antes], lift('2026-11-09', 'B', { 'h-B-11': [[0, 12]] }))).toEqual([]);
  });

  it('exercício fora do catálogo usa o id como nome', () => {
    const antes = { ...lift('2026-11-02', 'A'), sets: { 'z-9': feitas([[10, 10]]) } };
    const l = { ...lift('2026-11-09', 'A'), sets: { 'z-9': feitas([[12, 10]]) } };
    expect(prsDoLift([antes], l)[0]).toMatchObject({ exId: 'z-9', nome: 'z-9', medida: 'e1rm' });
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

  it('em andamento, descartada e de outro programa não contam; registro antigo casa pelo nome', () => {
    const aberta = lift('2026-11-10', 'A', {}, { emAndamento: true, concluido: false });
    const descartada = lift('2026-11-10', 'A', {}, { concluido: false });
    const outro = lift('2026-11-10', 'A', {}, { programa: 'bodybuilder' });
    expect(proximaFicha(s, [aberta, descartada, outro]).id).toBe('A');
    const porNome: Lift = { id: 'n', data: '2026-11-03', ficha: '', treino: 'Costas e bíceps', programa: 'hibrido' };
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

  it('usa 0 = domingo: 14/11/2026 é sábado (chave 6)', () => {
    expect(new Date(2026, 10, 14).getDay()).toBe(6);
    expect(fichaDoDia(s, [], '2026-11-14')?.id).toBe('A'); // sábado: ficha fixa A
    expect(fichaDoDia(s, [], '2026-11-16')?.id).toBe('B'); // segunda (chave 1): ficha fixa B
    expect(fichaDoDia(s, [], '2026-11-19')?.id).toBe('C'); // quinta (chave 4)
    expect(fichaDoDia(s, [], '2026-11-15')).toBeUndefined(); // domingo (chave 0): corrida
    expect(fichaDoDia(s, [], '2026-11-17')).toBeUndefined(); // terça: descanso
    expect(fichaDoDia(s, [], '2026-11-18')).toBeUndefined(); // quarta: corrida
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
    const f = fichaDoDia(ajustes({ fichas: { 'h-A-09': { carga: 50 } } }), [], '2026-11-14');
    expect(f?.exercicios.find((e) => e.id === 'h-A-09')?.series[0]?.carga).toBe(50);
  });
});

/* ---------------- sessão guiada ---------------- */

describe('sessão guiada', () => {
  const s = ajustes();
  const inicio = new Date(2026, 10, 14, 18, 0, 0);
  const anterior = lift('2026-11-07', 'A', { 'h-A-07': [[25, 12], [40, 10], [40, 10], [40, 9]], 'h-A-09': [[56.5, 10]] });

  it('fluxo completo: iniciar → marcar → desmarcar → pular → concluir', () => {
    const l0 = iniciarSessao(s, ficha('A'), inicio);
    expect(l0).toMatchObject({ data: '2026-11-14', ficha: 'A', treino: 'Costas e bíceps', programa: 'hibrido', inicio: '18:00', emAndamento: true, concluido: false, sets: {}, inicioMs: inicio.getTime() });
    expect(l0.id).toBeTruthy();
    expect(contaComoFeito(l0)).toBe(false);
    expect(sessaoAberta([anterior, l0])?.id).toBe(l0.id);

    let l = marcarSerie(l0, 'h-A-05', 1, { reps: 20, carga: 0 }, new Date(2026, 10, 14, 18, 2));
    l = marcarSerie(l, 'h-A-07', 1, { reps: 12, carga: 25 }, new Date(2026, 10, 14, 18, 5));
    l = marcarSerie(l, 'h-A-07', 2, { reps: 12, carga: 40 }, new Date(2026, 10, 14, 18, 8));
    l = marcarSerie(l, 'h-A-07', 3, { reps: 12, carga: 40 }, new Date(2026, 10, 14, 18, 11));
    l = marcarSerie(l, 'h-A-07', 4, { reps: 11, carga: 40 }, new Date(2026, 10, 14, 18, 14));
    l = marcarSerie(l, 'h-A-09', 1, { reps: 9, carga: 56.5 }, new Date(2026, 10, 14, 18, 20));
    expect(l0.sets).toEqual({}); // o argumento não muda
    expect(l.sets?.['h-A-07']?.['2']).toEqual({ reps: 12, carga: 40, feito: true, t: '18:08' });
    expect(Object.keys(l.sets?.['h-A-07'] ?? {})).toEqual(['1', '2', '3', '4']);
    expect(seriesFeitas(l)).toBe(4);
    expect(seriesMarcadas(l)).toBe(6);

    // tocar de novo desmarca: os valores ficam, a série deixa de contar
    const semUltima = desmarcarSerie(l, 'h-A-09', 1);
    expect(semUltima.sets?.['h-A-09']?.['1']).toEqual({ reps: 9, carga: 56.5, feito: false, t: '18:20' });
    expect(seriesFeitas(semUltima)).toBe(3);
    expect(l.sets?.['h-A-09']?.['1']?.feito).toBe(true);
    expect(desmarcarSerie(l, 'h-A-13', 1).sets).toEqual(l.sets);
    // marcar de novo sem valores aproveita o que estava gravado
    expect(marcarSerie(semUltima, 'h-A-09', 1, {}, new Date(2026, 10, 14, 18, 22)).sets?.['h-A-09']?.['1']).toEqual({ reps: 9, carga: 56.5, feito: true, t: '18:22' });

    l = pularExercicio(l, 'h-A-08', true);
    l = pularExercicio(l, 'h-A-08', true);
    l = pularExercicio(l, 'h-A-10', true);
    expect(l.pulados).toEqual(['h-A-08', 'h-A-10']);
    l = pularExercicio(l, 'h-A-10', false);
    expect(l.pulados).toEqual(['h-A-08']);

    const fim = new Date(2026, 10, 14, 18, 47, 30);
    const feito = concluirSessao([anterior, l], l, { intensidade: 4, obs: '  bom treino ' }, fim);
    expect(feito).toMatchObject({ concluido: true, emAndamento: false, fim: '18:47', min: 47.5, intensidade: 4, obs: 'bom treino', pulados: ['h-A-08'] });
    expect(feito.volume).toBe(25 * 12 + 40 * 35 + 56.5 * 9); // 2208,5
    expect(feito.prs).toEqual([
      { exId: 'h-A-07', nome: 'Remada Cavalinho (Pegada Neutra)', e1rm: 56, carga: 40, reps: 12, anterior: 53.3, medida: 'e1rm' },
    ]);
    expect(contaComoFeito(feito)).toBe(true);
    expect(l.emAndamento).toBe(true); // o argumento não muda
    expect(sessaoAberta([anterior, feito])).toBeUndefined();
    expect(proximaFicha(s, [anterior, feito]).id).toBe('B');
    expect(ultimaVez([anterior, feito], 'h-A-07')?.data).toBe('2026-11-14');
    // depois do treino: a remada não bateu 12 em todas, repete e mira 12
    expect(sugestao(s, [anterior, feito], ex('h-A-07'))).toMatchObject({ tipo: 'repete', carga: 40, reps: '12' });
  });

  it('concluir sem séries conta como treino feito, com volume 0 e sem recordes', () => {
    const l = iniciarSessao(s, ficha('B'), inicio);
    const feito = concluirSessao([], l, {}, new Date(2026, 10, 14, 18, 30));
    expect(feito).toMatchObject({ concluido: true, emAndamento: false, min: 30, volume: 0, prs: [], obs: '' });
    expect(feito.intensidade).toBeUndefined();
  });

  it('sem cronômetro, a duração sai de início e fim', () => {
    const l = { ...iniciarSessao(s, ficha('C'), new Date(2026, 10, 14, 23, 40)) };
    delete l.inicioMs;
    expect(concluirSessao([], l, {}, new Date(2026, 10, 14, 23, 59)).min).toBe(19);
  });

  it('sessão esquecida de outro dia: o fim é a hora da última série marcada', () => {
    let l = iniciarSessao(s, ficha('A'), new Date(2026, 10, 12, 19, 0));
    l = marcarSerie(l, 'h-A-07', 2, { reps: 10, carga: 40 }, new Date(2026, 10, 12, 19, 10));
    l = marcarSerie(l, 'h-A-09', 1, { reps: 10, carga: 56.5 }, new Date(2026, 10, 12, 19, 35));
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
    lift('2026-11-08', 'C', { 'h-C-07': [[50, 10]] }), // domingo da semana anterior
    lift('2026-11-09', 'B', { 'h-B-08': [[200, 10], [200, 10]], 'h-B-01': [[0, 0]] }), // segunda
    lift('2026-11-14', 'A', { 'h-A-07': [[25, 12], [40, 10]] }), // sábado
    lift('2026-11-15', 'C', { 'h-C-07': [[53, 10]] }), // domingo: ainda é a mesma semana
    lift('2026-11-13', 'A', { 'h-A-09': [[50, 10]] }, { emAndamento: true, concluido: false }),
    lift('2026-11-16', 'B', { 'h-B-08': [[200, 10]] }), // segunda seguinte
  ];

  it('semana de segunda a domingo, só treinos feitos e séries de trabalho', () => {
    const esperado = { treinos: 3, planejados: 3, volume: 4000 + 300 + 400 + 530, series: 2 + 1 + 1 };
    expect(resumoSemanaMusc(s, lifts, '2026-11-14')).toEqual(esperado);
    expect(resumoSemanaMusc(s, lifts, '2026-11-09')).toEqual(esperado);
    expect(resumoSemanaMusc(s, lifts, '2026-11-15')).toEqual(esperado);
    expect(resumoSemanaMusc(s, lifts, '2026-11-16')).toMatchObject({ treinos: 1, volume: 2000, series: 1 });
  });

  it('planejados conta os dias "musc" e "ambos"', () => {
    const p = ajustes({ plano: { 0: { tipo: 'ambos' }, 1: { tipo: 'musc' }, 2: { tipo: 'corrida' }, 3: { tipo: 'descanso' } } });
    expect(resumoSemanaMusc(p, [], '2026-11-14')).toEqual({ treinos: 0, planejados: 2, volume: 0, series: 0 });
  });
});
