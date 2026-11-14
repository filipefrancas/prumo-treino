/**
 * Datas do app. Tudo em horário LOCAL: uma data é sempre a string "AAAA-MM-DD" do calendário do aparelho.
 * Nunca use toISOString() para data (ele converte para UTC e pode cair no dia vizinho).
 */
import type { ISODate, Weekday } from '../types.ts';

export const DIAS_CURTOS: readonly string[] = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];
export const DIAS_LETRA: readonly string[] = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
export const DIAS_LONGOS: readonly string[] = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
export const MESES_CURTOS: readonly string[] = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
/** Nomes completos dos meses, em minúsculas ("novembro"). */
export const MESES_LONGOS: readonly string[] = [
  'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
  'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro',
];

const p2 = (n: number): string => String(n).padStart(2, '0');

/** Ano, mês (1 a 12) e dia de uma data "AAAA-MM-DD". Texto inválido vira NaN nos campos. */
function partes(s: ISODate): { a: number; m: number; d: number } {
  const r = /^(\d{4})-(\d{2})-(\d{2})/.exec(s);
  if (!r) return { a: NaN, m: NaN, d: NaN };
  return { a: Number(r[1]), m: Number(r[2]), d: Number(r[3]) };
}

/** Data local de um Date (nunca toISOString). */
export function toISO(d: Date): ISODate {
  return `${String(d.getFullYear()).padStart(4, '0')}-${p2(d.getMonth() + 1)}-${p2(d.getDate())}`;
}

/** Meia-noite local do dia. */
export function fromISO(s: ISODate): Date {
  const { a, m, d } = partes(s);
  return new Date(a, m - 1, d);
}

/** Confere se o texto é uma data "AAAA-MM-DD" que existe no calendário (auxiliar para validar arquivos). */
export function ehISO(s: unknown): s is ISODate {
  if (typeof s !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const d = fromISO(s);
  return !Number.isNaN(d.getTime()) && toISO(d) === s;
}

export function hoje(): ISODate {
  return toISO(new Date());
}

/** Soma dias pelo calendário (Date(ano, mês, dia + n)), sem errar em troca de horário de verão. */
export function addDias(s: ISODate, n: number): ISODate {
  const { a, m, d } = partes(s);
  return toISO(new Date(a, m - 1, d + Math.trunc(n)));
}

/** b − a, em dias inteiros de calendário. */
export function diffDias(a: ISODate, b: ISODate): number {
  const pa = partes(a);
  const pb = partes(b);
  // Em UTC todo dia tem 24 h: a diferença não sofre com horário de verão.
  return Math.round((Date.UTC(pb.a, pb.m - 1, pb.d) - Date.UTC(pa.a, pa.m - 1, pa.d)) / 86_400_000);
}

/** 0 = domingo … 6 = sábado. */
export function diaSemana(s: ISODate): Weekday {
  return fromISO(s).getDay() as Weekday;
}

/** A segunda-feira da semana de s (a semana vai de segunda a domingo). */
export function inicioSemana(s: ISODate): ISODate {
  const desdeSegunda = (diaSemana(s) + 6) % 7;
  return addDias(s, -desdeSegunda);
}

/** As 7 datas da semana de s, de segunda a domingo. */
export function semanaDe(s: ISODate): ISODate[] {
  const seg = inicioSemana(s);
  return [0, 1, 2, 3, 4, 5, 6].map((i) => addDias(seg, i));
}

/** "HH:MM" no horário local. */
export function agoraHM(d: Date = new Date()): string {
  return `${p2(d.getHours())}:${p2(d.getMinutes())}`;
}

/** curta (padrão): "qua 18 nov" · media: "18 de novembro" · longa: "quarta, 18 de novembro". */
export function fmtData(s: ISODate, estilo: 'curta' | 'media' | 'longa' = 'curta'): string {
  const d = fromISO(s);
  if (Number.isNaN(d.getTime())) return '';
  const dia = d.getDate();
  const mes = d.getMonth();
  const sem = d.getDay();
  if (estilo === 'media') return `${dia} de ${MESES_LONGOS[mes] ?? ''}`;
  if (estilo === 'longa') return `${DIAS_LONGOS[sem] ?? ''}, ${dia} de ${MESES_LONGOS[mes] ?? ''}`;
  return `${DIAS_CURTOS[sem] ?? ''} ${dia} ${MESES_CURTOS[mes] ?? ''}`;
}

/** "18/11". */
export function fmtDiaMes(s: ISODate): string {
  const { m, d } = partes(s);
  if (Number.isNaN(m) || Number.isNaN(d)) return '';
  return `${p2(d)}/${p2(m)}`;
}

/**
 * "hoje", "ontem", "amanhã", "há 3 dias" (de 2 a 6 dias atrás); fora disso, a data curta ("qua 18 nov").
 * `ref` é o dia de referência (padrão: hoje).
 */
export function fmtRelativa(s: ISODate, ref: ISODate = hoje()): string {
  const n = diffDias(s, ref);
  if (n === 0) return 'hoje';
  if (n === 1) return 'ontem';
  if (n === -1) return 'amanhã';
  if (n >= 2 && n <= 6) return `há ${n} dias`;
  return fmtData(s, 'curta');
}

/** "Bom dia" (até 11h59), "Boa tarde" (até 17h59), "Boa noite". */
export function saudacao(d: Date = new Date()): string {
  const h = d.getHours();
  if (h < 12) return 'Bom dia';
  if (h < 18) return 'Boa tarde';
  return 'Boa noite';
}

/** Idade em anos completos na data `em` (padrão: hoje). */
export function idade(nascimento: ISODate, em: ISODate = hoje()): number {
  const n = partes(nascimento);
  const e = partes(em);
  let anos = e.a - n.a;
  if (e.m < n.m || (e.m === n.m && e.d < n.d)) anos -= 1;
  return anos;
}
