import { describe, expect, it } from 'vitest';
import { ROTAS, currentRoute, href, match, parseHash, resolverHash, rotaConhecida } from '../../src/lib/router.ts';

describe('parseHash', () => {
  it('separa caminho, partes e consulta', () => {
    const r = parseHash('#/corrida/treino/x?a=1&b=dois%20tres');
    expect(r.path).toBe('/corrida/treino/x');
    expect(r.parts).toEqual(['corrida', 'treino', 'x']);
    expect(r.query).toEqual({ a: '1', b: 'dois tres' });
  });

  it('rota vazia leva a /hoje', () => {
    for (const h of ['', '#', '#/', '/', '#//']) {
      const r = parseHash(h);
      expect(r.path).toBe('/hoje');
      expect(r.parts).toEqual(['hoje']);
      expect(r.query).toEqual({});
    }
  });

  it('normaliza barras e decodifica partes', () => {
    expect(parseHash('#corrida').path).toBe('/corrida');
    expect(parseHash('#/corrida/').path).toBe('/corrida');
    expect(parseHash('/musculacao/ficha/B').parts).toEqual(['musculacao', 'ficha', 'B']);
    expect(parseHash('#/exercicio/agachamento%20livre').parts[1]).toBe('agachamento livre');
    expect(parseHash('#/exercicio/100%').parts[1]).toBe('100%');
  });
});

describe('match', () => {
  it('extrai parâmetros', () => {
    const r = parseHash('#/corrida/treino/s03-qua');
    expect(match(r, '/corrida/treino/:id')).toEqual({ id: 's03-qua' });
    expect(match(r, '/corrida/guiada/:id')).toBeNull();
    expect(match(r, '/corrida')).toBeNull();
    expect(match(r, '/corrida/treino/:id/extra')).toBeNull();
    expect(match(parseHash('#/a/1/b/2'), '/a/:x/b/:y')).toEqual({ x: '1', y: '2' });
  });

  it('rota sem parâmetros devolve objeto vazio', () => {
    expect(match(parseHash('#/hoje'), '/hoje')).toEqual({});
    expect(match(parseHash('#/hoje?x=1'), '/hoje')).toEqual({});
    expect(match(parseHash('#/hoje'), '/ajustes')).toBeNull();
  });
});

describe('rotas do app', () => {
  it('todas as rotas da especificação são conhecidas', () => {
    for (const p of ROTAS) expect(rotaConhecida(parseHash(p.replace(':id', 'abc')))).toBe(true);
    expect(rotaConhecida(parseHash('#/musculacao/sessao'))).toBe(true);
    expect(rotaConhecida(parseHash('#/nao-existe'))).toBe(false);
  });

  it('rota desconhecida leva a /hoje', () => {
    expect(resolverHash('#/nao-existe').path).toBe('/hoje');
    expect(resolverHash('#/corrida/treino').path).toBe('/hoje');
    expect(resolverHash('#/progresso?aba=peso')).toEqual({ path: '/progresso', parts: ['progresso'], query: { aba: 'peso' } });
  });

  it('href', () => {
    expect(href('/corrida')).toBe('#/corrida');
    expect(href('corrida')).toBe('#/corrida');
    expect(href('#/corrida')).toBe('#/corrida');
  });

  it('sem janela (ambiente de teste), a rota atual é /hoje', () => {
    expect(currentRoute().path).toBe('/hoje');
  });
});
