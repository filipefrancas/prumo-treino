import 'fake-indexeddb/auto';
import { IDBFactory } from 'fake-indexeddb';
import { beforeEach, describe, expect, it, vi } from 'vitest';

type Midia = typeof import('../../src/lib/midia.ts');

/** Carrega o módulo do zero, como se o app tivesse sido aberto de novo. */
async function abrir(): Promise<Midia> {
  vi.resetModules();
  return import('../../src/lib/midia.ts');
}

const b64 = (texto: string): string => Buffer.from(texto, 'utf8').toString('base64');

function pacote(fotos: unknown[], extra: Record<string, unknown> = {}): string {
  return JSON.stringify({ kind: 'prumo-treino-fotos', version: 1, fotos, ...extra });
}

const foto = (id: string, conteudo = `foto de ${id}`): Record<string, unknown> => ({ id, mime: 'image/jpeg', data: b64(conteudo) });

async function textoDoUrl(url: string): Promise<string> {
  const r = await fetch(url);
  return r.text();
}

beforeEach(() => {
  Object.defineProperty(globalThis, 'indexedDB', { value: new IDBFactory(), configurable: true, writable: true });
});

describe('importarPacote', () => {
  it('grava as fotos e conta quantas entraram', async () => {
    const m = await abrir();
    expect(await m.contarFotos()).toBe(0);
    const r = await m.importarPacote(pacote([foto('leg-press-45'), foto('prancha'), { ...foto('ponte'), credito: ' treinador ' }]));
    expect(r).toEqual({ ok: true, added: 3 });
    expect(await m.contarFotos()).toBe(3);
    expect(m.temFoto('leg-press-45')).toBe(true);
    expect(m.temFoto('nao-existe')).toBe(false);
    expect(m.temFoto(undefined)).toBe(false);
  });

  it('as fotos continuam lá quando o app abre de novo', async () => {
    const a = await abrir();
    await a.importarPacote(pacote([foto('prancha')]));
    const b = await abrir();
    expect(b.temFoto('prancha')).toBe(false); // índice ainda não lido
    await b.carregarMidia();
    expect(b.temFoto('prancha')).toBe(true);
    expect(await b.contarFotos()).toBe(1);
  });

  it('importar de novo troca a foto sem duplicar', async () => {
    const m = await abrir();
    await m.importarPacote(pacote([foto('prancha', 'velha')]));
    const r = await m.importarPacote(pacote([foto('prancha', 'nova'), foto('ponte')]));
    expect(r.added).toBe(2);
    expect(await m.contarFotos()).toBe(2);
    const url = await m.reterFoto('prancha');
    expect(url).toBeDefined();
    expect(await textoDoUrl(url ?? '')).toBe('nova');
    m.soltarFoto('prancha', true);
  });

  it('ignora itens inválidos e aceita data URL', async () => {
    const m = await abrir();
    const r = await m.importarPacote(
      pacote([
        foto('ok-1'),
        { id: 'ok-2', mime: 'image/png', data: `data:image/png;base64,${b64('png')}` },
        { id: '', mime: 'image/jpeg', data: b64('x') },
        { id: 'sem-dado', mime: 'image/jpeg' },
        { id: 'tipo-errado', mime: 'text/html', data: b64('<b>') },
        { id: 'base64-ruim', mime: 'image/jpeg', data: '***' },
        'texto solto',
        null,
      ]),
    );
    expect(r).toEqual({ ok: true, added: 2 });
    expect(m.temFoto('ok-2')).toBe(true);
    expect(m.temFoto('tipo-errado')).toBe(false);
  });

  it('recusa o que não é pacote de fotos, com mensagem', async () => {
    const m = await abrir();
    for (const ruim of ['isto não é json', '[]', '{"kind":"prumo-treino-backup","fotos":[]}', '{"kind":"prumo-treino-fotos"}', pacote([foto('a')], { version: 2 }), pacote([])]) {
      const r = await m.importarPacote(ruim);
      expect(r.ok).toBe(false);
      expect(r.added).toBe(0);
      expect(r.error).toBeTruthy();
    }
    expect(await m.contarFotos()).toBe(0);
  });

  it('sem IndexedDB não rejeita: avisa que não deu', async () => {
    Object.defineProperty(globalThis, 'indexedDB', { value: undefined, configurable: true, writable: true });
    const m = await abrir();
    expect(await m.contarFotos()).toBe(0);
    const r = await m.importarPacote(pacote([foto('prancha')]));
    expect(r.ok).toBe(false);
    expect(r.error).toBeTruthy();
    await expect(m.apagarFotos()).resolves.toBeUndefined();
    expect(await m.reterFoto('prancha')).toBeUndefined();
  });
});

describe('apagarFotos', () => {
  it('remove tudo do aparelho', async () => {
    const m = await abrir();
    await m.importarPacote(pacote([foto('a'), foto('b')]));
    await m.apagarFotos();
    expect(await m.contarFotos()).toBe(0);
    expect(m.temFoto('a')).toBe(false);
    const depois = await abrir();
    expect(await depois.contarFotos()).toBe(0);
  });
});

describe('sinal de mudança', () => {
  it('avisa ao importar e ao apagar, e para depois de cancelar', async () => {
    const m = await abrir();
    const fn = vi.fn();
    const cancelar = m.assinarMidia(fn);
    const v0 = m.versaoMidia();
    await m.importarPacote(pacote([foto('a')]));
    expect(fn).toHaveBeenCalledTimes(1);
    expect(m.versaoMidia()).toBeGreaterThan(v0);
    await m.apagarFotos();
    expect(fn).toHaveBeenCalledTimes(2);
    await m.importarPacote('lixo');
    expect(fn).toHaveBeenCalledTimes(2);
    cancelar();
    await m.importarPacote(pacote([foto('b')]));
    expect(fn).toHaveBeenCalledTimes(2);
  });
});

describe('object URLs', () => {
  it('reterFoto devolve o mesmo URL para o mesmo id, com o conteúdo e o tipo da foto', async () => {
    const m = await abrir();
    await m.importarPacote(pacote([foto('prancha', 'bytes da prancha')]));
    const u1 = await m.reterFoto('prancha');
    const u2 = await m.reterFoto('prancha');
    expect(u1).toMatch(/^blob:/);
    expect(u2).toBe(u1);
    const r = await fetch(u1 ?? '');
    expect(r.headers.get('content-type')).toBe('image/jpeg');
    expect(await r.text()).toBe('bytes da prancha');
    expect(await m.reterFoto('sem-foto')).toBeUndefined();
    m.soltarFoto('prancha', true);
    m.soltarFoto('prancha', true);
  });

  it('revoga quando ninguém mais usa', async () => {
    const m = await abrir();
    await m.importarPacote(pacote([foto('prancha')]));
    const revogar = vi.spyOn(URL, 'revokeObjectURL');
    try {
      const url = await m.reterFoto('prancha');
      await m.reterFoto('prancha');
      m.soltarFoto('prancha', true);
      await Promise.resolve();
      expect(revogar).not.toHaveBeenCalled(); // ainda há um uso
      m.soltarFoto('prancha', true);
      await Promise.resolve();
      await Promise.resolve();
      expect(revogar).toHaveBeenCalledWith(url);
      const novo = await m.reterFoto('prancha');
      expect(novo).not.toBe(url);
      m.soltarFoto('prancha', true);
    } finally {
      revogar.mockRestore();
    }
  });

  it('solta com atraso por padrão e reaproveita se voltar a ser usado', async () => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
    try {
      const m = await abrir();
      await m.importarPacote(pacote([foto('prancha')]));
      const revogar = vi.spyOn(URL, 'revokeObjectURL');
      const url = await m.reterFoto('prancha');
      m.soltarFoto('prancha');
      vi.advanceTimersByTime(1000);
      expect(await m.reterFoto('prancha')).toBe(url); // voltou antes do prazo
      m.soltarFoto('prancha');
      vi.advanceTimersByTime(60_000);
      await Promise.resolve();
      await Promise.resolve();
      expect(revogar).toHaveBeenCalledWith(url);
      revogar.mockRestore();
    } finally {
      vi.useRealTimers();
    }
  });

  it('apagar e reimportar invalidam os URLs em cache', async () => {
    const m = await abrir();
    await m.importarPacote(pacote([foto('prancha', 'um')]));
    const u1 = await m.reterFoto('prancha');
    await m.importarPacote(pacote([foto('prancha', 'dois')]));
    const u2 = await m.reterFoto('prancha');
    expect(u2).not.toBe(u1);
    expect(await textoDoUrl(u2 ?? '')).toBe('dois');
    await m.apagarFotos();
    expect(await m.reterFoto('prancha')).toBeUndefined();
  });
});
