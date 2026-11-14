/**
 * Descanso entre séries da sessão guiada. O descanso é um intervalo de RELÓGIO (início e fim em epoch ms), guardado
 * em localStorage para sobreviver a recarregar a página, a fechar o app e à tela bloqueada. Não entra no registro
 * do treino (o documento `lifts` é o mesmo do Prumo).
 */
import { useEffect, useState } from 'preact/hooks';

export interface Descanso {
  /** Sessão a que o descanso pertence. */
  liftId: string;
  inicio: number;
  fim: number;
  /** O fim já foi avisado (bipe e vibração): não repete ao reabrir o app. */
  avisado: boolean;
}

const CHAVE = 'prumo-treino:mu-descanso';
/** Depois do fim, a barra "Bora" some sozinha passado este tempo. */
export const SOME_DEPOIS_MS = 15 * 60 * 1000;

let atual: Descanso | null | undefined;
const ouvintes = new Set<() => void>();

function lerDoDisco(): Descanso | null {
  try {
    const bruto = localStorage.getItem(CHAVE);
    if (!bruto) return null;
    const v = JSON.parse(bruto) as Partial<Descanso> | null;
    if (!v || typeof v.liftId !== 'string' || typeof v.inicio !== 'number' || typeof v.fim !== 'number') return null;
    return { liftId: v.liftId, inicio: v.inicio, fim: v.fim, avisado: v.avisado === true };
  } catch {
    return null;
  }
}

/** O descanso em curso (ou já vencido e ainda à vista); null quando não há. */
export function descansoAtual(): Descanso | null {
  if (atual === undefined) atual = lerDoDisco();
  return atual;
}

function definir(d: Descanso | null): void {
  atual = d;
  try {
    if (d) localStorage.setItem(CHAVE, JSON.stringify(d));
    else localStorage.removeItem(CHAVE);
  } catch {
    /* sem armazenamento: o descanso vale só enquanto a tela estiver aberta */
  }
  for (const fn of [...ouvintes]) fn();
}

export function iniciarDescanso(liftId: string, segundos: number, agora: number = Date.now()): void {
  definir({ liftId, inicio: agora, fim: agora + Math.max(1, segundos) * 1000, avisado: false });
}

export function encerrarDescanso(): void {
  if (descansoAtual()) definir(null);
}

/** Soma segundos ao descanso em curso. */
export function estenderDescanso(segundos: number): void {
  const d = descansoAtual();
  if (d) definir({ ...d, fim: d.fim + segundos * 1000 });
}

export function marcarAvisado(): void {
  const d = descansoAtual();
  if (d && !d.avisado) definir({ ...d, avisado: true });
}

/** Hook: o descanso da sessão `liftId` (descanso de outra sessão é ignorado). */
export function useDescanso(liftId: string | undefined): Descanso | null {
  const [, redesenhar] = useState(0);
  useEffect(() => {
    const fn = (): void => redesenhar((n) => n + 1);
    ouvintes.add(fn);
    return () => {
      ouvintes.delete(fn);
    };
  }, []);
  const d = descansoAtual();
  return d && liftId !== undefined && d.liftId === liftId ? d : null;
}
