/**
 * Plano da semana: junta a corrida do plano e a musculação de `settings.plano` na agenda de cada dia e resume a
 * semana. Funções puras sobre o estado.
 */
import type { AppState, Ficha, ISODate, RunWorkout } from '../types.ts';
import { contaComoFeito, fichaDoDia, fichaPorLetra, liftsFeitos } from './academia.ts';
import { type Situacao, corridasPorData, situacaoDoTreino, treinoDoDia } from './corrida.ts';
import { hoje, semanaDe } from './dates.ts';

export interface ItemDoDia {
  tipo: 'corrida' | 'musc';
  corrida?: RunWorkout;
  situacao?: Situacao;        // corrida
  ficha?: Ficha;              // musculação
  feito: boolean;
}

/**
 * Agenda do dia com a situação da corrida calculada em relação a `ref` (em vez de hoje). Corrida primeiro,
 * musculação depois. Em dia de musculação já feito, a ficha é a que foi feita de fato.
 */
export function agendaDoDiaEm(state: AppState, data: ISODate, ref: ISODate): ItemDoDia[] {
  const itens: ItemDoDia[] = [];
  const corrida = treinoDoDia(data);
  if (corrida) {
    const situacao = situacaoDoTreino(state, corrida, ref);
    itens.push({ tipo: 'corrida', corrida, situacao, feito: situacao === 'feito' });
  }
  const planejada = fichaDoDia(state.settings, state.lifts, data);
  if (planejada) {
    const feitoNoDia = state.lifts.find((l) => l.data === data && contaComoFeito(l));
    const ficha = (feitoNoDia ? fichaPorLetra(state.settings, feitoNoDia.ficha) : undefined) ?? planejada;
    itens.push({ tipo: 'musc', ficha, feito: feitoNoDia !== undefined });
  }
  return itens;
}

/** O que está planejado para a data: corrida do plano e musculação do plano da semana. Vazio = descanso. */
export function agendaDoDia(state: AppState, data: ISODate): ItemDoDia[] {
  return agendaDoDiaEm(state, data, hoje());
}

/** A agenda de cada dia da semana de `ref`, de segunda a domingo. */
export function agendaDaSemana(state: AppState, ref: ISODate): { data: ISODate; itens: ItemDoDia[] }[] {
  return semanaDe(ref).map((data) => ({ data, itens: agendaDoDia(state, data) }));
}

/**
 * Semana de `ref` em números: `planejados` são os itens da agenda; `corridas` são as corridas feitas na semana
 * (registros, mesmo fora do plano, e treinos marcados como feitos sem registro); `musc`, os treinos de
 * musculação concluídos; `feitos` = corridas + musc; `mobMin`, os minutos de mobilidade registrados.
 */
export function resumoDaSemana(state: AppState, ref: ISODate): { feitos: number; planejados: number; corridas: number; musc: number; mobMin: number } {
  const dias = semanaDe(ref);
  const noPeriodo = new Set(dias);
  let planejados = 0;
  for (const d of dias) planejados += agendaDoDia(state, d).length;
  const porData = corridasPorData(state);
  let corridas = 0;
  for (const d of dias) corridas += porData.get(d) ?? 0;
  const musc = liftsFeitos(state.lifts).filter((l) => noPeriodo.has(l.data)).length;
  let seg = 0;
  for (const m of state.mob) if (noPeriodo.has(m.data)) seg += m.seg;
  return { feitos: corridas + musc, planejados, corridas, musc, mobMin: Math.round(seg / 60) };
}
