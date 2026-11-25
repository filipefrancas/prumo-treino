/**
 * Retorno ao usuário durante os treinos: bipes (WebAudio), voz (speechSynthesis), vibração e tela ligada.
 * O alvo é o iPhone (SPEC, seção 6): som só depois de um toque, sem vibração, voz iniciada por toque.
 * Tudo confere a existência das APIs e é protegido por try/catch: sem suporte, simplesmente não faz nada
 * (o módulo também roda em testes sem DOM). As preferências vêm de getState().settings.
 */
import { useEffect, useState } from 'preact/hooks';
import { getState } from './store.ts';

type TipoBip = 'curto' | 'duplo' | 'longo' | 'fim';

/* ------------------------------------------------------------------ */
/* Som                                                                 */
/* ------------------------------------------------------------------ */

let ctx: AudioContext | null = null;

function criarContexto(): AudioContext | null {
  if (ctx) return ctx;
  try {
    const g = globalThis as { AudioContext?: typeof AudioContext; webkitAudioContext?: typeof AudioContext };
    const Classe = g.AudioContext ?? g.webkitAudioContext;
    if (!Classe) return null;
    ctx = new Classe();
    return ctx;
  } catch {
    return null;
  }
}

function retomar(c: AudioContext): void {
  try {
    if (c.state !== 'running') void c.resume().catch(() => undefined);
  } catch {
    /* sem suporte */
  }
}

/**
 * Chamar dentro do toque em "Começar": cria ou retoma o AudioContext e prepara a voz.
 *
 * A sessão de áudio fica como 'ambient': os bipes e a voz se misturam com a música que já está tocando
 * (Spotify etc.) em vez de pausá-la. O tipo 'playback', usado antes, faz o iPhone parar a música do outro app
 * no primeiro toque. O preço é o bipe seguir a chave de silencioso do iPhone.
 * `voz: false` não prepara a voz (a musculação não fala; a fala muda também interrompe a música no iPhone).
 */
export function destravarAudio(opcoes: { voz?: boolean } = {}): void {
  try {
    if (typeof navigator !== 'undefined') {
      const nav = navigator as Navigator & { audioSession?: { type: string } };
      if (nav.audioSession) nav.audioSession.type = 'ambient';
    }
  } catch {
    /* sem audioSession */
  }
  try {
    const c = criarContexto();
    if (c) {
      retomar(c);
      // Um som inaudível dentro do toque garante que o iPhone libere o áudio para os bipes seguintes.
      const osc = c.createOscillator();
      const ganho = c.createGain();
      ganho.gain.value = 0.0001;
      osc.connect(ganho);
      ganho.connect(c.destination);
      osc.start();
      osc.stop(c.currentTime + 0.03);
    }
  } catch {
    /* sem WebAudio */
  }
  try {
    const synth = sintetizador();
    if (synth) {
      synth.getVoices(); // dispara o carregamento da lista de vozes
      if (opcoes.voz !== false && getState().settings.voz && !synth.speaking) {
        // Fala muda dentro do toque: libera a voz para as falas disparadas depois por cronômetro.
        const u = new SpeechSynthesisUtterance(' ');
        u.volume = 0;
        u.lang = 'pt-BR';
        synth.speak(u);
      }
    }
  } catch {
    /* sem voz */
  }
}

/** Uma nota curta com ataque e queda suaves (sem estalo). */
function nota(c: AudioContext, freq: number, inicio: number, dur: number, volume: number): void {
  const osc = c.createOscillator();
  const ganho = c.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(freq, inicio);
  ganho.gain.setValueAtTime(0.0001, inicio);
  ganho.gain.exponentialRampToValueAtTime(volume, inicio + 0.012);
  ganho.gain.setValueAtTime(volume, inicio + Math.max(0.013, dur - 0.06));
  ganho.gain.exponentialRampToValueAtTime(0.0001, inicio + dur);
  osc.connect(ganho);
  ganho.connect(c.destination);
  osc.start(inicio);
  osc.stop(inicio + dur + 0.03);
  osc.onended = () => {
    try {
      osc.disconnect();
      ganho.disconnect();
    } catch {
      /* já desconectado */
    }
  };
}

/** Bipe. curto: aviso · duplo: troca de passo · longo: começo ou fim de bloco · fim: três notas subindo. Respeita settings.som. */
export function bip(tipo: TipoBip = 'curto'): void {
  try {
    if (!getState().settings.som) return;
    const c = criarContexto();
    if (!c) return;
    retomar(c);
    const t = c.currentTime + 0.02;
    if (tipo === 'curto') {
      nota(c, 880, t, 0.14, 0.5);
    } else if (tipo === 'duplo') {
      nota(c, 880, t, 0.13, 0.5);
      nota(c, 880, t + 0.2, 0.13, 0.5);
    } else if (tipo === 'longo') {
      nota(c, 1175, t, 0.55, 0.5);
    } else {
      nota(c, 784, t, 0.16, 0.5);
      nota(c, 988, t + 0.18, 0.16, 0.5);
      nota(c, 1319, t + 0.36, 0.45, 0.5);
    }
  } catch {
    /* sem som */
  }
}

/** Bipe curto nos 3, 2 e 1 segundos finais (chame quando restam 3, 2 e 1). */
export function contagem(restam: number): void {
  if (restam === 3 || restam === 2 || restam === 1) bip('curto');
}

/* ------------------------------------------------------------------ */
/* Voz                                                                 */
/* ------------------------------------------------------------------ */

function sintetizador(): SpeechSynthesis | null {
  try {
    const g = globalThis as { speechSynthesis?: SpeechSynthesis; SpeechSynthesisUtterance?: unknown };
    if (!g.speechSynthesis || typeof g.SpeechSynthesisUtterance !== 'function') return null;
    return g.speechSynthesis;
  } catch {
    return null;
  }
}

/** Nomes de vozes brasileiras de boa qualidade, em ordem de preferência (iPhone, Chrome, Edge). */
const VOZES_PREFERIDAS = ['luciana', 'felipe', 'fernanda', 'google português do brasil', 'francisca', 'antonio', 'maria'];

/** A melhor voz pt-BR disponível; sem nenhuma, null (a fala segue só com lang = 'pt-BR'). */
function melhorVoz(synth: SpeechSynthesis): SpeechSynthesisVoice | null {
  let melhor: SpeechSynthesisVoice | null = null;
  let melhorNota = -1;
  for (const v of synth.getVoices()) {
    const lang = v.lang.replace('_', '-').toLowerCase();
    if (!lang.startsWith('pt')) continue;
    const nome = v.name.toLowerCase();
    let pontos = lang === 'pt-br' ? 100 : 10;
    const pos = VOZES_PREFERIDAS.findIndex((p) => nome.includes(p));
    if (pos >= 0) pontos += 30 - pos;
    if (/premium|enhanced|aprimorada|natural/.test(nome)) pontos += 20;
    if (v.localService) pontos += 5; // funciona sem internet
    if (pontos > melhorNota) {
      melhorNota = pontos;
      melhor = v;
    }
  }
  return melhor;
}

/** Fala o texto em português do Brasil. Respeita settings.voz; cancela a fala anterior; sem voz, não faz nada. */
export function falar(texto: string): void {
  try {
    if (!getState().settings.voz) return;
    const synth = sintetizador();
    const frase = texto.trim();
    if (!synth || frase === '') return;
    synth.cancel();
    const u = new SpeechSynthesisUtterance(frase);
    u.lang = 'pt-BR';
    const voz = melhorVoz(synth);
    if (voz) u.voice = voz;
    u.rate = 1;
    u.pitch = 1;
    u.volume = 1;
    synth.speak(u);
  } catch {
    /* falha em silêncio */
  }
}

/** Interrompe a fala em andamento. */
export function calar(): void {
  try {
    sintetizador()?.cancel();
  } catch {
    /* sem voz */
  }
}

/* ------------------------------------------------------------------ */
/* Vibração                                                            */
/* ------------------------------------------------------------------ */

/** Vibra (padrão: 60 ms). Respeita settings.vibrar; sem suporte (iPhone), não faz nada. */
export function vibrar(padrao: number | number[] = 60): void {
  try {
    if (!getState().settings.vibrar) return;
    if (typeof navigator === 'undefined' || typeof navigator.vibrate !== 'function') return;
    navigator.vibrate(padrao);
  } catch {
    /* sem vibração */
  }
}

/* ------------------------------------------------------------------ */
/* Tela ligada                                                         */
/* ------------------------------------------------------------------ */

let telaDesejada = false;
let trava: WakeLockSentinel | null = null;
let pedindo = false;
let ouvindoVisibilidade = false;

async function pedirTrava(): Promise<void> {
  if (pedindo || trava || !telaDesejada) return;
  if (typeof navigator === 'undefined' || !('wakeLock' in navigator) || !navigator.wakeLock) return;
  if (typeof document !== 'undefined' && document.visibilityState === 'hidden') return;
  pedindo = true;
  try {
    const t = await navigator.wakeLock.request('screen');
    if (!telaDesejada) {
      await t.release().catch(() => undefined);
      return;
    }
    trava = t;
    t.addEventListener('release', () => {
      // O sistema solta a trava quando o app sai da frente; ela é pedida de novo ao voltar.
      if (trava === t) trava = null;
    });
  } catch {
    /* negada (bateria fraca, por exemplo) ou sem suporte */
  } finally {
    pedindo = false;
  }
}

function ouvirVisibilidade(): void {
  if (ouvindoVisibilidade || typeof document === 'undefined' || typeof document.addEventListener !== 'function') return;
  ouvindoVisibilidade = true;
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && telaDesejada) void pedirTrava();
  });
}

/** Mantém a tela ligada (ou solta). Respeita settings.telaLigada; pede a trava de novo ao voltar ao app. Nunca rejeita. */
export async function manterTelaLigada(ligar: boolean): Promise<void> {
  try {
    telaDesejada = ligar && getState().settings.telaLigada;
    if (telaDesejada) {
      ouvirVisibilidade();
      await pedirTrava();
    } else if (trava) {
      const t = trava;
      trava = null;
      await t.release().catch(() => undefined);
    }
  } catch {
    /* sem suporte */
  }
}

/** Quantos componentes pedem a tela ligada agora (dois players podem se sobrepor numa troca de tela). */
let pedidosDeTela = 0;

/** Hook: mantém a tela ligada enquanto o componente estiver montado e `ativa === true`. */
export function useTelaLigada(ativa: boolean): void {
  useEffect(() => {
    if (!ativa) return undefined;
    pedidosDeTela += 1;
    void manterTelaLigada(true);
    return () => {
      pedidosDeTela = Math.max(0, pedidosDeTela - 1);
      if (pedidosDeTela === 0) void manterTelaLigada(false);
    };
  }, [ativa]);
}

/* ------------------------------------------------------------------ */
/* Relógio                                                             */
/* ------------------------------------------------------------------ */

/**
 * Hook: Date.now() atualizado a cada intervalo (padrão: 250 ms). Com a aba oculta o intervalo para; ao voltar,
 * o valor é corrigido na hora. Os cronômetros devem calcular o tempo por diferença de relógio, não por contagem.
 */
export function useAgora(intervaloMs = 250): number {
  const [agora, setAgora] = useState<number>(() => Date.now());
  useEffect(() => {
    const passo = Math.max(16, intervaloMs);
    let id: ReturnType<typeof setInterval> | undefined;
    const temDoc = typeof document !== 'undefined' && typeof document.addEventListener === 'function';
    const parar = (): void => {
      if (id !== undefined) clearInterval(id);
      id = undefined;
    };
    const iniciar = (): void => {
      parar();
      setAgora(Date.now());
      id = setInterval(() => setAgora(Date.now()), passo);
    };
    const aoMudar = (): void => {
      if (document.hidden) parar();
      else iniciar();
    };
    if (!temDoc || !document.hidden) iniciar();
    if (temDoc) document.addEventListener('visibilitychange', aoMudar);
    return () => {
      parar();
      if (temDoc) document.removeEventListener('visibilitychange', aoMudar);
    };
  }, [intervaloMs]);
  return agora;
}
